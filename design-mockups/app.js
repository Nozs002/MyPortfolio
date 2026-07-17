/**
 * MyPortfolio Interactive Logic (Pure JS)
 * Handles: Light/Dark theme toggling, Interactive canvas particle background,
 * AI Chat Widget simulation, LocalStorage Contact Syncing,
 * Dashboard Tab switching, SVG Charts, and mock project CRUD.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initBackgroundCanvas();
  initAIChat();
  initContactForm();
  initDashboard();
});

/* ==========================================
   1. THEME MANAGEMENT (Light / Dark Mode)
   ========================================== */
function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme =
        document.documentElement.getAttribute('data-theme') === 'dark'
          ? 'light'
          : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeIcons(theme);
    });
  });
}

function updateThemeIcons(theme) {
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  toggleBtns.forEach((btn) => {
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
    } else {
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
    }
  });
}

/* ==========================================
   2. INTERACTIVE CANVAS BACKGROUND
   ========================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 20000));
  const connectionDistance = 140;
  const mouse = { x: null, y: null, radius: 180 };

  // Generate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5,
    });
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dynamic colors based on active theme
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';
    const particleColor = isDark
      ? 'rgba(139, 92, 246, 0.4)'
      : 'rgba(79, 70, 229, 0.25)';
    const lineColor = isDark
      ? 'rgba(139, 92, 246, 0.12)'
      : 'rgba(79, 70, 229, 0.08)';
    const mouseLineColor = isDark
      ? 'rgba(6, 182, 212, 0.25)'
      : 'rgba(6, 182, 212, 0.15)';

    // Update and Draw Particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Boundary check
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    });

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.7;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = mouseLineColor.replace(/[\d.]+\)$/, `${alpha})`);
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Connect to other particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${alpha})`);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
   3. AI PORTFOLIO CHAT WIDGET
   ========================================== */
function initAIChat() {
  const chatBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  if (!chatBtn || !chatWindow) return;

  // Toggle chat window open/close
  chatBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    chatBtn.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      chatInput.focus();
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });

  // Mock answers database
  const botAnswers = {
    keywords: [
      {
        keys: ['kỹ năng', 'skills', 'skill', 'ngôn ngữ', 'công nghệ'],
        reply:
          'Chủ nhân portfolio này có kinh nghiệm chuyên sâu về <b>Javascript/TypeScript</b>, phát triển phía Client-side bằng <b>React.js, Next.js, HTML5/CSS3</b>, phía Server-side bằng <b>Node.js (Express, NestJS)</b> và cơ sở dữ liệu <b>MongoDB (Prisma ORM)</b>.',
      },
      {
        keys: ['dự án', 'projects', 'project', 'sản phẩm', 'làm được gì'],
        reply:
          'Một số dự án tiêu biểu gồm:<br>1. <b>E-commerce Premium</b>: Nền tảng bán hàng cao cấp tích hợp thanh toán, giỏ hàng động và CMS quản trị.<br>2. <b>SaaS Dashboard</b>: Hệ thống phân tích số liệu thời gian thực cho doanh nghiệp.<br>Bạn có thể cuộn xuống mục "Featured Projects" để xem chi tiết.',
      },
      {
        keys: ['cv', 'resume', 'tải cv', 'download cv', 'hồ sơ'],
        reply:
          'Bạn có thể tải trực tiếp bản CV PDF chính thức của ứng viên tại mục <b>Liên hệ & Tải CV</b> ở cuối trang chính!',
      },
      {
        keys: ['kinh nghiệm', 'experience', 'làm việc ở đâu', 'công ty'],
        reply:
          'Ứng viên có hơn 3 năm kinh nghiệm phát triển phần mềm:<br>- <b>Senior Frontend Developer</b> tại TechCorp (2024 - Hiện tại).<br>- <b>Fullstack Engineer</b> tại VNPT (2022 - 2024).<br>- Lập trình viên Freelance cho nhiều dự án trong và ngoài nước.',
      },
      {
        keys: ['liên hệ', 'contact', 'email', 'số điện thoại', 'sđt'],
        reply:
          'Bạn có thể gửi tin nhắn qua biểu mẫu liên hệ ở cuối trang, hoặc liên hệ trực tiếp qua Email: <b>admin@myportfolio.dev</b> | Hotline: <b>+84 987 654 321</b>.',
      },
    ],
    default:
      'Tôi là Trợ lý ảo AI được tích hợp mô hình Gemini 1.5 Flash. Bạn có thể hỏi tôi về <b>"kỹ năng"</b>, <b>"dự án"</b>, <b>"kinh nghiệm làm việc"</b> hoặc thông tin <b>"liên hệ"</b> của ứng viên này.',
  };

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const queryText = chatInput.value.trim();
    if (!queryText) return;

    // Append User Message
    appendMessage(queryText, 'user');
    chatInput.value = '';

    // Append Bot Typing Indicator
    const typingIndicator = showTypingIndicator();
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI thinking and reply (1.5 seconds)
    setTimeout(() => {
      typingIndicator.remove();

      const normalizedQuery = queryText.toLowerCase();
      let response = botAnswers.default;

      for (const item of botAnswers.keywords) {
        if (item.keys.some((k) => normalizedQuery.includes(k))) {
          response = item.reply;
          break;
        }
      }

      appendMessage(response, 'bot');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1200);
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender);
    msgDiv.innerHTML = text;
    chatMessages.appendChild(msgDiv);
  }

  function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('typing-indicator');
    indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(indicatorDiv);
    return indicatorDiv;
  }
}

/* ==========================================
   4. CONTACT FORM & LOCAL STORAGE SYNC
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById('portfolio-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Vui lòng điền đầy đủ các thông tin cần thiết!', 'error');
      return;
    }

    // Save mock contact to localStorage
    const newContact = {
      id: 'msg_' + Date.now(),
      name,
      email,
      subject,
      message,
      time: new Date().toLocaleString('vi-VN'),
      unread: true,
    };

    const currentContacts =
      JSON.parse(localStorage.getItem('myportfolio_contacts')) ||
      getMockContacts();
    currentContacts.unshift(newContact);
    localStorage.setItem(
      'myportfolio_contacts',
      JSON.stringify(currentContacts),
    );

    // Show Success Toast
    showToast(
      'Gửi tin nhắn liên hệ thành công! Admin sẽ phản hồi bạn sớm.',
      'success',
    );
    contactForm.reset();
  });
}

function getMockContacts() {
  return [
    {
      id: 'msg_1',
      name: 'Nguyễn Văn A',
      email: 'recruiter.a@vng.com.vn',
      subject: 'Cơ hội hợp tác vị trí Lead Frontend Engineer',
      message:
        'Chào bạn, chúng tôi rất ấn tượng với portfolio 3D của bạn. Chúng tôi muốn mời bạn tham gia buổi phỏng vấn giới thiệu dự án sắp tới của chúng tôi.',
      time: '14/07/2026, 10:30:15',
      unread: true,
    },
    {
      id: 'msg_2',
      name: 'Trần Thị B',
      email: 'hr.b@fpt.com',
      subject: 'Lời mời ứng tuyển dự án ngân hàng số',
      message:
        'Xin chào, phòng nhân sự FPT Software muốn trao đổi với bạn về cơ hội làm việc Remote với mức lương hấp dẫn.',
      time: '12/07/2026, 16:45:00',
      unread: false,
    },
  ];
}

/* ==========================================
   5. CMS DASHBOARD VIEWS & CRUD LOGIC
   ========================================== */
function initDashboard() {
  const sidebarBtns = document.querySelectorAll(
    '.sidebar-menu .sidebar-item-btn',
  );
  const tabViews = document.querySelectorAll('.dash-tab-view');

  if (sidebarBtns.length === 0 || tabViews.length === 0) return;

  // Tab Navigation Switching
  sidebarBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (!tabId) return;

      sidebarBtns.forEach((b) => b.classList.remove('active'));
      tabViews.forEach((v) => v.classList.remove('active'));

      btn.classList.add('active');
      const targetView = document.getElementById(tabId);
      if (targetView) {
        targetView.classList.add('active');
      }

      // Trigger custom tab load tasks
      if (tabId === 'tab-analytics') {
        loadAnalyticsChart();
      } else if (tabId === 'tab-contacts') {
        loadDashboardInbox();
      } else if (tabId === 'tab-projects') {
        loadDashboardProjects();
      }
    });
  });

  // Load default data
  loadAnalyticsChart();
  loadDashboardInbox();
  loadDashboardProjects();

  // Create Project Modal Logic
  const openModalBtn = document.getElementById('open-create-project-btn');
  const projectModal = document.getElementById('create-project-modal');
  const closeModalBtn = document.getElementById('close-project-modal');
  const cancelModalBtn = document.getElementById('cancel-project-btn');
  const projectForm = document.getElementById('create-project-form');

  if (openModalBtn && projectModal) {
    openModalBtn.addEventListener('click', () =>
      projectModal.classList.add('active'),
    );

    const closeModal = () => projectModal.classList.remove('active');

    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('p-title').value.trim();
      const state = document.getElementById('p-state').value;
      const tech = document
        .getElementById('p-tech')
        .value.split(',')
        .map((t) => t.trim());
      const desc = document.getElementById('p-desc').value.trim();

      if (!title || !desc) {
        showToast('Vui lòng nhập tên dự án và mô tả ngắn!', 'error');
        return;
      }

      // Add project mock
      const newProj = {
        id: 'proj_' + Date.now(),
        title,
        state,
        techStack: tech.filter((t) => t),
        description: desc,
        date: new Date().toLocaleDateString('vi-VN'),
      };

      const projects =
        JSON.parse(localStorage.getItem('myportfolio_projects')) ||
        getMockProjects();
      projects.unshift(newProj);
      localStorage.setItem('myportfolio_projects', JSON.stringify(projects));

      // Audit Log log
      addAuditLog(
        'Tạo mới dự án',
        `Đã tạo dự án "${title}" (Trạng thái: ${state})`,
        'CREATE',
      );

      showToast(`Đã thêm mới dự án "${title}" thành công!`, 'success');
      projectForm.reset();
      closeModal();
      loadDashboardProjects();
    });
  }
}

// 5.1 Analytics SVG Chart Drawer
function loadAnalyticsChart() {
  const chartSvg = document.querySelector('.bar-chart-svg');
  if (!chartSvg) return;

  const viewsData = [120, 180, 150, 240, 290, 210, 350, 420];
  const maxVal = Math.max(...viewsData);
  const bars = chartSvg.querySelectorAll('rect');

  // Dynamically size the bars in SVG
  bars.forEach((bar, index) => {
    const val = viewsData[index] || 100;
    const heightPercent = val / maxVal;
    const barHeight = heightPercent * 180; // max height is 180
    const yVal = 210 - barHeight;

    bar.setAttribute('height', barHeight);
    bar.setAttribute('y', yVal);
  });
}

// 5.2 CMS Project CRUD Loader
function loadDashboardProjects() {
  const tbody = document.getElementById('projects-table-body');
  if (!tbody) return;

  const projects =
    JSON.parse(localStorage.getItem('myportfolio_projects')) ||
    getMockProjects();
  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Không có dự án nào. Click "Thêm dự án" để tạo mới.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects
    .map((p) => {
      const stateBadgeClass =
        p.state === 'PUBLISHED'
          ? 'badge-published'
          : p.state === 'DRAFT'
            ? 'badge-draft'
            : 'badge-archived';
      return `
      <tr>
        <td style="font-weight: 600;">${p.title}</td>
        <td>${p.date}</td>
        <td>
          <div style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
            ${p.techStack.map((t) => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
        </td>
        <td><span class="project-badge ${stateBadgeClass}">${p.state}</span></td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-icon" onclick="editProjectMock('${p.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon delete" onclick="deleteProjectMock('${p.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join('');
}

function getMockProjects() {
  return [
    {
      id: 'proj_1',
      title: 'E-commerce Premium Platform',
      state: 'PUBLISHED',
      techStack: ['Next.js', 'Prisma', 'MongoDB', 'TailwindCSS'],
      description:
        'Nền tảng thương mại điện tử chuyên nghiệp hỗ trợ giỏ hàng động, thanh toán trực tuyến.',
      date: '14/07/2026',
    },
    {
      id: 'proj_2',
      title: 'SaaS Analytics Dashboard',
      state: 'PUBLISHED',
      techStack: ['React', 'D3.js', 'Node.js', 'Express'],
      description:
        'Bảng quản trị SaaS phân tích luồng truy cập và dữ liệu người dùng thời gian thực.',
      date: '10/06/2026',
    },
    {
      id: 'proj_3',
      title: 'AI Smart Chat Bot Widget',
      state: 'DRAFT',
      techStack: ['HTML5', 'CSS3', 'Gemini API', 'Vanilla JS'],
      description:
        'Widget trò chuyện thông minh tích hợp trí tuệ nhân tạo trả lời tự động.',
      date: '02/05/2026',
    },
  ];
}

// Global functions for project CRUD
window.deleteProjectMock = function (id) {
  const projects =
    JSON.parse(localStorage.getItem('myportfolio_projects')) ||
    getMockProjects();
  const projToDelete = projects.find((p) => p.id === id);
  if (!projToDelete) return;

  if (confirm(`Bạn chắc chắn muốn xóa dự án "${projToDelete.title}"?`)) {
    const updated = projects.filter((p) => p.id !== id);
    localStorage.setItem('myportfolio_projects', JSON.stringify(updated));
    showToast(`Đã xóa dự án "${projToDelete.title}"!`, 'success');
    addAuditLog('Xóa dự án', `Đã xóa dự án "${projToDelete.title}"`, 'DELETE');
    loadDashboardProjects();
  }
};

window.editProjectMock = function (id) {
  showToast(
    `Tính năng chỉnh sửa dự án sẽ khả dụng trên phiên bản Next.js sản xuất!`,
    'info',
  );
};

// 5.3 CMS Inbox Messages Loader
function loadDashboardInbox() {
  const listContainer = document.getElementById('inbox-messages-list');
  if (!listContainer) return;

  const contacts =
    JSON.parse(localStorage.getItem('myportfolio_contacts')) ||
    getMockContacts();
  if (contacts.length === 0) {
    listContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 3rem 0;">Không có thư liên hệ mới nào.</div>`;
    return;
  }

  listContainer.innerHTML = contacts
    .map(
      (c) => `
    <div class="inbox-item ${c.unread ? 'unread' : ''}" id="inbox_${c.id}">
      <div style="flex-grow: 1;">
        <div class="inbox-sender-info">
          <span class="inbox-sender-name">${c.name}</span>
          <span class="inbox-sender-email">${c.email}</span>
          <span class="inbox-time">${c.time}</span>
        </div>
        <div class="inbox-subject">${c.subject}</div>
        <div class="inbox-snippet">${c.message}</div>
      </div>
      <div class="inbox-actions">
        ${
          c.unread
            ? `
          <button class="btn-icon" title="Đánh dấu đã đọc" onclick="markReadMessage('${c.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </button>
        `
            : ''
        }
        <button class="btn-icon delete" title="Xóa tin nhắn" onclick="deleteMessage('${c.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `,
    )
    .join('');
}

window.markReadMessage = function (id) {
  const contacts =
    JSON.parse(localStorage.getItem('myportfolio_contacts')) ||
    getMockContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index !== -1) {
    contacts[index].unread = false;
    localStorage.setItem('myportfolio_contacts', JSON.stringify(contacts));
    showToast('Đã đánh dấu tin nhắn là đã đọc!', 'success');
    addAuditLog(
      'Cập nhật tin nhắn',
      `Đánh dấu thư từ ${contacts[index].name} là đã đọc`,
      'UPDATE',
    );
    loadDashboardInbox();
  }
};

window.deleteMessage = function (id) {
  const contacts =
    JSON.parse(localStorage.getItem('myportfolio_contacts')) ||
    getMockContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index !== -1) {
    if (confirm(`Bạn muốn xóa tin nhắn từ "${contacts[index].name}"?`)) {
      const name = contacts[index].name;
      const updated = contacts.filter((c) => c.id !== id);
      localStorage.setItem('myportfolio_contacts', JSON.stringify(updated));
      showToast('Đã xóa tin nhắn liên hệ!', 'success');
      addAuditLog('Xóa tin nhắn', `Xóa thư từ ${name}`, 'DELETE');
      loadDashboardInbox();
    }
  }
};

// 5.4 Audit Logs Manager
function addAuditLog(action, description, type) {
  const logs =
    JSON.parse(localStorage.getItem('myportfolio_audit_logs')) ||
    getMockAuditLogs();
  const newLog = {
    id: 'log_' + Date.now(),
    action,
    description,
    type,
    user: 'Portfolio Owner (Admin)',
    time: new Date().toLocaleString('vi-VN'),
  };
  logs.unshift(newLog);
  localStorage.setItem('myportfolio_audit_logs', JSON.stringify(logs));
  loadAuditLogsTable();
}

function loadAuditLogsTable() {
  const tbody = document.getElementById('audit-table-body');
  if (!tbody) return;

  const logs =
    JSON.parse(localStorage.getItem('myportfolio_audit_logs')) ||
    getMockAuditLogs();
  tbody.innerHTML = logs
    .map((l) => {
      let actionClass = 'action-auth';
      if (l.type === 'CREATE') actionClass = 'action-create';
      else if (l.type === 'UPDATE') actionClass = 'action-update';
      else if (l.type === 'DELETE') actionClass = 'action-delete';

      return `
      <tr>
        <td>${l.time}</td>
        <td><span class="audit-action ${actionClass}">${l.action}</span></td>
        <td>${l.description}</td>
        <td style="font-weight: 500;">${l.user}</td>
      </tr>
    `;
    })
    .join('');
}

// Render audit logs on page startup in case dashboard loads audit tab
setTimeout(() => {
  loadAuditLogsTable();
}, 200);

function getMockAuditLogs() {
  return [
    {
      id: 'log_1',
      action: 'Đăng nhập',
      description:
        'Đăng nhập thành công qua Google OAuth (admin@myportfolio.dev)',
      type: 'AUTH',
      user: 'Portfolio Owner (Admin)',
      time: '15/07/2026, 14:02:11',
    },
    {
      id: 'log_2',
      action: 'Cập nhật Profile',
      description: 'Đã tải lên tệp CV mới: CV_Senior_Frontend_Developer.pdf',
      type: 'UPDATE',
      user: 'Portfolio Owner (Admin)',
      time: '14/07/2026, 15:30:00',
    },
    {
      id: 'log_3',
      action: 'Cập nhật Dự án',
      description: 'Đã xuất bản dự án "E-commerce Premium Platform"',
      type: 'UPDATE',
      user: 'Portfolio Owner (Admin)',
      time: '14/07/2026, 11:22:15',
    },
  ];
}

/* ==========================================
   6. GLOBAL TOAST NOTIFICATION UTILITY
   ========================================== */
function showToast(message, type = 'success') {
  let container = document.querySelector('.notification-container');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('notification-container');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `notification-toast ${type}`;

  // Simple icon selector
  let icon = ``;
  if (type === 'success') {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === 'error') {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else if (type === 'warning') {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  } else {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    ${icon}
    <span style="font-weight: 500; font-size: 0.9rem;">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.style.animation =
      'fade-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
