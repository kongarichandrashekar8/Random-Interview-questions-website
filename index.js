var express = require('express')
var app = express()
var crypto = require('crypto');
const bodyparser = require('body-parser')
var MongoClient = require('mongodb').MongoClient
const url = "mongodb://chandrashekar:Kk9381409630@cluster0-shard-00-00.bckwq.mongodb.net:27017,cluster0-shard-00-01.bckwq.mongodb.net:27017,cluster0-shard-00-02.bckwq.mongodb.net:27017/ServiceAssurance?ssl=true&replicaSet=atlas-2ms5x4-shard-0&authSource=admin&retryWrites=true&w=majority";
const dbName = "Questions"
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
var db
const port =process.env.PORT || 3000

app.set('view engine', 'pug');


app.get('/', function(req, res){
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
    client.connect()
    var coll = client.db(dbName).collection('Java');
    coll.countDocuments({}).then((count) => {
        var maximum=parseInt(count);
        var minimum=1;
        var maxBytes = 6;
        var maxDec = 281474976710656;
        var randbytes = parseInt(crypto.randomBytes(maxBytes).toString('hex'), 16);
        let num = Math.floor(randbytes/maxDec*(maximum-minimum+1)+minimum);
        if(num>maximum){
            num = maximum;
        }
        var result = client.db(dbName).collection('Java').findOne({"id": num})
        .then(result=>{
        console.log("Getting Question")
        res.render('index', { title: 'Random Question', message: result.question});
        //res.json(result.question).toString()
        
        
        })
        
            
    });
    
    
})


app.get('/k', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
  });


app.post('/addquestion', function(req, res){
    if( req.body.question == undefined ){
        res.json("Enter valid data.")
    }
    
    else{
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
        client.connect()
        var exists=false
        var result = client.db(dbName).collection('Java').findOne({"question": req.body.question})
            .then(result=>{
                if(result==null)
                {
                
                    var coll = client.db(dbName).collection('Java');
                    coll.countDocuments({}).then((count) => {
                    client.db(dbName).collection('Java').insertOne({"id": parseInt(count)+1, "question": req.body.question})
                    console.log(`Adding Question with ID: ${parseInt(count)+1},question: ${ req.body.question}`)
                    res.json("Data saved.")
            
                });
                }
                else{
                    res.json("This question already exists")
                }
            })   
    }
})

app.listen(port,()=>{
    console.log(`Listenting to port ${port}`)
})








