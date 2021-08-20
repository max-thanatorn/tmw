const express = require('express')
const axios = require('axios')
const router = express.Router()

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
 * /:id:
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

router.get('/', async (req, res) => {
  //get profile from amity backend
  const user = await getProfileAmity(req.params.id)
  console.log('user data from amity backend', user)
  if (!user) {
    //case register
    const register = await registerUser(req.params.id)
    console.log('register User', register)
    const result = await fetchData(register)
    res.send(result)
  } else {
    //case happy flow
    console.log('happy flow')
    const result = await fetchData(user)
    res.send(result)
  }
})

//return function
async function fetchData (data) {
  try {
    const profile = await fetchProfile(data?.users[0]?.userId)
    const isFriend = await checkIsFriend(data?.users[0]?.userId)

    if (!profile && !isFriend) {
      return handlerError(500, 'user not found')
    } else if (!profile) {
      return handlerError(500, 'profile not found')
    } else if (!isFriend) {
      return handlerError(500, 'friend status not found')
    } else {
      const result = {
        profile: profile?.profile,
        isFriend: isFriend?.isFriend,
        blockStatus: data?.users[0]?.metadata
      }
      console.log('result from fetchData', result)
      return result
    }
  } catch (error) {
    return console.log(`fetchData() msg : ${error}`)
  }
}

//get profile from amity backend
async function getProfileAmity (id) {
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
async function registerUser (id) {

  //x-api-key ของ app เก็บเป็น static ไว้ที่ .env
  const configKeys = {
    headers: {
      'x-api-key': 'b0ede9583e88f9364d34de1a5a00158dd50e8ee5b934692f'
    }
  }
  const postData = {
    userId: id,
    deviceId: 'deviceId_test',
    deviceInfo: {
      kind: 'ios',
      model: 'model_test',
      sdkVersion: 'sdkVersion_test'
    },
    displayName: 'displayName_test',
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
    console.log(`getAmityProfile() msg : ${error}`)
  }
}

//fetch profile from true
async function fetchProfile (id) {
  try {
    const profile = await axios.get(
      `https://0596a4bd-7902-4222-9798-26f4e30ba592.mock.pstmn.io/profile/${id}`
    )

    return profile.data
  } catch (error) {
    console.log(`fetchProfile() msg : ${error}`)
  }
}

//fetch friend status from true
async function checkIsFriend (id) {
  try {
    const isFriend = await axios.get(
      `https://0596a4bd-7902-4222-9798-26f4e30ba592.mock.pstmn.io/check-friend/${id}`
    )
    return isFriend.data
  } catch (error) {
    console.log(`checkIsFriend() msg : ${error}`)
  }
}

//custom error message
function handlerError (statusCode, message) {
  const msg = {
    userProfile: {
      status: false,
      statusCode: statusCode,
      message: message
    }
  }
  return {
    statusCode: statusCode,
    body: msg
  }
}

module.exports = router
