// ============================================================
//  LibraHub – dashboard.js
// ============================================================

const GOOGLE_API_KEY = "AIzaSyDzCjBHkVwA42wQ3tSu9NN7C7trho7xTDA";

window.addEventListener('DOMContentLoaded', async () => {

    const stats      = DB.getStats();
    const borrowed   = stats.borrowedBooks;
    const activeUsers = stats.activeUsers;

    // ── 1. Total Books من Google API ─────────────────────
    let totalBooks = 0;
    try {
        const url      = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=40&printType=books&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data     = await response.json();
        totalBooks     = data.totalItems || (data.items ? data.items.length : 0);
    } catch (err) {
        totalBooks = 0;
    }

    // ── 2. حساب الـ stats ─────────────────────────────────
    const available = totalBooks - borrowed;

    document.getElementById('total-books').textContent     = totalBooks.toLocaleString();
    document.getElementById('available-books').textContent = available > 0 ? available.toLocaleString() : 0;
    document.getElementById('borrowed-books').textContent  = borrowed;
    document.getElementById('active-users').textContent    = activeUsers;

    // ── 3. Recent Borrowings table ────────────────────────
    const borrowings = DB.getBorrowings();
    const tableBody  = document.querySelector('#recent-borrowings tbody');
    tableBody.innerHTML = '';

    if (borrowings.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No borrowings yet.</td></tr>`;
        return;
    }

    [...borrowings].reverse().forEach(item => {
        const borrowDate = item.borrowDate ? new Date(item.borrowDate).toLocaleDateString() : 'N/A';
        const dueDate    = item.dueDate    ? new Date(item.dueDate).toLocaleDateString()    : 'N/A';
        const row        = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title      || 'Unknown'}</td>
            <td>${item.memberName || 'Unknown'}</td>
            <td>${borrowDate}</td>
            <td>${dueDate}</td>
        `;
        tableBody.appendChild(row);
    });
});