/**
 * Enhanced WebBuilder Pro - Advanced Features & UI Improvements
 * Modern interactive features and enhanced user experience
 */

// ===== ENHANCED UI MANAGER =====
class EnhancedUIManager {
  constructor() {
    this.themes = {
      dark: 'dark-theme',
      light: 'light-theme',
      auto: 'auto-theme'
    };
    this.currentTheme = localStorage.getItem('webbuilder-theme') || 'dark';
    this.notifications = [];
    this.shortcuts = new Map();
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupNotificationSystem();
    this.setupAdvancedShortcuts();
    this.setupDragAndDrop();
    this.setupAdvancedTooltips();
    this.setupContextualHelp();
    this.setupAutoSave();
    this.setupCollaborationFeatures();
  }

  // ===== THEME MANAGEMENT =====
  setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn-icon theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = 'Toggle Theme';
    
    themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Add to header
    const headerNav = document.querySelector('.header-nav');
    if (headerNav) {
      headerNav.appendChild(themeToggle);
    }

    this.applyTheme(this.currentTheme);
  }

  toggleTheme() {
    const themes = Object.keys(this.themes);
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme = themes[nextIndex];
    
    this.applyTheme(this.currentTheme);
    localStorage.setItem('webbuilder-theme', this.currentTheme);
    
    this.showNotification(`Switched to ${this.currentTheme} theme`, 'info');
  }

  applyTheme(theme) {
    document.body.className = document.body.className.replace(/\w+-theme/g, '');
    document.body.classList.add(this.themes[theme]);
    
    // Update theme toggle icon
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
      const icons = {
        dark: 'fa-moon',
        light: 'fa-sun',
        auto: 'fa-adjust'
      };
      themeToggle.className = `fas ${icons[theme]}`;
    }
  }

  // ===== NOTIFICATION SYSTEM =====
  setupNotificationSystem() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 1080;
      max-width: 400px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
    this.notificationContainer = container;
  }

  showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    const id = Date.now().toString();
    
    notification.className = `notification notification-${type} animate-slide-in-right`;
    notification.style.cssText = `
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-left: 4px solid var(--color-${type === 'info' ? 'accent-primary' : type});
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      margin-bottom: var(--space-sm);
      box-shadow: var(--shadow-lg);
      pointer-events: auto;
      transform: translateX(100%);
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    `;

    const icon = this.getNotificationIcon(type);
    const content = document.createElement('div');
    content.style.flex = '1';
    content.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: var(--radius-sm);
      transition: var(--transition);
    `;
    closeBtn.onclick = () => this.removeNotification(id);

    notification.appendChild(icon);
    notification.appendChild(content);
    notification.appendChild(closeBtn);
    
    this.notificationContainer.appendChild(notification);
    this.notifications.push({ id, element: notification });

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    // Auto remove
    if (duration > 0) {
      setTimeout(() => this.removeNotification(id), duration);
    }

    return id;
  }

  getNotificationIcon(type) {
    const icon = document.createElement('i');
    const iconMap = {
      success: 'fa-check-circle',
      warning: 'fa-exclamation-triangle',
      error: 'fa-times-circle',
      info: 'fa-info-circle'
    };
    icon.className = `fas ${iconMap[type] || iconMap.info}`;
    icon.style.color = `var(--color-${type === 'info' ? 'accent-primary' : type})`;
    return icon;
  }

  removeNotification(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.element.style.transform = 'translateX(100%)';
      notification.element.style.opacity = '0';
      
      setTimeout(() => {
        if (notification.element.parentNode) {
          notification.element.parentNode.removeChild(notification.element);
        }
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 300);
    }
  }

  // ===== ADVANCED SHORTCUTS =====
  setupAdvancedShortcuts() {
    const shortcuts = [
      { key: 'ctrl+s', action: 'save-project', description: 'Save Project' },
      { key: 'ctrl+z', action: 'undo', description: 'Undo' },
      { key: 'ctrl+y', action: 'redo', description: 'Redo' },
      { key: 'ctrl+c', action: 'copy', description: 'Copy Component' },
      { key: 'ctrl+v', action: 'paste', description: 'Paste Component' },
      { key: 'ctrl+d', action: 'duplicate', description: 'Duplicate Component' },
      { key: 'delete', action: 'delete', description: 'Delete Component' },
      { key: 'ctrl+/', action: 'show-shortcuts', description: 'Show Shortcuts' },
      { key: 'ctrl+p', action: 'preview', description: 'Preview' },
      { key: 'ctrl+e', action: 'export', description: 'Export' },
      { key: 'ctrl+shift+i', action: 'import', description: 'Import' },
      { key: 'ctrl+shift+c', action: 'clear-canvas', description: 'Clear Canvas' },
      { key: 'f11', action: 'fullscreen', description: 'Toggle Fullscreen' },
      { key: 'ctrl+1', action: 'device-desktop', description: 'Desktop View' },
      { key: 'ctrl+2', action: 'device-tablet', description: 'Tablet View' },
      { key: 'ctrl+3', action: 'device-mobile', description: 'Mobile View' }
    ];

    shortcuts.forEach(shortcut => {
      this.shortcuts.set(shortcut.key, shortcut);
    });

    document.addEventListener('keydown', (e) => {
      const key = this.getKeyString(e);
      const shortcut = this.shortcuts.get(key);
      
      if (shortcut && !this.isInputFocused()) {
        e.preventDefault();
        this.executeShortcut(shortcut.action);
      }
    });
  }

  getKeyString(e) {
    const parts = [];
    if (e.ctrlKey) parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');
    if (e.metaKey) parts.push('meta');
    
    const key = e.key.toLowerCase();
    if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
      parts.push(key);
    }
    
    return parts.join('+');
  }

  isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );
  }

  executeShortcut(action) {
    if (window.app && window.app.editor) {
      try {
        window.app.editor.runCommand(action);
        this.showNotification(`Executed: ${action}`, 'success', 2000);
      } catch (error) {
        console.warn('Shortcut action not found:', action);
      }
    }
  }

  // ===== DRAG AND DROP ENHANCEMENTS =====
  setupDragAndDrop() {
    // Enhanced drag feedback
    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('gjs-block')) {
        this.addDragFeedback(e.target);
      }
    });

    document.addEventListener('dragend', (e) => {
      this.removeDragFeedback();
    });

    // Drop zone highlighting
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.highlightDropZone(e.target);
    });

    document.addEventListener('dragleave', (e) => {
      this.removeDropZoneHighlight(e.target);
    });
  }

  addDragFeedback(element) {
    const feedback = document.createElement('div');
    feedback.className = 'drag-feedback';
    feedback.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      background: var(--color-accent-primary);
      color: white;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      z-index: 1090;
      pointer-events: none;
      opacity: 0.9;
    `;
    feedback.textContent = `Dragging: ${element.title || 'Component'}`;
    document.body.appendChild(feedback);

    document.addEventListener('mousemove', this.updateDragFeedback);
  }

  updateDragFeedback = (e) => {
    const feedback = document.querySelector('.drag-feedback');
    if (feedback) {
      feedback.style.left = (e.clientX + 10) + 'px';
      feedback.style.top = (e.clientY - 30) + 'px';
    }
  }

  removeDragFeedback() {
    const feedback = document.querySelector('.drag-feedback');
    if (feedback) {
      feedback.remove();
    }
    document.removeEventListener('mousemove', this.updateDragFeedback);
  }

  highlightDropZone(element) {
    // Add visual feedback for valid drop zones
    if (element.classList.contains('gjs-cv-canvas')) {
      element.style.outline = '2px dashed var(--color-accent-primary)';
    }
  }

  removeDropZoneHighlight(element) {
    if (element.classList.contains('gjs-cv-canvas')) {
      element.style.outline = '';
    }
  }

  // ===== ADVANCED TOOLTIPS =====
  setupAdvancedTooltips() {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
    this.tooltip = tooltip;

    // Add tooltip listeners
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (target) {
        this.showTooltip(target, target.dataset.tooltip);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (target) {
        this.hideTooltip();
      }
    });
  }

  showTooltip(element, text) {
    this.tooltip.textContent = text;
    this.tooltip.classList.add('show');
    
    const rect = element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 8;
    
    // Adjust if tooltip goes off screen
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top < 8) {
      top = rect.bottom + 8;
    }
    
    this.tooltip.style.left = left + 'px';
    this.tooltip.style.top = top + 'px';
  }

  hideTooltip() {
    this.tooltip.classList.remove('show');
  }

  // ===== CONTEXTUAL HELP =====
  setupContextualHelp() {
    const helpButton = document.createElement('button');
    helpButton.className = 'btn btn-icon help-toggle';
    helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
    helpButton.title = 'Toggle Help Mode';
    
    helpButton.addEventListener('click', () => {
      this.toggleHelpMode();
    });

    const headerNav = document.querySelector('.header-nav');
    if (headerNav) {
      headerNav.appendChild(helpButton);
    }
  }

  toggleHelpMode() {
    document.body.classList.toggle('help-mode');
    const isHelpMode = document.body.classList.contains('help-mode');
    
    if (isHelpMode) {
      this.showNotification('Help mode enabled. Hover over elements for help.', 'info');
      this.addHelpOverlays();
    } else {
      this.showNotification('Help mode disabled.', 'info');
      this.removeHelpOverlays();
    }
  }

  addHelpOverlays() {
    const helpItems = [
      { selector: '.gjs-pn-panels', text: 'Toolbar: Access all tools and commands' },
      { selector: '.gjs-cv-canvas', text: 'Canvas: Design your webpage here' },
      { selector: '.gjs-blocks-c', text: 'Blocks: Drag components to canvas' },
      { selector: '.gjs-sm-sectors', text: 'Styles: Customize component appearance' },
      { selector: '.gjs-layers-c', text: 'Layers: Navigate component hierarchy' }
    ];

    helpItems.forEach(item => {
      const element = document.querySelector(item.selector);
      if (element) {
        element.setAttribute('data-help', item.text);
        element.classList.add('help-highlight');
      }
    });
  }

  removeHelpOverlays() {
    document.querySelectorAll('[data-help]').forEach(element => {
      element.removeAttribute('data-help');
      element.classList.remove('help-highlight');
    });
  }

  // ===== AUTO-SAVE ENHANCEMENTS =====
  setupAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      if (window.app && window.app.editor) {
        this.performAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    // Save on visibility change (tab switch, minimize)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && window.app && window.app.editor) {
        this.performAutoSave();
      }
    });

    // Save before page unload
    window.addEventListener('beforeunload', () => {
      if (window.app && window.app.editor) {
        this.performAutoSave();
      }
    });
  }

  performAutoSave() {
    try {
      if (window.app && window.app.editor) {
        const projectData = {
          html: window.app.editor.getHtml(),
          css: window.app.editor.getCss(),
          components: window.app.editor.getComponents(),
          styles: window.app.editor.getStyle(),
          timestamp: Date.now()
        };

        localStorage.setItem('webbuilder-autosave', JSON.stringify(projectData));
        
        // Show subtle auto-save indicator
        this.showAutoSaveIndicator();
      }
    } catch (error) {
      console.warn('Auto-save failed:', error);
    }
  }

  showAutoSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'autosave-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-success);
      color: white;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      z-index: 1070;
      opacity: 0;
      transform: translateY(10px);
      transition: var(--transition);
    `;
    indicator.innerHTML = '<i class="fas fa-check"></i> Auto-saved';
    
    document.body.appendChild(indicator);
    
    requestAnimationFrame(() => {
      indicator.style.opacity = '1';
      indicator.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateY(10px)';
      setTimeout(() => indicator.remove(), 300);
    }, 2000);
  }

  // ===== COLLABORATION FEATURES =====
  setupCollaborationFeatures() {
    // Add collaboration status indicator
    const collabIndicator = document.createElement('div');
    collabIndicator.className = 'collaboration-indicator';
    collabIndicator.style.cssText = `
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      background: var(--color-bg-tertiary);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
    `;
    collabIndicator.innerHTML = `
      <div class="status-dot" style="width: 8px; height: 8px; background: var(--color-success); border-radius: 50%;"></div>
      <span>Online</span>
    `;

    const headerNav = document.querySelector('.header-nav');
    if (headerNav) {
      headerNav.appendChild(collabIndicator);
    }

    // Simulate collaboration features
    this.setupVersionHistory();
    this.setupComments();
  }

  setupVersionHistory() {
    // Add version history button
    const versionBtn = document.createElement('button');
    versionBtn.className = 'btn btn-ghost btn-sm';
    versionBtn.innerHTML = '<i class="fas fa-history"></i> History';
    versionBtn.onclick = () => this.showVersionHistory();

    const headerNav = document.querySelector('.header-nav');
    if (headerNav) {
      headerNav.appendChild(versionBtn);
    }
  }

  showVersionHistory() {
    // Create version history modal
    const modal = this.createModal('Version History', this.getVersionHistoryContent());
    document.body.appendChild(modal);
    this.showModal(modal);
  }

  getVersionHistoryContent() {
    const versions = this.getStoredVersions();
    
    return `
      <div class="version-history">
        <div class="version-list">
          ${versions.map(version => `
            <div class="version-item" style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: var(--space-md);
              border: 1px solid var(--color-border);
              border-radius: var(--radius-md);
              margin-bottom: var(--space-sm);
            ">
              <div>
                <div style="font-weight: var(--font-weight-medium);">${version.name}</div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  ${new Date(version.timestamp).toLocaleString()}
                </div>
              </div>
              <div style="display: flex; gap: var(--space-xs);">
                <button class="btn btn-sm btn-ghost" onclick="enhancedUI.restoreVersion('${version.id}')">
                  <i class="fas fa-undo"></i> Restore
                </button>
                <button class="btn btn-sm btn-ghost" onclick="enhancedUI.previewVersion('${version.id}')">
                  <i class="fas fa-eye"></i> Preview
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getStoredVersions() {
    // Simulate version history
    return [
      { id: '1', name: 'Initial Design', timestamp: Date.now() - 3600000 },
      { id: '2', name: 'Added Header', timestamp: Date.now() - 1800000 },
      { id: '3', name: 'Styled Components', timestamp: Date.now() - 900000 },
      { id: '4', name: 'Current Version', timestamp: Date.now() }
    ];
  }

  setupComments() {
    // Add comments button
    const commentsBtn = document.createElement('button');
    commentsBtn.className = 'btn btn-ghost btn-sm';
    commentsBtn.innerHTML = '<i class="fas fa-comments"></i> Comments';
    commentsBtn.onclick = () => this.toggleComments();

    const headerNav = document.querySelector('.header-nav');
    if (headerNav) {
      headerNav.appendChild(commentsBtn);
    }
  }

  toggleComments() {
    const commentsPanel = document.querySelector('.comments-panel');
    if (commentsPanel) {
      commentsPanel.remove();
    } else {
      this.showCommentsPanel();
    }
  }

  showCommentsPanel() {
    const panel = document.createElement('div');
    panel.className = 'comments-panel';
    panel.style.cssText = `
      position: fixed;
      top: var(--toolbar-height);
      right: 0;
      width: 300px;
      height: calc(100vh - var(--toolbar-height));
      background: var(--color-bg-secondary);
      border-left: 1px solid var(--color-border);
      z-index: var(--z-sticky);
      overflow-y: auto;
      padding: var(--space-lg);
    `;

    panel.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-lg);">
        <h3 style="margin: 0; font-size: var(--font-size-lg);">Comments</h3>
        <button class="btn btn-icon btn-ghost" onclick="this.closest('.comments-panel').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="comments-list">
        <div class="comment-item" style="
          background: var(--color-bg-card);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          margin-bottom: var(--space-md);
        ">
          <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
            <div style="
              width: 32px;
              height: 32px;
              background: var(--color-accent-primary);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: var(--font-size-sm);
            ">JD</div>
            <div>
              <div style="font-weight: var(--font-weight-medium);">John Doe</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">2 hours ago</div>
            </div>
          </div>
          <div>Great work on the header design! The gradient looks amazing.</div>
        </div>
      </div>
      <div class="add-comment" style="margin-top: var(--space-lg);">
        <textarea 
          placeholder="Add a comment..." 
          style="
            width: 100%;
            min-height: 80px;
            padding: var(--space-sm);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            background: var(--color-bg-tertiary);
            color: var(--color-text-primary);
            font-family: inherit;
            resize: vertical;
          "
        ></textarea>
        <button class="btn btn-primary btn-sm" style="margin-top: var(--space-sm); width: 100%;">
          <i class="fas fa-paper-plane"></i> Post Comment
        </button>
      </div>
    `;

    document.body.appendChild(panel);
  }

  // ===== MODAL UTILITIES =====
  createModal(title, content) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.width = '600px';
    modal.style.maxHeight = '80vh';
    
    modal.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" onclick="enhancedUI.closeModal(this)">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    `;
    
    backdrop.appendChild(modal);
    backdrop.onclick = (e) => {
      if (e.target === backdrop) {
        this.closeModal(backdrop);
      }
    };
    
    return backdrop;
  }

  showModal(modalBackdrop) {
    modalBackdrop.classList.add('show');
    modalBackdrop.querySelector('.modal').classList.add('show');
  }

  closeModal(element) {
    const backdrop = element.closest('.modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('show');
      backdrop.querySelector('.modal').classList.remove('show');
      setTimeout(() => backdrop.remove(), 300);
    }
  }

  // ===== CLEANUP =====
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.updateDragFeedback);
    
    // Remove created elements
    const elementsToRemove = [
      '.notification-container',
      '.tooltip',
      '.comments-panel',
      '.modal-backdrop'
    ];
    
    elementsToRemove.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) element.remove();
    });
  }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      fps: 0
    };
    this.init();
  }

  init() {
    this.measureLoadTime();
    this.setupFPSMonitor();
    this.setupMemoryMonitor();
    this.createPerformancePanel();
  }

  measureLoadTime() {
    if (performance.timing) {
      this.metrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
  }

  setupFPSMonitor() {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = (currentTime) => {
      frames++;
      if (currentTime >= lastTime + 1000) {
        this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
        this.updatePerformanceDisplay();
      }
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  setupMemoryMonitor() {
    if (performance.memory) {
      setInterval(() => {
        this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
        this.updatePerformanceDisplay();
      }, 5000);
    }
  }

  createPerformancePanel() {
    const panel = document.createElement('div');
    panel.className = 'performance-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: var(--color-bg-panel);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-sm);
      font-size: var(--font-size-xs);
      font-family: var(--font-family-mono);
      color: var(--color-text-secondary);
      z-index: var(--z-tooltip);
      min-width: 150px;
      opacity: 0.8;
      transition: var(--transition);
    `;
    
    panel.innerHTML = `
      <div style="font-weight: var(--font-weight-semibold); margin-bottom: var(--space-xs);">Performance</div>
      <div class="perf-fps">FPS: <span>--</span></div>
      <div class="perf-memory">Memory: <span>--</span> MB</div>
      <div class="perf-load">Load: <span>${this.metrics.loadTime}</span> ms</div>
    `;
    
    panel.addEventListener('mouseenter', () => {
      panel.style.opacity = '1';
    });
    
    panel.addEventListener('mouseleave', () => {
      panel.style.opacity = '0.8';
    });
    
    document.body.appendChild(panel);
    this.performancePanel = panel;
  }

  updatePerformanceDisplay() {
    if (this.performancePanel) {
      const fpsSpan = this.performancePanel.querySelector('.perf-fps span');
      const memorySpan = this.performancePanel.querySelector('.perf-memory span');
      
      if (fpsSpan) fpsSpan.textContent = this.metrics.fps;
      if (memorySpan) memorySpan.textContent = this.metrics.memoryUsage;
    }
  }
}

// ===== INITIALIZE ENHANCED FEATURES =====
window.enhancedUI = new EnhancedUIManager();
window.performanceMonitor = new PerformanceMonitor();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EnhancedUIManager, PerformanceMonitor };
}

