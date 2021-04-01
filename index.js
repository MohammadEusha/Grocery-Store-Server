
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId
const app = express()
app.use(cors())
app.use(bodyParser.json())


const port = 5000


require('dotenv').config()

console.log(process.env.DB_USER)

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eax0o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("groceryStore").collection("products");
    const boughtProducts = client.db("groceryStore").collection("boughtProducts");
    console.log('database Connected');



    app.post('/addEvent', (req, res) => {
        const newEvent = req.body
        console.log('adding event', newEvent)
        productsCollection.insertOne(newEvent)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addToCart', (req, res) => {
        const newAddToCart = req.body
        boughtProducts.insertOne(newAddToCart)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })

    app.get('/cart', (req, res) => {
        boughtProducts.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })

    })



    // app.post('/addProducts', (req, res) => {
    //     const products = req.body;
    //     productsCollection.insertMany(products)
    //         .then(result => {
    //             console.log(result)
    //             res.send(result.insertedCount)
    //         })
    // })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    app.delete('/delete/:id', (req, res) => {
        productsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)

            })
    })


});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)