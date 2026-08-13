const menuBtn = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const menuClose = document.getElementById('menu-close');
// targetSection の取得も不要になります

if (menuBtn && menuOverlay && menuClose) {
    // ※ここにあった window.addEventListener('scroll', ...) の処理を丸ごと削除

    // メニューを開く処理のみ残す
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.add('active');
    });

    // メニューを閉じる処理のみ残す
    menuClose.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });
}