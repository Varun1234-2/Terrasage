// TerraSage Urban Climate Intelligence - Client Scripts

// Zone dataset for interactive heat risk analysis
const ZONE_DATA = {
  'zone-a': {
    name: 'Zone A · Downtown Commercial',
    heatRisk: 'Critical (41.5°C)',
    heatClass: 'high',
    surfaceTemp: '47.2°C',
    canopyCover: '8.4%',
    priority: 'Priority 1 (Urgent)',
    priorityClass: 'high',
    baseCost: 285000,
    costImpact: 'High ROI ($285k)',
    recommendedInterventions: [
      { id: 'greenery', name: 'Dense Urban Tree Canopy', cost: 120000, cooling: 1.8, savings: 32000 },
      { id: 'coolroofs', name: 'Cool Reflective Roofs', cost: 85000, cooling: 1.4, savings: 24000 },
      { id: 'shade', name: 'Pedestrian Shade Canopies', cost: 45000, cooling: 0.9, savings: 11000 },
      { id: 'pavements', name: 'Permeable Cool Pavements', cost: 35000, cooling: 0.7, savings: 8500 }
    ]
  },
  'zone-b': {
    name: 'Zone B · Industrial Logistics Hub',
    heatRisk: 'High (39.8°C)',
    heatClass: 'high',
    surfaceTemp: '49.0°C',
    canopyCover: '4.2%',
    priority: 'Priority 2 (High)',
    priorityClass: 'high',
    baseCost: 340000,
    costImpact: 'High ROI ($340k)',
    recommendedInterventions: [
      { id: 'coolroofs', name: 'High-Albedo Cool Roof Coatings', cost: 160000, cooling: 2.1, savings: 48000 },
      { id: 'greenery', name: 'Perimeter Vegetative Buffers', cost: 110000, cooling: 1.2, savings: 19000 },
      { id: 'pavements', name: 'Reflective Surface Treatments', cost: 70000, cooling: 0.8, savings: 12000 }
    ]
  },
  'zone-c': {
    name: 'Zone C · Residential Greenbelt',
    heatRisk: 'Moderate (33.2°C)',
    heatClass: 'mid',
    surfaceTemp: '34.6°C',
    canopyCover: '32.1%',
    priority: 'Priority 4 (Maintenance)',
    priorityClass: 'mid',
    baseCost: 95000,
    costImpact: 'Low Cost ($95k)',
    recommendedInterventions: [
      { id: 'greenery', name: 'Canopy Preservation & Infills', cost: 45000, cooling: 0.6, savings: 9000 },
      { id: 'pavements', name: 'Bioswale Water Runoff Coolers', cost: 50000, cooling: 0.5, savings: 6500 }
    ]
  },
  'zone-d': {
    name: 'Zone D · Suburban Transit Corridor',
    heatRisk: 'High (38.4°C)',
    heatClass: 'high',
    surfaceTemp: '42.1°C',
    canopyCover: '11.8%',
    priority: 'Priority 3 (Elevated)',
    priorityClass: 'high',
    baseCost: 195000,
    costImpact: 'Moderate Cost ($195k)',
    recommendedInterventions: [
      { id: 'shade', name: 'Transit Stop Solar Shades', cost: 65000, cooling: 1.2, savings: 14000 },
      { id: 'greenery', name: 'Street Tree Corridors', cost: 85000, cooling: 1.5, savings: 22000 },
      { id: 'coolroofs', name: 'Commercial Strip Cool Roofs', cost: 45000, cooling: 0.9, savings: 13000 }
    ]
  },
  'zone-e': {
    name: 'Zone E · Riverfront Cultural Park',
    heatRisk: 'Low (30.1°C)',
    heatClass: 'optimal',
    surfaceTemp: '31.4°C',
    canopyCover: '41.5%',
    priority: 'Optimal (Benchmark)',
    priorityClass: 'optimal',
    baseCost: 40000,
    costImpact: 'Minimal ($40k)',
    recommendedInterventions: [
      { id: 'greenery', name: 'Wetland Cooling Microclimates', cost: 25000, cooling: 0.4, savings: 4000 },
      { id: 'shade', name: 'Timber Canopy Shelters', cost: 15000, cooling: 0.3, savings: 2500 }
    ]
  }
};

let currentSelectedZone = 'zone-a';
let activeInterventions = new Set(['greenery', 'coolroofs', 'shade']);

document.addEventListener('DOMContentLoaded', () => {
  initZoneInteractions();
  initMobileMenu();
  initModal();
  initSmoothScroll();
  renderCurrentZone();
});

// Zone click & hover handlers
function initZoneInteractions() {
  // SVG Zones in Hero and Product Mock
  const clickableZones = document.querySelectorAll('.map-zone');
  clickableZones.forEach(zone => {
    zone.addEventListener('click', (e) => {
      const zoneId = e.currentTarget.dataset.zone || 'zone-a';
      selectZone(zoneId);
    });

    zone.addEventListener('mouseenter', (e) => {
      const zoneId = e.currentTarget.dataset.zone;
      highlightZoneLabel(zoneId);
    });
  });

  // Zone buttons in Product Mock
  const zoneButtons = document.querySelectorAll('.zone-btn');
  zoneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const zoneId = btn.dataset.zone;
      selectZone(zoneId);
    });
  });
}

function selectZone(zoneId) {
  if (!ZONE_DATA[zoneId]) return;
  currentSelectedZone = zoneId;

  // Update button active states
  document.querySelectorAll('.zone-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.zone === zoneId);
  });

  // Update SVG zone selected states
  document.querySelectorAll('.map-zone').forEach(zone => {
    zone.classList.toggle('selected', zone.dataset.zone === zoneId);
  });

  renderCurrentZone();
}

function highlightZoneLabel(zoneId) {
  const data = ZONE_DATA[zoneId];
  if (!data) return;
  const hintEl = document.getElementById('map-hint-text');
  if (hintEl) {
    hintEl.textContent = `Inspecting: ${data.name} (${data.surfaceTemp})`;
  }
}

// Update indicators & simulator view
function renderCurrentZone() {
  const data = ZONE_DATA[currentSelectedZone];
  if (!data) return;

  // Hero indicators
  const heroHeatVal = document.getElementById('hero-heat-val');
  if (heroHeatVal) {
    heroHeatVal.textContent = data.heatRisk;
    heroHeatVal.className = `value ${data.heatClass}`;
  }

  const heroPriorityVal = document.getElementById('hero-priority-val');
  if (heroPriorityVal) {
    heroPriorityVal.textContent = data.priority;
    heroPriorityVal.className = `value ${data.priorityClass}`;
  }

  const heroCostVal = document.getElementById('hero-cost-val');
  if (heroCostVal) {
    heroCostVal.textContent = data.costImpact;
  }

  const heroNote = document.getElementById('hero-zone-note');
  if (heroNote) {
    heroNote.textContent = `Active: ${data.name} · Canopy: ${data.canopyCover}`;
  }

  // Product simulator panel
  const simBadge = document.getElementById('sim-priority-badge');
  if (simBadge) {
    simBadge.textContent = `${data.name} · ${data.heatRisk}`;
  }

  // Render checklist of interventions for this zone
  const listContainer = document.getElementById('sim-interventions-list');
  if (listContainer) {
    listContainer.innerHTML = '';
    data.recommendedInterventions.forEach(item => {
      const isChecked = activeInterventions.has(item.id);
      const li = document.createElement('li');
      li.className = `intervention-item ${isChecked ? 'active' : ''}`;
      li.innerHTML = `
        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; flex:1;">
          <input type="checkbox" value="${item.id}" ${isChecked ? 'checked' : ''}>
          <span>${item.name}</span>
        </label>
        <span style="font-size:12px; color:var(--mint); font-weight:600;">-${item.cooling}°C</span>
      `;

      li.querySelector('input').addEventListener('change', (e) => {
        if (e.target.checked) {
          activeInterventions.add(item.id);
          li.classList.add('active');
        } else {
          activeInterventions.delete(item.id);
          li.classList.remove('active');
        }
        recalculateMetrics();
      });

      listContainer.appendChild(li);
    });
  }

  recalculateMetrics();
}

function recalculateMetrics() {
  const data = ZONE_DATA[currentSelectedZone];
  if (!data) return;

  let totalCost = 0;
  let totalCooling = 0;
  let totalSavings = 0;

  data.recommendedInterventions.forEach(item => {
    if (activeInterventions.has(item.id)) {
      totalCost += item.cost;
      totalCooling += item.cooling;
      totalSavings += item.savings;
    }
  });

  const costEl = document.getElementById('sim-total-cost');
  if (costEl) {
    costEl.textContent = totalCost > 0 ? `$${totalCost.toLocaleString()}` : '$0 (Baseline)';
  }

  const coolingEl = document.getElementById('sim-cooling-drop');
  if (coolingEl) {
    coolingEl.textContent = totalCooling > 0 ? `-${totalCooling.toFixed(1)}°C` : '0.0°C';
  }

  const savingsEl = document.getElementById('sim-annual-savings');
  if (savingsEl) {
    savingsEl.textContent = totalSavings > 0 ? `$${totalSavings.toLocaleString()}/yr` : '$0/yr';
  }
}

// Mobile Menu Drawer
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.textContent = isOpen ? '✕' : '☰';
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.textContent = '☰';
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Modal & Form Handling
function initModal() {
  const modalOverlay = document.getElementById('demo-modal');
  const openButtons = document.querySelectorAll('.open-demo-modal');
  const closeButton = document.getElementById('close-modal');
  const form = document.getElementById('demo-form');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeButton && modalOverlay) {
    closeButton.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('input-name')?.value || 'Decision Maker';
      if (modalOverlay) modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      form.reset();
      showToast(`Thank you, ${name}! Your demo request has been registered.`);
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>🌿</span> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Smooth scrolling and Active Nav Link Spy
function initSmoothScroll() {
  const links = document.querySelectorAll('header .nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
