// ============================================================
//  LibraHub – search.js  (Google Books API + localStorage)
// ============================================================

const GOOGLE_API_KEY = "AIzaSyDzCjBHkVwA42wQ3tSu9NN7C7trho7xTDA";
let allBooks = [];

function displayBooks(books) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    if (books.length === 0) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }

    books.forEach(book => {
        const div = document.createElement('div');
        div.classList.add('search-bottom-item');

        const coverHtml = book.coverImageUrl
            ? `<img src="${book.coverImageUrl}" alt="${book.title}" class="book-cover">`
            : `<div class="book-cover-placeholder"><i class="fa-solid fa-book-open"></i></div>`;

        div.innerHTML = `
            ${coverHtml}
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Publisher:</strong> ${book.publisher || 'N/A'}</p>
            <p><strong>Year:</strong> ${book.year || 'N/A'}</p>
        `;
        container.appendChild(div);
    });
}

function filterBooks() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (!query) { displayBooks(allBooks); return; }
    const filtered = allBooks.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)
    );
    displayBooks(filtered);
}

async function loadBooks() {
    const container = document.getElementById('search-results');
    container.innerHTML = '<p>Loading books...</p>';

    // ── 1. الكتب من localStorage ──────────────────────────
    const localBooks = DB.getBooks().map(b => ({
        title:         b.title,
        author:        b.author,
        coverImageUrl: b.coverImageUrl || '',
        publisher:     'Local',
        year:          'N/A'
    }));

    // ── 2. الكتب من Google Books API ──────────────────────
    try {
        const url      = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=40&printType=books&orderBy=relevance&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data     = await response.json();

        const googleBooks = (data.items || []).map(item => {
            const info = item.volumeInfo;
            return {
                title:         info.title || 'Unknown Title',
                author:        (info.authors || ['Unknown Author']).join(', '),
                coverImageUrl: info.imageLinks?.thumbnail?.replace('http://', 'https://') || '',
                publisher:     info.publisher || 'N/A',
                year:          info.publishedDate?.substring(0, 4) || 'N/A'
            };
        });

        // ── 3. دمج الاتنين (local أول) ───────────────────
        allBooks = [...localBooks, ...googleBooks];
        displayBooks(allBooks);

    } catch (err) {
        console.error("Load Error:", err);
        // لو Google فشلت، عرض الـ local بس
        allBooks = localBooks;
        displayBooks(allBooks);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    document.getElementById('search-button').addEventListener('click', filterBooks);
    document.getElementById('search-input').addEventListener('input', filterBooks);
    document.getElementById('search-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') filterBooks();
    });
});
