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

   app.post('/webhook',(req,res)=>{
    //console.log(req.body.entry[0].changes[0].value.contacts[0].profile.name)
    //console.log(req.body.entry[0].changes[0].value.metadata)
    //entry[0].changes[0].value.messages[0].from.slice(1)
        const{object}  = req.body
      
          
            const {phone_no_id,display_phone_no,from,sender_name} = unpackRequestBody(req.body)
                 
        
  
                  // const data = {
                  //     phone_no_id,
                  //     phone_number :from,
                  //     message_body,
                  //     timestamp : format.formatRFC7231(new Date(),'YYYY/MM/dd hh:mm:ss')
                  // }
                  // saveData(colRef,data)
                 
                   sendReply(PHONE_NO_ID, WHATSAPP_TOKEN,from,sender_name)
                   .then((response=>{
                           const {messages} = response.data
                        
                            res.json({'messageID' : `${messages[0].id}`})
                           })
                   ).catch((err)=>{ 
                    
                    res.json({'Errormessage' : `${err}`})
                  })        
                   
                   
  })



app.listen(PORT, ()=>{console.log(`listening on port: ${PORT}`)})
