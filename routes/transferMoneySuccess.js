const express = require('express')
const axios = require('axios')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const transfer = req.body

    const updateMessage = await updateMessageStatus(transfer)
    console.log('updateMessage', updateMessage)

    if (updateMessage) {
      const sendNoti = await sendMessageNotification(transfer)
      if (sendNoti) {
        res.send('sendNoti')
      } else {
        res.send('xxxxx')
      }
    } else {
      res.send('qqqq')
    }
  } catch (error) {
    console.log(`msg : ${error}`)
  }
})

// update message
async function updateMessageStatus (data) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjBmZGFlNGI4M2MzYzdkOWRiOWNhNDkwNGI4NmYxMzcwYTQ1MzUzNjE5Yzk5ODMxMDAzMTA1NTQyYzljOTk3MGE2NzI0ZTRmNjE4MzAwZDc0MjU3ZmM3NzU4OWE0NjI2OTVmMjc2MGZhNTkwOTU4ZmI5M2NiZWU5ZTU2ZjA0ZjMzZGI2NDM0YmQxOGQ3OTE1Mjg3NjllMzZmMWFhYzQ0NzlhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwN2FiMjMwMmI1MDliOTNiNTA4YTg1YmI0MGMyNWNjNmY1ZWU3MmUyYzM2MzIxZTk1IiwiaWF0IjoxNjI5NzgxODIzLCJleHAiOjE2NjEzMTc4MjN9.fESNbJwfreR_3L0YIl9JYVhK-ZO-5kXLtX8pTtzEQhE'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const postData = {
    message: {
      id: data?.messageId,
      data: 'kkkkkk',
      metadata: {
        type: 'transfer',
        status: 'request'
      }
    },
    updateToStatus: 'paid'
  }

  try {
    const updateMsg = await axios.put(
      'http://localhost:4000/updateMessageStatus',
      postData,
      configAuth
    )
    console.log('updateMsg', updateMsg.status)
    return updateMsg
  } catch (error) {
    console.log(`updateMessageStatus() msg : ${error}`)
  }
}

// send notification
async function sendMessageNotification (data) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjBmZGFlNGI4M2MzYzdkOWRiOWNhNDkwNGI4NmYxMzcwYTQ1MzUzNjE5Yzk5ODMxMDAzMTA1NTQyYzljOTk3MGE2NzI0ZTRmNjE4MzAwZDc0MjU3ZmM3NzU4OWE0NjI2OTVmMjc2MGZhNTkwOTU4ZmI5M2NiZWU5ZTU2ZjA0ZjMzZGI2NDM0YmQxOGQ3OTE1Mjg3NjllMzZmMWFhYzQ0NzlhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwN2FiMjMwMmI1MDliOTNiNTA4YTg1YmI0MGMyNWNjNmY1ZWU3MmUyYzM2MzIxZTk1IiwiaWF0IjoxNjI5NzgxODIzLCJleHAiOjE2NjEzMTc4MjN9.fESNbJwfreR_3L0YIl9JYVhK-ZO-5kXLtX8pTtzEQhE'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const postData = {
    message: {
      id: data?.messageId,
      text: 'Hello world to 29.'
    },
    senderProfile: {
      displayName: 'I am 35',
      userId: data?.sender,
      metadata: {
        blockList: ['1', '23']
      },
      avatarFileId: null
    },
    receiverProfile: {
      displayName: 'I am 29',
      userId: data?.receiver,
      metadata: {},
      avatarFileId: null
    }
  }

  try {
    const sendNoti = await axios.post(
      'http://localhost:4000/sendMessageNotification',
      postData,
      configAuth
    )
    console.log('sendNoti.data', sendNoti.data)
    return sendNoti.data
  } catch (error) {
    console.log(`sendMessageNotification() msg : ${error}`)
  }
}

module.exports = router
