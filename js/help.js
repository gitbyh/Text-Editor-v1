class HelpSystem {
    constructor() {
        this.helpContent = {
            'editor': {
                title: 'Editor Basics',
                content: `
                    <h3>Basic Formatting</h3>
                    <ul>
                        <li>Ctrl+B: Bold text</li>
                        <li>Ctrl+I: Italic text</li>
                        <li>Ctrl+U: Underline text</li>
                    </ul>
                    
                    <h3>Document Management</h3>
                    <ul>
                        <li>Ctrl+S: Save document</li>
                        <li>Ctrl+Z: Undo</li>
                        <li>Ctrl+Y: Redo</li>
                    </ul>
                    
                    <h3>Advanced Features</h3>
                    <ul>
                        <li>Ctrl+K: Add comment</li>
                        <li>Ctrl+L: Align left</li>
                        <li>Ctrl+E: Align center</li>
                        <li>Ctrl+R: Align right</li>
                        <li>Ctrl+J: Justify text</li>
                    </ul>
                `
            },
            'files': {
                title: 'File Management',
                content: `
                    <h3>Working with Files</h3>
                    <ul>
                        <li>Create new file: Click the "New Document" button</li>
                        <li>Delete file: Right-click and select "Delete"</li>
                        <li>Rename file: Right-click and select "Rename"</li>
                    </ul>
                    
                    <h3>Organization</h3>
                    <ul>
                        <li>Create folders: Click the folder icon</li>
                        <li>Move files: Drag and drop into folders</li>
                        <li>Search: Use the search bar above the file list</li>
                    </ul>
                `
            }
        };

        this.init();
    }

    init() {
        this.createHelpButton();
        this.createHelpModal();
    }

    createHelpButton() {
        const button = document.createElement('button');
        button.className = 'btn btn-icon';
        button.innerHTML = '<span class="material-icons">help_outline</span>';
        button.setAttribute('data-tooltip', 'Help');
        button.onclick = () => this.showHelp();
        document.querySelector('.header-actions').appendChild(button);
    }

    createHelpModal() {
        const modal = document.createElement('div');
        modal.className = 'help-modal';
        modal.innerHTML = `
            <div class="help-content">
                <div class="help-sidebar"></div>
                <div class="help-main"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showHelp(section = 'editor') {
        const modal = document.querySelector('.help-modal');
        const content = this.helpContent[section];
        
        modal.querySelector('.help-main').innerHTML = `
            <h2>${content.title}</h2>
            ${content.content}
        `;
        
        modal.style.display = 'flex';
    }
}