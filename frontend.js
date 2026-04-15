// Minimal script: embed iframe is provided in HTML. Keep ad banner logic only.
const AD_REDIRECT_URL = "https://forrrward.blogspot.com/";

document.addEventListener('DOMContentLoaded', () => {
    const ad1 = document.getElementById('adBannerWrapper1');
    const ad2 = document.getElementById('adBannerWrapper2');
    const adImage1 = document.getElementById('adImage1');
    const adImage2 = document.getElementById('adImage2');
    const adClose1 = document.getElementById('adCloseBtn1');

    function showAd(el) {
        if (!el) return;
        el.style.display = 'flex';
        el.style.bottom = '0px';
        el.setAttribute('aria-hidden', 'false');
    }
    function hideAd(el) {
        if (!el) return;
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
    }

    // Show first ad after 2 seconds
    setTimeout(() => showAd(ad1), 2000);

    // Scroll page down by 40% of total document height shortly after load
    setTimeout(() => {
        try {
            const doc = document.documentElement || document.body;
            const target = Math.round((document.documentElement.scrollHeight || document.body.scrollHeight) * 0.4);
            window.scrollTo({ top: target, behavior: 'smooth' });
        } catch (err) {
            console.warn('Auto-scroll failed:', err);
        }
    }, 300);

    // Redirect handlers
    function redirectToAd() {
        window.location.href = AD_REDIRECT_URL;
    }
    if (adImage1) adImage1.addEventListener('click', redirectToAd);
    if (adImage2) adImage2.addEventListener('click', redirectToAd);

    // Close button hides ad1 and shows ad2
    if (adClose1) adClose1.addEventListener('click', (e) => {
        e.stopPropagation();
        hideAd(ad1);
        showAd(ad2);
    });
    if (adClose1) adClose1.addEventListener('touchstart', (e) => { e.stopPropagation(); hideAd(ad1); showAd(ad2); }, { passive: true });

    // Ensure ad banners move above footer when footer is visible during scroll
    const footerEl = document.querySelector('footer');
    function updateAdBottomOffset() {
        if (!footerEl) return;
        const rect = footerEl.getBoundingClientRect();
        // visible part of footer in viewport (px)
        const visible = Math.max(0, window.innerHeight - rect.top);
        // add small margin
        const offset = visible > 0 ? (visible + 8) : 0;
        [ad1, ad2].forEach(ad => {
            if (!ad) return;
            // Only adjust if currently displayed (or allow hidden as well)
            ad.style.bottom = offset > 0 ? `${offset}px` : '0px';
        });
    }

    // Observe footer intersection to update ad position
    if (footerEl && ('IntersectionObserver' in window)) {
        const obs = new IntersectionObserver(() => {
            updateAdBottomOffset();
        }, { root: null, threshold: [0, 0.01, 0.1, 0.5, 1] });
        obs.observe(footerEl);
    }
    // Also update on scroll/resize in case observer isn't supported or for fine updates
    window.addEventListener('scroll', updateAdBottomOffset, { passive: true });
    window.addEventListener('resize', updateAdBottomOffset);
});
