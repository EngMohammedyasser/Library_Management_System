// ============================================================
//  LibraHub – db.js
//  Local "database" using localStorage
// ============================================================

const DB = {

    // ── Books ───────────────────────────────────────────────
    getBooks() {
        return JSON.parse(localStorage.getItem('lh_books') || '[]');
    },
    saveBooks(books) {
        localStorage.setItem('lh_books', JSON.stringify(books));
    },
    addBook(book) {
        const books = this.getBooks();
        book.bookId          = Date.now();
        book.availableCopies = parseInt(book.availableCopies) || 1;
        books.push(book);
        this.saveBooks(books);
        return book;
    },
    getAvailableBooks() {
        return this.getBooks().filter(b => b.availableCopies > 0);
    },

    // ── Members ─────────────────────────────────────────────
    getMembers() {
        return JSON.parse(localStorage.getItem('lh_members') || '[]');
    },
    saveMembers(members) {
        localStorage.setItem('lh_members', JSON.stringify(members));
    },
    addMember(member) {
        const members = this.getMembers();
        member.id = Date.now();
        members.push(member);
        this.saveMembers(members);
        return member;
    },

    // ── Borrowings ──────────────────────────────────────────
    getBorrowings() {
        return JSON.parse(localStorage.getItem('lh_borrowings') || '[]');
    },
    saveBorrowings(borrowings) {
        localStorage.setItem('lh_borrowings', JSON.stringify(borrowings));
    },
    addBorrowing(data) {
        const books     = this.getBooks();
        const bookIndex = books.findIndex(b => b.bookId === data.bookId);

        if (bookIndex === -1 || books[bookIndex].availableCopies < 1) {
            throw new Error("Book not available");
        }

        books[bookIndex].availableCopies -= 1;
        this.saveBooks(books);

        const borrowings = this.getBorrowings();
        data.id = Date.now();
        borrowings.push(data);
        this.saveBorrowings(borrowings);
        return data;
    },

    // ── Stats ────────────────────────────────────────────────
    getStats() {
        const books      = this.getBooks();
        const borrowings = this.getBorrowings();
        return {
            totalBooks:      books.length,
            availableCopies: books.reduce((s, b) => s + b.availableCopies, 0),
            borrowedBooks:   borrowings.length,
            activeUsers:     new Set(borrowings.map(b => b.memberId)).size
        };
    },

    // ── Seed demo members only ───────────────────────────────
    seed() {
        if (this.getMembers().length === 0) {
            ['Ahmed Mohamed|ahmed@email.com',
             'Sara Ali|sara@email.com',
             'Omar Hassan|omar@email.com']
            .forEach(entry => {
                const [name, email] = entry.split('|');
                this.addMember({ name, email });
            });
        }
    }
};

// Auto-seed members on first load
DB.seed();
