import { IdxedDbConfig } from "./Constants";


const createStore = (db, userId) => {
    if (db.objectStoreNames.contains(IdxedDbConfig.STORE_MESSAGE)) {
        db.deleteObjectStore(IdxedDbConfig.STORE_MESSAGE);
    }

    if (db.objectStoreNames.contains(IdxedDbConfig.STORE_USER_INFO)) {
        db.deleteObjectStore(IdxedDbConfig.STORE_USER_INFO);
    }

    //create store
    if (!db.objectStoreNames.contains(IdxedDbConfig.STORE_MESSAGE)) {
        db.createObjectStore(IdxedDbConfig.STORE_MESSAGE, {
            keyPath: "id",
        });
    }

    if (!db.objectStoreNames.contains(IdxedDbConfig.STORE_USER_INFO)) {
        db.createObjectStore(IdxedDbConfig.STORE_USER_INFO, {
            keyPath: "userId",
        });
    }
}

export const initIdxedDb = (userId) => {
    return new Promise((resolve, reject) => {
        let dbOpenRequest = indexedDB.open(IdxedDbConfig.DB_NAME, IdxedDbConfig.DB_VERSION);
        dbOpenRequest.onupgradeneeded = function () {
            let db = dbOpenRequest.result;
            createStore(db, userId);
        };

        dbOpenRequest.onsuccess = function () {
            const db = dbOpenRequest.result;

            const transactionsUerInfo = db.transaction(IdxedDbConfig.STORE_USER_INFO, "readonly");
            const storeUserInfo = transactionsUerInfo.objectStore(IdxedDbConfig.STORE_USER_INFO);
            const storeUserInfoRequest = storeUserInfo.openCursor();
            storeUserInfoRequest.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.key !== userId) {
                        const transactionsUerInfoClear = db.transaction(IdxedDbConfig.STORE_USER_INFO, "readwrite");
                        const storeUserInfoClear = transactionsUerInfoClear.objectStore(IdxedDbConfig.STORE_USER_INFO);
                        const storeUserInfoClearRequest = storeUserInfoClear.clear();
                        storeUserInfoClearRequest.onsuccess = function (event) {
                            const transactionsUerInfoAdd = db.transaction(IdxedDbConfig.STORE_USER_INFO, "readwrite");
                            const storeUserInfoAdd = transactionsUerInfoAdd.objectStore(IdxedDbConfig.STORE_USER_INFO);
                            storeUserInfoAdd.add({ userId })
                        }

                        const transactionMessageClear = db.transaction(IdxedDbConfig.STORE_MESSAGE, "readwrite");
                        const storeChatMessageClear = transactionMessageClear.objectStore(IdxedDbConfig.STORE_MESSAGE);                        
                        storeChatMessageClear.clear();
                    }
                    else {
                        cursor.continue();
                    }
                } else {
                    const transactionsUerInfoAdd = db.transaction(IdxedDbConfig.STORE_USER_INFO, "readwrite");
                    const storeUserInfoAdd = transactionsUerInfoAdd.objectStore(IdxedDbConfig.STORE_USER_INFO);
                    storeUserInfoAdd.add({ userId })
                }
            }

            db.onversionchange = function () {
                db.close();
                alert("Database is outdated, please reload the page.");
            };

            resolve("init_success");
        };

        dbOpenRequest.onerror = function () {
            let db = dbOpenRequest;
            reject(db.error);
        };
    });
}


export const addDataToIdxedDb = (data) => {
    return new Promise((resolve, reject) => {
        const dbOpenRequest = indexedDB.open(IdxedDbConfig.DB_NAME, IdxedDbConfig.DB_VERSION);     

        dbOpenRequest.onsuccess = function () {
            const db = dbOpenRequest.result;
            const transaction = db.transaction(IdxedDbConfig.STORE_MESSAGE, "readwrite");
            const objectStoreRequest = transaction.objectStore(IdxedDbConfig.STORE_MESSAGE);
             
            objectStoreRequest.add(data);
            objectStoreRequest.onsuccess = (event) => {
                resolve("add_data_success");
            }

            transaction.onerror = (event) => {
                reject("add transaction failed");
            }
           
        }
        dbOpenRequest.onerror = function (event) {
            let db = dbOpenRequest;     
            reject(db.error);
        };
    });
}


export const getDataFromIdxedDb = () => {
    return new Promise((resolve, reject) => {
        const dbOpenRequest = indexedDB.open(IdxedDbConfig.DB_NAME, IdxedDbConfig.DB_VERSION);
        dbOpenRequest.onsuccess = function () {
            const db = dbOpenRequest.result;
            const transaction = db.transaction(IdxedDbConfig.STORE_MESSAGE, "readonly");
            const objectStoreRequest = transaction.objectStore(IdxedDbConfig.STORE_MESSAGE);

            const data = objectStoreRequest.getAll();  
            
            transaction.oncomplete = () => {   
                //console.log(data, "transaction.oncomplete ")
                resolve(data.result);
            }

            transaction.onerror = (event) => {
                reject("get data transaction failed");
            } 
        }
        dbOpenRequest.onerror = function (event) {
            let db = event.target.result;
            reject(db.error);
        };
    });
}