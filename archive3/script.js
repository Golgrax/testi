/**
 * Enhanced WebBuilder Pro - Main Application Script
 * Modern ES6+ implementation with enhanced features
 */

// ===== CONSTANTS AND CONFIGURATION =====
const APP_CONFIG = {
  version: '2.0.0',
  name: 'WebBuilder Pro Enhanced',
  storagePrefix: 'webbuilder-pro-',
  autoSaveInterval: 30000, // 30 seconds
  maxUndoSteps: 50
};

// ===== MAIN APPLICATION CLASS =====
class WebBuilderApp {
  constructor() {
    this.editor = null;
    this.isInitialized = false;
    this.autoSaveTimer = null;
    this.contextMenu = null;
    this.clipboard = null;
    
    // Bind methods to preserve context
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleKeyboardShortcuts = this.handleKeyboardShortcuts.bind(this);
    this.handleAutoSave = this.handleAutoSave.bind(this);
    
    this.init();
  }

  async init() {
    try {
      // Show loading indicator
      this.showLoadingIndicator();
      
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
      }

      // Wait for GrapesJS to be available
      await this.waitForGrapesJS();
      
      // Initialize the editor
      await this.initializeEditor();
      
      // Setup additional features
      this.setupContextMenu();
      this.setupKeyboardShortcuts();
      this.setupAutoSave();
      this.setupEventListeners();
      this.loadCustomBlocks();
      
      // Hide loading indicator
      this.hideLoadingIndicator();
      
      this.isInitialized = true;
      console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} initialized successfully`);
      
      // Emit initialization event
      if (window.WebBuilderUtils?.eventBus) {
        window.WebBuilderUtils.eventBus.emit('app:initialized', this);
      }
      
    } catch (error) {
      console.error('Failed to initialize WebBuilder Pro:', error);
      this.showError('Failed to initialize the application. Please refresh the page.');
    }
  }

  async waitForGrapesJS() {
    return new Promise((resolve, reject) => {
      const checkGrapesJS = () => {
        if (typeof grapesjs !== 'undefined') {
          resolve();
        } else {
          setTimeout(checkGrapesJS, 100);
        }
      };
      
      checkGrapesJS();
      
      // Timeout after 30 seconds
      setTimeout(() => reject(new Error("GrapesJS failed to load")), 30000);
    });
  }

  async initializeEditor() {
    const editorConfig = {
      container: '#gjs',
      fromElement: true,
      height: '100%',
      width: 'auto',
      
      // Storage configuration
      storageManager: {
        type: 'local',
        autosave: false, // We'll handle this manually
        stepsBeforeSave: 1,
        options: {
          local: { key: `${APP_CONFIG.storagePrefix}project` }
        }
      },

      // Plugin configuration
      plugins: [
        'grapesjs-preset-webpage',
        'gjs-blocks-basic',
        'grapesjs-plugin-forms',
        'grapesjs-plugin-export',
        'grapesjs-component-code-editor',
        'grapesjs-component-toolbar'
      ],

      pluginsOpts: {
        'grapesjs-preset-webpage': {
          modalImportTitle: 'Import Template',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: function(editor) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          }
        },
        'gjs-blocks-basic': { 
          flexGrid: true,
          stylePrefix: 'gjs-'
        },
        'grapesjs-component-toolbar': {
          toolbar: [
            { command: 'tlb-move', attributes: { title: 'Move', class: 'fa fa-arrows' } },
            { command: 'tlb-clone', attributes: { title: 'Clone', class: 'fa fa-clone' } },
            { command: 'tlb-delete', attributes: { title: 'Delete', class: 'fa fa-trash' } }
          ]
        }
      },

      // Panel configuration
      panels: {
        defaults: [
          {
            id: 'panel__devices',
            el: '#panel__devices',
            buttons: [
              { 
                id: 'device-desktop', 
                command: 'set-device-desktop', 
                label: '<i class="fas fa-desktop"></i>', 
                active: true,
                attributes: { title: 'Desktop View' }
              },
              { 
                id: 'device-tablet', 
                command: 'set-device-tablet', 
                label: '<i class="fas fa-tablet-alt"></i>',
                attributes: { title: 'Tablet View' }
              },
              { 
                id: 'device-mobile', 
                command: 'set-device-mobile', 
                label: '<i class="fas fa-mobile-alt"></i>',
                attributes: { title: 'Mobile View' }
              }
            ]
          },
          {
            id: 'panel__options',
            el: '#panel__options',
            buttons: [
              { 
                id: 'preview', 
                command: 'core:preview', 
                context: 'core:preview', 
                label: '<i class="fas fa-eye"></i>', 
                attributes: { title: 'Preview' }
              },
              { 
                id: 'fullscreen', 
                command: 'fullscreen-toggle', 
                label: '<i class="fas fa-expand"></i>', 
                attributes: { title: 'Toggle Fullscreen' }
              }
            ]
          },
          {
            id: 'panel__views',
            el: '#panel__views',
            buttons: [
              { 
                id: 'show-borders', 
                command: 'core:component-outline', 
                label: '<i class="fas fa-vector-square"></i>', 
                attributes: { title: 'Show Component Borders' }
              },
              { 
                id: 'open-code', 
                command: 'core:open-code', 
                label: '<i class="fas fa-code"></i>', 
                attributes: { title: 'View Code' }
              },
              { 
                id: 'undo', 
                command: 'core:undo', 
                label: '<i class="fas fa-undo"></i>', 
                attributes: { title: 'Undo (Ctrl+Z)' }
              },
              { 
                id: 'redo', 
                command: 'core:redo', 
                label: '<i class="fas fa-redo"></i>', 
                attributes: { title: 'Redo (Ctrl+Y)' }
              },
              { 
                id: 'open-templates', 
                command: 'open-templates', 
                label: '<i class="far fa-window-maximize"></i>', 
                attributes: { title: 'Templates' }
              },
              { 
                id: 'import-template', 
                command: 'gjs-open-import-webpage', 
                label: '<i class="fas fa-upload"></i>', 
                attributes: { title: 'Import Template' }
              },
              { 
                id: 'save-project', 
                command: 'save-project', 
                label: '<i class="fas fa-save"></i>', 
                attributes: { title: 'Save Project (Ctrl+S)' }
              },
              { 
                id: 'load-project', 
                command: 'load-project', 
                label: '<i class="fas fa-folder-open"></i>', 
                attributes: { title: 'Load Project' }
              },
              { 
                id: 'save-block', 
                command: 'save-custom-block', 
                label: '<i class="fas fa-cube"></i>', 
                attributes: { title: 'Save as Custom Block' }
              },
              { 
                id: 'export', 
                command: 'export-project', 
                label: '<i class="fas fa-file-export"></i>', 
                attributes: { title: 'Export HTML' }
              },
              { 
                id: 'clear-canvas', 
                command: 'clear-canvas', 
                label: '<i class="fas fa-trash"></i>', 
                attributes: { title: 'Clear Canvas' }
              },
              { 
                id: 'shortcuts', 
                command: 'show-shortcuts', 
                label: '<i class="fas fa-keyboard"></i>', 
                attributes: { title: 'Keyboard Shortcuts (Ctrl+/)' }
              }
            ]
          },
          {
            id: 'panel__switcher',
            el: '#panel__switcher',
            buttons: [
              { 
                id: 'show-layers', 
                command: 'show-layers', 
                active: true, 
                label: '<i class="fas fa-layer-group"></i>', 
                attributes: { title: 'Navigator', role: 'tab' }
              },
              { 
                id: 'show-styles', 
                command: 'show-styles', 
                label: '<i class="fas fa-palette"></i>', 
                attributes: { title: 'Styles', role: 'tab' }
              },
              { 
                id: 'show-traits', 
                command: 'show-traits', 
                label: '<i class="fas fa-cog"></i>', 
                attributes: { title: 'Settings', role: 'tab' }
              }
            ]
          }
        ]
      },

      // Manager configurations
      layerManager: { appendTo: '#layers-container' },
      traitManager: { appendTo: '#trait-container' },
      blockManager: { appendTo: '#blocks' },
      selectorManager: { appendTo: '#selector-manager-container' },
      styleManager: { 
        appendTo: '#style-properties-container',
        sectors: [
          {
            name: 'General',
            open: false,
            properties: [
              'display', 'position', 'top', 'right', 'left', 'bottom'
            ]
          },
          {
            name: 'Layout',
            open: false,
            properties: [
              'width', 'height', 'max-width', 'min-height', 'margin', 'padding'
            ]
          },
          {
            name: 'Typography',
            open: false,
            properties: [
              'font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'
            ]
          },
          {
            name: 'Background',
            open: false,
            properties: [
              'background-color', 'background-image', 'background-repeat', 'background-position', 'background-attachment', 'background-size'
            ]
          },
          {
            name: 'Border',
            open: false,
            properties: [
              'border', 'border-radius', 'box-shadow'
            ]
          },
          {
            name: 'Effects',
            open: false,
            properties: [
              'opacity', 'transform', 'transition', 'filter'
            ]
          }
        ]
      },

      // Device manager
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px', widthMedia: '992px' },
          { name: 'Mobile', width: '375px', widthMedia: '575px' }
        ]
      },

      // Canvas configuration
      canvas: {
        styles: [
          'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
        ],
        scripts: [
          'https://code.jquery.com/jquery-3.5.1.slim.min.js',
          'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js',
          'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'
        ]
      },

      // Asset manager
      assetManager: {
        assets: [
          'https://via.placeholder.com/350x250/667eea/fff?text=Placeholder+1',
          'https://via.placeholder.com/350x250/764ba2/fff?text=Placeholder+2',
          'https://via.placeholder.com/350x250/f093fb/fff?text=Placeholder+3'
        ],
        upload: false,
        uploadText: 'Drag & drop images here or click to upload'
      }
    };

    // Initialize the editor
    this.editor = grapesjs.init(editorConfig);

    // Configure enhanced blocks
    if (window.WebBuilderBlocks?.configureBlockManager) {
      window.WebBuilderBlocks.configureBlockManager(this.editor);
    }

    // Register enhanced commands
    if (window.WebBuilderCommands?.registerEnhancedCommands) {
      window.WebBuilderCommands.registerEnhancedCommands(this.editor);
    }

    // Setup editor event listeners
    this.setupEditorEvents();

    return this.editor;
  }

  setupEditorEvents() {
    // Component selection events
    this.editor.on('component:selected', (component) => {
      console.log('Component selected:', component);
      
      // Update properties panel
      this.updatePropertiesPanel(component);
      
      // Emit event
      if (window.WebBuilderUtils?.eventBus) {
        window.WebBuilderUtils.eventBus.emit('component:selected', component);
      }
    });

    // Component change events
    this.editor.on('component:update', (component) => {
      console.log('Component updated:', component);
      this.scheduleAutoSave();
    });

    // Style change events
    this.editor.on('style:update', (style) => {
      console.log('Style updated:', style);
      this.scheduleAutoSave();
    });

    // Device change events
    this.editor.on('change:device', () => {
      const device = this.editor.getDevice();
      this.updateResponsiveIndicator(device);
    });

    // Canvas events
    this.editor.on('canvas:drop', (dataTransfer, component) => {
      console.log('Component dropped:', component);
      this.scheduleAutoSave();
    });
  }

  updatePropertiesPanel(component) {
    // Show traits panel when component is selected, if not already active
    if (component && component.get("type") !== "wrapper") {
      const panelSwitcher = this.editor.Panels.getPanel("panel__switcher");
      const traitsButton = panelSwitcher.getButton("show-traits");
      if (traitsButton && !traitsButton.get("active")) {
        this.editor.runCommand("show-traits");
      }
    }
  }

  updateResponsiveIndicator(device) {
    const indicator = document.getElementById('responsive-indicator');
    if (indicator) {
      indicator.textContent = device;
      indicator.className = `responsive-indicator device-${device.toLowerCase()}`;
    }
  }

  setupContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    if (!contextMenu) return;

    this.contextMenu = contextMenu;

    // Add context menu to canvas
    const canvas = this.editor.Canvas.getElement();
    if (canvas) {
      canvas.addEventListener('contextmenu', this.handleContextMenu);
    }

    // Add click handlers for context menu items
    contextMenu.addEventListener('click', (e) => {
      const item = e.target.closest('.context-menu-item');
      if (!item) return;

      const action = item.dataset.action;
      const selected = this.editor.getSelected();

      switch (action) {
        case 'clone':
          if (selected) selected.clone();
          break;
        case 'delete':
          if (selected) selected.remove();
          break;
        case 'move-up':
          if (selected) {
            const parent = selected.parent();
            const index = parent.components().indexOf(selected);
            if (index > 0) {
              parent.components().remove(selected);
              parent.components().add(selected, { at: index - 1 });
            }
          }
          break;
        case 'move-down':
          if (selected) {
            const parent = selected.parent();
            const components = parent.components();
            const index = components.indexOf(selected);
            if (index < components.length - 1) {
              components.remove(selected);
              components.add(selected, { at: index + 1 });
            }
          }
          break;
        case 'copy':
          this.editor.runCommand('copy-component');
          break;
        case 'cut':
          this.editor.runCommand('copy-component');
          if (selected) selected.remove();
          break;
        case 'paste':
          this.editor.runCommand('paste-component');
          break;
        case 'wrap':
          if (selected) {
            const wrapperComponent = this.editor.DomComponents.add({ tagName: 'div', classes: ['wrapper-container'], components: selected.toHTML() });
            selected.replaceWith(wrapperComponent);
          }
          break;
      }

      this.hideContextMenu();
    });

    // Hide context menu when clicking elsewhere
    document.addEventListener("click", (e) => {
      if (this.contextMenu.style.display === "block" && !this.contextMenu.contains(e.target) && !e.target.closest(".modal")) {
        this.hideContextMenu();
      }
    });
  }

  handleContextMenu(e) {
    e.preventDefault();
    
    const selected = this.editor.getSelected();
    if (!selected) return;

    const contextMenu = this.contextMenu;
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.setAttribute('aria-hidden', 'false');

    // Adjust position if menu goes off-screen
    const rect = contextMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      contextMenu.style.left = `${e.pageX - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      contextMenu.style.top = `${e.pageY - rect.height}px`;
    }
  }

  hideContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.style.display = 'none';
      this.contextMenu.setAttribute('aria-hidden', 'true');
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', this.handleKeyboardShortcuts);
  }

  handleKeyboardShortcuts(e) {
    // Ctrl+S - Save project
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      this.editor.runCommand('save-project');
    }
    
    // Ctrl+C - Copy component
    if (e.ctrlKey && e.key === 'c' && this.editor.getSelected()) {
      e.preventDefault();
      this.editor.runCommand('copy-component');
    }
    
    // Ctrl+V - Paste component
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
      this.editor.runCommand('paste-component');
    }
    
    // Delete - Remove selected component
    if (e.key === 'Delete' && this.editor.getSelected()) {
      e.preventDefault();
      this.editor.getSelected().remove();
    }
    
    // F11 - Toggle fullscreen
    if (e.key === 'F11') {
      e.preventDefault();
      this.editor.runCommand('fullscreen-toggle');
    }
    
    // Ctrl+/ - Show shortcuts
    if (e.ctrlKey && e.key === '/') {
      e.preventDefault();
      this.editor.runCommand('show-shortcuts');
    }
    
    // Escape - Deselect component
    if (e.key === 'Escape') {
      this.editor.select();
      this.hideContextMenu();
    }
  }

  setupAutoSave() {
    // Auto-save every 30 seconds
    this.autoSaveTimer = setInterval(this.handleAutoSave, APP_CONFIG.autoSaveInterval);
    
    // Save on page unload
    window.addEventListener('beforeunload', () => {
      this.handleAutoSave();
    });
  }

  scheduleAutoSave() {
    // Debounced auto-save
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = setTimeout(() => {
      this.handleAutoSave();
    }, 5000); // Save 5 seconds after last change
  }

  handleAutoSave() {
    if (!this.editor || !this.isInitialized) return;
    
    try {
      const projectData = {
        html: this.editor.getHtml(),
        css: this.editor.getCss(),
        components: this.editor.getComponents().toJSON(),
        timestamp: Date.now(),
        version: APP_CONFIG.version,
        autoSaved: true
      };

      window.WebBuilderUtils?.StorageManager?.set('webbuilder-project-autosave', projectData);
      console.log('Project auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        window.WebBuilderUtils?.themeManager?.toggle();
      });
    }

    // Modal close buttons - use more specific event delegation
    document.addEventListener('click', (e) => {
      // Handle close button clicks
      if (e.target.matches('#templates-modal-close, #custom-blocks-modal-close, .modal__close')) {
        e.preventDefault();
        e.stopPropagation();
        const modal = e.target.closest('dialog');
        if (modal) {
          modal.close();
          console.log('Modal closed via close button');
        }
      }
    });

    // Modal backdrop clicks - only close when clicking the backdrop itself
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'DIALOG' && e.target.open) {
        const rect = e.target.getBoundingClientRect();
        const isInDialog = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        
        if (isInDialog) {
          const modalContent = e.target.querySelector('.modal__content');
          if (modalContent) {
            const contentRect = modalContent.getBoundingClientRect();
            const isInContent = (
              e.clientX >= contentRect.left &&
              e.clientX <= contentRect.right &&
              e.clientY >= contentRect.top &&
              e.clientY <= contentRect.bottom
            );
            
            // Only close if clicking outside the content area
            if (!isInContent) {
              e.target.close();
              console.log('Modal closed via backdrop click');
            }
          }
        }
      }
    });

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('dialog[open]');
        openModals.forEach(modal => {
          modal.close();
          console.log('Modal closed via ESC key');
        });
      }
    });
  }

  loadCustomBlocks() {
    const customBlocks = window.WebBuilderUtils?.StorageManager?.get('webbuilder-custom-blocks', []);
    
    customBlocks.forEach(block => {
      this.editor.BlockManager.add(block.id, {
        label: block.label,
        category: 'Custom',
        content: block.content,
        attributes: { class: 'gjs-block-custom' }
      });
    });

    if (customBlocks.length > 0) {
      console.log(`Loaded ${customBlocks.length} custom blocks`);
    }
  }

  showLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      indicator.setAttribute('aria-hidden', 'false');
      indicator.style.opacity = '1';
    }
  }

  hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      indicator.setAttribute('aria-hidden', 'true');
      indicator.style.opacity = '0';
    }
  }

  showError(message) {
    const errorHtml = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-bg-panel);
        color: var(--color-text-primary);
        padding: 32px;
        border-radius: var(--border-radius-xl);
        box-shadow: var(--shadow-xl);
        z-index: var(--z-modal);
        max-width: 500px;
        text-align: center;
      ">
        <h2 style="color: var(--color-error); margin: 0 0 16px 0;">Error</h2>
        <p style="margin: 0 0 24px 0;">${message}</p>
        <button onclick="location.reload()" style="
          padding: 12px 24px;
          background: var(--color-accent-primary);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          cursor: pointer;
        ">Reload Page</button>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHtml);
  }

  // Public API methods
  getEditor() {
    return this.editor;
  }

  isReady() {
    return this.isInitialized;
  }

  destroy() {
    // Cleanup
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    document.removeEventListener('keydown', this.handleKeyboardShortcuts);
    
    const canvas = this.editor?.Canvas?.getElement();
    if (canvas) {
      canvas.removeEventListener('contextmenu', this.handleContextMenu);
    }
    
    this.isInitialized = false;
  }
}

// ===== APPLICATION INITIALIZATION =====
let webBuilderApp;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    webBuilderApp = new WebBuilderApp();
  });
} else {
  webBuilderApp = new WebBuilderApp();
}

// Make app globally available
window.WebBuilderApp = webBuilderApp;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebBuilderApp;
}

