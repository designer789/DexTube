document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    // Set first item as active by default
    accordionItems[0].classList.add('active');
    
    accordionItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            item.classList.add('active');
        });
    });

    // Carousel functionality
    const carousel = document.querySelector('.carousel-inner');
    const cards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (carousel && cards.length > 0) {  // Check if elements exist
        let currentIndex = 0;
        const cardsPerView = window.innerWidth > 768 ? 2 : 1;
        const maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
        
        // Create dots
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 32; // Match the gap from CSS
            carousel.style.transform = `translateX(-${currentIndex * (cardWidth + gap) * cardsPerView}px)`;
            
            // Update dots
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            // Update buttons
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        // Initial update
        updateCarousel();
        
        // Update on resize with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentIndex = 0;
                updateCarousel();
            }, 250);
        });
    }
}); 