<template>
    <view class="page">
        <!-- 邀请信 -->
        <view class="invite-letter paper-card">
            <view class="seal">时光寄</view>

            <view class="il-line1">尊敬的 {{ teacher?.name || 'XX' }} 老师：</view>
            <view class="il-body">
                您好！四载光阴一晃而过，<br/>
                我即将毕业，走上新的路。<br/>
                <br/>
                这是一封我亲手写的"时光寄"——<br/>
                里面有我想对您说的话、<br/>
                也有我整理的我们之间的点点滴滴。<br/>
                <br/>
                想请您也写几句话给我，<br/>
                作为临别纪念。<br/>
            </view>
            <view class="il-sign">
                —— 您的学生 {{ user?.nickName || '' }}<br/>
                <text class="il-date">{{ today }}</text>
            </view>
        </view>

        <!-- 邀请码 -->
        <view class="token-card paper-card">
            <view class="tc-title">您的专属邀请码</view>
            <view class="tc-token">{{ teacher?.inviteToken || '------' }}</view>
            <view class="tc-sub">老师在微信小程序内输入即可进入</view>

            <view class="tc-actions">
                <view class="tc-btn" @click="copyToken">复制邀请码</view>
                <button class="tc-btn primary" open-type="share" @click="doShare">直接分享</button>
            </view>
        </view>

        <!-- 分享 -->
        <view class="share-card paper-card">
            <view class="mc-title title-script">把这封信寄出去</view>
            <view class="share-row">
                <view class="share-btn" @click="copyDeep">复制进入链接</view>
                <view class="share-btn" @click="doShare">
                    <view class="s-main">📨 发给 {{ teacher?.name || '老师' }}</view>
                    <view class="s-sub">转发给老师即可</view>
                </view>
            </view>
            <view class="share-tip">老师收到后，点击链接就能看到专属页面。<br/>每位老师独立看到只属于你们两人的那一页。</view>
        </view>
    </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app'
import cloud from '@/utils/cloud.js'
import { store } from '@/utils/store.js'

const teacher = ref(null)
const user = ref(null)
const today = new Date().toISOString().slice(0, 10)

onLoad(async (opt) => {
    user.value = store.getUserInfo()
    if (opt && opt.id) {
        const list = await cloud.listTeachers()
        teacher.value = (list || []).find(x => x._id === opt.id) || null
    }
})

const copyToken = () => {
    uni.setClipboardData({
        data: teacher.value?.inviteToken || '',
        success: () => uni.showToast({ title: '邀请码已复制', icon: 'none' })
    })
}

const copyDeep = () => {
    const token = teacher.value?.inviteToken
    const msg = `来自「时光寄」的一封邀请 —— 您的学生 ${user.value?.nickName || ''} 想请您写几句话给他。\n邀请码：${token}\n请在「时光寄」小程序中打开。`
    uni.setClipboardData({
        data: msg,
        success: () => uni.showToast({ title: '内容已复制', icon: 'none' })
    })
}

const doShare = () => {
    uni.showToast({ title: '请点击右上角 · 转发', icon: 'none' })
}
</script>

<!-- 分享给微信好友时的预览内容 -->
<script>
export default {
    onShareAppMessage() {
        const token = this.teacher?.inviteToken
        const name = this.teacher?.name || '老师'
        const user = this.user?.nickName || '您的学生'
        return {
            title: `${user} 想请您写几句话 · ${name}老师专属`,
            path: `/pages/teacher-welcome/teacher-welcome?token=${token}`,
            desc: '一封来自时光寄的信'
        }
    },
    onShareTimeline() {
        return { title: '时光寄 · 四载光阴 一纸相寄' }
    }
}
</script>

<style scoped>
.page { min-height: 100vh; padding: 24rpx 28rpx 160rpx; }

.invite-letter {
    padding: 48rpx 40rpx;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
}
.seal { margin-bottom: 24rpx; }
.il-line1 { font-size: 30rpx; color: #4A3728; margin-bottom: 24rpx; }
.il-body {
    font-size: 28rpx;
    color: #4A3728;
    line-height: 2.2;
}
.il-sign {
    text-align: right;
    margin-top: 32rpx;
    font-size: 28rpx;
    color: #8B6F47;
}
.il-date { font-size: 22rpx; color: #B8A68B; }

.token-card { padding: 40rpx 32rpx; text-align: center; }
.tc-title { font-size: 26rpx; color: #8B6F47; font-family: 'STKaiti', serif; }
.tc-token {
    font-family: 'Noto Serif SC', serif;
    font-size: 68rpx;
    font-weight: 700;
    color: #C0392B;
    letter-spacing: 12rpx;
    padding: 24rpx 0;
}
.tc-sub { font-size: 22rpx; color: #B8A68B; }
.tc-actions {
    display: flex; gap: 16rpx;
    margin-top: 32rpx;
}
.tc-btn {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    border-radius: 6rpx;
    font-size: 26rpx;
    letter-spacing: 4rpx;
    background: #F5ECD7;
    color: #8B6F47;
    border: none;
}
.tc-btn::after { border: none; }
.tc-btn.primary { background: #8B6F47; color: #F5ECD7; }

.share-card { padding: 32rpx 28rpx; }
.mc-title { font-size: 30rpx; margin-bottom: 20rpx; }
.share-row { display: flex; gap: 16rpx; flex-direction: column; }
.share-btn {
    background: rgba(139,111,71,0.06);
    border: 1rpx dashed rgba(139,111,71,0.3);
    border-radius: 6rpx;
    padding: 28rpx 24rpx;
    text-align: center;
    font-size: 28rpx;
    color: #4A3728;
}
.s-main { font-weight: 500; }
.s-sub { font-size: 22rpx; color: #8B6F47; margin-top: 6rpx; }
.share-tip {
    margin-top: 20rpx;
    font-size: 22rpx;
    color: #B8A68B;
    line-height: 1.8;
    text-align: center;
}
</style>
