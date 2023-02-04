serviceAccount = require('./cashaam-dev-firebase-adminsdk-wvlo9-a16bfe900c.json')
const admin = require('firebase-admin')
const { initializeApp} = require('firebase-admin/app');

require('dotenv').config();


  
const projectId = process.env.PROJECT_ID;
initializeApp({
    credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${projectId}.firebaseio.com`, // check it under service accounts
  storageBucket: `${projectId}.appspot.com`, //check it in script snippet require to add to your website.
})
const WHATSAPP_MSG = process.env.WHATSAPP_MSG
const db = admin.firestore()
const colref = db.collection(WHATSAPP_MSG)





module.exports = {colref}