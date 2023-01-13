export default function (databaseName, version = 1, name, value) {
  let openRequest = indexedDB.open(databaseName, version)

  openRequest.onupgradeneeded = function(event) {
    // triggers if the client had no database
    // ...perform initialization...
    // the existing database version is less than 2 (or it doesn't exist)
    let db = openRequest.result;
    console.log(event.oldVersion);
    switch(event.oldVersion) { // existing db version
      case 0:
        // version 0 means that the client had no database
        // perform initialization
        if (!db.objectStoreNames.contains(name)) { // if there's no "books" store
          db.createObjectStore(name, {keyPath: 'id'}); // create it
        }
      case 1:
        // client had version 1
        // update
    }
  }
  
  openRequest.onsuccess = function() {
    let db = openRequest.result
    // continue working with database using db object
    db.onversionchange = function() {
      db.close();
      alert('Database is outdated, please reload the page.')
    }
    // console.log(db);

    let transaction = db.transaction(name, 'readwrite')
    let objStore = transaction.objectStore(name)
    let request = objStore.get(name)
    // let request = objStore.add(value)

    request.onsuccess = function() {
      objStore.add(value)
      console.log('Book added to the store')
    }

    request.onerror = function(event) {
      console.log('Error request', request.error)
      if (request.error.name == "ConstraintError") {
        console.log("Book with such id already exists"); // handle the error
        event.preventDefault(); // don't abort the transaction
        event.stopPropagation(); // don't bubble error up, "chew" it
      } else {
        // do nothing
        // transaction will be aborted
        // we can take care of error in transaction.onabort
      }
    }

    transaction.oncomplete = function() {
      console.log('Transaction is complete')
    }

    transaction.onabort = function() {
      console.log('Error transaction', transaction.error)
    }
  }

  openRequest.onerror = function() {
    console.log('openRequest');
    console.error('Error', openRequest.error)
  }

  openRequest.onblocked = function() {
    // this event shouldn't trigger if we handle onversionchange correctly
  
    // it means that there's another open connection to the same database
    // and it wasn't closed after db.onversionchange triggered for it
  }
}