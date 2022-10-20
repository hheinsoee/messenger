//#region checkindexdbsupporting
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
    window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction ||
    window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange ||
    window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

//#endregion checkindexdbsupporting

//#region createIndexDB
var baseName = 'mydb';//database
var storeName = 'task';//table
let db_version = 1;

function connectDB(f) {
    // Open (or create) the database
    var request = indexedDB.open(baseName, db_version);
    request.onerror = function (e) {
        console.log(e);
    }
    request.onsuccess = function () {
        f(request.result);
    }
    request.onupgradeneeded = function (e) {
        var Db = e.currentTarget.result;

        //Create store
        if (!Db.objectStoreNames.contains(storeName)) {
            Db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
            //store.createIndex("NameIndex", ["name.last", "name.first"], { unique: false });
        }
        connectDB(f);
    }
}
//#endregion createIndexDB

export function IDBcreate(input_data, cb) {
    connectDB(function (db) {
        var request = db.transaction([storeName], "readwrite")
            .objectStore(storeName)
            .add({ data: input_data });

        request.onsuccess = function (event) {
            cb(false, input_data);
        };

        request.onerror = function (event) {
            cb(request.onerror, false);
        }
    });
}

// export function IDBreadAll(cb) {
//     connectDB(function (db) {
//         var rows = [],
//             store = db.transaction([storeName], "readonly").objectStore(storeName);

//         if (store.mozGetAll)
//             store.mozGetAll().onsuccess = function (e) {
//                 cb(e.target.result, false);
//             };
//         else
//             store.openCursor().onsuccess = function (e) {
//                 var cursor = e.target.result;
//                 if (cursor) {
//                     rows.push(cursor.value);
//                     cursor.continue();
//                 }
//                 else {
//                     cb(false, rows);
//                 }
//             };
//     });
// }
// export function IDBdeleteById(id, cb){
//     connectDB((db)=>{
//         var request = db.transaction([storeName], "readwrite")
//         .objectStore(storeName)
//         .delete(id);
        
//         request.onsuccess = function(event) {
//            cb(false, 'Deleted!');
//         };
//     });
    
// }


// function updateTask(data, id, cb){
//     connectDB((db)=>{
//         var objectStore = db.transaction([storeName], "readwrite")
//         .objectStore(storeName);

//         const request = objectStore.get(id);
//         request.onsuccess = function(event) {
//             const task = request.result;

//             // Change the name property
//             task.task_name = data;

//             // Create a request to update
//             const updateRequest = objectStore.update(task);

//             updateRequest.onsuccess = () => {
//                 cb(false, `Updated "${task.task_name}" to "${data}"`);
//             }
//         };
//     });
// }