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

    // Grid effect
    const hero = document.querySelector('.hero');
    const grid = document.querySelector('.grid-background');
    const GRID_SIZE = 30;
    const cells = [];
    const TRAIL_LENGTH = 5; // Number of cells in the trail
    let lastCells = []; // Array to store recently activated cells
    
    // Create grid cells
    function createGridCells() {
        const width = hero.offsetWidth;
        const height = hero.offsetHeight;
        const cols = Math.ceil(width / GRID_SIZE);
        const rows = Math.ceil(height / GRID_SIZE);
        
        // Clear existing cells
        cells.forEach(cell => cell.remove());
        cells.length = 0;
        lastCells = [];
        
        // Create new cells
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.left = `${j * GRID_SIZE}px`;
                cell.style.top = `${i * GRID_SIZE}px`;
                grid.appendChild(cell);
                cells.push(cell);
            }
        }
    }
    
    // Handle mouse movement
    function handleMouseMove(e) {
        const rect = hero.getBoundingClientRect();
        // 考虑页面滚动位置
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        const mouseX = e.pageX - (rect.left + scrollX);
        const mouseY = e.pageY - (rect.top + scrollY);
        
        // Calculate current grid position
        const gridX = Math.floor(mouseX / GRID_SIZE);
        const gridY = Math.floor(mouseY / GRID_SIZE);
        
        // Find current cell
        const currentCell = cells.find(cell => {
            const cellX = parseInt(cell.style.left) / GRID_SIZE;
            const cellY = parseInt(cell.style.top) / GRID_SIZE;
            return cellX === gridX && cellY === gridY;
        });

        if (currentCell) {
            // Add current cell to trail
            lastCells.unshift({
                cell: currentCell,
                timestamp: Date.now()
            });

            // Limit trail length
            if (lastCells.length > TRAIL_LENGTH) {
                lastCells.pop();
            }

            // Update all cells
            cells.forEach(cell => {
                const trailIndex = lastCells.findIndex(item => item.cell === cell);
                if (trailIndex >= 0) {
                    const opacity = 1 - (trailIndex / TRAIL_LENGTH);
                    cell.classList.add('active');
                    cell.style.opacity = opacity;
                    cell.style.transform = `scale(${1 + (0.1 * (1 - trailIndex / TRAIL_LENGTH))})`;
                } else {
                    cell.classList.remove('active');
                    cell.style.opacity = '';
                    cell.style.transform = '';
                }
            });
        }
        
        // Parallax effect
        const moveX = (mouseX / rect.width) * 20;
        const moveY = (mouseY / rect.height) * 20;
        grid.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    }
    
    // Reset cells when mouse leaves
    function handleMouseLeave() {
        lastCells = [];
        cells.forEach(cell => {
            cell.classList.remove('active');
            cell.style.opacity = '';
            cell.style.transform = '';
        });
        grid.style.transform = 'translate(0, 0)';
    }
    
    // Initialize grid
    createGridCells();
    
    // Add event listeners
    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);
    
    // Update grid on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createGridCells, 250);
    });

    // 汉堡菜单功能
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // 点击导航链接后关闭菜单
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}); 