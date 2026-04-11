// Minimal frontend for playable canvas game and ad banners
const AD_REDIRECT_URL = "https://forrrward.blogspot.com/";

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const canvas = document.getElementById('gameCanvas');
    const ad1 = document.getElementById('adBannerWrapper1');
    const ad2 = document.getElementById('adBannerWrapper2');
    const adImage1 = document.getElementById('adImage1');
    const adImage2 = document.getElementById('adImage2');
    const adClose1 = document.getElementById('adCloseBtn1');

    // Simple responsive canvas setup
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(300, rect.width) * dpr;
        canvas.height = Math.max(200, rect.height) * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Game state
    let paddle = { x: 0.5, width: 0.25 }; // normalized
    let ball = { x: 0.5, y: 0.5, vx: 0.004, vy: -0.005, r: 10 };
    let playing = false;
    let score = 0;
    let lives = 3;

    function toPx(normX) { return normX * canvas.clientWidth; }

    function resetBall() {
        ball.x = 0.5;
        ball.y = 0.6;
        // random direction up
        const speed = 0.5 + Math.random() * 0.6;
        const angle = (Math.random() * Math.PI / 2) + Math.PI/4; // 45-135deg
        ball.vx = Math.cos(angle) * speed * 0.006;
        ball.vy = -Math.abs(Math.sin(angle) * speed * 0.006);
    }

    resetBall();

    // Input handling (mouse + touch)
    function setPaddleFromClientX(clientX) {
        const rect = canvas.getBoundingClientRect();
        let px = (clientX - rect.left) / rect.width;
        px = Math.max(0, Math.min(1, px));
        paddle.x = px;
    }
    let pointerDown = false;
    canvas.addEventListener('mousedown', (e) => { pointerDown = true; setPaddleFromClientX(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (pointerDown) setPaddleFromClientX(e.clientX); });
    window.addEventListener('mouseup', () => { pointerDown = false; });

    canvas.addEventListener('touchstart', (e) => {
        pointerDown = true;
        setPaddleFromClientX(e.touches[0].clientX);
        // start game on touch
        if (!playing) { playing = true; }
    }, { passive: true });
    window.addEventListener('touchmove', (e) => { if (pointerDown) setPaddleFromClientX(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => { pointerDown = false; });

    // Click to launch
    canvas.addEventListener('click', () => { playing = true; });

    // Game loop
    let last = performance.now();
    function loop(now) {
        const dt = Math.min(40, now - last);
        last = now;
        update(dt/16);
        render();
        requestAnimationFrame(loop);
    }

    function update(delta) {
        if (!playing) return;
        // move ball
        ball.x += ball.vx * delta * 16;
        ball.y += ball.vy * delta * 16;

        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;

        // walls
        if (ball.x * cw - ball.r < 0) { ball.x = (ball.r)/cw; ball.vx = Math.abs(ball.vx); }
        if (ball.x * cw + ball.r > cw) { ball.x = 1 - (ball.r)/cw; ball.vx = -Math.abs(ball.vx); }
        if (ball.y * ch - ball.r < 0) { ball.y = (ball.r)/ch; ball.vy = Math.abs(ball.vy); }

        // paddle collision
        const paddlePx = toPx(paddle.x);
        const paddleW = paddle.width * cw;
        const paddleH = 12;
        const paddleY = ch - 40;
        const ballPx = ball.x * cw;
        const ballPy = ball.y * ch;

        if (ballPy + ball.r >= paddleY && ballPy - ball.r <= paddleY + paddleH) {
            if (ballPx >= paddlePx - paddleW/2 && ballPx <= paddlePx + paddleW/2 && ball.vy > 0) {
                // reflect
                const rel = (ballPx - paddlePx) / (paddleW/2); // -1..1
                const bounce = rel * 0.01; // adjust vx
                ball.vx += bounce;
                ball.vy = -Math.abs(ball.vy) * 0.98; // lose small energy
                score += 1;
            }
        }

        // bottom - miss
        if (ballPy - ball.r > ch) {
            lives -= 1;
            if (lives <= 0) {
                // reset game
                lives = 3;
                score = 0;
            }
            playing = false;
            resetBall();
        }
    }

    function render() {
        resizeCanvas();
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx.clearRect(0,0,w,h);

        // background
        const grad = ctx.createLinearGradient(0,0,0,h);
        grad.addColorStop(0,'#081024');
        grad.addColorStop(1,'#001018');
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,w,h);

        // draw paddle
        const paddlePx = toPx(paddle.x);
        const paddleW = paddle.width * w;
        ctx.fillStyle = '#28a';
        roundRect(ctx, paddlePx - paddleW/2, h - 40, paddleW, 12, 6);
        ctx.fill();

        // draw ball
        ctx.beginPath();
        ctx.fillStyle = '#ffd56b';
        ctx.arc(ball.x * w, ball.y * h, ball.r, 0, Math.PI*2);
        ctx.fill();

        // HUD
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 12, 22);
        ctx.textAlign = 'right';
        ctx.fillText('Lives: ' + lives, w - 12, 22);

        if (!playing) {
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.fillRect(w/2 - 140, h/2 - 36, 280, 72);
            ctx.fillStyle = '#fff';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Tap / Click to Play', w/2, h/2);
            ctx.font = '12px Arial';
            ctx.fillText('Move paddle by dragging', w/2, h/2 + 20);
        }
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    requestAnimationFrame(loop);

    // --- Ad Banner Logic ---
    function showAd1() {
        if (!ad1) return;
        ad1.style.display = 'flex';
        ad1.style.bottom = '0px';
        ad1.setAttribute('aria-hidden', 'false');
    }
    function showAd2() {
        if (!ad2) return;
        ad2.style.display = 'flex';
        ad2.style.bottom = '0px';
        ad2.setAttribute('aria-hidden', 'false');
    }

    // Show pict1 after 2 seconds
    setTimeout(() => {
        showAd1();
    }, 2000);

    // Click handlers for ads -> redirect
    function redirectToAd() {
        // Use location.href to redirect in same tab
        window.location.href = AD_REDIRECT_URL;
    }
    if (adImage1) adImage1.addEventListener('click', redirectToAd);
    if (adImage2) adImage2.addEventListener('click', redirectToAd);

    // Close button hides ad1 and shows ad2 in its place
    if (adClose1) adClose1.addEventListener('click', (e) => {
        e.stopPropagation();
        if (ad1) { ad1.style.display = 'none'; ad1.setAttribute('aria-hidden','true'); }
        showAd2();
    });

    // Ensure close button also on small screens works with touch
    if (adClose1) adClose1.addEventListener('touchstart', (e) => { e.stopPropagation(); if (ad1) { ad1.style.display = 'none'; ad1.setAttribute('aria-hidden','true'); } showAd2(); }, { passive: true });

    // Accessibility: clicking outside ad should do nothing; ad covers bottom full width
});
