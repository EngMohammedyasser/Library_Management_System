const apiUrl = "http://localhost:5042/api/Book/showAllBooks"; // Your API endpoint
let allBooks = [];

// Load all books when the page loads
async function loadAllBooks() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch books");

        allBooks = await response.json();
        displayBooks(allBooks);
    } catch (error) {
        console.error(error);
        document.getElementById("search-results").innerHTML = "<p>Error loading books.</p>";
    }
}

// Display books in the grid format
function displayBooks(books) {
    const container = document.getElementById("search-results");
    container.innerHTML = ""; // Clear previous results

    if (books.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("search-bottom-item");

        bookDiv.innerHTML = `
            ${book.coverImageUrl ? `<img src="${book.coverImageUrl}" alt="${book.title}" class="book-cover">` : ''}
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Available Copies:</strong> ${book.availableCopies > 0 ? book.availableCopies : '<span style="color:red;">Out of stock</span>'}</p>
        `;
        container.appendChild(bookDiv);
    });
}

// Filter books by title or author
function filterBooks() {
    const query = document.getElementById("search-input").value.trim().toLowerCase();

    if (!query) {
        displayBooks(allBooks);
        return;
    }

    const filtered = allBooks.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );

    displayBooks(filtered);
}

// Event listeners
document.getElementById("search-button").addEventListener("click", filterBooks);
document.getElementById("search-input").addEventListener("input", filterBooks);

// Initialize page
window.addEventListener("DOMContentLoaded", loadAllBooks);
