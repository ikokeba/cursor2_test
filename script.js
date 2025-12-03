// テーマ切り替え機能
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// 保存されたテーマを読み込む
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// テーマ切り替えボタンのイベントリスナー
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// テーマアイコンの更新
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// スクロール時のヘッダー効果
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = '0 2px 4px var(--shadow)';
    } else {
        header.style.boxShadow = '0 4px 8px var(--shadow)';
    }
    
    lastScroll = currentScroll;
});

// スクロールアニメーション（Intersection Observer）
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // プログレスバーのアニメーション
            const progressBars = entry.target.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 200);
            });
        }
    });
}, observerOptions);

// アニメーション対象要素を監視
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// タイピングエフェクト
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ページ読み込み時にタイピングエフェクトを実行（一度だけ）
let typingExecuted = false;
window.addEventListener('DOMContentLoaded', () => {
    if (typingExecuted) return;
    
    const nameElement = document.getElementById('typing-name');
    const descriptionElement = document.getElementById('typing-description');
    
    if (nameElement && descriptionElement) {
        const nameText = nameElement.textContent;
        const descriptionText = descriptionElement.textContent;
        
        // 名前のタイピング
        setTimeout(() => {
            typeWriter(nameElement, nameText, 100);
        }, 500);
        
        // 説明文のタイピング
        setTimeout(() => {
            typeWriter(descriptionElement, descriptionText, 30);
        }, nameText.length * 100 + 1000);
        
        typingExecuted = true;
    }
});

// パララックス効果（軽微な効果）
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.section');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.1;
                const yPos = scrolled * speed * (index + 1);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
    
    // スクロールトップボタンの表示/非表示
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
    
    // アクティブなナビゲーションリンクの更新
    updateActiveNavLink();
});

// スクロールトップボタンの機能
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// アクティブなナビゲーションリンクの更新
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

