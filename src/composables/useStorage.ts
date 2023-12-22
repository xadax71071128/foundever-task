const putDataIntoCache = (dbName: string, key: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    let open = indexedDB.open(dbName, 1)

    open.onupgradeneeded = () => {
      open.result.createObjectStore("data")
    }

    open.onsuccess = () => {
      let db = open.result
      let tx = db.transaction("data", "readwrite")
      let store = tx.objectStore("data")

      const query = store.put(data, key)

      query.onerror = function (event) {
        console.error("Error event", event)
        reject()
      }

      tx.oncomplete = () => {
        db.close()
        resolve()
      }
    }

    open.onerror = () => {
      console.error("Error", open.error)
      reject()
    }
  })
}

const getDataFromCache = (dbName: string, key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    let open = indexedDB.open(dbName, 1)

    open.onupgradeneeded = () => {
      open.result.createObjectStore("data")
    }

    open.onsuccess = () => {
      let db = open.result
      let tx = db.transaction("data", "readwrite")
      let store = tx.objectStore("data")

      const query = store.get(key)

      query.onerror = function (event) {
        console.error("Error event", event)
        reject()
      }

      query.onsuccess = () => {
        db.close()
        resolve(query.result)
      }
    }

    open.onerror = () => {
      console.error("Error", open.error)
      reject()
    }
  })
}

const useStorage = {
  get: async (db: string, index: string) => {
    try {
      return JSON.parse(await getDataFromCache(db, index))
    } catch {
      return false
    }
  },
  set: async (db: string, index: string, value: string | object) => {
    try {
      await putDataIntoCache(db, index, JSON.stringify(value))
      return true
    } catch (e) {
      console.warn(e)
      return false
    }
  },
}

export default useStorage
