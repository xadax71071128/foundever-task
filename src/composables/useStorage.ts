const putDataIntoCache = (dbName: string, key: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    let open = indexedDB.open(dbName, 1)

    open.onupgradeneeded = () => {
      console.log("Upgrading...")
      open.result.createObjectStore("data")
    }

    open.onsuccess = () => {
      let db = open.result
      let tx = db.transaction("data", "readwrite")
      let store = tx.objectStore("data")

      // console.log("Storing data...")
      const query = store.put(data, key)

      query.onerror = function (event) {
        console.error("Error event", event)
        reject()
      }

      tx.oncomplete = () => {
        // console.log("Data stored!")
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
      console.log("Upgrading...")
      open.result.createObjectStore("data")
    }

    open.onsuccess = () => {
      let db = open.result
      let tx = db.transaction("data", "readwrite")
      let store = tx.objectStore("data")

      // console.log("Getting data...")
      const query = store.get(key)

      query.onerror = function (event) {
        console.error("Error event", event)
        reject()
      }

      query.onsuccess = () => {
        // console.log("Data retrieved!")
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
      const start = new Date().getTime()
      const data = JSON.parse(await getDataFromCache(db, index))
      console.log("Time to get and parse data from " + index + " cache:", new Date().getTime() - start)
      return data
    } catch {
      return false
    }
  },
  set: async (db: string, index: string, value: string | object) => {
    try {
      const start = new Date().getTime()
      await putDataIntoCache(db, index, JSON.stringify(value))
      console.log("Time to set data into " + index + " cache:", new Date().getTime() - start)
      return true
    } catch (e) {
      console.warn(e)
      return false
    }
  },
}

export default useStorage
