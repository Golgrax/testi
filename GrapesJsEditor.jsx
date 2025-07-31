import { useEffect, useRef, useCallback } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginForms from 'grapesjs-plugin-forms';
import gjsPluginExport from 'grapesjs-plugin-export';

const GrapesJsEditor = ({ onEditorReady }) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  // Memoize the callback to prevent re-renders
  const handleEditorReady = useCallback((editor) => {
    if (onEditorReady) {
      onEditorReady(editor);
    }
  }, [onEditorReady]);

  useEffect(() => {
    if (!editorRef.current || editorInstance.current) return;

    // Initialize GrapesJS editor
    const editor = grapesjs.init({
      container: editorRef.current,
      height: '100vh',
      width: 'auto',
      storageManager: {
        type: 'local',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
      },
      plugins: [
        gjsPresetWebpage,
        gjsBlocksBasic,
        gjsPluginForms,
        gjsPluginExport,
      ],
      pluginsOpts: {
        [gjsPresetWebpage]: {
          modalImportTitle: 'Import Template',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: function(editor) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          },
          filestackOpts: null,
          aviaryOpts: false,
          blocksBasicOpts: {
            blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
            flexGrid: 1,
          },
          customStyleManager: [{
            name: 'General',
            buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
            properties: [{
              type: 'select',
              property: 'float',
              defaults: 'none',
              list: [
                { value: 'none', name: 'None' },
                { value: 'left', name: 'Left' },
                { value: 'right', name: 'Right' }
              ],
            }]
          }, {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'min-height', 'padding'],
            properties: [{
              property: 'margin',
              properties: [
                { name: 'Top', property: 'margin-top' },
                { name: 'Right', property: 'margin-right' },
                { name: 'Bottom', property: 'margin-bottom' },
                { name: 'Left', property: 'margin-left' }
              ],
            }]
          }, {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height'],
            properties: [{
              name: 'Font',
              property: 'font-family'
            }, {
              name: 'Weight',
              property: 'font-weight'
            }, {
              name: 'Font color',
              property: 'color',
            }]
          }, {
            name: 'Decorations',
            open: false,
            buildProps: ['opacity', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
            properties: [{
              type: 'slider',
              property: 'opacity',
              defaults: 1,
              step: 0.01,
              max: 1,
              min: 0,
            }]
          }, {
            name: 'Extra',
            open: false,
            buildProps: ['transition', 'perspective', 'transform'],
            properties: [{
              property: 'transition',
              type: 'stack',
              properties: [{
                name: 'Property',
                property: 'transition-property'
              }, {
                name: 'Duration',
                property: 'transition-duration'
              }, {
                name: 'Easing',
                property: 'transition-timing-function'
              }]
            }]
          }]
        },
        [gjsBlocksBasic]: {},
        [gjsPluginForms]: {},
        [gjsPluginExport]: {},
      },
      canvas: {
        styles: [
          'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
        ],
        scripts: [
          'https://code.jquery.com/jquery-3.3.1.slim.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
          'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
        ],
      },
      panels: {
        defaults: [
          {
            id: 'layers',
            el: '.panel__right',
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: 0,
              cl: 1,
              cr: 0,
              bc: 0,
              keyWidth: 'flex-basis',
            },
          },
          {
            id: 'panel-switcher',
            el: '.panel__switcher',
            buttons: [
              {
                id: 'show-layers',
                active: true,
                label: 'Layers',
                command: 'show-layers',
                togglable: false,
              },
              {
                id: 'show-style',
                active: true,
                label: 'Styles',
                command: 'show-styles',
                togglable: false,
              },
              {
                id: 'show-traits',
                active: true,
                label: 'Settings',
                command: 'show-traits',
                togglable: false,
              }
            ],
          }
        ]
      },
      layerManager: {
        appendTo: '.layers-container'
      },
      traitManager: {
        appendTo: '.traits-container',
      },
      selectorManager: {
        appendTo: '.styles-container'
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'min-height', 'padding'],
            properties: [
              {
                type: 'integer',
                name: 'Width',
                property: 'width',
                units: ['px', '%'],
                defaults: 'auto',
                min: 0,
              }
            ]
          },
          {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height'],
            properties: [
              {
                name: 'Font',
                property: 'font-family'
              },
              {
                name: 'Weight',
                property: 'font-weight'
              },
              {
                name: 'Font color',
                property: 'color',
              }
            ]
          },
          {
            name: 'Decorations',
            open: false,
            buildProps: ['opacity', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
            properties: [
              {
                type: 'slider',
                property: 'opacity',
                defaults: 1,
                step: 0.01,
                max: 1,
                min: 0,
              }
            ]
          }
        ]
      },
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [
          {
            id: 'section',
            label: '<b>Section</b>',
            attributes: { class: 'gjs-block-section' },
            content: `<section>
              <h1>Insert title here</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
            </section>`,
          },
          {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
          },
          {
            id: 'image',
            label: 'Image',
            select: true,
            content: { type: 'image' },
            activate: true,
          }
        ]
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
          },
          {
            name: 'Mobile',
            width: '320px',
            widthMedia: '480px',
          }
        ]
      }
    });

    // Store editor instance
    editorInstance.current = editor;

    // Add custom commands
    editor.Commands.add('show-layers', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getLayersEl(row) { return row.querySelector('.layers-container') },

      run(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
      },
      stop(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
      },
    });

    editor.Commands.add('show-styles', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getStyleEl(row) { return row.querySelector('.styles-container') },

      run(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
      },
      stop(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });

    editor.Commands.add('show-traits', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getTraitsEl(row) { return row.querySelector('.traits-container') },

      run(editor, sender) {
        const tmEl = this.getTraitsEl(this.getRowEl(editor));
        tmEl.style.display = '';
      },
      stop(editor, sender) {
        const tmEl = this.getTraitsEl(this.getRowEl(editor));
        tmEl.style.display = 'none';
      },
    });

    // Store editor instance
    editorInstance.current = editor;
    
    // Expose editor to global scope for debugging
    window.grapesJSEditor = editor;

    // Notify parent component that editor is ready
    handleEditorReady(editor);

    // Cleanup function
    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [handleEditorReady]); // Add handleEditorReady to dependency array

  return (
    <div className="editor-row flex h-screen">
      {/* Left Sidebar - Blocks */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Components</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="blocks-container p-4"></div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="panel__switcher flex gap-2"></div>
        </div>
        
        {/* Canvas */}
        <div className="flex-1 bg-gray-50">
          <div ref={editorRef} className="h-full"></div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="panel__right w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="layers-container p-4"></div>
          <div className="styles-container p-4" style={{ display: 'none' }}></div>
          <div className="traits-container p-4" style={{ display: 'none' }}></div>
        </div>
      </div>
    </div>
  );
};

export default GrapesJsEditor;

