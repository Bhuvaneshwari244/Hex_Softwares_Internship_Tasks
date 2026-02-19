// --- 1. Sticky Navigation & Mobile Menu ---
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
    });
});

// --- 2. Scroll Reveal Animations (Intersection Observer) ---
// This watches elements with the 'reveal' class and adds 'active' when they enter the screen
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
};

const revealOptions = {
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));


// --- 3. Interactive BMI Calculator ---
const calcBtn = document.getElementById('calc-bmi-btn');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const bmiScoreText = document.getElementById('bmi-score');
const bmiStatusText = document.getElementById('bmi-status');

calcBtn.addEventListener('click', () => {
    const weight = parseFloat(weightInput.value);
    const heightCm = parseFloat(heightInput.value);

    if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
        bmiScoreText.textContent = "Error";
        bmiStatusText.textContent = "Please enter valid positive numbers.";
        bmiStatusText.style.color = "#ff4757";
        return;
    }

    // BMI Formula: weight (kg) / [height (m)]^2
    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    bmiScoreText.textContent = bmi;

    // Determine status
    let status = "";
    let color = "";

    if (bmi < 18.5) {
        status = "Underweight - Let's build some muscle!";
        color = "#ffdd59";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        status = "Normal weight - Keep up the great work!";
        color = "#0be881";
    } else if (bmi >= 25 && bmi <= 29.9) {
        status = "Overweight - Time to hit the cardio deck!";
        color = "#ffc048";
    } else {
        status = "Obese - We are here to support your journey.";
        color = "#ff5e57";
    }

    bmiStatusText.textContent = status;
    bmiStatusText.style.color = color;
});


// --- 4. Class Schedule Filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const classCards = document.querySelectorAll('.class-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        classCards.forEach(card => {
            // If filter is 'all', show everything. Otherwise, check if card has the filter class.
            if (filterValue === 'all' || card.classList.contains(filterValue)) {
                card.style.display = 'block';
                // Small timeout to allow display:block to apply before animating opacity
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300); // Wait for transition to finish
            }
        });
    });
});