// --- REPLACE YOUR ENTIRE EXISTING WebBuilderPro CLASS WITH THIS ---

class WebBuilderPro {
    constructor() {
        this.selectedElement = null;
        this.currentBreakpoint = 'desktop';
        this.history = [];
        this.historyIndex = -1;
        this.components = new Map();
        this.assets = [];
        this.draggedElement = null;
        this.codeEditor = null;
        this.currentCodeTab = 'html';
        this.isResizing = false;
        this.googleFonts = [
            "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway"
        ];
        this.globalStyles = {};
        this.currentState = 'base';
        this.dropTarget = null;
        this.dropPosition = null;
        this.init();
    }

    init() {
        this.loadComponents();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupMonacoEditor();
        this.setupResizing();
        this.loadFromLocalStorage();
    }

    //
    // --- CORE INTERACTION LOGIC ---
    //

    loadComponents() {
        this.components.set('text', {
            name: 'Text',
            html: '<p>Sample text content</p>',
            defaultStyles: { padding: '10px' }
        });

        this.components.set('heading', {
            name: 'Heading',
            html: '<h2>Sample Heading</h2>',
            defaultStyles: { padding: '10px' }
        });

        this.components.set('button', {
            name: 'Button',
            html: '<button class="btn">Click Me</button>',
            defaultStyles: { padding: '10px' }
        });
        
        this.components.set('image', {
            name: 'Image',
            html: '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTZweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2FhYSI+MjAweDE1MDwvdGV4dD48L3N2Zz4=" alt="Placeholder">',
            defaultStyles: { width: '200px', height: '150px' }
        });

        this.components.set('container', {
            name: 'Container',
            html: '<div class="drop-zone p-4"></div>',
            defaultStyles: {
                padding: '20px',
                width: '100%',
                minHeight: '100px',
            }
        });

        this.components.set('row', {
            name: 'Row',
            html: '<div class="drop-zone p-2"></div>',
            defaultStyles: {
                display: 'flex',
                gap: '16px',
                padding: '10px',
                width: '100%',
                minHeight: '80px',
            }
        });

        this.components.set('two-columns', {
            name: 'Two Columns',
            html: `<div class="canvas-element" data-component-type="column" style="flex: 1; min-height: 50px;"><div class="drop-zone p-2"></div></div>
                <div class="canvas-element" data-component-type="column" style="flex: 1; min-height: 50px;"><div class="drop-zone p-2"></div></div>`,
            defaultStyles: {
                display: 'flex',
                gap: '16px',
                width: '100%',
                padding: '10px'
            },
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => this.switchTab(btn.dataset.tab)));
        document.getElementById('canvas').addEventListener('click', e => { if (!e.target.closest('.canvas-element')) this.handleCanvasClick(e); });
        document.getElementById('page-settings-btn').addEventListener('click', () => this.selectPageBody());
        document.querySelectorAll('.breakpoint-button').forEach(btn => btn.addEventListener('click', () => this.switchBreakpoint(btn.dataset.breakpoint)));
        
        // Buttons
        document.getElementById('save-btn').addEventListener('click', () => this.save());
        document.getElementById('export-btn').addEventListener('click', () => this.export());
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('preview-btn').addEventListener('click', () => this.showPreview());
        document.getElementById('code-btn').addEventListener('click', () => this.showCodeEditor());
        document.getElementById('close-preview').addEventListener('click', () => this.hidePreview());
        document.getElementById('close-code').addEventListener('click', () => this.hideCodeEditor());
        document.querySelectorAll('.code-tab-btn').forEach(btn => btn.addEventListener('click', () => this.switchCodeTab(btn.dataset.codeTab)));
        
        // Interactions
        document.getElementById('zoom-slider').addEventListener('input', e => this.setZoom(e.target.value));
        document.getElementById('upload-asset').addEventListener('change', e => this.handleAssetUpload(e));
        document.getElementById('canvas').addEventListener('dblclick', e => this.handleDoubleClick(e));
        document.getElementById('canvas').addEventListener('contextmenu', e => this.handleContextMenu(e));
        window.addEventListener('click', () => document.getElementById('context-menu').classList.add('hidden'), true);
        document.addEventListener('keydown', e => this.handleKeyboardShortcuts(e));
    }

    bindInteractiveEvents(el) {
        el.draggable = true;
        el.addEventListener('dragstart', e => {
            e.stopPropagation();
            e.dataTransfer.effectAllowed = 'move';
            this.draggedElement = { type: 'element-reorder', element: el };
            setTimeout(() => el.classList.add('opacity-50'), 0);
        });
        el.addEventListener('dragend', e => {
            e.stopPropagation();
            document.querySelectorAll('.opacity-50').forEach(elem => elem.classList.remove('opacity-50'));
        });
        el.addEventListener('mousedown', e => {
            if (e.button !== 0 || e.target.classList.contains('resizer')) return;
            e.stopPropagation();
            this.selectElement(el);
        });
    }

    selectElement(element) {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
        }
        this.selectedElement = element;
        this.selectedElement.classList.add('selected');

        this.showProperties(element);
        this.updateBreadcrumbs();
        this.updateSelectionBox();

        document.querySelectorAll('.layer-item.active-layer').forEach(item => item.classList.remove('active-layer'));
        const activeLayer = document.querySelector(`.layer-item[data-element-id="${element.dataset.elementId}"]`);
        if (activeLayer) activeLayer.classList.add('active-layer');

        const selectionBox = document.getElementById('selection-box');
        const isStatic = getComputedStyle(element).position === 'static';
        const canResize = element.style.width && element.style.height;
        if (isStatic && !canResize) {
            selectionBox.querySelectorAll('.resizer').forEach(r => r.style.display = 'none');
        } else {
            selectionBox.querySelectorAll('.resizer').forEach(r => r.style.display = 'block');
        }
    }
    
    handleCanvasClick(e) {
        this.selectedElement?.classList.remove('selected');
        this.selectedElement = null;
        this.showProperties(null);
        this.updateSelectionBox();
        this.updateBreadcrumbs();
    }

    handleKeyboardShortcuts(e) {
        if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
        
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z': e.preventDefault(); e.shiftKey ? this.redo() : this.undo(); break;
                case 's': e.preventDefault(); this.save(); break;
            }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            if (this.selectedElement) {
                e.preventDefault();
                this.deleteElement(this.selectedElement);
            }
        }
    }
    

    getInnermostTextElement(element) {
    if (!element) return null;
    return element.querySelector('p, h1, h2, h3, h4, h5, h6, button, a, span');
}

getElementText(element) {
    const textElement = this.getInnermostTextElement(element);
    return textElement ? textElement.textContent : '';
}

updateElementContent(content) {
    if (!this.selectedElement) return;
    const textElement = this.getInnermostTextElement(this.selectedElement);
    if (textElement) textElement.textContent = content;
    this.saveToHistory();
}

updateSelectionBox() {
    const selectionBox = document.getElementById('selection-box');
    if (!this.selectedElement) {
        selectionBox.classList.remove('active');
        return;
    }
    const rect = this.selectedElement.getBoundingClientRect();
    const scrollArea = document.getElementById('scroll-area');
    const scrollAreaRect = scrollArea.getBoundingClientRect();
    selectionBox.style.left = (rect.left - scrollAreaRect.left + scrollArea.scrollLeft) + 'px';
    selectionBox.style.top = (rect.top - scrollAreaRect.top + scrollArea.scrollTop) + 'px';
    selectionBox.style.width = rect.width + 'px';
    selectionBox.style.height = rect.height + 'px';
    selectionBox.classList.add('active');
}

setupResizing() {
    const selectionBox = document.getElementById('selection-box');
    const resizers = selectionBox.querySelectorAll('.resizer');
    let initialRect;
    let currentResizer;
    const onResizeMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentResizer = e.target;
        this.isResizing = true;
        initialRect = this.selectedElement.getBoundingClientRect();
        document.addEventListener('mousemove', onResizeMouseMove);
        document.addEventListener('mouseup', onResizeMouseUp);
    };
    const onResizeMouseMove = (e) => {
        if (!this.isResizing) return;
        const style = this.selectedElement.style;
        const isAbsolute = style.position === 'absolute';
        const dx = e.clientX - initialRect.left;
        const dy = e.clientY - initialRect.top;
        const dWidth = e.clientX - initialRect.right;
        const dHeight = e.clientY - initialRect.bottom;

        if (currentResizer.classList.contains('bottom-right')) {
            style.width = initialRect.width + dWidth + 'px';
            style.height = initialRect.height + dHeight + 'px';
        } else if (currentResizer.classList.contains('top-left')) {
            style.width = initialRect.width - dx + 'px';
            style.height = initialRect.height - dy + 'px';
            if (isAbsolute) {
                style.top = initialRect.top + dy + 'px';
                style.left = initialRect.left + dx + 'px';
            }
        }
        // Add other resizer logic here if needed
        this.updateSelectionBox();
    };
    const onResizeMouseUp = () => {
        this.isResizing = false;
        document.removeEventListener('mousemove', onResizeMouseMove);
        document.removeEventListener('mouseup', onResizeMouseUp);
        this.saveToHistory();
    };
    resizers.forEach(resizer => {
        resizer.style.pointerEvents = 'all';
        resizer.addEventListener('mousedown', onResizeMouseDown);
    });
}

    reattachEventListenersToElement(element) {
        const elements = [element, ...element.querySelectorAll('.canvas-element')];
        elements.forEach(el => this.bindInteractiveEvents(el));
    }

    switchBreakpoint(breakpoint) {
        this.currentBreakpoint = breakpoint;
        document.querySelectorAll('.breakpoint-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.breakpoint === breakpoint);
        });
        this.updateCanvasSize();
        document.querySelectorAll('.canvas-element').forEach(el => this.applyAllStyles(el));
        if (this.selectedElement) this.updateSelectionBox();
    }

    updateCanvasSize() {
        const container = document.getElementById('canvas-container');
        const sizes = { desktop: '1024px', tablet: '768px', mobile: '375px' };
        container.style.width = sizes[this.currentBreakpoint];
    }

    save() {
        const projectData = {
            canvas: document.getElementById('canvas').innerHTML,
            assets: this.assets,
        };
        localStorage.setItem('webbuilder_project', JSON.stringify(projectData));
        this.showNotification('Project saved!');
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('webbuilder_project');
        if (saved) {
            const projectData = JSON.parse(saved);
            document.getElementById('canvas').innerHTML = projectData.canvas;
            this.assets = projectData.assets || [];
            this.updateAssetsGrid();
            this.updateLayersTree();
            document.querySelectorAll('.canvas-element').forEach(el => this.reattachEventListenersToElement(el));
        }
    }

    saveToHistory() {
        const state = document.getElementById('canvas').innerHTML;
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(state);
        this.historyIndex = this.history.length - 1;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            document.getElementById('canvas').innerHTML = this.history[this.historyIndex];
            document.querySelectorAll('.canvas-element').forEach(el => this.reattachEventListenersToElement(el));
            this.selectElement(null);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            document.getElementById('canvas').innerHTML = this.history[this.historyIndex];
            document.querySelectorAll('.canvas-element').forEach(el => this.reattachEventListenersToElement(el));
            this.selectElement(null);
        }
    }

    generateId() {
        return 'el_' + Math.random().toString(36).substr(2, 9);
    }

    rgbToHex(rgb) {
        if (!rgb || !rgb.includes('rgb')) return '#ffffff';
        const result = rgb.match(/\d+/g).map(x => parseInt(x).toString(16).padStart(2, '0'));
        return `#${result.join('')}`;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }


    //
    // --- DRAG & DROP LOGIC ---
    //

    setupDragAndDrop() {
        document.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('dragstart', e => {
                this.draggedElement = { type: 'component', componentType: e.target.dataset.component };
                e.dataTransfer.effectAllowed = 'copy';
            });
        });
        const canvas = document.getElementById('canvas');
        canvas.addEventListener('dragover', e => this.handleDragOver(e));
        canvas.addEventListener('dragleave', () => this.handleDragLeave());
        canvas.addEventListener('drop', e => this.handleDrop(e));
    }
    
    handleDragOver(e) {
        e.preventDefault();
        const dropIndicator = document.getElementById('drop-indicator');
        const target = e.target;
        const dropZone = target.closest('.drop-zone');
        const closestElement = target.closest('.canvas-element');
        
        document.querySelectorAll('.drop-zone.drag-over').forEach(el => el.classList.remove('drag-over'));
        
        this.dropTarget = null;
        this.dropPosition = null;

        if (!dropZone) {
            dropIndicator.classList.add('hidden');
            return;
        }

        const dropZoneChildren = Array.from(dropZone.children).filter(c => c.classList.contains('canvas-element'));

        if (dropZoneChildren.length === 0) {
            dropZone.classList.add('drag-over');
            dropIndicator.classList.add('hidden');
            this.dropTarget = dropZone;
            this.dropPosition = 'inside';
        } else if (closestElement && closestElement.parentElement === dropZone) {
            const rect = closestElement.getBoundingClientRect();
            const isFirstHalf = e.clientY < rect.top + rect.height / 2;
            dropIndicator.classList.remove('hidden');
            dropIndicator.style.left = rect.left + 'px';
            dropIndicator.style.width = rect.width + 'px';

            if (isFirstHalf) {
                dropIndicator.style.top = rect.top + 'px';
                this.dropPosition = 'before';
            } else {
                dropIndicator.style.top = rect.bottom + 'px';
                this.dropPosition = 'after';
            }
            this.dropTarget = closestElement;
        } else {
             dropIndicator.classList.add('hidden');
        }
    }

    handleDragLeave() {
        document.querySelectorAll('.drop-zone.drag-over').forEach(el => el.classList.remove('drag-over'));
        document.getElementById('drop-indicator').classList.add('hidden');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.handleDragLeave(); // Cleanup UI

        if (!this.draggedElement || !this.dropTarget) return;

        if (this.draggedElement.type === 'component') {
            this.addComponent(this.draggedElement.componentType);
        } else if (this.draggedElement.type === 'element-reorder') {
            const elToMove = this.draggedElement.element;
            if (this.dropPosition === 'inside') this.dropTarget.appendChild(elToMove);
            else if (this.dropPosition === 'before') this.dropTarget.parentNode.insertBefore(elToMove, this.dropTarget);
            else if (this.dropPosition === 'after') this.dropTarget.after(elToMove);
            this.saveToHistory();
        }
        
        this.draggedElement = null;
        this.dropTarget = null;
        this.dropPosition = null;
    }

    //
    // --- COMPONENT & ELEMENT LOGIC ---
    //
    
    addComponent(componentType) {
        const component = this.components.get(componentType);
        if (!component || !this.dropTarget) return;

        const element = document.createElement('div');
        element.className = 'canvas-element';
        element.dataset.componentType = componentType;
        element.dataset.elementId = this.generateId();
        
        if (component.defaultStyles) Object.assign(element.style, component.defaultStyles);
        
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = component.html;
        while (tempContainer.firstChild) {
            element.appendChild(tempContainer.firstChild);
        }
        
        if (this.dropPosition === 'inside') this.dropTarget.appendChild(element);
        else if (this.dropPosition === 'before') this.dropTarget.parentNode.insertBefore(element, this.dropTarget);
        else if (this.dropPosition === 'after') this.dropTarget.after(element);
        
        this.reattachEventListenersToElement(element);
        this.selectElement(element);
        this.saveToHistory();
        this.updateLayersTree();
    }
    
    deleteElement(element) {
        if (element) {
            element.remove();
            if(this.selectedElement === element) {
                this.selectedElement = null;
                this.showProperties(null);
                this.updateSelectionBox();
            }
            this.saveToHistory();
            this.updateLayersTree();
        }
    }

    //
    // --- PROPERTIES PANEL UI LOGIC (Corrected & Complete) ---
    //

    showProperties(element) {
        const panel = document.getElementById('properties-panel');
        if (!element) {
            panel.innerHTML = '<div class="p-4 text-center text-gray-500"><p>Select an element</p></div>';
            return;
        }
        const componentType = element.dataset.componentType || 'element';
        let propertiesHTML = `
            <div class="p-4 space-y-4">
                <h3 class="font-semibold">${componentType.charAt(0).toUpperCase() + componentType.slice(1)}</h3>
                <div>
                    <label class="text-sm font-medium">State</label>
                    <select class="property-input mt-1" onchange="app.currentState = this.value; app.showProperties(app.selectedElement);">
                        <option value="base" ${this.currentState === 'base' ? 'selected' : ''}>Base</option>
                        <option value="hover" ${this.currentState === 'hover' ? 'selected' : ''}>Hover</option>
                    </select>
                </div>
                ${this.generateFlexChildPropertiesHTML(element)}
                ${this.generateLayoutPropertiesHTML(element)}
                ${this.generateTypographyPropertiesHTML(element)}
                ${this.generateBackgroundPropertiesHTML(element)}
                ${this.generateContentEditingHTML(element)}
            </div>`;
        panel.innerHTML = propertiesHTML;
    }

    generateFlexChildPropertiesHTML(element) {
        const parent = element.parentElement;
        if (parent && getComputedStyle(parent).display === 'flex') {
            return `<div class="sidebar-section">
                <h4 class="font-medium mb-2">Flex Child</h4>
                <div class="grid grid-cols-2 gap-2">
                    <div><label class="text-xs">Grow</label><input type="number" class="property-input" placeholder="0" value="${this.getCurrentStyle('flexGrow') || ''}" oninput="app.updateElementStyle('flexGrow', this.value)"></div>
                    <div><label class="text-xs">Shrink</label><input type="number" class="property-input" placeholder="1" value="${this.getCurrentStyle('flexShrink') || ''}" oninput="app.updateElementStyle('flexShrink', this.value)"></div>
                </div></div>`;
        }
        return '';
    }

    generateLayoutPropertiesHTML(element) {
        const flexParentControls = getComputedStyle(element).display === 'flex' ? `<h4 class="font-medium my-2 border-t pt-2">Flex Container</h4><div class="grid grid-cols-2 gap-2">
            <div><label class="text-xs">Direction</label><select class="property-input" oninput="app.updateElementStyle('flexDirection', this.value)" value="${this.getCurrentStyle('flexDirection') || 'row'}"><option value="row">Row</option><option value="column">Column</option></select></div>
            <div><label class="text-xs">Align Items</label><select class="property-input" oninput="app.updateElementStyle('alignItems', this.value)" value="${this.getCurrentStyle('alignItems') || 'stretch'}"><option value="stretch">Stretch</option><option value="flex-start">Start</option><option value="center">Center</option><option value="flex-end">End</option></select></div>
            <div><label class="text-xs">Justify Content</label><select class="property-input" oninput="app.updateElementStyle('justifyContent', this.value)" value="${this.getCurrentStyle('justifyContent') || 'flex-start'}"><option value="flex-start">Start</option><option value="center">Center</option><option value="flex-end">End</option><option value="space-between">Space Between</option></select></div>
        </div>` : '';
            
        return `<div class="sidebar-section"><h4 class="font-medium mb-2">Layout & Sizing</h4><div class="grid grid-cols-2 gap-2 mb-2">
            <div><label class="text-xs">Display</label><select class="property-input" oninput="app.updateElementStyle('display', this.value)" value="${this.getCurrentStyle('display') || 'block'}"><option value="block">Block</option><option value="flex">Flex</option><option value="inline-block">Inline-Block</option><option value="none">None</option></select></div>
            <div><label class="text-xs">Position</label><select class="property-input" oninput="app.updateElementStyle('position', this.value)" value="${this.getCurrentStyle('position') || 'static'}"><option value="static">Static</option><option value="relative">Relative</option><option value="absolute">Absolute</option></select></div>
            <div><label class="text-xs">Width</label><input type="text" class="property-input" value="${this.getCurrentStyle('width') || 'auto'}" oninput="app.updateElementStyle('width', this.value)"></div>
            <div><label class="text-xs">Height</label><input type="text" class="property-input" value="${this.getCurrentStyle('height') || 'auto'}" oninput="app.updateElementStyle('height', this.value)"></div>
            <div><label class="text-xs">Margin</label><input type="text" class="property-input" value="${this.getCurrentStyle('margin') || ''}" oninput="app.updateElementStyle('margin', this.value)"></div>
            <div><label class="text-xs">Padding</label><input type="text" class="property-input" value="${this.getCurrentStyle('padding') || ''}" oninput="app.updateElementStyle('padding', this.value)"></div>
        </div>${flexParentControls}</div>`;
    }

    generateTypographyPropertiesHTML(element) {
        return `<div class="sidebar-section"><h4 class="font-medium mb-2">Typography</h4><div class="grid grid-cols-2 gap-2">
            <div><label class="text-xs">Size</label><input type="text" class="property-input" value="${this.getCurrentStyle('fontSize') || ''}" oninput="app.updateElementStyle('fontSize', this.value)"></div>
            <div><label class="text-xs">Color</label><input type="color" class="w-full h-8" value="${this.rgbToHex(this.getCurrentStyle('color'))}" oninput="app.updateElementStyle('color', this.value)"></div>
        </div></div>`;
    }

    generateBackgroundPropertiesHTML(element) {
        return `<div class="sidebar-section"><h4 class="font-medium mb-2">Background</h4>
            <label class="text-xs">Color</label><input type="color" class="w-full h-8" value="${this.rgbToHex(this.getCurrentStyle('backgroundColor'))}" oninput="app.updateElementStyle('backgroundColor', this.value)">
        </div>`;
    }

    generateContentEditingHTML(element) {
         if (!this.getInnermostTextElement(element)) return '';
         return `<div class="sidebar-section"><h4 class="font-medium mb-2">Content</h4>
            <textarea class="property-input h-20" oninput="app.updateElementContent(this.value)">${this.getElementText(element)}</textarea>
         </div>`;
    }

    //
    // --- STYLING & STATE LOGIC ---
    //
    
    updateElementStyle(property, value) {
        if (!this.selectedElement) return;
        let styles = {};
        try { styles = JSON.parse(this.selectedElement.dataset.styles || '{}'); } catch (e) { styles = {}; }

        if (!styles[this.currentState]) styles[this.currentState] = {};
        if (!styles[this.currentState][this.currentBreakpoint]) styles[this.currentState][this.currentBreakpoint] = {};

        styles[this.currentState][this.currentBreakpoint][property] = value;
        this.selectedElement.dataset.styles = JSON.stringify(styles);
        this.applyAllStyles(this.selectedElement);
        this.saveToHistory();
    }
    


    // --- REPLACE the existing applyAllStyles method ---
// --- REPLACE the existing applyAllStyles method with this responsive one ---
    applyAllStyles(element) {
        if (!element || !element.dataset) return;

        let allStylesData = {};
        try { allStylesData = JSON.parse(element.dataset.styles || '{}'); } catch (e) { return; }

        const baseStyles = allStylesData.base || {};
        
        // Clear all previous inline styles to start fresh
        element.style.cssText = '';

        // ** THE NEW RESPONSIVE LOGIC **
        // 1. Always start with the base desktop styles.
        let finalStyle = { ...(baseStyles.desktop || {}) };
        
        // 2. Layer tablet styles on top if we're on tablet or mobile view.
        if (this.currentBreakpoint === 'tablet' || this.currentBreakpoint === 'mobile') {
            Object.assign(finalStyle, baseStyles.tablet || {});
        }
        
        // 3. Layer mobile styles on top only if we're on mobile view.
        if (this.currentBreakpoint === 'mobile') {
            Object.assign(finalStyle, baseStyles.mobile || {});
        }
        
        // Apply the final calculated styles
        Object.entries(finalStyle).forEach(([prop, val]) => {
            // Basic text-style inheritance can be complex, for now we apply directly.
            // A more advanced system would check the componentType.
            const innerTextElement = this.getInnermostTextElement(element);
            const typographyProps = ['color', 'fontSize', 'fontWeight', 'textAlign'];
            if (typographyProps.includes(prop) && innerTextElement) {
                innerTextElement.style[prop] = val;
            } else {
                element.style[prop] = val;
            }
        });

        // The live hover preview logic remains the same and is great.
        element.onmouseenter = () => { /* ... existing code ... */ };
        element.onmouseleave = () => this.applyAllStyles(element); // Re-apply base on leave
    }

    updateElementContent(content) {
        if (this.selectedElement) {
            const textElement = this.selectedElement.querySelector('p, h1, h2, h3, h4, h5, h6, button, label');
            if (textElement) {
                textElement.textContent = content;
            }
            this.saveToHistory();
        }
    }

    updateElementAttribute(attr, value, selector) {
        if (this.selectedElement) {
            const target = this.selectedElement.querySelector(selector);
            if (target) {
                target.setAttribute(attr, value);
                this.saveToHistory();
            }
        }
    }

    getElementText(element) {
        const textElement = element.querySelector('p, h1, h2, h3, h4, h5, h6, button, label');
        return textElement ? textElement.textContent : '';
    }

    rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return '#ffffff';
        if (rgb.startsWith('#')) return rgb;
        
        const result = rgb.match(/\d+/g);
        if (!result) return '#ffffff';
        
        return '#' + result.map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    deleteElement(element) {
        if (element) {
            element.remove();
            this.selectedElement = null;
            document.getElementById('properties-panel').innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    <i class="fas fa-mouse-pointer text-3xl mb-2 block"></i>
                    <p>Select an element to edit its properties</p>
                </div>
            `;
            this.saveToHistory();
            this.updateLayersTree();
        }
    }


    handleCanvasClick(e){
        if (e.target.closest('.canvas-element')) return;
        document.querySelectorAll('.canvas-element').forEach(x=>x.classList.remove('selected'));
        this.selectedElement=null;
        document.getElementById('properties-panel').innerHTML = `<div class="p-4 text-center text-gray-500"><i class="fas fa-mouse-pointer text-3xl mb-2"></i><p>Select an element to edit its properties</p></div>`;
    }

    updateLayersTree() {
    const tree = document.getElementById('layers-tree');
    const canvas = document.getElementById('canvas');
    tree.innerHTML = this.generateLayersHTML(canvas, 0);

    // Add event listeners AFTER generating the HTML
    tree.querySelectorAll('.layer-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const elementId = item.dataset.elementId;
            const elementToSelect = document.querySelector(`[data-element-id="${elementId}"]`);
            if (elementToSelect) {
                this.selectElement(elementToSelect);
                // Optional: scroll the element into view on the canvas
                elementToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

    generateLayersHTML(container, depth) {
        let html = '';
        const elements = Array.from(container.children).filter(el => el.classList.contains('canvas-element'));
        
        elements.forEach(element => {
            const componentType = element.dataset.componentType;
            const elementId = element.dataset.elementId;
            const indent = 'pl-' + (depth * 4);
            
            html += `
                <div class="layer-item ${indent} py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center" data-element-id="${elementId}">
                    <i class="fas fa-${this.getComponentIcon(componentType)} mr-2 text-gray-500"></i>
                    <span class="text-sm">${componentType}</span>
                </div>
            `;
            
            // Check for nested elements
            const nested = Array.from(element.children).filter(el => el.classList.contains('canvas-element'));
            if (nested.length > 0) {
                html += this.generateLayersHTML(element, depth + 1);
            }
        });
        
        return html;
    }

    getComponentIcon(componentType) {
        const icons = {
            text: 'font',
            heading: 'heading',
            button: 'mouse-pointer',
            image: 'image',
            container: 'square',
            row: 'columns',
            navbar: 'bars',
            card: 'id-card',
            form: 'wpforms',
            video: 'video'
        };
        return icons[componentType] || 'cube';
    }

    selectElementById(elementId) {
        const element = document.querySelector(`[data-element-id="${elementId}"]`);
        if (element) {
            this.selectElement(element);
        }
    }

    generateId() {
        return 'element_' + Math.random().toString(36).substr(2, 9);
    }

    handleAssetUpload(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.assets.push({
                        id: this.generateId(),
                        name: file.name,
                        type: file.type,
                        data: e.target.result
                    });
                    this.updateAssetsGrid();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    updateAssetsGrid() {
        const grid = document.getElementById('assets-grid');
        grid.innerHTML = this.assets.map(asset => `
            <div class="asset-item border rounded p-2 cursor-pointer hover:bg-gray-50" draggable="true" data-asset-id="${asset.id}">
                ${asset.type.startsWith('image/') 
                    ? `<img src="${asset.data}" alt="${asset.name}" class="w-full h-20 object-cover rounded mb-1 pointer-events-none">`
                    : `<div class="w-full h-20 bg-gray-200 rounded mb-1 flex items-center justify-center pointer-events-none"><i class="fas fa-video text-gray-500"></i></div>`
                }
                <p class="text-xs truncate pointer-events-none">${asset.name}</p>
            </div>
        `).join('');

        grid.querySelectorAll('.asset-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = {
                    type: 'asset',
                    assetId: e.target.dataset.assetId
                };
            });
        });
    }

    showPreview() {
        const modal = document.getElementById('preview-modal');
        const frame = document.getElementById('preview-frame');
        
        const html = this.generatePreviewHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        frame.src = url;
        modal.classList.remove('hidden');
    }

    hidePreview() {
        document.getElementById('preview-modal').classList.add('hidden');
    }

    generatePreviewHTML() {
        const canvas = document.getElementById('canvas');
        const styles = this.extractStyles();
        
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
                <style>
                    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
                    .row { display: flex; gap: 20px; align-items: stretch; }
                    .col { flex: 1; }
                    .card-header { padding: 15px; background: #f8f9fa; border-bottom: 1px solid #e9ecef; font-weight: bold; }
                    .card-body { padding: 15px; }
                    .nav-brand { font-weight: bold; font-size: 18px; }
                    .nav-menu { list-style: none; display: flex; gap: 20px; margin: 0; padding: 0; }
                    .nav-menu a { text-decoration: none; color: inherit; }
                    .form-group { margin-bottom: 15px; }
                    .form-group label { display: block; margin-bottom: 5px; font-weight: medium; }
                    .form-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
                    ${styles}
                </style>
            </head>
            <body>
                ${this.getCleanHTML(canvas)}
            </body>
            </html>
        `;
    }

    getCleanHTML(container) {
        const clone = container.cloneNode(true);
        
        // Remove editor-specific elements
        clone.querySelectorAll('.element-controls').forEach(el => el.remove());
        clone.querySelectorAll('.canvas-element').forEach(el => {
            el.classList.remove('canvas-element', 'selected');
            el.removeAttribute('data-component-type');
        });
        
        return clone.innerHTML;
    }


    extractStyles() {
        let css = '';
        const elements = document.querySelectorAll('.canvas-element[data-element-id]');

        // --- Inside extractStyles() ---
        const processStyles = (stylesObject, id) => { // <-- ADD "id" as an argument here
            let resultCss = '';
            for (const state in stylesObject) { // states: 'base', 'hover'
                const pseudoClass = state === 'hover' ? ':hover' : '';
                for (const breakpoint in stylesObject[state]) { // breakpoints: 'desktop', 'tablet', 'mobile'
                    const styles = stylesObject[state][breakpoint];
                    // The selector now correctly uses the 'id' passed into the function
                    const selector = `[data-element-id="${id}"]${pseudoClass}`;
                    const styleString = Object.entries(styles).map(([p, v]) => `${this.camelToKebab(p)}: ${v};`).join(' ');

                    if (!styleString) continue;

                    let finalCss = `${selector} { ${styleString} }\n`;
                    if(breakpoint === 'tablet'){
                        resultCss += `@media (max-width: 1023px) { ${finalCss} } \n`;
                    } else if (breakpoint === 'mobile'){
                        resultCss += `@media (max-width: 767px) { ${finalCss} } \n`;
                    } else {
                        resultCss += finalCss;
                    }
                }
            }
            return resultCss;
        };

        elements.forEach(element => {
            const id = element.dataset.elementId;
            let styles = {};
            try {
                styles = JSON.parse(element.dataset.styles || '{}');
            } catch(e) { return; }

            css += processStyles(styles, id); // <-- PASS the "id" to the function
        });
        
        return css;
    }

    camelToKebab(str) {
        return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    }

    showCodeEditor() {
        if (!this.codeEditor) return;
        
        const modal = document.getElementById('code-modal');
        modal.classList.remove('hidden');
        
        this.switchCodeTab(this.currentCodeTab);
    }

    hideCodeEditor() {
        document.getElementById('code-modal').classList.add('hidden');
    }

    switchCodeTab(tab) {
        this.currentCodeTab = tab;
        
        document.querySelectorAll('.code-tab-btn').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-300', 'text-gray-700');
        });
        document.querySelector(`[data-code-tab="${tab}"]`).classList.add('bg-blue-500', 'text-white');
        
        let content = '';
        let language = 'html';
        
        switch(tab) {
            case 'html':
                content = this.getCleanHTML(document.getElementById('canvas'));
                language = 'html';
                break;
            case 'css':
                content = this.extractStyles();
                language = 'css';
                break;
            case 'js':
                content = '// Add your JavaScript code here\n';
                language = 'javascript';
                break;
        }
        
        if (this.codeEditor) {
            monaco.editor.setModelLanguage(this.codeEditor.getModel(), language);
            this.codeEditor.setValue(content);
        }
    }

    save() {
        const projectData = {
            canvas: document.getElementById('canvas').innerHTML,
            assets: this.assets,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('webbuilder_project', JSON.stringify(projectData));
        
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = 'Project saved successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('webbuilder_project');
        if (saved) {
            try {
                const projectData = JSON.parse(saved);
                document.getElementById('canvas').innerHTML = projectData.canvas;
                this.assets = projectData.assets || [];
                this.updateAssetsGrid();
                this.updateLayersTree();
                
                // Reattach event listeners to loaded elements
                this.reattachEventListeners();
            } catch (e) {
                console.error('Failed to load project:', e);
            }
        }
    }

    // REPLACE the entire old method with this one
    reattachEventListeners() {
        document.querySelectorAll('.canvas-element').forEach(element => {
            // Bind all interactive events (select, drag)
            this.bindInteractiveEvents(element);
            
            // Re-apply styles for hover effects and responsiveness
            this.applyAllStyles(element);
        });
    }

    reattachEventListenersToElement(element) {
        // This needs to be applied to the parent and all its descendant canvas elements
        const elements = [element, ...element.querySelectorAll('.canvas-element')];

        elements.forEach(el => {
            // Remove old listeners to prevent duplication if ever run twice
            // Note: This is harder without named functions. We'll rely on the fresh clone for now.

            // 1. Add interactive events (selection, drag)
            this.bindInteractiveEvents(el);
            
            // 2. Re-apply any special component logic or hover effects
            this.applyAllStyles(el);

            // 3. Re-add delete buttons or other UI overlays if they got lost
            if (!el.querySelector('.element-controls')) {
                const controls = document.createElement('div');
                controls.className = 'element-controls';
                controls.innerHTML = `<i class="fas fa-trash cursor-pointer"></i>`;
                controls.querySelector('.fa-trash').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteElement(el);
                });
                el.appendChild(controls);
            } else {
                el.querySelector('.fa-trash')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteElement(el);
                });
            }
        });
    }

    export() {
        const html = this.generatePreviewHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    saveToHistory() {
        const state = {
            canvas: document.getElementById('canvas').innerHTML,
            timestamp: Date.now()
        };
        
        // Remove any future history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(state);
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const state = this.history[this.historyIndex];
            document.getElementById('canvas').innerHTML = state.canvas;
            this.reattachEventListeners();
            this.updateLayersTree();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const state = this.history[this.historyIndex];
            document.getElementById('canvas').innerHTML = state.canvas;
            this.reattachEventListeners();
            this.updateLayersTree();
        }
    }

    renderStyleManager() {
        const list = document.getElementById('class-manager-list');
        let html = '';
        for (const className in this.globalStyles) {
            // Simple display for now; could be expanded to show rules
            html += `<div class="p-2 border rounded text-sm cursor-pointer hover:bg-gray-100">${className}</div>`;
        }
        list.innerHTML = html;
    }

    addNewGlobalClass(className) {
        if (!className || this.globalStyles[className]) return;
        this.globalStyles[className] = {}; // Initialize empty style object
        this.renderStyleManager();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new WebBuilderPro();
    window.app = app;
});