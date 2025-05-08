// Initialize GSAP
if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Music control
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

function toggleMusic() {
    try {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            // Set volume to 50%
            bgMusic.volume = 0.5;
            // Play music and handle any errors
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    console.log("Playback failed:", error);
                    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                });
            }
        }
        isMusicPlaying = !isMusicPlaying;
    } catch (error) {
        console.error("Error toggling music:", error);
    }
}

// Current section and slide tracking
let currentSection = 'opening';
let currentStorySlide = 1;
let currentQuizSlide = 1;

// Create stars for all scenes
function createStars() {
    const starsContainers = document.querySelectorAll('.stars');
    const starCount = 50;

    starsContainers.forEach(container => {
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 3;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random animation delay
            star.style.animationDelay = `${Math.random() * 2}s`;
            
            container.appendChild(star);
        }
    });
}

// Handle section transitions
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.add('active');
    
    // Reset slides when entering new section
    if (sectionId === 'story') {
        showStorySlide(1);
    } else if (sectionId === 'quiz') {
        showQuizSlide(1);
    }
}

// Story slides logic
function showStorySlide(idx) {
    document.querySelectorAll('#scene-story .story-slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === idx);
    });
}

function setupStorySlides() {
    let idx = 0;
    const slides = document.querySelectorAll('#scene-story .story-slide');
    showStorySlide(idx);
    slides.forEach((slide, i) => {
        slide.querySelector('.tap-button').addEventListener('click', () => {
            if (i < slides.length - 1) {
                showStorySlide(i + 1);
            } else {
                // Lanjut ke galeri
                const story = document.getElementById('scene-story');
                const gallery = document.getElementById('scene-gallery');
                story.classList.remove('active');
                story.style.display = 'none';
                gallery.classList.add('active');
                gallery.style.display = 'flex';
            }
        });
    });
}

// Handle quiz slides
function showQuizSlide(slideNumber) {
    const slides = document.querySelectorAll('.quiz-slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    const targetSlide = document.querySelector(`.quiz-slide[data-quiz="${slideNumber}"]`);
    targetSlide.classList.add('active');
    
    // Animate slide content
    gsap.from(targetSlide, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    });
    // Trigger love animation on slide 3
    if (slideNumber === 3) {
        triggerLoveAnimation();
    }
}

// Gallery tap-to-reveal logic
function setupGalleryReveal() {
    document.querySelectorAll('#scene-gallery .polaroid').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('revealed');
        });
        card.addEventListener('touchend', () => {
            card.classList.add('revealed');
        });
    });
    // Lanjut ke closing
    document.querySelector('#scene-gallery .tap-button').addEventListener('click', () => {
        const gallery = document.getElementById('scene-gallery');
        const closing = document.getElementById('scene-closing');
        gallery.classList.remove('active');
        gallery.style.display = 'none';
        closing.classList.add('active');
        closing.style.display = 'flex';
    });
}

// Auto-slide for gallery
// function setupGalleryAutoSlide() {
//     // Disabled for grid interaktif
// }

// Add event listener with both click and touch events
function addTapListener(element, callback) {
    if (element) {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            callback();
        });
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            callback();
        });
    }
}

function triggerLoveAnimation() {
    const container = document.querySelector('.quiz-slide[data-quiz="3"] .love-anim');
    if (!container) return;
    container.innerHTML = '';
    const hearts = 18;
    for (let i = 0; i < hearts; i++) {
        const heart = document.createElement('span');
        heart.className = 'love-heart';
        heart.textContent = '❤️';
        // Random horizontal position (10% - 90%)
        heart.style.left = (10 + Math.random() * 80) + '%';
        // Random delay for more natural effect
        heart.style.animationDelay = (Math.random() * 0.8) + 's';
        // Random size
        heart.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
        container.appendChild(heart);
    }
}

// Space scene: randomize photo positions and handle tap
function randomizeAstroPhotos() {
    const photos = document.querySelectorAll('.astro-photo');
    const remBase = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const areaW = window.innerWidth / remBase; // dalam rem
    const areaH = window.innerHeight / remBase; // dalam rem
    const marginX = areaW * 0.15;
    const marginY = areaH * 0.20;
    const imgSize = 4.5; // rem
    const usableW = Math.max(areaW - 2 * marginX - imgSize, 1);
    const usableH = Math.max(areaH - 2 * marginY - imgSize, 1);

    photos.forEach(photo => {
        const x = marginX + Math.random() * usableW;
        const y = marginY + Math.random() * usableH;
        photo.style.left = `${x}rem`;
        photo.style.top = `${y}rem`;
        photo.style.zIndex = Math.floor(Math.random() * 10) + 1;
        photo.style.animationDelay = `${Math.random() * 2}s`;
    });
}

function showSpaceMessage(msg, duration = 1200) {
    const msgBox = document.getElementById('spaceMessage');
    msgBox.textContent = msg;
    msgBox.classList.remove('show'); // reset
    void msgBox.offsetWidth; // force reflow to restart animation
    msgBox.classList.add('show');
    setTimeout(() => msgBox.classList.remove('show'), duration);
}

function handleAstroTap(e) {
    playSpaceMusic(); // Play music only after user interaction
    console.log('Astro tap', e.currentTarget);
    const photo = e.currentTarget;
    if (photo.dataset.correct === 'true') {
        photo.classList.add('glow');
        showSpaceMessage('YES! Kamu nemuin kita di antara bintang ✨🚀', 1800);
        confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
        });
        setTimeout(() => {
            // Stop space music, play bg music
            pauseSpaceMusic();
            if (bgMusic) {
                bgMusic.currentTime = 0;
                bgMusic.volume = 0.5;
                bgMusic.play();
            }
            const space = document.getElementById('scene-space');
            const story = document.getElementById('scene-story');   
            space.classList.remove('active');
            space.style.display = 'none';
            story.classList.add('active');
            story.style.display = 'flex';
            console.log('Switched to scene-story');
        }, 1800);
    } else {
        photo.classList.add('shake');
        showSpaceMessage('coba lagi 🌚', 1000);
        setTimeout(() => photo.classList.remove('shake'), 600);
    }
}

function shuffleAstroPhotos() {
    const container = document.querySelector('.floating-photos');
    const items = Array.from(container.children);
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    items.forEach(item => container.appendChild(item));
}

function setupAstroPhotoEvents() {
    document.querySelectorAll('.astro-photo').forEach(photo => {
        photo.onclick = handleAstroTap;
        photo.ontouchend = handleAstroTap;
    });
}

const spaceMusic = document.getElementById('spaceMusic');

function playSpaceMusic() {
    if (bgMusic) bgMusic.pause();
    if (spaceMusic) {
        spaceMusic.volume = 0.5;
        spaceMusic.play();
    }
}
function pauseSpaceMusic() {
    if (spaceMusic) spaceMusic.pause();
}

// Update floating counters with time elapsed since May 9, 2024, 4 AM
function updateCounters() {
    const startDate = new Date('2024-05-09T04:00:00');
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const counterText = `${days} days, ${hours}h ${minutes}m ${seconds}s`;
    document.querySelectorAll('.floating-counter').forEach(counter => {
        counter.textContent = counterText;
    });
}

// Call updateCounters every second
setInterval(updateCounters, 1000);
updateCounters(); // Initial call

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    setupGalleryReveal();
    
    // Music toggle
    addTapListener(musicToggle, toggleMusic);
    
    // Opening section
    const openingButton = document.querySelector('#opening .tap-button');
    addTapListener(openingButton, () => {
        showSection('gallery');
        // Start playing music when the first button is clicked
        if (!isMusicPlaying) {
            toggleMusic();
        }
    });
    
    // Story section
    const storyButtons = document.querySelectorAll('#story .tap-button');
    storyButtons.forEach(button => {
        addTapListener(button, () => {
            currentStorySlide++;
            if (currentStorySlide <= 3) {
                showStorySlide(currentStorySlide);
            } else {
                showSection('gallery');
            }
        });
    });
    
    // Gallery section
    const galleryButton = document.querySelector('#gallery .tap-button');
    addTapListener(galleryButton, () => {
        showSection('quiz');
    });
    
    // Quiz section
    const quizOptions = document.querySelectorAll('#quiz .quiz-option');
    quizOptions.forEach(option => {
        addTapListener(option, () => {
            currentQuizSlide++;
            if (currentQuizSlide <= 3) {
                showQuizSlide(currentQuizSlide);
            } else {
                showSection('closing');
            }
        });
    });
    
    // Closing section
    const closingButton = document.querySelector('#closing .tap-button');
    addTapListener(closingButton, () => {
        // Add your final action here (e.g., open a letter or video)
        window.location.href = 'letter.html';
    });

    // Scene 1: Space game
    const allAstro = document.querySelectorAll('.astro-photo');
    let loaded = 0;
    allAstro.forEach(img => {
        img.onload = () => {
            loaded++;
            if (loaded === allAstro.length) {
                randomizeAstroPhotos();
            }
        };
    });
    window.addEventListener('resize', randomizeAstroPhotos);
    allAstro.forEach(photo => {
        photo.addEventListener('click', handleAstroTap);
        photo.addEventListener('touchend', handleAstroTap);
    });

    // Story slides
    setupStorySlides();
    // Gallery tap-to-reveal
    setupGalleryReveal();

    shuffleAstroPhotos();
    setupAstroPhotoEvents();

    // Overlay Play Button
    const startOverlay = document.getElementById('startOverlay');
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startOverlay.classList.add('hide');
            setTimeout(() => startOverlay.style.display = 'none', 600);
            playSpaceMusic();
        });
    }

    // Hadiah popup logic
    const hadiahBtn = document.getElementById('hadiahBtn');
    const hadiahPopup = document.getElementById('hadiahPopup');
    const closeHadiah = document.getElementById('closeHadiah');
    if (hadiahBtn && hadiahPopup && closeHadiah) {
        hadiahBtn.addEventListener('click', () => {
            hadiahPopup.classList.add('active');
        });
        closeHadiah.addEventListener('click', () => {
            hadiahPopup.classList.remove('active');
        });
        hadiahPopup.addEventListener('click', (e) => {
            if (e.target === hadiahPopup) hadiahPopup.classList.remove('active');
        });
    }
}); 