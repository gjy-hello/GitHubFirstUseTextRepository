<template>
    <view class="page">
        <!-- 邀请码输入 fallback（没带 token 时） -->
        <view v-if="!token && !data" class="no-token">
            <view class="empty">
                <view class="empty-ink">✉️</view>
                <text class="empty-text title-script">请输入邀请码</text>
                <input
                    class="token-input"
                    v-model="manualToken"
                    placeholder="6位邀请码"
                    maxlength="6"
                    @confirm="lookup"
                />
                <view class="btn-seal" @click="lookup">进 去 看 看</view>
            </view>
        </view>

        <!-- 加载中 -->
        <view v-else-if="!data" class="loading">
            <view class="empty-ink">🖋️</view>
            <text class="empty-text">正在为您展开这封信...</text>
        </view>

        <!-- 学生已为这位老师准备的内容 -->
        <view v-else class="welcome">
            <!-- 抬头：谁写给谁 -->
            <view class="w-header">
                <view class="w-ribbon"></view>
                <view class="seal big">时光寄</view>
                <view class="w-letter-head">
                    尊敬的 <text class="w-name">{{ data.teacher.name }}</text> 老师：
                </view>
                <view class="w-author">
                    <image v-if="data.student?.avatarUrl" :src="data.student.avatarUrl" class="wa-avatar" mode="aspectFill" />
                    <view class="wa-text">
                        来自您的学生
                        <text class="wa-name">{{ data.student?.nickName || data.student?.realName || '一位未署名的少年' }}</text>
                        <text class="wa-sub" v-if="data.student?.school">{{ data.student.school }} · {{ data.student.major }}</text>
                    </view>
                </view>
            </view>

            <!-- 老师写给 TA 的开场白 -->
            <view v-if="data.teacher.memo" class="paper-card memo-box">
                <view class="mb-head">
                    <text class="mb-label">TA 想对您说</text>
                </view>
                <view class="mb-content">{{ data.teacher.memo }}</view>
            </view>

            <!-- 学生档案卡（照片墙、简介） -->
            <view class="paper-card archive">
                <view class="ar-title title-script">TA 现在的样子</view>
                <view class="ar-bio" v-if="data.student?.bio">{{ data.student.bio }}</view>

                <view class="ar-photos" v-if="data.student?.photoWall?.length">
                    <view class="polaroid" v-for="p in data.student.photoWall" :key="p.url">
                        <image :src="p.url" mode="aspectFill" />
                        <text class="polaroid-caption">{{ p.caption || '' }}</text>
                    </view>
                </view>

                <view class="ar-empty" v-if="!data.student?.bio && !data.student?.photoWall?.length">
                    （TA 还没放这一页～）
                </view>
            </view>

            <!-- 共同回忆时间轴 -->
            <view class="paper-card memories" v-if="data.memories?.length">
                <view class="mc-head">
                    <text class="mc-title title-script">那些年 · 我们的片段</text>
                    <text class="mc-sub">TA 写下的每一件小事</text>
                </view>
                <view class="timeline">
                    <view class="timeline-item" v-for="m in data.memories" :key="m._id">
                        <view class="timeline-dot"></view>
                        <view class="mi-date">{{ fmtDate(m.date) }}</view>
                        <view class="mi-content">{{ m.content }}</view>
                        <view class="mi-photos" v-if="m.photos?.length">
                            <image v-for="(p,i) in m.photos" :key="i" :src="p" class="mi-photo" mode="aspectFill" />
                        </view>
                    </view>
                </view>
            </view>

            <!-- 老师之前是否写过 -->
            <view v-if="data.response" class="paper-card response boxed">
                <view class="rb-head">
                    <text class="rb-title">您留给 TA 的话</text>
                    <text class="rb-date">· 已写过 · {{ fmtDate(data.response.updatedAt) }}</text>
                </view>
                <view class="rb-content">{{ data.response.evaluation }}</view>
            </view>

            <!-- 底部 CTA -->
            <view class="cta-wrap">
                <view class="btn-seal" @click="goWrite">
                    {{ data.response ? '再写几句 / 修改' : '写几句话给 TA' }}
                </view>
                <view class="cta-sub">您的话只属于您和这位学生两人</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import cloud from '@/utils/cloud.js'
import { fmtDate } from '@/utils/store.js'

const token = ref('')
const manualToken = ref('')
const data = ref(null)

const lookup = async (t) => {
    const tk = (t || token.value || manualToken.value || '').trim().toUpperCase()
    if (!tk) return
    uni.showLoading({ title: '展开中' })
    const res = await cloud.getTeacherByToken(tk)
    uni.hideLoading()
    if (res === null || (!res.teacher && !res.code && res.code !== 0)) {
        uni.showToast({ title: '邀请码无效', icon: 'none' }); return
    }
    data.value = res
}

onLoad((opt) => {
    if (opt && opt.token) {
        token.value = opt.token
        lookup(opt.token)
    }
})
onMounted(() => { /* 兜底 */ })

const goWrite = () => {
    uni.navigateTo({
        url: `/pages/teacher-write/teacher-write?teacherId=${data.value.teacher._id}&studentOpenid=${data.value.student?._openid || ''}&token=${token.value}`
    })
}
</script>

<style scoped>
.page { min-height: 100vh; padding-bottom: 160rpx; }
.loading, .no-token { padding: 160rpx 60rpx; }

/* 欢迎页 */
.w-header {
    position: relative;
    padding: 80rpx 40rpx 60rpx;
    background:
        radial-gradient(ellipse at top, rgba(196,165,116,0.25), transparent 70%),
        linear-gradient(180deg, #FAF6F0 0%, #F5ECD7 100%);
}
.w-ribbon {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 8rpx;
    background: linear-gradient(90deg, #8B6F47, #C4A574, #8B6F47);
}
.w-header .seal { margin-bottom: 32rpx; }
.w-header .seal.big {
    width: 140rpx; height: 140rpx;
    font-size: 28rpx;
    transform: rotate(-10deg);
}
.w-letter-head {
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    font-size: 34rpx;
    color: #4A3728;
    margin-bottom: 32rpx;
}
.w-name { font-size: 40rpx; font-weight: 500; color: #8B6F47; }

.w-author {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 24rpx 28rpx;
    background: rgba(255,255,255,0.6);
    border-radius: 12rpx;
    border: 1rpx solid rgba(139,111,71,0.12);
}
.wa-avatar {
    width: 80rpx; height: 80rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(139,111,71,0.15);
}
.wa-text { flex: 1; font-family: 'STKaiti', serif; color: #4A3728; font-size: 26rpx; }
.wa-name {
    font-size: 32rpx;
    color: #8B6F47;
    font-weight: 500;
    margin-left: 8rpx;
}
.wa-sub {
    display: block;
    font-size: 22rpx;
    color: #B8A68B;
    margin-top: 4rpx;
}

/* 学生写给老师的话 */
.memo-box {
    margin: -20rpx 28rpx 24rpx;
    padding: 36rpx 32rpx;
    position: relative;
}
.mb-label {
    font-family: 'STKaiti', serif;
    color: #8B6F47;
    font-size: 24rpx;
    letter-spacing: 8rpx;
}
.mb-head { margin-bottom: 16rpx; }
.mb-content {
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    font-size: 30rpx;
    line-height: 2.1;
    color: #4A3728;
}

/* 档案卡 */
.archive {
    margin: 0 28rpx 24rpx;
    padding: 28rpx;
}
.ar-title { font-size: 30rpx; margin-bottom: 16rpx; letter-spacing: 4rpx; }
.ar-bio {
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    color: #4A3728;
    line-height: 1.9;
    margin-bottom: 20rpx;
}
.ar-photos { display: flex; flex-wrap: wrap; gap: 20rpx; }
.ar-photos .polaroid { width: calc((100% - 20rpx) / 2); }
.ar-photos .polaroid image { height: 280rpx; }
.ar-empty { color: #B8A68B; font-size: 24rpx; text-align: center; padding: 20rpx; font-family: 'STKaiti', serif; }

/* 回忆时间轴 */
.memories {
    margin: 0 28rpx 24rpx;
    padding: 32rpx;
}
.mc-head { margin-bottom: 24rpx; }
.mc-title { font-size: 30rpx; letter-spacing: 4rpx; }
.mc-sub { font-size: 22rpx; color: #B8A68B; margin-top: 6rpx; display: block; }

.timeline-item { padding: 12rpx 0 24rpx; }
.mi-date {
    font-family: 'Noto Serif SC', serif;
    color: #8B6F47;
    font-size: 22rpx;
    margin-bottom: 8rpx;
}
.mi-content {
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    font-size: 28rpx;
    color: #4A3728;
    line-height: 2;
}
.mi-photos { display: flex; gap: 12rpx; margin-top: 14rpx; }
.mi-photo {
    width: 140rpx; height: 140rpx;
    border-radius: 6rpx;
}

/* 之前写过的评价 */
.response {
    margin: 0 28rpx 24rpx;
    padding: 32rpx;
    background: rgba(76,175,80,0.06);
    border-left: 4rpx solid #4CAF50;
}
.rb-head { margin-bottom: 16rpx; }
.rb-title { font-family: 'STKaiti', serif; font-size: 28rpx; color: #4CAF50; }
.rb-date { font-size: 22rpx; color: #B8A68B; margin-left: 12rpx; }
.rb-content {
    font-family: 'STKaiti', serif;
    font-size: 28rpx;
    line-height: 1.9;
    color: #4A3728;
}

/* CTA */
.cta-wrap {
    text-align: center;
    padding: 40rpx 28rpx 20rpx;
}
.btn-seal { margin: 0 40rpx; }
.cta-sub {
    margin-top: 16rpx;
    font-size: 22rpx;
    color: #B8A68B;
    font-family: 'STKaiti', serif;
}

.token-input {
    text-align: center;
    font-family: 'Noto Serif SC', serif;
    font-size: 56rpx;
    font-weight: 700;
    letter-spacing: 10rpx;
    padding: 20rpx 0;
    border-bottom: 2rpx dashed #C4A574;
    margin: 32rpx 0 40rpx;
    color: #C0392B;
}
</style>
