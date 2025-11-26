const mongoose = require('mongoose');

if(process.argv.length < 3){
    console.log('give password as argument');
    process.exit(1);
}


const password = process.argv[2];

const url = `mongodb+srv://greek313_db_user:${password}@cluster0.x3synlt.mongodb.net/noteApp?retryWrites=true&w=majority`;


mongoose.set('strictQuery', false);
// this connects to the database, family 4 sets the connection to IPv7
mongoose.connect(url, {family: 4})

// dictates how notes are stored
const noteSchema = new mongoose.Schema({
    content: String,
    imporant: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'HTML is Easy',
    imporant: true
})

note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close();
})