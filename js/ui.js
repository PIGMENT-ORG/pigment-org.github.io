/* PIGMENT v6 - Shared UI Utilities */

// Mobile menu toggle
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.header-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-header')) {
      nav.classList.remove('open');
    }
  });
}

// Code tabs
function initCodeTabs() {
  document.querySelectorAll('.code-example').forEach(block => {
    const tabs = block.querySelectorAll('.code-tab');
    const panels = block.querySelectorAll('.code-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = block.querySelector(`[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

// Copy button
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-panel, .code-example, .response-block')?.querySelector('pre');
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
        btn.textContent = '✓ Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

// Docs sidebar: highlight active page
function initSidebarActive() {
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    if (a.getAttribute('href') && path.endsWith(a.getAttribute('href').split('/').pop())) {
      a.classList.add('active');
    }
  });
}

// Docs sidebar toggle on mobile
function initDocsSidebar() {
  const toggle = document.querySelector('[data-sidebar-toggle]');
  const sidebar = document.querySelector('.docs-sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// TOC active highlighting on scroll
function initTOC() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (!tocLinks.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(link => link.classList.remove('active'));
        const link = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-10% 0% -80% 0%' });
  document.querySelectorAll('.article-body h2, .article-body h3').forEach(h => {
    if (h.id) observer.observe(h);
  });
}

// Initialize all on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCodeTabs();
  initCopyButtons();
  initSidebarActive();
  initDocsSidebar();
  initTOC();
});
