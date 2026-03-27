document.addEventListener('DOMContentLoaded', () => {

    // ===== LOGIN STATE SYSTEM =====
    const userBadge = document.getElementById('userBadge');
    const openLoginBtn = document.getElementById('openLoginBtn');
    const donorNavBtn = document.getElementById('donorNavBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userAvatarEl = document.getElementById('userAvatar');
    const userNameEl = document.getElementById('userName');

    function showLoggedInState(name, provider) {
        // Store in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify({ name, provider }));

        // Update navbar
        if (userBadge) userBadge.classList.remove('hidden');
        if (openLoginBtn) openLoginBtn.classList.add('hidden');
        if (donorNavBtn) donorNavBtn.classList.add('hidden');

        // Set avatar initial & name
        const initial = name.charAt(0).toUpperCase();
        const shortName = name.split(' ')[0];
        if (userAvatarEl) userAvatarEl.textContent = initial;
        if (userNameEl) userNameEl.textContent = shortName;
    }

    function showLoggedOutState() {
        localStorage.removeItem('loggedInUser');
        if (userBadge) userBadge.classList.add('hidden');
        if (openLoginBtn) openLoginBtn.classList.remove('hidden');
        if (donorNavBtn) donorNavBtn.classList.remove('hidden');
    }

    // Restore session on page load
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
        try {
            const { name, provider } = JSON.parse(savedUser);
            showLoggedInState(name, provider);
        } catch(e) { localStorage.removeItem('loggedInUser'); }
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showLoggedOutState();
            showToast('👋 You have been logged out successfully.', '#64748b');
        });
    }

    // Modal open/close events
    const loginModal = document.getElementById('loginModal');
    const closeLoginBtn = document.getElementById('closeLoginBtn');

    if (openLoginBtn && loginModal) {
        openLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeLoginBtn && loginModal) {
        closeLoginBtn.addEventListener('click', () => {
            loginModal.classList.add('hidden');
            document.body.style.overflow = '';
        });
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }

    // Social Login — Open Account Picker step
    let currentProvider = '';
    window.openAccountPicker = function(provider) {
        currentProvider = provider;
        const picker = document.getElementById('accountPicker');
        const socialLoginRow = picker?.previousElementSibling;
        const dividerEl = document.querySelector('.divider');
        const mainForm = document.querySelector('#donor-login .modal-form');

        if (!picker) return;

        // Update picker UI for the chosen provider
        document.getElementById('pickerProviderName').textContent = `Sign in with ${provider}`;
        const icon = document.getElementById('pickerProviderIcon');
        icon.textContent = provider === 'Google' ? '🔵' : '🍎';

        // Hide regular content, show picker
        if(socialLoginRow) socialLoginRow.style.display = 'none';
        if(dividerEl) dividerEl.style.display = 'none';
        if(mainForm) mainForm.style.display = 'none';
        picker.classList.remove('hidden');

        // Clear previous values
        document.getElementById('pickerName').value = '';
        document.getElementById('pickerEmail').value = '';
    };

    window.closeAccountPicker = function() {
        const picker = document.getElementById('accountPicker');
        const socialLoginRow = picker?.previousElementSibling;
        const dividerEl = document.querySelector('.divider');
        const mainForm = document.querySelector('#donor-login .modal-form');

        picker?.classList.add('hidden');
        if(socialLoginRow) socialLoginRow.style.display = '';
        if(dividerEl) dividerEl.style.display = '';
        if(mainForm) mainForm.style.display = '';
    };

    window.confirmSocialLogin = function() {
        const name = document.getElementById('pickerName').value.trim();
        const email = document.getElementById('pickerEmail').value.trim();
        
        if(!name || !email) {
            document.getElementById('pickerName').style.borderColor = !name ? '#dc2626' : '';
            document.getElementById('pickerEmail').style.borderColor = !email ? '#dc2626' : '';
            return;
        }

        const btn = document.getElementById('pickerContinueBtn');
        btn.classList.add('btn-loading');
        btn.disabled = true;

        setTimeout(() => {
            btn.classList.remove('btn-loading');
            btn.disabled = false;
            closeAccountPicker();

            const closeBtn = document.getElementById('closeLoginBtn');
            if(closeBtn) closeBtn.click();

            showLoggedInState(name, currentProvider);
            showToast(`✔️ Signed in with ${currentProvider} as ${name}!`, '#10b981');
        }, 1200);
    };

    // Email/Pass login handler — reads actual name & email from input
    window.simulateLogin = function(btn) {
        const nameInput = document.getElementById('donorLoginName');
        const emailInput = document.getElementById('donorEmail');
        const hospitalInput = document.getElementById('hospitalName');
        const isHospital = btn.classList.contains('btn-warning');

        let displayName = 'Donor';
        if (!isHospital && nameInput && nameInput.value.trim()) {
            displayName = nameInput.value.trim();
        } else if (!isHospital && emailInput && emailInput.value.trim()) {
            displayName = emailInput.value.trim().split('@')[0];
        } else if (isHospital && hospitalInput && hospitalInput.value.trim()) {
            displayName = hospitalInput.value.trim();
        } else if (isHospital) {
            displayName = 'Hospital Portal';
        }

        btn.classList.add('btn-loading');
        
        setTimeout(() => {
            btn.classList.remove('btn-loading');
            const closeBtn = document.getElementById('closeLoginBtn');
            if (closeBtn) closeBtn.click();
            
            showLoggedInState(displayName, isHospital ? 'Hospital' : 'Email');
            showToast(isHospital
                ? `🏥 Welcome, ${displayName}!`
                : `✔️ Welcome back, ${displayName}!`, isHospital ? '#b91c1c' : '#10b981');
        }, 1500);
    };

    // ===== \ud83d\udd14 NOTIFICATION BELL SYSTEM =====
    const notifBell = document.getElementById('notifBell');
    const notifDropdown = document.getElementById('notifDropdown');
    const notifBadge = document.getElementById('notifBadge');
    const notifList = document.getElementById('notifList');
    const notifEmpty = document.getElementById('notifEmpty');
    const notifClear = document.getElementById('notifClear');

    const DEFAULT_NOTIFS = [
        { text: '🚨 URGENT: 3 units of O- needed at City General!', time: '2 min ago', dot: '' },
        { text: '✅ New donor registered: Arjun M. (B+ blood group)', time: '15 min ago', dot: 'green' },
        { text: '⚠️ AB- stock is critically low (4 units remaining)', time: '1 hr ago', dot: 'yellow' }
    ];

    let notifications = JSON.parse(localStorage.getItem('notifData')) || [...DEFAULT_NOTIFS];

    function renderNotifications() {
        notifList.innerHTML = '';
        if (notifications.length === 0) {
            notifEmpty.classList.remove('hidden');
            notifBadge.classList.add('hidden');
            return;
        }
        notifEmpty.classList.add('hidden');
        notifBadge.classList.remove('hidden');
        notifBadge.textContent = notifications.length;
        notifications.forEach((n, i) => {
            const li = document.createElement('li');
            li.className = 'notif-item';
            li.innerHTML = `<span class="notif-dot ${n.dot}"></span><div><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div>`;
            notifList.appendChild(li);
        });
    }
    renderNotifications();

    // Toggle dropdown
    if (notifBell) {
        notifBell.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
        });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!document.getElementById('notifWrap')?.contains(e.target)) {
            notifDropdown?.classList.add('hidden');
        }
    });

    // Clear all
    if (notifClear) {
        notifClear.addEventListener('click', () => {
            notifications = [];
            localStorage.setItem('notifData', JSON.stringify(notifications));
            renderNotifications();
        });
    }

    // Public function to push a new notification (called from donor/request forms)
    window.pushNotification = function(text, dot = '') {
        notifications.unshift({ text, time: 'Just now', dot });
        if (notifications.length > 10) notifications.pop();
        localStorage.setItem('notifData', JSON.stringify(notifications));
        renderNotifications();
        // Briefly animate the bell
        if (notifBell) { notifBell.style.transform = 'rotate(20deg) scale(1.3)'; setTimeout(() => notifBell.style.transform = '', 400); }
    };

    // ===== \ud83d\udd0d BLOOD AVAILABILITY SEARCH =====
    const HOSPITAL_NAMES = ['City General Hospital', 'Metro Care Center', "St. Jude's Medical", 'Apollo Blood Bank', 'LifeLine Hospital'];

    window.searchBlood = function() {
        const bg = document.getElementById('searchBloodGroup').value;
        if (!bg) return;

        const bgIndex = BLOOD_GROUPS.indexOf(bg);
        const units = bgIndex !== -1 ? stockData[bgIndex] : 0;
        const resultsDiv = document.getElementById('searchResults');
        const cardsDiv = document.getElementById('searchResultCards');

        // Generate 4 mock hospital results based on live stock
        const hospitals = HOSPITAL_NAMES.slice(0, 4).map((name, i) => {
            const availUnits = Math.max(0, Math.round(units * [1, 0.6, 0.4, 0.2][i]));
            const status = availUnits > 20 ? 'available' : availUnits > 5 ? 'low' : 'critical';
            const statusLabel = availUnits > 20 ? '✅ Available' : availUnits > 5 ? '⚠️ Low Stock' : '🔴 Critical';
            return { name, units: availUnits, status, statusLabel };
        });

        cardsDiv.innerHTML = hospitals.map(h => `
            <div class="result-card">
                <div class="rc-blood">${bg}</div>
                <div class="rc-hospital">${h.name}</div>
                <div class="rc-units">${h.units} units available</div>
                <span class="rc-status ${h.status}">${h.statusLabel}</span>
            </div>
        `).join('');

        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    function showToast(message, bgColor) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.querySelector('.toast-message').textContent = message;
        toast.style.background = bgColor || '#10b981';
        toast.classList.remove('hidden', 'fade-out');
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.classList.add('hidden'), 500);
        }, 3000);
    }

    // --- Typewriter Effect ---
    const phrases = ["Save Lives.", "Be a Real Hero.", "Make a Difference.", "Unite the City."];
    let phraseIndex = 0;
    let letterIndex = 0;
    let currentPhrase = "";
    let isDeleting = false;
    const typewriterElement = document.querySelector('.typewriter');
    
    if(typewriterElement) {
        const type = () => {
            const currentString = phrases[phraseIndex];
            
            if(isDeleting) {
                currentPhrase = currentString.substring(0, letterIndex - 1);
                letterIndex--;
            } else {
                currentPhrase = currentString.substring(0, letterIndex + 1);
                letterIndex++;
            }
            
            typewriterElement.textContent = currentPhrase;
            
            let typingSpeed = isDeleting ? 40 : 120;
            
            if(!isDeleting && currentPhrase === currentString) {
                typingSpeed = 2500; // Pause at end of sentence
                isDeleting = true;
            } else if(isDeleting && currentPhrase === '') {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 600; // Pause before starting new word
            }
            
            setTimeout(type, typingSpeed);
        };
        setTimeout(type, 1000);
    }

    // Tab switching in modal
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if(tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.add('hidden'));
                
                btn.classList.add('active');
                const targetTab = document.getElementById(btn.getAttribute('data-tab'));
                if(targetTab) targetTab.classList.remove('hidden');
            });
        });
    }

    // --- State Management ---
    const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const DEFAULT_STOCK = [120, 45, 150, 30, 80, 20, 200, 60];

    // Load from localStorage or use defaults
    let stockData = JSON.parse(localStorage.getItem('bloodStockData'));
    if (!stockData || stockData.length !== 8) {
        stockData = [...DEFAULT_STOCK];
        localStorage.setItem('bloodStockData', JSON.stringify(stockData));
    }

    // Chart instances
    let myStockChart = null;

    // --- Dark Mode Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                themeToggle.textContent = '☀️';
            } else {
                themeToggle.textContent = '🌙';
            }
            localStorage.setItem('theme', theme);

            // Render chart axes correctly across themes
            if (myStockChart) {
                const textColor = theme === 'dark' ? '#cbd5e1' : '#64748b';
                myStockChart.options.scales.y.ticks.color = textColor;
                myStockChart.options.scales.x.ticks.color = textColor;
                myStockChart.update();
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const bars = hamburger.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a:not(.theme-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (hamburger) {
                    const bars = hamburger.querySelectorAll('.bar');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });
    });

    // --- Toast Notification Logic ---
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    const toastClose = document.querySelector('.toast-close');

    function showToast(message, type = 'success') {
        toast.style.backgroundColor = type === 'success' ? '#10b981' : '#dc2626';
        toast.classList.remove('hidden', 'fade-out');
        toastMessage.textContent = message;

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.classList.add('hidden'), 500);
        }, 4000);
    }

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.classList.add('hidden'), 500);
        });
    }

    // --- Form Submissions ---

    // Register Donor
    const donorForm = document.getElementById('donorForm');
    if (donorForm) {
        donorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const bloodGroup = document.getElementById('bloodGroup').value;

            if (fullName && bloodGroup) {
                const bgIndex = BLOOD_GROUPS.indexOf(bloodGroup);
                if (bgIndex !== -1) {
                    stockData[bgIndex] += 1;
                    updateChartAndStorage();
                }

                showToast(`Thank you, ${fullName}! You are now registered as a ${bloodGroup} donor.`, 'success');
                pushNotification(`✅ New donor registered: ${fullName} (${bloodGroup})`, 'green');
                donorForm.reset();
            }
        });
    }

    // Emergency Request
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const patientName = document.getElementById('patientName').value;
            const hospital = document.getElementById('hospital').value;
            const reqBloodGroup = document.getElementById('reqBloodGroup').value;
            const units = parseInt(document.getElementById('units').value);

            const bgIndex = BLOOD_GROUPS.indexOf(reqBloodGroup);
            if (bgIndex !== -1) {
                if (stockData[bgIndex] >= units) {
                    stockData[bgIndex] -= units;
                    updateChartAndStorage();
                    showToast(`EMERGENCY: ${units} units of ${reqBloodGroup} dispatched for ${patientName} at ${hospital}.`, 'success');

                    if (stockData[bgIndex] < 10) {
                        setTimeout(() => {
                            showToast(`CRITICAL ALERT: ${reqBloodGroup} stock extremely low (${stockData[bgIndex]} units)!`, 'error');
                        }, 4500);
                    }
                } else {
                    showToast(`ERROR: Insufficient ${reqBloodGroup} units. Only ${stockData[bgIndex]} available.`, 'error');
                }
            }
            requestForm.reset();
        });
    }

    function updateChartAndStorage() {
        localStorage.setItem('bloodStockData', JSON.stringify(stockData));
        if (myStockChart) {
            myStockChart.data.datasets[0].data = stockData;
            myStockChart.update();
        }
    }

    // --- Patient Feedback logic ---
    const DEFAULT_FEEDBACKS = [
        { name: "Sarah L.", message: "LifeStream found an O- donor for my son's surgery in 20 minutes. Forever grateful!" },
        { name: "Mark Davis", message: "The best and fastest blood network. Registering as a donor was so seamless." },
        { name: "City General Hospital", message: "This dashboard radically improved our emergency response times." }
    ];

    let feedbackData = JSON.parse(localStorage.getItem('patientFeedbackData'));
    if (!feedbackData || feedbackData.length === 0) {
        feedbackData = [...DEFAULT_FEEDBACKS];
        localStorage.setItem('patientFeedbackData', JSON.stringify(feedbackData));
    }

    const feedbackGrid = document.getElementById('feedbackGrid');

    function renderFeedbacks() {
        if (!feedbackGrid) return;
        feedbackGrid.innerHTML = '';
        const displayFeeds = feedbackData.slice(-6).reverse();

        displayFeeds.forEach(fb => {
            const card = document.createElement('div');
            card.className = 'feedback-card';
            card.innerHTML = `<p class="quote">"${fb.message}"</p><div class="author">— ${fb.name}</div>`;
            feedbackGrid.appendChild(card);
        });
    }
    renderFeedbacks();

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fbName = document.getElementById('fbName').value;
            const fbMessage = document.getElementById('fbMessage').value;

            if (fbName && fbMessage) {
                feedbackData.push({ name: fbName, message: fbMessage });
                localStorage.setItem('patientFeedbackData', JSON.stringify(feedbackData));
                renderFeedbacks();
                showToast("Thank you! Your feedback has been posted successfully.", 'success');
                feedbackForm.reset();
            }
        });
    }

    // --- Navbar Scroll Effect & Scroll Progress ---
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        // Shadow Effect
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Progress Bar Calculation
        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
    });

    // --- Stat Counter Animation (New Feature!) ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const isK = stat.innerText.includes('k+');
            const target = isK ? 12 : parseInt(stat.innerText);
            let count = 0;
            const inc = target / 40;

            const updateCount = () => {
                count += inc;
                if (count < target) {
                    stat.innerText = Math.ceil(count) + (isK ? 'k+' : '');
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + (isK ? 'k+' : '');
                }
            };
            updateCount();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateCounters();
        }
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats');
    if (statsContainer) statsObserver.observe(statsContainer);

    // --- Chart.js Premium Gradients Implementations ---
    const stockCtx = document.getElementById('bloodStockChart');
    const demoCtx = document.getElementById('demographicsChart');
    const chartTextColor = document.body.classList.contains('dark-theme') ? '#cbd5e1' : '#64748b';

    if (stockCtx && typeof Chart !== 'undefined') {
        const ctx2d = stockCtx.getContext('2d');

        // Custom Canvas Gradients for Each Blood Group
        const createGrad = (color1, color2) => {
            const g = ctx2d.createLinearGradient(0, 0, 0, 400);
            g.addColorStop(0, color1);
            g.addColorStop(1, color2);
            return g;
        };

        const bgGradients = [
            createGrad('#ef4444', '#991b1b'), // A+ Red
            createGrad('#f97316', '#c2410c'), // A- Orange
            createGrad('#eab308', '#a16207'), // B+ Yellow
            createGrad('#22c55e', '#166534'), // B- Green
            createGrad('#06b6d4', '#155e75'), // AB+ Cyan
            createGrad('#3b82f6', '#1e40af'), // AB- Blue
            createGrad('#a855f7', '#6b21a8'), // O+ Purple
            createGrad('#ec4899', '#9d174d')  // O- Pink
        ];

        myStockChart = new Chart(stockCtx, {
            type: 'bar',
            data: {
                labels: BLOOD_GROUPS,
                datasets: [{
                    label: 'Available Units (Pints)',
                    data: stockData,
                    backgroundColor: bgGradients,
                    hoverBackgroundColor: bgGradients,
                    borderRadius: 6,
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 14, family: 'Inter' },
                        bodyFont: { size: 14, family: 'Inter' },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(150, 150, 150, 0.1)', drawBorder: false },
                        ticks: { color: chartTextColor, font: { family: 'Inter' } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: chartTextColor, font: { family: 'Inter', weight: 'bold' } }
                    }
                }
            }
        });
    }

    if (demoCtx && typeof Chart !== 'undefined') {
        const ctx2dDemo = demoCtx.getContext('2d');
        const createGradDemo = (c1, c2) => {
            const g = ctx2dDemo.createLinearGradient(0, 0, 0, 300);
            g.addColorStop(0, c1);
            g.addColorStop(1, c2);
            return g;
        };

        // Cohesive Premium Crimson Scale for Demographics
        const g1 = createGradDemo('#fecaca', '#f87171'); // Light Pastel Red
        const g2 = createGradDemo('#ef4444', '#b91c1c'); // Primary Red
        const g3 = createGradDemo('#b91c1c', '#7f1d1d'); // Dark Red
        const g4 = createGradDemo('#7f1d1d', '#450a0a'); // Deep Maroon

        new Chart(demoCtx, {
            type: 'doughnut',
            data: {
                labels: ['18-25 yrs', '26-35 yrs', '36-45 yrs', '46-60 yrs'],
                datasets: [{
                    data: [35, 45, 15, 5],
                    backgroundColor: [g1, g2, g3, g4],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { position: 'bottom', labels: { font: { family: 'Inter' }, color: chartTextColor } },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 12,
                        cornerRadius: 8
                    }
                }
            }
        });
    }

    // --- Interactive Compatibility Matrix Engine ---
    const compatData = {
        'A+': { donate: ['A+', 'AB+'], receive: ['A+', 'A-', 'O+', 'O-'] },
        'O+': { donate: ['O+', 'A+', 'B+', 'AB+'], receive: ['O+', 'O-'] },
        'B+': { donate: ['B+', 'AB+'], receive: ['B+', 'B-', 'O+', 'O-'] },
        'AB+': { donate: ['AB+'], receive: ['Everyone'] },
        'A-': { donate: ['A+', 'A-', 'AB+', 'AB-'], receive: ['A-', 'O-'] },
        'O-': { donate: ['Everyone'], receive: ['O-'] },
        'B-': { donate: ['B+', 'B-', 'AB+', 'AB-'], receive: ['B-', 'O-'] },
        'AB-': { donate: ['AB+', 'AB-'], receive: ['AB-', 'A-', 'B-', 'O-'] }
    };

    const compatBtns = document.querySelectorAll('.compat-btn');
    const donateTargets = document.getElementById('donateTargets');
    const receiveTargets = document.getElementById('receiveTargets');

    if (compatBtns.length > 0) {
        compatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                compatBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const bg = btn.getAttribute('data-bg');
                const data = compatData[bg];

                donateTargets.innerHTML = data.donate.map(b => `<span class="badge-bg donate-badge">${b}</span>`).join('');
                receiveTargets.innerHTML = data.receive.map(b => `<span class="badge-bg receive-badge">${b}</span>`).join('');
                const centerBlood = document.getElementById('centerBlood');
                if (centerBlood) centerBlood.innerText = bg;
            });
        });
    }
});
