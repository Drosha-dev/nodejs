const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const noteSchema = new mongoose.Schema({
  // can also add validation here from mongoose
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  important: Boolean
})
// Transforming the returned object to modify _id to id and removing __v
noteSchema.set('toJSON' , {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)