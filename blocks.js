/**
 * Enhanced WebBuilder Pro - Custom Blocks Library
 * Comprehensive block definitions with modern styling and functionality
 */

// Enhanced block definitions for GrapesJS
const enhancedBlocks = [
  // ===== BASIC BLOCKS =====
  {
    id: 'enhanced-text',
    label: 'Rich Text',
    category: 'Basic',
    media: '<i class="fas fa-font"></i>',
    content: {
      type: 'text',
      content: 'Edit this text...',
      style: {
        padding: '16px',
        'font-size': '16px',
        'line-height': '1.6',
        color: '#333',
        'font-family': 'Arial, sans-serif'
      }
    },
    attributes: { class: 'gjs-block-text' }
  },

  {
    id: 'smart-button',
    label: 'Smart Button',
    category: 'Basic',
    media: '<i class="fas fa-hand-pointer"></i>',
    content: `
      <button class="smart-btn" type="button">
        <span class="btn-text">Click Me</span>
        <i class="btn-icon fas fa-arrow-right" aria-hidden="true"></i>
      </button>
      <style>
        .smart-btn {
          position: relative;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          text-decoration: none;
          border: 2px solid transparent;
        }
        .smart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .smart-btn:active {
          transform: translateY(0);
        }
        .smart-btn .btn-icon {
          transition: transform 0.3s ease;
        }
        .smart-btn:hover .btn-icon {
          transform: translateX(4px);
        }
      </style>
    `,
    attributes: { class: 'gjs-block-button' }
  },

  {
    id: 'enhanced-link',
    label: 'Link',
    category: 'Basic',
    media: '<i class="fas fa-link"></i>',
    content: {
      type: 'link',
      content: 'Link Text',
      attributes: { href: '#' },
      style: {
        color: '#6366f1',
        'text-decoration': 'none',
        'font-weight': '500',
        transition: 'all 0.2s ease'
      }
    },
    attributes: { class: 'gjs-block-link' }
  },

  // ===== MEDIA BLOCKS =====
  {
    id: 'enhanced-image',
    label: 'Smart Image',
    category: 'Media',
    media: '<i class="fas fa-image"></i>',
    content: `
      <div class="smart-image-container">
        <img 
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Smart image placeholder"
          class="smart-image"
          loading="lazy"
        />
        <div class="image-overlay">
          <div class="overlay-content">
            <h3>Image Title</h3>
            <p>Add your description here</p>
          </div>
        </div>
      </div>
      <style>
        .smart-image-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .smart-image-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        .smart-image {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }
        .smart-image-container:hover .smart-image {
          transform: scale(1.05);
        }
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: white;
          padding: 20px;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        .smart-image-container:hover .image-overlay {
          transform: translateY(0);
        }
        .overlay-content h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }
        .overlay-content p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }
      </style>
    `,
    attributes: { class: 'gjs-block-image' }
  },

  {
    id: 'enhanced-video',
    label: 'Video',
    category: 'Media',
    media: '<i class="fas fa-video"></i>',
    content: {
      type: 'video',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      style: {
        'max-width': '100%',
        height: 'auto',
        'border-radius': '8px'
      }
    },
    attributes: { class: 'gjs-block-video' }
  },

  // ===== LAYOUT BLOCKS =====
  {
    id: 'flex-container',
    label: 'Flex Container',
    category: 'Layout',
    media: '<i class="fas fa-grip-horizontal"></i>',
    content: `
      <div class="flex-container">
        <div class="flex-item">Item 1</div>
        <div class="flex-item">Item 2</div>
        <div class="flex-item">Item 3</div>
      </div>
      <style>
        .flex-container {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 2px dashed #cbd5e0;
          min-height: 120px;
          align-items: center;
          justify-content: space-between;
        }
        .flex-item {
          flex: 1;
          padding: 16px;
          background: white;
          border-radius: 6px;
          text-align: center;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        .flex-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
      </style>
    `,
    attributes: { class: 'gjs-block-layout' }
  },

  {
    id: 'grid-container',
    label: 'Grid Layout',
    category: 'Layout',
    media: '<i class="fas fa-th"></i>',
    content: `
      <div class="grid-container">
        <div class="grid-item">1</div>
        <div class="grid-item">2</div>
        <div class="grid-item">3</div>
        <div class="grid-item">4</div>
      </div>
      <style>
        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 2px dashed #cbd5e0;
        }
        .grid-item {
          padding: 20px;
          background: white;
          border-radius: 6px;
          text-align: center;
          border: 1px solid #e2e8f0;
          font-weight: 600;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
          transition: all 0.2s ease;
        }
        .grid-item:hover {
          background: #6366f1;
          color: white;
          transform: scale(1.05);
        }
      </style>
    `,
    attributes: { class: 'gjs-block-layout' }
  },

  // ===== CONTENT BLOCKS =====
  {
    id: 'hero-section',
    label: 'Hero Section',
    category: 'Content',
    media: '<i class="fas fa-star"></i>',
    content: `
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Amazing Hero Title</h1>
          <p class="hero-subtitle">Create stunning websites with our powerful drag-and-drop builder</p>
          <div class="hero-actions">
            <button class="hero-btn hero-btn-primary">Get Started</button>
            <button class="hero-btn hero-btn-secondary">Learn More</button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-shape"></div>
        </div>
      </section>
      <style>
        .hero-section {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 80px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          margin: 20px 0;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
          margin: 0 auto;
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          font-size: 16px;
        }
        .hero-btn-primary {
          background: white;
          color: #6366f1;
          border-color: white;
        }
        .hero-btn-primary:hover {
          background: transparent;
          color: white;
          border-color: white;
        }
        .hero-btn-secondary {
          background: transparent;
          color: white;
          border-color: rgba(255,255,255,0.5);
        }
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: white;
        }
        .hero-visual {
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          opacity: 0.1;
        }
        .hero-shape {
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      </style>
    `,
    attributes: { class: 'gjs-block-content' }
  },

  {
    id: 'card-component',
    label: 'Card',
    category: 'Content',
    media: '<i class="fas fa-id-card"></i>',
    content: `
      <div class="card-component">
        <div class="card-image">
          <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Card image" />
        </div>
        <div class="card-content">
          <h3 class="card-title">Card Title</h3>
          <p class="card-description">This is a beautiful card component with hover effects and modern styling.</p>
          <button class="card-button">Read More</button>
        </div>
      </div>
      <style>
        .card-component {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 350px;
          margin: 20px auto;
        }
        .card-component:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .card-image {
          position: relative;
          overflow: hidden;
          height: 200px;
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .card-component:hover .card-image img {
          transform: scale(1.1);
        }
        .card-content {
          padding: 24px;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1a202c;
        }
        .card-description {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .card-button {
          background: #6366f1;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .card-button:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }
      </style>
    `,
    attributes: { class: 'gjs-block-content' }
  },

  // ===== NAVIGATION BLOCKS =====
  {
    id: 'modern-navbar',
    label: 'Modern Navbar',
    category: 'Navigation',
    media: '<i class="fas fa-bars"></i>',
    content: `
      <nav class="modern-navbar">
        <div class="navbar-container">
          <div class="navbar-brand">
            <span class="brand-logo">🚀</span>
            <span class="brand-text">Brand</span>
          </div>
          <div class="navbar-menu">
            <a href="#" class="navbar-link">Home</a>
            <a href="#" class="navbar-link">About</a>
            <a href="#" class="navbar-link">Services</a>
            <a href="#" class="navbar-link">Contact</a>
          </div>
          <div class="navbar-actions">
            <button class="navbar-btn">Sign In</button>
            <button class="navbar-btn navbar-btn-primary">Sign Up</button>
          </div>
          <button class="navbar-toggle">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <style>
        .modern-navbar {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 1.25rem;
          color: #1a202c;
        }
        .brand-logo {
          font-size: 1.5rem;
        }
        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .navbar-link {
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
          position: relative;
        }
        .navbar-link:hover {
          color: #6366f1;
        }
        .navbar-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #6366f1;
          transition: width 0.3s ease;
        }
        .navbar-link:hover::after {
          width: 100%;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .navbar-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
          background: transparent;
          color: #4a5568;
        }
        .navbar-btn:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }
        .navbar-btn-primary {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }
        .navbar-btn-primary:hover {
          background: #5a67d8;
          border-color: #5a67d8;
        }
        .navbar-toggle {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .navbar-toggle span {
          width: 20px;
          height: 2px;
          background: #4a5568;
          margin: 2px 0;
          transition: 0.3s;
        }
        @media (max-width: 768px) {
          .navbar-menu,
          .navbar-actions {
            display: none;
          }
          .navbar-toggle {
            display: flex;
          }
        }
      </style>
    `,
    attributes: { class: 'gjs-block-navigation' }
  },

  // ===== FORM BLOCKS =====
  {
    id: 'contact-form',
    label: 'Contact Form',
    category: 'Forms',
    media: '<i class="fas fa-envelope"></i>',
    content: `
      <form class="contact-form">
        <div class="form-header">
          <h3>Get in Touch</h3>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
        </div>
        <div class="form-group">
          <label for="subject">Subject</label>
          <input type="text" id="subject" name="subject" required>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button type="submit" class="form-submit">Send Message</button>
      </form>
      <style>
        .contact-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 32px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .form-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
        }
        .form-header p {
          color: #4a5568;
          line-height: 1.6;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .form-submit {
          width: 100%;
          padding: 12px 24px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .form-submit:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `,
    attributes: { class: 'gjs-block-form' }
  }
];

// Function to load enhanced blocks into GrapesJS
function loadEnhancedBlocks(editor) {
  const blockManager = editor.BlockManager;
  
  // Clear existing blocks
  blockManager.getAll().reset();
  
  // Add enhanced blocks
  enhancedBlocks.forEach(block => {
    blockManager.add(block.id, block);
  });
  
  console.log('Enhanced blocks loaded successfully');
}

