// =========================================
// ADVANCED EFFECT ADD-ON: ACADEMIC ANALYSIS
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Advanced Effect script loaded!");
    
    initCauseEffectFlow();
    initBeforeAfterScrubber();
    // initAnalysisMode(); // ĐÃ VÔ HIỆU HÓA
    initLogicCheckpoint();
});

// --- 1. Cause -> Effect Flow (Cơ chế kinh tế) ---
function initCauseEffectFlow() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Hiển thị tuần tự các bước
                const steps = entry.target.querySelectorAll('.flow-step');
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('active');
                        // Animation mũi tên
                        const arrow = step.nextElementSibling;
                        if (arrow && arrow.classList.contains('flow-arrow')) {
                            arrow.style.opacity = '1';
                        }
                    }, index * 800); // 0.8s mỗi bước
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const flowContainers = document.querySelectorAll('.cause-effect-container');
    flowContainers.forEach(container => {
        observer.observe(container);
    });
}

// --- 2. Before - After Scrubber (So sánh) ---
function initBeforeAfterScrubber() {
    const sliders = document.querySelectorAll('.comparison-slider');
    
    sliders.forEach(slider => {
        const output = slider.nextElementSibling; // Phần tử hiển thị giá trị
        const beforeVal = parseFloat(slider.getAttribute('data-before'));
        const afterVal = parseFloat(slider.getAttribute('data-after'));
        
        // Thiết lập giá trị mặc định
        slider.min = 0;
        slider.max = 100;
        slider.value = 50;
        
        slider.addEventListener('input', function() {
            const percentage = this.value / 100;
            const currentVal = beforeVal + (afterVal - beforeVal) * percentage;
            
            // Format số
            output.textContent = currentVal.toFixed(2);
            
            // Thay đổi màu sắc dựa trên giá trị (Xanh -> Đỏ nếu tăng xấu, hoặc ngược lại)
            if (currentVal > beforeVal) {
                output.style.color = '#dc3545'; // Tăng (thường là xấu với lạm phát/chi phí)
            } else {
                output.style.color = '#28a745'; // Giảm (tốt)
            }
            
            // Cập nhật nhãn trạng thái
            const label = this.parentElement.querySelector('.comparison-status');
            if (this.value < 30) label.textContent = "Trước xung đột (Ổn định)";
            else if (this.value > 70) label.textContent = "Sau xung đột (Biến động)";
            else label.textContent = "Giai đoạn chuyển tiếp";
        });
    });
}

// --- 4. Analysis Mode (Chế độ phân tích) ---
function initAnalysisMode() {
    // Tạo nút toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'analysis-toggle';
    toggleBtn.className = 'btn btn-warning rounded-circle shadow-lg no-print';
    toggleBtn.style.width = '50px';
    toggleBtn.style.height = '50px';
    toggleBtn.innerHTML = '<i class="fas fa-microscope"></i>';
    toggleBtn.title = 'Bật/Tắt Chế độ Phân tích';
    
    // Thêm vào body
    document.body.appendChild(toggleBtn);
    
    toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('analysis-mode');
        
        if (document.body.classList.contains('analysis-mode')) {
            this.classList.remove('btn-warning');
            this.classList.add('btn-danger');
            this.innerHTML = '<i class="fas fa-times"></i>';
            
            // Thêm sự kiện click cho các section để highlight
            document.querySelectorAll('section').forEach(sec => {
                sec.addEventListener('click', highlightSection);
                sec.style.cursor = 'zoom-in';
            });
            
            alert('Đã bật Chế độ Phân tích!\n- Nhấp vào bất kỳ phần nào để tập trung (Highlight).\n- Nhấp lại nút này để thoát.');
        } else {
            this.classList.remove('btn-danger');
            this.classList.add('btn-warning');
            this.innerHTML = '<i class="fas fa-microscope"></i>';
            
            // Gỡ bỏ sự kiện và style
            document.querySelectorAll('section').forEach(sec => {
                sec.removeEventListener('click', highlightSection);
                sec.style.cursor = '';
                sec.classList.remove('active-analysis');
            });
        }
    });
}

function highlightSection(e) {
    if (!document.body.classList.contains('analysis-mode')) return;
    
    // Xóa active cũ
    document.querySelectorAll('section').forEach(s => s.classList.remove('active-analysis'));
    
    // Thêm active mới
    this.classList.add('active-analysis');
    e.stopPropagation(); // Ngăn sự kiện nổi bọt
}

// --- 6. Logic Checkpoint (Tư duy nghiên cứu) ---
function initLogicCheckpoint() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const sectionName = entry.target.querySelector('.section-title')?.textContent || "Phần này";
                
                showCheckpointToast(`Đã hoàn thành phân tích: ${sectionName}`);
                observer.unobserve(entry.target); // Chỉ hiện 1 lần
            }
        });
    }, { threshold: 0.8 }); // Khi lướt qua 80% section

    document.querySelectorAll('section').forEach(sec => {
        observer.observe(sec);
    });
}

function showCheckpointToast(message) {
    // Tạo toast nếu chưa có
    let toast = document.getElementById('checkpoint-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'checkpoint-toast';
        toast.className = 'checkpoint-toast';
        toast.innerHTML = '<i class="fas fa-check-circle checkpoint-icon"></i><span id="checkpoint-msg"></span>';
        document.body.appendChild(toast);
    }
    
    document.getElementById('checkpoint-msg').textContent = message;
    
    // Hiển thị
    setTimeout(() => toast.classList.add('show'), 500);
    
    // Tự ẩn sau 3s
    setTimeout(() => toast.classList.remove('show'), 3500);
}
