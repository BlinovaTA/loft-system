const Message = require('./db-models/message')

const connectedUsers = {}

const save = async (message, senderId, recipientId) => {
  await new Message({
    senderId,
    recipientId,
    messages: [message],
  }).save()
}

const saveMessages = async (message, senderId, recipientId) => {
  try {
    await save(message, senderId, recipientId)
    await save(message, recipientId, senderId)
  } catch (err) {
    console.log(err)
  }
}

const update = async (message, senderId, recipientId) => {
  await Message.findOneAndUpdate(
    { senderId, recipientId },
    { $push: { messages: message } },
    { new: true }
  )
}

const updateMessages = async (message, senderId, recipientId) => {
  try {
    await update(message, senderId, recipientId)
    await update(message, recipientId, senderId)
  } catch (err) {
    console.log(err)
  }
}

const saveMessageToDb = async (message) => {
  try {
    const { senderId, recipientId } = message
    const correspondence = await Message.findOne({ senderId, recipientId })

    correspondence
      ? await updateMessages(message, senderId, recipientId)
      : await saveMessages(message, senderId, recipientId)
  } catch (err) {
    console.log(err)
  }
}

const getMessageFromDb = async ({ recipientId, userId }) => {
  try {
    return await Message.findOne({ recipientId, senderId: userId })
  } catch (err) {
    console.log(err)
  }
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    const socketId = socket.id
    console.log('user connected')

    socket.on('users:connect', ({ userId, username }) => {
      const user = { socketId, userId, username }

      connectedUsers[socketId] = user

      socket.emit('users:list', Object.values(connectedUsers))
      socket.broadcast.emit('users:add', user)
    })

    socket.on('message:add', async (data) => {
      socket.emit('message:add', data)
      socket.broadcast.to(data.roomId).emit('message:add', data)

      await saveMessageToDb(data)
    })

    socket.on('message:history', async (data) => {
      const historyMessage = await getMessageFromDb(data)

      socket.emit('message:history', historyMessage.messages)
    })

    socket.on('disconnect', () => {
      delete connectedUsers[socketId]
      socket.broadcast.emit('users:leave', socketId)
    })
  })
}
