/* ============================================
   CYBERPUNK PORTFOLIO - INTERACTIVE JAVASCRIPT
   Advanced animations and interactions
   ============================================ */

// ============================================
// CUSTOM CURSOR
// ============================================

const cursor = document.querySelector('.cursor');
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Change cursor on hover
document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
        e.target.classList.contains('social-icon') ||
        e.target.classList.contains('skill-tag')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.2)';
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
        e.target.classList.contains('social-icon') ||
        e.target.classList.contains('skill-tag')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
    }
});

// Hide cursor on leave
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorGlow.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorGlow.style.opacity = '1';
});

// ============================================
// PARTICLE ANIMATION (STARS)
// ============================================

const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.5;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += (Math.random() - 0.5) * 0.02;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.opacity = Math.max(0.2, Math.min(1, this.opacity));
    }

    draw() {
        ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        ctx.strokeStyle = `rgba(0, 217, 255, ${this.opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.stroke();
    }
}

const stars = [];
const starCount = 100;

for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animateStars);
}

animateStars();

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ============================================
// RANDOM SKILL TAGS SHUFFLE
// ============================================

function shuffleSkillTags() {
    const skillsCard = document.querySelector('.single-skills-card .skill-tags');
    if (!skillsCard) return;

    const skillTags = Array.from(skillsCard.querySelectorAll('.skill-tag'));
    
    // Fisher-Yates shuffle algorithm
    for (let i = skillTags.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [skillTags[i], skillTags[j]] = [skillTags[j], skillTags[i]];
    }

    // Clear and re-append in shuffled order
    skillsCard.innerHTML = '';
    skillTags.forEach(tag => {
        skillsCard.appendChild(tag);
    });
}

// Shuffle on page load
window.addEventListener('load', () => {
    shuffleSkillTags();
});

// Re-shuffle every 3 seconds for continuous random effect
setInterval(() => {
    shuffleSkillTags();
}, 3000);

// Also shuffle on hover over skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillsSection.addEventListener('mouseenter', () => {
        shuffleSkillTags();
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('section, .project-card, .stat-item, .cert-item').forEach(el => {
    observer.observe(el);
});

// ============================================
// ANIMATED COUNTER FOR STATS
// ============================================

function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const targetValue = parseInt(stat.getAttribute('data-value'));
        let currentValue = 0;
        const increment = targetValue / 30;
        
        const updateCounter = () => {
            currentValue += increment;
            if (currentValue < targetValue) {
                stat.textContent = Math.floor(currentValue);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = targetValue;
            }
        };

        // Trigger animation when element is in view
        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                counterObserver.unobserve(stat);
            }
        });

        counterObserver.observe(stat);
    });
}

animateCounters();

// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-theme');
    themeToggle.textContent = '🌙';
} else {
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const theme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
});

// ============================================
// INTERACTIVE PROJECT CARDS
// ============================================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) rotateX(5deg)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0)';
    });
});

// Project button interactions
const projectButtons = document.querySelectorAll('.project-btn');

projectButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Project details coming soon! In a real portfolio, this would open a modal or detailed page.');
    });
});

// ============================================
// DOWNLOAD RESUME
// ============================================

const downLoadButtons = document.querySelectorAll('.download-btn');

downLoadButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // Create a sample resume download
        const resumeContent = `
UPPU RAMU
Email: uppuramu7268@gmail.com
Srikakulam, Andhra Pradesh, India
LinkedIn: linkedin.com/in/uppuramu

WORK EXPERIENCE

Graduate Apprentice Trainee (GAT)
Rashtriya Ispat Nigam Limited (RINL) - Vizag Steel Plant
Feb 2025 - Jan 2026

IT & ERP Department:
• Performed data analysis and reporting using MS Excel, Python, NumPy, and Pandas
• Developed interactive dashboards in Power BI
• Applied variance analysis, forecasting techniques, and statistical methods
• Worked on AI-driven solutions for operational efficiency

Finance & Accounts Department:
• Handled purchase bill registration and processing in SAP ERP
• Processed GST and Liquidated Damages (LD) calculations
• Managed recoveries and final settlements

TECHNICAL SKILLS
Programming: Python | Core Concepts: Data Structures, Machine Learning, Deep Learning
Libraries: NumPy, Pandas, Matplotlib, Scikit-learn, TensorFlow
Operating Systems: Windows, macOS
Tools: GitHub, VS Code, Jupyter Notebook, Google Colab, SAP ERP

EDUCATION

Bachelor of Technology - Computer Science & Engineering
Acharya Nagarjuna University, Guntur | 2020-2024 | GPA: 8.0/10

Intermediate Education - MPC
Gayatri Junior College, Srikakulam | 2018-2020 | GPA: 9.59/10

10th Class/SSC
A P Model School, Srikakulam | 2017-2018 | GPA: 8.2/10

PROJECTS

1. Heart Disease Classification Using ECG Images
• Developed CNN model for ECG image classification
• Achieved 90% accuracy on real-world datasets
• Performed data preprocessing, feature extraction, and image augmentation

2. Data Visualization Dashboard
• Interactive Power BI dashboards for business analytics
• Real-time data integration

3. Predictive Maintenance AI
• ML-driven system for industrial fan maintenance
• 25%+ efficiency improvement, 40% downtime reduction

4. House Price Prediction
• Regression model using advanced ML algorithms
• R² Score: 0.85+

5. Faculty Profile Management
• Created 300+ faculty profiles with automated system
• Vice Chancellor Award recognition

CERTIFICATIONS
• Introduction to Deep Learning & Neural Networks - Coursera
• Python for Data Science, AI & Development - Coursera
• Master Core Python Programming in 99 Days - Udemy
• Python for Data Science - EXCELR

ACHIEVEMENTS
• Solved 500+ CodeChef practice problems
• Awarded cash prize for faculty profile project
        `;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(resumeContent));
        element.setAttribute('download', 'UPPU_RAMU_Resume.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    });
});

// ============================================
// NAVBAR ACTIVE STATE
// ============================================

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-neon)';
            link.style.textShadow = '0 0 10px var(--primary-neon)';
        } else {
            link.style.color = 'var(--text-primary)';
            link.style.textShadow = 'none';
        }
    });
});

// ============================================
// SKILL TAGS ANIMATION
// ============================================

const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) rotate(2deg)';
    });

    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ============================================
// PARALLAX EFFECT ON SCROLL
// ============================================

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            applyParallax();
            ticking = false;
        });
        ticking = true;
    }
});

function applyParallax() {
    const glowOrbs = document.querySelectorAll('.glow-orb');
    
    glowOrbs.forEach(orb => {
        const scrollY = window.scrollY;
        orb.style.transform = `translateY(${scrollY * 0.1}px)`;
    });
}

// ============================================
// PROFILE CARD GLOW ON SCROLL
// ============================================

const profileCard = document.querySelector('.profile-card');

if (profileCard) {
    const profileObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInRight 0.8s ease forwards';
            }
        });
    });

    profileObserver.observe(profileCard);
}

// ============================================
// EXPERIENCE TIMELINE STAGGER ANIMATION
// ============================================

const timelineItems = document.querySelectorAll('.timeline-item');

timelineItems.forEach((item, index) => {
    const timelineObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            item.style.animation = `fadeInScale 0.6s ease ${index * 0.15}s forwards`;
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.opacity = '1';
            }, index * 150);
        }
    });

    timelineObserver.observe(item);
});

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================

const buttons = document.querySelectorAll('.btn, .project-btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Add ripple styles if not already in CSS
        if (!document.querySelector('style[data-ripple]')) {
            const style = document.createElement('style');
            style.setAttribute('data-ripple', 'true');
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
                    transform: scale(0);
                    animation: rippleEffect 0.6s ease-out;
                }
                @keyframes rippleEffect {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// ============================================
// GLITCH TEXT EFFECT
// ============================================

const glitchText = document.querySelector('.glitch');

if (glitchText) {
    // Add random glitch effect occasionally
    setInterval(() => {
        if (Math.random() > 0.95) {
            glitchText.style.animation = 'none';
            setTimeout(() => {
                glitchText.style.animation = 'glitchText 3s ease-in-out infinite';
            }, 10);
        }
    }, 100);
}

// ============================================
// FLOATING CARD 3D EFFECT
// ============================================

const floatingCard = document.querySelector('.floating-card');

if (floatingCard) {
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            const rotateX = (y - 0.5) * 10;
            const rotateY = (x - 0.5) * -10;

            floatingCard.style.transform = 
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });

    document.addEventListener('mouseleave', () => {
        floatingCard.style.transform = 
            'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// ============================================
// SOCIAL ICONS HOVER EFFECT
// ============================================

const socialIcons = document.querySelectorAll('.social-icon');

socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.2) rotate(10deg)';
        this.style.boxShadow = '0 0 30px currentColor';
    });

    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        this.style.boxShadow = 'none';
    });
});

// ============================================
// SECTION ANIMATIONS ON SCROLL
// ============================================

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    sectionObserver.observe(section);
});

// ============================================
// CERTIFICATE ITEMS STAGGER
// ============================================

const certItems = document.querySelectorAll('.cert-item');

certItems.forEach((item, index) => {
    const certObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            item.style.animation = `fadeInScale 0.6s ease ${index * 0.1}s forwards`;
            item.style.opacity = '0';
        }
    });

    certObserver.observe(item);
});

// ============================================
// RESPONSIVE HOVER EFFECTS
// ============================================

if (window.matchMedia('(max-width: 768px)').matches) {
    // Disable 3D effects on mobile
    projectCards.forEach(card => {
        card.style.transform = 'none';
    });
}

// ============================================
// INITIALIZE
// ============================================

console.log('🎮 Cyberpunk Portfolio initialized!');
console.log('✨ All interactive features loaded successfully');
