const {colref, msgRef, sellerRef} = require('../database/config')
const { v4 : uuidv4 } = require('uuid');
function Store(){
     this.Colref = colref
     this.msgRef = msgRef
     this.selRef = sellerRef
}


Store.prototype.getDocuments = function(){
    const {Colref,msgRef} = this
    
    return new Promise((resolve,reject)=>{
        msgRef.where('sellerId', '==', '4Nry86MFTXdL42PVokPQt0hL0TU2').get()
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




Store.prototype.getWsg = function(){

    // var landmarks = Promise.all([
    //     citiesRef.doc('SF').collection('landmarks').doc().set({
    //         name: 'Golden Gate Bridge',
    //         type: 'bridge'
    //     }),
    const {Colref} = this
    Colref.get().then(snapshot=>{snapshot.docs.forEach(doc=> {Colref.doc(doc.id)
        .collection('gross').doc().set({
           sender_number: "2222444466666" 
        })
    //     .get()
    // .then((snapshot)=>{snapshot.docs.forEach(doc=>console.log(doc.data()))})
})
})
}

// takes the docChange from snapshot.docChanges() and return seller's data
const getDocData =  (docChange)=> {
    return new Promise((resolve,reject)=>{
        const docid = docChange.doc.id
        const docdata = docChange.doc.data()
        const {sellerId,sellerUnread} = docdata
        
        // console.log(sellerId)
        let type = docChange.type
       // console.log(type)
        
             if(type === 'added' && sellerUnread > 0){  // send the number of unread messages 
                
                sellerRef.doc(sellerId).get().then( snapshot=>{
                  // console.log('HELLO 2', snapshot.data())
                 resolve({sellerInfo: snapshot.data(), docid}) // resolve with the seller information
             })
             }
            //else if(!sellerUnread && sellerUnread !== 0){
            //     sellerRef.doc(sellerId).get().then( snapshot=>{
            //         console.log('HELLO 2', snapshot.data())
            //      resolve({data: snapshot.data(), docid})
            //     })
            // }
            else{
                reject(new Error("no unread message"))
             }
    })
    
}

Store.prototype.onChanges =   function(snapshot){
    
    let phoneNo = ''
  return new Promise((resolve,reject)=>{
    
    
        let changes = snapshot.docChanges()
       // changes.forEach((change)=>console.log(change.doc.data()))
       getDocData(changes[changes.length - 1])
       .then(data =>resolve({sellerInfo:data})).catch(err=>console.log(err.message))
  })  
  
}

Store.prototype.addDocument_whasapp = function(doc){  
    const {Colref} = this
    const {msgRef} = this
    return new Promise((resolve,reject)=>{
        const docref = uuidv4()
        Colref.doc(docref).create(doc)
        .then((docRef) => {                 
                console.log("Document written with ID: ", docref );
                resolve(docref)
              })
              .catch((err) => {
                console.error("Error adding document: ", err);
                reject(new Error(`${err}`))
    
    })                                                                                                            
    
})
}

Store.prototype.addDocument_msg = function(doc){  
    const {Colref} = this
    const {msgRef} = this
    
    return new Promise((resolve,reject)=>{
        const docref = uuidv4()
        msgRef.doc(docref).create(doc)
        .then((docRef) => {                 
                console.log("Document written with ID: ", docref );
                resolve(docref)
              })
        .catch((err) => {
                console.error("Error adding document: ", err);
                reject(new Error(`${err}`))
    
    })                                                                          
    
})
}

Store.prototype.removeDocument = function(docId){
    const {msgRef} = this

    msgRef.doc(docId).delete()
}

module.exports = {Store}
