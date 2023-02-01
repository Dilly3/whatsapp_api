require('dotenv').config();
var bodyParser = require('body-parser')



const express = require("express");
const VERIFY_TOKEN = process.env.VERIFY_TOKEN
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NO_ID = process.env.PHONE_NO_ID
const PORT = process.env.PORT || 8000;


const EventEmitter = require('events');
const emitter = new EventEmitter()
emitter.setMaxListeners(60)
const app = express();
app.use(express.json(),bodyParser.urlencoded({extended:false}))

app.get('/webhook', (req, res) => {
    if (
      req.query['hub.mode'] == 'subscribe' &&
      req.query['hub.verify_token'] == VERIFY_TOKEN
    ) {
      console.log("Webhook Verified")
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
   })



app.listen(PORT, ()=>{console.log(`listening on port: ${PORT}`)})
