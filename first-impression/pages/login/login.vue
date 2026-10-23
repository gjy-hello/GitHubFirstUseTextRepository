<template>
    <view class="page">
        <!-- Logo 区 -->
        <view class="logo-area">
            <view class="logo-wrap">
                <text class="logo-icon">🌻</text>
            </view>
            <text class="app-title">第一印象</text>
            <text class="app-slogan">温柔生活，从第一眼开始</text>
        </view>

        <!-- 表单区 -->
        <view class="form-card">
            <view class="form-item">
                <text class="form-label">手机号</text>
                <input
                    class="form-input"
                    type="number"
                    v-model="phone"
                    placeholder="请输入手机号"
                    maxlength="11"
                />
            </view>
            <view class="divider"></view>
            <view class="form-item">
                <text class="form-label">昵称</text>
                <input
                    class="form-input"
                    v-model="nickName"
                    placeholder="给自己取个温柔的名字"
                    maxlength="20"
                />
            </view>
        </view>

        <!-- 登录按钮 -->
        <view class="login-btn" @click="doLogin">登 录</view>

        <!-- 微信授权登录（按钮形态，mock） -->
        <view class="wx-btn" @click="doLoginWithWx">
            <text class="wx-icon">💚</text>
            <text>微信一键登录</text>
        </view>

        <!-- 协议 -->
        <view class="agreement">
            <view class="checkbox" :class="{ checked: agree }" @click="agree = !agree">
                <text v-if="agree">✓</text>
            </view>
            <text class="agr-text">我已阅读并同意</text>
            <text class="agr-link">《用户协议》</text>
            <text class="agr-text">和</text>
            <text class="agr-link">《隐私政策》</text>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import store from '@/utils/store.js'

const phone = ref('')
const nickName = ref('')
const agree = ref(false)

const doLogin = async () => {
    if (!agree.value) {
        uni.showToast({ title: '请先同意用户协议', icon: 'none' })
        return
    }
    if (!phone.value) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
    }
    uni.showLoading({ title: '登录中...' })
    const user = await store.login({
        phone: phone.value,
        nickName: nickName.value || '温柔的你'
    })
    uni.hideLoading()
    if (user) {
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 800)
    } else {
        uni.showToast({ title: '登录失败', icon: 'none' })
    }
}

const doLoginWithWx = () => {
    if (!agree.value) {
        uni.showToast({ title: '请先同意用户协议', icon: 'none' })
        return
    }
    // 模拟微信授权登录
    store.login({ nickName: '微信用户_' + Math.floor(Math.random() * 1000) })
    uni.showToast({ title: '授权成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
}
</script>

<style scoped>
.page {
    min-height: 100vh;
    padding: 60rpx 48rpx;
    box-sizing: border-box;
    background: linear-gradient(180deg, #FFF8EC 0%, #FFFAF3 40%);
}
.logo-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80rpx;
    margin-bottom: 80rpx;
}
.logo-wrap {
    width: 140rpx; height: 140rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFB347, #FF8C42);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12rpx 32rpx rgba(255,140,66,0.35);
    margin-bottom: 24rpx;
}
.logo-icon { font-size: 72rpx; }
.app-title {
    font-size: 44rpx;
    font-weight: 700;
    color: #5D4037;
    letter-spacing: 4rpx;
}
.app-slogan {
    font-size: 26rpx;
    color: #B0A18A;
    margin-top: 10rpx;
}

.form-card {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 0 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(255,179,71,0.08);
    margin-bottom: 40rpx;
}
.form-item {
    display: flex;
    align-items: center;
    height: 110rpx;
}
.form-label {
    font-size: 28rpx;
    color: #5D4037;
    width: 120rpx;
    flex-shrink: 0;
}
.form-input {
    flex: 1;
    font-size: 28rpx;
    color: #5D4037;
}
.divider { height: 1rpx; background: #F0E6D8; }

.login-btn {
    background: linear-gradient(135deg, #FFB347, #FF8C42);
    color: #FFFFFF;
    border-radius: 48rpx;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
    box-shadow: 0 8rpx 24rpx rgba(255,140,66,0.35);
    margin-bottom: 32rpx;
    letter-spacing: 8rpx;
}

.wx-btn {
    background: #FFFFFF;
    border: 2rpx solid #81C784;
    color: #66BB6A;
    border-radius: 48rpx;
    height: 88rpx;
    line-height: 84rpx;
    text-align: center;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.wx-icon { margin-right: 10rpx; font-size: 32rpx; }

.agreement {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 48rpx;
    padding: 0 24rpx;
}
.agreement .checkbox {
    width: 32rpx; height: 32rpx;
    border: 2rpx solid #D7CCC8;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 20rpx;
    color: transparent;
    margin-right: 8rpx;
}
.agreement .checkbox.checked {
    background: #FFB347;
    border-color: #FFB347;
    color: #FFFFFF;
}
.agr-text { font-size: 22rpx; color: #B0A18A; }
.agr-link { font-size: 22rpx; color: #FF8C42; }
</style>
