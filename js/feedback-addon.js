// =========================================
// SIMPLE FEEDBACK ADD-ON
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Simple Feedback script loaded!");
    
    const VOTE_KEY = "nckh_vote_status"; // Key lưu trạng thái vote

    const stars = document.querySelectorAll('.star-icon');
    const submitBtn = document.getElementById('btn-submit-vote');
    const feedbackArea = document.getElementById('simple-feedback-area');
    const thankYouArea = document.getElementById('feedback-thank-you');
    let selectedRating = 0;

    // Kiểm tra xem đã vote chưa
    if (localStorage.getItem(VOTE_KEY) === 'voted') {
        renderStaticConfirmation(); // Hiển thị bảng xác nhận tĩnh ngay tại chỗ
    }


    // 1️⃣ Hiệu ứng xuất hiện khi scroll + Nhảy số
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    feedbackSection.classList.add('is-visible');
                    
                    // Kích hoạt hiệu ứng nhảy số
                    runCounters();
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 }); // Hiện khi thấy 20%
        observer.observe(feedbackSection);
    } else if (feedbackSection) {
        // Fallback
        feedbackSection.classList.add('is-visible');
        runCounters();
    }

    function runCounters() {
        const counters = document.querySelectorAll('.counter-value');
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isFloat = target % 1 !== 0;
            const duration = 1500; // 1.5s
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                
                const current = progress * target;
                
                if (isFloat) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target; // Đảm bảo số cuối chuẩn
                }
            }
            
            requestAnimationFrame(update);
        });
    }

    // Xử lý hover và click sao (Hiệu ứng lan tỏa + Focus Mode)
    stars.forEach(star => {
        // Hover
        star.addEventListener('mouseover', function() {
            const value = parseInt(this.getAttribute('data-value'));
            highlightStars(value);
        });

        // Mouse out (trả về trạng thái đã chọn hoặc 0)
        star.addEventListener('mouseout', function() {
            highlightStars(selectedRating);
        });

        // Click
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            highlightStars(selectedRating);
            
            // Kích hoạt Focus Mode
            document.body.classList.add('focus-feedback');
            const card = document.querySelector('.feedback-card');
            if (card) card.classList.add('focused');

            // Hiệu ứng "chốt đánh giá"
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 400);
        });
    });

    // Hàm tô màu sao
    function highlightStars(count) {
        stars.forEach(star => {
            const value = parseInt(star.getAttribute('data-value'));
            if (value <= count) {
                star.classList.remove('far');
                star.classList.add('fas'); // Sao đặc
            } else {
                star.classList.remove('fas');
                star.classList.add('far'); // Sao rỗng
            }
        });
    }

    // Xử lý nút gửi
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            if (selectedRating === 0) {
                // Hiệu ứng rung lắc báo lỗi
                submitBtn.classList.add('shake-error');
                
                // Xóa class sau khi chạy xong animation (0.5s)
                setTimeout(() => {
                    submitBtn.classList.remove('shake-error');
                }, 500);
                
                return;
            }

            // Tắt Focus Mode
            document.body.classList.remove('focus-feedback');
            const card = document.querySelector('.feedback-card');
            if (card) card.classList.remove('focused');

            // Trigger iOS Modal
            openIOSModal();
            
            // Lưu trạng thái đã vote vào localStorage
            localStorage.setItem(VOTE_KEY, 'voted');
        });
    }

    // Logic kéo modal (Drag to dismiss)
    function initModalDrag(modal, content) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        
        // Click outside to close (Bấm vào vùng mờ overlay)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeIOSModal();
            }
        });
        
        content.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
            content.style.transition = 'none'; // Tắt transition để kéo mượt
        }, { passive: true });

        content.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const y = e.touches[0].clientY;
            const delta = y - startY;
            
            // Chỉ cho phép kéo xuống
            if (delta > 0) {
                currentY = delta;
                content.style.transform = `translateY(${currentY}px)`;
                e.preventDefault(); // Chặn scroll trang
            }
        }, { passive: false });

        content.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            content.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
            
            // Nếu kéo quá 150px (khoảng 40% chiều cao) -> Đóng
            if (currentY > 150) {
                closeIOSModal();
            } else {
                // Bật lại vị trí cũ
                content.style.transform = '';
            }
            currentY = 0;
        });
        
        // Hỗ trợ Mouse Drag (Desktop)
        content.addEventListener('mousedown', (e) => {
            startY = e.clientY;
            isDragging = true;
            content.style.transition = 'none';
            content.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = e.clientY - startY;
            if (delta > 0) {
                currentY = delta;
                content.style.transform = `translateY(${currentY}px)`;
            }
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            content.style.cursor = 'grab';
            content.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
            
            if (currentY > 150) {
                closeIOSModal();
            } else {
                content.style.transform = '';
            }
            currentY = 0;
        });
    }

    function openIOSModal() {
        const modal = document.getElementById('ios-feedback-modal');
        const modalIcon = document.getElementById('ios-modal-icon');
        const modalContent = modal ? modal.querySelector('.ios-modal-content') : null;
        
        if (modal && modalIcon && modalContent) {
            // Khởi tạo drag logic
            initModalDrag(modal, modalContent);
            
            // 1. Inject Icon
            modalIcon.innerHTML = `
                <svg class="check-icon-svg" viewBox="0 0 100 100">
                    <circle class="check-circle" cx="50" cy="50" r="45"/>
                    <path class="check-tick" d="M30 50 L45 65 L70 35"/>
                </svg>
            `;
            
            // 2. Show Modal (Quan trọng: set visibility + opacity)
            modal.style.display = 'flex'; // Đảm bảo flex để căn giữa
            // Force reflow
            void modal.offsetWidth; 
            modal.classList.add('open');
            
            document.body.style.overflow = 'hidden'; // Chặn scroll
            
            // 3. Scale Icon Finish
            setTimeout(() => {
                const icon = modalIcon.querySelector('.check-icon-svg');
                if (icon) icon.classList.add('finished');
            }, 900);

            // 4. Auto Close (Tăng thời gian để user kịp kéo thử)
            /* 
            setTimeout(() => {
                closeIOSModal();
            }, 3000); 
            */
        } else {
            console.error("Không tìm thấy modal iOS trong DOM!");
        }
    }

    function closeIOSModal() {
        const modal = document.getElementById('ios-feedback-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = ''; // Mở lại scroll
            
            // Reset icon sau khi transition kết thúc
            setTimeout(() => {
                const modalIcon = document.getElementById('ios-modal-icon');
                if (modalIcon) modalIcon.innerHTML = '';
                
                // Reset transform nếu có kéo dở dang
                const content = modal.querySelector('.ios-modal-content');
                if (content) content.style.transform = '';
                
                modal.style.display = ''; // Reset display
            }, 500); // Đợi modal đóng hẳn (0.5s transition trong CSS)
            
            // Hiển thị bảng đánh giá đã vote xong (bên dưới)
            showRatedCard();
        }
    }
    
    // Hàm render bảng xác nhận tĩnh (Khi load lại trang đã vote)
    function renderStaticConfirmation() {
        if (feedbackArea) feedbackArea.style.display = 'none';
        if (thankYouArea) {
            thankYouArea.style.display = 'block';
            
            // Dùng chung HTML structure với modal nhưng class khác
            thankYouArea.innerHTML = `
                <div class="confirm-box static">
                    <svg class="check-icon-svg" viewBox="0 0 100 100">
                        <circle class="check-circle" cx="50" cy="50" r="45" style="stroke-dashoffset: 0; animation: none;"/>
                        <path class="check-tick" d="M30 50 L45 65 L70 35" style="stroke-dashoffset: 0; animation: none;"/>
                    </svg>
                    <div class="text-muted small mt-3">
                        Bạn đã gửi đánh giá
                    </div>
                </div>
            `;
        }
    }

    function showRatedCard() {
        renderStaticConfirmation();
    }
});
