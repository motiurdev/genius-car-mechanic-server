const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require("cors")
const objectId = require('mongodb').ObjectId
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// midleWare
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aobjx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMachnices");
        const servicesCollection = database.collection("services");

        // post get 
        app.get("/services", async (req, res) => {
            const data = await servicesCollection.find({}).toArray()
            res.send(data)
        })

        // get one 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const item = { _id: objectId(id) };
            const result = await servicesCollection.findOne(item)
            res.send(result)
        })

        // post api
        app.post("/addservices", async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            res.json(result)
        })

        // delete api
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const item = { _id: objectId(id) };
            const result = await servicesCollection.deleteOne(item)
            res.send(result)
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Runging Genius car")
})

app.listen(port, () => {
    console.log("listening to port", port);
})

// user: geniusCar
// pass: 1rbiemElFHyxQYeZ