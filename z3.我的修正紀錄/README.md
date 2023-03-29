# 我的修正紀錄

## 1. 註冊失敗導致後端server停止問題

當用戶預註冊的email為已註冊email，會出現問題：

>1. **後端停止並報錯誤訊息**
>2. **而且email依舊會註冊到後端，形成多個相同email的註冊資料**

找了許久才找到程式停止在後端./src/services/auth.ts這個文件的signup()

--註冊程式流程--

前端輸入註冊資料後，將資料透過js傳遞到後端網址，再執行此網址對應的執行函式: auth.signup()

`前端`

./src/components/Signup/`SignupForm.vue`

```js
import auth from '../../services/auth'
// 當用戶點擊送出註冊資料(formData)後，首先將先連上後端database確認是否可註冊
const { data } = await auth.signup(formData)
```

./src/service/`auth.js`

```js
async signup(payload) {
    // 將資料(payload = formData)丟到後端/auth/signup中
    return await axios.post('/auth/signup', payload)
}
```

`後端`:

./src/routes/

```js
router.post("/auth/signup", auth.signup);
// 前端若連上網址：" server根網址/auth/signup "，會執行後方的auth.signup函式
```

./src/services/auth.ts

```js
async signup(req: Request, res: Response) {
    /* 前面先判斷註冊資料是否完整且符合規範 */

    /* 確認資料完整後開始連上database，確認此註冊email是否已存在，若已存在則退出 */
    // "SELECT email FROM user WHERE email=?"

    /** 以下是原本有問題的寫法【程式碼為下方的截圖】 */
    
}
```

![image](./%E6%88%AA%E5%9C%96_%E6%88%91%E7%9A%84%E4%BF%AE%E6%AD%A3%E7%B4%80%E9%8C%84/001.jpg)

### 重新來過後遇到的問題

1. **只要一註冊必定後端掛掉**
2. **多個相同email的註冊資料**

#### 問題1-1 說明

- **只要一註冊必定後端掛掉**：重新來過後發現不知為何變成「只要一註冊必定後端掛掉」，但卻是能成功修改後端的
(想起來之前好像遇過這個error，但後來莫名其妙我也沒幹嘛就自己好了)

![image](./%E6%88%AA%E5%9C%96_%E6%88%91%E7%9A%84%E4%BF%AE%E6%AD%A3%E7%B4%80%E9%8C%84/017.png)

#### 問題1-2 說明

- **多個相同email的註冊資料**：server重啟後，試著再次signup相同的email，雖然會顯示Email exist，但結果卻是居然還是會註冊，造成多個相同email的註冊資料

```cmd
報錯訊息：
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

![image](./%E6%88%AA%E5%9C%96_%E6%88%91%E7%9A%84%E4%BF%AE%E6%AD%A3%E7%B4%80%E9%8C%84/018.png)<br>
![image](./%E6%88%AA%E5%9C%96_%E6%88%91%E7%9A%84%E4%BF%AE%E6%AD%A3%E7%B4%80%E9%8C%84/019.png)

查了資料說是和res.send過多等原因造成

- [在 JS 中發送到客戶端后無法設置標頭原因](https://bobbyhadz.com/blog/javascript-error-cannot-set-headers-after-they-are-sent-to-client)
- [Node.js —— express中 res.json( )和 res.send( )](https://blog.csdn.net/starter_____/article/details/79068894)

找了許就發現原來是因為原本的寫法在當email已存在時，即使在44行成功return退出，仍舊會執行67行的：

```js
await insert_user(); 
```

導致當email已存在時，會回傳多個res.status()【 **43行、73行的 res.status()**】

造成 Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

#### **<font color="Red">問題1-2 解決</font>**

使用 **<font color="Red">if-else</font>** 邏輯避免

![image](./%E6%88%AA%E5%9C%96_%E6%88%91%E7%9A%84%E4%BF%AE%E6%AD%A3%E7%B4%80%E9%8C%84/021.png)
![image](./%E6%88%AA%E5%9C%96_%E6%88%91%E7%9A%84%E4%BF%AE%E6%AD%A3%E7%B4%80%E9%8C%84/020.png)

後端不會被迫停止了，email也沒有重複註冊

---
一開始的寫法

![image](./%E6%88%AA%E5%9C%96_%E6%88%91%E7%9A%84%E4%BF%AE%E6%AD%A3%E7%B4%80%E9%8C%84/004.jpg)
![image](./%E6%88%AA%E5%9C%96_%E6%88%91%E7%9A%84%E4%BF%AE%E6%AD%A3%E7%B4%80%E9%8C%84/005.jpg)
![image](./%E6%88%AA%E5%9C%96_%E6%88%91%E7%9A%84%E4%BF%AE%E6%AD%A3%E7%B4%80%E9%8C%84/006.jpg)

---
