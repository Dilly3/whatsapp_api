

async function unpackRequestBody(reqbody) {
    let body1,
        timestamp1 = "";
    const { object, entry } = reqbody;
    if (object === "whatsapp_business_account" && entry.length) {
        const [det] = entry;
        const { changes } = det;
        const [metadata] = changes;
        const { value } = metadata;

        const { messages, contacts } = value;

        const [message] = messages;
        const { text, timestamp } = message;

        const { body } = text;
        body1 = body;
        timestamp1 = timestamp;


        const [profile1] = contacts;

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


async function sendReply(phone_no_id, whatsapp_token, sender_number, sender_name, onSnap, sender_message_body) {

    const link = " visit https://shoparena-frontend-phi.vercel.app"
    const pre_msg = onSnap ? "You have unread message!." : "Welcome to oja!."
    let prefix = sender_number.indexOf('+')
    let substr = sender_number.substring(1)
    let senderNo = (prefix === -1) ? sender_number : substr
   

    let data = {

        "messaging_product": "whatsapp",
        "to": senderNo,
        "type": "text",
        "text": {
            "body": `Hello ${sender_name}, ${pre_msg}\n${link}`
        }
    }


    const response = await fetch(`https://graph.facebook.com/v15.0/${phone_no_id}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + whatsapp_token
        },
        body: JSON.stringify(data)
    })
    const data1 = await response.json()
   
    return await data1

   


}


module.exports = { sendReply, unpackRequestBody };