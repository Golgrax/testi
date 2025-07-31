const editor = grapesjs.init({
  container: "#gjs",
  height: "100vh",
  width: "auto",
  storageManager: {
    type: "local",
    autosave: true,
    autoload: true,
    stepsBeforeSave: 1,
  },
  plugins: [
    "grapesjs-preset-webpage",
    "grapesjs-blocks-basic",
    "grapesjs-plugin-forms",
    "grapesjs-plugin-export",
  ],
  pluginsOpts: {
    "grapesjs-preset-webpage": {
      modalImportTitle: "Import Template",
      modalImportLabel:
        '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
      modalImportContent: function (editor) {
        return editor.getHtml() + "<style>" + editor.getCss() + "</style>";
      },
      filestackOpts: null,
      aviaryOpts: false,
      blocksBasicOpts: {
        blocks: [
          "column1",
          "column2",
          "column3",
          "column3-7",
          "text",
          "link",
          "image",
          "video",
        ],
        flexGrid: 1,
      },
      customStyleManager: [
        {
          name: "General",
          buildProps: ["float", "display", "position", "top", "right", "left", "bottom"],
          properties: [
            {
              type: "select",
              property: "float",
              defaults: "none",
              list: [
                { value: "none", name: "None" },
                { value: "left", name: "Left" },
                { value: "right", name: "Right" },
              ],
            },
          ],
        },
        {
          name: "Dimension",
          open: false,
          buildProps: ["width", "min-height", "padding"],
          properties: [
            {
              property: "margin",
              properties: [
                { name: "Top", property: "margin-top" },
                { name: "Right", property: "margin-right" },
                { name: "Bottom", property: "margin-bottom" },
                { name: "Left", property: "margin-left" },
              ],
            },
          ],
        },
        {
          name: "Typography",
          open: false,
          buildProps: ["font-family", "font-size", "font-weight", "letter-spacing", "color", "line-height"],
          properties: [
            {
              name: "Font",
              property: "font-family",
            },
            {
              name: "Weight",
              property: "font-weight",
            },
            {
              name: "Font color",
              property: "color",
            },
          ],
        },
        {
          name: "Decorations",
          open: false,
          buildProps: ["opacity", "background-color", "border-radius", "border", "box-shadow", "background"],
          properties: [
            {
              type: "slider",
              property: "opacity",
              defaults: 1,
              step: 0.01,
              max: 1,
              min: 0,
            },
          ],
        },
        {
          name: "Extra",
          open: false,
          buildProps: ["transition", "perspective", "transform"],
          properties: [
            {
              property: "transition",
              type: "stack",
              properties: [
                {
                  name: "Property",
                  property: "transition-property",
                },
                {
                  name: "Duration",
                  property: "transition-duration",
                },
                {
                  name: "Easing",
                  property: "transition-timing-function",
                },
              ],
            },
          ],
        },
      ],
    },
    "grapesjs-blocks-basic": {},
    "grapesjs-plugin-forms": {},
    "grapesjs-plugin-export": {},
  },
  canvas: {
    styles: [
      "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css",
    ],
    scripts: [
      "https://code.jquery.com/jquery-3.3.1.slim.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js",
      "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js",
    ],
  },
  panels: {
    defaults: [
      {
        id: "layers",
        el: ".panel__right",
        resizable: {
          maxDim: 350,
          minDim: 200,
          tc: 0,
          cl: 1,
          cr: 0,
          bc: 0,
          keyWidth: "flex-basis",
        },
      },
      {
        id: "panel-switcher",
        el: ".panel__switcher",
        buttons: [
          {
            id: "show-layers",
            active: true,
            label: "Layers",
            command: "show-layers",
            togglable: false,
          },
          {
            id: "show-style",
            active: true,
            label: "Styles",
            command: "show-styles",
            togglable: false,
          },
          {
            id: "show-traits",
            active: true,
            label: "Settings",
            command: "show-traits",
            togglable: false,
          },
        ],
      },
    ],
  },
  layerManager: {
    appendTo: ".layers-container",
  },
  traitManager: {
    appendTo: ".traits-container",
  },
  selectorManager: {
    appendTo: ".styles-container",
  },
  styleManager: {
    appendTo: ".styles-container",
    sectors: [
      {
        name: "Dimension",
        open: false,
        buildProps: ["width", "min-height", "padding"],
        properties: [
          {
            type: "integer",
            name: "Width",
            property: "width",
            units: ["px", "%"],
            defaults: "auto",
            min: 0,
          },
        ],
      },
      {
        name: "Typography",
        open: false,
        buildProps: ["font-family", "font-size", "font-weight", "letter-spacing", "color", "line-height"],
        properties: [
          {
            name: "Font",
            property: "font-family",
          },
          {
            name: "Weight",
            property: "font-weight",
          },
          {
            name: "Font color",
            property: "color",
          },
        ],
      },
      {
        name: "Decorations",
        open: false,
        buildProps: ["opacity", "background-color", "border-radius", "border", "box-shadow", "background"],
        properties: [
          {
            type: "slider",
            property: "opacity",
            defaults: 1,
            step: 0.01,
            max: 1,
            min: 0,
          },
        ],
      },
    ],
  },
  blockManager: {
    appendTo: ".blocks-container",
    blocks: [
      {
        id: "section",
        label: "<b>Section</b>",
        attributes: { class: "gjs-block-section" },
        content: `<section>
              <h1>Insert title here</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
            </section>`,
      },
      {
        id: "text",
        label: "Text",
        content: '<div data-gjs-type="text">Insert your text here</div>',
      },
      {
        id: "image",
        label: "Image",
        select: true,
        content: { type: "image" },
        activate: true,
      },
    ],
  },
  deviceManager: {
    devices: [
      {
        name: "Desktop",
        width: "",
      },
      {
        name: "Mobile",
        width: "320px",
        widthMedia: "480px",
      },
    ],
  },
});

editor.Commands.add("show-layers", {
  getRowEl(editor) {
    return editor.getContainer().closest(".editor-row");
  },
  getLayersEl(row) {
    return row.querySelector(".layers-container");
  },

  run(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = "";
  },
  stop(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = "none";
  },
});

editor.Commands.add("show-styles", {
  getRowEl(editor) {
    return editor.getContainer().closest(".editor-row");
  },
  getStyleEl(row) {
    return row.querySelector(".styles-container");
  },

  run(editor, sender) {
    const smEl = this.getStyleEl(this.getRowEl(editor));
    smEl.style.display = "";
  },
  stop(editor, sender) {
    const smEl = this.getStyleEl(this.getRowEl(editor));
    smEl.style.display = "none";
  },
});

editor.Commands.add("show-traits", {
  getRowEl(editor) {
    return editor.getContainer().closest(".editor-row");
  },
  getTraitsEl(row) {
    return row.querySelector(".traits-container");
  },

  run(editor, sender) {
    const tmEl = this.getTraitsEl(this.getRowEl(editor));
    tmEl.style.display = "";
  },
  stop(editor, sender) {
    const tmEl = this.getTraitsEl(this.getRowEl(editor));
    tmEl.style.display = "none";
  },
});

window.grapesJSEditor = editor;