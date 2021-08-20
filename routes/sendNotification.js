const express = require('express')
const axios = require('axios')
const router = express.Router()
const { profile, profile2 } = require('./mockData')

router.post('/', async (req, res) => {
  const messages = req?.body
  const senderId = req?.body?.messages[0]?.userId
  try {
    //get profile form true
    const profileTrue = await getProfileTrue(senderId)

    //get block list from amity backend
    // ขอ mock data block list
    const sender = await getProfileAmity(profileTrue)

    // get receiver id from channels(case 1-1 use index[0])
    // ขอ receiver ถามฝั่ง front ว่าส่งให้ได้ไหม
    const receiver = await getUserFromChannesls(
      req?.body?.messages[0]?.channelId
    )
      .then(res => res.filter(user => user.userId !== senderId))
      .then(res => res[0]?.userId)

    //find block list sender
    const blockListSender = sender.find(user => {
      return user === receiver
    })

    //find block list receiver
    const blockListReceiver = await getProfileAmity('id receiver').then(res =>
      res.find(user => {
        return user === senderId
      })
    )

    console.log({
      profileTrue,
      sender,
      receiver,
      blockListSender,
      blockListReceiver
    })

    if (!blockListSender) {
      return !blockListReceiver
        ? res.send('ปกติ')
        : res.send('คนรับบล็อกคนส่ง')
    } else {
      // return res.send(sentMessage(messages))
      res.send('คนส่งบล็อกคนรับ')
    }
  } catch (error) {
    console.log(`error msg : ${error}`)
  }
})

//fetch profile from true
async function sentNotification ({ id, msg }) {
  sentMessage(msg)
  console.log(`send notification to ID:${id}`)
  return `send notification to ID:${id}`
}

async function sentMessage (msg) {
  const message = JSON.stringify(msg)
  console.log(`message ${message}`)
  return msg
}

//fetch profile from true
async function getProfileTrue (id) {
  return profile?.users[0]?.userId
}

//check profile from amity backend
async function getProfileAmity (id) {
  return id === 'id receiver'
    ? profile2?.users[0]?.metadata?.blockList
    : profile?.users[0]?.metadata?.blockList
}

// check user from channels
// /api/v3/authentication/token -> /api/v3/sessions get accessToken = token

async function getUserFromChannesls (id) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjU4ZDllM2JjNjE2ZDJiOTliYmNhMWM1NGJkMzY0NTIyYWM1NzAzNjM5ODlmZDUxNDAwNDM1ZjE1OTJjYmM3NTkzMDc3ZTZhNTEyM2MwNzIwNzQyZGM1MjQ4OGEzM2UzYjU5NzMzNWE4MGM1ZDVlYWM5NmM5ZTg5NjBmZjExZTNiZDg2NjYyYjA0NGQ0OTIwNzg1NjliYjM5MWZhZDQzMmNhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwN2FiMzYzMmUwNTk2OTNiNjBiZjIwOGUzMGM3ZGM4NjU1YmVkMmMyYzM1MzAxZTk1IiwiaWF0IjoxNjI5NDUyMDYyLCJleHAiOjE2NjA5ODgwNjJ9.aOMCZnh2aCPoA_TtdBtnJEUafsP6zyYX1ptnZHbbgXQ'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const user = await axios.get(
      `https://api.amity.co/api/v3/channels/${id}/users`,
      configAuth
    )

    return user?.data?.users
  } catch (error) {
    console.log(`getUserFromChannesls() msg : ${error}`)
  }
}

module.exports = router

/**
 * @swagger
 * components:
 *   schemas:
 *     Noti:
 *       type: object
 *       required:
 *         - test
 *         - isFriend
 *       properties:
 *           profile:
 *             type: string
 *           type: string
 *           description: User id from UI KIT
 *       example:
 *         profile: 1
 */

/**
 * @swagger
 * tags:
 *   name: Noti
 *   description: managing API
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Noti
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: 555 API
 *     responses:
 *       200:
 *         description: ...
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Noti'
 */
