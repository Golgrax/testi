/**
 * Enhanced WebBuilder Pro - Command Definitions
 * Modern command system with enhanced functionality
 */

// ===== COMMAND UTILITIES =====
const { StorageManager, EventBus, showToast, copyToClipboard, downloadFile } = window.WebBuilderUtils || {};

// ===== ENHANCED COMMANDS =====
const enhancedCommands = {
  // ===== DEVICE COMMANDS =====
  'set-device-desktop': {
    run: (editor) => {
      editor.setDevice('Desktop');
      updateResponsiveIndicator('Desktop');
    }
  },

  'set-device-tablet': {
    run: (editor) => {
      editor.setDevice('Tablet');
      updateResponsiveIndicator('Tablet');
    }
  },

  'set-device-mobile': {
    run: (editor) => {
      editor.setDevice('Mobile');
      updateResponsiveIndicator('Mobile');
    }
  },

  // ===== PANEL VISIBILITY COMMANDS =====
  'show-layers': {
    run: (editor) => {
      showPanel('layers');
      setActiveTab('show-layers');
    }
  },

  'show-styles': {
    run: (editor) => {
      showPanel('styles');
      setActiveTab('show-styles');
    }
  },

  'show-traits': {
    run: (editor) => {
      showPanel('traits');
      setActiveTab('show-traits');
    }
  },

  // ===== PROJECT MANAGEMENT COMMANDS =====
  'save-project': {
    run: (editor) => {
      try {
        const projectData = {
          html: editor.getHtml(),
          css: editor.getCss(),
          components: editor.getComponents(),
          styles: editor.getStyles(),
          timestamp: Date.now(),
          version: '2.0.0'
        };

        StorageManager.set('webbuilder-project', projectData);
        showToast('Project saved successfully!', 'success');
        
        // Emit event for other components
        if (window.WebBuilderUtils?.eventBus) {
          window.WebBuilderUtils.eventBus.emit('project:saved', projectData);
        }
      } catch (error) {
        console.error('Failed to save project:', error);
        showToast('Failed to save project', 'error');
      }
    }
  },

  'load-project': {
    run: (editor) => {
      try {
        const projectData = StorageManager.get('webbuilder-project');
        
        if (!projectData) {
          showToast('No saved project found', 'warning');
          return;
        }

        if (confirm('Loading a project will replace your current work. Continue?')) {
          editor.setComponents(projectData.components || projectData.html || '');
          editor.setStyle(projectData.styles || projectData.css || '');
          
          showToast('Project loaded successfully!', 'success');
          
          // Emit event for other components
          if (window.WebBuilderUtils?.eventBus) {
            window.WebBuilderUtils.eventBus.emit('project:loaded', projectData);
          }
        }
      } catch (error) {
        console.error('Failed to load project:', error);
        showToast('Failed to load project', 'error');
      }
    }
  },

  'export-project': {
    run: (editor) => {
      try {
        const html = editor.getHtml();
        const css = editor.getCss();
        
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebBuilder Pro Export</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

        downloadFile(fullHtml, 'webbuilder-export.html', 'text/html');
        showToast('Project exported successfully!', 'success');
      } catch (error) {
        console.error('Failed to export project:', error);
        showToast('Failed to export project', 'error');
      }
    }
  },

  'clear-canvas': {
    run: (editor) => {
      if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
        editor.getComponents().clear();
        editor.getStyles().clear();
        
        // Clear localStorage after a short delay
        setTimeout(() => {
          StorageManager.remove('webbuilder-project');
          StorageManager.remove('gjs-components');
          StorageManager.remove('gjs-styles');
        }, 100);
        
        showToast('Canvas cleared', 'info');
        
        // Emit event for other components
        if (window.WebBuilderUtils?.eventBus) {
          window.WebBuilderUtils.eventBus.emit('canvas:cleared');
        }
      }
    }
  },

  // ===== CUSTOM BLOCK MANAGEMENT =====
  'save-custom-block': {
    run: (editor) => {
      const selected = editor.getSelected();
      
      if (!selected) {
        showToast('Please select a component first', 'warning');
        return;
      }

      const blockName = prompt('Enter a name for your custom block:');
      if (!blockName) return;

      try {
        const customBlocks = StorageManager.get('webbuilder-custom-blocks', []);
        const blockId = blockName.replace(/\s+/g, '-').toLowerCase();
        
        const newBlock = {
          id: blockId,
          name: blockName,
          label: `<b>${blockName}</b>`,
          category: 'Custom',
          content: selected.toHTML(),
          thumbnail: generateBlockThumbnail(selected),
          created: Date.now()
        };

        customBlocks.push(newBlock);
        StorageManager.set('webbuilder-custom-blocks', customBlocks);

        // Add to block manager
        editor.BlockManager.add(blockId, {
          label: newBlock.label,
          category: 'Custom',
          content: newBlock.content,
          attributes: { class: 'gjs-block-custom' }
        });

        showToast(`Block "${blockName}" saved successfully!`, 'success');
        
        // Emit event for other components
        if (window.WebBuilderUtils?.eventBus) {
          window.WebBuilderUtils.eventBus.emit('block:saved', newBlock);
        }
      } catch (error) {
        console.error('Failed to save custom block:', error);
        showToast('Failed to save custom block', 'error');
      }
    }
  },

  'manage-custom-blocks': {
    run: (editor) => {
      showCustomBlocksModal();
    }
  },

  // ===== TEMPLATE MANAGEMENT =====
  'open-templates': {
    run: (editor) => {
      showTemplatesModal();
    }
  },

  'save-as-template': {
    run: (editor) => {
      const templateName = prompt('Enter a name for your template:');
      if (!templateName) return;

      try {
        const templates = StorageManager.get('webbuilder-templates', []);
        
        const newTemplate = {
          id: templateName.replace(/\s+/g, '-').toLowerCase(),
          name: templateName,
          html: editor.getHtml(),
          css: editor.getCss(),
          thumbnail: generateTemplateThumbnail(),
          created: Date.now()
        };

        templates.push(newTemplate);
        StorageManager.set('webbuilder-templates', templates);

        showToast(`Template "${templateName}" saved successfully!`, 'success');
        
        // Emit event for other components
        if (window.WebBuilderUtils?.eventBus) {
          window.WebBuilderUtils.eventBus.emit('template:saved', newTemplate);
        }
      } catch (error) {
        console.error('Failed to save template:', error);
        showToast('Failed to save template', 'error');
      }
    }
  },

  // ===== CLIPBOARD OPERATIONS =====
  'copy-component': {
    run: (editor) => {
      const selected = editor.getSelected();
      if (!selected) {
        showToast('Please select a component first', 'warning');
        return;
      }

      try {
        const componentData = {
          html: selected.toHTML(),
          css: selected.toCSS ? selected.toCSS() : '',
          type: 'component',
          timestamp: Date.now()
        };

        StorageManager.set('webbuilder-clipboard', componentData);
        showToast('Component copied to clipboard', 'success');
      } catch (error) {
        console.error('Failed to copy component:', error);
        showToast('Failed to copy component', 'error');
      }
    }
  },

  'paste-component': {
    run: (editor) => {
      try {
        const clipboardData = StorageManager.get('webbuilder-clipboard');
        
        if (!clipboardData) {
          showToast('Clipboard is empty', 'warning');
          return;
        }

        const selected = editor.getSelected();
        const target = selected || editor.getWrapper();
        
        target.append(clipboardData.html);
        showToast('Component pasted successfully', 'success');
      } catch (error) {
        console.error('Failed to paste component:', error);
        showToast('Failed to paste component', 'error');
      }
    }
  },

  // ===== UTILITY COMMANDS =====
  'fullscreen-toggle': {
    run: (editor) => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        showToast('Entered fullscreen mode', 'info');
      } else {
        document.exitFullscreen();
        showToast('Exited fullscreen mode', 'info');
      }
    }
  },

  'take-screenshot': {
    run: (editor) => {
      // This would require additional libraries like html2canvas
      showToast('Screenshot feature coming soon!', 'info');
    }
  },

  'show-shortcuts': {
    run: (editor) => {
      showShortcutsModal();
    }
  }
};

// ===== HELPER FUNCTIONS =====
function updateResponsiveIndicator(device) {
  const indicator = document.getElementById('responsive-indicator');
  if (indicator) {
    indicator.textContent = device;
    indicator.className = `responsive-indicator device-${device.toLowerCase()}`;
  }
}

function showPanel(panelType) {
  // Hide all panels
  const panels = ['layers', 'styles', 'traits'];
  panels.forEach(panel => {
    const container = document.getElementById(`${panel}-container`) || 
                     document.getElementById(`${panel}-section`);
    if (container) {
      container.style.display = 'none';
    }
  });

  // Show selected panel
  const targetContainer = document.getElementById(`${panelType}-container`) || 
                         document.getElementById(`${panelType}-section`);
  if (targetContainer) {
    targetContainer.style.display = 'block';
  }
}

function setActiveTab(activeTabId) {
  const tabs = document.querySelectorAll('#panel__switcher .gjs-pn-btn');
  tabs.forEach(tab => {
    tab.classList.remove('gjs-pn-active');
    if (tab.id === activeTabId) {
      tab.classList.add('gjs-pn-active');
    }
  });
}

function generateBlockThumbnail(component) {
  // In a real implementation, this would generate a thumbnail image
  // For now, return a placeholder
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzY2N2VlYSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QmxvY2s8L3RleHQ+PC9zdmc+';
}

function generateTemplateThumbnail() {
  // In a real implementation, this would generate a thumbnail image
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzc2NGJhMiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTA1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UZW1wbGF0ZTwvdGV4dD48L3N2Zz4=';
}

function showCustomBlocksModal() {
  const modal = document.getElementById('custom-blocks-modal');
  if (modal) {
    const customBlocks = StorageManager.get('webbuilder-custom-blocks', []);
    const container = document.getElementById('custom-blocks-container');
    
    if (container) {
      container.innerHTML = customBlocks.length === 0 
        ? '<p style="text-align: center; color: var(--color-text-secondary); padding: 40px;">No custom blocks saved yet.</p>'
        : customBlocks.map(block => `
            <div class="custom-block-item" data-block-id="${block.id}" style="
              border: 1px solid var(--color-border);
              border-radius: var(--border-radius-md);
              padding: 16px;
              cursor: pointer;
              transition: all var(--transition-fast);
            ">
              <h4 style="margin: 0 0 8px 0; color: var(--color-text-primary);">${block.name}</h4>
              <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                Created: ${new Date(block.created).toLocaleDateString()}
              </p>
              <div class="block-actions" style="margin-top: 12px; display: flex; gap: 8px;">
                <button onclick="deleteCustomBlock('${block.id}')" style="
                  padding: 4px 8px;
                  background: var(--color-error);
                  color: white;
                  border: none;
                  border-radius: 4px;
                  font-size: 12px;
                  cursor: pointer;
                ">Delete</button>
              </div>
            </div>
          `).join('');
    }
    
    modal.showModal();
  }
}

function showTemplatesModal() {
  const modal = document.getElementById('templates-modal');
  if (modal) {
    const templates = StorageManager.get('webbuilder-templates', []);
    const container = document.getElementById('templates-container');
    
    if (container) {
      container.innerHTML = templates.length === 0 
        ? '<p style="text-align: center; color: var(--color-text-secondary); padding: 40px;">No templates saved yet.</p>'
        : templates.map(template => `
            <div class="template-card" data-template-id="${template.id}" style="cursor: pointer;">
              <img src="${template.thumbnail}" alt="${template.name}" style="width: 100%; height: 160px; object-fit: cover;" />
              <div class="template-card-name">${template.name}</div>
            </div>
          `).join('');
    }
    
    modal.showModal();
  }
}

function showShortcutsModal() {
  const shortcuts = [
    { key: 'Ctrl+S', action: 'Save Project' },
    { key: 'Ctrl+Z', action: 'Undo' },
    { key: 'Ctrl+Y', action: 'Redo' },
    { key: 'Ctrl+C', action: 'Copy Component' },
    { key: 'Ctrl+V', action: 'Paste Component' },
    { key: 'Delete', action: 'Delete Selected' },
    { key: 'F11', action: 'Toggle Fullscreen' },
    { key: 'Ctrl+P', action: 'Preview' }
  ];

  const modalHtml = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal);
    " onclick="this.remove()">
      <div style="
        background: var(--color-bg-panel);
        border-radius: var(--border-radius-xl);
        padding: 32px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      " onclick="event.stopPropagation()">
        <h2 style="margin: 0 0 24px 0; color: var(--color-text-primary);">Keyboard Shortcuts</h2>
        <div style="display: grid; gap: 12px;">
          ${shortcuts.map(shortcut => `
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 0;
              border-bottom: 1px solid var(--color-border);
            ">
              <span style="color: var(--color-text-primary);">${shortcut.action}</span>
              <kbd style="
                background: var(--color-bg-tertiary);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                color: var(--color-text-secondary);
              ">${shortcut.key}</kbd>
            </div>
          `).join('')}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          margin-top: 24px;
          padding: 12px 24px;
          background: var(--color-accent-primary);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          cursor: pointer;
          width: 100%;
        ">Close</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// ===== GLOBAL FUNCTIONS =====
window.deleteCustomBlock = function(blockId) {
  if (confirm("Are you sure you want to delete this custom block?")) {
    let customBlocks = StorageManager.get("webbuilder-custom-blocks", []);
    const initialLength = customBlocks.length;
    customBlocks = customBlocks.filter(block => block.id !== blockId);
    StorageManager.set("webbuilder-custom-blocks", customBlocks);

    // Remove from GrapesJS BlockManager
    if (window.webBuilderApp && window.webBuilderApp.editor) {
      window.webBuilderApp.editor.BlockManager.remove(blockId);
    }

    if (customBlocks.length < initialLength) {
      showToast("Custom block deleted successfully!", "success");
      // Re-render the custom blocks modal if it's open
      const modal = document.getElementById("custom-blocks-modal");
      if (modal && modal.open) {
        showCustomBlocksModal();
      }
    } else {
      showToast("Custom block not found.", "warning");
    }
  }
};


