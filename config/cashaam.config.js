const admin = require("firebase-admin");
require('dotenv').config();
const serviceAccount = require("./cashaam-dev-firebase-adminsdk-wvlo9-a16bfe900c.json");

const projectId = process.env.PROJECT_ID;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${projectId}.firebaseio.com`, // check it under service accounts
  storageBucket: `${projectId}.appspot.com`, //check it in script snippet require to add to your website.
});
const MSG_COL = process.env.WHATSAPP_MSG
const db = admin.firestore();
const Colref = db.collection(MSG_COL)
console.log(projectId)
console.log(MSG_COL)

module.exports = Colref;