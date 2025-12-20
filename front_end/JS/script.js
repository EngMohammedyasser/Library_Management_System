async function register() {
    const name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;

    const response = await fetch("http://localhost:5042/api/User/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            email,
            password,
            confirmPassword,
            role
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data);
        return;
    }

    alert("Registration successful");
    window.location.href = "login.html";
}


async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Email and password are required");
        return;
    }

    try {
        const response = await fetch("http://localhost:5042/api/User/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data);
            return;
        }

        // Save user data
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);

        alert("Login successful");

        // Redirect based on role returned from backend
        if (data.role === "Admin") {
            window.location.href = "dashbord.html";
        } else {
            window.location.href = "search.html";
        }

    } catch (error) {
        console.error(error);
        alert("Server error, please try again later");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();

    // Only enforce admin protection on the admin dashboard page
    if (currentPage === "dashbord.html") {
        if (localStorage.getItem("role") !== "Admin") {
            window.location.href = "index.html";
            return;
        }

        loadDashboard();
    }
});

async function loadDashboard() {
    try {
        const response = await fetch("http://localhost:5042/api/Book/showAllBooks");

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const books = await response.json();

        // Total books
        document.getElementById("totalBooks").innerText = books.length;

        // Available books (AvailableCopies > 0)
        const availableBooks = books.filter(book => book.availableCopies > 0).length;

        // Borrowed books (AvailableCopies == 0)
        const borrowedBooks = books.filter(book => book.availableCopies === 0).length;

        document.getElementById("availableBooks").innerText = availableBooks;
        document.getElementById("borrowedBooks").innerText = borrowedBooks;

    } catch (error) {
        console.error(error);
        alert("Error loading dashboard data");
    }
}
