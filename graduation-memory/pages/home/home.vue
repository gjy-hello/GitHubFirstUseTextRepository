<template>
    <view class="page">
        <!-- 自定义顶部 · 老信封抬头 -->
        <view class="header-wrap">
            <view class="header-bg"></view>
            <view class="header-content">
                <view class="seal">时光寄</view>
                <view class="title-script app-title">致 · 四载春秋</view>
                <view class="subtitle">{{ greet }}，
                    <text v-if="user">{{ user.nickName }}</text>
                    <text v-else @click="goLogin">点击登录</text>
                </view>
            </view>
        </view>

        <!-- 时光轴 · 老师评价概览 -->
        <view class="wrap" v-if="user">
            <view class="section-head">
                <text class="section-title title-script">老师们写下的话</text>
                <text class="section-count">共 {{ teachers.length }} 位 · {{ responses.length }} 条寄语</text>
            </view>

            <!-- 无老师 -->
            <view v-if="teachers.length === 0" class="empty">
                <view class="empty-ink">✒️</view>
                <text class="empty-text">还没邀请老师进来坐坐</text>
                <text class="empty-text sub">去「老师」页先添加第一位老师吧</text>
                <view class="btn-outline go-add" @click="goTeachers">去添加</view>
            </view>

            <view v-else class="timeline">
                <view class="timeline-item paper-card" v-for="t in teachers" :key="t._id">
                    <view class="timeline-dot"></view>

                    <view class="ti-head">
                        <image class="ti-avatar" v-if="t.avatarUrl" :src="t.avatarUrl" mode="aspectFill" />
                        <view class="ti-avatar-fallback" v-else>{{ (t.name || '师').charAt(0) }}</view>
                        <view class="ti-info">
                            <view class="ti-name">{{ t.name }} <text class="ti-subject" v-if="t.subject">· {{ t.subject }}</text></view>
                            <view class="ti-meta">
                                <text class="tag-time">邀请码 {{ t.inviteToken }}</text>
                            </view>
                        </view>
                        <view class="ti-badge" v-if="hasResponse(t._id)">已回信</view>
                        <view class="ti-badge pending" v-else>等待中</view>
                    </view>

                    <!-- 已收到的评价 -->
                    <view v-if="getResponse(t._id)" class="response-box">
                        <view class="resp-label">TA 留给你的话</view>
                        <view class="resp-content">"{{ getResponse(t._id).evaluation }}"</view>
                        <view class="resp-date">— {{ fmtDate(getResponse(t._id).updatedAt) }}</view>
                    </view>

                    <!-- 学生写给 TA 的回忆摘要 -->
                    <view class="memo-box" v-if="t.memo">
                        <view class="resp-label">我写给 TA</view>
                        <view class="resp-content small">{{ t.memo }}</view>
                    </view>

                    <view class="ti-actions">
                        <view class="ti-btn" @click="goEdit(t)">继续写</view>
                        <view class="ti-btn primary" @click="goInvite(t)">邀请 TA</view>
                    </view>
                </view>
            </view>
        </view>

        <view v-else class="wrap" @click="goLogin">
            <view class="paper-card login-card">
                <view class="seal" style="margin-bottom: 24rpx;">时光寄</view>
                <view class="title-script welcome">欢迎来到时光寄</view>
                <view class="desc">
                    这里是你留给本科四年的一份礼物 ——<br/>
                    把与老师的点点滴滴写下来，<br/>
                    毕业后寄出这封信，<br/>
                    每位老师都会收到只属于你们两人的一页纸。
                </view>
                <view class="btn-seal" style="margin-top: 40rpx;">开始书写</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import cloud from '@/utils/cloud.js'
import { store, fmtDate } from '@/utils/store.js'

const user = ref(null)
const teachers = ref([])
const responses = ref([])

const greet = computed(() => {
    const h = new Date().getHours()
    if (h < 6) return '夜深了'
    if (h < 11) return '早'
    if (h < 13) return '中午好'
    if (h < 18) return '下午好'
    return '晚上好'
})

const refresh = async () => {
    user.value = store.getUserInfo()
    if (!user.value) return
    teachers.value = (await cloud.listTeachers()) || []
    responses.value = (await cloud.listResponses()) || []
}

onMounted(refresh)
onShow(refresh)

const hasResponse = (tid) => responses.value.some(r => r.teacherId === tid)
const getResponse = (tid) => responses.value.find(r => r.teacherId === tid)

const goLogin = () => uni.navigateTo({ url: '/pages/login/login' })
const goEdit = (t) => uni.navigateTo({ url: '/pages/teacher-edit/teacher-edit?id=' + t._id })
const goInvite = (t) => uni.navigateTo({ url: '/pages/invite/invite?id=' + t._id })
const goTeachers = () => uni.switchTab({ url: '/pages/teachers/teachers' })
</script>

<style scoped>
.page { min-height: 100vh; padding-bottom: 120rpx; }

/* 信封抬头 */
.header-wrap {
    position: relative;
    height: 360rpx;
    overflow: hidden;
    margin-bottom: -40rpx;
}
.header-bg {
    position: absolute; inset: 0;
    background:
        radial-gradient(ellipse at top left, rgba(196,165,116,0.18), transparent 60%),
        radial-gradient(ellipse at bottom right, rgba(139,111,71,0.12), transparent 50%),
        linear-gradient(180deg, #FAF6F0 0%, #F5ECD7 100%);
}
.header-content {
    position: relative;
    padding: 60rpx 40rpx 24rpx;
    text-align: left;
}
.seal { transform: rotate(-8deg); margin-bottom: 20rpx; }
.app-title {
    font-size: 48rpx;
    letter-spacing: 12rpx;
    margin-bottom: 8rpx;
}
.subtitle {
    font-family: 'STKaiti', 'Kaiti SC', serif;
    color: #8B6F47;
    font-size: 28rpx;
}

.wrap { padding: 0 28rpx; }

.section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 48rpx 8rpx 24rpx;
}
.section-title { font-size: 34rpx; }
.section-count { font-size: 22rpx; color: #B8A68B; }

/* 时间轴条目 */
.timeline-item {
    padding: 32rpx;
}
.ti-head {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}
.ti-avatar, .ti-avatar-fallback {
    width: 80rpx; height: 80rpx;
    border-radius: 50%;
    flex-shrink: 0;
    background: #F5ECD7;
    color: #8B6F47;
    display: flex; align-items: center; justify-content: center;
    font-family: 'STKaiti', serif;
    font-size: 32rpx;
    border: 2rpx solid rgba(139,111,71,0.15);
}
.ti-info { flex: 1; margin: 0 20rpx; }
.ti-name { font-size: 30rpx; color: #4A3728; font-weight: 500; }
.ti-subject { color: #B8A68B; font-size: 24rpx; }
.ti-meta { margin-top: 6rpx; }
.ti-badge {
    padding: 6rpx 16rpx;
    background: #E8F5E9;
    color: #4CAF50;
    font-size: 22rpx;
    border-radius: 20rpx;
    font-family: 'Noto Serif SC', serif;
}
.ti-badge.pending {
    background: #FFF3E0;
    color: #FF9800;
}

.response-box, .memo-box {
    margin: 16rpx 0;
    padding: 20rpx 24rpx;
    background: rgba(139,111,71,0.05);
    border-left: 4rpx solid #C4A574;
    border-radius: 0 6rpx 6rpx 0;
}
.memo-box { border-left-color: rgba(139,111,71,0.25); background: transparent; }
.resp-label {
    font-size: 22rpx;
    color: #B8A68B;
    font-family: 'STKaiti', serif;
    margin-bottom: 8rpx;
}
.resp-content {
    font-size: 28rpx;
    color: #4A3728;
    line-height: 1.9;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
}
.resp-content.small { font-size: 26rpx; color: #8B6F47; }
.resp-date {
    text-align: right;
    font-size: 22rpx;
    color: #B8A68B;
    margin-top: 8rpx;
    font-family: 'Noto Serif SC', serif;
}

.ti-actions {
    display: flex;
    gap: 16rpx;
    margin-top: 24rpx;
    padding-top: 20rpx;
    border-top: 1rpx dashed rgba(139,111,71,0.2);
}
.ti-btn {
    flex: 1;
    text-align: center;
    font-size: 26rpx;
    color: #8B6F47;
    padding: 14rpx 0;
    border-radius: 6rpx;
    border: 1rpx solid #C4A574;
    letter-spacing: 4rpx;
}
.ti-btn.primary {
    background: #8B6F47;
    color: #F5ECD7;
    border-color: #8B6F47;
}

/* 空登录卡 */
.login-card {
    text-align: center;
    padding: 80rpx 48rpx;
    margin-top: 60rpx;
}
.welcome { font-size: 38rpx; margin-bottom: 24rpx; }
.desc {
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    color: #8B6F47;
    line-height: 2;
    font-size: 28rpx;
}
.sub { margin-top: 8rpx; display: block; }
.go-add { margin-top: 32rpx; padding: 0 60rpx; display: inline-block; }
</style>
