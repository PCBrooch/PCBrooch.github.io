// source/js/copy-to-clipboard.js
class ClipboardHelper {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createToast();
    }

    setupEventListeners() {
        // 事件委托处理所有复制按钮
        document.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('.copy-btn, .text-copy-btn');
            if (copyBtn) {
                this.handleCopy(copyBtn);
            }
        });
    }

    handleCopy(button) {
        let textToCopy = '';
        
        // 获取要复制的文本
        if (button.classList.contains('copy-btn')) {
            // 代码块复制
            const container = button.closest('.copy-container');
            const codeElement = container?.querySelector('.copy-content');
            textToCopy = codeElement ? codeElement.textContent.trim() : '';
        } else if (button.classList.contains('text-copy-btn')) {
            // 文本复制
            const container = button.closest('.text-copy-container');
            const textElement = container?.querySelector('.text-copy-content');
            textToCopy = textElement ? textElement.textContent.trim() : '';
        }

        if (textToCopy) {
            this.copyToClipboard(textToCopy, button);
        }
    }

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            this.showSuccess(button);
        } catch (err) {
            this.fallbackCopy(text, button);
        }
    }

    fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showSuccess(button);
            } else {
                this.showError('复制失败，请手动复制');
            }
        } catch (err) {
            this.showError('复制失败: ' + err);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    showSuccess(button) {
        // 按钮状态变化
        const originalText = button.innerHTML;
        const originalClass = button.className;
        
        button.innerHTML = '<span>已复制!</span>';
        button.classList.add('copied');
        
        // 显示 toast
        this.showToast('内容已复制到剪贴板！', 'success');
        
        // 3秒后恢复
        setTimeout(() => {
            button.innerHTML = originalText;
            button.className = originalClass;
        }, 3000);
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    createToast() {
        if (!document.getElementById('global-copy-toast')) {
            const toast = document.createElement('div');
            toast.id = 'global-copy-toast';
            toast.className = 'copy-toast';
            document.body.appendChild(toast);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('global-copy-toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `copy-toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new ClipboardHelper();
});

// 全局函数，方便直接调用
window.copyToClipboard = async (text, element) => {
    const helper = new ClipboardHelper();
    await helper.copyToClipboard(text, element);
};