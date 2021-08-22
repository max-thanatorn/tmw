const express = require('express')
const axios = require('axios')
const router = express.Router()

router.put('/', async (req, res) => {
  try {
    const { message, updateToStatus } = req.body

    const searchMesseage = await getMessage(message?.id)
    console.log({ message, updateToStatus, searchMesseage })
    if (!searchMesseage) {
      console.log('message not found')
      res.send('message not found')
    } else {
      const updateStatus = await updateMessage({
        id: searchMesseage[0]?.messageId,
        status: updateToStatus
      })

      const { messageId, data } = updateStatus

      const response = {
        message: {
          id: messageId,
          data: data.text,
          metadata: {
            type: 'transfer',
            status: data.text
          }
        }
      }
      console.log(response)
      return response
    }
  } catch (error) {
    console.log(`error msg : ${error}`)
  }
})

// บอกแม็กว่าใช้ path ที่ส่ง params
async function getMessage (id) {
  const token = 'a6d30ac240300caecf1b1fabeead75600999a530'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const msg = await axios.get(
      `https://api.amity.co/api/v3/messages/${id}`,
      configAuth
    )
    return msg.data?.messages
  } catch (error) {
    console.log(`getMessage() msg : ${error}`)
  }
}

// คุยกับแม็กเรื่อง response ให้เพิ่ม status ต่อจาก data.text
async function updateMessage ({ id, status }) {
  const token = 'a6d30ac240300caecf1b1fabeead75600999a530'

  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const updateData = {
    data: {
      text: status.toString()
    }
  }

  try {
    const msg = await axios.put(
      `https://api.amity.co/api/v3/messages/${id}`,
      updateData,
      configAuth
    )
    return msg.data?.messages[0]
  } catch (error) {
    console.log(`updateMessage() msg : ${error}`)
  }
}

module.exports = router
