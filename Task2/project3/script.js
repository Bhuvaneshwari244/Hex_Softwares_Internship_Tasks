// --- Navigation Effects ---
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

// Shrink navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
    });
});

// --- Donation Form Logic ---
const amountBtns = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('custom-amount');
const donationForm = document.getElementById('donation-form');

// Handle preset amount button clicks
amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        amountBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Update the custom amount input to match the button's data value
        const amount = btn.getAttribute('data-amount');
        customAmountInput.value = amount;
    });
});

// If user manually types a custom amount, remove active state from preset buttons
customAmountInput.addEventListener('input', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
});

// Handle Form Submission
donationForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    
    const amount = customAmountInput.value;
    const name = document.getElementById('donor-name').value;
    
    if (amount && name) {
        // Mock success alert (Normally connects to a payment API like Stripe)
        alert(`Thank you so much, ${name}! Your generous donation of $${amount} will help save lives.`);
        donationForm.reset();
        
        // Reset buttons to default state ($25 active)
        amountBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-amount="25"]').classList.add('active');
        customAmountInput.value = 25;
    }
});