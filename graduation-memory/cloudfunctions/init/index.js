/**
 * 时光寄云函数集合
 * ============================================================
 * 部署方式：
 *   1. 微信开发者工具里打开云开发控制台，创建环境
 *   2. 修改 manifest.json 中 mp-weixin.cloud: true
 *   3. 右键当前目录 · 上传并部署（云端安装依赖）
 *   4. 在云数据库里创建三张集合，并设置权限规则
 *
 * 集合权限规则（重点！保证老师间隔离）：
 * ------------------------------------------------------------
 * users:      { "read": "_openid == auth.openid", "write": "_openid == auth.openid" }
 * teachers:   { "read": "_openid == auth.openid", "write": "_openid == auth.openid" }
 * memories:   { "read": "_openid == auth.openid", "write": "_openid == auth.openid" }
 * responses:  { "read": "auth.openid in [studentOpenid, _openid]",
 *               "write": "_openid == auth.openid" }
 *              ↑ 这里的 _openid 是老师的 openid（通过 token 识别后写入）
 * ------------------------------------------------------------
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 邀请码（6位大写字母+数字，避开易混字符）
function genToken() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let s = ''
    for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)]
    return s
}

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const action = event.action

    try {
        // ==== 登录（用 openid 当用户唯一标识） ====
        if (action === 'login') {
            let user = await db.collection('users').where({ _openid: openid }).get()
            if (!user.data.length) {
                await db.collection('users').add({
                    data: {
                        _openid: openid,
                        nickName: event.nickName || '少年·未命名',
                        avatarUrl: event.avatarUrl || '',
                        realName: '',
                        school: '',
                        major: '',
                        gradYear: '',
                        bio: '',
                        photoWall: [],
                        createdAt: db.serverDate()
                    }
                })
                user = await db.collection('users').where({ _openid: openid }).get()
            }
            return { code: 0, data: user.data[0] }
        }

        // ==== 更新个人资料 ====
        if (action === 'updateUser') {
            await db.collection('users').doc(event._id || openid).update({ data: event })
            return { code: 0 }
        }

        // ==== 创建老师（自动发唯一邀请码） ====
        if (action === 'createTeacher') {
            const token = genToken()
            const r = await db.collection('teachers').add({
                data: {
                    _openid: openid,
                    name: event.name,
                    subject: event.subject || '',
                    avatarUrl: event.avatarUrl || '',
                    memo: event.memo || '',
                    inviteToken: token,
                    createdAt: db.serverDate(),
                    updatedAt: db.serverDate()
                }
            })
            return { code: 0, data: { _id: r._id, inviteToken: token } }
        }

        // ==== 学生自己的老师列表 ====
        if (action === 'listTeachers') {
            const r = await db.collection('teachers').where({ _openid: openid }).get()
            return { code: 0, data: r.data }
        }

        if (action === 'updateTeacher') {
            await db.collection('teachers').doc(event.id).update({
                data: { ...event, updatedAt: db.serverDate() }
            })
            return { code: 0 }
        }

        if (action === 'deleteTeacher') {
            await db.collection('teachers').doc(event.id).remove()
            await db.collection('memories').where({ teacherId: event.id }).remove()
            await db.collection('responses').where({ teacherId: event.id }).remove()
            return { code: 0 }
        }

        // ==== 老师通过邀请码进入（返回学生为这位老师准备的所有内容） ====
        if (action === 'teacherEnter') {
            const t = await db.collection('teachers').where({ inviteToken: event.token.toUpperCase() }).get()
            if (!t.data.length) return { code: -1, msg: '邀请码无效' }
            const teacher = t.data[0]

            // 找到学生档案
            const student = await db.collection('users').where({ _openid: teacher._openid }).get()

            // 学生写给这位老师的共同回忆
            const memories = await db.collection('memories').where({ teacherId: teacher._id }).get()

            // 这位老师之前是否已经写过评价
            const resp = await db.collection('responses').where({ teacherId: teacher._id }).get()

            return {
                code: 0,
                data: {
                    teacher,
                    student: student.data[0],
                    memories: memories.data,
                    response: resp.data[0] || null
                }
            }
        }

        // ==== 学生写共同回忆 ====
        if (action === 'addMemory') {
            const r = await db.collection('memories').add({
                data: {
                    _openid: openid,
                    teacherId: event.teacherId,
                    kind: 'shared',
                    content: event.content,
                    photos: event.photos || [],
                    date: event.date || db.serverDate(),
                    createdAt: db.serverDate()
                }
            })
            return { code: 0, data: { _id: r._id } }
        }

        if (action === 'listMemoriesByTeacher') {
            const r = await db.collection('memories').where({ teacherId: event.teacherId }).get()
            return { code: 0, data: r.data }
        }

        // ==== 老师提交评价 ====
        if (action === 'submitResponse') {
            // 关键：写入 studentOpenid，让学生端能看，老师自己也能改
            const data = {
                _openid: openid,
                teacherId: event.teacherId,
                studentOpenid: event.studentOpenid,
                evaluation: event.evaluation,
                memories: event.memories || [],
                photos: event.photos || [],
                updatedAt: db.serverDate()
            }
            // 是否已存在 → 存在则更新
            const exist = await db.collection('responses').where({ teacherId: event.teacherId }).get()
            if (exist.data.length) {
                await db.collection('responses').doc(exist.data[0]._id).update({ data })
            } else {
                data.createdAt = db.serverDate()
                await db.collection('responses').add({ data })
            }
            return { code: 0 }
        }

        // ==== 学生看所有老师的评价 ====
        if (action === 'listResponses') {
            const r = await db.collection('responses')
                .where({ studentOpenid: event.studentOpenid })
                .get()
            return { code: 0, data: r.data }
        }

        return { code: -1, msg: 'unknown action: ' + action }
    } catch (e) {
        console.error(e)
        return { code: -1, msg: e.message }
    }
}
