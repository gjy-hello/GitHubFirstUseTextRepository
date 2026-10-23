<template>
    <view class="page">
        <!-- 抬头 -->
        <view class="w-head">
            <view class="w-salute">致：<text class="w-student">{{ studentName }}</text></view>
            <view class="w-desc">写下您想对 TA 说的话，<br/>多年后 TA 还会记得这一刻。</view>
        </view>

        <!-- 评价主体 -->
        <view class="paper-card form-card">
            <view class="field-head">
                <text class="fh-label">一 段 回 忆 或 评 价</text>
                <text class="fh-count">{{ evaluation.length }} / 600</text>
            </view>
            <textarea
                class="ta-evaluation"
                v-model="evaluation"
                maxlength="600"
                placeholder="可以是一个鼓励、一段往事、一句祝福…

多年以后，当 TA 翻到这一页，
会想起此刻。"
            />
        </view>

        <!-- 老师这边也想补充点东西 -->
        <view class="paper-card extras">
            <view class="field-head">
                <text class="fh-label">我 也 想 加 点 什 么（选填）</text>
            </view>
            <textarea
                class="ta-memory"
                v-model="memories"
                placeholder="您也可以写几件您记得的小事，比如：
「记得大一他坐第一排，眼睛总是亮的」
「某次晚课留下来陪我整理资料」..."
            />

            <view class="photo-add">
                <view class="photo-label">＋ 上传几张您珍藏的合影（选填）</view>
                <view class="photo-grid">
                    <view class="photo-item" v-for="(p, i) in photos" :key="i">
                        <image :src="p" mode="aspectFill" />
                        <text class="photo-del" @click="photos.splice(i, 1)">×</text>
                    </view>
                    <view class="photo-add-btn" @click="choosePhotos" v-if="photos.length < 9">＋</view>
                </view>
            </view>
        </view>

        <!-- 保存 -->
        <view class="btn-seal submit-btn" @click="submit">
            {{ existing ? '更 新 这 一 页' : '封 存 并 寄 出' }}
        </view>
        <view class="privacy-note">
            您的留言仅您和这位学生可见
        </view>
    </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app'
import cloud from '@/utils/cloud.js'

const teacherId = ref('')
const studentOpenid = ref('')
const token = ref('')
const studentName = ref('这位同学')
const evaluation = ref('')
const memories = ref('')
const photos = ref([])
const existing = ref(false)

onLoad(async (opt) => {
    teacherId.value = opt?.teacherId || ''
    studentOpenid.value = opt?.studentOpenid || ''
    token.value = opt?.token || ''

    // 拉一次详情，如果之前写过就回填
    if (token.value) {
        const data = await cloud.getTeacherByToken(token.value)
        if (data) {
            studentName.value = data.student?.nickName || data.student?.realName || '这位同学'
            if (data.response) {
                existing.value = true
                evaluation.value = data.response.evaluation || ''
                memories.value = (data.response.memories || []).join('\n')
                photos.value = data.response.photos || []
            }
        }
    }
})

const choosePhotos = () => {
    uni.chooseImage({
        count: 9 - photos.value.length,
        success: r => photos.value.push(...r.tempFilePaths)
    })
}

const submit = async () => {
    if (!evaluation.value.trim()) {
        uni.showToast({ title: '至少写几句话吧', icon: 'none' }); return
    }
    uni.showLoading({ title: '封存中' })

    await cloud.submitResponse({
        teacherId: teacherId.value,
        studentOpenid: studentOpenid.value,
        evaluation: evaluation.value,
        memories: memories.value.split('\n').filter(Boolean),
        photos: photos.value
    })

    uni.hideLoading()
    uni.showToast({ title: '已封存', icon: 'success' })
    setTimeout(() => {
        uni.redirectTo({
            url: `/pages/teacher-done/teacher-done?token=${token.value}`
        })
    }, 800)
}
</script>

<style scoped>
.page { min-height: 100vh; padding: 0 28rpx 160rpx; }

.w-head {
    padding: 48rpx 24rpx 24rpx;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
}
.w-salute { font-size: 32rpx; color: #8B6F47; }
.w-student { color: #4A3728; font-size: 40rpx; font-weight: 500; }
.w-desc {
    font-size: 26rpx;
    color: #B8A68B;
    margin-top: 14rpx;
    line-height: 1.8;
}

.form-card, .extras { padding: 28rpx 28rpx; margin-top: 16rpx; }

.field-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18rpx;
}
.fh-label {
    font-family: 'STKaiti', serif;
    font-size: 28rpx;
    color: #8B6F47;
    letter-spacing: 4rpx;
}
.fh-count { font-size: 22rpx; color: #B8A68B; }

.ta-evaluation {
    min-height: 360rpx;
    width: 100%;
    padding: 24rpx;
    background: rgba(139,111,71,0.04);
    border-radius: 6rpx;
    font-size: 30rpx;
    color: #4A3728;
    line-height: 2;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
}
.ta-memory {
    min-height: 200rpx;
    width: 100%;
    padding: 20rpx;
    background: rgba(139,111,71,0.04);
    border-radius: 6rpx;
    font-size: 26rpx;
    color: #4A3728;
    line-height: 1.9;
    font-family: 'STKaiti', 'Noto Serif SC', serif;
    margin-bottom: 20rpx;
}

.photo-add { margin-top: 20rpx; padding-top: 20rpx; border-top: 1rpx dashed rgba(139,111,71,0.2); }
.photo-label { font-size: 24rpx; color: #8B6F47; margin-bottom: 16rpx; font-family: 'STKaiti', serif; }
.photo-grid { display: flex; flex-wrap: wrap; gap: 14rpx; }
.photo-item, .photo-add-btn {
    width: 160rpx; height: 160rpx;
    border-radius: 6rpx;
    position: relative;
    overflow: hidden;
}
.photo-item image { width: 100%; height: 100%; }
.photo-del {
    position: absolute; top: 4rpx; right: 4rpx;
    width: 36rpx; height: 36rpx;
    background: rgba(0,0,0,0.5);
    color: #FFFFFF;
    font-size: 28rpx;
    border-radius: 50%;
    text-align: center;
    line-height: 32rpx;
}
.photo-add-btn {
    background: rgba(139,111,71,0.06);
    border: 2rpx dashed rgba(139,111,71,0.3);
    color: #8B6F47;
    display: flex; align-items: center; justify-content: center;
    font-size: 56rpx;
}

.submit-btn { margin-top: 48rpx; }
.privacy-note {
    text-align: center;
    font-size: 22rpx;
    color: #B8A68B;
    margin-top: 16rpx;
    font-family: 'STKaiti', serif;
}
</style>
