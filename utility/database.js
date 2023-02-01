const saveData = (colref, data)=>{
    colref
        .add({
            phone_no_id: `${data.phone_no_id}`,
            phone_number: `${data.phone_number}`,
            message_body: `${data.message_body}`,
            timestamp: `${data.timestamp}`
          })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch((err) => {
            console.error("Error adding document: ", err);
          });
    }
    module.exports = {saveData}