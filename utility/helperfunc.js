const Joi = require('joi')
const axios = require("axios")

 async function unpackRequestBody(reqbody){
     let body1,
         timestamp1 = "";
     const { object, entry } = reqbody;
     if (object === "whatsapp_business_account") {
         const [det] = entry;
         const { changes } = det;
         const [metadata] = changes;
         const { value } = metadata;
         if (value !== undefined) {
             const { messages, contacts } = value;

             if (contacts !== undefined) {
                 if (messages !== undefined) {
                     const [message] = messages;
                     const { text, timestamp } = message;
                     if (text !== undefined) {
                         const { body } = text;
                         body1 = body;
                         timestamp1 = timestamp;
                     }
                 }
                 const [profile1] = value.contacts;
                 //console.log(profile)
                 if (profile1 !== undefined) {
                     const { profile } = profile1;
                     const { wa_id } = profile1;
                     const { name } = profile;

                     const sender_number = wa_id;
                     const sender_name = name;
                     return new Promise((resolve, reject) => {
                         if (
                             sender_name !== undefined &&
                             sender_number !== undefined &&
                             body1 !== undefined &&
                             timestamp1 !== undefined
                         ) {
                             resolve({
                                 sender_number,
                                 sender_name,
                                 body1,
                                 timestamp1,
                             });
                         } else {
                             reject({});
                         }
                     });
                 }
             }
         }
     }

   
}


async function sendReply (phone_no_id, whatsapp_token, sender_number, sender_name,sender_message_body){
 
    let data = {
     
      "messaging_product": "whatsapp",
      "to": sender_number,
      "type": "text",
      "text": {
      "body": `Hello ${sender_name}, Welcome to cashaam!, Did you said: " ${sender_message_body}" ??`
    }
    }

    
   return await  axios({
      method: "POST",
      url: `https://graph.facebook.com/v15.0/${phone_no_id}/messages`,
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + whatsapp_token
      }
    });
    
    
  }
  

const querySchema = Joi.object({
  'hub.mode': 'subscribe',
  'hub.verify_token' : 'blueprint'
  

})

const responseJson = (res,message)=>{
    res.json({code: res.statusCode, "message" : `${message}`})
    }
module.exports =  {responseJson,sendReply,querySchema,unpackRequestBody };