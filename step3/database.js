import mongoose from 'mongoose'

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id
    delete converted.__v
  }
})

const whisperSchema = new mongoose.Schema({
  message: String
})

const Whisper = mongoose.model('Whisper', whisperSchema)

export {
  Whisper
}
