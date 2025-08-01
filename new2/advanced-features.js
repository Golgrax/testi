/**
 * Advanced WebBuilder Pro Features
 * Additional functionality and modern features
 */

// ===== ADVANCED TEMPLATE SYSTEM =====
class AdvancedTemplateManager {
  constructor(editor) {
    this.editor = editor;
    this.templates = new Map();
    this.init();
  }

  init() {
    this.loadPredefinedTemplates();
    this.setupTemplateCommands();
  }

  loadPredefinedTemplates() {
    const templates = [
      {
        id: 'landing-page',
        name: 'Modern Landing Page',
        category: 'Business',
        preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TGFuZGluZzwvdGV4dD4KPC9zdmc+',
        html: `
          <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <header style="padding: 20px; display: flex; justify-content: space-between; align-items: center; color: white;">
              <div style="font-size: 24px; font-weight: bold;">Brand</div>
              <nav style="display: flex; gap: 30px;">
                <a href="#" style="color: white; text-decoration: none;">Home</a>
                <a href="#" style="color: white; text-decoration: none;">About</a>
                <a href="#" style="color: white; text-decoration: none;">Services</a>
                <a href="#" style="color: white; text-decoration: none;">Contact</a>
              </nav>
            </header>
            <section style="text-align: center; padding: 100px 20px; color: white;">
              <h1 style="font-size: 48px; margin-bottom: 20px; font-weight: bold;">Welcome to Our Platform</h1>
              <p style="font-size: 20px; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
                Create amazing experiences with our cutting-edge technology and innovative solutions.
              </p>
              <button style="background: white; color: #667eea; border: none; padding: 15px 40px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer;">
                Get Started
              </button>
            </section>
          </div>
        `,
        css: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; }
          button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); transition: all 0.3s ease; }
        `
      },
      {
        id: 'portfolio',
        name: 'Creative Portfolio',
        category: 'Portfolio',
        preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMjEyMTIxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UG9ydGZvbGlvPC90ZXh0Pgo8L3N2Zz4=',
        html: `
          <div style="background: #212121; color: white; min-height: 100vh;">
            <nav style="padding: 20px; display: flex; justify-content: center; gap: 40px; border-bottom: 1px solid #333;">
              <a href="#" style="color: white; text-decoration: none; font-weight: 500;">Work</a>
              <a href="#" style="color: white; text-decoration: none; font-weight: 500;">About</a>
              <a href="#" style="color: white; text-decoration: none; font-weight: 500;">Contact</a>
            </nav>
            <section style="text-align: center; padding: 80px 20px;">
              <h1 style="font-size: 64px; margin-bottom: 20px; font-weight: 300;">John Doe</h1>
              <p style="font-size: 24px; color: #888; margin-bottom: 60px;">Creative Designer & Developer</p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto;">
                <div style="background: #333; padding: 40px; border-radius: 10px;">
                  <h3 style="margin-bottom: 15px;">Project One</h3>
                  <p style="color: #888;">Modern web application with cutting-edge design.</p>
                </div>
                <div style="background: #333; padding: 40px; border-radius: 10px;">
                  <h3 style="margin-bottom: 15px;">Project Two</h3>
                  <p style="color: #888;">Mobile-first responsive design solution.</p>
                </div>
                <div style="background: #333; padding: 40px; border-radius: 10px;">
                  <h3 style="margin-bottom: 15px;">Project Three</h3>
                  <p style="color: #888;">Brand identity and visual design system.</p>
                </div>
              </div>
            </section>
          </div>
        `,
        css: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; }
          .project-card:hover { transform: translateY(-5px); transition: all 0.3s ease; }
        `
      },
      {
        id: 'blog',
        name: 'Modern Blog',
        category: 'Content',
        preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZjdmYWZjIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CbG9nPC90ZXh0Pgo8L3N2Zz4=',
        html: `
          <div style="background: #f7fafc; min-height: 100vh;">
            <header style="background: white; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                <h1 style="font-size: 28px; font-weight: bold; color: #2d3748;">My Blog</h1>
                <nav style="display: flex; gap: 30px;">
                  <a href="#" style="color: #4a5568; text-decoration: none;">Home</a>
                  <a href="#" style="color: #4a5568; text-decoration: none;">Articles</a>
                  <a href="#" style="color: #4a5568; text-decoration: none;">About</a>
                </nav>
              </div>
            </header>
            <main style="max-width: 800px; margin: 60px auto; padding: 0 20px;">
              <article style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 30px;">
                <h2 style="font-size: 32px; margin-bottom: 15px; color: #2d3748;">Getting Started with Modern Web Development</h2>
                <p style="color: #718096; margin-bottom: 20px;">Published on March 15, 2024</p>
                <p style="line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
                  Learn the fundamentals of modern web development with the latest tools and technologies. 
                  This comprehensive guide will take you through everything you need to know.
                </p>
                <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">Read more →</a>
              </article>
              <article style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="font-size: 32px; margin-bottom: 15px; color: #2d3748;">The Future of User Interface Design</h2>
                <p style="color: #718096; margin-bottom: 20px;">Published on March 10, 2024</p>
                <p style="line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
                  Explore the latest trends and innovations in UI design that are shaping the digital landscape. 
                  From micro-interactions to voice interfaces.
                </p>
                <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">Read more →</a>
              </article>
            </main>
          </div>
        `,
        css: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; }
          article:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); transition: all 0.3s ease; }
        `
      },
      {
        id: 'ecommerce',
        name: 'E-commerce Store',
        category: 'E-commerce',
        preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZmZmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaG9wPC90ZXh0Pgo8L3N2Zz4=',
        html: `
          <div style="background: white; min-height: 100vh;">
            <header style="background: #2d3748; color: white; padding: 15px 0;">
              <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
                <h1 style="font-size: 24px; font-weight: bold;">ShopPro</h1>
                <div style="display: flex; gap: 20px; align-items: center;">
                  <input type="text" placeholder="Search products..." style="padding: 8px 15px; border: none; border-radius: 20px; width: 250px;">
                  <div style="display: flex; gap: 15px;">
                    <span>🛒 Cart (0)</span>
                    <span>👤 Account</span>
                  </div>
                </div>
              </div>
            </header>
            <nav style="background: #4a5568; padding: 10px 0;">
              <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; gap: 30px;">
                <a href="#" style="color: white; text-decoration: none;">Electronics</a>
                <a href="#" style="color: white; text-decoration: none;">Clothing</a>
                <a href="#" style="color: white; text-decoration: none;">Home & Garden</a>
                <a href="#" style="color: white; text-decoration: none;">Sports</a>
              </div>
            </nav>
            <main style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
              <section style="margin-bottom: 50px;">
                <h2 style="font-size: 32px; margin-bottom: 30px; color: #2d3748;">Featured Products</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                  <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="height: 200px; background: #f7fafc; display: flex; align-items: center; justify-content: center; color: #a0aec0;">
                      Product Image
                    </div>
                    <div style="padding: 20px;">
                      <h3 style="font-size: 18px; margin-bottom: 10px; color: #2d3748;">Premium Headphones</h3>
                      <p style="color: #718096; margin-bottom: 15px;">High-quality wireless headphones with noise cancellation.</p>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 20px; font-weight: bold; color: #667eea;">$199.99</span>
                        <button style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                  <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="height: 200px; background: #f7fafc; display: flex; align-items: center; justify-content: center; color: #a0aec0;">
                      Product Image
                    </div>
                    <div style="padding: 20px;">
                      <h3 style="font-size: 18px; margin-bottom: 10px; color: #2d3748;">Smart Watch</h3>
                      <p style="color: #718096; margin-bottom: 15px;">Advanced fitness tracking and smart notifications.</p>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 20px; font-weight: bold; color: #667eea;">$299.99</span>
                        <button style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        `,
        css: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; }
          .product-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); transition: all 0.3s ease; }
          button:hover { background: #5a67d8; transition: all 0.2s ease; }
        `
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  setupTemplateCommands() {
    this.editor.Commands.add('open-templates', {
      run: () => this.showTemplateModal()
    });

    this.editor.Commands.add('apply-template', {
      run: (editor, sender, options) => {
        const template = this.templates.get(options.templateId);
        if (template) {
          this.applyTemplate(template);
        }
      }
    });
  }

  showTemplateModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop show';
    modal.innerHTML = `
      <div class="modal show" style="width: 80%; max-width: 1000px;">
        <div class="modal-header">
          <h2 class="modal-title">Choose a Template</h2>
          <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="template-categories" style="
            display: flex;
            gap: var(--space-sm);
            margin-bottom: var(--space-lg);
            border-bottom: 1px solid var(--color-border);
            padding-bottom: var(--space-md);
          ">
            <button class="btn btn-ghost btn-sm category-filter active" data-category="all">All</button>
            <button class="btn btn-ghost btn-sm category-filter" data-category="Business">Business</button>
            <button class="btn btn-ghost btn-sm category-filter" data-category="Portfolio">Portfolio</button>
            <button class="btn btn-ghost btn-sm category-filter" data-category="Content">Content</button>
            <button class="btn btn-ghost btn-sm category-filter" data-category="E-commerce">E-commerce</button>
          </div>
          <div class="templates-grid" style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: var(--space-lg);
          ">
            ${Array.from(this.templates.values()).map(template => `
              <div class="template-card card" data-category="${template.category}" style="
                cursor: pointer;
                transition: var(--transition);
              " onclick="templateManager.applyTemplate('${template.id}'); this.closest('.modal-backdrop').remove();">
                <div style="
                  height: 150px;
                  background-image: url('${template.preview}');
                  background-size: cover;
                  background-position: center;
                  border-radius: var(--radius-md) var(--radius-md) 0 0;
                "></div>
                <div class="card-body">
                  <h3 style="margin-bottom: var(--space-xs);">${template.name}</h3>
                  <p style="
                    color: var(--color-text-muted);
                    font-size: var(--font-size-sm);
                    margin-bottom: var(--space-sm);
                  ">${template.category}</p>
                  <button class="btn btn-primary btn-sm" style="width: 100%;">
                    Use Template
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Add category filtering
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-filter')) {
        const category = e.target.dataset.category;
        
        // Update active button
        modal.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter templates
        modal.querySelectorAll('.template-card').forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });

    document.body.appendChild(modal);
  }

  applyTemplate(templateId) {
    const template = typeof templateId === 'string' ? this.templates.get(templateId) : templateId;
    if (!template) return;

    // Clear current content
    this.editor.setComponents('');
    this.editor.setStyle('');

    // Apply template
    this.editor.setComponents(template.html);
    this.editor.setStyle(template.css);

    // Show success notification
    if (window.enhancedUI) {
      window.enhancedUI.showNotification(`Applied template: ${template.name}`, 'success');
    }
  }
}

// ===== ADVANCED COMPONENT LIBRARY =====
class AdvancedComponentLibrary {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }

  init() {
    this.addAdvancedComponents();
  }

  addAdvancedComponents() {
    const blockManager = this.editor.BlockManager;

    // Hero Section Component
    blockManager.add('hero-section', {
      label: 'Hero Section',
      category: 'Advanced',
      content: `
        <section class="hero-section" style="
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          padding: 2rem;
        ">
          <div class="hero-content" style="max-width: 800px;">
            <h1 style="font-size: 3.5rem; font-weight: bold; margin-bottom: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              Your Amazing Headline
            </h1>
            <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
              Craft compelling copy that resonates with your audience and drives action.
            </p>
            <div class="hero-buttons" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button style="
                background: white;
                color: #667eea;
                border: none;
                padding: 1rem 2rem;
                border-radius: 2rem;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
              ">Get Started</button>
              <button style="
                background: transparent;
                color: white;
                border: 2px solid white;
                padding: 1rem 2rem;
                border-radius: 2rem;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
              ">Learn More</button>
            </div>
          </div>
        </section>
      `,
      attributes: { class: 'fa fa-star' }
    });

    // Feature Cards Component
    blockManager.add('feature-cards', {
      label: 'Feature Cards',
      category: 'Advanced',
      content: `
        <section class="features-section" style="padding: 4rem 2rem; background: #f8fafc;">
          <div class="container" style="max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #2d3748;">
              Amazing Features
            </h2>
            <div class="features-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 2rem;
            ">
              <div class="feature-card" style="
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
                transition: all 0.3s ease;
              ">
                <div style="
                  width: 4rem;
                  height: 4rem;
                  background: #667eea;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 1.5rem;
                  color: white;
                  font-size: 1.5rem;
                ">🚀</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #2d3748;">Fast Performance</h3>
                <p style="color: #718096; line-height: 1.6;">
                  Lightning-fast loading times and optimized performance for the best user experience.
                </p>
              </div>
              <div class="feature-card" style="
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
                transition: all 0.3s ease;
              ">
                <div style="
                  width: 4rem;
                  height: 4rem;
                  background: #48bb78;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 1.5rem;
                  color: white;
                  font-size: 1.5rem;
                ">🔒</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #2d3748;">Secure & Reliable</h3>
                <p style="color: #718096; line-height: 1.6;">
                  Enterprise-grade security with 99.9% uptime guarantee and data protection.
                </p>
              </div>
              <div class="feature-card" style="
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
                transition: all 0.3s ease;
              ">
                <div style="
                  width: 4rem;
                  height: 4rem;
                  background: #ed8936;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 1.5rem;
                  color: white;
                  font-size: 1.5rem;
                ">⚡</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #2d3748;">Easy to Use</h3>
                <p style="color: #718096; line-height: 1.6;">
                  Intuitive interface designed for both beginners and professionals.
                </p>
              </div>
            </div>
          </div>
        </section>
      `,
      attributes: { class: 'fa fa-th-large' }
    });

    // Testimonials Component
    blockManager.add('testimonials', {
      label: 'Testimonials',
      category: 'Advanced',
      content: `
        <section class="testimonials-section" style="padding: 4rem 2rem; background: #2d3748; color: white;">
          <div class="container" style="max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem;">
              What Our Customers Say
            </h2>
            <div class="testimonials-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
              gap: 2rem;
            ">
              <div class="testimonial-card" style="
                background: #4a5568;
                padding: 2rem;
                border-radius: 1rem;
                position: relative;
              ">
                <div style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;">"</div>
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  This platform has completely transformed how we work. The intuitive design and powerful features make it a joy to use every day.
                </p>
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="
                    width: 3rem;
                    height: 3rem;
                    background: #667eea;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                  ">JS</div>
                  <div>
                    <div style="font-weight: bold;">Jane Smith</div>
                    <div style="color: #a0aec0; font-size: 0.9rem;">CEO, TechCorp</div>
                  </div>
                </div>
              </div>
              <div class="testimonial-card" style="
                background: #4a5568;
                padding: 2rem;
                border-radius: 1rem;
                position: relative;
              ">
                <div style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;">"</div>
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  Outstanding support and incredible results. We've seen a 300% increase in productivity since switching to this solution.
                </p>
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="
                    width: 3rem;
                    height: 3rem;
                    background: #48bb78;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                  ">MD</div>
                  <div>
                    <div style="font-weight: bold;">Mike Davis</div>
                    <div style="color: #a0aec0; font-size: 0.9rem;">CTO, StartupXYZ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `,
      attributes: { class: 'fa fa-quote-left' }
    });

    // Contact Form Component
    blockManager.add('contact-form', {
      label: 'Contact Form',
      category: 'Advanced',
      content: `
        <section class="contact-section" style="padding: 4rem 2rem; background: #f8fafc;">
          <div class="container" style="max-width: 800px; margin: 0 auto;">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 1rem; color: #2d3748;">
              Get In Touch
            </h2>
            <p style="text-align: center; color: #718096; margin-bottom: 3rem; font-size: 1.1rem;">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <form class="contact-form" style="
              background: white;
              padding: 2.5rem;
              border-radius: 1rem;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            ">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2d3748;">First Name</label>
                  <input type="text" style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                  " placeholder="John">
                </div>
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2d3748;">Last Name</label>
                  <input type="text" style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                  " placeholder="Doe">
                </div>
              </div>
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2d3748;">Email</label>
                <input type="email" style="
                  width: 100%;
                  padding: 0.75rem;
                  border: 2px solid #e2e8f0;
                  border-radius: 0.5rem;
                  font-size: 1rem;
                  transition: all 0.2s ease;
                " placeholder="john@example.com">
              </div>
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2d3748;">Subject</label>
                <input type="text" style="
                  width: 100%;
                  padding: 0.75rem;
                  border: 2px solid #e2e8f0;
                  border-radius: 0.5rem;
                  font-size: 1rem;
                  transition: all 0.2s ease;
                " placeholder="How can we help?">
              </div>
              <div style="margin-bottom: 2rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2d3748;">Message</label>
                <textarea style="
                  width: 100%;
                  padding: 0.75rem;
                  border: 2px solid #e2e8f0;
                  border-radius: 0.5rem;
                  font-size: 1rem;
                  min-height: 120px;
                  resize: vertical;
                  transition: all 0.2s ease;
                " placeholder="Tell us more about your project..."></textarea>
              </div>
              <button type="submit" style="
                width: 100%;
                background: #667eea;
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 0.5rem;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
              ">Send Message</button>
            </form>
          </div>
        </section>
      `,
      attributes: { class: 'fa fa-envelope' }
    });

    // Pricing Table Component
    blockManager.add('pricing-table', {
      label: 'Pricing Table',
      category: 'Advanced',
      content: `
        <section class="pricing-section" style="padding: 4rem 2rem; background: white;">
          <div class="container" style="max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 1rem; color: #2d3748;">
              Choose Your Plan
            </h2>
            <p style="text-align: center; color: #718096; margin-bottom: 3rem; font-size: 1.1rem;">
              Select the perfect plan for your needs. Upgrade or downgrade at any time.
            </p>
            <div class="pricing-grid" style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 2rem;
              max-width: 900px;
              margin: 0 auto;
            ">
              <div class="pricing-card" style="
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 1rem;
                padding: 2rem;
                text-align: center;
                position: relative;
                transition: all 0.3s ease;
              ">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #2d3748;">Starter</h3>
                <div style="margin-bottom: 2rem;">
                  <span style="font-size: 3rem; font-weight: bold; color: #2d3748;">$9</span>
                  <span style="color: #718096;">/month</span>
                </div>
                <ul style="list-style: none; margin-bottom: 2rem; text-align: left;">
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ 5 Projects</li>
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ 10GB Storage</li>
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ Email Support</li>
                  <li style="padding: 0.5rem 0; color: #a0aec0;">✗ Priority Support</li>
                </ul>
                <button style="
                  width: 100%;
                  background: #667eea;
                  color: white;
                  border: none;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">Get Started</button>
              </div>
              <div class="pricing-card" style="
                background: white;
                border: 2px solid #667eea;
                border-radius: 1rem;
                padding: 2rem;
                text-align: center;
                position: relative;
                transition: all 0.3s ease;
                transform: scale(1.05);
              ">
                <div style="
                  position: absolute;
                  top: -10px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: #667eea;
                  color: white;
                  padding: 0.5rem 1rem;
                  border-radius: 1rem;
                  font-size: 0.8rem;
                  font-weight: bold;
                ">POPULAR</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #2d3748;">Professional</h3>
                <div style="margin-bottom: 2rem;">
                  <span style="font-size: 3rem; font-weight: bold; color: #2d3748;">$29</span>
                  <span style="color: #718096;">/month</span>
                </div>
                <ul style="list-style: none; margin-bottom: 2rem; text-align: left;">
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ 25 Projects</li>
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ 100GB Storage</li>
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ Priority Support</li>
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ Advanced Features</li>
                </ul>
                <button style="
                  width: 100%;
                  background: #667eea;
                  color: white;
                  border: none;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">Get Started</button>
              </div>
              <div class="pricing-card" style="
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 1rem;
                padding: 2rem;
                text-align: center;
                position: relative;
                transition: all 0.3s ease;
              ">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #2d3748;">Enterprise</h3>
                <div style="margin-bottom: 2rem;">
                  <span style="font-size: 3rem; font-weight: bold; color: #2d3748;">$99</span>
                  <span style="color: #718096;">/month</span>
                </div>
                <ul style="list-style: none; margin-bottom: 2rem; text-align: left;">
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ Unlimited Projects</li>
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ 1TB Storage</li>
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ 24/7 Support</li>
                  <li style="padding: 0.5rem 0; color: #4a5568;">✓ Custom Integrations</li>
                </ul>
                <button style="
                  width: 100%;
                  background: #667eea;
                  color: white;
                  border: none;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s ease;
                ">Get Started</button>
              </div>
            </div>
          </div>
        </section>
      `,
      attributes: { class: 'fa fa-dollar-sign' }
    });
  }
}

// ===== ADVANCED ANIMATION SYSTEM =====
class AdvancedAnimationSystem {
  constructor(editor) {
    this.editor = editor;
    this.init();
  }

  init() {
    this.addAnimationTraits();
    this.setupAnimationCommands();
  }

  addAnimationTraits() {
    this.editor.TraitManager.addType('animation-select', {
      createInput({ trait }) {
        const el = document.createElement('select');
        el.className = 'form-input';
        
        const animations = [
          { value: '', label: 'No Animation' },
          { value: 'fadeIn', label: 'Fade In' },
          { value: 'fadeInUp', label: 'Fade In Up' },
          { value: 'fadeInDown', label: 'Fade In Down' },
          { value: 'fadeInLeft', label: 'Fade In Left' },
          { value: 'fadeInRight', label: 'Fade In Right' },
          { value: 'slideInUp', label: 'Slide In Up' },
          { value: 'slideInDown', label: 'Slide In Down' },
          { value: 'slideInLeft', label: 'Slide In Left' },
          { value: 'slideInRight', label: 'Slide In Right' },
          { value: 'zoomIn', label: 'Zoom In' },
          { value: 'zoomInUp', label: 'Zoom In Up' },
          { value: 'bounceIn', label: 'Bounce In' },
          { value: 'rotateIn', label: 'Rotate In' },
          { value: 'flipInX', label: 'Flip In X' },
          { value: 'flipInY', label: 'Flip In Y' }
        ];

        animations.forEach(anim => {
          const option = document.createElement('option');
          option.value = anim.value;
          option.textContent = anim.label;
          el.appendChild(option);
        });

        return el;
      },

      onUpdate({ elInput, component }) {
        const animation = elInput.value;
        if (animation) {
          component.addAttributes({
            'data-animation': animation,
            'data-animation-delay': '0s',
            'data-animation-duration': '1s'
          });
          
          // Add animation CSS if not already present
          this.addAnimationCSS();
        } else {
          component.removeAttributes(['data-animation', 'data-animation-delay', 'data-animation-duration']);
        }
      }
    });

    // Add animation traits to all components
    this.editor.DomComponents.addType('default', {
      model: {
        defaults: {
          traits: [
            {
              type: 'animation-select',
              name: 'data-animation',
              label: 'Animation'
            },
            {
              type: 'number',
              name: 'data-animation-delay',
              label: 'Delay (s)',
              min: 0,
              max: 10,
              step: 0.1
            },
            {
              type: 'number',
              name: 'data-animation-duration',
              label: 'Duration (s)',
              min: 0.1,
              max: 5,
              step: 0.1
            }
          ]
        }
      }
    });
  }

  addAnimationCSS() {
    const css = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes slideInUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
      
      @keyframes slideInDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
      
      @keyframes slideInLeft {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      
      @keyframes zoomIn {
        from { opacity: 0; transform: scale(0.3); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes zoomInUp {
        from { opacity: 0; transform: scale(0.1) translateY(1000px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      
      @keyframes bounceIn {
        0%, 20%, 40%, 60%, 80%, 100% { animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000); }
        0% { opacity: 0; transform: scale3d(.3, .3, .3); }
        20% { transform: scale3d(1.1, 1.1, 1.1); }
        40% { transform: scale3d(.9, .9, .9); }
        60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }
        80% { transform: scale3d(.97, .97, .97); }
        100% { opacity: 1; transform: scale3d(1, 1, 1); }
      }
      
      @keyframes rotateIn {
        from { transform-origin: center; transform: rotate3d(0, 0, 1, -200deg); opacity: 0; }
        to { transform-origin: center; transform: translate3d(0, 0, 0); opacity: 1; }
      }
      
      @keyframes flipInX {
        from { transform: perspective(400px) rotate3d(1, 0, 0, 90deg); opacity: 0; }
        40% { transform: perspective(400px) rotate3d(1, 0, 0, -20deg); }
        60% { transform: perspective(400px) rotate3d(1, 0, 0, 10deg); opacity: 1; }
        80% { transform: perspective(400px) rotate3d(1, 0, 0, -5deg); }
        to { transform: perspective(400px); }
      }
      
      @keyframes flipInY {
        from { transform: perspective(400px) rotate3d(0, 1, 0, 90deg); opacity: 0; }
        40% { transform: perspective(400px) rotate3d(0, 1, 0, -20deg); }
        60% { transform: perspective(400px) rotate3d(0, 1, 0, 10deg); opacity: 1; }
        80% { transform: perspective(400px) rotate3d(0, 1, 0, -5deg); }
        to { transform: perspective(400px); }
      }
      
      [data-animation] {
        opacity: 0;
      }
      
      [data-animation].animate {
        opacity: 1;
        animation-fill-mode: both;
      }
    `;

    // Add CSS to the editor
    const existingCSS = this.editor.getCss();
    if (!existingCSS.includes('@keyframes fadeIn')) {
      this.editor.setStyle(existingCSS + css);
    }
  }

  setupAnimationCommands() {
    this.editor.Commands.add('preview-animations', {
      run: () => {
        this.triggerAnimations();
      }
    });
  }

  triggerAnimations() {
    const canvas = this.editor.Canvas.getDocument();
    const animatedElements = canvas.querySelectorAll('[data-animation]');
    
    animatedElements.forEach((el, index) => {
      const animation = el.getAttribute('data-animation');
      const delay = parseFloat(el.getAttribute('data-animation-delay') || '0');
      const duration = parseFloat(el.getAttribute('data-animation-duration') || '1');
      
      if (animation) {
        setTimeout(() => {
          el.style.animationName = animation;
          el.style.animationDuration = `${duration}s`;
          el.style.animationDelay = `${delay}s`;
          el.classList.add('animate');
        }, index * 100); // Stagger animations
      }
    });
  }
}

// ===== INITIALIZE ADVANCED FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
  // Wait for the main app to initialize
  const checkForEditor = () => {
    if (window.app && window.app.editor) {
      // Initialize advanced features
      window.templateManager = new AdvancedTemplateManager(window.app.editor);
      window.componentLibrary = new AdvancedComponentLibrary(window.app.editor);
      window.animationSystem = new AdvancedAnimationSystem(window.app.editor);
      
      console.log('Advanced features initialized');
    } else {
      setTimeout(checkForEditor, 100);
    }
  };
  
  checkForEditor();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    AdvancedTemplateManager, 
    AdvancedComponentLibrary, 
    AdvancedAnimationSystem 
  };
}

