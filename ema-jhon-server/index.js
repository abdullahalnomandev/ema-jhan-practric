const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 7000;

app.use(cors());
app.use(express.json());
const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez7qy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productsCollection = client.db("emaJhonStore").collection("products");

  app.post("/addProducts", (req, res) => {
    const product = req.body;
    productsCollection.insertMany(product).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find({})
    .toArray((err, document) => {
      res.send(document);
    });
  });

  app.get("/product/:key",(req,res)=>{
    const productKey=req.params.key;
    console.log(productKey);
    productsCollection.find({key:productKey})
    .toArray((err,document)=>{
      res.send(document[0])
    })
   
  })

  // app.post('/productByKey',(req,res)=>{
  //   const productByKey=req.body
  //   productsCollection.find({key:{$in:productByKey}})
  //   .toArray((err,document)=>{
  //     res.send(document)
  //   })

  // })

  app.get('/',(req,res)=>{
    res.send("Hello")
  })

});

app.listen(port);
