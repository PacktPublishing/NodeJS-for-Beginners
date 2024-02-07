import mongoose from 'mongoose'
import {
  Whisper
} from '../database.js'

const ensureDbConnection = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI)
    }
  } catch (error) {
    console.error('Error connecting to the database:', error)
    throw error
  }
}
const closeDbConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect()
  }
}
const restoreDb = () => Whisper.deleteMany({})
const populateDb = () => Whisper.insertMany([{ message: 'test' }, { message: 'hello world' }])
const getFixtures = async () => {
  const data = await Whisper.find()
  const whispers = JSON.parse(JSON.stringify(data))
  const inventedId = '64e0e5c75a4a3c715b7c1074'
  const existingId = data[0].id
  return { inventedId, existingId, whispers }
}
const normalize = (data) => JSON.parse(JSON.stringify(data))

export { restoreDb, populateDb, getFixtures, ensureDbConnection, normalize, closeDbConnection }
