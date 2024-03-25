import {
  User
} from '../database.js'

const create = async (username, password, email) => {
  const user = new User({ username, password, email })
  await user.save()
  return user
}

const getUserByCredentials = async (username, password) => {
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('User not found')
  }
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new Error('Password is incorrect')
  }
  return user
}

export { create, getUserByCredentials }
