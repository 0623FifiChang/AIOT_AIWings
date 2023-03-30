###### tags: `aiwings` `vue`
# Add_Drones問題修正紀錄

## 3. Add Drone的時候，即使是重複ID一樣會增加，導致重複ID出現

按下Submit後，會將上方add droneID的所有ID加入資料庫

且因為原本submit後，已經提交的ID仍會保留在介面中，如果沒有把原本已提交的ID刪掉，新增新的ID後直接連已提交的ID一起submit，就會把原本的ID再新增一次

![](https://i.imgur.com/AFucMqi.jpg)
![](https://i.imgur.com/J854ioW.jpg)
錯誤：資料庫會出現兩個1111【沒截圖到】

--程式流程--

`前端`

Enroll.vue

→ 按下submit按鈕後會執行 submitForm()

→ 執行此程式碼，將連接到後端進行新增id進行新增droneId的動作

```js
const { data } = await user.enrollDroneId({ droneId: droneId })
/* 此函式的執行內容在user.js */
```

user.js

→ 前面的程式碼即是要執行以下動作連上後端

```js
async enrollDroneId(droneId) {
  return await axios.post('/user/drones', droneId)
}
```

`後端`

後端 router/v1/index.js

→ 只要連上後端網址，就會執行相對應的動作
此處是連上後端的/user/droneId網址後，會先執行verifyTokens確認token，再執行user.editUserDroneId

```js
router.post("/user/drones", verifyTokens, user.addNewDrone);
```

後端 user.ts

→ 再資料庫新增droneId【**就是此處有問題**】

![](https://i.imgur.com/z5lPhU7.png)

### **<font color="Red">問題3：解決方法</font>**

1. **先判斷droneId是否已存在**：新增 select_droneId( droneId ) 函式
2. 優化 — **不重複開啟db**：將 let conn = await db(); 拉到外側

![](https://i.imgur.com/ni3yzD3.png)
![](https://i.imgur.com/KUrS8xy.png)
![](https://i.imgur.com/Oz8nwzD.png)

結果

！**不會重複新增droneId了**！

![](https://i.imgur.com/uNjE4uO.png)
![](https://i.imgur.com/lXgjQRF.png)

