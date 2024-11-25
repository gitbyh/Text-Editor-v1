class Shortcuts {
    constructor(editor) {
        this.editor = editor;
        this.shortcuts = {
            's': { ctrl: true, fn: () => this.editor.saveContent() },
            'b': { ctrl: true, fn: () => this.editor.execCommand('bold') },
            'i': { ctrl: true, fn: () => this.editor.execCommand('italic') },
            'u': { ctrl: true, fn: () => this.editor.execCommand('underline') },
            'z': { ctrl: true, fn: () => this.editor.undo() },
            'y': { ctrl: true, fn: () => this.editor.redo() },
            'l': { ctrl: true, fn: () => this.editor.execCommand('justifyLeft') },
            'e': { ctrl: true, fn: () => this.editor.execCommand('justifyCenter') },
            'r': { ctrl: true, fn: () => this.editor.execCommand('justifyRight') },
            'j': { ctrl: true, fn: () => this.editor.execCommand('justifyFull') },
            'k': { ctrl: true, fn: () => this.editor.addComment() }
        };

        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            const shortcut = this.shortcuts[key];

            if (shortcut && (e.ctrlKey || e.metaKey) === shortcut.ctrl) {
                e.preventDefault();
                shortcut.fn();
            }
        });
    }
}