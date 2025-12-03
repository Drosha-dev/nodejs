require('dotenv').config();
const express = require('express')
const Note = require('./models/notes')
const app = express();


const requestLogger = (request, response, next) => {
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




app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
})
// GET all notes
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    })
})

//GET specific note from mongo DB
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error))
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
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error))
})
//depreciated id generator
const generateId = () => {
    //easy max id, Remember "...notes" is taking a copy of the notes array
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
    return String(maxId + 1)
}
// Post request by creating object and then concatin to array

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
app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if (!body.content) {
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
    .catch(error => next(error))
})

//PUT to update notes imprortance

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body

    Note.findById(request.params.id)
        .then(note => {
            if (!note) {
                return response.status(404).end();
            }
        
        note.content = content
        note.important = important
        
        return note.save().then(updatedNote => {
            response.json(updatedNote);
        })    
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unkown Endpoint' })
}

app.use(unknownEndpoint);


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler);


// const app = http.createServer((request, response) => {
//     response.writeHead(200,{ 'Content-Type': 'application/json'})
//     response.end(JSON.stringify(notes))
// })
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})
