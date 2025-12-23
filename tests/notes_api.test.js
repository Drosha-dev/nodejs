const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')

const api = supertest(app)



//flushing about test database and input hardcoded values
beforeEach(async () => {
  await Note.deleteMany({})
  //Mongoose built in
  await Note.insertMany(helper.initialNotes)

  // ###promise.all method
  // const noteObjects = helper.initialNotes
  //   .map(note => new Note(note))
  //   const promiseArray = noteObjects.map(note => note.save())
  //   await Promise.all(promiseArray)
  //
  //## or block version
  // for(let note of helper.initialNotes){
  //   let noteObject = new Note(note)
  //   await noteObject.save()
  // }
})


describe('databaseTests', () => {

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes returned', async () => {
    const response = await api.get('/api/notes')
    // execution gets here only after the HTTP request is complete
    // the result of HTTP request is saved in variable response
    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned note', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert.strictEqual(contents.includes('HTML is easy'), true)
  })

  test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const noteResult = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(noteResult.body, noteToView)
  })

  test ('a valid note can be add' , async () => {
    const newNote = {
      content:'async/await simplifies making async calls',
      important:true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    assert(contents.includes('async/await simplifies making async calls'))
  })

  test('note without content is not added', async () => {
    const newNote = {
      important:true
    }

    await api.post('/api/notes').send(newNote).expect(400)

    //checks database if note above was posted
    const notesAtEnd = await helper.notesInDb()

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
  })

  test('a note can be deleted', async() => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    const contents = notesAtEnd.map(n => n.content)
    assert(!contents.includes(noteToDelete.content))

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length -1)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})