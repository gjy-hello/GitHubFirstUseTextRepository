<template>
    <view class="page">
        <view class="done-wrap">
            <view class="seal big">已封存</view>

            <view class="title-script done-title">这一页已寄到</view>
            <view class="done-line">TA 的时光信箱中</view>

            <view class="paper-card poem">
                <view class="poem-line1">愿你前程似锦</view>
                <view class="poem-line2">归来仍是少年</view>
            </view>

            <view class="meta">
                <text class="meta-item">· 您的留言仅您和 {{ data?.student?.nickName || 'TA' }} 可见 ·</text>
                <text class="meta-item">· 您可以随时回来补充或修改 ·</text>
            </view>

            <view class="cta">
                <view class="btn-outline" @click="goBack">回到这封信</view>
            </view>

            <view class="bottom-seal title-script">— 时光寄 · 愿被温柔以待 —</view>
        </view>
    </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app'
import cloud from '@/utils/cloud.js'

const data = ref(null)

onLoad(async (opt) => {
    if (opt?.token) {
        const r = await cloud.getTeacherByToken(opt.token)
        data.value = r
    }
})

const goBack = () => {
    // 回到欢迎页
    if (data.value) {
        uni.redirectTo({
            url: `/pages/teacher-welcome/teacher-welcome?token=${getCurrentToken()}`
        })
    } else {
        uni.navigateBack()
    }
}

// 从跳转链路里找 token
const getCurrentToken = () => {
    const pages = getCurrentPages()
    for (let i = pages.length - 1; i >= 0; i--) {
        const q = pages[i].options
        if (q && q.token) return q.token
    }
    return ''
}
</script>

<style scoped>
.page {
    min-height: 100vh;
    background:
        radial-gradient(ellipse at top, rgba(196,165,116,0.2), transparent 70%),
        linear-gradient(180deg, #FAF6F0 0%, #F5ECD7 100%);
}
.done-wrap {
    text-align: center;
    padding: 120rpx 40rpx 80rpx;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
}
.seal.big {
    width: 180rpx; height: 180rpx;
    font-size: 36rpx;
    margin: 0 auto 32rpx;
    transform: rotate(-8deg);
    background: #4CAF50;
    box-shadow: 0 8rpx 24rpx rgba(76,175,80,0.4);
}

.done-title {
    font-size: 44rpx;
    color: #4A3728;
    letter-spacing: 8rpx;
    margin-bottom: 8rpx;
}
.done-line {
    font-size: 28rpx;
    color: #8B6F47;
    margin-bottom: 48rpx;
}

.poem {
    display: inline-block;
    padding: 60rpx 80rpx;
    margin: 0 auto 40rpx;
    font-family: 'STKaiti', 'Kaiti SC', serif;
    background: rgba(255,255,255,0.6);
    box-shadow: 0 8rpx 24rpx rgba(139,111,71,0.12);
}
.poem-line1 {
    font-size: 40rpx;
    color: #8B6F47;
    letter-spacing: 20rpx;
    margin-bottom: 24rpx;
}
.poem-line2 {
    font-size: 40rpx;
    color: #4A3728;
    letter-spacing: 20rpx;
}

.meta { margin-bottom: 40rpx; }
.meta-item {
    display: block;
    font-size: 22rpx;
    color: #B8A68B;
    line-height: 2;
}

.cta { padding: 24rpx 80rpx; }

.bottom-seal {
    text-align: center;
    color: #B8A68B;
    font-size: 22rpx;
    margin-top: 80rpx;
    letter-spacing: 4rpx;
}
</style>
