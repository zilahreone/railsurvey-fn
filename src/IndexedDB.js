export default {

  insertData(db_name, version, data) {
    const request = indexedDB.open(db_name, version)

    request.onerror = (event) => {
      console.error(`Database error: ${event.target.errorCode}`)
    };

    request.onsuccess = (event) => {
      console.log('success');
      // add implementation here
      const db = event.target.result;

      this.insertContact(db, data)
    }

    // create the Contacts object store and indexes
    request.onupgradeneeded = (event) => {
      console.log('upgrade');
      let db = event.target.result;

      // create the Contacts object store 
      // with auto-increment id
      let store = db.createObjectStore('Survey', {
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
    const txn = db.transaction('Survey', 'readwrite')

    // get the Contacts object store
    const store = txn.objectStore('Survey')
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
    const txn = db.transaction('Survey', 'readonly')
    const store = txn.objectStore('Survey')

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
  },

  getAllContacts2(db_name, version) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(db_name, version)
      let arr = []
  
      request.onerror = (event) => {
        console.error(`Database error: ${event.
          target.errorCode}`)
        reject(event.target.errorCode)
      };
  
      request.onsuccess = (event) => {
        // add implementation here
        const db = event.target.result;
  
        // this.insertContact(db, data)
        const txn = db.transaction('Survey', "readonly");
        const objectStore = txn.objectStore('Survey');
  
        objectStore.openCursor().onsuccess = (event) => {
          let cursor = event.target.result;
          // console.log(cursor.value);
          if (cursor) {
            let contact = cursor.value;
            arr.push(contact)
            // continue next record
            cursor.continue();
          }
        };
        // close the database connection
        txn.oncomplete = function () {
          db.close();
          resolve(arr)
        };
      }
    });
  },

  getAllContacts(db_name, version, callback) {
    const request = indexedDB.open(db_name, version)
    let arr = []

    request.onerror = (event) => {
      console.error(`Database error: ${event.
        target.errorCode}`)
    };

    request.onsuccess = (event) => {
      // add implementation here
      const db = event.target.result;

      // this.insertContact(db, data)
      const txn = db.transaction('Survey', "readonly");
      const objectStore = txn.objectStore('Survey');

      objectStore.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        // console.log(cursor.value);
        if (cursor) {
          let contact = cursor.value;
          arr.push(contact)
          // continue next record
          cursor.continue();
        }
      };
      // close the database connection
      txn.oncomplete = function () {
        db.close();
        callback(arr)
      };
    }
  },

  getAllStudents(db_name, version) {
    const request = indexedDB.open(db_name, version)

    request.onerror = (event) => {
      console.error(`Database error: ${event.target.errorCode}`)
    };

    request.onsuccess = (event) => {
      // console.log('success');
      // add implementation here
      const db = event.target.result;

      // this.insertContact(db, data)
      const request = db.transaction('Survey')
        .objectStore('Survey')
        .getAll();
  
      request.onsuccess = () => {
        const students = request.result;
  
        console.log('Got all the students');
        // console.table(students)
  
        return students;
      }
  
      request.onerror = (err) => {
        console.error(`Error to get all students: ${err}`)
      }
    }

  },

  deleteContact(db, id) {
    // create a new transaction
    const txn = db.transaction('Contacts', 'readwrite');

    // get the Contacts object store
    const store = txn.objectStore('Contacts');
    //
    let query = store.delete(id);

    // handle the success case
    query.onsuccess = function (event) {
      console.log(event);
    };

    // handle the error case
    query.onerror = function (event) {
      console.log(event.target.errorCode);
    }

    // close the database once the 
    // transaction completes
    txn.oncomplete = function () {
      db.close();
    };
  }
}