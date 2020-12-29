import express from 'express';
import mongo from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
const MongoClient = mongo.MongoClient;
const port = process.env.PORT || 9900;
const isLocal = process.env.isLocal || true;
const uri = "mongodb+srv://admin:mongo@123@cluster0-f8vmc.mongodb.net/shoppingcart?retryWrites=true&w=majority";

app.use(cors());
let db;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.get('/',(req,res) => {
    res.send('Health Check Working')
});

//category
app.get('/category',(req,res) => {
    db.collection('category').find({}).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result)
    })
});

//products
app.get('/products',(req,res) => {
    var query = {};
    if(req.query.id){
        query={"_id":req.query.id}
    }
    db.collection('products').find(query).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result)
    })
});

//product wrt category
app.get('/product/:id',(req,res) => {
    var sortoption = {cost:1}
    if(req.query.price){
        if(req.query.price == "1" || req.query.price == "-1"){
            sortoption={cost:Number(req.query.price)}
        }else{
            sortoption = {cost:1}
        }
    }else if(req.query.rating){
        if(req.query.rating == "1" || req.query.rating == "-1"){
            sortoption={rating:Number(req.query.rating)}
        }else{
            sortoption = {rating:1}
        }
    }
    db.collection('products').find({"category":Number(req.params.id)}).sort(sortoption).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result)
    })

})

//offers
app.get('/offers',(req,res) => {
    db.collection('specialoffers').find({}).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result)
    })
});

//PlaceBooking
app.post('/booking',(req,res) => {
    db.collection('booking').insertOne(req.body,(err,result) => {
        if(err){
            throw err
        }else{
            res.status(200).send('dated added')
        }
    })
});

//booking
app.get('/booking',(req,res) => {
    var query = {}
    if(req.query.username){
        query = {"id":req.query.username}
    }
    db.collection('booking').find(query).toArray((err,result) => {
        if(err) throw err;
        res.status(200).send(result)
    })
});


MongoClient.connect(uri,{useUnifiedTopology: true},(err,connection) => {
    if(err) console.log(err);
    db=connection.db('shoppingcart');
    app.listen(port,(err) => {
        if(err) throw err;
        console.log(`Server is running on port ${port}`)
    })
});