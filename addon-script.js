// =========================================
// ADD-ON SCRIPT: NEWS & RESEARCH GUIDE
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Add-on script loaded!");
    
    // Tải dữ liệu từ news.json
    fetch('addon-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể tải file addon-data.json');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dữ liệu Add-on đã tải:', data);
            renderNews(data.news);
            renderResearchGuide(data.research_guide);
        })
        .catch(error => {
            console.error('Lỗi Add-on:', error);
            // Hiển thị fallback nếu lỗi
            document.getElementById('news-container').innerHTML = '<p class="text-danger text-center">Không thể tải tin tức. Vui lòng kiểm tra kết nối mạng hoặc file addon-data.json.</p>';
        });
});

// --- Hàm Render Tin Tức ---
function renderNews(newsData) {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    container.innerHTML = ''; // Xóa nội dung cũ

    newsData.forEach((item, index) => {
        // Tính thời gian hiển thị
        const timeAgo = calculateTimeAgo(item.date);
        const isNew = timeAgo.includes('phút') || timeAgo.includes('giờ') || timeAgo === 'Vừa xong';

        const newsHTML = `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="news-card">
                    <div class="news-meta">
                        <span class="badge bg-light text-dark border">${item.category}</span>
                        <span class="small text-muted news-time"><i class="far fa-clock"></i> ${timeAgo}</span>
                    </div>
                    <h5 class="news-title">
                        ${item.title} 
                        ${isNew ? '<span class="badge bg-danger ms-1 small">NEW</span>' : ''}
                    </h5>
                    <p class="news-summary small text-secondary">${item.summary}</p>
                    <div class="mt-auto pt-2 border-top">
                        <button class="btn btn-sm btn-outline-primary w-100 stretched-link btn-view-news" data-id="${item.id}">Xem chi tiết <i class="fas fa-arrow-right small"></i></button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newsHTML);
    });

    // Thêm sự kiện click cho các nút Xem chi tiết
    document.querySelectorAll('.btn-view-news').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định (scroll lên đầu trang)
            const newsId = this.getAttribute('data-id');
            const newsItem = newsData.find(n => n.id == newsId);
            if (newsItem) {
                showNewsModal(newsItem);
            }
        });
    });
}

// --- Hàm Hiển Thị Modal Tin Tức ---
function showNewsModal(newsItem) {
    const modalTitle = document.getElementById('modal-news-title');
    const modalDate = document.getElementById('modal-news-date');
    const modalCategory = document.getElementById('modal-news-category');
    const modalContent = document.getElementById('modal-news-content');

    if (modalTitle) modalTitle.textContent = newsItem.title;
    if (modalDate) modalDate.textContent = new Date(newsItem.date).toLocaleDateString('vi-VN');
    if (modalCategory) modalCategory.textContent = newsItem.category;
    
    // Giả lập nội dung chi tiết dài hơn (vì file json chỉ có summary)
    if (modalContent) {
        modalContent.innerHTML = `
            <p class="fw-bold lead">${newsItem.summary}</p>
            <p>Theo báo cáo mới nhất, ${newsItem.summary.toLowerCase()} Sự kiện này đang thu hút sự quan tâm lớn từ giới chuyên gia và các nhà hoạch định chính sách.</p>
            <p>Phân tích sâu hơn cho thấy tác động của nó có thể kéo dài trong nhiều quý tới. Các doanh nghiệp cần chủ động theo dõi sát sao diễn biến thị trường để có phương án ứng phó kịp thời.</p>
            <div class="alert alert-info mt-3">
                <i class="fas fa-info-circle"></i> Đây là nội dung chi tiết được tạo tự động để minh họa tính năng Modal (Popup) mà không cần tải lại trang.
            </div>
        `;
    }

    // Hiển thị Modal bằng Bootstrap API
    const newsModal = new bootstrap.Modal(document.getElementById('newsModal'));
    newsModal.show();
}

// --- Hàm Tính Thời Gian (Time Ago) ---
function calculateTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " năm trước";
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " tháng trước";
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " ngày trước";
    if (interval === 1) return "Hôm qua";
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " giờ trước";
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " phút trước";
    
    return "Vừa xong";
}

// --- Hàm Render Hướng Dẫn Nghiên Cứu (Checklist) ---
function renderResearchGuide(guideData) {
    const container = document.getElementById('guide-container');
    if (!container) return;
    
    container.innerHTML = ''; // Xóa nội dung cũ

    guideData.forEach((step, index) => {
        // Tạo checklist HTML
        let checklistHTML = '<ul class="guide-checklist list-unstyled mt-3">';
        step.checklist.forEach((checkItem, checkIndex) => {
            const checkId = `check-${step.step}-${checkIndex}`;
            // Load trạng thái đã lưu (nếu có - localStorage có thể thêm sau)
            checklistHTML += `
                <li class="d-flex align-items-start mb-2">
                    <div class="form-check">
                        <input class="form-check-input mt-1" type="checkbox" id="${checkId}" onchange="toggleCheck('${checkId}')">
                        <label class="form-check-label ms-2" for="${checkId}">${checkItem}</label>
                    </div>
                </li>
            `;
        });
        checklistHTML += '</ul>';

        const stepHTML = `
            <div class="guide-step position-relative ps-5 pb-5" data-step="${step.step}">
                <div class="guide-content p-4 bg-light rounded border shadow-sm">
                    <h5 class="guide-title text-primary fw-bold mb-3">${step.title}</h5>
                    <p class="text-muted mb-0">${step.description}</p>
                    ${checklistHTML}
                </div>
                <!-- Đường nối dọc (CSS pseudo-element xử lý) -->
            </div>
        `;
        container.insertAdjacentHTML('beforeend', stepHTML);
    });
}

// --- Hàm Toggle Checklist (Lưu trạng thái tạm thời) ---
function toggleCheck(id) {
    const checkbox = document.getElementById(id);
    if (checkbox.checked) {
        // Hiệu ứng chúc mừng nhỏ (console log)
        console.log(`Đã hoàn thành mục: ${id}`);
    }
}
