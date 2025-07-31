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
        this.resizerInitialPos = {};
        this.elementInitialSize = {};
        this.googleFonts = [
            "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Source Sans Pro", "Raleway"
        ];
        this.globalStyles = {};
        this.currentState = 'base';
        this.dropTarget = null;   // ADD THIS
        this.dropPosition = null; // ADD THIS
        this.init();
    }

    getInnermostTextElement(element) {
        if (!element) return null;
        return element.querySelector('p, h1, h2, h3, h4, h5, h6, button, a, span');
    }

    // --- REPLACE the old bindInteractiveEvents method with this one ---
    // --- REPLACE the entire bindInteractiveEvents method ---
    bindInteractiveEvents(el) {
        // --- DRAG TO RE-ORDER ---
        el.draggable = true; // Make every canvas element draggable
        el.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            e.dataTransfer.effectAllowed = 'move';
            this.draggedElement = {
                type: 'element-reorder',
                element: el // Keep track of the actual element being moved
            };
            // Optional: add a visual effect
            setTimeout(() => el.classList.add('opacity-50'), 0);
        });

        // Clear visual effect on drag end
        el.addEventListener('dragend', (e) => {
            e.stopPropagation();
            // This is just a cleanup for all elements
            document.querySelectorAll('.opacity-50').forEach(elem => elem.classList.remove('opacity-50'));
        });
        
        // --- CLICK TO SELECT ---
        el.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.target.classList.contains('resizer')) return;
            e.stopPropagation();
            this.selectElement(el);
        });
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

        // --- Inside setupResizing(), REPLACE the onResizeMouseMove constant ---
        const onResizeMouseMove = (e) => {
            if (!this.isResizing || !this.selectedElement) return;

            const style = this.selectedElement.style;
            
            // ** THE CRITICAL FIX IS HERE **
            // Only modify position (top, left) if the element is NOT static.
            const isAbsolute = style.position === 'absolute';

            if (currentResizer.classList.contains('bottom-right')) {
                style.width = e.clientX - initialRect.left + 'px';
                style.height = e.clientY - initialRect.top + 'px';
            } else if (currentResizer.classList.contains('bottom-left')) {
                style.width = initialRect.right - e.clientX + 'px';
                style.height = e.clientY - initialRect.top + 'px';
                if (isAbsolute) style.left = e.clientX + 'px';
            } else if (currentResizer.classList.contains('top-right')) {
                style.width = e.clientX - initialRect.left + 'px';
                style.height = initialRect.bottom - e.clientY + 'px';
                if (isAbsolute) style.top = e.clientY + 'px';
            } else if (currentResizer.classList.contains('top-left')) {
                style.width = initialRect.right - e.clientX + 'px';
                style.height = initialRect.bottom - e.clientY + 'px';
                if (isAbsolute) {
                    style.top = e.clientY + 'px';
                    style.left = e.clientX + 'px';
                }
            }
            // ... (you can add the other resizers like 'top-center' if needed)
            
            this.updateSelectionBox();
        };

        const onResizeMouseUp = () => {
            this.isResizing = false;
            document.removeEventListener('mousemove', onResizeMouseMove);
            document.removeEventListener('mouseup', onResizeMouseUp);
            this.saveToHistory();
        };

        // --- At the end of the setupResizing method ---
        resizers.forEach(resizer => {
            // This line makes sure the resizers are always clickable, overriding our CSS rule.
            resizer.style.pointerEvents = 'all';
            resizer.addEventListener('mousedown', onResizeMouseDown);
        });
    }

    // --- REPLACE the entire old updateSelectionBox method with this ---
    updateSelectionBox() {
        const selectionBox = document.getElementById('selection-box');
        if (!this.selectedElement || this.selectedElement.id === 'canvas-container') {
            selectionBox.classList.remove('active');
            return;
        }

        const rect = this.selectedElement.getBoundingClientRect();
        const scrollArea = document.getElementById('scroll-area');
        const scrollAreaRect = scrollArea.getBoundingClientRect();

        // Calculate position relative to the scrollable canvas area
        selectionBox.style.left = (rect.left - scrollAreaRect.left + scrollArea.scrollLeft) + 'px';
        selectionBox.style.top = (rect.top - scrollAreaRect.top + scrollArea.scrollTop) + 'px';
        selectionBox.style.width = rect.width + 'px';
        selectionBox.style.height = rect.height + 'px';

        // Always ensure it's active when an element is selected
        selectionBox.classList.add('active');
    }

    updateChildElementStyle(selector, property, value) {
        if (!this.selectedElement) return;
        const child = this.selectedElement.querySelector(selector);
        if (child) {
            child.style[property] = value;
            this.saveToHistory();
        }
    }

    updateElementClasses(classString) {
        if (!this.selectedElement) return;
        // Keep our essential classes, but replace all user-defined ones
        this.selectedElement.className = 'canvas-element selected ' + classString.trim();
        this.saveToHistory();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = message;
        document.body.appendChild(notification);
        return notification;
    }

    hasBreakpointSpecificStyle(property) {
        if (!this.selectedElement || this.currentBreakpoint === 'desktop') return false;
        let styles = {};
        try {
            styles = JSON.parse(this.selectedElement.dataset.styles || '{}');
        } catch(e) { return false; }
        
        return !!styles[this.currentBreakpoint]?.[property];
    }

    loadGoogleFont(fontName) {
        const fontId = `font-${fontName.replace(/\s+/g, '-')}`;
        if (document.getElementById(fontId)) return; // Don't load the same font twice

        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
        document.head.appendChild(link);
    }

    updateBreadcrumbs() {
        const breadcrumbsContainer = document.getElementById('breadcrumbs');
        if (!this.selectedElement) {
            breadcrumbsContainer.innerHTML = '';
            return;
        }

        let crumbsHTML = '';
        let current = this.selectedElement;
        while (current && current.id !== 'canvas') {
            if (current.classList.contains('canvas-element')) {
                const componentType = current.dataset.componentType || 'element';
                const elementId = current.dataset.elementId;
                crumbsHTML = `
                    <span class="hover:text-blue-500 cursor-pointer" onclick="app.selectElementById('${elementId}')">${componentType}</span>
                    <i class="fas fa-chevron-right text-xs"></i>
                    ${crumbsHTML}
                `;
            }
            current = current.parentElement;
        }
        breadcrumbsContainer.innerHTML = `<span class="hover:text-blue-500 cursor-pointer" onclick="app.handleCanvasClick({target: document.getElementById('canvas')})">body</span> <i class="fas fa-chevron-right text-xs"></i> ${crumbsHTML}`;
        // Remove the last chevron
        breadcrumbsContainer.querySelector('i:last-of-type')?.remove();
    }

    getCurrentStyle(property) {
        if (!this.selectedElement) return '';

        let styles = {};
        try {
            styles = JSON.parse(this.selectedElement.dataset.styles || '{}');
        } catch (e) {
            return this.selectedElement.style[property] || '';
        }

        // Correctly get style from the current state and breakpoint
        return styles[this.currentState]?.[this.currentBreakpoint]?.[property] 
            || styles['base']?.[this.currentBreakpoint]?.[property] // Fallback to base style for this breakpoint
            || styles['base']?.['desktop']?.[property] // Ultimate fallback to desktop base
            || '';
    }


    
    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.loadComponents();
        this.setupMonacoEditor();
        this.setupResizing();
        this.loadFromLocalStorage();
    }
    
    setupEventListeners() {
        this.clipboard = null;
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        document.getElementById('canvas').addEventListener('click', (e) => {
            if (!e.target.closest('.canvas-element')) {
                this.handleCanvasClick(e);
            }
        });

        document.getElementById('page-settings-btn').addEventListener('click', () => {
            const canvasBody = document.getElementById('canvas-container');
            canvasBody.dataset.componentType = 'Page Body';
            if (!canvasBody.dataset.elementId) {
                canvasBody.dataset.elementId = this.generateId();
            }
            this.selectElement(canvasBody);
        });

        // Breakpoint switching
        document.querySelectorAll('.breakpoint-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchBreakpoint(e.target.dataset.breakpoint);
            });
        });

        // Buttons
        document.getElementById('save-btn').addEventListener('click', () => this.save());
        document.getElementById('export-btn').addEventListener('click', () => this.export());
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('preview-btn').addEventListener('click', () => this.showPreview());
        document.getElementById('code-btn').addEventListener('click', () => this.showCodeEditor());
        document.getElementById('close-preview').addEventListener('click', () => this.hidePreview());
        document.getElementById('close-code').addEventListener('click', () => this.hideCodeEditor());

        // Code tabs
        document.querySelectorAll('.code-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCodeTab(e.target.dataset.codeTab);
            });
        });

        // Zoom
        const zoomSlider = document.getElementById('zoom-slider');
        zoomSlider.addEventListener('input', (e) => {
            const zoom = e.target.value;
            this.setZoom(zoom);
        });

        // Asset upload
        document.getElementById('upload-asset').addEventListener('change', (e) => {
            this.handleAssetUpload(e);
        });

        // Canvas click
        document.getElementById('canvas').addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });

        document.getElementById('canvas').addEventListener('dblclick', (e) => {
            const target = e.target.closest('.canvas-element');
            if (!target) return;

            const textElement = target.querySelector('p, h1, h2, h3, h4, h5, h6, a, span:not([class])');
            if (textElement && !target.quill) {
                e.stopPropagation();
                this.selectElement(target);

                // Hide the original element and create a temporary editor div
                textElement.style.display = 'none';
                const editorDiv = document.createElement('div');
                editorDiv.innerHTML = textElement.innerHTML;
                textElement.after(editorDiv);

                const quill = new Quill(editorDiv, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['link'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }]
                        ]
                    }
                });
                target.quill = quill; // Store instance to prevent re-initialization

                quill.focus();

                quill.on('text-change', () => {
                    // Live update the original element
                    textElement.innerHTML = quill.root.innerHTML;
                });

                // When the editor loses focus, clean up
                quill.root.addEventListener('blur', () => {
                    textElement.innerHTML = quill.root.innerHTML;
                    textElement.style.display = '';
                    editorDiv.remove();
                    delete target.quill;
                    this.saveToHistory();
                }, { once: true });
            }
        });

        // --- CONTEXT MENU LOGIC ---
        document.getElementById('canvas').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const targetElement = e.target.closest('.canvas-element');
            if (!targetElement) return;

            this.selectElement(targetElement);

            const menu = document.getElementById('context-menu');
            menu.classList.remove('hidden');
            menu.style.top = `${e.clientY}px`;
            menu.style.left = `${e.clientX}px`;

            document.getElementById('context-duplicate').onclick = () => {
                const clone = this.selectedElement.cloneNode(true);
                clone.dataset.elementId = this.generateId();
                this.reattachEventListenersToElement(clone);
                this.selectedElement.after(clone);
                this.saveToHistory();
            };
            document.getElementById('context-copy').onclick = () => {
                if(this.selectedElement) {
                    this.clipboard = {
                        html: this.selectedElement.innerHTML,
                        styles: this.selectedElement.dataset.styles,
                        componentType: this.selectedElement.dataset.componentType
                    };
                    // Optional: give user feedback
                    const notification = this.showNotification('Copied to clipboard!');
                    setTimeout(() => notification.remove(), 2000);
                }
            };
            document.getElementById('context-paste').onclick = () => {
                if(this.clipboard && this.selectedElement) {
                    const newElement = document.createElement('div');
                    newElement.className = 'canvas-element';
                    newElement.innerHTML = this.clipboard.html;
                    newElement.dataset.styles = this.clipboard.styles;
                    newElement.dataset.componentType = this.clipboard.componentType;
                    newElement.dataset.elementId = this.generateId();
                    
                    this.reattachEventListenersToElement(newElement);
                    this.selectedElement.after(newElement);
                    this.saveToHistory();
                }
            };
            document.getElementById('context-delete').onclick = () => this.deleteElement(this.selectedElement);
            // Copy/Paste actions can be added here later
        });

        window.addEventListener('click', () => {
            document.getElementById('context-menu').classList.add('hidden');
        }, true);
        // --- END CONTEXT MENU LOGIC ---

        // Keyboard shortcuts
        // --- INSIDE THE setupEventListeners METHOD ---

        document.addEventListener('keydown', (e) => {
            // --- REMOVE the old 'keydown' event listener logic ---
            // --- ADD the following new logic ---

            // Don't trigger shortcuts if user is typing in an input/textarea
            if (e.target.matches('input, textarea, [contenteditable="true"]')) {
                return;
            }

            // 1. Handle element movement with arrow keys
            if (this.selectedElement && !this.isResizing) {
                const moveKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
                if (moveKeys.includes(e.key)) {
                    e.preventDefault(); // Prevent browser from scrolling
                    const moveAmount = e.shiftKey ? 10 : 1; // Move by 10px if Shift is held

                    // Ensure the element's position is not static
                    if (this.selectedElement.style.position === 'absolute') {
                        switch(e.key) {
                            case 'ArrowUp':
                                this.selectedElement.style.top = (parseInt(this.selectedElement.style.top, 10) || 0) - moveAmount + 'px';
                                break;
                            case 'ArrowDown':
                                this.selectedElement.style.top = (parseInt(this.selectedElement.style.top, 10) || 0) + moveAmount + 'px';
                                break;
                            case 'ArrowLeft':
                                this.selectedElement.style.left = (parseInt(this.selectedElement.style.left, 10) || 0) - moveAmount + 'px';
                                break;
                            case 'ArrowRight':
                                this.selectedElement.style.left = (parseInt(this.selectedElement.style.left, 10) || 0) + moveAmount + 'px';
                                break;
                        }
                        this.updateSelectionBox(); // Instantly update the selection box
                        // Defer history save until mouse up or key up to group movements
                        // For now, saving on each move is okay for simplicity
                        this.saveToHistory();
                    }
                }
            }

            // 2. Handle Ctrl/Meta key combinations
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'z':
                        e.preventDefault();
                        e.shiftKey ? this.redo() : this.undo();
                        break;
                    case 's':
                        e.preventDefault();
                        this.save();
                        break;
                    case 'd':
                        e.preventDefault();
                        if (this.selectedElement) {
                            const clone = this.selectedElement.cloneNode(true);
                            clone.dataset.elementId = this.generateId();

                            // Reset position slightly to see the new element
                            if(clone.style.position === 'absolute'){
                            clone.style.top = (parseInt(clone.style.top, 10) || 0) + 10 + 'px';
                            clone.style.left = (parseInt(clone.style.left, 10) || 0) + 10 + 'px';
                            }
                            
                            // We must re-bind all events to the new clone and its children
                            this.reattachEventListenersToElement(clone);

                            this.selectedElement.after(clone);
                            this.selectElement(clone); // Select the new duplicated element
                            this.saveToHistory();
                        }
                        break;
                    case 'c':
                        if (this.selectedElement) {
                            e.preventDefault();
                            this.clipboard = {
                                html: this.selectedElement.innerHTML,
                                styles: this.selectedElement.dataset.styles,
                                componentType: this.selectedElement.dataset.componentType,
                                fullHTML: this.selectedElement.outerHTML,
                            };
                            const notification = this.showNotification('Copied to clipboard!');
                            setTimeout(() => notification.remove(), 2000);
                        }
                        break;
                    case 'v':
                        if(this.clipboard && this.selectedElement?.parentElement) {
                            e.preventDefault();
                            const newElement = document.createElement('div');
                            newElement.outerHTML = this.clipboard.fullHTML;
                            const pastedElement = newElement; // We actually need the element itself
                            pastedElement.dataset.elementId = this.generateId();
                            
                            this.reattachEventListenersToElement(pastedElement);
                            this.selectedElement.parentElement.appendChild(pastedElement);
                            this.selectElement(pastedElement);
                            this.saveToHistory();
                        }
                        break;

                }
            }
            
            // 3. Handle Delete key
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (this.selectedElement) {
                    e.preventDefault();
                    this.deleteElement(this.selectedElement);
                }
            }
        });

        // --- End of new keydown listener logic ---

        document.getElementById('add-class-btn').addEventListener('click', () => {
            const classNameInput = document.getElementById('new-class-name');
            const className = classNameInput.value.trim();
            if (className) {
                this.addNewGlobalClass(className);
                classNameInput.value = '';
            }
        });
    }

    setupDragAndDrop() {
        document.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = {
                    type: 'component',
                    componentType: e.target.dataset.component
                };
                e.dataTransfer.effectAllowed = 'copy';
            });
        });

        const canvas = document.getElementById('canvas');
        const dropIndicator = document.getElementById('drop-indicator');


        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            
            const dropIndicator = document.getElementById('drop-indicator');
            const target = e.target;
            
            // Find the closest valid drop target
            const dropZone = target.closest('.drop-zone');
            const closestElement = target.closest('.canvas-element');
            
            // Clear previous hover states
            document.querySelectorAll('.drop-zone.drag-over').forEach(el => el.classList.remove('drag-over'));
            
            this.dropTarget = null;
            this.dropPosition = null;
            
            if (dropZone) {
                // Scenario 1: Dropping inside an empty drop zone
                if (dropZone.children.length === 0) {
                    dropZone.classList.add('drag-over');
                    dropIndicator.classList.add('hidden');
                    this.dropTarget = dropZone;
                    this.dropPosition = 'inside';
                }
                // Scenario 2: Dropping relative to an existing element
                else if (closestElement) {
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
            } else {
                // If we are not over any specific zone, hide the indicator
                dropIndicator.classList.add('hidden');
            }
        });

        canvas.addEventListener('dragleave', () => {
            canvas.classList.remove('drag-over');
            dropIndicator.classList.add('hidden');
        });

        // --- In setupDragAndDrop(), REPLACE the canvas.addEventListener('drop', ...) ---
        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            document.getElementById('drop-indicator').classList.add('hidden');

            if (!this.draggedElement || !this.dropTarget) return;

            // SCENARIO 1: Dropping a NEW component from the left panel
            if (this.draggedElement.type === 'component') {
                this.addComponent(this.draggedElement.componentType, e);
            }
            // SCENARIO 2: RE-ORDERING an EXISTING element
            else if (this.draggedElement.type === 'element-reorder') {
                const elToMove = this.draggedElement.element;
                if (this.dropPosition === 'inside') this.dropTarget.appendChild(elToMove);
                else if (this.dropPosition === 'before') this.dropTarget.parentNode.insertBefore(elToMove, this.dropTarget);
                else if (this.dropPosition === 'after') this.dropTarget.after(elToMove);
                this.saveToHistory();
            }

            // Cleanup
            this.draggedElement = null;
            this.dropTarget = null;
            this.dropPosition = null;
        });
    }

    loadComponents() {
        
        
        this.components.set('text', {
            name: 'Text',
            html: '<p>Sample text content</p>',
            defaultStyles: {
                fontSize: '16px',
                color: '#333333',
                fontFamily: 'Arial, sans-serif'
            }
        });

        this.components.set('two-columns', {
            name: 'Two Columns',
            // Note: the HTML is now two distinct child components.
            html: `
                <div class="canvas-element" data-component-type="column" style="flex: 1; min-height: 50px;">
                    <div class="drop-zone p-2"></div>
                </div>
                <div class="canvas-element" data-component-type="column" style="flex: 1; min-height: 50px;">
                    <div class="drop-zone p-2"></div>
                </div>`,
            defaultStyles: {
                display: 'flex',
                gap: '16px',
                width: '100%',
                padding: '10px'
            },
        });

        this.components.set('hero-section', {
            name: 'Hero Section',
            // We've simplified the HTML to be cleaner.
            html: `
                <h1 class="text-4xl font-bold">Hero Title</h1>
                <p class="mt-2">This is a paragraph describing your hero section.</p>
                <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Call to Action</button>
            `,
            defaultStyles: {
                padding: '60px 20px',
                textAlign: 'center',
                backgroundColor: '#f3f4f6',
                width: '100%'
            },
        });

        this.components.set('heading', {
            name: 'Heading',
            html: '<h2>Sample Heading</h2>',
            defaultStyles: {
                fontSize: '32px',
                color: '#333333',
                fontWeight: 'bold',
                margin: '20px 0'
            }
        });

        this.components.set('button', {
            name: 'Button',
            html: '<button>Click Me</button>',
            defaultStyles: {
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
            }
        });

        this.components.set('image', {
            name: 'Image',
            html: '<img src="https://via.placeholder.com/300x200" alt="Placeholder">',
            defaultStyles: {
                maxWidth: '100%',
                height: 'auto'
            }
        });

        this.components.set('container', {
            name: 'Container',
            html: '<div class="drop-zone p-4">Add elements inside</div>', // It is its OWN drop-zone.
            defaultStyles: {
                padding: '20px',
                backgroundColor: 'rgba(240, 240, 240, 0.5)',
                width: '100%',
                minHeight: '100px',
            }
        });

        this.components.set('row', {
            name: 'Row',
            html: '<div class="drop-zone p-4">Drop columns or elements here</div>', // A single drop-zone.
            defaultStyles: {
                display: 'flex', // THE PARENT .canvas-element IS NOW THE FLEX CONTAINER
                gap: '16px',
                padding: '10px',
                width: '100%',
                minHeight: '80px',
            }
});

        this.components.set('navbar', {
            name: 'Navigation Bar',
            html: '<nav><div class="nav-brand">Brand</div><ul class="nav-menu"><li><a href="#">Home</a></li><li><a href="#">About</a></li><li><a href="#">Contact</a></li></ul></nav>',
            defaultStyles: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
        });

        this.components.set('card', {
            name: 'Card',
            html: '<div class="card"><div class="card-header">Card Title</div><div class="card-body">Card content goes here</div></div>',
            defaultStyles: {
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
        });

        this.components.set('form', {
            name: 'Form',
            html: '<form><div class="form-group"><label>Name:</label><input type="text" placeholder="Enter your name"></div><div class="form-group"><label>Email:</label><input type="email" placeholder="Enter your email"></div><button type="submit">Submit</button></form>',
            defaultStyles: {
                padding: '20px',
                border: '1px solid #e9ecef',
                borderRadius: '8px'
            }
        });

        this.components.set('video', {
            name: 'Video',
            html: '<video controls><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">Your browser does not support the video tag.</video>',
            defaultStyles: {
                width: '100%',
                maxWidth: '600px'
            }
        });
    }

    setupMonacoEditor() {
        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            this.codeEditor = monaco.editor.create(document.getElementById('code-editor'), {
                value: '',
                language: 'html',
                theme: 'vs-dark',
                automaticLayout: true
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
            btn.classList.add('text-gray-600');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active', 'bg-blue-500', 'text-white');

        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');

        if (tabName === 'layers') {
            this.updateLayersTree();
        }
    }

    switchBreakpoint(breakpoint) {
        document.querySelectorAll('.breakpoint-button').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
        });
        document.querySelector(`[data-breakpoint="${breakpoint}"]`).classList.add('active', 'bg-blue-500', 'text-white');
        
        this.currentBreakpoint = breakpoint;
        this.updateCanvasSize();
    }

    updateCanvasSize() {
        const container = document.getElementById('canvas-container');
        const sizes = {
            desktop: '1024px',
            tablet: '768px',
            mobile: '375px'
        };
        container.style.width = sizes[this.currentBreakpoint];
    }

    setZoom(zoom) {
        const container = document.getElementById('canvas-container');
        container.style.transform = `scale(${zoom / 100})`;
        container.style.transformOrigin = 'top left';
        document.getElementById('zoom-display').textContent = `${zoom}%`;
    }

    addComponent(componentType, event) {
        const component = this.components.get(componentType);
        if (!component || !this.dropTarget) return;

        const element = document.createElement('div');
        element.className = 'canvas-element';
        element.dataset.componentType = componentType;
        element.dataset.elementId = this.generateId();
        
        // This is key: assign styles directly to the main element
        if (component.defaultStyles) {
            Object.assign(element.style, component.defaultStyles);
        }
        
        // Use a temporary container to process the HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = component.html;
        
        // Move children from temp to the actual element
        while (tempContainer.firstChild) {
            element.appendChild(tempContainer.firstChild);
        }
        
        // Place the new element in the DOM
        if (this.dropPosition === 'inside') this.dropTarget.appendChild(element);
        else if (this.dropPosition === 'before') this.dropTarget.parentNode.insertBefore(element, this.dropTarget);
        else if (this.dropPosition === 'after') this.dropTarget.after(element);
        
        // **** IMPORTANT NEW STEP ****
        // After inserting the element, we must find ALL canvas elements
        // within it (for nested components like 'two-columns') and attach listeners.
        this.reattachEventListenersToElement(element);
        
        this.selectElement(element);
        this.saveToHistory();
        this.updateLayersTree();
        
        this.dropTarget = null;
        this.dropPosition = null;
    }

    selectElement(element) {
        if (this.isResizing) return;
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
            // HIDE the resizers if the element is not explicitly positioned
            if (getComputedStyle(element).position === 'static' && !element.style.width) {
                selectionBox.querySelectorAll('.resizer').forEach(r => r.style.display = 'none');
            } else {
                selectionBox.querySelectorAll('.resizer').forEach(r => r.style.display = 'block');
            }
    }    
        handleCanvasClick(e) {
            // This function is now the single source of truth for deselection.
            // It's called when clicking on the canvas directly.
            const clickedElement = e.target.closest('.canvas-element');

            if (!clickedElement && this.selectedElement) {
                this.selectedElement.classList.remove('selected');
                this.selectedElement = null;

                // Hide the properties panel and selection box
                document.getElementById('properties-panel').innerHTML = `<div class="p-4 text-center text-gray-500"><i class="fas fa-mouse-pointer text-3xl mb-2 block"></i><p>Select an element to edit its properties</p></div>`;
                this.updateSelectionBox(); // Hides the box
                this.updateBreadcrumbs();

                // Clear active layer in the layers panel
                document.querySelectorAll('.layer-item.active-layer').forEach(item => item.classList.remove('active-layer'));
            }
        }
          
    // --- REPLACE THE ENTIRE showProperties METHOD WITH THIS NEW, SMARTER VERSION ---
    showProperties(element) {
        const panel = document.getElementById('properties-panel');
        const componentType = element.dataset.componentType || 'element';

        let flexChildProperties = '';
        // ** THE NEW CORE LOGIC **
        // Check if the selected element is a direct child of a flex container.
        const parent = element.parentElement;
        if (parent && parent.classList.contains('canvas-element') && getComputedStyle(parent).display === 'flex') {
            flexChildProperties = `
                <div class="sidebar-section pb-4 mb-4">
                    <h4 class="font-medium mb-2">Flex Child</h4>
                    <div class="grid grid-cols-2 gap-2 mb-2">
                        <div>
                            <label class="text-xs text-gray-600">Grow</label>
                            <input type="number" class="property-input" placeholder="0" value="${this.getCurrentStyle('flexGrow') || '0'}" oninput="app.updateElementStyle('flexGrow', this.value)">
                        </div>
                        <div>
                            <label class="text-xs text-gray-600">Shrink</label>
                            <input type="number" class="property-input" placeholder="1" value="${this.getCurrentStyle('flexShrink') || '1'}" oninput="app.updateElementStyle('flexShrink', this.value)">
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="text-xs text-gray-600">Basis</label>
                        <input type="text" class="property-input" placeholder="auto" value="${this.getCurrentStyle('flexBasis') || 'auto'}" oninput="app.updateElementStyle('flexBasis', this.value)">
                    </div>
                    <div class="mb-2">
                        <label class="text-xs text-gray-600">Align Self</label>
                        <select class="property-input" oninput="app.updateElementStyle('alignSelf', this.value)">
                            <option value="auto" ${!this.getCurrentStyle('alignSelf') || this.getCurrentStyle('alignSelf') === 'auto' ? 'selected' : ''}>Auto</option>
                            <option value="flex-start" ${this.getCurrentStyle('alignSelf') === 'flex-start' ? 'selected' : ''}>Start</option>
                            <option value="flex-end" ${this.getCurrentStyle('alignSelf') === 'flex-end' ? 'selected' : ''}>End</option>
                            <option value="center" ${this.getCurrentStyle('alignSelf') === 'center' ? 'selected' : ''}>Center</option>
                            <option value="stretch" ${this.getCurrentStyle('alignSelf') === 'stretch' ? 'selected' : ''}>Stretch</option>
                        </select>
                    </div>
                </div>
            `;
        }

        let propertiesHTML = `
            <div class="p-4">
                <!-- The STATE and CSS CLASS panels remain here... -->
                <div class="mb-4">
                    <label class="text-sm font-medium">State</label>
                    <select id="state-selector" class="property-input mt-1" onchange="this.value === 'base' ? app.currentState='base' : app.currentState='hover'; app.showProperties(app.selectedElement);">
                        <option value="base" ${this.currentState === 'base' ? 'selected' : ''}>Base</option>
                        <option value="hover" ${this.currentState === 'hover' ? 'selected' : ''}>Hover</option>
                    </select>
                </div>
                <div class="sidebar-section pb-4 mb-4">
                    <h4 class="font-medium mb-2">CSS Classes</h4>
                    <input type="text" id="class-input" class="property-input" placeholder="e.g. btn btn-primary"
                        value="${(this.selectedElement.className || '').replace(/canvas-element|selected/g, '').trim()}"
                        onchange="app.updateElementClasses(this.value)">
                </div>
                <h3 class="font-semibold mb-4">${componentType.charAt(0).toUpperCase() + componentType.slice(1)} Properties</h3>

                ${flexChildProperties} <!-- ** INJECT THE NEW FLEX PANEL HERE ** -->

                <!-- All other property panels (Layout, Typography, etc.) go here -->
                ${this.generateLayoutPropertiesHTML()}
                ${this.generateTypographyPropertiesHTML()}
                ${this.generateBackgroundPropertiesHTML()}
                <!-- etc... -->
            </div>
        `;
        
        panel.innerHTML = propertiesHTML;
    }

    // NOTE: This is a refactor. The code from showProperties is moved here to be cleaner.
    // ADD THIS NEW METHOD to your class
    generateLayoutPropertiesHTML() {
        if (!this.selectedElement) return '';

        // Only show Flexbox PARENT controls if the selected item IS a flex container
        const flexParentControls = getComputedStyle(this.selectedElement).display === 'flex' ? `
            <h4 class="font-medium mb-2 mt-4 border-t pt-4">Flex Container</h4>
            <div class="grid grid-cols-2 gap-2 mb-2">
                <div>
                    <label class="text-xs text-gray-600">Direction</label>
                    <select class="property-input" oninput="app.updateElementStyle('flexDirection', this.value)">
                        <option value="row" ${this.getCurrentStyle('flexDirection') === 'row' ? 'selected' : ''}>Row</option>
                        <option value="column" ${this.getCurrentStyle('flexDirection') === 'column' ? 'selected' : ''}>Column</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-gray-600">Justify Content</label>
                    <select class="property-input" oninput="app.updateElementStyle('justifyContent', this.value)">
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                        <option value="space-between">Space Between</option>
                        <option value="space-around">Space Around</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-gray-600">Align Items</label>
                    <select class="property-input" oninput="app.updateElementStyle('alignItems', this.value)">
                        <option value="stretch">Stretch</option>
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-gray-600">Gap</label>
                    <input type="text" class="property-input" value="${this.getCurrentStyle('gap') || '0px'}" oninput="app.updateElementStyle('gap', this.value)">
                </div>
            </div>` : '';
            
        return `
        <div class="sidebar-section pb-4 mb-4">
            <h4 class="font-medium mb-2">Layout</h4>
            <!-- Other layout controls like display, width, height, etc. -->
            <div class="grid grid-cols-2 gap-2 mb-2">
                <div>
                    <label class="text-xs">Display</label>
                    <select class="property-input" oninput="app.updateElementStyle('display', this.value)">
                        <option value="block">Block</option>
                        <option value="flex">Flex</option>
                        <option value="inline-block">Inline-Block</option>
                        <option value="none">None</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs">Position</label>
                    <select class="property-input" oninput="app.updateElementStyle('position', this.value)">
                        <option value="static">Static</option>
                        <option value="relative">Relative</option>
                        <option value="absolute">Absolute</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mb-2">
                <div><label class="text-xs">Width</label><input type="text" class="property-input" value="${this.getCurrentStyle('width') || 'auto'}" oninput="app.updateElementStyle('width', this.value)"></div>
                <div><label class="text-xs">Height</label><input type="text" class="property-input" value="${this.getCurrentStyle('height') || 'auto'}" oninput="app.updateElementStyle('height', this.value)"></div>
            </div>
            <!-- other props like margin, padding -->
            
            ${flexParentControls}
        </div>`;
    }

    // You can similarly refactor Typography and Background into their own generator methods
    // For brevity, I'll omit them here but you should do it for cleaner code.
    // e.g., generateTypographyPropertiesHTML() and generateBackgroundPropertiesHTML()

    // --- REPLACE the existing updateElementStyle method ---
    updateElementStyle(property, value) {
        if (!this.selectedElement) return;

        let styles = {};
        try {
            styles = JSON.parse(this.selectedElement.dataset.styles || '{}');
        } catch (e) {
            styles = { base: {}, hover: {} };
        }

        // Ensure the nested structure for state and breakpoint exists
        if (!styles[this.currentState]) styles[this.currentState] = {};
        if (!styles[this.currentState][this.currentBreakpoint]) styles[this.currentState][this.currentBreakpoint] = {};

        // Save the style value to our data object
        styles[this.currentState][this.currentBreakpoint][property] = value;

        // Save font for loading in final export
        if (property === 'fontFamily' && value) {
            this.loadGoogleFont(value.split(',')[0].replace(/'/g, '').trim());
        }

        // Write the updated styles back to the element's dataset
        this.selectedElement.dataset.styles = JSON.stringify(styles);
        
        // Re-apply all styles to reflect the change immediately
        this.applyAllStyles(this.selectedElement);
        
        // Update the properties panel to show responsive indicators if needed
        this.showProperties(this.selectedElement);
        
        this.saveToHistory();
    }


    // --- REPLACE the existing applyAllStyles method ---
    applyAllStyles(element) {
        if (!element || !element.dataset) return;

        let allStylesData = {};
        try {
            allStylesData = JSON.parse(element.dataset.styles || '{}');
        } catch (e) { return; }

        const baseStyles = allStylesData.base || {};

        // 1. Reset all inline styles to start from a clean slate
        element.style.cssText = '';
        const innerTextElement = this.getInnermostTextElement(element);
        if (innerTextElement) {
        innerTextElement.style.cssText = '';
        }


        // 2. Build the final style object by cascading breakpoints
        const finalStyle = {
            ...(baseStyles.desktop || {}),
            ...(baseStyles.tablet || {}),
            ...(baseStyles.mobile || {}),
        };
        
        const typographyProps = ['color', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'lineHeight', 'textDecoration', 'fontStyle'];

        // 3. Apply the final calculated styles
        Object.entries(finalStyle).forEach(([prop, val]) => {
            // If it is a typography property and an inner text element exists, apply there
            if (typographyProps.includes(prop) && innerTextElement) {
                innerTextElement.style[prop] = val;
            } else { // Otherwise, apply to the main container element
                element.style[prop] = val;
            }
        });

        // 4. Manage hover effects dynamically for live preview in the editor
        element.onmouseenter = () => {
            const hoverStyles = allStylesData.hover || {};
            if (Object.keys(hoverStyles).length === 0) return;

            const finalHoverStyle = {
                ...(hoverStyles.desktop || {}),
                ...(hoverStyles.tablet || {}),
                ...(hoverStyles.mobile || {}),
            };

            Object.entries(finalHoverStyle).forEach(([prop, val]) => {
                if (typographyProps.includes(prop) && innerTextElement) {
                    innerTextElement.style[prop] = val;
                } else {
                    element.style[prop] = val;
                }
            });
        };

        // On mouse leave, re-apply the base styles
        element.onmouseleave = () => this.applyAllStyles(element);
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