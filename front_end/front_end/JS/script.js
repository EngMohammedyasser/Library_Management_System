// ============================================================
// ملف التشغيل النهائي - مطابق تماماً لملفات الـ HTML المرفوعة
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    // --- 1. صفحة تسجيل الدخول (login.html) ---
    if (path.includes("login.html")) {
        const loginBtn = document.querySelector(".log-submit");
        if (loginBtn) {
            loginBtn.addEventListener("click", async () => {
                const email = document.querySelector("input[type='email']").value;
                const password = document.querySelector(".pas-input").value;
                try {
                    const data = await API.loginUser(email, password);
                    API.displaySuccess("تم تسجيل الدخول بنجاح!");
                    API.redirectToDashboard(data.role);
                } catch (error) { API.displayError(error.message); }
            });
        }
    }

    // --- 2. صفحة التسجيل (register.html) ---
    if (path.includes("register.html")) {
        const regBtn = document.querySelector(".log-submit");
        if (regBtn) {
            regBtn.addEventListener("click", async () => {
                const inputs = document.querySelectorAll(".register-container-meddilediv input");
                try {
                    await API.registerUser(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value);
                    API.displaySuccess("تم إنشاء الحساب! يمكنك الآن تسجيل الدخول.");
                    setTimeout(() => window.location.href = "login.html", 2000);
                } catch (error) { API.displayError(error.message); }
            });
        }
    }

    // --- 3. صفحة البحث (search.html) ---
    // تم التعديل ليطابق الكلاسات: .search-upper-input و .search-upper-button
    if (path.includes("search.html")) {
        const searchBtn = document.querySelector(".search-upper-button");
        const searchInput = document.querySelector(".search-upper-input");
        const resultsDiv = document.querySelector(".search-bottom");

        if (searchBtn) {
            searchBtn.addEventListener("click", async () => {
                const title = searchInput.value;
                try {
                    const book = await API.getBookByTitle(title);
                    resultsDiv.innerHTML = `
                        <div class="search-bottom-item" style="width:100%; padding:20px; background:white; border-radius:10px;">
                            <h3>${book.title}</h3>
                            <p>المؤلف: ${book.author}</p>
                            <p>ISBN: ${book.isbn}</p>
                            <p>النسخ المتاحة: ${book.availableCopies}</p>
                            <button class="request-btn" onclick="handleBorrowAction(${book.bookId})">استعارة الآن</button>
                        </div>`;
                } catch (error) { API.displayError("الكتاب غير موجود", resultsDiv); }
            });
        }
    }

    // --- 4. صفحة إضافة كتاب (add.html) ---
    if (path.includes("add.html")) {
        const addBtn = document.querySelector(".AddBook-btn");
        if (addBtn) {
            addBtn.addEventListener("click", async () => {
                const title = document.querySelector(".booktitle-input").value;
                const otherInputs = document.querySelectorAll(".author-div input");
                const bookData = {
                    title: title,
                    author: otherInputs[0].value,
                    isbn: otherInputs[1].value,
                    totalCopies: parseInt(otherInputs[2].value),
                    imageUrl: otherInputs[3].value
                };
                try {
                    await API.addBook(bookData);
                    API.displaySuccess("تم إضافة الكتاب للمكتبة!");
                    window.location.href = "dashbord.html";
                } catch (error) { API.displayError(error.message); }
            });
        }
    }

    // --- 5. لوحة التحكم (dashbord.html) ---
    if (path.includes("dashbord.html")) {
        loadDashboardData();
    }

    // --- 6. تسجيل الخروج (موجود في الهيدر لكل الصفحات) ---
    const logoutBtn = document.querySelector(".log-out-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            API.logoutUser();
            window.location.href = "index.html";
        });
    }
});

async function loadDashboardData() {
    try {
        // تحديث الأرقام (Stats)
        const stats = await API.getDashboardStats();
        const h2s = document.querySelectorAll(".after-login-dashbord-upperdiv-item h2");
        if (h2s.length >= 4) {
            h2s[0].innerText = stats.totalBooks;
            h2s[1].innerText = stats.available;
            h2s[2].innerText = stats.borrowed;
            h2s[3].innerText = stats.activeUsers;
        }

        // تحديث جدول الاستعارات الأخير
        const borrowings = await API.getUserBooks();
        const container = document.querySelector(".after-login-dashbord-lowerdiv-div2");
        if (container) {
            container.innerHTML = borrowings.map(b => `
                <div style="padding:10px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between;">
                    <span><strong>${b.userName}</strong> استعار <strong>${b.title}</strong></span>
                    <span>${new Date(b.borrowDate).toLocaleDateString()}</span>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

// دالة مساعدة لزر الاستعارة في نتائج البحث
window.handleBorrowAction = async (bookId) => {
    const user = API.getUserData();
    if (!user) { alert("يرجى تسجيل الدخول أولاً"); return; }
    try {
        await API.borrowBook(user.userId, bookId);
        alert("تمت الاستعارة بنجاح!");
        window.location.reload();
    } catch (error) { alert(error.message); }
};