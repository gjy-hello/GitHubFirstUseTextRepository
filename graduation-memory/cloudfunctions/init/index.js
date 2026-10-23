/**
 * 时光寄 · 云函数集合
 * ============================================================
 * 所有业务 action 共用这一份云函数，减少部署体积。
 * 首次部署完成后，在开发者工具或控制台手动调用一次：
 *   cloud.callFunction({ name: 'init', data: { action: 'initSchema' } })
 * 即可自动创建 4 张集合 + 关键索引。
 * ============================================================
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 集合定义（initSchema action 自动创建）
const COLLECTIONS = ['users', 'teachers', 'memories', 'responses']

// 关键索引（字段按 query 频率排序）
const INDEXES = {
    teachers:  [{ fields: { _openid: 1 } }, { fields: { inviteToken: 1 } }],
    memories:  [{ fields: { teacherId: 1 } }, { fields: { _openid: 1 } }],
    responses: [{ fields: { teacherId: 1 } }, { fields: { studentOpenid: 1 } }]
}

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
        // ==== 首次部署：创建集合 + 索引 ====
        // 开发者工具里右键 init 云函数 → 云端测试 → 传入 { "action": "initSchema" }
        if (action === 'initSchema') {
            const result = { collections: [], indexes: [] }

            for (const name of COLLECTIONS) {
                try {
                    await db.createCollection(name)
                    result.collections.push(name + ' ✓')
                } catch (e) {
                    // 集合已存在时忽略
                    result.collections.push(name + ' (已存在)')
                }
            }

            for (const [col, idxList] of Object.entries(INDEXES)) {
                for (let i = 0; i < idxList.length; i++) {
                    const idx = idxList[i]
                    const idxName = `${col}_idx_${Object.keys(idx.fields).join('_')}`
                    try {
                        await db.collection(col).createIndex({
                            keys: idx.fields,
                            name: idxName,
                            unique: false
                        })
                        result.indexes.push(`${col}/${idxName} ✓`)
                    } catch (e) {
                        result.indexes.push(`${col}/${idxName} (已存在)`)
                    }
                }
            }

            return { code: 0, data: result }
        }

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
