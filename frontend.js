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
});
