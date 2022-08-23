const mongoose = require('mongoose')
const { Schema } = mongoose

const urlSchema = new Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: String,
    required: true
  }
})

urlSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Url = mongoose.model('Url', urlSchema)

module.exports = Url