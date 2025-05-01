import { createSlice } from "@reduxjs/toolkit";
import { loginAPI } from "@/apis/user.js";

const userStore = createSlice({
  name: "user",
  initialState:{
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload
      localStorage.setItem('refreshToken', action.payload)
      console.log('设置refreshtoken');
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },
    clearUserInfo(state) {
      state.token = ''
      state.refreshToken = ''
      state.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
    }
  }
})

const { setToken, setRefreshToken, setUserInfo ,clearUserInfo } = userStore.actions

const userReducer = userStore.reducer

const fetchLogin = (loginForm) =>{
  return async (dispatch)=>{
    const res = await loginAPI(loginForm)
    if(res.status===200) {
      // dispatch(setToken(res.data.token))
      const userInfo = {
        id: res.data.id,
        userName: res.data.userName,
        balance: res.data.balance,
        account: res.data.account,
      }
      dispatch(setUserInfo(userInfo))
    }
    return res
  }
}

export { setToken, setRefreshToken, fetchLogin, clearUserInfo }

export default userReducer