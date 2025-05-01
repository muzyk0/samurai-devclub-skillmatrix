const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors())
app.use(bodyParser.json());

let items = [];
let nextId = 1;

// CREATE
app.post('/items', (req, res) => {
    const { title } = req.body;
    const newItem = { id: nextId++, title };
    items.push(newItem);
    res.status(201).json(newItem);
});

// READ ALL
app.get('/items', (req, res) => {
    res.json(items);
});

// READ ONE
app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === +req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
});

// UPDATE
app.put('/items/:id', (req, res) => {
    const item = items.find(i => i.id === +req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    item.title = req.body.title;
    res.json(item);
});

// DELETE
app.delete('/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === +req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Not found' });
    const deleted = items.splice(index, 1);
    res.json(deleted[0]);
});

app.listen(port, () => {
    console.log(`CRUD app listening at http://localhost:${port}`);
});
