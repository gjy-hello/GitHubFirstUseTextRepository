<template>
    <view class="page">
        <!-- 未登录 -->
        <view v-if="!isLogin">
            <view class="header-card">
                <view class="header-bg"></view>
                <view class="login-entry" @click="goLogin">
                    <view class="avatar">
                        <text class="avatar-icon">👤</text>
                    </view>
                    <view class="login-info">
                        <text class="login-title">点击登录 / 注册</text>
                        <text class="login-sub">享受更多专属福利</text>
                    </view>
                    <text class="arrow">›</text>
                </view>
            </view>
        </view>

        <!-- 已登录 -->
        <view v-else>
            <view class="header-card">
                <view class="header-bg"></view>
                <view class="user-info">
                    <image class="avatar" :src="userInfo.avatarUrl" mode="aspectFill" />
                    <view class="info-right">
                        <text class="nick-name">{{ userInfo.nickName }}</text>
                        <text class="user-phone">{{ userInfo.phone }}</text>
                    </view>
                </view>
                <view class="logout-btn" @click="doLogout">退出</view>
            </view>

            <!-- 订单模块 -->
            <view class="card order-module">
                <view class="order-header">
                    <text class="order-title">我的订单</text>
                    <text class="order-all">全部订单 ›</text>
                </view>
                <view class="order-status">
                    <view class="status-item" v-for="s in orderStatus" :key="s.name">
                        <text class="status-icon">{{ s.icon }}</text>
                        <text class="status-name">{{ s.name }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 功能列表 -->
        <view class="card func-list">
            <view class="func-item" v-for="f in funcs" :key="f.name" @click="onFunc(f)">
                <text class="func-icon">{{ f.icon }}</text>
                <text class="func-name">{{ f.name }}</text>
                <text class="arrow">›</text>
            </view>
        </view>

        <view class="tip">第一印象 · 让生活多一点温柔</view>
    </view>
</template>

<script setup>
import { ref, computed, onShow } from '@dcloudio/uni-app'
import store from '@/utils/store.js'

const isLogin = ref(false)
const userInfo = ref(null)

const refresh = () => {
    isLogin.value = store.isLoggedIn()
    userInfo.value = store.getUserInfo()
}

onShow(refresh)

const orderStatus = [
    { name: '待付款', icon: '💳' },
    { name: '待发货', icon: '📦' },
    { name: '待收货', icon: '🚚' },
    { name: '已完成', icon: '✅' }
]

const funcs = [
    { name: '收货地址', icon: '📍' },
    { name: '我的收藏', icon: '❤️' },
    { name: '优惠券', icon: '🎟️' },
    { name: '联系客服', icon: '💬' },
    { name: '关于我们', icon: 'ℹ️' }
]

const goLogin = () => uni.navigateTo({ url: '/pages/login/login' })
const doLogout = () => {
    uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
            if (res.confirm) {
                store.logout()
                refresh()
                uni.showToast({ title: '已退出登录', icon: 'none' })
            }
        }
    })
}
const onFunc = (f) => uni.showToast({ title: f.name + ' 功能开发中', icon: 'none' })
</script>

<style scoped>
.page {
    padding: 20rpx 20rpx 120rpx;
    min-height: 100vh;
}
.header-card {
    position: relative;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 16rpx rgba(255,179,71,0.15);
}
.header-bg {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 280rpx;
    background: linear-gradient(135deg, #FFB347, #FF8C42);
}
.login-entry, .user-info {
    position: relative;
    padding: 60rpx 32rpx 48rpx;
    display: flex;
    align-items: center;
}
.avatar {
    width: 120rpx; height: 120rpx;
    border-radius: 50%;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4rpx solid rgba(255,255,255,0.6);
}
.avatar-icon { font-size: 56rpx; }
.login-info, .info-right {
    flex: 1;
    margin-left: 24rpx;
}
.login-title, .nick-name {
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: 600;
    display: block;
}
.login-sub, .user-phone {
    color: rgba(255,255,255,0.85);
    font-size: 24rpx;
    margin-top: 8rpx;
    display: block;
}
.arrow {
    color: rgba(255,255,255,0.8);
    font-size: 44rpx;
}
.logout-btn {
    position: absolute;
    top: 40rpx; right: 32rpx;
    color: #FFFFFF;
    font-size: 24rpx;
    border: 1rpx solid rgba(255,255,255,0.6);
    border-radius: 24rpx;
    padding: 6rpx 24rpx;
}

.order-module { padding: 24rpx; }
.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
}
.order-title { font-size: 30rpx; font-weight: 600; color: #5D4037; }
.order-all { font-size: 24rpx; color: #B0A18A; }
.order-status { display: flex; }
.status-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.status-icon { font-size: 44rpx; margin-bottom: 8rpx; }
.status-name { font-size: 22rpx; color: #8D6E63; }

.func-list { padding: 0 24rpx; }
.func-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    border-bottom: 1rpx solid #F5EDE0;
}
.func-item:last-child { border-bottom: none; }
.func-icon { font-size: 36rpx; margin-right: 20rpx; }
.func-name { flex: 1; font-size: 28rpx; color: #5D4037; }
.func-item .arrow {
    color: #B0A18A;
    font-size: 32rpx;
}

.tip {
    text-align: center;
    color: #B0A18A;
    font-size: 24rpx;
    margin-top: 80rpx;
}
</style>
