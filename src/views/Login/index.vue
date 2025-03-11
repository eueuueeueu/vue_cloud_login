<template>
  <div class="w-screen h-screen bg-[#fdfbfc] p-[10px]">
    <div class="flex justify-between items-center">
      <span class="text-[#696969] text-[22px]"><</span>
      <span class="text-[#696969] text-[16px]">游客登录</span>
    </div>
    <img class="w-[130px] mx-auto mt-[7vh] mb-[5vh]" src="/logo.svg" alt="" />
    <div
      v-if="baseURL.code === 801 || baseURL.code === 800"
      class="mx-auto flex flex-col items-center"
    >
      <div class="w-[40vw] h-[40vw] relative">
        <img :src="baseURL.url" alt="" />
        <div
          v-if="baseURL.code === 800"
          class="absolute top-0 left-0 w-full h-full bg-[rgba(1,1,1,0.2)]"
        >
          <button
            @click="checkLogin(baseURL.key, 10)"
            class="text-white bg-[#fe4f33] rounded-xl w-[22vw] h-[8vw] absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
          >
            点击刷新
          </button>
        </div>
      </div>
      <p class="text-center my-[5vh]">
        使用 <a href="#" class="text-[#2c6aa1]">网易云音乐APP</a> 扫码登录
      </p>
    </div>
    <div v-if="baseURL.code === 802" class="mx-auto flex flex-col items-center">
      <img class="w-[40vw] h-[40vw]" src="/queding.png" alt="" />
      <p class="text-center my-[5vh]">扫描成功</p>
      <p class="text-center">请在手机上确认登录</p>
    </div>
    <img class="w-full absolute bottom-0 left-0" src="/bg-login.png" alt="" />
  </div>
</template>
<script setup>
import { ref, shallowRef } from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'https://netease-cloud-music-api-five-roan-88.vercel.app'
const baseURL = ref({
  key: null,
  url: null,
  code: null,
  cookie: null,
})
function checkLogin(key, count = 10) {
  axios
    .get(`/login/qr/check/api?key=${key}&noCookie=true&timestamp=${Date.now()}`)
    .then((res) => {
      if (count === 0) res.data.code = 800
      console.log('🚀 ~ .then ~ res.data.code:', res.data.code)
      switch (res.data.code) {
        case 803:
          console.log(res.data)
          console.log('登录成功')
          break
        case 800:
          baseURL.value.code = res.data.code
          console.log('二维码已过期')
          break
        case 802:
          console.log('待确认')
          baseURL.value.code = res.data.code
          setTimeout(checkLogin(key, --count), 1000)
          break
        case 801:
          console.log('扫码状态')
          baseURL.value.code = res.data.code
          setTimeout(checkLogin(key, --count), 1000)
          break
        default:
          break
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
function createQRCode(key) {
  axios
    .get(`/login/qr/create/api?key=${key}&qrimg=1`)
    .then((res) => {
      baseURL.value.url = res.data.data.qrimg
      baseURL.value.code = res.data.code
      checkLogin(key)
    })
    .catch((err) => {
      console.log(err)
    })
}
axios
  .get(`/login/qr/key/api&timestamp=${Date.now()}`)
  .then((res) => {
    let key = res.data.data.unikey
    baseURL.value.key = key
    createQRCode(key)
  })
  .catch((err) => {
    console.log(err)
  })
</script>
