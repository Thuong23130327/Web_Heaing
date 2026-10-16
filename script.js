const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-links li a');

if (hamburger && navLinks) {
    let backdrop = document.querySelector('.menu-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        document.body.insertBefore(backdrop, document.body.firstChild);
    }

    const toggleMenu = (forceState) => {
        const isActive = forceState !== undefined ? forceState : !navLinks.classList.contains('active');
        navLinks.classList.toggle('active', isActive);
        hamburger.classList.toggle('active', isActive);
        backdrop.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            toggleMenu(false);
        });
    });

    backdrop.addEventListener('click', () => {
        toggleMenu(false);
    });

    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu(false);
        }
    });

    navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function createSnowflakes() {
    const container = document.getElementById('snow-container');
    if (!container) return;
    const snowflakeCount = window.innerWidth < 768 ? 20 : 50; 
    for (let i = 0; i < snowflakeCount; i++) {
        const snow = document.createElement('div');
        snow.className = 'snowflake';
        snow.style.left = `${Math.random() * 100}vw`;
        snow.style.animationDuration = `${Math.random() * 3 + 4}s`;
        snow.style.animationDelay = `${Math.random() * 5}s`;
        const size = Math.random() * 4 + 2; 
        snow.style.width = `${size}px`;
        snow.style.height = `${size}px`;
        snow.style.opacity = Math.random();
        container.appendChild(snow);
    }
}

function init3DCarousel() {
    const ring = document.getElementById('carouselRing');
    if (!ring) return;

    const items = ring.querySelectorAll('.carousel-3d-item');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const infoTitle = document.getElementById('carouselInfoTitle');
    const infoDesc = document.getElementById('carouselInfoDesc');
    const infoSeason = document.getElementById('carouselInfoSeason');

    if (!items.length) return;

    const total = items.length;
    const theta = 360 / total;
    let currentStep = 0;
    let autoRotateTimer = null;
    let isDragging = false;
    let startX = 0;
    let currentDragAngle = 0;
    let previousAngle = 0;

    function getRadius() {
        const itemWidth = window.innerWidth < 400 ? 90 : (window.innerWidth < 768 ? 100 : 200);
        return Math.round((itemWidth / 2) / Math.tan(Math.PI / total)) + (window.innerWidth < 768 ? 25 : 40);
    }

    function setupPositions() {
        const radius = getRadius();
        const activeIdx = ((currentStep % total) + total) % total;
        items.forEach((item, i) => {
            const angle = i * theta;
            const yOffset = parseFloat(item.dataset.yOffset) || (i % 3 === 0 ? -70 : (i % 3 === 1 ? 60 : 0));
            const tiltX = parseFloat(item.dataset.tiltX) || (i % 2 === 0 ? -5 : 5);
            const tiltZ = parseFloat(item.dataset.tiltZ) || (i % 2 === 0 ? 3 : -3);
            const isActive = i === activeIdx;
            
            if (isActive) {
                item.style.transform = `rotateY(${angle}deg) translateZ(${radius + (window.innerWidth < 768 ? 30 : 60)}px) translateY(0px) rotateX(0deg) rotateZ(0deg) scale(1.15)`;
            } else {
                item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOffset}px) rotateX(${tiltX}deg) rotateZ(${tiltZ}deg) scale(1)`;
            }
        });
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        items.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                stopAutoRotate();
                goToItem(i);
            });
            dotsContainer.appendChild(dot);
        });
    }

    function updateDetails() {
        const activeIdx = ((currentStep % total) + total) % total;
        setupPositions();
        items.forEach((item, i) => {
            item.classList.toggle('active', i === activeIdx);
        });

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIdx);
            });
        }

        const activeItem = items[activeIdx];
        if (activeItem) {
            if (infoTitle) infoTitle.textContent = activeItem.dataset.title || '';
            if (infoDesc) infoDesc.textContent = activeItem.dataset.desc || '';
            if (infoSeason) infoSeason.textContent = activeItem.dataset.season || '';
        }
    }

    function rotateToStep(step, animate = true) {
        currentStep = step;
        ring.classList.toggle('is-dragging', !animate);
        const targetAngle = -currentStep * theta;
        previousAngle = targetAngle;
        ring.style.transform = `rotateY(${targetAngle}deg)`;
        updateDetails();
    }

    function goToItem(targetIndex) {
        const currIdx = ((currentStep % total) + total) % total;
        let diff = targetIndex - currIdx;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        rotateToStep(currentStep + diff);
    }

    function startAutoRotate() {
        stopAutoRotate();
        autoRotateTimer = setInterval(() => {
            rotateToStep(currentStep + 1);
        }, 3200);
    }

    function stopAutoRotate() {
        if (autoRotateTimer) {
            clearInterval(autoRotateTimer);
            autoRotateTimer = null;
        }
    }

    const photoModal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalBadge = document.getElementById('modalBadge');
    const modalCurrent = document.getElementById('modalCurrent');
    const modalTotal = document.getElementById('modalTotal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalPrevBtn = document.getElementById('modalPrevBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');

    let modalActiveIndex = 0;

    function openModal(index) {
        modalActiveIndex = ((index % total) + total) % total;
        const item = items[modalActiveIndex];
        if (!item) return;
        const img = item.querySelector('img');
        if (modalImg && img) modalImg.src = img.src;
        if (modalTitle) modalTitle.textContent = item.dataset.title || '';
        if (modalSubtitle) modalSubtitle.textContent = item.dataset.subtitle || item.dataset.season || '';
        if (modalDesc) modalDesc.textContent = item.dataset.desc || '';
        if (modalBadge) modalBadge.textContent = item.dataset.season || '';
        if (modalCurrent) modalCurrent.textContent = (modalActiveIndex + 1);
        if (modalTotal) modalTotal.textContent = total;

        if (photoModal) {
            photoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (photoModal) {
            photoModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalPrevBtn) modalPrevBtn.addEventListener('click', () => openModal(modalActiveIndex - 1));
    if (modalNextBtn) modalNextBtn.addEventListener('click', () => openModal(modalActiveIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (!photoModal || !photoModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') openModal(modalActiveIndex - 1);
        if (e.key === 'ArrowRight') openModal(modalActiveIndex + 1);
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoRotate();
            rotateToStep(currentStep - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoRotate();
            rotateToStep(currentStep + 1);
        });
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            stopAutoRotate();
            goToItem(index);
            openModal(index);
        });
    });

    const scene = ring.parentElement;
    if (scene) {
        const onDragStart = (x) => {
            isDragging = true;
            startX = x;
            ring.classList.add('is-dragging');
            stopAutoRotate();
        };

        const onDragMove = (x) => {
            if (!isDragging) return;
            const deltaX = x - startX;
            currentDragAngle = previousAngle + (deltaX * 0.35);
            ring.style.transform = `rotateY(${currentDragAngle}deg)`;
        };

        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            ring.classList.remove('is-dragging');
            const nearestStep = Math.round(-currentDragAngle / theta);
            rotateToStep(nearestStep);
        };

        scene.addEventListener('mousedown', (e) => onDragStart(e.clientX));
        window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
        window.addEventListener('mouseup', onDragEnd);

        scene.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
        scene.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });
        scene.addEventListener('touchend', onDragEnd);

        scene.addEventListener('mouseenter', stopAutoRotate);
        scene.addEventListener('mouseleave', () => {
            if (!isDragging) startAutoRotate();
        });
    }

    window.addEventListener('resize', () => {
        setupPositions();
        rotateToStep(currentStep, false);
    });

    setupPositions();
    createDots();
    rotateToStep(0, false);
    startAutoRotate();
}

window.addEventListener('DOMContentLoaded', () => {
    createSnowflakes();
    init3DCarousel();
});

function reveal() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', reveal);
reveal();

const PRICE_HACVU = 279000;
const PRICE_HOATUYET = 249000;
const PRICE_SAOBANG = 219000;

function updateQty(ticketId, change) {
    const input = document.getElementById(ticketId);
    let currentVal = parseInt(input.value) || 0;
    let newVal = currentVal + change;
    
    if (newVal < 0) newVal = 0;
    if (newVal > 10) newVal = 10;
    
    input.value = newVal;
    calculateTotal();
}

function calculateTotal() {
    const inputs = ['ticketHacVu', 'ticketHoaTuyet', 'ticketSaoBang'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        let val = parseInt(input.value) || 0;
        if (val < 0) val = 0;
        if (val > 10) val = 10;
        input.value = val;
    });

    const qtyHacVu = parseInt(document.getElementById('ticketHacVu').value) || 0;
    const qtyHoaTuyet = parseInt(document.getElementById('ticketHoaTuyet').value) || 0;
    const qtySaoBang = parseInt(document.getElementById('ticketSaoBang').value) || 0;
    
    const total = (qtyHacVu * PRICE_HACVU) + (qtyHoaTuyet * PRICE_HOATUYET) + (qtySaoBang * PRICE_SAOBANG);
    document.getElementById('totalPrice').textContent = total.toLocaleString('vi-VN');
}

function copyText(elementId) {
    const textToCopy = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Đã copy: " + textToCopy);
    }).catch(err => {
        console.error('Lỗi copy:', err);
    });
}

const ticketForm = document.getElementById('ticketForm');
if(ticketForm) {
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0PNhcPZuEj06rt3SqJ729K33lYbAoZQUPfDsozngkqk3jNAuosPc48s0l_GNuVXKo/exec';

    let isSubmitting = false;
    let lastSubmitData = null;
    let lastSubmitTime = 0;

    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Chống click liên tiếp hoặc double-submit khi đang gửi request
        if (isSubmitting) {
            return false;
        }

        const qtyHacVu = parseInt(document.getElementById('ticketHacVu').value) || 0;
        const qtyHoaTuyet = parseInt(document.getElementById('ticketHoaTuyet').value) || 0;
        const qtySaoBang = parseInt(document.getElementById('ticketSaoBang').value) || 0;

        if(qtyHacVu === 0 && qtyHoaTuyet === 0 && qtySaoBang === 0) {
            formMessage.textContent = 'Bạn phải chọn ít nhất 01 vé!';
            formMessage.className = 'form-message msg-error';
            return;
        }

        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        if (fullName.length < 2 || /\d/.test(fullName)) {
            formMessage.textContent = 'Họ tên không hợp lệ (tối thiểu 2 ký tự, không chứa số)!';
            formMessage.className = 'form-message msg-error';
            return;
        }

        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phone)) {
            formMessage.textContent = 'Số điện thoại không hợp lệ (phải bắt đầu bằng 03, 05, 07, 08, 09 và đủ 10 số)!';
            formMessage.className = 'form-message msg-error';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formMessage.textContent = 'Email không hợp lệ!';
            formMessage.className = 'form-message msg-error';
            return;
        }

        // 2. Chống gửi trùng lặp (nếu cùng SĐT vừa gửi thành công trong vòng 30 giây)
        const currentDataKey = `${phone}_${qtyHacVu}_${qtyHoaTuyet}_${qtySaoBang}`;
        const now = Date.now();
        if (lastSubmitData === currentDataKey && (now - lastSubmitTime < 30000)) {
            formMessage.textContent = 'Thông tin của bạn đã được gửi thành công trước đó. Vui lòng không gửi lại nhiều lần!';
            formMessage.className = 'form-message msg-error';
            return;
        }

        // 3. Khóa toàn bộ form và nút submit ngay lập tức
        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.7';
        ticketForm.style.pointerEvents = 'none';
        submitBtn.textContent = 'Đang xử lý, vui lòng chờ...';
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        const formData = new FormData(ticketForm);
        const totalAmount = (qtyHacVu * PRICE_HACVU) + (qtyHoaTuyet * PRICE_HOATUYET) + (qtySaoBang * PRICE_SAOBANG);
        formData.append('totalAmount', totalAmount);

        // Chờ phản hồi từ máy chủ và đọc JSON
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json()) // Phân tích JSON trả về từ Google Script
        .then(data => {
            if (data.result === 'success') {
                lastSubmitData = currentDataKey;
                lastSubmitTime = Date.now();

                formMessage.textContent = 'Đặt vé thành công! Trong vòng 2-3 ngày, Đội ngũ Hea_ing sẽ liên hệ bạn qua SĐT (Zalo) để xác nhận thông tin.';
                formMessage.classList.add('msg-success');
                formMessage.classList.remove('msg-error');
                ticketForm.reset();
                calculateTotal();

                submitBtn.textContent = '✓ Đã gửi thông tin thành công';
                submitBtn.disabled = true;

                // Mở lại khả năng tương tác cho form sau 5 giây nếu khách muốn đặt thêm lần nữa
                setTimeout(() => {
                    isSubmitting = false;
                    ticketForm.style.pointerEvents = 'auto';
                    submitBtn.textContent = 'Xác nhận đặt vé';
                    submitBtn.disabled = false;
                    submitBtn.style.pointerEvents = 'auto';
                    submitBtn.style.opacity = '1';
                }, 5000);
            } else {
                throw new Error(data.error || 'Lỗi không xác định từ server.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi form:', error);
            formMessage.textContent = 'Có lỗi xảy ra hoặc kết nối chậm! Vui lòng kiểm tra lại sau giây lát hoặc liên hệ Fanpage.';
            formMessage.classList.add('msg-error');
            formMessage.classList.remove('msg-success');

            // Cho phép thử lại sau 3 giây cooldown
            setTimeout(() => {
                isSubmitting = false;
                ticketForm.style.pointerEvents = 'auto';
                submitBtn.textContent = 'Xác nhận đặt vé';
                submitBtn.disabled = false;
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
            }, 3000);
        });
    });
}


