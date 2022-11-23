const express=require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//console.log(process.env.DB_USER)
//console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cifvw1u.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('photoGallery').collection('services');
        const reviewCollection = client.db('photoGallery').collection('reviews');
    
        app.get('/services', async (req,res)=>{
            const query ={}
            const cursor = serviceCollection.find(query);
            const services = await cursor.sort({_id: -1}).toArray();
            res.send(services);
        })

        app.get('/home', async (req,res)=>{
            const query ={}
            const cursor = serviceCollection.find(query);
            const services = await cursor.sort({_id: -1}).limit(3).toArray();
            res.send(services);
        })

        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        /* Add Service */
        app.post('/addservice', async(req, res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        /* Review */
        app.post('/reviews', async(req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews', async (req,res)=>{
            const query ={}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.sort({_id: -1}).toArray();
            res.send(reviews);
        })

        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const review = await reviewCollection.deleteOne(query);
            res.send(review);
        })

        app.get('/reviews/:id', async (req,res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const review = await reviewCollection.findOne(query);
            res.send(review);
        })

        app.put('/update', async(req,res) => {
            const body = req.body;
            console.log(body)
            const options = {upsert: true};
            const id = body.id;
            const query = {_id: ObjectId(id)};
            const updateDoc = {
                $set: {
                    review: body.review
                }
            }
            const result = await reviewCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })
    }
    finally{

    }
}

run().catch(err=>console.error(err));


app.get('/',(req,res)=>{
    res.send('Services API Running');
});

app.listen(port,()=>{
    console.log(`Services server running on port,${port}`);
});