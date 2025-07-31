/**
 * Enhanced WebBuilder Pro - Block Definitions
 * Modern block definitions with enhanced functionality
 */

// ===== BLOCK CATEGORIES =====
const BLOCK_CATEGORIES = {
  BASIC: 'Basic',
  LAYOUT: 'Layout', 
  CONTENT: 'Content',
  NAVIGATION: 'Navigation',
  FORMS: 'Forms',
  MEDIA: 'Media',
  ECOMMERCE: 'E-commerce',
  CUSTOM: 'Custom'
};

// ===== ENHANCED BLOCK DEFINITIONS =====
const enhancedBlocks = [
  // ===== BASIC BLOCKS =====
  {
    id: 'enhanced-text',
    label: '<i class="fas fa-font"></i><br><b>Rich Text</b>',
    category: BLOCK_CATEGORIES.BASIC,
    attributes: { class: 'gjs-block-basic' },
    content: {
      type: 'text',
      content: 'Edit this text...',
      style: {
        padding: '16px',
        'font-size': '16px',
        'line-height': '1.6'
      },
      traits: [
        {
          type: 'select',
          name: 'tag',
          label: 'Tag',
          options: [
            { value: 'div', name: 'Div' },
            { value: 'p', name: 'Paragraph' },
            { value: 'h1', name: 'Heading 1' },
            { value: 'h2', name: 'Heading 2' },
            { value: 'h3', name: 'Heading 3' },
            { value: 'h4', name: 'Heading 4' },
            { value: 'h5', name: 'Heading 5' },
            { value: 'h6', name: 'Heading 6' },
            { value: 'span', name: 'Span' }
          ]
        }
      ]
    }
  },

  {
    id: 'enhanced-image',
    label: '<i class="fas fa-image"></i><br><b>Smart Image</b>',
    category: BLOCK_CATEGORIES.MEDIA,
    attributes: { class: 'gjs-block-media' },
    content: `
      <picture class="responsive-image">
        <img 
          src="https://via.placeholder.com/800x400/4f46e5/ffffff?text=Smart+Image" 
          alt="Placeholder image"
          loading="lazy"
          style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
        />
      </picture>
    `
  },

  {
    id: 'button-enhanced',
    label: '<i class="fas fa-hand-pointer"></i><br><b>Smart Button</b>',
    category: BLOCK_CATEGORIES.BASIC,
    content: `
      <button class="btn btn-primary enhanced-button" type="button">
        <span class="btn-text">Click Me</span>
        <i class="btn-icon fas fa-arrow-right" aria-hidden="true"></i>
      </button>
      <style>
        .enhanced-button {
          position: relative;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .enhanced-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        .enhanced-button:active {
          transform: translateY(0);
        }
        .enhanced-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .enhanced-button:hover::before {
          left: 100%;
        }
      </style>
    `
  },

  // ===== LAYOUT BLOCKS =====
  {
    id: 'flex-container',
    label: '<i class="fas fa-grip-horizontal"></i><br><b>Flex Container</b>',
    category: BLOCK_CATEGORIES.LAYOUT,
    content: `
      <div class="flex-container" style="
        display: flex;
        gap: 16px;
        padding: 20px;
        border: 2px dashed #e2e8f0;
        border-radius: 8px;
        min-height: 100px;
        align-items: center;
        justify-content: center;
      ">
        <div class="flex-item" style="
          flex: 1;
          padding: 16px;
          background: #f8fafc;
          border-radius: 6px;
          text-align: center;
          border: 1px solid #e2e8f0;
        ">Flex Item 1</div>
        <div class="flex-item" style="
          flex: 1;
          padding: 16px;
          background: #f8fafc;
          border-radius: 6px;
          text-align: center;
          border: 1px solid #e2e8f0;
        ">Flex Item 2</div>
      </div>
    `
  },

  {
    id: 'grid-container',
    label: '<i class="fas fa-th"></i><br><b>CSS Grid</b>',
    category: BLOCK_CATEGORIES.LAYOUT,
    content: `
      <div class="grid-container" style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
        border: 2px dashed #e2e8f0;
        border-radius: 8px;
      ">
        <div class="grid-item" style="
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
        ">Grid Item 1</div>
        <div class="grid-item" style="
          padding: 20px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
        ">Grid Item 2</div>
        <div class="grid-item" style="
          padding: 20px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
        ">Grid Item 3</div>
      </div>
    `
  },

  // ===== CONTENT BLOCKS =====
  {
    id: 'card-modern',
    label: '<i class="fas fa-id-card"></i><br><b>Modern Card</b>',
    category: BLOCK_CATEGORIES.CONTENT,
    content: `
      <article class="modern-card" style="
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        max-width: 400px;
        margin: 20px auto;
      ">
        <div class="card-image" style="
          height: 200px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        ">
          <img src="https://via.placeholder.com/400x200/667eea/ffffff?text=Card+Image" 
               alt="Card image" 
               style="width: 100%; height: 100%; object-fit: cover;"
               loading="lazy" />
        </div>
        <div class="card-content" style="padding: 24px;">
          <h3 style="margin: 0 0 12px 0; font-size: 1.25rem; font-weight: 700; color: #1a202c;">
            Card Title
          </h3>
          <p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.6;">
            This is a modern card component with beautiful styling and hover effects.
          </p>
          <button style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">Learn More</button>
        </div>
      </article>
      <style>
        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .modern-card button:hover {
          transform: scale(1.05);
        }
      </style>
    `
  },

  {
    id: 'testimonial-enhanced',
    label: '<i class="fas fa-quote-left"></i><br><b>Testimonial</b>',
    category: BLOCK_CATEGORIES.CONTENT,
    content: `
      <div class="testimonial-card" style="
        background: white;
        padding: 32px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        text-align: center;
        max-width: 500px;
        margin: 20px auto;
        position: relative;
      ">
        <div class="quote-icon" style="
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        ">
          <i class="fas fa-quote-left"></i>
        </div>
        <blockquote style="
          font-size: 1.125rem;
          font-style: italic;
          color: #4a5568;
          margin: 20px 0;
          line-height: 1.8;
        ">
          "This product has completely transformed how we work. The interface is intuitive and the results are outstanding."
        </blockquote>
        <div class="author-info" style="margin-top: 24px;">
          <img src="https://via.placeholder.com/60x60/667eea/ffffff?text=JD" 
               alt="Author avatar"
               style="
                 width: 60px;
                 height: 60px;
                 border-radius: 50%;
                 margin: 0 auto 12px;
                 display: block;
               " />
          <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #1a202c;">
            Jane Doe
          </h4>
          <p style="margin: 4px 0 0 0; color: #718096; font-size: 0.875rem;">
            CEO, Tech Company
          </p>
        </div>
      </div>
    `
  },

  // ===== NAVIGATION BLOCKS =====
  {
    id: 'navbar-modern',
    label: '<i class="fas fa-bars"></i><br><b>Modern Navbar</b>',
    category: BLOCK_CATEGORIES.NAVIGATION,
    content: `
      <nav class="modern-navbar" style="
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(0,0,0,0.1);
        padding: 16px 0;
        position: sticky;
        top: 0;
        z-index: 1000;
      ">
        <div class="navbar-container" style="
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div class="navbar-brand" style="
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            WebBuilder Pro
          </div>
          <ul class="navbar-nav" style="
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 32px;
          ">
            <li><a href="#" style="
              color: #4a5568;
              text-decoration: none;
              font-weight: 500;
              transition: color 0.3s ease;
              position: relative;
            ">Home</a></li>
            <li><a href="#" style="
              color: #4a5568;
              text-decoration: none;
              font-weight: 500;
              transition: color 0.3s ease;
              position: relative;
            ">Features</a></li>
            <li><a href="#" style="
              color: #4a5568;
              text-decoration: none;
              font-weight: 500;
              transition: color 0.3s ease;
              position: relative;
            ">Pricing</a></li>
            <li><a href="#" style="
              color: #4a5568;
              text-decoration: none;
              font-weight: 500;
              transition: color 0.3s ease;
              position: relative;
            ">Contact</a></li>
          </ul>
          <button class="navbar-toggle" style="
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #4a5568;
            cursor: pointer;
          ">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </nav>
      <style>
        .navbar-nav a:hover {
          color: #667eea !important;
        }
        .navbar-nav a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
        }
        .navbar-nav a:hover::after {
          width: 100%;
          left: 0;
        }
        @media (max-width: 768px) {
          .navbar-nav { display: none; }
          .navbar-toggle { display: block !important; }
        }
      </style>
    `
  },

  // ===== FORM BLOCKS =====
  {
    id: 'contact-form-modern',
    label: '<i class="fas fa-envelope"></i><br><b>Contact Form</b>',
    category: BLOCK_CATEGORIES.FORMS,
    content: `
      <form class="modern-contact-form" style="
        max-width: 600px;
        margin: 40px auto;
        padding: 32px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      ">
        <h2 style="
          text-align: center;
          margin: 0 0 32px 0;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        ">Get In Touch</h2>
        
        <div class="form-group" style="margin-bottom: 24px;">
          <label style="
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2d3748;
          ">Name</label>
          <input type="text" required style="
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
          " placeholder="Your full name" />
        </div>
        
        <div class="form-group" style="margin-bottom: 24px;">
          <label style="
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2d3748;
          ">Email</label>
          <input type="email" required style="
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
          " placeholder="your@email.com" />
        </div>
        
        <div class="form-group" style="margin-bottom: 32px;">
          <label style="
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2d3748;
          ">Message</label>
          <textarea required style="
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease;
            min-height: 120px;
            resize: vertical;
            font-family: inherit;
            box-sizing: border-box;
          " placeholder="Tell us about your project..."></textarea>
        </div>
        
        <button type="submit" style="
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        ">
          Send Message
          <i class="fas fa-paper-plane" style="margin-left: 8px;"></i>
        </button>
      </form>
      <style>
        .modern-contact-form input:focus,
        .modern-contact-form textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .modern-contact-form button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
      </style>
    `
  },

  // ===== HERO SECTIONS =====
  {
    id: 'hero-modern',
    label: '<i class="fas fa-star"></i><br><b>Modern Hero</b>',
    category: BLOCK_CATEGORIES.CONTENT,
    content: `
      <section class="hero-modern" style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 80px 20px;
        position: relative;
        overflow: hidden;
      ">
        <div class="hero-bg-pattern" style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        "></div>
        <div class="hero-content" style="
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        ">
          <h1 style="
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            margin: 0 0 24px 0;
            line-height: 1.2;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            Build Amazing Websites
          </h1>
          <p style="
            font-size: clamp(1.125rem, 2vw, 1.5rem);
            margin: 0 0 40px 0;
            opacity: 0.9;
            line-height: 1.6;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          ">
            Create stunning, responsive websites with our intuitive drag-and-drop builder. No coding required.
          </p>
          <div class="hero-buttons" style="
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          ">
            <button style="
              padding: 16px 32px;
              background: white;
              color: #667eea;
              border: none;
              border-radius: 50px;
              font-size: 1.125rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            ">
              Get Started Free
            </button>
            <button style="
              padding: 16px 32px;
              background: transparent;
              color: white;
              border: 2px solid white;
              border-radius: 50px;
              font-size: 1.125rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
            ">
              Watch Demo
            </button>
          </div>
        </div>
      </section>
      <style>
        .hero-modern button:first-child:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        .hero-modern button:last-child:hover {
          background: white;
          color: #667eea;
        }
      </style>
    `
  }
];

// ===== BLOCK MANAGER CONFIGURATION =====
const configureBlockManager = (editor) => {
  const blockManager = editor.BlockManager;
  
  // Clear existing blocks
  blockManager.getAll().reset();
  
  // Add enhanced blocks
  enhancedBlocks.forEach(block => {
    blockManager.add(block.id, {
      label: block.label,
      category: block.category,
      attributes: block.attributes || { class: 'gjs-block' },
      content: block.content
    });
  });

  // Add custom block category styles
  const style = document.createElement('style');
  style.textContent = `
    .gjs-block-category .gjs-title {
      font-weight: 600;
      color: var(--color-text-primary);
      padding: 12px 8px 8px;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .gjs-block {
      border: 1px solid var(--color-border) !important;
      border-radius: var(--border-radius-md) !important;
      margin-bottom: var(--space-sm) !important;
      transition: all var(--transition-fast) !important;
    }
    
    .gjs-block:hover {
      border-color: var(--color-accent-primary) !important;
      box-shadow: var(--shadow-md) !important;
    }
    
    .gjs-block-label {
      font-size: var(--font-size-xs) !important;
      font-weight: var(--font-weight-medium) !important;
      text-align: center !important;
      padding: var(--space-xs) !important;
    }
  `;
  document.head.appendChild(style);
};

// ===== EXPORT =====
window.WebBuilderBlocks = {
  enhancedBlocks,
  configureBlockManager,
  BLOCK_CATEGORIES
};

