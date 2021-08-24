const express = require('express')
const axios = require('axios')
const router = express.Router()
const { profileSender, profileReceiver } = require('./mockData')

router.post('/', async (req, res) => {
  try {
    const messages = req.body
    const senderId = messages?.senderProfile?.userId
    const receiverId = messages?.receiverProfile?.userId

    // check user profile with true backend
    const senderProfile = await getProfileFromTrue('senderId')
    const receiverProfile = await getProfileFromTrue('receiverId')

    // get sender block list
    const senderBlockList = await getProfileFromAmity('senderProfile')

    // get receiver block list
    const receiverBlockList = await getProfileFromAmity('receiverProfile')

    // find sender user blocked
    const isSenderBlockReceiver = senderBlockList?.find(user => {
      return user === receiverId
    })

    //find receiver user blocked
    const isReceiverBlockSender = receiverBlockList?.find(user => {
      return user === senderId
    })

    // console.log({
    //   senderProfile,
    //   receiverProfile,
    //   senderBlockList,
    //   receiverBlockList,
    //   isSenderBlockReceiver,
    //   isReceiverBlockSender
    // })

    if (!isSenderBlockReceiver) {
      !isReceiverBlockSender
        ? res.send(sentNotification({ id: receiverId, msg: messages }))
        : res.send(sentMessage({ id: receiverId, msg: messages }))
    } else {
      res.send(sentMessage({ id: receiverId, msg: messages }))
    }
  } catch (error) {
    console.log(`error msg : ${error}`)
  }
})

function sentNotification ({ id, msg }) {
  const status = {
    status: true
  }
  console.log(`notification status : ${status.status}`)
  return status
}

function sentMessage ({ id, msg }) {
  const status = {
    status: false
  }
  console.log(`notification status : ${status.status}`)
  return status
}

// fetch profile from true
async function getProfileFromTrue (id) {
  return id === 'senderId' ? profileSender : profileReceiver
}

// check profile from amity backend
// ใช้แบบจำลองเพราะข้อมูลของจริงยังไม่มี blocklist
// ถ้า user ยังไม่มี block list ก็ขอให้เป็น [] ว่างไว้ห้ามเป็น undefined
async function getProfileFromAmity (id) {
  return id === 'senderProfile'
    ? profileSender?.senderProfile?.metadata?.blockList
    : profileReceiver?.receiverProfile?.metadata?.blockList
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
