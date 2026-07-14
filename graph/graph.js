// Globals
let cy = null;
let allNodes = [];
let allEdges = [];
let activeFilters = new Set();
let searchQuery = '';

// Premium Colors for architecture entity types (Schema v1.0)
const colorMap = {
  project: '#3b82f6', // Blue
  document: '#10b981', // Emerald
  module: '#8b5cf6', // Violet/Purple
  requirement: '#f59e0b', // Amber
  business_rule: '#ef4444', // Red
  use_case: '#6366f1', // Indigo
  user_flow: '#14b8a6', // Teal
  api: '#ec4899', // Rose/Pink
  database: '#06b6d4', // Cyan
  table: '#0891b2', // Darker Cyan
  architecture: '#a855f7', // Purple/Magenta
  ui: '#f43f5e', // Rose Red
  component: '#fb7185', // Light Rose
  source: '#a3a3a3', // Neutral Gray
  test: '#22c55e', // Green
};

// Edge styling specs by type
const edgeColorMap = {
  contains: 'rgba(59, 130, 246, 0.25)', // Blue (Folder tree)
  links: 'rgba(16, 185, 129, 0.25)', // Green (Wiki / Markdown link)
  references: 'rgba(245, 158, 11, 0.25)', // Yellow (Comment mentions)
  depends_on: 'rgba(239, 68, 68, 0.35)', // Red (Dependencies)
  implements: 'rgba(236, 72, 153, 0.35)', // Rose (Code implements requirement)
  belongs_to: 'rgba(99, 102, 241, 0.25)', // Indigo (Feature belongs to domain)
  uses: 'rgba(6, 182, 212, 0.25)', // Cyan (Function dependencies / db / api)
  tested_by: 'rgba(20, 184, 166, 0.25)', // Teal (Test coverage)
  calls: 'rgba(249, 115, 22, 0.25)', // Orange (API to API)
  extends: 'rgba(139, 92, 246, 0.25)', // Violet (Class inheritance structure)
  inherits: 'rgba(168, 85, 247, 0.25)', // Purple
  related_to: 'rgba(156, 163, 175, 0.25)', // Gray
};

// FontAwesome icons for each type
const iconMap = {
  project: 'fa-diagram-project',
  document: 'fa-file-lines',
  module: 'fa-cubes',
  requirement: 'fa-circle-check',
  business_rule: 'fa-scale-balanced',
  use_case: 'fa-list-check',
  user_flow: 'fa-route',
  api: 'fa-gears',
  database: 'fa-database',
  table: 'fa-table',
  architecture: 'fa-sitemap',
  ui: 'fa-window-maximize',
  component: 'fa-puzzle-piece',
  source: 'fa-file-code',
  test: 'fa-flask',
};

// Layout configuration
const layoutOptions = {
  name: 'cose',
  animate: true,
  animationDuration: 800,
  fit: true,
  padding: 50,
  nodeOverlap: 20,
  nestingFactor: 1.2,
  gravity: 1.5,
  numIter: 1000,
  initialTemp: 1000,
  coolingFactor: 0.99,
  minTemp: 1.0,
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  fetchGraphData();
});

// Set up UI Event Listeners
function setupEventListeners() {
  // Search Box
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  const clearSearchBtn = document.getElementById('clear-search-btn');
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    applyFilters();
  });

  // Category checkboxes
  const filterCheckboxes = document.querySelectorAll('.filter-item input');
  filterCheckboxes.forEach((cb) => {
    if (cb.checked) {
      activeFilters.add(cb.value);
    }
    cb.addEventListener('change', (e) => {
      const val = e.target.value;
      if (e.target.checked) {
        activeFilters.add(val);
      } else {
        activeFilters.delete(val);
      }
      applyFilters();
    });
  });

  // Sidebar close
  document
    .getElementById('close-sidebar-btn')
    .addEventListener('click', closeSidebar);

  // Layout Controls
  document.getElementById('reset-zoom-btn').addEventListener('click', () => {
    if (cy) {
      cy.animate({
        fit: {
          eles: cy.elements().not('.filtered-out'),
          padding: 50,
        },
        duration: 600,
      });
    }
  });

  document.getElementById('rearrange-btn').addEventListener('click', () => {
    if (cy) {
      const layout = cy.layout({
        ...layoutOptions,
        eles: cy.elements().not('.filtered-out'),
      });
      layout.run();
    }
  });

  // Node Size Slider
  const nodeSizeSlider = document.getElementById('node-size-slider');
  nodeSizeSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    if (cy) {
      cy.style()
        .selector('node')
        .style({
          width: val + 'px',
          height: val + 'px',
        })
        .update();
    }
  });

  // Link Thickness Slider
  const linkThicknessSlider = document.getElementById('link-thickness-slider');
  linkThicknessSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    if (cy) {
      cy.style()
        .selector('edge')
        .style({
          width: val,
        })
        .update();
    }
  });

  // Text Size Slider
  const textSizeSlider = document.getElementById('text-size-slider');
  textSizeSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    if (cy) {
      cy.style()
        .selector('node')
        .style({
          'font-size': val + 'px',
        })
        .update();
    }
  });

  // Arrows Toggle
  const arrowsToggle = document.getElementById('arrows-toggle');
  arrowsToggle.addEventListener('change', (e) => {
    const show = e.target.checked;
    if (cy) {
      cy.style()
        .selector('edge')
        .style({
          'target-arrow-shape': show ? 'triangle' : 'none',
        })
        .update();
    }
  });

  // Collapsible settings group headers
  const headers = document.querySelectorAll('.settings-group-header');
  headers.forEach((h) => {
    h.addEventListener('click', () => {
      const content = h.nextElementSibling;
      const icon = h.querySelector('.toggle-icon');

      content.classList.toggle('collapsed');
      h.classList.toggle('active');

      if (content.classList.contains('collapsed')) {
        icon.className = 'fa-solid fa-chevron-right toggle-icon';
      } else {
        icon.className = 'fa-solid fa-chevron-down toggle-icon';
      }
    });
  });

  // Connection Authoring listeners
  document
    .getElementById('add-conn-btn')
    .addEventListener('click', addConnection);
  document
    .getElementById('export-json-btn')
    .addEventListener('click', exportEdgesJSON);
}

// Load Nodes and Edges
async function fetchGraphData() {
  try {
    const nodesResponse = await fetch('nodes.json');
    allNodes = await nodesResponse.json();

    const edgesResponse = await fetch('edges.json');
    allEdges = await edgesResponse.json();

    buildGraph();
    updateStats();
    renderFileExplorer();

    // Fade loading overlay
    document.getElementById('loading-overlay').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('loading-overlay').style.display = 'none';
    }, 500);
  } catch (error) {
    console.error('Error fetching graph JSON:', error);
    document.getElementById('loading-overlay').innerHTML = `
      <i class="fa-solid fa-triangle-exclamation" style="font-size: 40px; color: #ef4444;"></i>
      <p style="margin-top: 10px; color: #ef4444; font-weight: 600;">Failed to load graph data!</p>
      <p style="font-size: 12px; color: #9ca3af; max-width: 300px; text-align: center; line-height: 1.4; margin-top: 5px;">
        Please make sure nodes.json and edges.json are populated inside the graph folder.
      </p>
    `;
  }
}

// Update stats bar based on real-time loaded data
function updateStats() {
  if (!cy) return;
  const modules = cy.nodes('[type="module"]').length;
  const requirements = cy.nodes('[type="requirement"]').length;
  const apis = cy.nodes('[type="api"]').length;

  const mEl = document.getElementById('stat-modules');
  const rEl = document.getElementById('stat-requirements');
  const aEl = document.getElementById('stat-apis');
  if (mEl) mEl.textContent = modules;
  if (rEl) rEl.textContent = requirements;
  if (aEl) aEl.textContent = apis;
}

// Convert JSON nodes & edges into Cytoscape compatible elements
function getCytoscapeElements() {
  const elements = [];

  // Map nodes
  allNodes.forEach((node) => {
    let mappedType = node.type;

    const validTypes = [
      'project',
      'document',
      'module',
      'requirement',
      'business_rule',
      'use_case',
      'user_flow',
      'api',
      'database',
      'table',
      'architecture',
      'ui',
      'component',
      'source',
      'test',
    ];
    if (!validTypes.includes(mappedType)) {
      // Direct path-based mapping fallback for initial bootstrap
      if (node.id.endsWith('.md') || node.id.startsWith('docs/')) {
        mappedType = 'document';
      } else if (
        node.id.startsWith('modules/') ||
        node.id.startsWith('mock-data/') ||
        node.type === 'folder'
      ) {
        mappedType = 'module';
      } else {
        mappedType = 'document'; // Fallback
      }
    }

    elements.push({
      group: 'nodes',
      data: {
        id: node.id,
        label: node.label || node.id,
        type: mappedType,
        module: node.module || '',
        path: node.path || '',
        description: node.description || '',
        metadata: node.metadata || { filePath: node.path || node.id },
      },
    });
  });

  // Map edges
  allEdges.forEach((edge, idx) => {
    const relationType = edge.relation || edge.type || 'references';
    elements.push({
      group: 'edges',
      data: {
        id: `edge_${idx}`,
        source: edge.source,
        target: edge.target,
        type: relationType, // Cytoscape uses type key for selector binding
        description: edge.description || '',
      },
    });
  });

  return elements;
}

// Build cytoscape layout and style mapping
function buildGraph() {
  const container = document.getElementById('graph-container');

  cy = cytoscape({
    container: container,
    elements: getCytoscapeElements(),
    boxSelectionEnabled: false,
    autoungrabify: false,
    minZoom: 0.1,
    maxZoom: 3,
    style: [
      {
        selector: 'node',
        style: {
          label: 'data(label)',
          color: '#a3a3a3',
          'font-family': 'Outfit, sans-serif',
          'font-size': '10px',
          'text-valign': 'bottom',
          'text-margin-y': 6,
          shape: 'ellipse',
          'background-color': '#525252',
          'border-width': '0px',
          'shadow-blur': 0,
          'shadow-opacity': 0.65,
          'shadow-offset-x': 0,
          'shadow-offset-y': 0,
          'transition-property':
            'opacity, background-color, border-color, width, height, border-width, shadow-blur, color',
          'transition-duration': '0.2s',
        },
      },
      {
        selector: 'edge',
        style: {
          width: 1,
          'line-color': 'rgba(255, 255, 255, 0.08)',
          'target-arrow-color': 'rgba(255, 255, 255, 0.08)',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'control-point-step-size': 30,
          'arrow-scale': 0.75,
          'overlay-opacity': 0,
          'transition-property':
            'opacity, line-color, width, target-arrow-color',
          'transition-duration': '0.2s',
        },
      },
      // Glowing colors & custom sizes per node type
      {
        selector: 'node[type="project"]',
        style: {
          'background-color': colorMap.project,
          'shadow-color': colorMap.project,
          'shadow-blur': 25,
          width: '28px',
          height: '28px',
          'font-size': '12px',
          'font-weight': 'bold',
          'border-width': '2.5px',
          'border-color': 'rgba(255, 255, 255, 0.25)',
        },
      },
      {
        selector: 'node[type="document"]',
        style: {
          'background-color': colorMap.document,
          'shadow-color': colorMap.document,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="module"]',
        style: {
          'background-color': colorMap.module,
          'shadow-color': colorMap.module,
          'shadow-blur': 16,
          width: '20px',
          height: '20px',
          'font-weight': '600',
        },
      },
      {
        selector: 'node[type="requirement"]',
        style: {
          'background-color': colorMap.requirement,
          'shadow-color': colorMap.requirement,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="business_rule"]',
        style: {
          'background-color': colorMap.business_rule,
          'shadow-color': colorMap.business_rule,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="use_case"]',
        style: {
          'background-color': colorMap.use_case,
          'shadow-color': colorMap.use_case,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="user_flow"]',
        style: {
          'background-color': colorMap.user_flow,
          'shadow-color': colorMap.user_flow,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="api"]',
        style: {
          'background-color': colorMap.api,
          'shadow-color': colorMap.api,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="database"]',
        style: {
          'background-color': colorMap.database,
          'shadow-color': colorMap.database,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="table"]',
        style: {
          'background-color': colorMap.table,
          'shadow-color': colorMap.table,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="architecture"]',
        style: {
          'background-color': colorMap.architecture,
          'shadow-color': colorMap.architecture,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="ui"]',
        style: {
          'background-color': colorMap.ui,
          'shadow-color': colorMap.ui,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="component"]',
        style: {
          'background-color': colorMap.component,
          'shadow-color': colorMap.component,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="source"]',
        style: {
          'background-color': colorMap.source,
          'shadow-color': colorMap.source,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      {
        selector: 'node[type="test"]',
        style: {
          'background-color': colorMap.test,
          'shadow-color': colorMap.test,
          'shadow-blur': 12,
          width: '14px',
          height: '14px',
        },
      },
      // Styling per edge type - subtle color indicators
      {
        selector: 'edge[type="contains"]',
        style: {
          'line-color': edgeColorMap.contains,
          'target-arrow-color': edgeColorMap.contains,
        },
      },
      {
        selector: 'edge[type="links"]',
        style: {
          'line-color': edgeColorMap.links,
          'target-arrow-color': edgeColorMap.links,
          'line-style': 'dotted',
        },
      },
      {
        selector: 'edge[type="references"]',
        style: {
          'line-color': edgeColorMap.references,
          'target-arrow-color': edgeColorMap.references,
          'line-style': 'dashed',
        },
      },
      {
        selector: 'edge[type="depends_on"]',
        style: {
          'line-color': edgeColorMap.depends_on,
          'target-arrow-color': edgeColorMap.depends_on,
          'line-style': 'dashed',
        },
      },
      {
        selector: 'edge[type="implements"]',
        style: {
          'line-color': edgeColorMap.implements,
          'target-arrow-color': edgeColorMap.implements,
        },
      },
      {
        selector: 'edge[type="belongs_to"]',
        style: {
          'line-color': edgeColorMap.belongs_to,
          'target-arrow-color': edgeColorMap.belongs_to,
        },
      },
      {
        selector: 'edge[type="uses"]',
        style: {
          'line-color': edgeColorMap.uses,
          'target-arrow-color': edgeColorMap.uses,
        },
      },
      {
        selector: 'edge[type="tested_by"]',
        style: {
          'line-color': edgeColorMap.tested_by,
          'target-arrow-color': edgeColorMap.tested_by,
          'line-style': 'dashed',
        },
      },
      {
        selector: 'edge[type="calls"]',
        style: {
          'line-color': edgeColorMap.calls,
          'target-arrow-color': edgeColorMap.calls,
        },
      },
      {
        selector: 'edge[type="extends"]',
        style: {
          'line-color': edgeColorMap.extends,
          'target-arrow-color': edgeColorMap.extends,
        },
      },
      {
        selector: 'edge[type="inherits"]',
        style: {
          'line-color': edgeColorMap.inherits,
          'target-arrow-color': edgeColorMap.inherits,
        },
      },

      // Interactive styling classes
      {
        selector: '.filtered-out',
        style: {
          display: 'none',
        },
      },
      {
        selector: '.dimmed',
        style: {
          opacity: 0.15,
          events: 'no',
        },
      },
      {
        selector: '.highlighted',
        style: {
          opacity: 1,
          color: '#f3f4f6',
          'font-weight': '600',
        },
      },
      {
        selector: 'node.highlighted',
        style: {
          'border-width': '2px',
          'border-color': '#fff',
          'shadow-blur': 30,
        },
      },
      {
        selector: 'edge.highlighted',
        style: {
          width: 2.5,
          'line-color': '#fff',
          'target-arrow-color': '#fff',
        },
      },
    ],
    layout: layoutOptions,
  });

  // Canvas Interactions
  cy.on('tap', 'node', (e) => {
    const node = e.target;
    highlightNeighborhood(node);
    showDetails(node);
  });

  cy.on('tap', (e) => {
    if (e.target === cy) {
      clearHighlights();
      closeSidebar();
    }
  });

  // Apply default filters in case some elements are pre-unchecked (should be none by default)
  applyFilters();
}

// Filter engine
function applyFilters() {
  if (!cy) return;

  cy.batch(() => {
    // Process nodes
    cy.nodes().forEach((node) => {
      const type = node.data('type');
      const label = String(node.data('label') || '').toLowerCase();
      const id = String(node.id() || '').toLowerCase();
      const description = String(node.data('description') || '').toLowerCase();

      const typeMatch = activeFilters.has(type);
      const searchMatch =
        !searchQuery ||
        label.includes(searchQuery) ||
        id.includes(searchQuery) ||
        description.includes(searchQuery);

      if (typeMatch && searchMatch) {
        node.removeClass('filtered-out');
      } else {
        node.addClass('filtered-out');
        node.removeClass('highlighted').removeClass('dimmed');
      }
    });

    // Process edges after filtering nodes to prevent dangling edges
    cy.edges().forEach((edge) => {
      const source = cy.getElementById(edge.data('source'));
      const target = cy.getElementById(edge.data('target'));

      if (source.hasClass('filtered-out') || target.hasClass('filtered-out')) {
        edge.addClass('filtered-out');
      } else {
        edge.removeClass('filtered-out');
      }
    });
  });
}

// Highlight clicked node and its immediate neighbours
function highlightNeighborhood(node) {
  cy.batch(() => {
    // Dim everything first
    cy.elements()
      .not('.filtered-out')
      .removeClass('highlighted')
      .addClass('dimmed');

    // Highlight selected node
    node.removeClass('dimmed').addClass('highlighted');

    // Highlight open edges connected to selected node & their corresponding endpoints
    const connectedEdges = node.connectedEdges().not('.filtered-out');
    connectedEdges.removeClass('dimmed').addClass('highlighted');

    connectedEdges
      .connectedNodes()
      .not('.filtered-out')
      .removeClass('dimmed')
      .addClass('highlighted');
  });
}

// Reset dim/highlights to default values
function clearHighlights() {
  if (!cy) return;
  cy.batch(() => {
    cy.elements().removeClass('dimmed').removeClass('highlighted');
  });

  // Clear explorer highlighting
  document
    .querySelectorAll('.tree-node')
    .forEach((el) => el.classList.remove('active'));
}

// Focus and pan-zoom to a specific node
function selectAndFocusNode(nodeId) {
  if (!cy) return;

  const node = cy.getElementById(nodeId);
  if (node.length > 0 && !node.hasClass('filtered-out')) {
    cy.nodes().unselect();
    node.select();

    // Zoom and pan
    cy.animate({
      center: { eles: node },
      zoom: 1.1,
      duration: 600,
    });

    highlightNeighborhood(node);
    showDetails(node);
  }
}

// Render dynamic left file explorer tree
function renderFileExplorer() {
  const explorer = document.getElementById('file-tree');
  if (!explorer) return;
  explorer.innerHTML = '';

  // Build tree object
  const tree = {};

  allNodes.forEach((node) => {
    let parts = [];
    if (node.path) {
      parts = node.path.split('/');
    } else {
      // Put in a virtual category folder based on node type
      const virtualCategory = node.type.replace('_', ' ').toUpperCase() + 'S';
      parts = [virtualCategory, node.label || node.id];
    }

    // Insert parts hierarchically into tree structure
    let current = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (!current[part]) {
        current[part] = {
          name: part,
          isFile: isFile,
          nodeId: isFile ? node.id : null,
          children: {},
        };
      }
      current = current[part].children;
    }
  });

  // Render tree node element recursively
  function createTreeNodeElement(nodeData, depth = 0) {
    const container = document.createDocumentFragment();

    if (nodeData.isFile) {
      const item = document.createElement('div');
      item.className = 'tree-node';
      item.setAttribute('data-id', nodeData.nodeId);

      const origNode = allNodes.find((n) => n.id === nodeData.nodeId);
      const type = origNode ? origNode.type : 'document';
      const iconClass = iconMap[type] || 'fa-file-lines';
      const color = colorMap[type] || '#a3a3a3';

      item.innerHTML = `
        ${'<span class="tree-indent"></span>'.repeat(depth)}
        <i class="fa-solid ${iconClass} tree-node-icon" style="color: ${color}"></i>
        <span>${nodeData.name}</span>
      `;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectAndFocusNode(nodeData.nodeId);
      });

      container.appendChild(item);
    } else {
      const folderItem = document.createElement('div');
      folderItem.className = 'tree-node tree-folder';
      folderItem.innerHTML = `
        ${'<span class="tree-indent"></span>'.repeat(depth)}
        <i class="fa-solid fa-chevron-down tree-node-icon" style="transition: transform 0.2s"></i>
        <span>${nodeData.name}</span>
      `;

      const childrenWrapper = document.createElement('div');
      childrenWrapper.className = 'tree-folder-children';

      folderItem.addEventListener('click', (e) => {
        e.stopPropagation();
        childrenWrapper.classList.toggle('hidden');
        const icon = folderItem.querySelector('.tree-node-icon');
        if (childrenWrapper.classList.contains('hidden')) {
          icon.style.transform = 'rotate(-90deg)';
        } else {
          icon.style.transform = 'rotate(0deg)';
        }
      });

      // Render folder children
      const childKeys = Object.keys(nodeData.children).sort((a, b) => {
        const aChild = nodeData.children[a];
        const bChild = nodeData.children[b];
        // Folders first, then files
        if (aChild.isFile !== bChild.isFile) {
          return aChild.isFile ? 1 : -1;
        }
        return a.localeCompare(b);
      });

      childKeys.forEach((k) => {
        const childEl = createTreeNodeElement(nodeData.children[k], depth + 1);
        childrenWrapper.appendChild(childEl);
      });

      container.appendChild(folderItem);
      container.appendChild(childrenWrapper);
    }

    return container;
  }

  // Sort top level keys (folders first, then files)
  const topKeys = Object.keys(tree).sort((a, b) => {
    const aNode = tree[a];
    const bNode = tree[b];
    if (aNode.isFile !== bNode.isFile) {
      return aNode.isFile ? 1 : -1;
    }
    return a.localeCompare(b);
  });

  topKeys.forEach((k) => {
    const el = createTreeNodeElement(tree[k], 0);
    explorer.appendChild(el);
  });
}

// Open and populate the details panel
function showDetails(node) {
  const id = node.id();
  const label = node.data('label');
  const type = node.data('type');
  const desc = node.data('description') || 'No description available.';
  const metadata = node.data('metadata') || {};
  const color = colorMap[type] || '#6b7280';

  // Highlight matching tree node in left explorer
  document
    .querySelectorAll('.tree-node')
    .forEach((el) => el.classList.remove('active'));
  const matchedTreeEl = document.querySelector(`.tree-node[data-id="${id}"]`);
  if (matchedTreeEl) {
    matchedTreeEl.classList.add('active');
    matchedTreeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // Badge configuration
  const badge = document.getElementById('detail-type');
  badge.textContent = type.replace('_', ' ');
  badge.style.backgroundColor = color;

  document.getElementById('detail-title').textContent = label;
  document.getElementById('detail-desc').textContent = desc;

  // Filepath mapping
  const pathSection = document.getElementById('detail-path-section');
  const pathElem = document.getElementById('detail-path');
  if (node.data('path')) {
    pathSection.style.display = 'block';
    pathElem.textContent = node.data('path');
  } else {
    pathSection.style.display = 'none';
  }

  // Populate generic key-value metadata container
  const metaSection = document.getElementById('detail-meta-section');
  const metaContainer = document.getElementById('detail-meta-container');
  metaContainer.innerHTML = '';

  const metaKeys = Object.keys(metadata).filter(
    (k) =>
      k !== 'filePath' &&
      k !== 'id' &&
      k !== 'type' &&
      k !== 'title' &&
      k !== 'description',
  );
  if (metaKeys.length > 0) {
    metaSection.style.display = 'block';
    metaKeys.forEach((key) => {
      const val = metadata[key];
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.fontSize = '11px';
      row.style.padding = '6px 0';
      row.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';

      const labelSpan = document.createElement('span');
      labelSpan.style.color = '#9ca3af';
      labelSpan.style.fontWeight = '500';
      labelSpan.style.textTransform = 'capitalize';
      labelSpan.textContent = key.replace(/([A-Z])/g, ' $1');

      const valCode = document.createElement('code');
      valCode.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      valCode.style.padding = '2px 6px';
      valCode.style.borderRadius = '4px';
      valCode.style.color = '#f3f4f6';

      if (typeof val === 'object') {
        valCode.textContent = JSON.stringify(val);
      } else {
        valCode.textContent = val;
      }

      row.appendChild(labelSpan);
      row.appendChild(valCode);
      metaContainer.appendChild(row);
    });
  } else {
    metaSection.style.display = 'none';
  }

  // Populate relationships / connections list
  const connList = document.getElementById('detail-connections');
  connList.innerHTML = '';

  // Get connected edges that are not hidden by active filters
  const connectedEdges = node.connectedEdges().not('.filtered-out');
  const relations = [];

  connectedEdges.forEach((edge) => {
    const sourceId = edge.data('source');
    const targetId = edge.data('target');
    const relationType = edge.data('type');
    const edgeDesc = edge.data('description')
      ? ` (${edge.data('description')})`
      : '';

    if (sourceId === id) {
      // Outgoing edge
      const targetNode = cy.getElementById(targetId);
      if (targetNode.length > 0) {
        relations.push({
          edgeId: edge.id(),
          nodeId: targetId,
          nodeLabel: targetNode.data('label'),
          nodeType: targetNode.data('type'),
          relation: `${relationType}${edgeDesc} ➔`,
        });
      }
    } else {
      // Incoming edge
      const sourceNode = cy.getElementById(sourceId);
      if (sourceNode.length > 0) {
        relations.push({
          edgeId: edge.id(),
          nodeId: sourceId,
          nodeLabel: sourceNode.data('label'),
          nodeType: sourceNode.data('type'),
          relation: `➔ ${relationType}${edgeDesc}`,
        });
      }
    }
  });

  if (relations.length > 0) {
    document.getElementById('section-connections').style.display = 'block';

    relations.forEach((rel) => {
      const connIcon = iconMap[rel.nodeType] || 'fa-circle-nodes';
      const connColor = colorMap[rel.nodeType] || '#6b7280';

      const connItem = document.createElement('div');
      connItem.className = 'conn-item';
      connItem.style.display = 'flex';
      connItem.style.justifyContent = 'space-between';
      connItem.style.alignItems = 'center';

      connItem.innerHTML = `
        <div class="conn-info-wrapper" style="display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden; cursor: pointer;">
          <i class="fa-solid ${connIcon} conn-icon" style="color: ${connColor}"></i>
          <span class="conn-name" title="${rel.nodeLabel}">${rel.nodeLabel}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
          <span class="conn-relation">${rel.relation}</span>
          <button class="delete-edge-btn" data-edge-id="${rel.edgeId}" title="Delete Relationship" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; font-size: 10px; opacity: 0.5; transition: all 0.2s;"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      // Click on info focuses neighbor node
      connItem
        .querySelector('.conn-info-wrapper')
        .addEventListener('click', (e) => {
          e.stopPropagation();
          selectAndFocusNode(rel.nodeId);
        });

      // Click on delete removes connection
      connItem
        .querySelector('.delete-edge-btn')
        .addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Are you sure you want to remove this connection?`)) {
            deleteConnection(rel.edgeId, node);
          }
        });

      connList.appendChild(connItem);
    });
  } else {
    document.getElementById('section-connections').style.display = 'none';
  }

  // Populate target select list for connection editing
  const targetSelect = document.getElementById('new-conn-target');
  if (targetSelect) {
    targetSelect.innerHTML = '';

    // Get all visible nodes excluding the currently selected one
    const allNodesList = cy.nodes().not('.filtered-out').not(node);

    // Sort nodes alphabetically by label for easier finding
    const sortedNodes = allNodesList.toArray().sort((a, b) => {
      const labelA = (a.data('label') || '').toLowerCase();
      const labelB = (b.data('label') || '').toLowerCase();
      return labelA.localeCompare(labelB);
    });

    sortedNodes.forEach((n) => {
      const option = document.createElement('option');
      option.value = n.id();
      option.textContent = `${n.data('label')} (${n.data('type')})`;
      targetSelect.appendChild(option);
    });
  }

  // Slide sidebar open
  document.getElementById('no-selection-msg').classList.add('hidden');
  document.getElementById('selection-details').classList.remove('hidden');
  document.getElementById('detail-sidebar').classList.add('active');
}

// Hide sidebar
function closeSidebar() {
  document.getElementById('detail-sidebar').classList.remove('active');
  document.getElementById('no-selection-msg').classList.remove('hidden');
  document.getElementById('selection-details').classList.add('hidden');
  if (cy) {
    cy.nodes().unselect();
  }
}

// Add interactive connection between nodes visually and to data list
function addConnection() {
  if (!cy) return;

  // Find selected source node
  const sourceNode = cy.nodes(':selected');
  if (sourceNode.length === 0) {
    alert('Please select a node on the graph first.');
    return;
  }

  const sourceId = sourceNode.id();
  const targetId = document.getElementById('new-conn-target').value;
  const relationType = document.getElementById('new-conn-type').value;

  if (!targetId) {
    alert('Please select a target node.');
    return;
  }
  if (sourceId === targetId) {
    alert('A node cannot connect to itself.');
    return;
  }

  // Avoid duplicate connections of the same type between the same nodes
  const edgeExists = cy
    .edges()
    .some(
      (edge) =>
        edge.data('source') === sourceId &&
        edge.data('target') === targetId &&
        edge.data('type') === relationType,
    );

  if (edgeExists) {
    alert('This relationship already exists!');
    return;
  }

  const edgeId = `edge_new_${Date.now()}`;

  // Add visually to canvas
  cy.add({
    group: 'edges',
    data: {
      id: edgeId,
      source: sourceId,
      target: targetId,
      type: relationType,
      description: 'Created interactively via UI',
    },
  });

  // Append to the list of edges in memory
  allEdges.push({
    source: sourceId,
    target: targetId,
    relation: relationType,
    description: 'Created interactively via UI',
  });

  // Refresh view and update selection highlight
  highlightNeighborhood(sourceNode);
  showDetails(sourceNode);
}

// Export current memory mapping of edges back to edges.json
function exportEdgesJSON() {
  if (allEdges.length === 0) return;

  // Standardize output JSON fields
  const outputEdges = allEdges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    relation: edge.relation || edge.type || 'references',
    description: edge.description || '',
  }));

  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(outputEdges, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'edges.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Delete connection visually and update the memory list
function deleteConnection(edgeId, currentNode) {
  if (!cy) return;

  const edge = cy.getElementById(edgeId);
  if (edge.length > 0) {
    const sourceId = edge.data('source');
    const targetId = edge.data('target');
    const relationType = edge.data('type');

    // Remove visually from Cytoscape canvas
    edge.remove();

    // Filter out from memory list
    allEdges = allEdges.filter(
      (e) =>
        !(
          (e.source === sourceId &&
            e.target === targetId &&
            e.relation === relationType) ||
          (e.source === sourceId &&
            e.target === targetId &&
            e.type === relationType)
        ),
    );

    // Refresh highlights & sidebar details
    highlightNeighborhood(currentNode);
    showDetails(currentNode);
  }
}
