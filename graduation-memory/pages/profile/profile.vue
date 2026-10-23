<template>
    <view class="page">
        <!-- 基础信息 -->
        <view class="paper-card profile-card">
            <view class="pc-top">
                <view class="pc-photo" @click="chooseAvatar">
                    <image v-if="user.avatarUrl" :src="user.avatarUrl" mode="aspectFill" />
                    <view v-else class="pc-photo-fb">📷</view>
                    <view class="pc-photo-tip">点击更换</view>
                </view>

                <view class="pc-info">
                    <view class="field">
                        <text class="field-label">名字</text>
                        <input class="field-input" v-model="user.realName" placeholder="你的真名" />
                    </view>
                    <view class="field">
                        <text class="field-label">昵称</text>
                        <input class="field-input" v-model="user.nickName" placeholder="怎么称呼你" />
                    </view>
                </view>
            </view>

            <view class="divider-soft"></view>

            <view class="grid-2">
                <view class="field">
                    <text class="field-label">学校</text>
                    <input class="field-input" v-model="user.school" placeholder="XX大学" />
                </view>
                <view class="field">
                    <text class="field-label">专业</text>
                    <input class="field-input" v-model="user.major" placeholder="计算机 / 中文系..." />
                </view>
            </view>

            <view class="field">
                <text class="field-label">毕业年份</text>
                <picker mode="date" :value="gradYearPicker" :end="today" @change="onPickGrad">
                    <view class="field-input picker">{{ gradYearPicker || '选择毕业月份' }}</view>
                </picker>
            </view>

            <view class="field col">
                <text class="field-label">自我介绍</text>
                <textarea class="field-textarea" v-model="user.bio" placeholder="给老师们介绍一下现在的你～" />
            </view>
        </view>

        <!-- 保存 -->
        <view class="btn-seal save-btn" @click="save">保存这一页</view>

        <!-- 退出登录 -->
        <view class="logout" @click="doLogout">退出登录</view>

        <view class="bottom-seal title-script">— 时光寄 · 愿你被温柔以待 —</view>
    </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import cloud from '@/utils/cloud.js'
import { store } from '@/utils/store.js'

const user = reactive({
    realName: '', nickName: '', avatarUrl: '',
    school: '', major: '', gradYear: '', bio: ''
})
const gradYearPicker = ref('')
const today = new Date().toISOString().slice(0, 10)

// 载入
const loaded = store.getUserInfo()
if (loaded) Object.assign(user, loaded)
gradYearPicker.value = user.gradYear || ''

const chooseAvatar = () => {
    uni.chooseImage({
        count: 1,
        success: (res) => { user.avatarUrl = res.tempFilePaths[0] }
    })
}
const onPickGrad = (e) => {
    gradYearPicker.value = e.detail.value
    user.gradYear = e.detail.value
}

const save = async () => {
    if (!user.nickName) {
        uni.showToast({ title: '至少填个昵称吧', icon: 'none' })
        return
    }
    uni.showLoading({ title: '保存中' })
    await cloud.updateUser({ ...user })
    uni.hideLoading()
    uni.showToast({ title: '已存档', icon: 'success' })
}

const doLogout = () => {
    uni.showModal({
        title: '确认退出？', success: (r) => { if (r.confirm) store.logout() }
    })
}
</script>

<style scoped>
.page { min-height: 100vh; padding: 24rpx 28rpx 160rpx; }

.profile-card { padding: 40rpx 32rpx; }

.pc-top { display: flex; gap: 28rpx; align-items: flex-start; }
.pc-photo {
    width: 180rpx; height: 180rpx;
    border-radius: 12rpx;
    background: #F5ECD7;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    overflow: hidden;
    position: relative;
    border: 2rpx dashed rgba(139,111,71,0.3);
    flex-shrink: 0;
}
.pc-photo image { width: 100%; height: 100%; }
.pc-photo-fb { font-size: 56rpx; }
.pc-photo-tip {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: rgba(0,0,0,0.35);
    color: #FFFFFF;
    font-size: 18rpx;
    padding: 6rpx 0;
    text-align: center;
}

.pc-info { flex: 1; display: flex; flex-direction: column; gap: 18rpx; }

.field {
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid rgba(139,111,71,0.1);
    padding: 14rpx 0;
}
.field.col { flex-direction: column; align-items: flex-start; }
.field-label {
    width: 160rpx;
    font-family: 'STKaiti', serif;
    font-size: 26rpx;
    color: #8B6F47;
    flex-shrink: 0;
}
.field-input {
    flex: 1;
    font-size: 28rpx;
    color: #4A3728;
    padding: 8rpx 0;
}
.field-input.picker { color: #4A3728; }
.field-textarea {
    width: 100%;
    min-height: 180rpx;
    font-size: 26rpx;
    color: #4A3728;
    padding: 14rpx;
    background: rgba(139,111,71,0.04);
    border-radius: 6rpx;
    margin-top: 10rpx;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
}

.divider-soft { height: 1rpx; background: rgba(139,111,71,0.12); margin: 28rpx 0; }
.grid-2 { display: flex; gap: 24rpx; }
.grid-2 .field { flex: 1; }
.grid-2 .field-label { width: 100rpx; }

.save-btn { margin-top: 40rpx; }
.logout {
    text-align: center;
    color: #C0392B;
    font-size: 26rpx;
    margin-top: 32rpx;
    letter-spacing: 6rpx;
}
.bottom-seal {
    text-align: center;
    color: #B8A68B;
    font-size: 22rpx;
    margin-top: 80rpx;
    letter-spacing: 4rpx;
}
</style>
