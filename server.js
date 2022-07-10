// Require the express module and create a new express application
const express = require('express');
const app = express();
const port = 3000;
const expressLayouts = require('express-ejs-layouts')
const path = require("path");
const {ObjectId} = require("mongodb");

// Static Middleware
app.use(express.static('public'))
// Parse body of request as JSON and make it available as req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create connection to database with MongoClient and use the database called 'star-wars-quotes'
const MongoClient = require('mongodb').MongoClient
const mongoUrl = "mongodb+srv://star-wars:supersecret@cluster0.vx4fkdg.mongodb.net/?retryWrites=true&w=majority";
const dbName = "star-wars-quotes";
const client = new MongoClient(mongoUrl, {useNewUrlParser: true});
const db = client.db(dbName);

// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layouts/full-width')
app.set('view engine', 'ejs')

// Error handling for database connection
client.connect(err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});

// Routes
app.get('', (req, res) => {
    // Find all documents in the quotes collection
    db.collection(dbName).find({}).toArray((err, docs) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        // Render the index.ejs template with the quotes variable
        res.render('index', { title: 'Star wars quote - Accueil', page: 'home', quotes: docs });
    });
})

// Add Routes (render)
app.get('/add', (req, res) => {
    res.render('add', { title: 'Star wars quote - Ajouter', page: 'add' })
})

// Edit route (render)
app.get('/edit/:id', (req, res) => {
    // Find the document with the id in the quotes collection
    db.collection(dbName).findOne({ _id: ObjectId(req.params.id) }, (err, doc) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(doc)
        // Render the edit.ejs template with the quote variable
        res.render('edit', { title: 'Star wars quote - Modifier', page: 'edit', quote: doc });
    }
    )
});

// POST request to add a new quote to the database
app.post('/api/quotes/add', (req, res) => {
    // Parse body of request as JSON and make it available as req.body
    db.collection(dbName).insertOne(req.body, (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        // Redirect to the home page
        res.redirect('/');
    });
});

// PUT request to update a quote in the database
app.put('/api/quotes/edit/:id', (req, res) => {
    // Find the document with the id in the quotes collection
    db.collection(dbName).findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $set: req.body }, (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.status(200).send('OK');
    })
});

// DELETE request to delete a quote
app.delete('/api/quotes/:id/delete', (req, res) => {
    const id = req.params.id;
    db.collection(dbName).deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.redirect('/');
    });
});

// Launch the server on port 3000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

