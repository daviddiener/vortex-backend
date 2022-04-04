import mongoose from 'mongoose'
const {Schema} = mongoose;

/**
 * Create database scheme for scores
 */
const scoreSchema = new Schema({
  _id: {
    type: String
  },
  username: {
    type: String
  },
  score: {
    type: Number
  }
})

export default mongoose.model('Score', scoreSchema)