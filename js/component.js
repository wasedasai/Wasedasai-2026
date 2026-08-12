document.addEventListener('DOMContentLoaded', () => {
    // 要素を取得
    const saiMenuBtn = document.querySelector('.sai-menu');
    const slideMenu = document.getElementById('slideMenu');
    const menuCloseBtn = document.getElementById('menuClose');

    // 開くボタン (.sai-menu) をクリックした時の処理
    saiMenuBtn.addEventListener('click', () => {
        slideMenu.classList.add('is-active');
    });

    // 閉じるボタン (×マーク) をクリックした時の処理
    menuCloseBtn.addEventListener('click', () => {
        slideMenu.classList.remove('is-active');
    });
});