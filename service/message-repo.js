
const {colref} = require('../database/config')


function getDocuments(){
    return new Promise((resolve,reject)=>{
        colref.get()
    .then((snap)=>{
        let messages = []
        snap.docs.forEach(
            doc=>{
                messages.push({...doc.data()})
               
            }
        )
        resolve(messages)
    })
    .catch(err=>{
        reject(new Error(`${err}`))
    })
    
    })
     
}

function addDocument(doc){  
    return new Promise((resolve,reject)=>{
        colref
        .add(doc)
        .then((docRef) => {                 
                console.log("Document written with ID: ", docRef.id);
                resolve(docRef.id)
              })
              .catch((err) => {
                console.error("Error adding document: ", err);
                reject(new Error(`${err}`))
    
    })                                                                          
    
})
}

module.exports = {addDocument,getDocuments}
