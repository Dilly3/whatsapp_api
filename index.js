require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser')
const EventEmitter = require('events');
const {sendReply,unpackRequestBody} = require('./utility/helperfunc')


const VERIFY_TOKEN = process.env.VERIFY_TOKEN
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NO_ID = process.env.PHONE_NO_ID
const PORT = process.env.PORT || 8000;


const emitter = new EventEmitter()
emitter.setMaxListeners(50)


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


app.post('/webhook', (req, res) => {
    let message_body1 = ""
    const { object, entry } = req.body
    if (object === 'whatsapp_business_account' && entry !== undefined) {

        unpackRequestBody(req.body)
        .then(data => {
            const { sender_number, sender_name, body1:message_body } = data
            message_body1 = message_body
            return sendReply(PHONE_NO_ID, WHATSAPP_TOKEN, sender_number, sender_name, message_body)
        }).then((response => {
            const { messages,contacts } = response.data
            
            
            res.json({ 'messageID': `${messages[0].id}`, sender_phone_number : `${contacts[0].wa_id}`, "message_body" : `${message_body1}` })
        })
        ).catch((err) => {

            res.json({ 'Errormessage': `${err}` })
        })

    }
})


app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})
