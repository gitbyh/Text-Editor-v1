document.addEventListener('DOMContentLoaded', async () => {
    // Initialize IndexedDB
    const db = new DocumentDB();
    await db.init();

    // Initialize components
    const editor = new Editor(document.getElementById('editor'), db);
    const toolbar = new Toolbar(editor);
    const fileManager = new FileManager(db, document.getElementById('fileTree'));

    // Setup theme toggle
    const toggleTheme = () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Setup keyboard shortcuts
    document.addEventListener('keydown', async (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 's':
                    e.preventDefault();
                    await editor.saveContent();
                    break;
                case 'b':
                    e.preventDefault();
                    editor.execCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    editor.execCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    editor.execCommand('underline');
                    break;
            }
        }
    });

    // Setup sidebar toggle
    document.getElementById('toggleSidebar').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
    });

    // Setup templates
    const templatesModal = document.getElementById('templatesModal');
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', async () => {
            const templateName = item.dataset.template;
            const template = templates[templateName];
            if (template) {
                const file = await fileManager.createNewFile();
                file.content = template.content;
                await db.updateFile(file);
                await editor.loadFile(file.id);
                templatesModal.style.display = 'none';
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.querySelector('.sidebar').classList.remove('open');
        }
    });
});