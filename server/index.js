const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch((error) => console.log(error))

app.listen(3000, () => console.log('Server running on port 3000'))