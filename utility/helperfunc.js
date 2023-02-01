const Joi = require('joi')
const axios = require("axios")

function unpackRequestBody(reqbody){
    const{entry}  = reqbody
    let  phone_no_id, display_phone_no, from, sender_name 
    if(entry){
       phone_no_id = entry[0].changes[0].value.metadata.phone_number_id
      display_phone_no = entry[0].changes[0].value.metadata.display_phone_number
      // const  from1   = entry[0].changes[0].value.messages[0].from.slice(1)
       from   = entry[0].changes[0].value.contacts[0].wa_id
       //const  from   = "2347030531443"
      // const message_body = entry[0].changes[0].value.messages[0].text.body
      sender_name = entry[0].changes[0].value.contacts[0].profile.name
       // const   timestamp = entry[0].changes[0].value.messages[0].timestamp
    }

      return {phone_no_id,display_phone_no,from,sender_name}
}

async function sendReply (phone_no_id, whatsapp_token, to, sender_name){
 
    let data = {
     
      "messaging_product": "whatsapp",
      "to": to,
      "type": "text",
      "text": {
      "body": `Hello ${sender_name}, Welcome to cashaam!`
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
module.exports =  { handlePostback, responseJson,sendReply,querySchema,unpackRequestBody };