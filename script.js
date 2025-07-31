document.addEventListener('DOMContentLoaded', () => {
    const editor = grapesjs.init({
        container: '#gjs',
        fromElement: true,
        height: '100%',
        width: 'auto',
        storageManager: { type: 'local' },
        plugins: ['grapesjs-preset-webpage', 'gjs-blocks-basic', 'grapesjs-plugin-forms', 'grapesjs-plugin-export'],
        pluginsOpts: {
            'grapesjs-preset-webpage': {
                // ... options for the preset
            },
            'gjs-blocks-basic': { flexGrid: true }
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
                    { id: 'preview', command: 'core:preview', context: 'core:preview', label: '<i class="fas fa-eye"></i>', },
                    { id: 'show-borders', command: 'core:component-outline', label: '<i class="fas fa-vector-square"></i>', },
                    { id: 'undo', command: 'core:undo', label: '<i class="fas fa-undo"></i>', },
                    { id: 'redo', command: 'core:redo', label: '<i class="fas fa-redo"></i>', },
                    { id: 'export', command: 'export-template', label: '<i class="fas fa-file-export"></i>', },
                    { id: 'clear-canvas', command: 'clear-canvas', label: '<i class="fas fa-trash"></i>', },
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
        selectorManager: { appendTo: '#style-container' },
        deviceManager: {
            devices: [
                { name: 'Desktop', width: '' },
                { name: 'Tablet', width: '768px', widthMedia: '992px' },
                { name: 'Mobile', width: '375px', widthMedia: '575px' },
            ]
        },
        // Add custom, pre-styled blocks
        blockManager: {
            appendTo: '#blocks',
            blocks: [
                {
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
                },
                {
                    id: 'pricing-table',
                    label: '<b>Pricing Table</b>',
                    category: 'Sections',
                    content: `
                        <div class="container py-5">
                            <div class="row text-center">
                                <div class="col-lg-4">
                                    <div class="card mb-4 shadow-sm">
                                        <div class="card-header"><h4 class="my-0 font-weight-normal">Free</h4></div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$0 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>10 users included</li><li>2 GB of storage</li><li>Email support</li>
                                            </ul>
                                            <button type="button" class="btn btn-lg btn-block btn-outline-primary">Sign up for free</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="card mb-4 shadow-sm">
                                        <div class="card-header"><h4 class="my-0 font-weight-normal">Pro</h4></div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$15 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>20 users included</li><li>10 GB of storage</li><li>Priority email support</li>
                                            </ul>
                                            <button type="button" class="btn btn-lg btn-block btn-primary">Get started</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="card mb-4 shadow-sm">
                                        <div class="card-header"><h4 class="my-0 font-weight-normal">Enterprise</h4></div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$29 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>30 users included</li><li>15 GB of storage</li><li>Phone and email support</li>
                                            </ul>
                                            <button type="button" class="btn btn-lg btn-block btn-primary">Contact us</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `,
                },
            ]
        },
        // Load bootstrap in canvas
        canvas: {
            styles: ['https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'],
            scripts: ['https://code.jquery.com/jquery-3.5.1.slim.min.js', 'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'],
        },
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

    editor.Commands.add('show-layers', {
        run(editor, sender) {
            sender.set('active', true);
            hideAll();
            document.getElementById('layers-container').classList.add('active');
        },
        stop(editor, sender) { sender.set('active', false); }
    });
    editor.Commands.add('show-styles', {
        run(editor, sender) {
            sender.set('active', true);
            hideAll();
            document.getElementById('style-container').classList.add('active');
        },
        stop(editor, sender) { sender.set('active', false); }
    });
    editor.Commands.add('show-traits', {
        run(editor, sender) {
            sender.set('active', true);
            hideAll();
            document.getElementById('trait-container').classList.add('active');
        },
        stop(editor, sender) { sender.set('active', false); }
    });

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


    // Set initial active panel
    editor.on('load', () => {
        editor.runCommand('show-layers');
    });

    window.editor = editor; // for debugging
});