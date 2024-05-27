const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
const projectRouter = require('./routes/project')
const inviteRouter = require('./routes/invite')

require('dotenv').config()
const app = express()

app.use(cors({
    origin: true,
}))
app.use(express.json())
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/projects', projectRouter);
app.use('/api/invites', inviteRouter);

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch((error) => console.log(error))

app.listen(3000, () => console.log('Server running on port 3000'))