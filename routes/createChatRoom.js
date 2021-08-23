const express = require('express')
const axios = require('axios')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    //get profile from req?.body
    const senderProfile = req.body?.senderProfile
    const receiverProfile = req?.body?.receiverProfile

    // get profile form amity backend
    let senderAmityProfile,
      receiverAmityProfile = {}

    senderAmityProfile = await getProfileFromAmity(senderProfile?.userId)
    receiverAmityProfile = await getProfileFromAmity(receiverProfile?.userId)

    // create amity profile
    if (!senderAmityProfile) {
      senderAmityProfile = await registerUser(senderProfile)
    }

    // รอถามแม็กว่าต้อง register ให้คนรับด้วยไหม
    if (!receiverAmityProfile) {
      receiverAmityProfile = await registerUser(receiverProfile)
    }

    let senderTrueProfile,
      receiverTrueProfile = {}

    senderTrueProfile = await getProfileFromTrue(senderAmityProfile)
    receiverTrueProfile = await getProfileFromTrue(receiverAmityProfile)

    // check friend status from true backend
    // รอถามแม็กว่าเช็กแค่ของคนส่งใช่ไหม
    const isFriend = await checkIsFriend({
      senderId: senderTrueProfile?.users?.userId,
      receiverId: receiverTrueProfile?.users?.userId
    })

    // get sender block list
    // can use getProfileFromAmity or senderAmityProfile
    const senderBlockList = await getBlockList(senderProfile?.userId)

    // find sender user blocked
    const isSenderBlockReceiver = senderBlockList?.some(
      user => user === receiverTrueProfile?.users?.userId
    )

    const response = {
      senderProfile: senderTrueProfile?.users,
      receiverProfile: receiverTrueProfile?.users,
      friendStatus: isFriend?.isFriend,
      blockListStatus: isSenderBlockReceiver
    }

    console.log({
      // senderAmityProfile,
      // receiverAmityProfile,
      // senderTrueProfile,
      // receiverTrueProfile,
      response
    })

    res.send(response)
  } catch (error) {
    console.log(`error msg : ${error}`)
  }
})

// getProfileFromAmity()
// ใช้แบบจำลองเพราะข้อมูลของจริงยังไม่มี blocklist
async function getBlockList () {
  const blockList = {
    metadata: {
      blockList: ['2', '77', '32']
    }
  }
  return blockList?.metadata?.blockList
}

// get profile from amity backend
async function getProfileFromAmity (id) {
  const token = 'a6d30ac240300caecf1b1fabeead75600999a530'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const profileAmity = await axios.get(
      `https://api.amity.co/api/v3/users/${id}`,
      configAuth
    )

    return profileAmity.data
  } catch (error) {
    console.log(`getAmityProfile() msg : ${error}`)
  }
}

//register user
async function registerUser (user) {
  //x-api-key ของ app เก็บเป็น static ไว้ที่ .env
  const configKeys = {
    headers: {
      'x-api-key': 'b0ede9583e88f9364d34de1a5a00158dd50e8ee5b934692f'
    }
  }
  const postData = {
    userId: user?.userId.toString(),
    deviceId: 'deviceId_test',
    deviceInfo: {
      kind: 'ios',
      model: 'model_test',
      sdkVersion: 'sdkVersion_test'
    },
    displayName: user?.displayName.toString(),
    authToken: 'authToken_test'
  }

  try {
    const register = await axios.post(
      'https://api.amity.co/api/v3/sessions',
      postData,
      configKeys
    )
    return register.data
  } catch (error) {
    console.log(`registerUser() msg : ${error}`)
  }
}

// fetch profile from true
// จำลองให้เหมือนของ amity
async function getProfileFromTrue (user) {
  const profile = {
    users: {
      updatedAt: `true ${user?.users[0]?.displayName}`,
      createdAt: `true ${user?.users[0]?.createdAt}`,
      displayName: `true ${user?.users[0]?.displayName}`,
      userId: `${user?.users[0]?.userId}`,
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    }
  }
  return profile
}

// get friend status from true
async function checkIsFriend ({ senderId, receiverId }) {
  const isFriend = {
    isFriend: +senderId > +receiverId ? true : false
  }
  return isFriend
}

module.exports = router

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - profile
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
 *   name: User
 *   description: managing API
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Create Chat Room
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
 *                 $ref: '#/components/schemas/User'
 */
