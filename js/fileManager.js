class FileManager {
    constructor(db, fileTreeElement) {
        this.db = db;
        this.fileTree = fileTreeElement;
        this.currentFolder = null;
        this.init();
    }

    async init() {
        await this.refreshFileTree();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // New file button
        document.getElementById('newFile').addEventListener('click', () => {
            this.createNewFile();
        });

        // New folder button
        document.getElementById('newFolder').addEventListener('click', () => {
            this.createNewFolder();
        });

        // Search input
        document.getElementById('searchFiles').addEventListener('input', (e) => {
            this.searchFiles(e.target.value);
        });

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        this.fileTree.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('file-item') || e.target.classList.contains('folder')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
            }
        });

        this.fileTree.addEventListener('dragover', (e) => {
            e.preventDefault();
            const target = e.target.closest('.folder');
            if (target) {
                target.classList.add('drag-over');
            }
        });

        this.fileTree.addEventListener('dragleave', (e) => {
            const target = e.target.closest('.folder');
            if (target) {
                target.classList.remove('drag-over');
            }
        });

        this.fileTree.addEventListener('drop', async (e) => {
            e.preventDefault();
            const target = e.target.closest('.folder');
            if (target) {
                target.classList.remove('drag-over');
                const itemId = e.dataTransfer.getData('text/plain');
                const targetFolderId = target.dataset.id;
                await this.moveItem(itemId, targetFolderId);
            }
        });
    }

    async createNewFile() {
        const name = prompt('Enter file name:');
        if (!name) return;

        const file = {
            id: crypto.randomUUID(),
            name: name,
            type: 'file',
            content: '',
            parentId: this.currentFolder,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await this.db.createFile(file);
        await this.refreshFileTree();
        return file;
    }

    async createNewFolder() {
        const name = prompt('Enter folder name:');
        if (!name) return;

        const folder = {
            id: crypto.randomUUID(),
            name: name,
            type: 'folder',
            parentId: this.currentFolder,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await this.db.createFile(folder);
        await this.refreshFileTree();
        return folder;
    }

    async moveItem(itemId, targetFolderId) {
        const item = await this.db.getFile(itemId);
        if (!item) return;

        item.parentId = targetFolderId;
        await this.db.updateFile(item);
        await this.refreshFileTree();
    }

    async deleteItem(id) {
        const item = await this.db.getFile(id);
        if (!item) return;

        if (item.type === 'folder') {
            // Recursively delete all children
            const children = await this.getChildren(id);
            for (const child of children) {
                await this.deleteItem(child.id);
            }
        }

        await this.db.deleteFile(id);
        await this.refreshFileTree();
    }

    async getChildren(parentId) {
        const allFiles = await this.db.getAllFiles();
        return allFiles.filter(file => file.parentId === parentId);
    }

    async searchFiles(query) {
        if (!query) {
            await this.refreshFileTree();
            return;
        }

        const allFiles = await this.db.getAllFiles();
        const filteredFiles = allFiles.filter(file => 
            file.name.toLowerCase().includes(query.toLowerCase())
        );

        this.renderFileTree(this.buildFileTree(filteredFiles));
    }

    buildFileTree(files) {
        const tree = {};
        const rootItems = files.filter(file => !file.parentId);

        const addToTree = (items, parentId) => {
            const children = files.filter(file => file.parentId === parentId);
            if (children.length > 0) {
                items.children = children.map(child => ({
                    ...child,
                    children: []
                }));
                children.forEach(child => addToTree(items.children.find(item => item.id === child.id), child.id));
            }
        };

        rootItems.forEach(item => {
            tree[item.id] = {
                ...item,
                children: []
            };
            addToTree(tree[item.id], item.id);
        });

        return Object.values(tree);
    }

    async refreshFileTree() {
        const files = await this.db.getAllFiles();
        const tree = this.buildFileTree(files);
        this.renderFileTree(tree);
    }

    renderFileTree(tree) {
        this.fileTree.innerHTML = '';
        tree.forEach(item => {
            this.fileTree.appendChild(this.createTreeItem(item));
        });
    }

    createTreeItem(item) {
        const div = document.createElement('div');
        div.className = item.type === 'folder' ? 'folder' : 'file-item';
        div.dataset.id = item.id;
        div.draggable = true;

        const header = document.createElement('div');
        header.className = item.type === 'folder' ? 'folder-header' : 'file-header';

        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.textContent = item.type === 'folder' ? 'folder' : 'description';
        header.appendChild(icon);

        const name = document.createElement('span');
        name.textContent = item.name;
        header.appendChild(name);

        div.appendChild(header);

        if (item.type === 'folder' && item.children.length > 0) {
            const content = document.createElement('div');
            content.className = 'folder-content';
            item.children.forEach(child => {
                content. content.appendChild(this.createTreeItem(child));
            });
            div.appendChild(content);
        }

        return div;
    }
}