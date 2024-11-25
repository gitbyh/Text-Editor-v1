class Editor {
    constructor(editorElement, db) {
        this.editor = editorElement;
        this.db = db;
        this.currentFile = null;
        this.autoSaveTimeout = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAutoSave();
    }

    setupEventListeners() {
        this.editor.addEventListener('input', () => {
            this.triggerAutoSave();
        });

        // Handle paste events to clean up content
        this.editor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });

        // Handle drop events for images
        this.editor.addEventListener('drop', async (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                await this.handleImageUpload(files[0]);
            }
        });
    }

    setupAutoSave() {
        this.editor.addEventListener('input', () => {
            if (this.autoSaveTimeout) {
                clearTimeout(this.autoSaveTimeout);
            }
            this.autoSaveTimeout = setTimeout(() => this.saveContent(), 1000);
        });
    }

    async loadFile(fileId) {
        this.currentFile = await this.db.getFile(fileId);
        if (this.currentFile) {
            this.editor.innerHTML = this.currentFile.content;
            this.editor.focus();
        }
    }

    async saveContent() {
        if (!this.currentFile) return;

        const content = this.editor.innerHTML;
        const version = {
            fileId: this.currentFile.id,
            content: content,
            timestamp: new Date().toISOString()
        };

        await this.db.createVersion(version);
        this.currentFile.content = content;
        await this.db.updateFile(this.currentFile);
    }

    async handleImageUpload(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                range.insertNode(img);
                range.collapse(false);
                
                await this.saveContent();
                resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    execCommand(command, value = null) {
        document.execCommand(command, false, value);
        this.editor.focus();
    }

    insertTable(rows = 3, cols = 3) {
        const table = document.createElement('table');
        for (let i = 0; i < rows; i++) {
            const row = table.insertRow();
            for (let j = 0; j < cols; j++) {
                const cell = row.insertCell();
                cell.innerHTML = '&nbsp;';
            }
        }
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.insertNode(table);
        range.collapse(false);
        this.saveContent();
    }

    addComment() {
        const selection = window.getSelection();
        if (!selection.toString()) return;

        const comment = prompt('Enter your comment:');
        if (!comment) return;

        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'comment';
        span.title = comment;
        range.surroundContents(span);
        this.saveContent();
    }

    async exportDocument(format) {
        if (!this.currentFile) return;

        let content = '';
        switch (format) {
            case 'txt':
                content = this.editor.innerText;
                break;
            case 'html':
                content = this.editor.innerHTML;
                break;
            default:
                content = this.editor.innerHTML;
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentFile.name}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}