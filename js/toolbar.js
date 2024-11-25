class Toolbar {
    constructor(editor) {
        this.editor = editor;
        this.init();
    }

    init() {
        this.setupFormatButtons();
        this.setupFontControls();
        this.setupTableButton();
        this.setupImageButton();
        this.setupExportButton();
        this.setupImportButton();
    }

    setupFormatButtons() {
        document.querySelectorAll('.toolbar-button[data-command]').forEach(button => {
            button.addEventListener('click', () => {
                const command = button.dataset.command;
                this.editor.execCommand(command);
                button.classList.toggle('active');
            });
        });
    }

    setupFontControls() {
        const fontFamily = document.getElementById('fontFamily');
        fontFamily.addEventListener('change', () => {
            this.editor.execCommand('fontName', fontFamily.value);
        });

        const fontSize = document.getElementById('fontSize');
        fontSize.addEventListener('change', () => {
            this.editor.execCommand('fontSize', fontSize.value);
        });
    }

    setupTableButton() {
        document.getElementById('insertTable').addEventListener('click', () => {
            const rows = prompt('Number of rows:', '3');
            const cols = prompt('Number of columns:', '3');
            if (rows && cols) {
                this.editor.insertTable(parseInt(rows), parseInt(cols));
            }
        });
    }

    setupImageButton() {
        const imageInput = document.getElementById('imageInput');
        document.getElementById('insertImage').addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                await this.editor.handleImageUpload(e.target.files[0]);
                e.target.value = '';
            }
        });
    }

    setupExportButton() {
        document.getElementById('exportDoc').addEventListener('click', () => {
            const format = prompt('Export format (txt/html):', 'html');
            if (format) {
                this.editor.exportDocument(format.toLowerCase());
            }
        });
    }

    setupImportButton() {
        const importInput = document.getElementById('importInput');
        document.getElementById('importDoc').addEventListener('click', () => {
            importInput.click();
        });

        importInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const content = event.target.result;
                    this.editor.editor.innerHTML = content;
                    await this.editor.saveContent();
                };
                reader.readAsText(file);
                e.target.value = '';
            }
        });
    }
}