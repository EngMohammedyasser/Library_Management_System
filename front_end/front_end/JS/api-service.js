
const API_CONFIG = {
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Handle API response and parse JSON
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Parsed JSON data
 */
async function handleResponse(response) {
    const contentType = response.headers.get('content-type');

    // Parse JSON response
    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    // Check if request was successful
    if (!response.ok) {
        // Extract error message from response
        const errorMessage = typeof data === 'object' && data.message
            ? data.message
            : typeof data === 'string'
                ? data
                : `خطأ: ${response.status} ${response.statusText}`;

        throw new Error(errorMessage);
    }

    return data;
}

/**
 * Make HTTP request to API
 * @param {string} endpoint - API endpoint (e.g., '/user/register')
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Object>} API response data
 */
async function makeRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    const config = {
        headers: { ...API_CONFIG.headers },
        ...options
    };

    // Add body if provided
    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);
        return await handleResponse(response);
    } catch (error) {
        // Handle network errors or other exceptions
        if (error.message.includes('Failed to fetch')) {
            throw new Error('فشل الاتصال بالخادم. تأكد من تشغيل الخادم الخلفي.');
        }
        throw error;
    }
}

/**
 * Store user data in localStorage
 * @param {Object} userData - User data to store
 */
function saveUserData(userData) {
    if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));

        // Also save individual fields for easy access
        if (userData.userId) localStorage.setItem('userId', userData.userId);
        if (userData.email) localStorage.setItem('userEmail', userData.email);
        if (userData.userName) localStorage.setItem('userName', userData.userName);
        if (userData.role) localStorage.setItem('userRole', userData.role);
    }
}

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null if not logged in
 */
function getUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Clear user data from localStorage (logout)
 */
function clearUserData() {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
}

/**
 * Check if user is logged in
 * @returns {boolean} True if logged in
 */
function isLoggedIn() {
    return getUserData() !== null;
}

// ==================== USER / AUTHENTICATION API ====================

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Promise<Object>} Registration response
 */
async function registerUser(name, email, password, confirmPassword) {
    const data = await makeRequest('/User/register', {
        method: 'POST',
        body: {
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }
    });

    // Automatically log in user after successful registration
    if (data.userId) {
        saveUserData({
            userId: data.userId,
            userName: data.userName,
            email: data.Email,
            role: 'Member' // Default role for new users
        });
    }

    return data;
}

/**
 * Login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Login response
 */
async function loginUser(email, password) {
    const data = await makeRequest('/User/login', {
        method: 'POST',
        body: {
            email: email,
            password: password
        }
    });

    // Save user data to localStorage
    if (data.userId) {
        saveUserData({
            userId: data.userId,
            email: data.email,
            role: data.role,
            userName: data.userName || data.email // Fallback to email if name not provided
        });
    }

    return data;
}

/**
 * Logout user
 */
function logoutUser() {
    clearUserData();
    // Optionally redirect to login page
    // window.location.href = 'login.html';
}

/**
 * Get all users (Admin function)
 * @returns {Promise<Array>} List of all users
 */
async function getAllUsers() {
    return await makeRequest('/User/getAllUsers', {
        method: 'GET'
    });
}

/**
 * Get all borrowed books with user details
 * @returns {Promise<Array>} List of borrowings with user and book info
 */
async function getUserBooks() {
    return await makeRequest('/User/UserBooks', {
        method: 'GET'
    });
}

// ==================== BOOK API ====================

/**
 * Get all available books
 * @returns {Promise<Array>} List of all books
 */
async function getAllBooks() {
    return await makeRequest('/Book/showAllBooks', {
        method: 'GET'
    });
}

/**
 * Search for a book by title
 * @param {string} title - Book title to search for
 * @returns {Promise<Object>} Book details
 */
async function getBookByTitle(title) {
    // Encode title for URL
    const encodedTitle = encodeURIComponent(title);
    return await makeRequest(`/Book/${encodedTitle}`, {
        method: 'GET'
    });
}

/**
 * Borrow a book
 * @param {number} userId - ID of the user borrowing the book
 * @param {number} bookId - ID of the book to borrow
 * @returns {Promise<Object>} Borrowing response
 */
async function borrowBook(userId, bookId) {
    return await makeRequest('/Book/Borrow', {
        method: 'POST',
        body: {
            userId: userId,
            bookId: bookId
        }
    });
}

/**
 * Add a new book (Admin function)
 * @param {Object} bookData - Book data (title, author, isbn, totalCopies, imageUrl)
 * @returns {Promise<Object>} Response with book ID
 */
async function addBook(bookData) {
    return await makeRequest('/Book/AddBook', {
        method: 'POST',
        body: bookData
    });
}

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Statistics object { totalBooks, available, borrowed, activeUsers }
 */
async function getDashboardStats() {
    return await makeRequest('/Book/stats', {
        method: 'GET'
    });
}

// ==================== HELPER FUNCTIONS FOR UI ====================

/**
 * Display error message to user (can be customized)
 * @param {string} message - Error message
 * @param {HTMLElement} container - Optional container element to display error in
 */
function displayError(message, container = null) {
    console.error('API Error:', message);

    if (container) {
        container.innerHTML = `
            <div style="color: red; padding: 10px; background: #ffe6e6; border: 1px solid red; border-radius: 5px; margin: 10px 0;">
                <strong>خطأ:</strong> ${message}
            </div>
        `;
    } else {
        alert(`خطأ: ${message}`);
    }
}

/**
 * Display success message to user (can be customized)
 * @param {string} message - Success message
 * @param {HTMLElement} container - Optional container element to display message in
 */
function displaySuccess(message, container = null) {
    console.log('Success:', message);

    if (container) {
        container.innerHTML = `
            <div style="color: green; padding: 10px; background: #e6ffe6; border: 1px solid green; border-radius: 5px; margin: 10px 0;">
                <strong>نجح:</strong> ${message}
            </div>
        `;
    } else {
        alert(`نجح: ${message}`);
    }
}

/**
 * Redirect to dashboard based on user role
 * @param {string} role - User role ('Admin' or 'Member')
 */
function redirectToDashboard(role) {
    if (role === 'Admin') {
        window.location.href = 'dashbord.html'; // Admin dashboard
    } else {
        window.location.href = 'index.html'; // Member home page
    }
}

/**
 * Check authentication and redirect if not logged in
 * @param {string} redirectUrl - URL to redirect to if not authenticated (default: login.html)
 */
function requireAuth(redirectUrl = 'login.html') {
    if (!isLoggedIn()) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// ==================== EXPORTS (for use in other scripts) ====================

// Make functions available globally
window.API = {
    // Configuration
    config: API_CONFIG,

    // User/Auth functions
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getUserBooks,

    // Book functions
    getAllBooks,
    getBookByTitle,
    borrowBook,
    addBook,
    getDashboardStats,

    // Utility functions
    getUserData,
    saveUserData,
    clearUserData,
    isLoggedIn,
    requireAuth,

    // UI helpers
    displayError,
    displaySuccess,
    redirectToDashboard
};

// Also expose individual functions for backwards compatibility
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getAllUsers = getAllUsers;
window.getUserBooks = getUserBooks;
window.getAllBooks = getAllBooks;
window.getBookByTitle = getBookByTitle;
window.borrowBook = borrowBook;
window.addBook = addBook;
window.getDashboardStats = getDashboardStats;
window.getUserData = getUserData;
window.isLoggedIn = isLoggedIn;

console.log('✅ API Service loaded successfully');
