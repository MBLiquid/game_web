
const AD_REDIRECT_URL = "https://forrrward.blogspot.com/";


// --- Initialization on page load ---
window.onload = () => {
    const storedLang = getLanguage();
    if (langSelect) langSelect.value = storedLang;
    updateLanguageTexts(storedLang);
    
    // Initialize customization controls to default values
    if (fontFamilySelect) fontFamilySelect.value = 'Playfair Display';
    if (fontSizeInput) {
        fontSizeInput.value = '1.5';
        if (fontSizeValueSpan) fontSizeValueSpan.textContent = '1.5em';
    }
    if (fontColorInput) fontColorInput.value = '#333333';
    if (document.getElementById('posCenter')) document.getElementById('posCenter').checked = true; 
    if (document.getElementById('alignCenter')) document.getElementById('alignCenter').checked = true; 
    
    updateStatus(writeStatusDiv, translations[storedLang].statusEnterPhrase, 'info');
    clearPhraseResult(); 
    updateStatus(topFindStatusDiv, '', ''); 
    if (providerForSearch) fetchChainId(); 
    
    // Initial state: Not in submission, all customization controls enabled
    isSubmissionInProgress = false;
    setCustomizationControlsState(true); 
    updatePreviewPostcard();
    updatePhraseLengthCounter();
    
    // Hide payment warning box initially
    if (paymentWarningBox) paymentWarningBox.style.display = 'none'; // Ensure it's hidden on load

    // Initialize receive address input placeholder and hint
    if (receiveAddressInput) receiveAddressInput.placeholder = translations[storedLang].receiveAddressPlaceholder;
    if (document.querySelector('.receive-address-section .input-hint[data-lang-key="receiveAddressHint"]')) document.querySelector('.receive-address-section .input-hint[data-lang-key="receiveAddressHint"]').textContent = translations[storedLang].receiveAddressHint;
    
    // Ensure txid-link is hidden on page load, if modal is not active (which it shouldn't be)
    // This is handled by CSS, but a JS check ensures the inline style is correctly set initially if needed
    const initialTxidLinkParent = fullscreenBlockchainRecordTxHashLink.parentElement;
    if (initialTxidLinkParent) {
        initialTxidLinkParent.style.display = 'none';
    }

    // Check URL for shared postcard link
    const urlParams = new URLSearchParams(window.location.search);
    const txidFromUrl = urlParams.get('txid');
    if (txidFromUrl) {
        const recordSection = document.getElementById('recordSection');
        if (recordSection) recordSection.style.display = 'none';
        
        performPhraseSearch(txidFromUrl, topFindStatusDiv);
            
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Call updateInitialActiveSection after all other onload logic to set initial active nav item
    updateInitialActiveSection(); 
    // NEW AD BANNER LOGIC: Показать баннеры через 7 секунд
    setTimeout(showAdBanners, 100); 

    // Добавляем слушатели событий для баннеров
    if (adCloseBtn1) {
        adCloseBtn1.addEventListener('click', () => {
            if (adBannerWrapper1) {
                adBannerWrapper1.style.display = 'none'; // Скрываем первый баннер
                updateBannerPositions(); // Пересчитываем позиции остальных баннеров
            }
        });
    }

    if (adImage1) {
        adImage1.addEventListener('click', () => {
            window.open(AD_REDIRECT_URL, '_blank'); // Открываем в новой вкладке
        });
    }

    if (adImage2) {
        adImage2.addEventListener('click', () => {
            window.open(AD_REDIRECT_URL, '_blank'); // Открываем в новой вкладке
        });
    }

    // Обновляем позиции баннеров при изменении размера окна (например, при повороте на мобильном или изменении размера окна на десктопе)
    window.addEventListener('resize', updateBannerPositions);
};

// --- NEW: Ad Banner Logic Functions ---

// Функция для обновления нижней позиции баннеров, учитывая мобильную навигацию и их стек
function updateBannerPositions() {
    let currentBottomOffset = 0;
    const mobileNav = document.getElementById('main-nav-bar');
    const isMobileView = window.matchMedia("(max-width: 768px)").matches;

    // Учитываем фиксированную мобильную панель навигации, если она активна внизу
    // CSS для #main-nav-bar устанавливает bottom: 0 на мобильных, поэтому проверяем, что это display:flex и fixed
    if (isMobileView && mobileNav && getComputedStyle(mobileNav).position === 'fixed' && getComputedStyle(mobileNav).bottom === '0px') {
        currentBottomOffset += mobileNav.offsetHeight;
    }
    // Добавляем небольшой общий отступ от нижнего края viewport
    currentBottomOffset += 10; // 10px от низа или над мобильной навигацией

    // Позиционируем adBannerWrapper1
    if (adBannerWrapper1 && adBannerWrapper1.style.display !== 'none') {
        adBannerWrapper1.style.bottom = `${currentBottomOffset}px`;
        // Устанавливаем ширину adBannerWrapper1 в соответствии с шириной .container
        const mainContainer = document.querySelector('.container');
        if (mainContainer) {
            adBannerWrapper1.style.width = `${mainContainer.offsetWidth}px`;
            adBannerWrapper1.style.maxWidth = `${mainContainer.offsetWidth}px`;
        }
        currentBottomOffset += adBannerWrapper1.offsetHeight + 10; // Добавляем высоту баннера 1 + 10px отступа
    }

    // Позиционируем adBannerWrapper2
    if (adBannerWrapper2 && adBannerWrapper2.style.display !== 'none') {
        adBannerWrapper2.style.bottom = `${currentBottomOffset}px`;
        // Устанавливаем ширину adBannerWrapper2 в соответствии с шириной .container (если требуется)
        const mainContainer = document.querySelector('.container');
        if (mainContainer) {
            adBannerWrapper2.style.width = `${mainContainer.offsetWidth}px`;
            adBannerWrapper2.style.maxWidth = `${mainContainer.offsetWidth}px`;
        }
    }
}

// Функция для показа баннеров
function showAdBanners() {
    if (adBannerWrapper1) {
        adBannerWrapper1.style.display = 'block';
    }
    if (adBannerWrapper2) {
        adBannerWrapper2.style.display = 'block';
    }
    updateBannerPositions(); // Устанавливаем начальные позиции после отображения
}