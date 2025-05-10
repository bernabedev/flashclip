// db.ts

const DB_NAME = "TwitchClipStorage";
const DB_VERSION = 1;
const VIDEO_STORE_NAME = "clips";

interface VideoRecord {
  clipId: string; // Usaremos el clipId como clave única
  file: File;
  fileName: string;
  timestamp: number;
}

let dbInstance: IDBDatabase | null = null;

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(VIDEO_STORE_NAME)) {
        db.createObjectStore(VIDEO_STORE_NAME, { keyPath: "clipId" });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error(
        "IndexedDB error:",
        (event.target as IDBOpenDBRequest).error
      );
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function saveVideoToDB(
  clipId: string,
  videoFile: File
): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(VIDEO_STORE_NAME, "readwrite");
      const store = transaction.objectStore(VIDEO_STORE_NAME);
      const videoRecord: VideoRecord = {
        clipId: clipId,
        file: videoFile,
        fileName: videoFile.name,
        timestamp: Date.now(),
      };
      const request = store.put(videoRecord);

      request.onsuccess = () => {
        console.log(`Video ${clipId} saved to IndexedDB`);
        resolve();
      };
      request.onerror = (event) => {
        console.error(
          "Error saving video to IndexedDB:",
          (event.target as IDBRequest).error
        );
        reject((event.target as IDBRequest).error);
      };
    } catch (error) {
      console.error("Error initiating transaction for saving video:", error);
      reject(error);
    }
  });
}

export async function getVideoFromDB(clipId: string): Promise<File | null> {
  if (!clipId) return null;
  const db = await getDB();
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(VIDEO_STORE_NAME, "readonly");
      const store = transaction.objectStore(VIDEO_STORE_NAME);
      const request = store.get(clipId);

      request.onsuccess = (event) => {
        const record = (event.target as IDBRequest).result as
          | VideoRecord
          | undefined;
        if (record && record.file) {
          console.log(`Video ${clipId} loaded from IndexedDB`);
          // Re-instantiate File object if necessary, though modern browsers often store it correctly
          resolve(
            new File([record.file], record.fileName, {
              type: record.file.type,
              lastModified: record.file.lastModified,
            })
          );
        } else {
          resolve(null);
        }
      };
      request.onerror = (event) => {
        console.error(
          "Error loading video from IndexedDB:",
          (event.target as IDBRequest).error
        );
        reject((event.target as IDBRequest).error);
      };
    } catch (error) {
      console.error("Error initiating transaction for getting video:", error);
      reject(error);
    }
  });
}

export async function clearVideoFromDB(clipId: string): Promise<void> {
  if (!clipId) return;
  const db = await getDB();
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(VIDEO_STORE_NAME, "readwrite");
      const store = transaction.objectStore(VIDEO_STORE_NAME);
      const request = store.delete(clipId);

      request.onsuccess = () => {
        console.log(`Video ${clipId} deleted from IndexedDB`);
        resolve();
      };
      request.onerror = (event) => {
        console.error(
          "Error deleting video from IndexedDB:",
          (event.target as IDBRequest).error
        );
        reject((event.target as IDBRequest).error);
      };
    } catch (error) {
      console.error("Error initiating transaction for deleting video:", error);
      reject(error);
    }
  });
}

// Optional: function to clear all videos
export async function clearAllVideosFromDB(): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(VIDEO_STORE_NAME, "readwrite");
      const store = transaction.objectStore(VIDEO_STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log("All videos cleared from IndexedDB.");
        resolve();
      };
      request.onerror = (event) => {
        console.error(
          "Error clearing all videos from IndexedDB:",
          (event.target as IDBRequest).error
        );
        reject((event.target as IDBRequest).error);
      };
    } catch (error) {
      console.error(
        "Error initiating transaction for clearing all videos:",
        error
      );
      reject(error);
    }
  });
}
