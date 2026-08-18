// ==========================================
// 1. メニューの開閉処理
// ==========================================
const menuBtn = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const menuClose = document.getElementById('menu-close');

if (menuBtn && menuOverlay && menuClose) {
    // メニューを開く
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.add('active');
    });

    // メニューを閉じる
    menuClose.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });
}

// ==========================================
// 2. アンダーラインのアニメーション処理（追加部分）
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // 画面内に入った時
        if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
        } 
        // 画面外に出た時（リセットして再度アニメーションできるようにする）
        else {
            entry.target.classList.remove('is-active');
        }
    });
}, {
    // 画面に10%入ったら発火
    threshold: 0.1 
});

// ページ内のすべての .under-line を取得して監視対象にする
const lines = document.querySelectorAll('.under-line');
lines.forEach(line => {
    observer.observe(line);
});