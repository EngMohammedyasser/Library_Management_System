const apiUrl = "http://localhost:5042/api/Book/showAllBooks";

async function loadDashboardData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch books');

        const books = await response.json();

        let totalBooks = 0;
        let availableBooks = 0;
        let borrowedBooks = 0;

        books.forEach(book => {
            availableBooks += book.availableCopies;
            if(books.borrowings != null)
             borrowedBooks += 1;
        });

        totalBooks = books.length;

        document.getElementById("total-books").textContent =totalBooks;
        document.getElementById("available-books").textContent = availableBooks;
        document.getElementById("borrowed-books").textContent = borrowedBooks;

        // Placeholder for active users
        document.getElementById("active-users").textContent = 25;
    } catch (error) {
        console.error(error);
    }
}

window.addEventListener('DOMContentLoaded', loadDashboardData);
