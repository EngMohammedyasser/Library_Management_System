// ============================================================
//  LibraHub – script.js  (Login & Register)
// ============================================================

function register() {
    const fullName        = document.getElementById('fullName').value.trim();
    const email           = document.getElementById('email').value.trim().toLowerCase();
    const password        = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!fullName || !email || !password || !confirmPassword) {
        alert("Please fill in all fields."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email."); return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters."); return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match."); return;
    }

    const users = JSON.parse(localStorage.getItem('lh_users') || '[]');
    if (users.find(u => u.email === email)) {
        alert("Email already registered. Please login."); return;
    }

    users.push({ fullName, email, password });
    localStorage.setItem('lh_users', JSON.stringify(users));
    alert("Account created! Please login.");
    window.location.href = "login.html";
}

function login() {
    const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert("Please enter your email and password."); return;
    }

    const users = JSON.parse(localStorage.getItem('lh_users') || '[]');
    const user  = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Incorrect email or password."); return;
    }

    localStorage.setItem('lh_session', JSON.stringify({ fullName: user.fullName, email: user.email }));
    window.location.href = "dashbord.html";
}
