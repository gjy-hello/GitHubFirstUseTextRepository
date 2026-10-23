<template>
    <view class="page">
        <view class="paper-card login-card">
            <view class="seal">时光寄</view>
            <view class="title-script big-title">四载光阴 · 一纸相寄</view>
            <view class="intro">
                用一页纸，写下与老师的故事。<br/>
                每位老师只能看到属于你们的那一份。
            </view>
        </view>

        <view class="paper-card form-card">
            <view class="field">
                <text class="field-label">你的名字</text>
                <input class="field-input" v-model="nickName" placeholder="怎么称呼你" maxlength="20" />
            </view>
            <view class="divider-soft"></view>
            <view class="field">
                <text class="field-label">一句话</text>
                <input class="field-input" v-model="slogan" placeholder="现在的你是怎样的自己" maxlength="40" />
            </view>
        </view>

        <button class="btn-seal" open-type="getUserInfo" @click="login">
            开 始 写 下 这 封 信
        </button>

        <view class="wx-tip">
            点击即表示同意授权你的昵称与头像<br/>
            仅用于完善你的毕业档案卡
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import cloud from '@/utils/cloud.js'
import { store } from '@/utils/store.js'

const nickName = ref('')
const slogan = ref('')

const login = async () => {
    uni.showLoading({ title: '登录中' })
    const u = await cloud.loginByWx({ nickName: nickName.value || '少年·未命名' })
    uni.hideLoading()
    if (u) {
        uni.showToast({ title: '欢迎回来', icon: 'success' })
        setTimeout(() => uni.switchTab({ url: '/pages/home/home' }), 600)
    }
}

// 自动检测登录态（从其他页面返回时）
if (store.isLoggedIn()) {
    setTimeout(() => uni.switchTab({ url: '/pages/home/home' }), 100)
}
</script>

<style scoped>
.page {
    min-height: 100vh;
    padding: 80rpx 40rpx 80rpx;
    display: flex;
    flex-direction: column;
    gap: 28rpx;
}
.login-card { text-align: center; padding: 80rpx 36rpx; }
.seal { margin-bottom: 24rpx; }
.big-title {
    font-size: 40rpx;
    margin-bottom: 28rpx;
    letter-spacing: 6rpx;
}
.intro {
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    color: #8B6F47;
    font-size: 28rpx;
    line-height: 2;
}

.form-card { padding: 40rpx 32rpx; }
.field { display: flex; align-items: center; padding: 20rpx 0; }
.field-label {
    width: 160rpx;
    font-family: 'STKaiti', serif;
    font-size: 28rpx;
    color: #8B6F47;
    flex-shrink: 0;
}
.field-input { flex: 1; font-size: 28rpx; color: #4A3728; }
.divider-soft { height: 1rpx; background: rgba(139,111,71,0.12); }

.btn-seal {
    margin-top: 20rpx;
    background: #8B6F47;
    color: #F5ECD7;
    border-radius: 6rpx;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    font-size: 30rpx;
    letter-spacing: 12rpx;
    border: none;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
}
.btn-seal::after { border: none; }

.wx-tip {
    text-align: center;
    font-size: 22rpx;
    color: #B8A68B;
    line-height: 1.8;
    margin-top: 8rpx;
}
</style>
