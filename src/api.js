const express = require("express")
const serverless = require("serverless-http")
const { collection, ObjectId } = require("../config/database")

const app = express()
const router = express.Router()

// needed for adding a document 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// router.get("/", (req, res) => {
//     //res.send("User List")
//     collection.find().toArray((err, result) => {
//         if (err) throw err;
//         res.json(result)
//     })
// })

router.get("/", (req, res, next) => {
    //res.send("User List")
    //https://rest-api-express-mongodb.netlify.app/.netlify/functions/api/
    res.header("Access-Control-Allow-Origin", "rest-api-express-mongodb.netlify.app"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    collection.find().toArray((err, result) => {
        if (err) throw err;
        res.json(result)
    })
})

router.post("/", (req, res) => {
    // res.send("Create New User")
     collection.insertOne(req.body, (err, res) => {
         if (err) throw err;
     })
    res.send("1 document inserted.")
 })
 
 router
     .route("/:id")
     .get((req, res) => {
        //res.send(`Get a User with ID: ${req.params.id}`)
        const query = {
             _id: ObjectId(req.params.id)
        }
        collection.findOne(query, (err, result) => {
             if (err) throw err;
             res.send(result)
        })
     })
     .put((req, res) => {
         //res.send(`Update a User with ID: ${req.params.id}`)
         const query = { _id: ObjectId(req.params.id) }
         let newvalues = { $set: req.body };
         collection.updateOne(query, newvalues, (err, result) => {
             if (err) throw err;
         })
         res.send("1 document updated.")
     })
     .delete((req, res) => {
         //res.send(`Delete a User with ID: ${req.params.id}`)
         const query = { _id: ObjectId(req.params.id) }
         collection.deleteOne(query, (err, result) => {
             if (err) throw err;
         })
         res.send("1 document deleted.")
     })

app.use("/.netlify/functions/api", router)
module.exports.handler = serverless(app)
