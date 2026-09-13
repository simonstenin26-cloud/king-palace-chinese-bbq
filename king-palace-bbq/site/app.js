(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menu = window.KING_PALACE_MENU;
  const model = window.KING_PALACE_MODEL;
  const grid = document.querySelector('#menu-items');
  const search = document.querySelector('#menu-search');
  const filterButtons = [...document.querySelectorAll('[data-category]')];
  const categoryLabels = Object.freeze({
    bbq: 'BBQ & Roast Meats',
    starters: 'Starters & Soups',
    rice: 'Rice & Noodles',
    wok: 'From the Wok',
    seafood: 'Seafood',
    vegetables: 'Vegetables',
    all: 'All Dishes'
  });
  const categoryLabel = category => categoryLabels[category] || menu.categories[category].label;
  let selected = 'bbq';


  function renderMenu() {
    const query = search.value.trim().toLocaleLowerCase();
    const items = model.filterMenu(menu, selected, query);
    grid.replaceChildren();
    const fragment = document.createDocumentFragment();
    let previousCategory;
    for (const item of items) {
      if (selected === 'all' && !query && item.category !== previousCategory) {
        const heading = document.createElement('h3');
        heading.className = 'menu-group-heading';
        heading.textContent = categoryLabel(item.category);
        fragment.append(heading);
        previousCategory = item.category;
      }
      const article = document.createElement('article');
      article.className = 'menu-item';
      if (query) {
        const category = document.createElement('p');
        category.className = 'menu-category-label';
        category.textContent = categoryLabel(item.category);
        article.append(category);
      }
      const name = document.createElement('h4');
      name.textContent = item.name;
      const price = document.createElement('span');
      price.className = 'menu-price';
      price.textContent = model.formatPrice(item.price);
      price.setAttribute('aria-label', item.price === null ? 'Market price, please call' : `${model.formatPrice(item.price)}, published menu price`);
      const note = document.createElement('p');
      note.textContent = item.note;
      article.append(name, price, note);
      fragment.append(article);
    }
    grid.append(fragment);
    document.querySelector('#category-title').textContent = query ? 'Search Results' : categoryLabel(selected);
    document.querySelector('#menu-count').textContent = `${items.length} ${items.length === 1 ? 'dish' : 'dishes'}${query ? ' found' : ''}`;
    document.querySelector('#menu-empty').hidden = items.length > 0;
    grid.hidden = items.length === 0;
    filterButtons.forEach(button => {
      const active = button.dataset.category === selected;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const activeButton = filterButtons.find(button => button.dataset.category === selected);
    const rail = activeButton.parentElement;
    const buttonRect = activeButton.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    if (buttonRect.right > railRect.right) rail.scrollLeft += buttonRect.right - railRect.right + 4;
    else if (buttonRect.left < railRect.left) rail.scrollLeft -= railRect.left - buttonRect.left + 4;
  }

  function selectCategory(category) {
    if (!Object.hasOwn(menu.categories, category)) return;
    selected = category;
    search.value = '';
    renderMenu();
  }
  filterButtons.forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.category)));
  document.querySelectorAll('[data-category-link]').forEach(link => link.addEventListener('click', () => selectCategory(link.dataset.categoryLink)));
  search.addEventListener('input', () => { selected = 'all'; renderMenu(); });
  document.querySelector('#clear-search').addEventListener('click', () => { selectCategory('all'); search.focus(); });
  renderMenu();

  const reviewFilterButtons = [...document.querySelectorAll('[data-review-filter]')];
  const reviewCards = [...document.querySelectorAll('[data-review-sentiment]')];
  const reviewRail = document.querySelector('.review-rail');
  reviewFilterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.reviewFilter;
    reviewCards.forEach(card => {
      const rating = Number(card.dataset.reviewRating);
      const show = filter === 'all'
        || (filter === 'positive' && rating === 5)
        || (filter === 'critical' && rating >= 2 && rating < 5);
      card.hidden = !show;
    });
    reviewFilterButtons.forEach(control => {
      const active = control === button;
      control.classList.toggle('is-active', active);
      control.setAttribute('aria-pressed', String(active));
    });
    if (reviewRail) reviewRail.scrollLeft = 0;
  }));

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#main-nav');
  function setNavigation(open, restoreFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-is-open', open);
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => setNavigation(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setNavigation(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setNavigation(false, true);
  });
  document.addEventListener('click', event => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('.header')) setNavigation(false);
  });
  // Closing on a breakpoint change avoids a locked body after rotating a phone.
  window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) setNavigation(false); });

  function updateHours(now = new Date()) {
    // Derive business hours from Miami time, independent of the visitor's timezone.
    const { weekday } = model.businessHours(now);
    document.querySelectorAll('.hours tr[data-day]').forEach(row => row.classList.toggle('is-today', row.dataset.day === weekday));
  }
  updateHours();
  window.setInterval(updateHours, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateHours(); });

  // Scroll choreography: reveal content as it arrives, keep the header oriented,
  // and add only a very small amount of depth to the hero image.
  function setupScrollEffects() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    const trackedSections = navLinks
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    const revealTargets = [
      '.favorites .section-heading',
      '.favorite-card',
      '.story-grid',
      '.story-foot',
      '.takeaway > *',
      '.reviews-heading',
      '.review-card',
      '.visit .section-heading',
      '.visit-details',
      '.visit-map',
      '.footer'
    ];
    const revealElements = revealTargets.flatMap(selector => [...document.querySelectorAll(selector)]);
    const footer = document.querySelector('.footer');
    const standardRevealElements = revealElements.filter(element => element !== footer);
    revealElements.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', element === footer ? '0ms' : `${Math.min(index % 4, 3) * 70}ms`);
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealElements.forEach(element => element.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      standardRevealElements.forEach(element => revealObserver.observe(element));

      // The footer should begin materializing as its leading edge reaches the
      // viewport, rather than waiting until a sizeable portion is already on screen.
      if (footer) {
        const footerObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            footerObserver.unobserve(entry.target);
          });
        }, { threshold: 0.01 });
        footerObserver.observe(footer);
      }
    }

    let ticking = false;
    function updateScrollState() {
      const scrollY = window.scrollY;
      header.classList.toggle('is-scrolled', scrollY > 18);
      // Begin releasing the header once the reader is through the first half
      // of the opening scene, rather than waiting for the hero to fully end.
      const heroReleasePoint = hero.offsetTop + hero.offsetHeight * 0.5;
      header.classList.toggle('is-past-hero', scrollY >= heroReleasePoint);
      if (!reduceMotion.matches) {
        const heroOffset = Math.min(scrollY * 0.035, 18);
        document.documentElement.style.setProperty('--hero-offset', `${heroOffset}px`);
      }

      const marker = scrollY + header.offsetHeight + 120;
      let currentSection;
      trackedSections.forEach(section => {
        if (section.offsetTop <= marker) currentSection = section;
      });
      navLinks.forEach(link => {
        const isCurrent = link.getAttribute('href') === `#${currentSection?.id}`;
        link.classList.toggle('is-current', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      ticking = false;
    }
    function requestScrollState() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    }
    window.addEventListener('scroll', requestScrollState, { passive: true });
    window.addEventListener('resize', requestScrollState, { passive: true });
    updateScrollState();
  }
  setupScrollEffects();

  // Let long-form sections hand their colors to one shared page ground.
  // The snap mode keeps the transition calm alongside the existing scroll reveals.
  function setupGroundFade() {
    const root = document.documentElement;
    const canvas = document.body;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let ground = '';
    let ink = '';

    const paint = now => {
      frame = 0;
      const sections = [...document.querySelectorAll('[data-ground]')];
      if (!sections.length) return;
      // Commit while the incoming section is still in the lower half of the
      // viewport, so the ground responds to the reader instead of trailing them.
      const line = window.innerHeight * 0.65;
      const tops = sections.map(section => section.getBoundingClientRect().top);
      let index = -1;
      tops.forEach((top, sectionIndex) => { if (top < line) index = sectionIndex; });

      // Let the takeout chapter own the screen for a little longer. The gold
      // ground should remain in place until the Takeout Orders heading itself
      // is halfway past the top edge—not switch away just because the next
      // section has arrived at the normal handoff line.
      const takeawayIndex = sections.findIndex(section => section.id === 'takeaway');
      const takeawayTitle = document.querySelector('#takeaway-title');
      if (takeawayIndex >= 0 && index > takeawayIndex && takeawayTitle) {
        const titleBounds = takeawayTitle.getBoundingClientRect();
        const titleMidpoint = titleBounds.top + titleBounds.height / 2;
        if (titleMidpoint > 0) index = takeawayIndex;
      }
      // A short footer can never reach the normal handoff line before the
      // document ends; let the final ground take over once the page bottoms out.
      if (index < sections.length - 1 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        index = sections.length - 1;
      }

      if (index >= 0) {
        const current = sections[index];
        const nextGround = current.dataset.ground || '';
        const nextInk = current.dataset.ink || '';
        // The red story ground begins before every Favorites card has fully
        // cleared the viewport. Let its supporting copy leave with the seam.
        root.classList.toggle('is-story-handoff', current.id === 'story');
        canvas.style.backgroundColor = nextGround;
        if (nextGround !== ground) {
          ground = nextGround;
          root.style.setProperty('--ground', nextGround);
        }
        if (nextInk !== ink) {
          ink = nextInk;
          root.style.setProperty('--ground-ink', nextInk);
        }
      } else {
        root.classList.remove('is-story-handoff');
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    paint(performance.now());
    root.dataset.grounded = '';
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
  }
  setupGroundFade();

  function setupHeroFoodGallery() {
    const gallery = document.querySelector('.hero-food-gallery');
    const image = gallery?.querySelector('img');
    const label = gallery?.querySelector('.hero-gallery-label');
    if (!gallery || !image || !label) return;

    const dishes = [
      { src: image.src, alt: image.alt, label: 'Roast pork & duck' },
      { src: 'https://images.deliveryhero.io/image/fd-sg/Products/37650884.jpg?width=1600', alt: 'Cantonese three-meat platter with roast duck, char siu pork, and crispy pork belly', label: 'BBQ three-meat platter', scale: 1.08 },
      { src: 'https://images.squarespace-cdn.com/content/v1/63879b46c6206d467feba554/b5684f93-a01d-4a83-ac61-144946c7aab9/IRV-26.jpg', alt: 'Honey walnut shrimp with candied walnuts at a family-style Chinese restaurant table', label: 'Walnut shrimp', position: '50% 65%' }
    ];
    let current = 0;
    let changing = false;
    image.style.setProperty('--hero-photo-scale', dishes[current].scale || 1.16);
    image.style.setProperty('--hero-photo-position', dishes[current].position || 'center center');

    function showDish(nextIndex) {
      if (changing) return;
      changing = true;
      current = nextIndex % dishes.length;
      const dish = dishes[current];
      image.classList.add('is-switching');
      window.setTimeout(() => {
        const reveal = () => {
          image.classList.remove('is-switching');
          changing = false;
        };
        image.addEventListener('load', reveal, { once: true });
        image.addEventListener('error', reveal, { once: true });
        image.src = dish.src;
        image.alt = dish.alt;
        image.style.setProperty('--hero-photo-scale', dish.scale || 1.16);
        image.style.setProperty('--hero-photo-position', dish.position || 'center center');
        label.textContent = dish.label;
        gallery.setAttribute('aria-label', `Showing ${dish.label}. Browse the next King Palace dish photo`);
        if (image.complete) reveal();
      }, 160);
    }

    gallery.addEventListener('click', () => showDish(current + 1));
    gallery.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') showDish(current + 1);
    });
  }
  setupHeroFoodGallery();

  // Keep a designed text treatment if a third-party photograph cannot load.
  document.querySelectorAll('[data-photo]').forEach(img => {
    const markUnavailable = () => img.parentElement.classList.add('image-unavailable');
    img.addEventListener('error', markUnavailable);
    if (img.complete && img.naturalWidth === 0) markUnavailable();
  });

})();
