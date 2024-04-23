const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6irp4bx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();



        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("coffeeUser");
        const userCollection = database.collection("user");


        app.get('/coffee', async(req, res) =>{
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        app.get('/coffee/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })



        app.put('/coffee/:id', async(req, res) =>{
            const id = req.params.id;
            const updateCoffee = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const coffee = {
                $set:{
                    name: updateCoffee.name,
                     quantity: updateCoffee.quantity,
                      supplier: updateCoffee.supplier, 
                      test: updateCoffee.test, 
                      category: updateCoffee.category, 
                      details: updateCoffee.details, 
                      photo: updateCoffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result)


            console.log('coffee',updateCoffee)
        })



        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log('new-coffee', newCoffee)
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })



        app.delete('/coffee/:id', async(req, res) =>{
            const id = req.params.id;
            const query= { _id: new ObjectId(id)};
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
            console.log('delete id',id)
        })


        // user related api

        app.get('/user', async(req, res) =>{
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.post('/user', async(req, res) =>{
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result);
        })

        app.patch('/user', async(req, res) =>{
            const user = req.body;
            const filter = {email: user.email}
            const updatedDoc = {
                $set: {
                    lastLoggedAt: user.lastLoggedAt
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })


        app.delete('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const query= { _id: new ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result)
            console.log('delete id',id)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('coffee server running')
})

app.listen(port, () => {
    console.log(`Coffee server running on port ${port}`)
})