/* global Prism */
// 筆記分類配置 - 使用分類結構管理
const noteCategories = [
    {
        id: 'algorithm',
        title: '演算法',
        notes: [
            {filename: 'Algorithm.md', title: '演算法解題', id: 'Algorithm'},
            {filename: 'Unordered.md', title: '雜湊表應用', id: 'Unordered'},
            {filename: 'Queue.md', title: '佇列與雙端佇列', id: 'Queue'},
            {filename: 'Binary_Search.md', title: '二分搜尋演算法', id: 'Binary_Search'},
            {filename: 'Priority.md', title: '堆積與優先佇列', id: 'Priority'},
            {filename: 'Tree.md', title: '樹與圖論演算法', id: 'Tree'}
        ]
    },
    {
        id: 'system',
        title: '系統開發',
        notes: [
            {filename: '後端整合.md', title: '後端服務整合', id: '後端整合'}
        ]
    }
];

// 砲佳相容性 - 保留舊的 noteFiles 配置方式
const noteFiles = [];
noteCategories.forEach(category => {
    category.notes.forEach(note => {
        noteFiles.push({
            filename: note.filename,
            title: note.title
        });
    });
});

// 根據 note 屬性查找對應的檔案資訊
function getNoteFileInfo(noteAttr) {
    // 先嘗試精確匹配檔案名（不含副檔名）
    const fileInfo = noteFiles.find(nf => {
        const filenameWithoutExt = nf.filename.replace(/\.(md|txt)$/, '');
        return filenameWithoutExt === noteAttr;
    });

    if (fileInfo) {
        return fileInfo;
    }

    // 如果找不到，返回預設值（使用 noteAttr 作為檔案名）
    return {
        filename: noteAttr + '.md',
        title: noteAttr
    };
}

// 動態產生筆記列表 HTML
function generateNotesHTML() {
    const notesGrid = document.querySelector('.notes-grid');
    if (!notesGrid) return;

    // 清除現有內容
    notesGrid.innerHTML = '';

    // 為每個分類產生 HTML
    noteCategories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'note-category expanded'; // 預設展開

        // 分類標題
        const headerElement = document.createElement('div');
        headerElement.className = 'category-header';
        headerElement.innerHTML = `
            <div class="category-title">
                <span class="category-title-text">${category.title}</span>
                <img src="assets/images/chevron_right.svg" alt="展開" class="category-chevron" width="16" height="16">
            </div>
        `;

        // 筆記列表
        const listElement = document.createElement('ul');
        listElement.className = 'note-list';

        category.notes.forEach(note => {
            const listItem = document.createElement('li');
            listItem.className = 'note-item';
            listItem.innerHTML = `
                <span class="note-title" note="${note.id}">${note.title}</span>
            `;
            listElement.appendChild(listItem);
        });

        categoryElement.appendChild(headerElement);
        categoryElement.appendChild(listElement);
        notesGrid.appendChild(categoryElement);
    });
}

// 筆記頁面功能
document.addEventListener('DOMContentLoaded', () => {
    generateNotesHTML();
    initializeNotes();
    setupNoteInteractions();
    handleUrlHash();
    // 頁面載入完成，隱藏載入動畫
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 300);
});

// 處理 URL hash 參數，自動打開指定的筆記
function handleUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        // 移除 # 符號並解碼
        const noteIdentifier = decodeURIComponent(hash.substring(1));
        console.log('從 URL hash 載入筆記:', noteIdentifier);

        // 延遲一點時間確保頁面完全載入
        setTimeout(() => {
            // 嘗試將標識符對應到檔案資訊
            const fileInfo = getNoteFileInfo(noteIdentifier);
            showNoteModal(fileInfo.filename, fileInfo.title);
        }, 100);
    }
}

// 監聽 hash 變化，支援瀏覽器前進/後退
window.addEventListener('hashchange', handleUrlHash);

function initializeNotes() {
    // 為內部筆記添加點擊事件
    const internalNotes = document.querySelectorAll('.note-item');
    internalNotes.forEach(note => {
        note.addEventListener('click', handleInternalNoteClick);
    });
}

function handleInternalNoteClick(event) {
    const noteTitleElement = event.currentTarget.querySelector('.note-title');
    const noteAttr = noteTitleElement.getAttribute('note');

    // 根據 note 屬性獲取檔案資訊
    const fileInfo = getNoteFileInfo(noteAttr);

    console.log('點擊筆記:', noteAttr, '-> 檔案:', fileInfo.filename, '標題:', fileInfo.title);

    // 使用檔案名和標題顯示筆記
    showNoteModal(fileInfo.filename, fileInfo.title);
}

// 從檔案讀取筆記內容，支持 .md 和 .txt
async function loadNoteContent(filename) {
    // filename 已經包含副檔名（例如 'Binary_Search.md'）
    const filenameWithoutExt = filename.replace(/\.(md|txt)$/, '');

    // 先嘗試讀取指定的檔案
    try {
        const response = await fetch(`assets/notes/${filename}`);
        if (response.ok) {
            const content = await response.text();
            const fileType = filename.endsWith('.md') ? 'markdown' : 'text';
            return {
                success: true,
                content: content,
                type: fileType
            };
        }
    } catch (error) {
        console.log(`指定檔案不存在: ${filename}`);
    }

    // 如果指定檔案不存在，嘗試替代副檔名
    const alternateExt = filename.endsWith('.md') ? '.txt' : '.md';
    const alternateFilename = filenameWithoutExt + alternateExt;

    try {
        const response = await fetch(`assets/notes/${alternateFilename}`);
        if (response.ok) {
            const content = await response.text();
            const fileType = alternateFilename.endsWith('.md') ? 'markdown' : 'text';
            return {
                success: true,
                content: content,
                type: fileType
            };
        }
    } catch (error) {
        console.error('讀取筆記內容失敗:', error);
        return {
            success: false,
            error: `無法找到檔案: ${filename} 或 ${alternateFilename}`
        };
    }
}

// 簡單的 Markdown 解析器
function parseMarkdown(text) {
    // 正規化行尾 (支援 Windows CRLF)
    text = text.replace(/\r\n?/g, '\n');

    // 暫存並保護多行程式碼區塊
    const codeBlocks = [];
    text = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang ? `language-${lang.toLowerCase()}` : 'language-text';
        const cleanCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n?/g, '\n');
        const html = `<pre><code class="${language}">${cleanCode}</code></pre>`;
        const placeholder = `@@CODEBLOCK_${codeBlocks.length}@@`;
        codeBlocks.push(html);
        return placeholder;
    });

    // 行內程式碼
    text = text.replace(/`([^`]+)`/g, (match, code) => {
        const cleanCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<code class="language-text">${cleanCode}</code>`;
    });

    // 標題
    text = text
        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*)$/gm, '<h1>$1</h1>');

    // 分隔線 (--- 或 *** 或 ___)
    text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '<hr>');

    // 粗體與斜體
    text = text
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 連結
    text = text.replace(
        /\[([^\]]+)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // 列表項 (先標記為 <li>)
    text = text
        .replace(/^(?:\* |- )(.*)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.*)$/gm, '<li>$1</li>');

    // 合併連續的 <li> 為一個 <ul>
    text = text.replace(/(?:<li>[^<]*<\/li>\n?)+/g, (match) => {
        const items = match.trim().replace(/\n/g, '');
        return `<ul>${items}</ul>`;
    });

    // 分段：以 2+ 連續換行分隔段落（避免產生多個 <br>）
    const blocks = text.split(/\n{2,}/).map(block => block.trim()).filter(b => b.length > 0);

    const htmlBlocks = blocks.map(block => {
        // 如果已是獨立區塊型標籤則直接返回
        if (/^(<h[1-6]>|<ul>|<pre>|<blockquote>|<hr>)/.test(block)) {
            return block;
        }
        // 檢查是否只是單行內容，避免不必要的 <br>
        if (!block.includes('\n')) {
            return `<p>${block}</p>`;
        }
        // 其餘行內換行轉 <br>，但避免連續的 <br>
        const withBr = block.replace(/\n+/g, '<br>');
        return `<p>${withBr}</p>`;
    });

    let html = htmlBlocks.join('');

    // 還原程式碼區塊（保持原始換行，不插入 <br>）
    html = html.replace(/@@CODEBLOCK_(\d+)@@/g, (m, i) => codeBlocks[i]);

    return html;
}


function showNoteModal(filename, title) {
    console.log('正在顯示筆記 - 檔案:', filename, '標題:', title);

    // 更新 URL hash，使用檔案名（不含副檔名）作為識別符
    const filenameWithoutExt = filename.replace(/\.(md|txt)$/, '');
    const newHash = `#${encodeURIComponent(filenameWithoutExt)}`;
    if (window.location.hash !== newHash) {
        history.replaceState(null, null, newHash);
    }

    // 移除所有筆記項目的 active 狀態
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
    });

    // 找到對應的筆記項目並添加 active 狀態
    document.querySelectorAll('.note-item').forEach(item => {
        const noteTitle = item.querySelector('.note-title');
        if (noteTitle && noteTitle.textContent === title) {
            item.classList.add('active');
        }
    });

    const notesLayout = document.querySelector('.notes-layout');
    const noteViewerTitle = document.querySelector('.note-viewer-title');
    const noteViewerBody = document.querySelector('.note-viewer-body');

    // 更新麵包屑導航 - 顯示筆記標題
    const breadcrumbNotes = document.querySelector('.breadcrumb-notes');
    const breadcrumbNoteSeparator = document.querySelector('.breadcrumb-note-separator');
    const breadcrumbNoteTitle = document.querySelector('.breadcrumb-note-title');

    if (breadcrumbNotes && breadcrumbNoteSeparator && breadcrumbNoteTitle) {
        // 將"學習筆記"改為連結
        breadcrumbNotes.classList.remove('breadcrumb-current');
        breadcrumbNotes.classList.add('breadcrumb-link');
        // 當是連結狀態時添加指標樣式
        breadcrumbNotes.style.cursor = 'pointer';
        // 顯示第三層麵包屑
        breadcrumbNoteSeparator.style.display = '';
        breadcrumbNoteTitle.style.display = '';
        breadcrumbNoteTitle.textContent = title;
    }

    // 檢查是否已經在分割視圖模式
    const isAlreadySplit = notesLayout.classList.contains('split-view');

    // 設置標題
    noteViewerTitle.textContent = title;

    // 只有在第一次打開檢視器（還是預設提示文案時）才顯示「載入中」，
    // 避免在筆記之間切換時畫面先清空造成閃爍感
    const loadingElement = noteViewerBody.querySelector('.loading');
    const shouldShowLoading = loadingElement && loadingElement.textContent.includes('選擇一個筆記以查看內容');
    if (shouldShowLoading) {
        noteViewerBody.innerHTML = '<div class="loading">載入中...</div>';
    }

    // 只在尚未切換到分割視圖時才切換
    if (!isAlreadySplit) {
        // 先關閉任何打開的側邊欄
        const blogTitle = document.querySelector('.blogTitle');
        const overlay = document.querySelector('.sidebar-overlay');
        const menuIcon = document.querySelector('.menu img.icon');

        if (blogTitle && blogTitle.classList.contains('show')) {
            blogTitle.classList.remove('show');
            if (overlay) overlay.classList.remove('show');
            if (menuIcon) menuIcon.setAttribute('src', 'assets/images/menu.svg');
        }

        // 使用 requestAnimationFrame 確保 DOM 更新後再添加 class
        requestAnimationFrame(() => {
            notesLayout.classList.add('split-view');
            document.body.classList.add('split-view-active');
        });
    }

    // 載入並顯示筆記內容
    loadNoteContent(filename).then(result => {
        if (result.success) {
            if (result.type === 'markdown') {
                // Markdown 內容解析並渲染為 HTML
                const htmlContent = parseMarkdown(result.content);
                noteViewerBody.innerHTML = `<div class="note-content markdown-content">${htmlContent}</div>`;

                // 觸發 Prism.js 語法高亮
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAllUnder(noteViewerBody);
                }
            } else {
                // 純文字內容保持原格式
                noteViewerBody.innerHTML = `<pre class="note-content text-content"><code class="language-text">${result.content}</code></pre>`;

                // 觸發 Prism.js 語法高亮
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAllUnder(noteViewerBody);
                }
            }
        } else {
            noteViewerBody.innerHTML = `
                <div class="error-message">
                    <p>無法載入筆記內容</p>
                    <p class="error-detail">${result.error}</p>
                    <p class="note-placeholder">這是 <strong>${title}</strong> 的佔位內容，實際內容將從對應的 .md 或 .txt 檔案載入。</p>
                </div>
            `;
        }
        // 滾動到頂部
        noteViewerBody.scrollTop = 0;
    }).catch(error => {
        console.error('載入筆記內容時發生錯誤:', error);
        noteViewerBody.innerHTML = `
            <div class="error-message">
                <p>載入筆記時發生錯誤</p>
                <p class="error-detail">${error.message}</p>
            </div>
        `;
    });
}

function closeNoteModal() {
    console.log('正在關閉筆記檢視器');
    const notesLayout = document.querySelector('.notes-layout');
    const noteViewerBody = document.querySelector('.note-viewer-body');
    const breadcrumbNotes = document.querySelector('.breadcrumb-notes');
    const breadcrumbNoteSeparator = document.querySelector('.breadcrumb-note-separator');
    const breadcrumbNoteTitle = document.querySelector('.breadcrumb-note-title');

    // 移除所有筆記項目的 active 狀態
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
    });

    // 移除分割視圖模式
    notesLayout.classList.remove('split-view');
    document.body.classList.remove('split-view-active');

    // 重置內容
    noteViewerBody.innerHTML = '<div class="loading">選擇一個筆記以查看內容</div>';

    // 重置麵包屑導航 - 隱藏第三層，將"學習筆記"恢復為非連結
    if (breadcrumbNotes && breadcrumbNoteSeparator && breadcrumbNoteTitle) {
        // 將"學習筆記"改回非連結狀態
        breadcrumbNotes.classList.remove('breadcrumb-link');
        breadcrumbNotes.classList.add('breadcrumb-current');
        breadcrumbNotes.style.cursor = 'inherit';
        // 隱藏第三層麵包屑
        breadcrumbNoteSeparator.style.display = 'none';
        breadcrumbNoteTitle.style.display = 'none';
        breadcrumbNoteTitle.textContent = '';
    }

    // 清除 URL hash
    history.replaceState(null, null, window.location.pathname);
}


function setupNoteInteractions() {
    // 設置分類展開/收合功能
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            // 如果點擊的是筆記項目，不要觸發分類折疊
            if (e.target.closest('.note-item')) {
                return;
            }

            const category = header.closest('.note-category');
            category.classList.toggle('expanded');
        });
    });

    // 設置麵包屑「學習筆記」的點擊事件
    const breadcrumbNotes = document.querySelector('.breadcrumb-notes');
    if (breadcrumbNotes) {
        breadcrumbNotes.addEventListener('click', (e) => {
            // 只有當它是連結狀態時才觸發關閉
            if (breadcrumbNotes.classList.contains('breadcrumb-link')) {
                e.preventDefault();
                closeNoteModal();
            }
        });
    }

    // 設置關閉按鈕
    const closeBtn = document.querySelector('.note-viewer-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNoteModal);
    }

    // ESC 鍵關閉
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const notesLayout = document.querySelector('.notes-layout');
            if (notesLayout && notesLayout.classList.contains('split-view')) {
                closeNoteModal();
            }
        }
    });

    console.log('筆記互動功能已準備就緒');
}
