import { IdxedDbConfig } from "./Constants";


const createStore = (db) => {
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
        dbOpenRequest.onupgradeneeded = function (event) {
            let db = event.target.result;
            createStore(db);
        };

        dbOpenRequest.onsuccess = function (event) {
            const db = event.target.result;

            const transactionsUerInfo = db.transaction(IdxedDbConfig.STORE_USER_INFO, "readonly");
            const storeUserInfo = transactionsUerInfo.objectStore(IdxedDbConfig.STORE_USER_INFO);
            const storeUserInfoCursor= storeUserInfo.openCursor();
            storeUserInfoCursor.onsuccess = function (event) {
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

        dbOpenRequest.onerror = function (event) {
            let dbOpenRequest = event.target;
            reject(dbOpenRequest.error);
        };
    });
}


export const addDataToIdxedDb = (data) => {
    return new Promise((resolve, reject) => {
        const dbOpenRequest = indexedDB.open(IdxedDbConfig.DB_NAME, IdxedDbConfig.DB_VERSION);

        dbOpenRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(IdxedDbConfig.STORE_MESSAGE, "readwrite");
            const store = transaction.objectStore(IdxedDbConfig.STORE_MESSAGE);

            const storeRequest = store.put(data);
            storeRequest.onsuccess = (event) => {
                resolve("add_data_success");
            }
        }
        dbOpenRequest.onerror = function (event) {
            let db = event.target;
            reject(db.error);
        };
    });
}

export const addMultiDataItemToIdxedDb = (data) => {
    return new Promise((resolve, reject) => {
        const dbOpenRequest = indexedDB.open(IdxedDbConfig.DB_NAME, IdxedDbConfig.DB_VERSION);

        if (Array.isArray(data) === false) reject("invalid array object");

        dbOpenRequest.onsuccess = function () {
            const db = dbOpenRequest.result;
            const transaction = db.transaction(IdxedDbConfig.STORE_MESSAGE, "readwrite");
            const store = transaction.objectStore(IdxedDbConfig.STORE_MESSAGE);
            data.forEach(data => {
                store.put(data);
            })

            transaction.onsuccess = (event) => {
                resolve("add_multi_data_item_success");
            }
        }
        dbOpenRequest.onerror = function (event) {
            let dbOpenRequest = event.target;
            reject(dbOpenRequest.error);
        };
    });
}


export const getDataFromIdxedDb = () => {
    return new Promise((resolve, reject) => {
        const dbOpenRequest = indexedDB.open(IdxedDbConfig.DB_NAME, IdxedDbConfig.DB_VERSION);
        dbOpenRequest.onsuccess = function () {
            const db = dbOpenRequest.result;
            const transaction = db.transaction(IdxedDbConfig.STORE_MESSAGE, "readonly");
            const store = transaction.objectStore(IdxedDbConfig.STORE_MESSAGE);

            const storeRequest = store.getAll();

            storeRequest.onsuccess = (event) => {
                resolve(event.target.result);
            };

            transaction.oncomplete = (event) => {
                console.log(event, "transaction.oncomplete -read");
            }
        }
        dbOpenRequest.onerror = function (event) {
            let dbOpenRequest = event.target;
            reject(dbOpenRequest.error);
        };
    });
}