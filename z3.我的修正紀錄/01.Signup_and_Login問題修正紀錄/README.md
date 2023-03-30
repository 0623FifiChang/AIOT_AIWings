# Signup_and_Login問題修改記錄

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

![](https://i.imgur.com/CQayLxT.jpg)


### 重新來過後遇到的問題

1. **只要一註冊必定後端掛掉**
2. **多個相同email的註冊資料**

#### 問題1-1 說明

- **只要一註冊必定後端掛掉**：重新來過後發現不知為何變成「只要一註冊必定後端掛掉」，但卻是能成功修改後端的
(想起來之前好像遇過這個error，但後來莫名其妙我也沒幹嘛就自己好了)

![](https://i.imgur.com/dhC5Hq4.png)

【發現莫名其妙好的原因是只要server重啟後登入過一次，它就不會有問題？？？】

還不確定是哪裡會進入user.ts的 getUserInfo()涵式，結果**因為user還沒註冊進資料庫所以搜不到任何結果放入userInfo導致報錯**

#### **<font color="Red">問題1-1 解決</font>**

因為莫名其妙好了尚無法解決

#### 問題1-2 說明

- **多個相同email的註冊資料**：server重啟後，試著再次signup相同的email，雖然會顯示Email exist，但結果卻是居然還是會註冊，造成多個相同email的註冊資料

```cmd
報錯訊息：
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

![](https://i.imgur.com/nzu3ooJ.png)
![](https://i.imgur.com/SyUTy3E.png)

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

![](https://i.imgur.com/UHkukQF.png)
![](https://i.imgur.com/kQermEK.png)

後端不會被迫停止了，email也沒有重複註冊

---
一開始的寫法

![](https://i.imgur.com/Q4kddKm.jpg)
![](https://i.imgur.com/xTaouNL.jpg)
![](https://i.imgur.com/ywhnQqJ.jpg)

---

## 2. 登入錯誤時，後端被迫停止

- **登入時，如果輸入不存在的用戶email，前端會卡住**

![](https://i.imgur.com/2NqY5rp.png)

![](https://i.imgur.com/dyIsrCa.png)

--登入程式流程--

前端輸入註冊資料後，將資料透過js傳遞到後端網址，再執行此網址對應的執行函式: auth.login()

`前端`

./src/components/Login/`LoginForm.vue`

```js
import auth from '../../services/auth'
// 當用戶點擊送出註冊資料(formData)後，首先將先連上後端database確認是否可登入
const { data } = await auth.login(formData)
```

./src/service/`auth.js`

```js
async signup(payload) {
    // 將資料(payload = formData)丟到後端/auth/login中
    return await axios.post('/auth/login', payload)
}
```

`後端`:

./src/routes/

```js
router.post("/auth/login", auth.login);
// 前端若連上網址：" server根網址/auth/login "，會執行後方的 auth.login 函式
```

./src/services/auth.ts

```js
async login(req: Request, res: Response) {
    /* 前面先判斷使用者是否都有輸入email, password */

    /* 確認資料完整後開始連上database，搜尋此email對應的 UUID, email, password*/
    // SELECT BIN_TO_UUID(id) id, email, password FROM user WHERE email=?

    /** 針對查詢結果做的一些判斷【下面截圖】 */    
}
```

![](https://i.imgur.com/4OBUm3l.png)
如果登入email不存在，則會回傳空直
![](https://i.imgur.com/EARv2pU.png)

研究後發現。當select_user()回傳結果後，若為空值，下面的仍會繼續執行，所以後面抓不到值就產生err，進到
catch(error){
    res.status(500).json({ msg: "Internal server error" });
}

### **<font color="Red">問題2：解決方法</font>**

和signup一樣加上 if-else 的邏輯判斷

增加email用戶存不存在的條件判斷

![](https://i.imgur.com/Ank6FI0.png)

>res.status(401) ：【4xx 代表的是客戶端的錯誤】
res.status(500) ： Internal Server Error，會停在畫面？【5xx 代表的是伺服器端的錯誤】

修改結果：前端不會卡住了(login按鈕不再繞圈圈)
![](https://i.imgur.com/VhzApUW.png)

---

### 之前第一次嘗試時也是類似的問題，就是多了個後端會關閉問題

- **登入時，如果輸入不存在的用戶email，前端會卡住(http錯誤碼500)，如果重整，後端直接被迫關閉**

輸入不存在的用戶email >> 前端會卡住【後端報錯】
![](https://i.imgur.com/I1tbUyf.png)

![](https://i.imgur.com/JNX3orb.png)
這時前端重整，後端直接被迫關閉
![](https://i.imgur.com/xz3vtVP.jpg)

### 解決方法

同問題2解決方法，然後後端關閉問題就一起解決了???

---
