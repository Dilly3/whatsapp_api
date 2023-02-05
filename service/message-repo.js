const {colref} = require('../database/config')
function Store(){
     this.Colref = colref
}


Store.prototype.getDocuments = function(){
    const {Colref} = this
    return new Promise((resolve,reject)=>{
        Colref.get()
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

Store.prototype.addDocument = function(doc){  
    const {Colref} = this
    return new Promise((resolve,reject)=>{
        Colref
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

module.exports = {Store}
