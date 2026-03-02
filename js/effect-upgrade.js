// =========================================
// EFFECT UPGRADE: LOGIC & ANIMATIONS
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Effect Upgrade script loaded!");
    
    initCountUp();
    initRippleEffect();
    initStaggerAnimation();
    // initPresentationProgress(); // ĐÃ VÔ HIỆU HÓA
});

// --- 1. Count-up Animation (Data-driven) ---
function initCountUp() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const endVal = parseFloat(el.getAttribute('data-val'));
                const duration = 2000; // 2 seconds
                animateValue(el, 0, endVal, duration);
                observer.unobserve(el); // Chỉ chạy 1 lần
            }
        });
    }, observerOptions);

    // Tìm các số liệu để animate (sẽ thêm class .count-up vào HTML sau)
    document.querySelectorAll('.count-up').forEach(el => {
        observer.observe(el);
    });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function (easeOutExpo)
        const easeProgress = 1 - Math.pow(2, -10 * progress);
        
        const currentVal = (progress * (end - start) + start);
        
        // Format số liệu (giữ nguyên số thập phân nếu có)
        if (end % 1 !== 0) {
            obj.innerHTML = currentVal.toFixed(2);
        } else {
            obj.innerHTML = Math.floor(currentVal);
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end; // Đảm bảo số cuối cùng chính xác
        }
    };
    window.requestAnimationFrame(step);
}

// --- 2. Micro-interaction: Ripple Effect ---
function initRippleEffect() {
    document.querySelectorAll('.btn-ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            const diameter = Math.max(btn.clientWidth, btn.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - btn.offsetLeft - radius}px`;
            circle.style.top = `${e.clientY - btn.offsetTop - radius}px`;
            circle.classList.add('ripple');

            const ripple = btn.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }

            btn.appendChild(circle);
        });
    });
}

// --- 3. Storytelling: Stagger Animation ---
function initStaggerAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('[data-stagger]').forEach(el => {
        observer.observe(el);
    });
}

// --- 4. Presentation Mode Pro Logic ---
function initPresentationProgress() {
    // Tạo thanh progress
    const progressBar = document.createElement('div');
    progressBar.id = 'presentation-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        if (!document.body.classList.contains('presentation-mode')) return;

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + "%";
        
        // Highlight active slide
        updateActiveSlide();
    });
}

function updateActiveSlide() {
    const sections = document.querySelectorAll('section, header');
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute("id");
        }
        // Reset active class
        section.classList.remove('active-slide');
    });

    if (current) {
        const activeSection = document.getElementById(current);
        if (activeSection) activeSection.classList.add('active-slide');
    }
}
