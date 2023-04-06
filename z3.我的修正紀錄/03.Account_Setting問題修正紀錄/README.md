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

## 5. 將此介面再優化

一次都會開啟全部，修改全部，不夠符合使用者習慣

目標：

- 改成點擊一個按鈕，僅能開啟/儲存那一條，不影響其他行
- 可自由選擇開啟哪幾行，再儲存哪幾行

### 遇到的難題

computed無法用迴圈，因為computed本身會去監控變數

但我用for迴圈就變得多了個index參數，所以computed會變成不知道isEditing[i]是甚麼
```javascript=
// 可行
isEditing[0] = ref(false)
buttonState[0] = computed(() =>{
    console.log("isEditing[i]: ",isEditing[0])
    return isEditing[0].value ? 'Save' : 'Rename'
  })    
isEditing[1] = ref(false)
buttonState[1] = computed(() => (isEditing[1].value ? 'Save' : 'Rename'))    
isEditing[2] = ref(false)
buttonState[2] = computed(() => (isEditing[2].value ? 'Save' : 'Rename'))    
isEditing[3] = ref(false)
buttonState[3] = computed(() => (isEditing[3].value ? 'Save' : 'Rename')) 
```
```javascript=
// 變成動態增加數量就不可行了
for(var i=0;i<droneId.length;i++){
  isEditing[i] = ref(false)
  const a=isEditing
  console.log("isEditing[i]: ",isEditing[i].value)
  buttonState[i] = computed(() => {
    console.log("isEditing[i]: ",isEditing[i]) //undefined
    return isEditing[i] ? 'Save' : 'Rename'
  })    
}
```

在[這篇文](https://campus-xoops.tn.edu.tw/modules/tad_book3/html_all.php?tbsn=33#:~:text=%E8%8B%A5%E9%9C%80%E8%A6%81%E8%A8%88%E7%AE%97%E7%9A%84%E5%80%BC%E9%9C%80%E8%A6%81%E5%82%B3%E5%85%A5%E5%8F%83%E6%95%B8%EF%BC%8C%E5%89%87%E5%BB%BA%E8%AD%B0%E6%94%B9%E7%94%A8%E8%87%AA%E8%A8%82%E5%87%BD%E5%BC%8F%EF%BC%8C%E5%90%A6%E5%89%87%E9%83%BD%E5%BB%BA%E8%AD%B0%E7%94%A8computed%E3%80%82)中提到

    若需要計算的值需要傳入參數，則建議改用自訂函式，否則都建議用computed。

最後我也是使用自訂函式才成功

### **<font color="Red">問題5：修正項目</font>**

1. 修正原本存ref變數的droneIdEl陣列索引直接用id名稱造成陣列過大的問題
    
    - 解決方法：**`v-for 可以在指令處加入索引值 index`**
    
    ![](https://i.imgur.com/kAvybwI.jpg)
    
2. 改成點擊一個按鈕，僅能開啟/儲存那一條，不影響其他行；可自由選擇開啟哪幾行，再儲存哪幾行

    - buttonState、isEditing改成陣列形式，讓每一個輸入框和按鈕是唯一變數
    - 原本的相依變化用的是computed，這邊改成自定義變數
    - 
    ![](https://i.imgur.com/T9xsEzB.jpg)
    
    ![](https://i.imgur.com/oJ5zogA.jpg)

### 目前效果：
![](https://i.imgur.com/xZ0zzrt.gif)
