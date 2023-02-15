serviceAccount = require('./admin.json')
const admin = require('firebase-admin')
const { initializeApp } = require('firebase-admin/app');

require('dotenv').config();



const projectId = process.env.PROJECT_ID;
initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${projectId}.firebaseio.com`, // check it under service accounts
  storageBucket: `${projectId}.appspot.com`, //check it in script snippet require to add to your website.
})
const WHATSAPP_MSG = process.env.WHATSAPP_MSG
const MESSAGE = process.env.MESSAGES
const SEL_ACCT = process.env.SELL_ACCOUNTS
const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })
const colref = db.collection(WHATSAPP_MSG)
const msgRef = db.collection(MESSAGE)
const sellerRef = db.collection(SEL_ACCT)






module.exports = { colref, msgRef, sellerRef }