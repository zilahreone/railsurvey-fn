export default {

  insertData (db_name, version, data) {
    const request = indexedDB.open(db_name, version)

    request.onerror = (event) => {
      console.error(`Database error: ${event.target.errorCode}`)
    };
  
    request.onsuccess = (event) => {
      // add implementation here
      const db = event.target.result;
  
       this.insertContact(db, data)
    }
  
    // create the Contacts object store and indexes
    request.onupgradeneeded = (event) => {
      let db = event.target.result;
  
      // create the Contacts object store 
      // with auto-increment id
      let store = db.createObjectStore('Contacts', {
        autoIncrement: true
      })
  
      // create an index on the email property
      let index = store.createIndex('name', 'name', {
        unique: true
      })
    }
  },

  insertContact(db, contact) {
    // create a new transaction
    const txn = db.transaction('Contacts', 'readwrite')

    // get the Contacts object store
    const store = txn.objectStore('Contacts')
    //
    let query = store.add(contact)

    // handle success case
    query.onsuccess = function (event) {
      console.log(event)
    }

    // handle the error case
    query.onerror = function (event) {
      console.log('asdf');
      console.log(event.target.errorCode)
    }

    // close the database once the 
    // transaction completes
    txn.oncomplete = function () {
      db.close()
    }
  },

  getContactById(db, id) {
    const txn = db.transaction('Contacts', 'readonly')
    const store = txn.objectStore('Contacts')

    let query = store.get(id)

    query.onsuccess = (event) => {
      if (!event.target.result) {
        console.log(`The contact with ${id} not found`)
      } else {
        console.table(event.target.result)
      }
    }

    query.onerror = (event) => {
      console.log(event.target.errorCode)
    }

    txn.oncomplete = function () {
      db.close()
    }
  }
}