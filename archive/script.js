document.addEventListener('DOMContentLoaded', () => {
    const editor = grapesjs.init({
        container: '#gjs',
        fromElement: true,
        height: '100%',
        width: 'auto',
        storageManager: { type: 'local' },
        plugins: [
            'grapesjs-preset-webpage',
            'gjs-blocks-basic',
            'grapesjs-plugin-forms',
            'grapesjs-plugin-export',
            'grapesjs-component-code-editor', // <-- ADD THIS
            'grapesjs-component-toolbar'
        ],
        pluginsOpts: {
            'grapesjs-preset-webpage': {
                // ... options for the preset
            },
            'gjs-blocks-basic': { flexGrid: true },
            'grapesjs-component-toolbar': {
                toolbar: [
                    { command: 'tlb-move', attributes: { title: 'Move', class: 'fa fa-arrows' } },
                    { command: 'tlb-clone', attributes: { title: 'Clone', class: 'fa fa-clone' } },
                    { command: 'tlb-delete', attributes: { title: 'Delete', class: 'fa fa-trash' } }
                ]
            },
        },
        // Define where to render UI components
        panels: {
            defaults: [
                { id: 'panel__options', el: '#panel__options' },
                { id: 'panel__devices', el: '#panel__devices', buttons: [
                    { id: 'device-desktop', command: 'set-device-desktop', label: '<i class="fas fa-desktop"></i>', active: true, },
                    { id: 'device-tablet', command: 'set-device-tablet', label: '<i class="fas fa-tablet-alt"></i>' },
                    { id: 'device-mobile', command: 'set-device-mobile', label: '<i class="fas fa-mobile-alt"></i>' },
                ]},
                { id: 'panel__views', el: '#panel__views', buttons: [
                    { id: 'preview', command: 'core:preview', context: 'core:preview', label: '<i class="fas fa-eye"></i>', title: 'Preview' },
                    { id: 'show-borders', command: 'core:component-outline', label: '<i class="fas fa-vector-square"></i>', title: 'View Components' },
                    { id: 'open-code', command: 'core:open-code', label: '<i class="fas fa-code"></i>', title: 'View Code' },
                    { id: 'undo', command: 'core:undo', label: '<i class="fas fa-undo"></i>', title: 'Undo' },
                    { id: 'redo', command: 'core:redo', label: '<i class="fas fa-redo"></i>', title: 'Redo' },
                    { id: 'open-templates', command: 'open-templates', label: '<i class="far fa-window-maximize"></i>', title: 'Templates' },
                    { id: 'import-template', command: 'gjs-open-import-webpage', label: '<i class="fas fa-upload"></i>', title: 'Import Template' },
                    { id: 'save-project', command: 'save-project', label: '<i class="fas fa-hdd"></i>', title: 'Save Project' },
                    { id: 'load-project', command: 'load-project', label: '<i class="fas fa-folder-open"></i>', title: 'Load Project' },
                    { id: 'save-block', command: 'save-custom-block', label: '<i class="fas fa-save"></i>', title: 'Save as Block' },
                    { id: 'export', command: 'export-template', label: '<i class="fas fa-file-export"></i>', title: 'Export Code' },
                    { id: 'clear-canvas', command: 'clear-canvas', label: '<i class="fas fa-trash"></i>', title: 'Clear Canvas' },
                ]},
                { id: 'panel__switcher', el: '#panel__switcher', buttons: [
                    { id: 'show-layers', command: 'show-layers', active: true, label: '<i class="fas fa-layer-group"></i>', title: 'Layers' },
                    { id: 'show-styles', command: 'show-styles', label: '<i class="fas fa-palette"></i>', title: 'Styles' },
                    { id: 'show-traits', command: 'show-traits', label: '<i class="fas fa-cog"></i>', title: 'Settings' },
                ]}
            ]
        },
        // Define UI managers
        layerManager: { appendTo: '#layers-container' },
        styleManager: { appendTo: '#style-container' },
        traitManager: { appendTo: '#trait-container' },
        blockManager: { appendTo: '#blocks' },
        selectorManager: { appendTo: '#selector-manager-container', },
        styleManager: { appendTo: '#style-properties-container', sectors: [] },
        deviceManager: {
            devices: [
                { name: 'Desktop', width: '' },
                { name: 'Tablet', width: '768px', widthMedia: '992px' },
                { name: 'Mobile', width: '375px', widthMedia: '575px' },
            ]
        },
        traitManager: {
            appendTo: '#trait-container',
        },
        // When a component is selected, we want to see its traits
        onComponentSelect(component) {
            if (component.get('type') === 'wrapper') { // 'wrapper' is the body
            editor.runCommand('show-traits');
            }
        },
        // Configure traits for the body
        components: [
            {
            type: 'wrapper', // This applies traits to the <body>
            traits: [
                {
                name: 'title',
                label: 'Page Title',
                changeProp: 1,
                }, {
                name: 'data-seo-description',
                label: 'Meta Description',
                type: 'textarea',
                changeProp: 1,
                }
            ]
            }
        ],
        blockManager: {

            
            appendTo: '#blocks',
            blocks: [
                {
                    id: 'section',
                    label: '<b>Section</b>',
                    attributes: { class: 'gjs-block-section' },
                    content: `<section>
                        <h1>This is a simple title</h1>
                        <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
                    </section>`,
                }, {
                    id: 'text',
                    label: 'Text',
                    content: '<div data-gjs-type="text">Insert your text here</div>',
                }, {
                    id: 'image',
                    label: 'Image',
                    select: true,
                    content: { type: 'image' },
                    activate: true,
                }, {
                    id: 'hero-section',
                    label: '<b>Hero Section</b>',
                    category: 'Sections',
                    attributes: { class: 'gjs-block-section' },
                    content: `
                        <div class="container-fluid" style="background-color: #333; color: white; padding: 100px 20px; text-align: center;">
                            <h1 style="font-size: 3.5rem; margin-bottom: 20px;">Your Awesome Headline</h1>
                            <p style="font-size: 1.25rem; margin-bottom: 30px;">A compelling sub-headline to engage your visitors.</p>
                            <a href="#" class="btn btn-primary btn-lg" style="background-color: #007bff; border: none; padding: 15px 30px; font-size: 1.25rem; border-radius: 5px; text-decoration: none; color: white;">Call to Action</a>
                        </div>
                    `,
                }, {
                    id: 'feature-grid',
                    label: '<b>Feature Grid</b>',
                    category: 'Sections',
                    content: `
                        <div class="container py-5">
                            <div class="row">
                                <div class="col-md-6 mb-4">
                                    <h4><i class="fas fa-cogs mr-2"></i> Feature One</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
                                </div>
                                <div class="col-md-6 mb-4">
                                    <h4><i class="fas fa-chart-line mr-2"></i> Feature Two</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
                                </div>
                                <div class="col-md-6 mb-4">
                                    <h4><i class="fas fa-users mr-2"></i> Feature Three</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
                                </div>
                                <div class="col-md-6 mb-4">
                                    <h4><i class="fas fa-shield-alt mr-2"></i> Feature Four</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
                                </div>
                            </div>
                        </div>
                    `
                }, {
                    id: 'testimonial',
                    label: '<b>Testimonial</b>',
                    category: 'Sections',
                    content: `
                        <div class="container py-5 text-center">
                            <img src="https://via.placeholder.com/100" class="rounded-circle mb-3" alt="Client photo">
                            <p class="lead"><em>"This product is absolutely amazing! It has completely changed my workflow for the better. Highly recommended!"</em></p>
                            <footer class="blockquote-footer"><strong>Jane Doe</strong>, CEO at Company Inc.</footer>
                        </div>
                    `
                }, {
                    id: 'footer',
                    label: '<b>Footer</b>',
                    category: 'Sections',
                    content: `
                        <footer class="container-fluid bg-dark text-white mt-5 py-4">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-4">
                                        <h5>WebBuilder Pro</h5>
                                        <p>Create beautiful websites with ease.</p>
                                    </div>
                                    <div class="col-md-4">
                                        <h5>Links</h5>
                                        <ul class="list-unstyled">
                                            <li><a href="#" class="text-white">Home</a></li>
                                            <li><a href="#" class="text-white">Features</a></li>
                                            <li><a href="#" class="text-white">Pricing</a></li>
                                        </ul>
                                    </div>
                                    <div class="col-md-4">
                                        <h5>Contact</h5>
                                        <p>Email: contact@webbuilder.pro</p>
                                        <p>Phone: (123) 456-7890</p>
                                    </div>
                                </div>
                                <div class="text-center mt-3">
                                    <small>Copyright © 2024 WebBuilder Pro</small>
                                </div>
                            </div>
                        </footer>
                    `
                },
                {
                    id: 'navbar',
                    label: '<b>Navbar</b>',
                    category: 'Navigation',
                    attributes: { class: 'gjs-block-section' },
                    content: `
                    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div class="container">
                        <a class="navbar-brand" href="#">MyBrand</a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav ml-auto">
                            <li class="nav-item active"><a class="nav-link" href="#">Home</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Features</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Pricing</a></li>
                            <li class="nav-item"><a class="nav-link disabled" href="#">Disabled</a></li>
                            </ul>
                        </div>
                        </div>
                    </nav>
                    `,
                }
            ],
        },
        // Load bootstrap in canvas
        canvas: {
            styles: ['https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'],
            scripts: ['https://code.jquery.com/jquery-3.5.1.slim.min.js', 'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'],
        },

        assetManager: {
        assets: [
        'https://via.placeholder.com/350x250/78c5d6/fff',
        'https://via.placeholder.com/350x250/459ba8/fff',
        'https://via.placeholder.com/350x250/79c267/fff',
        ],
        upload: false,
        uploadText: 'This is a demo, so remote uploading is not available. You can add image URLs below.',
    }
    });

    // --- COMMANDS ---
    // Device switch commands
    editor.Commands.add('set-device-desktop', { run: editor => editor.setDevice('Desktop') });
    editor.Commands.add('set-device-tablet', { run: editor => editor.setDevice('Tablet') });
    editor.Commands.add('set-device-mobile', { run: editor => editor.setDevice('Mobile') });
    
    // Panel visibility commands
    const hideAll = () => {
        document.getElementById('layers-container').classList.remove('active');
        document.getElementById('style-container').classList.remove('active');
        document.getElementById('trait-container').classList.remove('active');
    };


    // Clear canvas command
    editor.Commands.add('clear-canvas', {
        run: editor => {
            if (confirm('Are you sure you want to clear the canvas?')) {
                editor.getComponents().clear();
                setTimeout(() => localStorage.clear(), 0);
            }
        }
    });

    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const moonIcon = '<i class="fa-solid fa-moon"></i>';
    const sunIcon = '<i class="fa-solid fa-sun"></i>';
    
    const setTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            themeToggle.innerHTML = moonIcon;
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            themeToggle.innerHTML = sunIcon;
            localStorage.setItem('theme', 'dark');
        }
    };

    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.contains('light-theme');
        setTheme(isLight ? 'dark' : 'light');
    });

    // Set initial theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    editor.Commands.add('save-custom-block', {
        run(editor) {
            const selected = editor.getSelected();
            if (!selected) {
                alert('Please select a component first.');
                return;
            }

            const blockName = prompt("Enter a name for your new block:");
            if (!blockName) {
                return;
            }

            editor.BlockManager.add(blockName.replace(/\s+/g, '-').toLowerCase(), {
                label: `<b>${blockName}</b>`,
                category: 'Custom',
                content: selected.toHTML(),
                attributes: { class: 'fa fa-cube' }
            });

            alert(`Block "${blockName}" has been saved! You can find it in the 'Custom' category.`);
        }
    });


    // Set initial active panel
    editor.on('load', () => {
        editor.runCommand('show-layers');
    });

    // --- NEW INTELLIGENT PROPERTIES PANEL LOGIC ---

    // Cache the panel sections
    const traitsSection = document.getElementById('traits-section');
    const styleSection = document.getElementById('style-section');
    const layersSection = document.getElementById('layers-section');

    const updatePanelVisibility = () => {
        const selected = editor.getSelected();
        if (selected) {
            // Show sections relevant to a selected component
            traitsSection.style.display = 'block';
            styleSection.style.display = 'block';
        } else {
            // Show only the layer manager if nothing is selected
            traitsSection.style.display = 'none';
            styleSection.style.display = 'none';
        }
    };

    // Update panels whenever a new component is selected
    editor.on('component:select', () => updatePanelVisibility());
    editor.on('component:deselect', () => updatePanelVisibility());

    // On initial load, update visibility
    editor.on('load', () => {
        updatePanelVisibility();
        // Your other 'load' event code from before, like the indicator, goes here
        const indicator = document.getElementById('responsive-indicator');
        indicator.innerHTML = `Styling: <strong>Desktop</strong>`;
    });

    // Replace the simple switcher button logic with this intelligent one.
    // We are now just controlling which section is *scrolled to*, not hiding/showing panels.
    const sections = {
        'show-layers': layersSection,
        'show-styles': styleSection,
        'show-traits': traitsSection
    };
    const switcherButtons = editor.Panels.getButtons('panel__switcher');
    switcherButtons.forEach(button => {
        button.set('active', 0); // Reset all
        button.on('change:active', () => {
            if(button.get('active')) {
                switcherButtons.forEach(b => b.id !== button.id && b.set('active', 0));
                sections[button.id].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    window.editor = editor;

// ADD THIS ENTIRE SECTION OF CODE INSIDE THE DOMContentLoaded LISTENER

// --- NEW COMMANDS FOR PROJECT SAVE/LOAD ---
editor.Commands.add('save-project', {
    run: editor => {
        const projectName = prompt("Enter a name to save your project:");
        if (!projectName) return;
        
        const data = {
            html: editor.getHtml(),
            css: editor.getCss(),
        };

        localStorage.setItem(`gjsProject-${projectName}`, JSON.stringify(data));
        alert(`Project "${projectName}" saved successfully!`);
    }
});

editor.Commands.add('load-project', {
    run: editor => {
        const projectName = prompt("Enter the name of the project to load:");
        if (!projectName) return;

        const data = localStorage.getItem(`gjsProject-${projectName}`);
        if (!data) {
            alert(`Project "${projectName}" not found!`);
            return;
        }

        const parsedData = JSON.parse(data);
        editor.setComponents(parsedData.html);
        editor.setStyle(parsedData.css);
        alert(`Project "${projectName}" loaded successfully!`);
    }
});


// --- NEW EVENT LISTENERS FOR ADVANCED FEATURES ---

// Add Responsive State Indicator logic
const indicator = document.getElementById('responsive-indicator');
editor.on('device:change', deviceName => {
    indicator.innerHTML = `Styling: <strong>${deviceName}</strong>`;
});


// Add Context (Right-Click) Menu Logic
const contextMenu = document.getElementById('context-menu');
const canvas = editor.Canvas.getElement();

canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    const selected = editor.getSelected();

    if (selected) {
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.display = 'block';
    }
});

// Hide context menu on click
window.addEventListener('click', () => {
    contextMenu.style.display = 'none';
});

// Context menu actions
contextMenu.addEventListener('click', e => {
    const action = e.target.closest('.context-menu-item').dataset.action;
    const selected = editor.getSelected();
    if (!selected) return;

    if (action === 'delete') {
        selected.remove();
    } else if (action === 'clone') {
        editor.select(selected.clone());
    }
    contextMenu.style.display = 'none';
});


// Update the initial responsive indicator on load
editor.on('load', () => {
    indicator.innerHTML = `Styling: <strong>Desktop</strong>`;
});

// --- TEMPLATE MODAL LOGIC ---
const templates = [
    {
        name: 'SaaS Landing Page',
        image: 'https://via.placeholder.com/300x200/4B0082/FFFFFF?text=SaaS+Template',
        html: `<!-- Paste a full HTML structure for a SaaS page here -->
               <div class="container text-center py-5"><h1 class="display-4">The Best SaaS Product</h1><p class="lead">Solve all your problems with our amazing tool.</p><a href="#" class="btn btn-primary btn-lg">Get Started Now</a></div>`
    },
    {
        name: 'Portfolio Page',
        image: 'https://via.placeholder.com/300x200/008080/FFFFFF?text=Portfolio',
        html: `<!-- Paste a full HTML structure for a Portfolio page here -->
               <div class="container text-center py-5"><h1 class="display-4">John Doe - Designer</h1><p class="lead">Check out my amazing work below.</p></div>`
    },
];

const modal = document.getElementById('templates-modal');
const templatesContainer = document.getElementById('templates-container');

// Command to open the modal
editor.Commands.add('open-templates', {
    run: () => {
        templatesContainer.innerHTML = ''; // Clear previous
        templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `<img src="${template.image}" alt="${template.name}"><div class="template-card-name">${template.name}</div>`;
            card.onclick = () => {
                if(confirm(`Are you sure you want to load the "${template.name}" template? This will clear your current canvas.`)) {
                    editor.setComponents(template.html);
                    modal.style.display = 'none';
                }
            };
            templatesContainer.appendChild(card);
        });
        modal.style.display = 'block';
    }
});

// Logic to close the modal
document.getElementById('templates-modal-close').onclick = () => modal.style.display = 'none';
window.onclick = (event) => { if (event.target == modal) { modal.style.display = "none"; } };


const originalContextHandler = contextMenu.onclick;
contextMenu.onclick = (e) => {
    if(originalContextHandler) originalContextHandler(e);
    
    const target = e.target.closest('.context-menu-item');
    if (!target) return;
    const action = target.dataset.action;
    const selected = editor.getSelected();

    if (action === 'move-up' && selected) {
        selected.move(selected.get('index') - 1);
    } else if (action === 'move-down' && selected) {
        selected.move(selected.get('index') + 1);
    }
};

});

