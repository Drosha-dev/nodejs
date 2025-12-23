const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can only execute Javascript',
    important: true,
  },
]


const nonExisitingId = async () => {
  const note = new Note({ content:'willRemoveSoon' })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})

  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExisitingId, notesInDb
}