class DocumentDB {
    constructor() {
        this.dbName = 'DocsLocalDB';
        this.dbVersion = 1;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Files store
                if (!db.objectStoreNames.contains('files')) {
                    const filesStore = db.createObjectStore('files', { keyPath: 'id' });
                    filesStore.createIndex('parentId', 'parentId', { unique: false });
                    filesStore.createIndex('name', 'name', { unique: false });
                }

                // Versions store
                if (!db.objectStoreNames.contains('versions')) {
                    const versionsStore = db.createObjectStore('versions', { keyPath: 'id', autoIncrement: true });
                    versionsStore.createIndex('fileId', 'fileId', { unique: false });
                    versionsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async createFile(file) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            const request = store.add(file);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateFile(file) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            const request = store.put(file);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFile(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getFile(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllFiles() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async createVersion(version) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['versions'], 'readwrite');
            const store = transaction.objectStore('versions');
            const request = store.add(version);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getVersions(fileId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['versions'], 'readonly');
            const store = transaction.objectStore('versions');
            const index = store.index('fileId');
            const request = index.getAll(fileId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}