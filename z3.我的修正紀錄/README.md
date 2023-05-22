###### tags: `aiwings` `vue`

# 本次修改紀錄

## 優化程式碼

原本：
![](https://hackmd.io/_uploads/Bkqh1s1H3.png)

後來：
```javascript
// 用await和括號取出promise資料
const backendUserData = (await user.getUserInfo()).data
```
![](https://hackmd.io/_uploads/SkoVzjJHh.png)

---
## 優化程式碼：搜尋dronid副函式另建立

程式碼優化：把搜尋droneID的程式碼從後端 user.ts 的 addNewDrone() 中提出，放到 database.ts 中，再import回user.ts使用

`後端`

原本：
user.ts 中的 addNewDrone()很長
![](https://hackmd.io/_uploads/HyT4a2VBh.png)

修改後：
database.ts 中新增 select_droneId()
![](https://hackmd.io/_uploads/BJFFyTVSn.png)

user.ts
![](https://hackmd.io/_uploads/SyNb034S2.png)

user.ts中的 addNewDrone()
![](https://hackmd.io/_uploads/SJs-Rh4B2.png)

---

## 6 嘗試將各個droneID功能合併

將Enroll組件放到AccountFrom組件中

發現問題：
1. 新增id，或者刪除id後，id列的顯示不會跟著增加或減少，要手動網頁刷新才會顯示正確的
2. 更新id名稱時，如果變更的名字是已存在的id名，儲存後就會變成有重複的id名稱存在【邏輯錯誤】

### 解決問題1：
- 問題點：
    store出現問題，好像是在新增id那邊出現的問題，新增時把store中全部的id覆蓋掉了，變成只有新增的id

    Enroll.vue
    ![](https://hackmd.io/_uploads/HJ4EAyZrn.png)

    src/store/index.js
    ![](https://hackmd.io/_uploads/SJJiR1-S3.png)

    
- 解決：讓新增的id是新增到Store中，而不是覆蓋掉它，
    
    `src/store/index.js`：新增 **`addNewDroneID(state,payload)`** 和 **`deleteDroneID(state,payload)`** 到 store 的 mutations 中
    
    addNewDroneID功能：新增id到全域state中
    ![](https://hackmd.io/_uploads/rk4QTxZHh.png)
    
    deleteDroneID功能：刪除state中的指定id
    1. `使用fliter完成`：【最後採用這個】
    
    使用fliter取出要刪除的id以外的，但是由於取出資料的型態不同【fliter取出的每一項id都是一個proxy，但droneID是包含所有id的一個proxy】，所以取出的新陣列暫存到temp中，再一項項放進droneID中覆蓋，最後droneID會多一項，這一項再用pop移除
    ![](https://hackmd.io/_uploads/SkMssBGrh.png)
    ![](https://hackmd.io/_uploads/HkXpTrfS3.png)

    2. 或 `使用push、pop方法完成`
    
    ![](https://hackmd.io/_uploads/rJ2x5BGBn.png)

    
    `Enroll.vue`：用addNewDroneID來新增id
    修正bug：輸入的第二個參數不是droneId，而是drone，一次只放一個新id到store中
    ![](https://hackmd.io/_uploads/ByBYrg-S2.png)
    新增 **`deleteDroneID(state,payload)`** 到 store 的 mutations 中
    
    `AccountFrom.vue`：
    - 為了能響應刪除的變化，在deleteDrone()中，新增：修改全域store的程式碼
    ![](https://hackmd.io/_uploads/SJp4NHMrn.png)
    
    - 動態新增id列：使用 **`watch`** 響應式監聽器
      用watch監聽droneId時，由於droneId`屬於reactive響應式數據`，所以監聽droneId時，oldvalue無法正確獲取，只能獲得新數據。所以這裡只監聽newValue，舊值長度用isEditing原本的長度來替代
        用 `for(舊值長度~新值長度)` 來響應式增加buttonState 和 isEditing的初始化
        ![](https://hackmd.io/_uploads/Hk1UQwmrn.png)
    
### 解決問題2：更新id名稱會出現重複id的問題

- 問題描述：修改id時，如果更新的id為已存在id，按下Save後，後端資料庫就變成有重複相同的id

- 解決:
    - 後端：在修改id前，先確認資料庫中是否已存在此id，
    - 前端：
        - 如果修改前後的id相同，值接Save並關閉input輸入許可
        - 如果修改後的id和修改前不同：通知後端修改id
            - 如果修改後的id已存在：前端跳出已存在的通知
            - 如果修改後的id不存在：前端跳出已更新的通知，並關閉input輸入許可

- 後端
  
  `user.ts 的 editUserDroneId`
  在修改id前，先確認資料庫中是否已存在此id
  ![](https://hackmd.io/_uploads/rJ7Kd1rr3.png)

- 前端
  
  `AAccountFrom.vue 的 AhandleDroneIdEdit()`
  ![](https://hackmd.io/_uploads/S1KG9krS2.png)

    
    
    
    


    