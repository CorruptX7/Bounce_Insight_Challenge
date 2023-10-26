const express = require('express')
const axios = require('axios')
const app = express()
const path = require('path')

app.get('/country', async (req, res) => {
  try {
    // define country variable
    const { country } = req.query

    if (!country) {
      return res.status(400).json({ error: 'Missing country parameter' })
    }

    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${country}`
    )
    res.json(response.data)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Unable to fetch data from the external API' })
  }
})

app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
