let db: IDBDatabase | null = null;

if (!window.indexedDB) {
  console.log(
    "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
  );
} else {
  const request = window.indexedDB.open(
    "chatApp",
    Number(process.env.REACT_APP_INDEXED_DB_VERSION) || 1
  );

  request.onerror = (event) => console.log(event);

  request.onsuccess = (event) => {
    db = (event.target as IDBOpenDBRequest).result;
  };

  request.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;

    // Conversation
    const conversationObjectStore = db.createObjectStore("conversation", {
      keyPath: "user._id",
    });
    conversationObjectStore.createIndex("conversationUserName", "user.name", {
      unique: false,
    });

    // Message
    const messageObjectStore = db.createObjectStore("message", {
      keyPath: ["fromId", "toId"],
    });
    messageObjectStore.createIndex("messageContent", "content", {
      unique: false,
    });

    const request = conversationObjectStore.getAll();

    request.onsuccess = (event) => console.log(event);
  };
}

export { db };
