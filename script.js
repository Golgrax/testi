/**
 * WebBuilder Pro Enhanced - Fixed & Improved Version
 * Combines the best of both improved UI and working functionality
 */

// ===== CONSTANTS AND CONFIGURATION =====
const APP_CONFIG = {
  version: '2.1.0',
  name: 'WebBuilder Pro Enhanced - Fixed',
  storagePrefix: 'webbuilder-pro-',
  autoSaveInterval: 30000,
  maxUndoSteps: 50
};

// ===== MAIN APPLICATION CLASS =====
class WebBuilderApp {
  constructor() {
    this.editor = null;
    this.isInitialized = false;
    this.autoSaveTimer = null;
    this.leftSidebarVisible = true;
    this.rightSidebarVisible = true;
    this.currentTheme = 'dark';
    
    // Bind methods
    this.handleKeyboardShortcuts = this.handleKeyboardShortcuts.bind(this);
    this.handleAutoSave = this.handleAutoSave.bind(this);
    this.toggleLeftSidebar = this.toggleLeftSidebar.bind(this);
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
    
    this.init();
  }

  async init() {
    try {
      this.showLoadingIndicator();
      
      if (document.readyState === 'loading') {
        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
      }

      await this.waitForGrapesJS();
      await this.initializeEditor();
      
      this.setupUI();
      this.setupKeyboardShortcuts();
      this.setupAutoSave();
      this.setupEventListeners();
      this.loadCustomBlocks();
      
      this.hideLoadingIndicator();
      this.isInitialized = true;
      
      console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} initialized successfully`);
      this.showSuccessNotification('WebBuilder Pro Enhanced loaded successfully!');
      
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
        autosave: false,
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
        'grapesjs-plugin-export'
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
        }
      },

      // Block Manager configuration - CRITICAL for drag-and-drop
      blockManager: {
        appendTo: '#blocks-container',
        blocks: []
      },

      // Layer Manager
      layerManager: {
        appendTo: '#layers-container'
      },

      // Style Manager
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          {
            name: 'General',
            open: false,
            buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
          },
          {
            name: 'Layout',
            open: false,
            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding']
          },
          {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow']
          },
          {
            name: 'Background',
            open: false,
            buildProps: ['background-color', 'background-image', 'background-repeat', 'background-position', 'background-attachment', 'background-size']
          },
          {
            name: 'Border',
            open: false,
            buildProps: ['border', 'border-radius', 'box-shadow']
          },
          {
            name: 'Effects',
            open: false,
            buildProps: ['opacity', 'transform', 'transition']
          }
        ]
      },

      // Trait Manager
      traitManager: {
        appendTo: '#traits-container'
      },

      // Canvas configuration
      canvas: {
        styles: [
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ],
        scripts: []
      },

      // Device Manager
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
            priority: 1
          },
          {
            name: 'Tablet',
            width: '768px',
            priority: 2
          },
          {
            name: 'Mobile',
            width: '320px',
            priority: 3
          }
        ]
      }
    };

    // Initialize GrapesJS editor
    this.editor = grapesjs.init(editorConfig);

    // Setup editor event listeners
    this.setupEditorEvents();
  }

  setupEditorEvents() {
    if (!this.editor) return;

    // Component selection events
    this.editor.on('component:selected', (component) => {
      console.log('Component selected:', component);
      this.updatePropertiesPanel(component);
    });

    this.editor.on('component:deselected', (component) => {
      console.log('Component deselected:', component);
      this.clearPropertiesPanel();
    });

    // Block drag events
    this.editor.on('block:drag:start', (block) => {
      console.log('Block drag started:', block);
      this.showDropZones();
    });

    this.editor.on('block:drag:stop', (block) => {
      console.log('Block drag stopped:', block);
      this.hideDropZones();
    });

    // Canvas events
    this.editor.on('canvas:drop', (dataTransfer, component) => {
      console.log('Component dropped on canvas:', component);
      this.showSuccessNotification('Component added successfully!');
    });

    // Storage events
    this.editor.on('storage:start', () => {
      console.log('Storage operation started');
    });

    this.editor.on('storage:end', () => {
      console.log('Storage operation completed');
    });

    // Device change events
    this.editor.on('change:device', () => {
      this.updateDeviceButtons();
    });
  }

  updatePropertiesPanel(component) {
    // Update the properties panel with component-specific settings
    const propertiesContent = document.querySelector('.properties-content');
    if (propertiesContent && component) {
      console.log('Updating properties for:', component.get('type'));
    }
  }

  clearPropertiesPanel() {
    console.log('Clearing properties panel');
  }

  showDropZones() {
    document.body.classList.add('dragging');
  }

  hideDropZones() {
    document.body.classList.remove('dragging');
  }

  updateDeviceButtons() {
    const currentDevice = this.editor.getDevice();
    const deviceButtons = document.querySelectorAll('.device-btn');
    
    deviceButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.device === currentDevice) {
        btn.classList.add('active');
      }
    });
  }

  loadCustomBlocks() {
    if (!this.editor || typeof loadEnhancedBlocks !== 'function') {
      console.warn('Enhanced blocks not available');
      return;
    }

    try {
      loadEnhancedBlocks(this.editor);
      this.setupBlockSearch();
      this.showSuccessNotification('Custom blocks loaded successfully!');
    } catch (error) {
      console.error('Failed to load custom blocks:', error);
      this.showError('Failed to load custom blocks');
    }
  }

  setupBlockSearch() {
    const searchInput = document.getElementById('block-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      this.filterBlocks(searchTerm);
    });
  }

  filterBlocks(searchTerm) {
    const blockElements = document.querySelectorAll('.gjs-block');
    
    blockElements.forEach(block => {
      const label = block.querySelector('.gjs-block-label');
      if (label) {
        const text = label.textContent.toLowerCase();
        const shouldShow = text.includes(searchTerm) || searchTerm === '';
        block.style.display = shouldShow ? 'block' : 'none';
      }
    });
  }

  setupUI() {
    // Setup sidebar toggles
    this.setupSidebarToggles();
    
    // Setup theme toggle
    this.setupThemeToggle();
    
    // Setup device buttons
    this.setupDeviceButtons();
    
    // Setup properties tabs
    this.setupPropertiesTabs();
    
    // Setup action buttons
    this.setupActionButtons();
  }

  setupSidebarToggles() {
    const leftToggle = document.getElementById('left-sidebar-toggle');
    const rightToggle = document.getElementById('right-sidebar-toggle');

    if (leftToggle) {
      leftToggle.addEventListener('click', this.toggleLeftSidebar);
    }

    if (rightToggle) {
      rightToggle.addEventListener('click', this.toggleRightSidebar);
    }
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', this.toggleTheme);
    }
  }

  setupDeviceButtons() {
    const deviceButtons = document.querySelectorAll('.device-btn');
    
    deviceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const device = btn.dataset.device;
        if (this.editor && device) {
          this.editor.setDevice(device);
          this.updateDeviceButtons();
          this.showSuccessNotification(`Switched to ${device} view`);
        }
      });
    });
  }

  setupPropertiesTabs() {
    const tabs = document.querySelectorAll('.properties-tab');
    const sections = document.querySelectorAll('.properties-section');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active section
        sections.forEach(section => {
          section.classList.remove('active');
          if (section.id === `${targetTab}-container`) {
            section.classList.add('active');
          }
        });
      });
    });
  }

  setupActionButtons() {
    // Preview button
    const previewBtn = document.getElementById('preview-btn');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        if (this.editor) {
          this.editor.runCommand('preview');
        }
      });
    }

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportProject();
      });
    }

    // Save button
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveProject();
      });
    }
  }

  toggleLeftSidebar() {
    const sidebar = document.getElementById('left-sidebar');
    const toggle = document.getElementById('left-sidebar-toggle');
    
    if (sidebar && toggle) {
      this.leftSidebarVisible = !this.leftSidebarVisible;
      sidebar.classList.toggle('hidden', !this.leftSidebarVisible);
      toggle.classList.toggle('active', this.leftSidebarVisible);
      
      this.showSuccessNotification(
        `Left sidebar ${this.leftSidebarVisible ? 'shown' : 'hidden'}`
      );
    }
  }

  toggleRightSidebar() {
    const sidebar = document.getElementById('right-sidebar');
    const toggle = document.getElementById('right-sidebar-toggle');
    
    if (sidebar && toggle) {
      this.rightSidebarVisible = !this.rightSidebarVisible;
      sidebar.classList.toggle('hidden', !this.rightSidebarVisible);
      toggle.classList.toggle('active', this.rightSidebarVisible);
      
      this.showSuccessNotification(
        `Right sidebar ${this.rightSidebarVisible ? 'shown' : 'hidden'}`
      );
    }
  }

  toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (this.currentTheme === 'dark') {
      this.currentTheme = 'light';
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    } else {
      this.currentTheme = 'dark';
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
    }
    
    this.showSuccessNotification(`Switched to ${this.currentTheme} theme`);
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', this.handleKeyboardShortcuts);
  }

  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          this.saveProject();
          break;
        case 'z':
          e.preventDefault();
          if (this.editor) {
            this.editor.runCommand('core:undo');
          }
          break;
        case 'y':
          e.preventDefault();
          if (this.editor) {
            this.editor.runCommand('core:redo');
          }
          break;
        case '1':
          e.preventDefault();
          this.toggleLeftSidebar();
          break;
        case '2':
          e.preventDefault();
          this.toggleRightSidebar();
          break;
      }
    }
  }

  setupAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setInterval(this.handleAutoSave, APP_CONFIG.autoSaveInterval);
  }

  handleAutoSave() {
    if (this.editor && this.isInitialized) {
      try {
        this.editor.store();
        console.log('Auto-save completed');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  }

  saveProject() {
    if (!this.editor) {
      this.showError('Editor not initialized');
      return;
    }

    try {
      this.editor.store();
      this.showSuccessNotification('Project saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      this.showError('Failed to save project');
    }
  }

  exportProject() {
    if (!this.editor) {
      this.showError('Editor not initialized');
      return;
    }

    try {
      const html = this.editor.getHtml();
      const css = this.editor.getCss();
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Website</title>
    <style>${css}</style>
</head>
<body>
    ${html}
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'website.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showSuccessNotification('Website exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      this.showError('Failed to export website');
    }
  }

  setupEventListeners() {
    // Window resize handler
    window.addEventListener('resize', () => {
      if (this.editor) {
        this.editor.refresh();
      }
    });

    // Before unload handler
    window.addEventListener('beforeunload', (e) => {
      if (this.editor) {
        this.editor.store();
      }
    });
  }

  showLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      indicator.style.display = 'flex';
    }
  }

  hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container') || document.body;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 'info-circle';
    
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
    
    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      });
    }
  }

  showSuccessNotification(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }
}

// ===== INITIALIZE APPLICATION =====
let app;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new WebBuilderApp();
  });
} else {
  app = new WebBuilderApp();
}

// Export for global access
window.WebBuilderApp = app;

