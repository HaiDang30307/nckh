document.addEventListener('DOMContentLoaded', function() {
    // URL của file dữ liệu
    const dataUrl = 'data.json';

    // Hàm fetch dữ liệu
    fetch(dataUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể tải file data.json');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dữ liệu đã tải:', data);
            populateContent(data);
            renderCharts(data.charts);
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Lỗi: Không thể đọc dữ liệu từ data.json. \n\nNếu bạn đang mở file trực tiếp (file://...), hãy sử dụng "Live Server" trên VS Code hoặc cài đặt một local server để trình duyệt cho phép đọc file JSON.');
        });

    // --- PRESENTATION MODE LOGIC (ĐÃ VÔ HIỆU HÓA) ---
    /*
    const presentationBtn = document.getElementById('presentation-toggle');
    const sections = document.querySelectorAll('header, section');
    let currentSectionIndex = 0;
    let isPresentationMode = false;

    if (presentationBtn) {
        presentationBtn.addEventListener('click', () => {
            togglePresentationMode();
        });
    }
    
    // ... (Code cũ đã bị comment)
    */

    // Xử lý phím tắt
    document.addEventListener('keydown', (e) => {
        if (!isPresentationMode) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            // Next slide
            e.preventDefault();
            if (currentSectionIndex < sections.length - 1) {
                currentSectionIndex++;
                scrollToSection(currentSectionIndex);
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            // Prev slide
            e.preventDefault();
            if (currentSectionIndex > 0) {
                currentSectionIndex--;
                scrollToSection(currentSectionIndex);
            }
        } else if (e.key === 'Escape') {
            // Exit mode
            togglePresentationMode();
        }
    });

    function togglePresentationMode() {
        isPresentationMode = !isPresentationMode;
        document.body.classList.toggle('presentation-mode');
        
        if (isPresentationMode) {
            presentationBtn.innerHTML = '<i class="fas fa-times"></i>';
            presentationBtn.classList.remove('btn-primary');
            presentationBtn.classList.add('btn-danger');
            
            // Vào chế độ trình chiếu thì scroll tới section đầu tiên
            currentSectionIndex = 0;
            scrollToSection(0);
            
            // Hiện thông báo hướng dẫn nhỏ
            alert('Đã bật Chế độ Trình chiếu!\n- Dùng phím Mũi tên để chuyển slide.\n- Nhấn ESC để thoát.');
        } else {
            presentationBtn.innerHTML = '<i class="fas fa-desktop"></i>';
            presentationBtn.classList.remove('btn-danger');
            presentationBtn.classList.add('btn-primary');
            // Reset lại view bình thường
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    function scrollToSection(index) {
        sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Hàm điền nội dung vào HTML
function populateContent(data) {
    // 1. Thông tin đề tài
    document.getElementById('project-title').textContent = data.project_info.title;
    document.getElementById('student-name').textContent = data.project_info.student_name;
    document.getElementById('student-id').textContent = data.project_info.student_id;
    document.getElementById('instructor').textContent = data.project_info.instructor;
    document.getElementById('faculty').textContent = data.project_info.faculty;
    document.getElementById('school').textContent = data.project_info.school;
    document.getElementById('time').textContent = data.project_info.time;
    document.getElementById('objective').textContent = data.project_info.objective;

    // 2. Lý do chọn đề tài
    document.getElementById('rationale-context').textContent = data.rationale.context;
    document.getElementById('rationale-urgency').textContent = data.rationale.urgency;
    document.getElementById('rationale-significance').textContent = data.rationale.significance;

    // 3. Cơ sở lý thuyết
    const conceptsList = document.getElementById('theory-concepts');
    data.theory.concepts.forEach(concept => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${concept.term}:</strong> ${concept.definition}`;
        conceptsList.appendChild(li);
    });

    const studiesList = document.getElementById('theory-studies');
    data.theory.related_studies.forEach(study => {
        const li = document.createElement('li');
        li.textContent = study;
        studiesList.appendChild(li);
    });

    // 4. Phương pháp
    document.getElementById('method-approach').textContent = data.methodology.approach;
    document.getElementById('method-source').textContent = data.methodology.data_source;
    document.getElementById('method-analysis').textContent = data.methodology.analysis_method;

    // 5. Kết luận
    document.getElementById('conclusion-summary').textContent = data.conclusion.summary;
    document.getElementById('conclusion-limitations').textContent = data.conclusion.limitations;
    document.getElementById('conclusion-recommendations').textContent = data.conclusion.recommendations;

    // 6. Phân tích chi tiết (Mới)
    if (data.detailed_analysis) {
        const container = document.getElementById('detailed-analysis-container');
        container.innerHTML = ''; // Xóa nội dung cũ nếu có
        
        data.detailed_analysis.forEach((item, index) => {
            const delay = index * 200;
            const html = `
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="${delay}">
                    <div class="content-card h-100">
                        <div class="text-center mb-3">
                            <i class="fas ${item.icon} fa-3x text-primary"></i>
                        </div>
                        <h4 class="text-center mb-3">${item.title}</h4>
                        
                        <div class="mb-3">
                            <h6 class="text-success fw-bold"><i class="fas fa-arrow-up"></i> Cơ hội:</h6>
                            <p class="small text-muted mb-0">${item.positive}</p>
                        </div>
                        
                        <div>
                            <h6 class="text-danger fw-bold"><i class="fas fa-arrow-down"></i> Thách thức:</h6>
                            <p class="small text-muted mb-0">${item.negative}</p>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }
}

// Hàm vẽ biểu đồ
function renderCharts(chartsData) {
    // Cấu hình chung cho Chart.js để đẹp hơn
    Chart.defaults.font.family = "'Segoe UI', 'Helvetica', 'Arial', sans-serif";
    Chart.defaults.color = '#333';

    // Animation chung cho chart
    const commonAnimation = {
        duration: 2000,
        easing: 'easeOutQuart'
    };

    // 1. Biểu đồ đường (GDP Growth)
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: chartsData.gdp_growth.labels,
            datasets: [{
                label: chartsData.gdp_growth.label,
                data: chartsData.gdp_growth.data,
                borderColor: '#0056b3', // Xanh đậm
                backgroundColor: 'rgba(0, 86, 179, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#0056b3',
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true,
                tension: 0.4 // Làm mượt đường cong hơn
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                y: {
                    duration: 2000,
                    from: 500
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: chartsData.gdp_growth.description,
                    font: { size: 16 }
                },
                legend: { position: 'bottom' },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 13 },
                    bodyFont: { size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: false, // Để thấy rõ biến động giá dầu
                    title: { display: true, text: 'USD/thùng' }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });

    // 2. Biểu đồ cột (Lạm phát)
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: chartsData.inflation.labels,
            datasets: [{
                label: chartsData.inflation.label,
                data: chartsData.inflation.data,
                backgroundColor: [
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(220, 53, 69, 0.8)', // Năm cao điểm màu đỏ
                    'rgba(23, 162, 184, 0.7)'
                ],
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 1,
                borderRadius: 5 // Bo góc cột
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: commonAnimation,
            plugins: {
                title: {
                    display: true,
                    text: chartsData.inflation.description,
                    font: { size: 16 }
                },
                legend: { position: 'bottom' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Phần trăm (%)' }
                }
            }
        }
    });

    // 3. Biểu đồ tròn (Cơ cấu kinh tế)
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'doughnut', // Dạng bánh donut nhìn hiện đại hơn pie thường
        data: {
            labels: chartsData.sector_structure.labels,
            datasets: [{
                label: chartsData.sector_structure.label,
                data: chartsData.sector_structure.data,
                backgroundColor: [
                    '#007bff', 
                    '#6610f2', 
                    '#28a745',
                    '#dc3545',
                    '#ffc107',
                    '#6c757d'
                ],
                borderWidth: 2,
                hoverOffset: 15 // Nổi lên khi hover
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                animateRotate: true
            },
            plugins: {
                title: {
                    display: true,
                    text: chartsData.sector_structure.description,
                    font: { size: 16 }
                },
                legend: { position: 'bottom' }
            }
        }
    });
}
