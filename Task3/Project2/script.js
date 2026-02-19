// --- Initial State & Storage ---
let library = [];
let currentCategoryFilter = 'All';
let currentSearchQuery = '';

// Default Images for missing covers
const defaultCover = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80";

// Expanded Seed Data (10 Books)
const defaultBooks = [
    { id: 1, title: "The Martian", author: "Andy Weir", category: "Science", status: "Available", rating: 5, cover: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=400&q=80", history: [] },
    { id: 2, title: "Dune", author: "Frank Herbert", category: "Fantasy", status: "Available", rating: 4, cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80", history: [] },
    { id: 3, title: "Sapiens", author: "Yuval Noah Harari", category: "Non-Fiction", status: "Borrowed", rating: 5, cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80", history: [{action: "Borrowed", date: new Date().toLocaleDateString()}] },
    { id: 4, title: "1984", author: "George Orwell", category: "Fiction", status: "Available", rating: 5, cover: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=400&q=80", history: [] },
    { id: 5, title: "Steve Jobs", author: "Walter Isaacson", category: "Biography", status: "Available", rating: 4, cover: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80", history: [] },
    { id: 6, title: "Atomic Habits", author: "James Clear", category: "Non-Fiction", status: "Borrowed", rating: 0, cover: defaultCover, history: [{action: "Borrowed", date: new Date().toLocaleDateString()}] },
    { id: 7, title: "Project Hail Mary", author: "Andy Weir", category: "Science", status: "Available", rating: 5, cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80", history: [] },
    { id: 8, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", status: "Available", rating: 5, cover: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=400&q=80", history: [] },
    { id: 9, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", status: "Available", rating: 4, cover: defaultCover, history: [] },
    { id: 10, title: "Becoming", author: "Michelle Obama", category: "Biography", status: "Borrowed", rating: 5, cover: "https://images.unsplash.com/photo-1575080034293-41bb7ba6e11d?auto=format&fit=crop&w=400&q=80", history: [{action: "Borrowed", date: new Date().toLocaleDateString()}] }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadLibrary();
    renderBooks();
});

// --- Theme Management (Dark Mode) ---
const themeToggleBtn = document.getElementById('theme-toggle');

function initTheme() {
    const isDark = localStorage.getItem('mylib_theme') === 'dark';
    if (isDark) {
        document.body.classList.add('dark-mode');
        themeToggleBtn.innerText = '☀️';
    }
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('mylib_theme', isDark ? 'dark' : 'light');
    themeToggleBtn.innerText = isDark ? '☀️' : '🌙';
});


// --- Library Data Management ---
function loadLibrary() {
    const stored = localStorage.getItem('myLib_data_v2');
    if (stored) {
        library = JSON.parse(stored);
    } else {
        library = defaultBooks;
        saveLibrary();
    }
}

function saveLibrary() {
    localStorage.setItem('myLib_data_v2', JSON.stringify(library));
}

// --- Rendering Logic ---
const bookGrid = document.getElementById('book-grid');
const categoryTitle = document.getElementById('current-category-title');

function renderBooks() {
    bookGrid.innerHTML = '';
    
    // Filtering
    let filteredBooks = library;
    if (currentCategoryFilter !== 'All') {
        filteredBooks = filteredBooks.filter(b => b.category === currentCategoryFilter);
    }
    if (currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase();
        filteredBooks = filteredBooks.filter(b => 
            b.title.toLowerCase().includes(query) || 
            b.author.toLowerCase().includes(query)
        );
    }

    // Update Statistics Panel
    updateStats(filteredBooks);
    
    if (filteredBooks.length === 0) {
        bookGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px;">No books found matching your criteria.</p>`;
        return;
    }

    // Generate HTML for each book
    filteredBooks.forEach(book => {
        const isAvailable = book.status === "Available";
        const statusClass = isAvailable ? "status-available" : "status-borrowed";
        const actionBtnText = isAvailable ? "Borrow" : "Return";
        const coverImg = book.cover && book.cover.trim() !== "" ? book.cover : defaultCover;

        // Generate Stars
        let starsHtml = '';
        for(let i = 1; i <= 5; i++) {
            starsHtml += `<span class="star ${i <= book.rating ? 'filled' : ''}" onclick="rateBook(${book.id}, ${i})">★</span>`;
        }

        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${coverImg}" alt="${book.title} Cover" class="book-cover">
            <div class="book-details">
                <div class="book-header">
                    <span class="book-tag">${book.category}</span>
                    <span class="book-status ${statusClass}">${book.status}</span>
                </div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">By ${book.author}</p>
                
                <div class="star-rating" title="Rate this book">
                    ${starsHtml}
                </div>

                <div class="card-actions">
                    <button class="btn-borrow" onclick="toggleStatus(${book.id})">${actionBtnText}</button>
                    <button onclick="viewHistory(${book.id})">History</button>
                    <button onclick="deleteBook(${book.id})" style="color: var(--danger);">🗑️</button>
                </div>
            </div>
        `;
        bookGrid.appendChild(card);
    });
}

function updateStats(booksToCount) {
    const total = booksToCount.length;
    const available = booksToCount.filter(b => b.status === "Available").length;
    const borrowed = total - available;

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-available').innerText = available;
    document.getElementById('stat-borrowed').innerText = borrowed;
}

// --- Core Functionality ---

// Rate Book
window.rateBook = function(id, rating) {
    const bookIndex = library.findIndex(b => b.id === id);
    if (bookIndex > -1) {
        library[bookIndex].rating = rating;
        saveLibrary();
        renderBooks();
    }
}

// Add New Book
document.getElementById('add-book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const coverInput = document.getElementById('book-cover').value;
    
    const newBook = {
        id: Date.now(),
        title: document.getElementById('book-title').value,
        author: document.getElementById('book-author').value,
        category: document.getElementById('book-category').value,
        cover: coverInput || defaultCover,
        rating: 0,
        status: "Available",
        history: [{action: "Added to Library", date: new Date().toLocaleDateString()}]
    };
    
    library.unshift(newBook); // Add to beginning of array
    saveLibrary();
    renderBooks();
    closeModal('add-book-modal');
    e.target.reset();
});

// Toggle Borrow/Return Status
window.toggleStatus = function(id) {
    const bookIndex = library.findIndex(b => b.id === id);
    if (bookIndex > -1) {
        const book = library[bookIndex];
        const dateStr = new Date().toLocaleDateString();
        
        if (book.status === "Available") {
            book.status = "Borrowed";
            book.history.unshift({ action: "Borrowed", date: dateStr });
        } else {
            book.status = "Available";
            book.history.unshift({ action: "Returned", date: dateStr });
        }
        
        saveLibrary();
        renderBooks();
    }
}

// Delete Book
window.deleteBook = function(id) {
    if(confirm("Are you sure you want to delete this book?")) {
        library = library.filter(b => b.id !== id);
        saveLibrary();
        renderBooks();
    }
}

// --- Search and Filter UI ---
document.getElementById('search-input').addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    renderBooks();
});

const categoryLinks = document.querySelectorAll('#category-list li');
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        categoryLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        currentCategoryFilter = e.target.getAttribute('data-category');
        categoryTitle.innerText = currentCategoryFilter === 'All' ? 'All Books' : `${currentCategoryFilter} Books`;
        renderBooks();
    });
});

// --- Modal Logic ---
const addModal = document.getElementById('add-book-modal');
document.getElementById('add-book-btn').addEventListener('click', () => addModal.classList.add('active'));
document.getElementById('close-add-modal').addEventListener('click', () => closeModal('add-book-modal'));

const historyModal = document.getElementById('history-modal');
document.getElementById('close-history-modal').addEventListener('click', () => closeModal('history-modal'));

window.viewHistory = function(id) {
    const book = library.find(b => b.id === id);
    if (book) {
        document.getElementById('history-book-title').innerText = book.title;
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        if (book.history.length === 0) {
            historyList.innerHTML = '<li>No history recorded yet.</li>';
        } else {
            book.history.forEach(record => {
                historyList.innerHTML += `
                    <li>
                        <span>${record.action}</span>
                        <span class="history-date">${record.date}</span>
                    </li>
                `;
            });
        }
        historyModal.classList.add('active');
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}