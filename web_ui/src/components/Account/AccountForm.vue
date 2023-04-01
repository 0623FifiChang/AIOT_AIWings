<template>
  <div class="content__wrapper">
    <h1>Account Setting</h1>
    <a-divider />
    <a-input
      v-model:value="userInfo.email"
      class="content__input"
      size="large"
      addon-before="E-mail"
      :disabled="true"
      type="email"
    />
    <!-- <input ref="droneIdEl" type="text" name="" id="test" :value= "TEST"><p>{{TEST}}</p>
    <p>{{test}}</p> -->
    <div v-for="drone in droneId" :key="drone.id" class="droneId__wrapper">
      <!-- {{ drone.id }} -->
      <a-input
        :ref="el => {
          droneIdEl[drone.id]=el;
        }"
        v-model:value= "drone.id"
        
        size="large"
        addon-before="Drone ID"
        :disabled="!isEditing"
        :maxlength="20"
        type="text"
      />
      <!-- v-model:value= "drone.id" 綁定drone.id，【顯示效果： drone.id值 放到輸入框中】 -->
      <Button
        class="droneId__button"
        type="primary"
        html-type="button"
        :is-loading="isSubmitting"
        :button-name="buttonState"
        :click-handler="()=>handleDroneIdEdit(drone.id)"
      />
      <!-- 將drone.id作為參數放入 -->
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { computed, nextTick } from '@vue/runtime-core'
import socket from '../../lib/websocket'
import user from '../../services/user'
import Button from '../UI/Button.vue'
import { notification } from 'ant-design-vue'
export default {
  name: 'AccountForm',
  components: {
    Button
  },
  setup() {
    // const droneIdEl = ref(null) //創建一個ref物件，綁定到input上
    const droneIdEl = [] // 改成創建一個陣列，用來放回圈的各個輸入框的ref
    const store = useStore()
    const userInfo = computed(() => store.getters.getUserInfo)
    const buttonState = computed(() => (isEditing.value ? 'Save' : 'Rename'))
    const isEditing = ref(false)
    const isSubmitting = ref(false)
    const droneId = reactive(userInfo.value.droneId)
    // console.log('Account form: ',   droneId instanceof Array)

    console.log("store全域容器中拾取的:\ndroneId: ",droneId)

    const handleDroneIdEdit = async (id) => {
      console.log("---handleDroneIdEdit 函式---") 
      // console.log("droneIdEl輸入框元素: ",droneIdEl) 
      // console.log("droneIdEl輸入框元素: ",droneIdEl[1]) 
      // console.log("id: ",id)
      
      if (!isEditing.value) {
        isEditing.value = true
        await nextTick(()=>{
          console.log("nextTick執行，還不知道這個要幹嘛")
        })//nextTick()：數據更新後，DOM 非同步更新也完成後，才執行
        droneIdEl[id].focus() //.focus() 自動把游標移到此元件上，不須使用者再次操作
        return
      }
      droneIdEl[id].focus()

      console.log("使用者前端介面顯示的全部droneId: ",droneId)  //前端的droneId Array

      // Promise　【user.getUserInfo()回傳的是 Promise】
      // 用 user.getUserInfo() 直接到後端取得目前後端的使用者droneId資料
      user.getUserInfo()
        .then(async (res) => {
          const AllBackendID = res.data.droneId //使用者目前後端的droneId資料
          for(var i=0 ; i<AllBackendID.length; i++){
            if(AllBackendID[i].id != droneId[i].id){
              console.log(`第${i+1}行不同~~~`)
              // 修改後端、store state全域變數更改
              const { data } = await user.editUserDroneId({ //別忘了await
                droneId: droneId[i].id,
                originDroneId: AllBackendID[i].id
              })
              notification.success({ message: data.msg })
            }
          }
        })
        .catch((err)=>{
          console.log("在AccountForm.vue的user.getUserInfo()報錯: ",err)
        })


      // isSubmitting.value = true
      // if (droneId.value !== userInfo.value.droneId) {
      //   store.dispatch('setUserInfo', {
      //     ...userInfo.value,
      //     droneId: droneId.value
      //   })
      //   store.dispatch('setRabbitmqIsInit', false)
      //   socket.emit('cancel-consume')
      //   const { data } = await user.editUserDroneId({
      //     droneId: droneId.value,
      //     originDroneId: userInfo.value.droneId
      //   })
      //   notification.success({ message: data.msg })
      // }

      isEditing.value = false
      isSubmitting.value = false
    }

    const handleDroneIdEditCancel = () => {
      isEditing.value = false
      droneId.value = userInfo.value.droneId
    }

    return {
      buttonState,
      droneId,
      droneIdEl,
      isEditing,
      isSubmitting,
      userInfo,
      handleDroneIdEdit,
      handleDroneIdEditCancel
    }
  }
}
</script>

<style lang="scss" scoped>
.content__wrapper {
  padding-top: 3rem;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 15px;

  .content__input {
    margin-bottom: 2rem;
  }

  .droneId__wrapper {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin: 5px;

    .droneId__button {
      margin-left: 5px;
    }
  }
}
</style>
