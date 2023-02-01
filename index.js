require('dotenv').config();
var bodyParser = require('body-parser')
const {responseJson,sendReply,querySchema,unpackRequestBody} = require('./utility/helperfunc')



const express = require("express");
const VERIFY_TOKEN = process.env.VERIFY_TOKEN
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NO_ID = process.env.PHONE_NO_ID
const PORT = process.env.PORT || 8000;


const EventEmitter = require('events');
const emitter = new EventEmitter()
emitter.setMaxListeners(0)
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

   app.post('/webhook',  (req,res)=>{
   
        const{object,entry}  = req.body
        if(object === 'whatsapp_business_account'  && entry !== undefined){
             
                     unpackRequestBody(req.body).then(data=>{
                        const {sender_number,sender_name} = data
                        return sendReply(PHONE_NO_ID, WHATSAPP_TOKEN,sender_number,sender_name)
                    }).then((response=>{
                        const {messages} = response.data
                     
                         res.json({'messageID' : `${messages[0].id}`})
                        })
                ).catch((err)=>{ 
                 
                 res.json({'Errormessage' : `${err}`})
               })      
                    
                    
                    
            
                   }
               })
               
        



app.listen(PORT, ()=>{console.log(`listening on port: ${PORT}`)})
