/**
 * Auth APIs
 *
 * - Sign up
 * - Sign in
 * - Refresh token (every 4 minutes)
 * - Log out
 */
import axios from '../lib/axios'

export default {
  async signup(payload) {
    console.log(" payload= ",payload,"\n進入async signup(payload)函式以進入後端將payload資料進行註冊" )
    return await axios.post('/auth/signup', payload)
    // await axios.post('/auth/signup', payload)
    // .then(function (response) {
    //   // 处理成功情况
    //   console.log("return await axios.post('/auth/signup', payload)成功\n",response);
    //   return response;
    // })
    // .catch(function (error) {
    //   // 处理错误情况
    //   console.log("return await axios.post('/auth/signup', payload)失敗:\n",error);
    //   return
    // }) 
  },
  async login(payload) {
    console.log(" payload= ",payload,"\n進入async login(payload)函式以進入後端比對payload資料，判斷是否可登入" )
    return await axios.post('/auth/login', payload)
  },
  async refreshToken() {
    await axios.get('/auth/token')
  },
  async logout() {
    await axios.post('/auth/logout')
  }
}
