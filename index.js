require ('dotenv').config ();
const {format} = require ('date-fns');
const express = require ('express');
const bodyParser = require ('body-parser');
const EventEmitter = require ('events');
const {colref, msgRef, sellerRef} = require ('./database/config');
const {sendReply, unpackRequestBody} = require ('./utility/helperfunc');

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NO_ID = process.env.PHONE_NO_ID;
const PORT = process.env.PORT || 8000;

const app = express ();
app.use (express.json (), bodyParser.urlencoded ({extended: false}));

const emitter = new EventEmitter ();
emitter.setMaxListeners (50);

const {Store} = require ('./service/message-repo'); //
const msg_store = new Store (); //

// endpoint to receive message from whatsapp api
app.get ('/webhook', (req, res) => {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == VERIFY_TOKEN
  ) {
    console.log ('Webhook Verified');
    res.send (req.query['hub.challenge']);
  } else {
    res.sendStatus (400);
  }
});

// endpoint to send message to whatsapp number via whatsapp api
app.post ('/webhook', (req, res) => {
  let message_body1 = '';
  const {object, entry} = req.body;
  if (object === 'whatsapp_business_account' && entry !== undefined) {
    // unpack payload received from whatsapp api
    unpackRequestBody (req.body)
      .then (data => {
        const {
          sender_number,
          sender_name,
          body1: message_body,
          timestamp1: timestamp,
        } = data;
        message_body1 = message_body;
        //save message to database
        msg_store
          .addDocument_whasapp ({
            sender_name,
            phone_number: sender_number,
            message_body: message_body,
            timestamp: new Date (),
          })
          .then (data => {})
          .catch (err => {
            console.log (err);
          });

        return sendReply (
          PHONE_NO_ID,
          WHATSAPP_TOKEN,
          sender_number,
          sender_name,
          false,
          message_body
        );
      })
      .then (response => {
        const {messages, contacts} = response;

        res.json ({
          messageID: `${messages[0].id}`,
          sender_phone_number: `${contacts[0].wa_id}`,
          message_body: `${message_body1}`,
        });
      })
      .catch (err => {
        res.json ({Errormessage: `${err}`});
      });
  }
});

let docid = '';

// check for update on database
// if there is change on database then respond with a reply message
msgRef.orderBy ('updatedAt', 'asc').onSnapshot (snapshot => {
  msg_store
    .onChanges (snapshot)
    .then (data => {
      if (data.sellerInfo) {
        const {docid} = data.sellerInfo;
        console.log (docid);
        const {
          phoneNumber,
          firstName,
          sellerUnread,
        } = data.sellerInfo.sellerInfo;
        //send reply to sender
        sendReply (PHONE_NO_ID, WHATSAPP_TOKEN, phoneNumber, firstName, true);
        msg_store.msgRef.doc (docid).set (
          {
            sellerUnread: 0,
          },
          {merge: true}
        );
      } else {
      }
    })
    .catch (err => console.log (err));
});

const message = {
  updatedAt: new Date (),
  sellerAvatar: '',
  buyerId: 'eff12345678982',
  buyerAvatar: '',
  sellerUnread: 2,
  sellerId: 'DrLy4UmACRUIPn9ALYD7sL3YmDt2',
  sellerName: 'xabac Richie',
  buyerName: 'jacob dean3000',
};

app.listen (PORT, () => {
  console.log (`listening on port: ${PORT}`);
});
