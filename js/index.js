document.addEventListener('DOMContentLoaded', () => {
    const loadingVideo = document.getElementById('loading-video');
    const loadingScreen = document.getElementById('loading-screen');
    const bgAnimation = document.getElementById('bg');
    const decorations = document.getElementById('decorations');

    let isFinished = false;

    function finishLoading() {
        if (isFinished) return;
        isFinished = true;
        if (loadingScreen) loadingScreen.classList.add('hidden');
    }

    if (loadingVideo) {
        loadingVideo.addEventListener('ended', finishLoading);
        loadingVideo.addEventListener('error', finishLoading);
        loadingVideo.play().catch(() => finishLoading());
    } else {
        finishLoading();
    }
    setTimeout(finishLoading, 4000);

    let targetProgress = 0;
    let currentProgress = 0;
    let isLocked = true;

    // 進行度の上限（図形が出きったらすぐにスクロール解除するよう100に設定）
    const MAX_PROGRESS = 100; 

    document.body.classList.add('no-scroll');

    // ==========================================
    // マウスホイール制御
    // ==========================================
    window.addEventListener('wheel', (e) => {
        if (!isFinished) return;

        if (!isLocked && window.scrollY <= 0 && e.deltaY < 0) {
            isLocked = true;
            document.body.classList.add('no-scroll');
        }

        if (isLocked) {
            e.preventDefault();

            targetProgress += e.deltaY * 0.08;
            targetProgress = Math.max(0, Math.min(MAX_PROGRESS, targetProgress));

            if (targetProgress >= MAX_PROGRESS && e.deltaY > 0) {
                isLocked = false;
                document.body.classList.remove('no-scroll');
            }
        }
    }, { passive: false });

    // ==========================================
    // スマホ・タブレット用スワイプ制御
    // ==========================================
    let startY = 0;
    window.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isFinished) return;

        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;

        if (!isLocked && window.scrollY <= 0 && deltaY < 0) {
            isLocked = true;
            document.body.classList.add('no-scroll');
        }

        if (isLocked) {
            if (e.cancelable) e.preventDefault();

            // 感度を 0.15 → 0.35 に変更してスマホの操作感を軽やかに調整
            targetProgress += deltaY * 0.35;
            targetProgress = Math.max(0, Math.min(MAX_PROGRESS, targetProgress));

            if (targetProgress >= MAX_PROGRESS && deltaY > 0) {
                isLocked = false;
                document.body.classList.remove('no-scroll');
            }

            startY = currentY;
        }
    }, { passive: false });

    // ==========================================
    // 画像（src）のクリック差し替え処理
    // ==========================================
    const blobs = document.querySelectorAll('.bg-blob');
    blobs.forEach(blob => {
        blob.style.cursor = 'pointer'; // ホバー時に指マークにする

        blob.addEventListener('click', () => {
            const currentSrc = blob.getAttribute('src');
            const altSrc = blob.getAttribute('data-alt');

            // data-alt にパスが指定されている場合のみ切り替える
            if (altSrc) {
                blob.setAttribute('src', altSrc);
                blob.setAttribute('data-alt', currentSrc); // 再クリックで元に戻るよう保管
            }
        });
    });

    // ==========================================
    // ★メニュー制御（スクロール表示・開閉）
    // ==========================================
    const menuBtn = document.getElementById('menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('menu-close');
    const targetSection = document.querySelector('.main-content'); // 「早稲田祭開催決定！」などがあるセクション

    if (menuBtn && menuOverlay && menuClose && targetSection) {
        window.addEventListener('scroll', () => {
            // 対象セクションの上端が、画面の中腹あたりまで来たらメニューボタンを表示
            const rect = targetSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8) {
                menuBtn.classList.add('show');
            } else {
                menuBtn.classList.remove('show');
                // スクロールで上部に戻った時にメニューが開いたままにならないよう閉じる
                menuOverlay.classList.remove('active'); 
            }
        });

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
    // 描画ループ
    // ==========================================
    function updateGradient() {
        currentProgress += (targetProgress - currentProgress) * 0.1;

        const renderProgress = Math.min(100, currentProgress);

        if (bgAnimation) {
            bgAnimation.style.backgroundPosition = `0% ${renderProgress.toFixed(2)}%`;
        }

        if (decorations) {
            if (renderProgress >= 98) {
                decorations.classList.add('show');
            } else {
                decorations.classList.remove('show');
            }
        }

        requestAnimationFrame(updateGradient);
    }

    updateGradient();
});