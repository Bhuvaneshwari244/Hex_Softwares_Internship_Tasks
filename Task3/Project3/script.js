document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Mouse Cursor ---
    const cursor = document.getElementById('custom-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .service-card');

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // --- 2. Dynamic Typing Effect ---
    const typingTextElement = document.getElementById('typing-text');
    const wordsToType = ["Digital Experiences", "Creative Interfaces", "Stunning Websites"];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = wordsToType[wordIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % wordsToType.length;
            typeSpeed = 500; 
        }

        setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1000);

    // --- 3. Video Play/Pause Control ---
    const video = document.getElementById('bg-video');
    const videoToggleBtn = document.getElementById('video-toggle');

    videoToggleBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            videoToggleBtn.innerHTML = '⏸ Pause Video';
        } else {
            video.pause();
            videoToggleBtn.innerHTML = '▶ Play Video';
        }
    });

    // --- 4. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Dynamic Number Counters ---
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const countCallback = (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; 
                const increment = target / (duration / 16); 
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            });
        }
    };

    const statsSection = document.getElementById('stats');
    if(statsSection) {
        const statsObserver = new IntersectionObserver(countCallback, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }
});