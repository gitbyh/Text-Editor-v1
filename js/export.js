import { saveAs } from 'file-saver';
import HTMLtoDOCX from 'html-to-docx';
import html2pdf from 'html2pdf.js';

class ExportManager {
    constructor(editor) {
        this.editor = editor;
    }

    async exportDocument(format) {
        const content = this.editor.getContent();
        const fileName = this.editor.getCurrentFileName();

        switch (format.toLowerCase()) {
            case 'txt':
                this.exportTXT(content, fileName);
                break;
            case 'html':
                this.exportHTML(content, fileName);
                break;
            case 'docx':
                await this.exportDOCX(content, fileName);
                break;
            case 'pdf':
                await this.exportPDF(content, fileName);
                break;
            default:
                throw new Error('Unsupported format');
        }
    }

    exportTXT(content, fileName) {
        const plainText = content.replace(/<[^>]+>/g, '');
        const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${fileName}.txt`);
    }

    exportHTML(content, fileName) {
        const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
        saveAs(blob, `${fileName}.html`);
    }

    async exportDOCX(content, fileName) {
        const docx = await HTMLtoDOCX(content, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true
        });
        saveAs(docx, `${fileName}.docx`);
    }

    async exportPDF(content, fileName) {
        const element = document.createElement('div');
        element.innerHTML = content;
        
        const opt = {
            margin: 1,
            filename: `${fileName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();
    }
}