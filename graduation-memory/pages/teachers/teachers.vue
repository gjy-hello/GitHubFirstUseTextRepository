<template>
    <view class="page">
        <view class="add-bar">
            <view class="add-btn" @click="goAdd">＋ 添加一位老师</view>
        </view>

        <view v-if="list.length === 0" class="empty">
            <view class="empty-ink">🎓</view>
            <text class="empty-text title-script">还没记录下任何一位老师</text>
            <text class="empty-text sub">添加后就能为每位老师生成专属邀请码</text>
        </view>

        <view v-else class="list">
            <view class="teacher-card paper-card" v-for="t in list" :key="t._id" @click="goEdit(t)">
                <view class="tc-top">
                    <image class="tc-avatar" v-if="t.avatarUrl" :src="t.avatarUrl" mode="aspectFill" />
                    <view class="tc-avatar-fb" v-else>{{ (t.name || '师').charAt(0) }}</view>
                    <view class="tc-info">
                        <view class="tc-name">{{ t.name }}</view>
                        <view class="tc-subject" v-if="t.subject">{{ t.subject }}</view>
                        <view class="tc-meta">
                            <text class="tag-time">邀请码 {{ t.inviteToken }}</text>
                        </view>
                    </view>
                    <view class="tc-seal">邀</view>
                </view>

                <view class="tc-memo" v-if="t.memo">「{{ truncate(t.memo, 40) }}」</view>

                <view class="tc-actions">
                    <view class="tc-btn edit" @click.stop="goEdit(t)">写回忆</view>
                    <view class="tc-btn share" @click.stop="goInvite(t)">分享邀请</view>
                    <view class="tc-btn del" @click.stop="doDelete(t)">删除</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import cloud from '@/utils/cloud.js'
import { store } from '@/utils/store.js'

const list = ref([])

const refresh = async () => {
    if (!store.isLoggedIn()) {
        uni.showModal({
            title: '请先登录', content: '登录后开始记录', showCancel: false,
            success: () => uni.navigateTo({ url: '/pages/login/login' })
        })
        return
    }
    list.value = (await cloud.listTeachers()) || []
}
onShow(refresh)

const goAdd = () => uni.navigateTo({ url: '/pages/teacher-edit/teacher-edit' })
const goEdit = (t) => uni.navigateTo({ url: '/pages/teacher-edit/teacher-edit?id=' + t._id })
const goInvite = (t) => uni.navigateTo({ url: '/pages/invite/invite?id=' + t._id })
const truncate = (s, n) => s.length > n ? s.slice(0, n) + '…' : s

const doDelete = (t) => {
    uni.showModal({
        title: '确认删除？',
        content: `删除后无法恢复「${t.name}」的回忆与评价`,
        success: async (res) => {
            if (res.confirm) {
                await cloud.deleteTeacher(t._id)
                refresh()
                uni.showToast({ title: '已删除', icon: 'none' })
            }
        }
    })
}
</script>

<style scoped>
.page { min-height: 100vh; padding: 24rpx 28rpx 140rpx; }

.add-bar { text-align: right; margin-bottom: 20rpx; }
.add-btn {
    display: inline-block;
    background: #8B6F47;
    color: #F5ECD7;
    padding: 14rpx 32rpx;
    border-radius: 6rpx;
    font-size: 26rpx;
    letter-spacing: 4rpx;
    box-shadow: 0 4rpx 12rpx rgba(139,111,71,0.25);
}

.teacher-card {
    position: relative;
    padding: 28rpx;
}
.tc-top {
    display: flex;
    align-items: center;
    padding-right: 64rpx;
}
.tc-avatar, .tc-avatar-fb {
    width: 88rpx; height: 88rpx;
    border-radius: 50%;
    flex-shrink: 0;
    background: #F5ECD7;
    color: #8B6F47;
    display: flex; align-items: center; justify-content: center;
    font-family: 'STKaiti', serif;
    font-size: 36rpx;
    border: 2rpx solid rgba(139,111,71,0.15);
}
.tc-info { flex: 1; margin: 0 20rpx; }
.tc-name { font-size: 32rpx; color: #4A3728; font-weight: 500; }
.tc-subject { font-size: 24rpx; color: #8B6F47; margin-top: 2rpx; }
.tc-meta { margin-top: 6rpx; }

.tc-seal {
    position: absolute;
    top: 24rpx; right: 24rpx;
    width: 48rpx; height: 48rpx;
    background: #C0392B;
    color: #FFFFFF;
    font-size: 22rpx;
    font-family: 'STKaiti', serif;
    display: flex; align-items: center; justify-content: center;
    border-radius: 4rpx;
    transform: rotate(6deg);
    opacity: 0.85;
}

.tc-memo {
    margin-top: 20rpx;
    padding: 16rpx 20rpx;
    background: rgba(196,165,116,0.1);
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    color: #8B6F47;
    font-size: 26rpx;
    line-height: 1.8;
    border-radius: 0 6rpx 6rpx 0;
    border-left: 3rpx solid #C4A574;
}

.tc-actions {
    display: flex;
    gap: 14rpx;
    margin-top: 24rpx;
    padding-top: 20rpx;
    border-top: 1rpx dashed rgba(139,111,71,0.15);
}
.tc-btn {
    flex: 1;
    text-align: center;
    font-size: 24rpx;
    padding: 14rpx 0;
    border-radius: 6rpx;
    letter-spacing: 2rpx;
}
.tc-btn.edit { border: 1rpx solid #C4A574; color: #8B6F47; }
.tc-btn.share { background: #8B6F47; color: #F5ECD7; }
.tc-btn.del { color: #C0392B; }
</style>
