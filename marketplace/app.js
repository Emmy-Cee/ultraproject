// ==================== Utility Functions ====================
const showAlert = (message, type = 'info') => {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    document.body.insertBefore(alertBox, document.body.firstChild);
    setTimeout(() => alertBox.remove(), 3000);
};

const getFromStorage = (key) => localStorage.getItem(key);
const saveToStorage = (key, value) => localStorage.setItem(key, value);
const removeFromStorage = (key) => localStorage.removeItem(key);

// ==================== Authentication ====================
const handleLogin = (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Demo authentication
    if (email === 'owner@marketplace.org' && password === 'password123') {
        saveToStorage('user', JSON.stringify({ 
            email, 
            role: 'business_owner',
            name: 'John Doe'
        }));
        saveToStorage('token', 'demo_token_' + Date.now());
        window.location.href = 'business-owner-dashboard.html';
    } else if (email === 'admin@marketplace.org' && password === 'password123') {
        saveToStorage('user', JSON.stringify({ 
            email, 
            role: 'admin',
            name: 'Admin User'
        }));
        saveToStorage('token', 'demo_token_' + Date.now());
        window.location.href = 'admin-dashboard.html';
    } else {
        showAlert('Invalid credentials. Use demo credentials from the form.', 'error');
    }
};

const handleRegister = (event) => {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }

    if (role === '') {
        showAlert('Please select a role!', 'error');
        return;
    }

    // Save user data
    const user = {
        name: firstName + ' ' + lastName,
        email,
        phone,
        role,
        registeredAt: new Date().toISOString()
    };

    saveToStorage('user', JSON.stringify(user));
    saveToStorage('token', 'demo_token_' + Date.now());
    
    showAlert('Registration successful! Redirecting...', 'success');
    setTimeout(() => {
        if (role === 'business_owner') {
            window.location.href = 'business-owner-dashboard.html';
        } else {
            window.location.href = 'marketplace.html';
        }
    }, 1500);
};

// ==================== Dashboard Functionality ====================
const initDashboard = () => {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');
            const tabId = item.getAttribute('data-tab');
            const tabElement = document.getElementById(tabId);
            if (tabElement) {
                tabElement.classList.add('active');
            }
        });
    });
};

// ==================== Modal Functionality ====================
const initModals = () => {
    const modal = document.getElementById('addBusinessModal');
    const addBtn = document.querySelector('.btn-add-business');
    const closeBtn = document.querySelector('.close');

    if (addBtn && modal) {
        addBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Handle modal form submission
    const modalForm = document.querySelector('#addBusinessModal .form');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showAlert('Business request created successfully!', 'success');
            modal.classList.remove('active');
            modalForm.reset();
        });
    }
};

// ==================== Form Handlers ====================
const initForms = () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
};

// ==================== Navbar Mobile Toggle ====================
const initMobileNav = () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
};

// ==================== Search and Filter ====================
const initSearch = () => {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const businessCards = document.querySelectorAll('.business-card');
            
            businessCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            // Implement category filtering logic
            console.log('Filter by category:', selectedCategory);
        });
    }
};

// ==================== Business Actions ====================
const initBusinessActions = () => {
    const deleteButtons = document.querySelectorAll('.business-actions .btn-delete');
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this business?')) {
                showAlert('Business deleted successfully!', 'success');
                btn.closest('.business-dashboard-card').remove();
            }
        });
    });

    // Product delete buttons
    const productDeleteButtons = document.querySelectorAll('.btn-icon.delete');
    productDeleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this product?')) {
                showAlert('Product deleted successfully!', 'success');
                btn.closest('tr').remove();
            }
        });
    });
};

// ==================== Admin Actions ====================
const initAdminActions = () => {
    const approveButtons = document.querySelectorAll('.request-card .btn-success');
    const rejectButtons = document.querySelectorAll('.request-card .btn-danger');

    approveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.request-card');
            const businessName = card.querySelector('h3').textContent;
            
            if (confirm(`Approve ${businessName}?`)) {
                card.classList.remove('pending');
                card.classList.add('approved');
                card.querySelector('.status-badge').textContent = 'Approved';
                card.querySelector('.status-badge').className = 'status-badge approved';
                showAlert(`${businessName} has been approved!`, 'success');
            }
        });
    });

    rejectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.request-card');
            const businessName = card.querySelector('h3').textContent;
            const notes = card.querySelector('textarea').value;
            
            if (!notes.trim()) {
                showAlert('Please add admin notes before rejecting', 'error');
                return;
            }

            if (confirm(`Reject ${businessName}?`)) {
                card.classList.remove('pending');
                card.classList.add('rejected');
                card.querySelector('.status-badge').textContent = 'Rejected';
                card.querySelector('.status-badge').className = 'status-badge rejected';
                showAlert(`${businessName} has been rejected!`, 'success');
            }
        });
    });

    // Filter tabs
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const requestCards = document.querySelectorAll('.request-card');
            
            requestCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (card.classList.contains(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
};

// ==================== Settings Form ====================
const initSettings = () => {
    const settingsForms = document.querySelectorAll('.settings-form');
    
    settingsForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showAlert('Settings updated successfully!', 'success');
            form.reset();
        });
    });
};

// ==================== Add to Cart (Demo) ====================
const initAddToCart = () => {
    const addToCartButtons = document.querySelectorAll('.btn:not(.btn-delete):not(.btn-primary):not(.btn-secondary):not(.btn-danger):not(.btn-success):not(.btn-warning)');
    
    // More specific selector for actual "Add to Cart" buttons
    const cartButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.includes('Add to Cart')
    );

    cartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productName = btn.closest('.product-card')?.querySelector('h3')?.textContent || 'Product';
            showAlert(`${productName} added to cart!`, 'success');
        });
    });
};

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    initForms();
    initDashboard();
    initModals();
    initMobileNav();
    initSearch();
    initBusinessActions();
    initAdminActions();
    initSettings();
    initAddToCart();

    // Log demo credentials on page load for development
    const currentPage = window.location.pathname;
    if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
        console.log('Demo Credentials:');
        console.log('Business Owner: owner@marketplace.org / password123');
        console.log('Admin: admin@marketplace.org / password123');
    }
});

// ==================== Logout Functionality ====================
const logout = () => {
    removeFromStorage('user');
    removeFromStorage('token');
    window.location.href = 'index.html';
};

// Check if logout buttons exist and add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const logoutButtons = document.querySelectorAll('.btn-logout');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    });
});
