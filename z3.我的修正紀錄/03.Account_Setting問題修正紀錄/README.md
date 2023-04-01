###### tags: `aiwings` `vue`

# Account_Setting問題修正紀錄

## 4. 此介面無法做修改

無法對已有Drone做任何更改

<img src="https://i.imgur.com/nCHGcGa.png" width = "50%" /><img src="https://i.imgur.com/EpRvixe.png" width = "50%" />

### **<font color="Red">問題4：解決方法</font>**
    
1. 點擊按鈕後，能自動聚焦在同一行的輸入框上

    - ref改為動態
    - 讓點擊按鈕後進入的函式可以放入參數

`./AccountForm.vue`

```html
  <div v-for="drone in droneId" :key="drone.id" class="droneId__wrapper">
    <!-- {{ drone.id }} -->      
    <a-input
      :ref="el => {
        droneIdEl[drone.id]=el;
      }"
      
      

    />     
     <!-- ref改為動態  -->
    <Button
      
      


      :click-handler="()=>handleDroneIdEdit(drone.id)"
    />
    <!-- 將drone.id作為參數放入 -->
  </div>
<!-- 中間其他參數略 -->
```

2. 修改前端droneId並儲存後，後端跟著改變

    - 用user.getUserInfo直接取得後端資料，與store目前的資料(前端)比較
    - 修改後端 user.ts 的 editUserDroneId() 中的sql語法

`前端 ./AccountForm.vue`
![](https://i.imgur.com/bqB5ugW.jpg)

    
`後端 ./user.ts`
![](https://i.imgur.com/V5aV4xH.jpg)

```js
  let sql =
    "UPDATE drones  SET drones.drone_id = ?  WHERE drones.user_id = UUID_TO_BIN(?) AND (drones.drone_id= ?);"
  //要把 uuid 轉回 bin 才能在 mysql 中搜尋到結果
```

![](https://i.imgur.com/wRGWddA.jpg)

### 目前效果：

![](https://i.imgur.com/1jAxLGe.gif)
