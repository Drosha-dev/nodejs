require('dotenv').config
const express = require('express')
const Note = require('./models/notes')



const app = express();


// mongoose connection and dictating how notes are stored
const password = process.argv[2];

//const url = `mongodb+srv://greek313_db_user:${password}@cluster0.x3synlt.mongodb.net/noteApp?retryWrites=true&w=majority`;




let notes = [
    {
        id: "1",
        content:'HTML is easy',
        important: true
    },
    {
        id: "2",
        content:'Browser can execute only JavaScript',
        important: false
    },
    {
        id: "3",
        content:'GET and POST are the most important methods of HTTP protocol',
        important: true
    },
]

const requestLogger = (request,response,next) => {
    console.log('Method', request.method);
    console.log('Path', request.path);
    console.log('Body', request.body);
    console.log('---');
    next()
}

// This allows us to use the json parser in express lower in our code
app.use(express.json())
app.use(requestLogger)
// app.use(cors())
app.use(express.static('dist'))


app.get('/', (request,response) => {
    response.send('<h1>Hello World!</h1>');
})
// GET all notes
app.get('/api/notes', (request,response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    })
})

 //GET specific note from mongo DB
 app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

// GET specific note conveting id and looking up through notes array
// app.get('/api/notes/:id', (request, response) => {
//     //Needed to convert the request data into a number
//   const id = Number(request.params.id);
//   const note = notes.find(note => note.id === id);
//   if(note) {
//     response.json(note);
//   } else {
//     response.status(404).end();
//   }
// })
// delete
app.delete('/api/notes/:id', (request,response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
})
//depreciated id generator
const generateId = () => {
    //easy max id, Remember "...notes" is taking a copy of the notes array
    const maxId = notes.length > 0 ? Math.max(...notes.map(n=> Number(n.id))) : 0
    return String(maxId + 1)
}
// POST request by creating object and then concatin to array

// app.post('/api/notes', (request,response) => {
//     const body = request.body
//     if(!body.content){
//         return response.status(400).json({
//             error: 'content missing'
//         })
//     }
//     const note  = {
//         id: generateId(),
//         content: body.content,
//         important: body.important || false,
//     }
//     notes = notes.concat(note)
//     response.json(note)
//  })
//post request mongo DB
app.post('/api/notes', (request,response) => {
    const body = request.body

    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote);
    })
})

const unknownEndpoint= (request,response) => {
    response.status(404).send({error: 'Unkown Endpoint'})
}

app.use(unknownEndpoint);




// const app = http.createServer((request, response) => {
//     response.writeHead(200,{ 'Content-Type': 'application/json'})
//     response.end(JSON.stringify(notes))
// })
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})
