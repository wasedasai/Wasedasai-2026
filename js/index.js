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

    // 【追加】進行度の上限を 140 に設定（100〜140 が余白スクロールになります）
    const MAX_PROGRESS = 160; 

    document.body.classList.add('no-scroll');

    // ==========================================
    // マウスホイール制御
    // ==========================================
    window.addEventListener('wheel', (e) => {
        if (!isFinished) return;

        // ページ最上部で上にスクロールしたら再び固定モードへ
        if (!isLocked && window.scrollY <= 0 && e.deltaY < 0) {
            isLocked = true;
            document.body.classList.add('no-scroll');
        }

        if (isLocked) {
            e.preventDefault();

            // グラデ感度はそのまま(0.08)
            targetProgress += e.deltaY * 0.08;
            targetProgress = Math.max(0, Math.min(MAX_PROGRESS, targetProgress));

            // MAX_PROGRESS（140）まで回しきった時にロック解除
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

            targetProgress += deltaY * 0.15;
            targetProgress = Math.max(0, Math.min(MAX_PROGRESS, targetProgress));

            if (targetProgress >= MAX_PROGRESS && deltaY > 0) {
                isLocked = false;
                document.body.classList.remove('no-scroll');
            }

            startY = currentY;
        }
    }, { passive: false });

    // ==========================================
    // 描画ループ
    // ==========================================
    function updateGradient() {
        currentProgress += (targetProgress - currentProgress) * 0.1;

        // 画面描画（グラデ・図形）は100%で止めておく
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