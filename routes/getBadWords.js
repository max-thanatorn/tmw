const express = require('express')
const router = express.Router()
require('dotenv').config()

router.get('/', async (req, res) => {
  try {
    const { BAD_WORDS } = process.env
    res.send(BAD_WORDS)
  } catch (error) {
    console.log(`msg : ${error}`)
    res.sendStatus(500)
  }
})

module.exports = router
