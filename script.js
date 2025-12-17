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

// グローバル変数でデータを保持
let aboutData, skillsData, experienceData;

// ページ読み込み時にコンテンツ生成とタイピングエフェクトを実行
let typingExecuted = false;
window.addEventListener('DOMContentLoaded', () => {
    // データをfetchで取得
    fetch('data.yaml')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            // YAMLをパース
            const data = jsyaml.load(text);
            aboutData = data.about;
            skillsData = data.skills;
            experienceData = data.experience;

            // データレンダリング
            renderAbout();
            renderSkills();
            renderExperience();

            // 監視対象要素（fade-in）を再登録
            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });

            if (typingExecuted) return;

            const nameElement = document.getElementById('typing-name');
            const descriptionElement = document.getElementById('typing-description');

            if (nameElement && descriptionElement && aboutData) {
                const nameText = aboutData.name;
                const descriptionText = aboutData.description;

                // 名前のタイピング
                setTimeout(() => {
                    typeWriter(nameElement, nameText, 100);
                }, 500);

                // 説明文のタイピング
                if (descriptionText) {
                    setTimeout(() => {
                        typeWriter(descriptionElement, descriptionText, 30);
                    }, nameText.length * 100 + 1000);
                }

                typingExecuted = true;
            }
        })
        .catch(error => {
            console.error('Error loading data:', error);
            const aboutContent = document.getElementById('about-content');
            if (aboutContent) {
                aboutContent.innerHTML = `<p style="text-align:center; color:red; padding: 20px;">
                    データの読み込みに失敗しました。<br>
                    ローカルファイル(file://)として開いている場合、ブラウザのセキュリティ制限により外部ファイルを読み込めません。<br>
                    VS Codeの「Live Server」機能などを使用して、ローカルサーバー経由でアクセスしてください。<br>
                    エラー詳細: ${error.message}
                </p>`;
            }
        });
});

// Aboutセクションのレンダリング
function renderAbout() {
    const container = document.getElementById('about-content');
    if (!container) return;

    container.innerHTML = `
        <div class="about-image fade-in">
            <img src="${aboutData.image}" alt="プロフィール画像" class="profile-img">
        </div>
        <div class="about-text fade-in">
            <a href="profile.html" class="about-name-btn" id="typing-name"></a>
            <p class="about-description" id="typing-description"></p>
        </div>
    `;
}

// Skillsセクションのレンダリング
function renderSkills() {
    const container = document.getElementById('skills-grid');
    if (!container) return;

    let html = '';
    skillsData.forEach(category => {
        let itemsHtml = '';
        category.items.forEach(item => {
            itemsHtml += `
                <div class="skill-progress-item">
                    <div class="skill-info">
                        <span class="skill-name">${item.name}</span>
                        <span class="skill-percent">${item.percent}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" data-progress="${item.percent}"></div>
                    </div>
                </div>
            `;
        });

        html += `
            <div class="skill-category fade-in">
                <h3 class="skill-category-title">${category.title}</h3>
                <div class="skill-progress-list">
                    ${itemsHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Experienceセクションのレンダリング
function renderExperience() {
    const container = document.getElementById('experience-timeline');
    if (!container) return;

    let html = '';
    experienceData.forEach(item => {
        html += `
            <div class="timeline-item fade-in">
                <div class="timeline-date">${item.period}</div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-description">
                        ${item.description}
                    </p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

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
