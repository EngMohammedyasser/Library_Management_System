const booksUrl = "http://localhost:5042/api/Book/showAllBooks";
const borrowingsUrl = "http://localhost:5042/api/User/UserBooks";

async function loadDashboardData() {
    try {
        // 1. Fetch Stats (Total, Available, etc.)
        const booksResponse = await fetch(booksUrl);
        if (!booksResponse.ok) throw new Error('Failed to fetch books');
        const books = await booksResponse.json();

        let totalBooks = books.length;
        let availableCopies = 0;

        books.forEach(book => {
            availableCopies += book.availableCopies;
        });

        document.getElementById("total-books").textContent = totalBooks;
        document.getElementById("available-books").textContent = availableCopies;

        // 2. Fetch Borrowing Details for the Table and Stats
        const borrowResponse = await fetch(borrowingsUrl);
        if (!borrowResponse.ok) throw new Error('Failed to fetch borrowings');
        const borrowings = await borrowResponse.json();

        // Update stats from borrowing data
        document.getElementById("borrowed-books").textContent = borrowings.length;
        
        // Count unique active users from the borrowing list
        const activeUsers = new Set(borrowings.map(b => b.memberId)).size;
        document.getElementById("active-users").textContent = activeUsers;

        // 3. Populate the Recent Borrowings Table
        const tableBody = document.querySelector("#recent-borrowings tbody");
        tableBody.innerHTML = ""; // Clear placeholder

        borrowings.forEach(item => {
            const row = document.createElement("tr");
            
            // Format dates for better readability
            const bDate = new Date(item.borrowDate).toLocaleDateString();
            const dDate = new Date(item.duedate).toLocaleDateString();

            row.innerHTML = `
                <td>${item.title}</td>
                <td>${item.memberName}</td>
                <td>${bDate}</td>
                <td>${dDate}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
    }
}

window.addEventListener('DOMContentLoaded', loadDashboardData);