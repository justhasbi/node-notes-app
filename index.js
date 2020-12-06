const express = require('express');
// const http = require('http');
const app = express();

const cors = require('cors')

app.use(cors())

// json parser to handle http post request
// tanpa json parse maka akan menghasilkan body undefined
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint '})
}

app.use(requestLogger)

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
];

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h2>');
});

// get all notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// get note by id
app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id );
    if(note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

// delete note
app.delete('/api/notes/:id', (req, res) => {
    // convert id to number type
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
});

// generate unique ID
const generateId = () => {
    // if notes.lenght > 0, then get the max id
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    // increment id by 1
    return maxId + 1
}

// Post
app.post('/api/notes', (req, res) => {

    const body = req.body
    if(!body.content) {
        return res.status(400).json({ 
            error: 'content missing' 
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }

    notes = notes.concat(note)

    res.json(note)
})

// info
app.get('/info', (req, res) => {
    const day = new Date()
    const noteLength = notes.length
    res.send(`
        <p>Terdapat ${noteLength} postingan</p>
        <p>${day}</p>
    `);
});

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});