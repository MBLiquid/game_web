// --- CONFIGURATION ---
const BACKEND_API_BASE_URL = "https://"; // REPLACE with your Linux IP or domain
const RPC_URL_FOR_SEARCH = "https://mainnet.infura.io/"; // REPLACE with your Infura/Alchemy/QuickNode Sepolia URL
const AD_REDIRECT_URL = "https://forrrward.blogspot.com/";



// --- ETHERS.JS Setup for Network Info (Read-only) ---
let currentChainId = 0;
const providerForSearch = typeof ethers !== 'undefined' ? new ethers.providers.JsonRpcProvider(RPC_URL_FOR_SEARCH) : null;

// --- DOM Elements ---
const langSelect = document.getElementById('lang-select');


// Main Record Section
const phraseInput = document.getElementById('phraseInput');
const submitPhraseBtn = document.getElementById('submitPhraseBtn');
const editBtn = document.getElementById('editBtn');
const writeStatusDiv = document.getElementById('writeStatus');
const paymentDetailsDiv = document.getElementById('paymentDetails');
const paymentWarningBox = document.getElementById('paymentWarningBox'); // Reference to the warning box
const paymentAmountEthSpan = document.getElementById('paymentAmountEth'); 
const paymentAddressSpan = document.getElementById('paymentAddress'); 
const qrCodeImage = document.getElementById('qrCodeImage');
const copyAddressBtn = document.getElementById('copyAddressBtn');
const copyAmountBtn = document.getElementById('copyAmountBtn'); 
const countdownSpan = document.getElementById('countdown');

// Image Upload Elements
const imageUploadInput = document.getElementById('imageUpload');
const customFileUploadLabel = document.querySelector('.custom-file-upload'); 
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewPlaceholder = document.getElementById('imagePreviewPlaceholder');
const useCustomImageBtn = document.getElementById('useCustomImageBtn');
const clearCustomImageBtn = document.getElementById('clearCustomImageBtn');
const imageUploadStatusDiv = document.getElementById('imageUploadStatus');

// Postcard Customization Elements
const postcardConstructorSection = document.getElementById('postcardConstructorSection'); 
const previewPostcardCanvas = document.getElementById('previewPostcardCanvas'); 
const previewPhraseText = document.getElementById('previewPhraseText'); 
const fontFamilySelect = document.getElementById('fontFamilySelect');
const fontSizeInput = document.getElementById('fontSizeInput');
const fontSizeValueSpan = document.getElementById('fontSizeValue');
const fontColorInput = document.getElementById('fontColorInput');
const textVerticalPositionRadios = document.querySelectorAll('input[name="textVerticalPosition"]');
const textHorizontalPositionRadios = document.querySelectorAll('input[name="textHorizontalPosition"]'); 
const previewLeftArrow = document.querySelector('.preview-viewer .left-arrow');
const previewRightArrow = document.querySelector('.preview-viewer .right-arrow');

// Receive Address Input Element
const receiveAddressInput = document.getElementById('receiveAddressInput');

// Fullscreen Modal Elements
const fullscreenPostcardModal = document.getElementById('fullscreenPostcardModal');
const closeFullscreenModalBtn = document.getElementById('closeFullscreenModalBtn');
const fullscreenPostcardCanvas = document.getElementById('fullscreenPostcardCanvas'); 
const fullscreenPhraseText = document.getElementById('fullscreenPhraseText');
const fullscreenBlockchainRecordTxHashLink = document.getElementById('fullscreenBlockchainRecordTxHashLink');
const modalLeftArrow = document.getElementById('modalLeftArrow'); 
const modalRightArrow = document.getElementById('modalRightArrow'); 
const modalSendPostcardBtn = document.getElementById('modalSendPostcardBtn'); 

// NEW: Ad Banner DOM Elements
const adBannerWrapper1 = document.getElementById('adBannerWrapper1');
const adImage1 = document.getElementById('adImage1');
const adCloseBtn1 = document.getElementById('adCloseBtn1');
const adBannerWrapper2 = document.getElementById('adBannerWrapper2');
const adImage2 = document.getElementById('adImage2');

// Bottom Search Elements
const searchUserTxHashInput = document.getElementById('searchUserTxHashInput');
const findPhraseByUserTxBtn = document.getElementById('findPhraseByUserTxBtn');
const findStatusDiv = document.getElementById('findStatus');
const foundUserSenderAddressSpan = document.getElementById('foundUserSenderAddress');
const foundPaymentAmountSpan = document.getElementById('foundPaymentAmount');
const foundReceiveAddressSpan = document.getElementById('foundReceiveAddress'); 
const foundPhraseTextSpan = document.getElementById('foundPhraseText');
const foundSubmissionTimestampSpan = document.getElementById('foundSubmissionTimestamp');
const foundBlockchainRecordTxHashSpan = document.getElementById('foundBlockchainRecordTxHash');
const foundEtherscanLink = document.getElementById('foundEtherscanLink');

// Phrase Length Counter Element
const phraseLengthCounter = document.getElementById('phraseLengthCounter');

// Top Search Elements
const topSearchTxHashInput = document.getElementById('topSearchTxHashInput');
const topFindPhraseBtn = document.getElementById('topFindPhraseBtn');
const topFindStatusDiv = document.getElementById('topFindStatus');

// NEW: How It Works Bubbles Container
const howItWorksBubblesContainer = document.getElementById('howItWorksBubblesContainer');

// --- Global variables ---
let currentSessionId = null;
let paymentPollingInterval = null;
const POLLING_INTERVAL_MS = 10000;
const MAX_PHRASE_LENGTH = 200;
let currentPhraseData = null; 
let currentTemplateIndex = 0;
let uploadedCustomImageId = null; 
let isSubmissionInProgress = false; // Tracks if a submission process (including payment wait) is active.

// --- NEW NAV ELEMENTS ---
const mainNavBar = document.getElementById('main-nav-bar');
const navItems = document.querySelectorAll('#main-nav-bar .nav-item');
const sections = {
    recordSection: document.getElementById('recordSection'),
    findMessageSection: document.getElementById('findMessageSection'),
    howItWorksSection: document.getElementById('howItWorksSection'),
};

// --- NEW POLLING CONTROL VARIABLES ---
const MAX_POLLING_ATTEMPTS = 120; // Total attempts (60 * 10 seconds = 10 minutes)
const POLLING_INTERVAL_SECONDS = POLLING_INTERVAL_MS / 1000; // 10 seconds
let currentPollingAttempt = MAX_POLLING_ATTEMPTS; // Initialize counter for polling attempts
let countdownSecondsForDisplay = POLLING_INTERVAL_SECONDS; // For the inner 10-sec countdown display

// --- Postcard Templates (Built-in) ---
const postcardTemplates = [
    { name: "Default 1", image: 'images/postcard1.gif', textColor: '#333', fontFamily: 'Playfair Display', fontSize: '1.5em', textVerticalAlign: 'center', textHorizontalAlign: 'center' },
    { name: "Default 2", image: 'images/postcard2.jpg', textColor: '#fff', fontFamily: 'Open Sans', fontSize: '1.4em', textVerticalAlign: 'flex-start', textHorizontalAlign: 'center' },
    { name: "Default 3", image: 'images/postcard3.jpg', textColor: '#000', fontFamily: 'Lobster', fontSize: '1.8em', textVerticalAlign: 'flex-end', textHorizontalAlign: 'center' },
    { name: "Default 4", image: 'images/postcard4.jpg', textColor: '#4a4a4a', fontFamily: 'Dancing Script', fontSize: '1.7em', textVerticalAlign: 'center', textHorizontalAlign: 'center' },
    { name: "Default 5", image: 'images/postcard5.jpg', textColor: '#2196f3', fontFamily: 'Roboto Slab', fontSize: '1.6em', textVerticalAlign: 'flex-start', textHorizontalAlign: 'center' },
    { name: "Default 6", image: 'images/postcard6.jpg', textColor: '#FFFFFF', fontFamily: 'Lato', fontSize: '1.5em', textVerticalAlign: 'center', textHorizontalAlign: 'center' },
    { name: "Default 7", image: 'images/postcard7.jpg', textColor: '#333333', fontFamily: 'Merriweather', fontSize: '1.6em', textVerticalAlign: 'flex-end', textHorizontalAlign: 'center' },
    { name: "Default 8", image: 'images/postcard8.jpg', textColor: '#e53935', fontFamily: 'Playfair Display', fontSize: '1.7em', textVerticalAlign: 'center', textHorizontalAlign: 'center' }, // Festive
    { name: "Default 9", image: 'images/postcard9.jpg', textColor: '#424242', fontFamily: 'Open Sans', fontSize: '1.4em', textVerticalAlign: 'flex-start', textHorizontalAlign: 'left' }, // Nature
    { name: "Default 10", image: 'images/postcard10.jpg', textColor: '#ffffff', fontFamily: 'Montserrat', fontSize: '1.5em', textVerticalAlign: 'flex-end', textHorizontalAlign: 'center' }, // Modern
    { name: "Default 11", image: 'images/postcard11.jpg', textColor: '#2196f3', fontFamily: 'Dancing Script', fontSize: '1.8em', textVerticalAlign: 'center', textHorizontalAlign: 'center' }, // Abstract
];

// --- Translations ---
const translations = {
    en: {
        mainTitle: "SMSin",
        selectLanguageLabel: "Select Language:",
        howItWorksTitle: "How it works:",
        navRecord: "Record", // NEW
        navFind: "Find",     // NEW
        navHowItWorks: "How it works", // NEW
        howItWorksSteps: [ 
            "Enter your message in the text field and click \"Record to Blockchain\". This message will be embedded in a minimal ETH transaction and permanently recorded on the blockchain; anyone can find this transaction and read your message.", // MODIFIED
            "Optionally, upload your own photo to use as a postcard background (max 5MB, JPG/PNG/GIF). THIS POSTCARD IS NOT RECORDED ON THE ETHEREUM BLOCKCHAIN. The postcard is used as a beautiful background for sending your greeting to the recipient.",
            "Customize your postcard by changing font, size, color, and text position.",
            "Enter the ETH recipient address below (optional). If left empty, the sender's address (your wallet's address) will be used as the recipient after payment.", 
            "We will provide an ETH address and an <strong>exact amount</strong> for payment.",
            "Send the <strong>specified exact amount</strong> of ETH to the provided address using <strong>any</strong> crypto wallet (e.g., MetaMask, Trust Wallet, Binance, etc.). You don't need to connect your wallet to this site.",
            "Our service will detect your payment, embed your message in the transaction data, and send a **minimal amount of ETH (1 Wei)** to your designated recipient to permanently record your message on the blockchain. After that, a postcard with your message will be shown on your screen. Using the \"Share This Postcard\" button, you can send this postcard via social networks.", // MODIFIED
            "You will use your <strong>initial payment Transaction Hash</strong> (from step 3) or the <strong>Blockchain Record Transaction Hash</strong> to find the details of your message later."
        ],
        importantNoteTitle: "Important:",
        importantNoteText: "Ensure you send the <strong>EXACT amount displayed (including all decimal places)</strong>. Any deviation might prevent your payment from being matched to your phrase.",
        blockchainPermanenceDisclaimerTitle: "Important Blockchain Information:", 
        blockchainPermanenceDisclaimerText: "The message you record on the blockchain will remain on the blockchain forever and will be publicly accessible to all internet users. By submitting, you agree to the public distribution of this message.",
        recordNewPhraseTitle: "2. Record a New Message",
        yourPhraseLabel: "Your message:",
        phraseLengthHint: "(Max 200 characters)", 
        submitPhraseBtn: "Record to Blockchain", 
        editBtn: "Edit",
        paymentRequiredTitle: "Payment Required",
        pleaseSendExactAmount: "Please send exactly",
        toTheAddressBelow: "to the address below:",
        addressLabel: "Address:",
        copyBtn: "Copy",
        waitingForPayment: "Waiting for your payment...",
        doNotClosePageWarning: "Do not close this page until payment is confirmed!",
        rememberTxIdWarning: "Once payment is confirmed, remember your payment transaction Hash (TxID) to retrieve your message later.",
        yourRecordedPhraseTitle: "Your Recorded Message!",
        prevPostcardBtn: "<",
        nextPostcardBtn: ">",
        blockchainTxIdLabel: "The website administration is not responsible for the content of uploaded images. This text, without image, is saved in ETH Blockchain TxID:",
        sendPostcardBtn: "Share This Postcard",
        findPhraseByAnyTxIdTitle: "4. Find Message by Transaction Hash",
        anyTxIdLabel: "Your Payment Transaction Hash:", 
        findPhraseBtn: "Find Message",
        yourOriginalPaymentAddressLabel: "Your original payment address:",
        amountPaidLabel: "Amount paid:",
        foundReceiveAddressLabel: "Recipient Address (for payment):", 
        phraseTextLabel: "Message Text:",
        timestampOfSubmissionLabel: "Timestamp of submission:",
        blockchainRecordTxIdLabel: "Blockchain Record Transaction Hash:",
        etherscanLinkLabel: "Etherscan Link (for message record):",
        phraseInputPlaceholder: "Enter the message you want to record...",
        searchAnyTxHashInputPlaceholder: "Enter your payment transaction hash OR the blockchain record transaction hash...", 
        statusEnterPhrase: "Please enter a message.",
        statusSubmittingPhrase: "Submitting message to backend...",
        statusWaitingForPayment: "Waiting for your payment...",
        statusPaymentReceived: "Payment received and message recorded!",
        statusPaymentProcessing: "Payment received. Processing blockchain record and retaining funds...",
        statusFailedBlockchainWrite: "Payment received, but failed to embed message in blockchain transaction. Please contact support with your payment TxID: ",
        statusFailedFundForwarding: "Payment received, but failed to embed message in blockchain transaction. Please contact support with your payment TxID: ",
        statusPaymentTimeout: "Payment timeout. No matching payment found after maximum attempts. Please try again.", // MODIFIED
        statusSessionExpired: "Payment session expired or not found. Please try again.",
        statusCheckingPayment: "Checking payment", // MODIFIED: "Checking payment in {seconds}s ({remaining}/{total} attempts)"
        statusPhraseFound: "Message successfully found!",
        statusPhraseNotFound: "Error: Message not found or processing incomplete.",
        statusErrorBackend: "Error from backend: ",
        statusNetworkError: "Network error: ",
        statusPleaseEnterTxHash: "Please enter a transaction hash (your payment TxID or the blockchain record TxID).", 
        statusSearchingTxHash: "Searching for message using the provided transaction Hash...",
        alertCopySuccess: "Copied to clipboard!", 
        alertCopyFail: "Failed to copy. Please copy manually.", 
        alertNoPostcard: "No postcard to share!",
        alertShareFail: "Failed to share postcard. Please copy the link manually.",
        promptShareLink: "Copy this link to share your postcard:",
        // New translations for image upload
        uploadPhotoTitle: "1. Upload a custom image or use a standard one in step 3.", 
        selectImageBtn: "Select Image",
        imagePreviewPlaceholder: "Recommended parameters for uploaded images: 3:4 aspect ratio, 900 x 1200, 1576 x 2100, 1772 x 2362, max 5MB, JPG/PNG/GIF.",
        useThisImageBtn: "Use This Image",
        clearImageBtn: "Clear Image",
        imageUploadSuccess: "Image uploaded! Click 'Use This Image' or choose another.",
        imageUploadError: "Error uploading image: ",
        imageUploadProcessing: "Uploading image...",
        imageUploadInvalid: "Invalid file. Please upload an image (jpeg, png, gif) up to 5MB.", 
        imageUploadConsentDisclaimer: "Uploaded images become publicly available on the internet. By uploading, you consent to their distribution. The website administration is not responsible for the content of uploaded images and photos.", 
        shareTextStart: "Check out my message recorded on the Ethereum blockchain:",
        shareTextEnd: "View it here:",
        // New translations for customization
        customizePostcardTitle: "3. Customize Your Postcard",
        fontFamilyLabel: "Font Family:",
        fontSizeLabel: "Font Size:",
        fontColorLabel: "Font Color:",
        textVerticalPositionLabel: "Vertical Position:", 
        textHorizontalPositionLabel: "Horizontal Position:", 
        posTop: "Top",
        posCenter: "Center",
        posBottom: "Bottom",
        alignLeft: "Left", 
        alignCenter: "Center", 
        alignRight: "Right", 
        shareHttpsWarning: "Sharing works best over HTTPS. On iOS, native sharing may not appear without HTTPS.", 
        useThisImageBtnSuccess: "Using your uploaded image. Click 'Record to Blockchain'.",
        // NEW: Receive address input translations
        receiveAddressLabel: "ETH Recipient Address:",
        receiveAddressPlaceholder: "Leave empty to use sender's address",
        receiveAddressHint: "If left empty, the transaction sender's address will be used as the recipient.",
        statusEditingMode: "Editing mode activated. Make changes and click 'Record to Blockchain' again to submit.",
        topSearchTxIdLabel: "Enter ETH transaction TXID to read the message:",
    },
    es: {
        mainTitle: "SMSin",
        selectLanguageLabel: "Seleccionar Idioma:",
        howItWorksTitle: "Cómo funciona:",
        navRecord: "Grabar", 
        navFind: "Buscar",   
        navHowItWorks: "Cómo funciona", 
        howItWorksSteps: [
            "Introduce tu mensaje en el campo de texto y haz clic en \"Grabar en Blockchain\". Este mensaje se incrustará en una transacción ETH mínima y se registrará permanentemente en la cadena de bloques; cualquiera puede encontrar esta transacción y leer tu mensaje.", // MODIFIED
            "Opcionalmente, sube tu propia foto para usarla como fondo de postal (máx. 5MB, JPG/PNG/GIF). ESTA POSTAL NO SE REGISTRA EN LA BLOCKCHAIN DE ETHEREUM. La postal se utiliza como un hermoso fondo para enviar tu felicitación al destinatario.",
            "Personaliza tu postal cambiando la fuente, tamaño, color y posición del texto.",
            "Introduce la dirección ETH del destinatario a continuación (opcional). Si se deja vacía, la dirección del remitente (la dirección de tu billetera) se utilizará como destinatario después del pago.",
            "Proporcionaremos una dirección ETH y una cantidad <strong>exacta</strong> para el pago.",
            "Envía la <strong>cantidad exacta especificada</strong> de ETH a la dirección proporcionada usando <strong>cualquier</strong> billetera de criptomonedas (ej. MetaMask, Trust Wallet, Binance, etc.). No necesitas conectar tu billetera a este sitio.",
            "Nuestro servicio detectará tu pago, incrustará tu mensaje en los datos de la transacción y enviará una <strong>cantidad mínima de ETH (1 Wei)</strong> a tu destinatario designado para registrar permanentemente tu mensaje en la cadena de bloques. Después de eso, se mostrará una postal con tu mensaje en tu pantalla. Usando el botón \"Compartir esta Tarjeta Postal\", puedes enviar esta postal a través de las redes sociales.", // MODIFIED
            "Utilizarás tu <strong>Hash de Transacción de pago inicial</strong> (del paso 3) o el <strong>Hash de Transacción de Registro en Blockchain</strong> para encontrar los detalles de tu mensaje más tarde."
        ],
        importantNoteTitle: "Importante:",
        importantNoteText: "Asegúrate de enviar la cantidad <strong>EXACTA mostrada (incluyendo todos los decimales)</strong>. Cualquier desviación podría impedir que tu pago sea asociado a tu frase.",
        blockchainPermanenceDisclaimerTitle: "Información Importante de la Blockchain:",
        blockchainPermanenceDisclaimerText: "El mensaje que registres en la blockchain permanecerá en ella para siempre y será públicamente accesible para todos los usuarios de internet. Al enviarla, aceptas la distribución pública de este mensaje.",
        recordNewPhraseTitle: "2. Grabar un Nuevo Mensaje",
        yourPhraseLabel: "Tu mensaje:",
        phraseLengthHint: "(Máx. 200 caracteres)",
        submitPhraseBtn: "Grabar en Blockchain",
        editBtn: "Editar",
        paymentRequiredTitle: "Pago Requerido",
        pleaseSendExactAmount: "Por favor, envía exactamente",
        toTheAddressBelow: "a la siguiente dirección:",
        addressLabel: "Dirección:",
        copyBtn: "Copiar",
        waitingForPayment: "Esperando tu pago...",
        doNotClosePageWarning: "¡No cierres esta página hasta que se confirme el pago!",
        rememberTxIdWarning: "Una vez confirmado el pago, recuerda tu Hash de transacción de pago (TxID) para recuperar tu mensaje más tarde.",
        yourRecordedPhraseTitle: "¡Tu Mensaje Grabado!",
        prevPostcardBtn: "<",
        nextPostcardBtn: ">",
        blockchainTxIdLabel: "La administración del sitio web no se hace responsable por el contenido de las imágenes cargadas. Este texto, sin imagen, está guardado en la Blockchain de ETH TxID:",
        sendPostcardBtn: "Compartir esta Tarjeta Postal",
        findPhraseByAnyTxIdTitle: "4. Encontrar Mensaje por Hash de Transacción",
        anyTxIdLabel: "Tu Hash de Transacción de Pago O Hash de Registro en Blockchain:",
        findPhraseBtn: "Encontrar Mensaje",
        yourOriginalPaymentAddressLabel: "Tu dirección de pago original:",
        amountPaidLabel: "Cantidad pagada:",
        foundReceiveAddressLabel: "Dirección del destinatario (para el pago):",
        phraseTextLabel: "Texto del Mensaje:",
        timestampOfSubmissionLabel: "Fecha y hora de envío:",
        blockchainRecordTxIdLabel: "Hash de Transacción de Registro en Blockchain:",
        etherscanLinkLabel: "Enlace a Etherscan (para el registro del mensaje):",
        phraseInputPlaceholder: "Introduce el mensaje que quieres registrar...",
        searchAnyTxHashInputPlaceholder: "Introduce el hash de tu transacción de pago O el hash de la transacción de registro en blockchain...",
        statusEnterPhrase: "Introduce tu mensaje.",
        statusSubmittingPhrase: "Enviando mensaje al backend...",
        statusWaitingForPayment: "Esperando tu pago...",
        statusPaymentReceived: "¡Pago recibido y mensaje grabado!",
        statusPaymentProcessing: "Pago recibido. Procesando el registro en la blockchain y reteniendo fondos...",
        statusFailedBlockchainWrite: "Pago recibido, pero falló la incrustación del mensaje en la transacción de la cadena de bloques. Contacta con soporte con tu TxID de pago: ",
        statusFailedFundForwarding: "Pago recibido, pero falló la incrustación del mensaje en la transacción de la cadena de bloques. Contacta con soporte con tu TxID de pago: ",
        statusPaymentTimeout: "Tiempo de espera de pago agotado. No se encontró ningún pago coincidente después de los intentos máximos. Por favor, inténtalo de nuevo.", // MODIFIED
        statusSessionExpired: "Sesión de pago expirada o no encontrada. Por favor, inténtalo de nuevo.",
        statusCheckingPayment: "Comprobando pago", // MODIFIED
        statusPhraseFound: "¡Mensaje encontrado con éxito!",
        statusPhraseNotFound: "Error: Mensaje no encontrado o procesamiento incompleto.",
        statusErrorBackend: "Error del backend: ",
        statusNetworkError: "Error de red: ",
        statusPleaseEnterTxHash: "Introduce un hash de transacción (tu TxID de pago o el TxID de registro en blockchain).",
        statusSearchingTxHash: "Buscando mensaje usando el Hash de transacción proporcionado...",
        alertCopySuccess: "¡Copiado al portapapeles!",
        alertCopyFail: "Error al copiar. Cópiala manualmente.",
        alertNoPostcard: "¡No hay postal para compartir!",
        alertShareFail: "Error al compartir la postal. Copia el enlace manualmente.",
        promptShareLink: "Copia este enlace para compartir tu postal:",
        // New translations for image upload
        uploadPhotoTitle: "1. Sube una imagen personalizada o usa una estándar en el paso 3.",
        selectImageBtn: "Seleccionar Imagen",
        imagePreviewPlaceholder: "Parámetros recomendados para imágenes subidas: relación de aspecto 3:4, 900 x 1200, 1576 x 2100, 1772 x 2362, máx. 5MB, JPG/PNG/GIF.",
        useThisImageBtn: "Usar Esta Imagen",
        clearImageBtn: "Borrar Imagen",
        imageUploadSuccess: "¡Imagen subida! Haz clic en 'Usar Esta Imagen' o elige otra.",
        imageUploadError: "Error al subir la imagen: ",
        imageUploadProcessing: "Subiendo imagen...",
        imageUploadInvalid: "Archivo inválido. Por favor, sube una imagen (jpeg, png, gif) de hasta 5MB.",
        imageUploadConsentDisclaimer: "Las imágenes subidas se hacen públicamente disponibles en internet. Al subirlas, consientes su distribución. La administración del sitio web no se hace responsable por el contenido de las imágenes y fotos cargadas.",
        shareTextStart: "¡Mira mi mensaje registrado en la blockchain de Ethereum:",
        shareTextEnd: "Mírala aquí:",
        // New translations for customization
        customizePostcardTitle: "3. Personaliza tu Postal",
        fontFamilyLabel: "Familia de Fuente:",
        fontSizeLabel: "Tamaño de Fuente:",
        fontColorLabel: "Color de Fuente:",
        textVerticalPositionLabel: "Posición Vertical:",
        textHorizontalPositionLabel: "Posición Horizontal:",
        posTop: "Arriba",
        posCenter: "Centro",
        posBottom: "Abajo",
        alignLeft: "Izquierda",
        alignCenter: "Centro",
        alignRight: "Derecha",
        shareHttpsWarning: "Compartir funciona mejor con HTTPS. En iOS, es posible que no aparezca la opción de compartir de forma nativa sin HTTPS.",
        useThisImageBtnSuccess: "Utilizando tu imagen subida. Haz clic en 'Grabar en Blockchain'.",
        // NEW: Receive address input translations
        receiveAddressLabel: "Dirección ETH del destinatario:",
        receiveAddressPlaceholder: "Deja vacío para usar la dirección del remitente",
        receiveAddressHint: "Si se deja vacío, la dirección del remitente de la transacción se utilizará como destinatario.",
        statusEditingMode: "Modo de edición activado. Realice cambios y haga clic en 'Grabar en Blockchain' nuevamente para enviar.",
        topSearchTxIdLabel: "Introduce TXID de transacción ETH para leer el mensaje:",
    },
    de: {
        mainTitle: "SMSin",
        selectLanguageLabel: "Sprache auswählen:",
        howItWorksTitle: "So funktioniert's:",
        navRecord: "Aufzeichnen", 
        navFind: "Suchen",     
        navHowItWorks: "So funktioniert's", 
        howItWorksSteps: [
            "Geben Sie Ihre Nachricht in das Textfeld ein und klicken Sie auf „In Blockchain aufzeichnen“. Diese Nachricht wird in eine minimale ETH-Transaktion eingebettet und dauerhaft in der Blockchain aufgezeichnet; jeder kann diese Transaktion finden und Ihre Nachricht lesen.", // MODIFIED
            "Optional können Sie Ihr eigenes Foto als Postkartenhintergrund hochladen (max. 5MB, JPG/PNG/GIF). DIESE POSTKARTE WIRD NICHT IN DER ETHEREUM-BLOCKCHAIN AUFZEICHNET. Die Postkarte dient als schöner Hintergrund, um Ihre Grüße an den Empfänger zu senden.",
            "Gestalten Sie Ihre Postkarte, indem Sie Schriftart, -größe, -farbe und Textposition ändern.",
            "Geben Sie die ETH-Empfängeradresse unten ein (optional). Wenn Sie das Feld leer lassen, wird die Absenderadresse (die Adresse Ihrer Wallet) als Empfänger nach der Zahlung verwendet.",
            "Wir geben eine ETH-Adresse und einen <strong>genauen Betrag</strong> für die Zahlung an.",
            "Senden Sie den <strong>angegebenen genauen Betrag</strong> an die angegebene Adresse mit <strong>jeder</strong> Krypto-Wallet (z.B. MetaMask, Trust Wallet, Binance, etc.). Sie müssen Ihre Wallet nicht mit dieser Website verbinden.",
            "Unser Service erkennt Ihre Zahlung, bettet Ihre Nachricht in die Transaktionsdaten ein und sendet einen <strong>minimalen ETH-Betrag (1 Wei)</strong> an Ihren angegebenen Empfänger, um Ihre Nachricht dauerhaft in der Blockchain aufzuzeichnen. Danach wird eine Postkarte mit Ihrer Nachricht auf Ihrem Bildschirm angezeigt. Mit der Schaltfläche „Diese Postkarte teilen“ können Sie diese Postkarte über soziale Netzwerke versenden.", // MODIFIED
            "Sie verwenden Ihre <strong>ursprüngliche Zahlungstransaktions-Hash</strong> (aus Schritt 3) oder die <strong>Blockchain-Aufzeichnungs-Transaktions-Hash</strong>, um die Details Ihrer Nachricht später zu finden."
        ],
        importantNoteTitle: "Wichtig:",
        importantNoteText: "Stellen Sie sicher, dass Sie den <strong>EXAKTEN angezeigten Betrag (einschließlich aller Dezimalstellen)</strong> senden. Jede Abweichung kann dazu führen, dass Ihre Zahlung nicht Ihrer Phrase zugeordnet werden kann.",
        blockchainPermanenceDisclaimerTitle: "Wichtige Blockchain-Informationen:",
        blockchainPermanenceDisclaimerText: "Die von Ihnen in der Blockchain aufgezeichnete Nachricht bleibt für immer in der Blockchain und ist für alle Internetnutzer öffentlich zugänglich. Durch das Absenden stimmen Sie der öffentlichen Verbreitung dieser Nachricht zu.",
        recordNewPhraseTitle: "2. Eine neue Nachricht aufzeichnen",
        yourPhraseLabel: "Ihre Nachricht:",
        phraseLengthHint: "(Max. 200 Zeichen)",
        submitPhraseBtn: "In Blockchain aufzeichnen",
        editBtn: "Bearbeiten",
        paymentRequiredTitle: "Zahlung erforderlich",
        pleaseSendExactAmount: "Bitte senden Sie genau",
        toTheAddressBelow: "an die folgende Adresse:",
        addressLabel: "Adresse:",
        copyBtn: "Kopieren",
        waitingForPayment: "Warten auf Ihre Zahlung...",
        doNotClosePageWarning: "Schließen Sie diese Seite nicht, bis die Zahlung bestätigt wurde!",
        rememberTxIdWarning: "Sobald die Zahlung bestätigt ist, merken Sie sich Ihre Zahlungstransaktions-Hash (TxID), um Ihre Nachricht später abzurufen.",
        yourRecordedPhraseTitle: "Ihre aufgezeichnete Nachricht!",
        prevPostcardBtn: "<",
        nextPostcardBtn: ">",
        blockchainTxIdLabel: "Die Website-Administration ist nicht verantwortlich für den Inhalt hochgeladener Bilder. Dieser Text, ohne Bild, ist in der ETH Blockchain TxID gespeichert:",
        sendPostcardBtn: "Diese Postkarte teilen",
        findPhraseByAnyTxIdTitle: "4. Nachricht anhand Transaktions-Hash finden",
        anyTxIdLabel: "Ihre Zahlungstransaktions-Hash ODER Blockchain-Aufzeichnungs-Hash:",
        findPhraseBtn: "Nachricht finden",
        yourOriginalPaymentAddressLabel: "Ihre ursprüngliche Zahlungsadresse:",
        amountPaidLabel: "Bezahlter Betrag:",
        foundReceiveAddressLabel: "Empfängeradresse (für Zahlung):",
        phraseTextLabel: "Nachrichtentext:",
        timestampOfSubmissionLabel: "Zeitstempel der Einreichung:",
        blockchainRecordTxIdLabel: "Blockchain-Aufzeichnungs-Transaktions-Hash:",
        etherscanLinkLabel: "Etherscan-Link (für Nachrichtenaufzeichnung):",
        phraseInputPlaceholder: "Geben Sie die Nachricht ein, die Sie aufzeichnen möchten...",
        searchAnyTxHashInputPlaceholder: "Geben Sie den Transaktions-Hash IHRER ZAHLUNG ODER den Blockchain-Aufzeichnungs-Transaktions-Hash ein...",
        statusEnterPhrase: "Geben Sie Ihre Nachricht ein.",
        statusSubmittingPhrase: "Nachricht an Backend senden...",
        statusWaitingForPayment: "Warten auf Ihre Zahlung...",
        statusPaymentReceived: "Zahlung erhalten und Nachricht aufgezeichnet!",
        statusPaymentProcessing: "Zahlung erhalten. Blockchain-Aufzeichnung wird verarbeitet und Gelder einbehalten...",
        statusFailedBlockchainWrite: "Zahlung erhalten, aber das Einbetten der Nachricht in die Blockchain-Transaktion ist fehlgeschlagen. Bitte kontaktieren Sie den Support mit Ihrer Zahlungs-TxID: ",
        statusFailedFundForwarding: "Zahlung erhalten, aber das Einbetten der Nachricht in die Blockchain-Transaktion ist fehlgeschlagen. Bitte kontaktieren Sie den Support mit Ihrer Zahlungs-TxID: ",
        statusPaymentTimeout: "Zahlungs-Timeout. Es wurde kein übereinstimmender Zahlungseingang nach maximalen Versuchen gefunden. Bitte versuchen Sie es erneut.", // MODIFIED
        statusSessionExpired: "Zahlungssitzung abgelaufen oder nicht gefunden. Bitte versuchen Sie es erneut.",
        statusCheckingPayment: "Zahlung wird überprüft", // MODIFIED
        statusPhraseFound: "Nachricht erfolgreich gefunden!",
        statusPhraseNotFound: "Fehler: Nachricht nicht gefunden oder Verarbeitung unvollständig.",
        statusErrorBackend: "Fehler vom Backend: ",
        statusNetworkError: "Netzwerkfehler: ",
        statusPleaseEnterTxHash: "Bitte geben Sie eine Transaktions-Hash ein (Ihre Zahlungs-TxID oder die Blockchain-Aufzeichnungs-TxID).",
        statusSearchingTxHash: "Suche nach Nachricht mit der angegebenen Transaktions-Hash...",
        alertCopySuccess: "In die Zwischenablage kopiert!",
        alertCopyFail: "Kopieren fehlgeschlagen. Bitte manuell kopieren.",
        alertNoPostcard: "Keine Postkarte zum Teilen!",
        alertShareFail: "Fehler beim Teilen der Postkarte. Bitte kopieren Sie den Link manuell.",
        promptShareLink: "Kopieren Sie diesen Link, um Ihre Postkarte zu teilen:",
        // New translations for image upload
        uploadPhotoTitle: "1. Laden Sie ein benutzerdefiniertes Bild hoch oder verwenden Sie ein Standardbild in Schritt 3.",
        imagePreviewPlaceholder: "Empfohlene Parameter für hochgeladene Bilder: 3:4 Seitenverhältnis, 900 x 1200, 1576 x 2100, 1772 x 2362, max. 5MB, JPG/PNG/GIF.",
        useThisImageBtn: "Dieses Bild verwenden",
        clearImageBtn: "Bild löschen",
        imageUploadSuccess: "Bild hochgeladen! Klicken Sie auf 'Dieses Bild verwenden' или wählen Sie ein anderes.",
        imageUploadError: "Fehler beim Hochladen des Bildes: ",
        imageUploadProcessing: "Bild wird hochgeladen...",
        imageUploadInvalid: "Ungültige Datei. Bitte laden Sie ein Bild (jpeg, png, gif) bis zu 5MB hoch.",
        imageUploadConsentDisclaimer: "Hochgeladene Bilder werden öffentlich im Internet verfügbar. Durch das Hochladen stimmen Sie der öffentlichen Verbreitung dieser Nachricht zu. Die Website-Administration ist nicht verantwortlich für den Inhalt hochgeladener Bilder und Fotos.",
        shareTextStart: "Sehen Sie sich meine in der Ethereum-Blockchain aufgezeichnete Nachricht an:",
        shareTextEnd: "Sehen Sie es hier:",
        // New translations for customization
        customizePostcardTitle: "3. Ihre Postkarte gestalten",
        fontFamilyLabel: "Schriftart:",
        fontSizeLabel: "Schriftgröße:",
        fontColorLabel: "Schriftfarbe:",
        textVerticalPositionLabel: "Vertikale Position:",
        textHorizontalPositionLabel: "Horizontale Position:",
        posTop: "Oben",
        posCenter: "Mitte",
        posBottom: "Unten",
        alignLeft: "Links",
        alignCenter: "Mitte",
        alignRight: "Rechts",
        shareHttpsWarning: "Das Teilen funktioniert am besten über HTTPS. Auf iOS wird die native Freigabe ohne HTTPS möglicherweise nicht angezeigt.",
        useThisImageBtnSuccess: "Verwenden Sie Ihr hochgeladenes Bild. Klicken Sie auf 'In Blockchain aufzeichnen'.",
        // NEW: Receive address input translations
        receiveAddressLabel: "ETH Empfängeradresse:",
        receiveAddressPlaceholder: "Leer lassen, um die Absenderadresse zu verwenden",
        receiveAddressHint: "Wenn leer gelassen, wird die Absenderadresse der Transaktion als Empfänger verwendet.",
        statusEditingMode: "Bearbeitungsmodus aktiviert. Nehmen Sie Änderungen vor und klicken Sie erneut auf „In Blockchain aufzeichnen“, um sie zu senden.",
        topSearchTxIdLabel: "Geben Sie die ETH-Transaktions-TXID ein, um die Nachricht zu lesen:",
    },
    fr: {
        mainTitle: "SMSin",
        selectLanguageLabel: "Sélectionner la langue :",
        howItWorksTitle: "Comment ça marche :",
        navRecord: "Enregistrer", 
        navFind: "Trouver",     
        navHowItWorks: "Comment ça marche", 
        howItWorksSteps: [
            "Entrez votre message dans le champ de texte et cliquez sur \"Enregistrer sur la Blockchain\". Ce message sera intégré dans une transaction ETH minimale et enregistré de manière permanente sur la blockchain ; n'importe qui peut trouver cette transaction et lire votre message.", // MODIFIED
            "Facultatif : téléchargez votre propre photo à utiliser comme arrière-plan de carte postale (max 5 Mo, JPG/PNG/GIF). CETTE CARTE POSTALE N'EST PAS ENREGISTRÉE SUR LA BLOCKCHAIN ETHEREUM. La carte postale est utilisée comme un bel arrière-plan pour envoyer vos vœux au destinataire.",
            "Personnalisez votre carte postale en changeant la police, la taille, la couleur et la position du texte.",
            "Entrez l'adresse ETH du destinataire ci-dessous (facultatif). Si laissée vide, l'adresse de l'expéditeur (l'adresse de votre portefeuille) sera utilisée comme destinataire après le paiement.",
            "Nous vous fournirons une adresse ETH et un montant <strong>exact</strong> pour le paiement.",
            "Envoyez le <strong>montant exact spécifié</strong> d'ETH à l'adresse fournie en utilisant <strong>n'importe quel</strong> portefeuille de crypto (par exemple, MetaMask, Trust Wallet, Binance, etc.). Vous n'avez pas besoin de connecter votre portefeuille à ce site.",
            "Notre service détectera votre paiement, intégrera votre message dans les données de la transaction et enverra une <strong>quantité minimale d'ETH (1 Wei)</strong> à votre destinataire désigné pour enregistrer en permanence votre message sur la blockchain. Après cela, une carte postale avec votre message sera affichée sur votre écran. En utilisant le bouton \"Partager cette carte postale\", vous pouvez envoyer cette carte postale via les réseaux sociaux.", // MODIFIED
            "Vous utiliserez votre <strong>Hash de transaction de paiement initial</strong> (de l'étape 3) ou l'<strong>Hash de transaction d'enregistrement Blockchain</strong> pour trouver les détails de votre message plus tard."
        ],
        importantNoteTitle: "Important :",
        importantNoteText: "Assurez-vous d'envoyer le montant <strong>EXACT affiché (incluant toutes les décimales)</strong>. Toute déviation pourrait empêcher votre paiement d'être associé à votre phrase.",
        blockchainPermanenceDisclaimerTitle: "Informations importantes sur la Blockchain :",
        blockchainPermanenceDisclaimerText: "Le message que vous enregistrez sur la blockchain restera sur la blockchain pour toujours et sera publiquement accessible à tous les utilisateurs d'Internet. En le soumettant, vous consentez à la distribution publique de ce message.",
        recordNewPhraseTitle: "2. Enregistrer un Nouveau Message",
        yourPhraseLabel: "Votre message :",
        phraseLengthHint: "(Max 200 caractères)",
        submitPhraseBtn: "Enregistrer sur la Blockchain",
        editBtn: "Modifier",
        paymentRequiredTitle: "Paiement requis",
        pleaseSendExactAmount: "Veuillez envoyer exactement",
        toTheAddressBelow: "à l'adresse ci-dessous :",
        addressLabel: "Adresse :",
        copyBtn: "Copier",
        waitingForPayment: "En attente de votre paiement...",
        doNotClosePageWarning: "Ne fermez pas cette page tant que le paiement n'est pas confirmé !",
        rememberTxIdWarning: "Une fois le paiement confirmé, n'oubliez pas votre Hash de transaction de paiement (TxID) pour récupérer votre message plus tard.",
        yourRecordedPhraseTitle: "Votre Message Enregistré !",
        prevPostcardBtn: "<",
        nextPostcardBtn: ">",
        blockchainTxIdLabel: "L'administration du site web n'est pas responsable du contenu des images téléchargées. Ce texte, sans image, est enregistré dans la Blockchain ETH TxID:",
        sendPostcardBtn: "Partager cette carte postale",
        findPhraseByAnyTxIdTitle: "4. Trouver un Message par Hash de Transaction",
        anyTxIdLabel: "Votre Hash de Transaction de Paiement OU Hash d'Enregistrement Blockchain :",
        findPhraseBtn: "Trouver le Message",
        yourOriginalPaymentAddressLabel: "Votre adresse de paiement originale :",
        amountPaidLabel: "Montant payé :",
        foundReceiveAddressLabel: "Adresse du destinataire (pour le paiement) :",
        phraseTextLabel: "Texte du Message :",
        timestampOfSubmissionLabel: "Horodatage de la soumission :",
        blockchainRecordTxIdLabel: "Hash de transaction d'enregistrement Blockchain :",
        etherscanLinkLabel: "Lien Etherscan (pour l'enregistrement du message) :",
        phraseInputPlaceholder: "Entrez le message que vous souhaitez enregistrer...",
        searchAnyTxHashInputPlaceholder: "Entrez le hachage de votre transaction de paiement OU le hachage de la transaction d'enregistrement blockchain...",
        statusEnterPhrase: "Veuillez entrer un message.",
        statusSubmittingPhrase: "Soumission du message au backend...",
        statusWaitingForPayment: "En attente de votre paiement...",
        statusPaymentReceived: "Paiement reçu et message enregistré !",
        statusPaymentProcessing: "Paiement reçu. Traitement de l'enregistrement blockchain et rétention des fonds...",
        statusFailedBlockchainWrite: "Paiement reçu, mais l'intégration du message dans la transaction blockchain a échoué. Veuillez contacter le support avec votre TxID de paiement : ",
        statusFailedFundForwarding: "Paiement reçu, mais l'intégration du message dans la transaction blockchain a échoué. Veuillez contacter le support avec votre TxID de paiement : ",
        statusPaymentTimeout: "Délai de paiement dépassé. Aucun paiement correspondant n'a été trouvé après les tentatives maximales. Veuillez réessayer.", // MODIFIED
        statusSessionExpired: "Session de paiement expirée ou introuvable. Veuillez réessayer.",
        statusCheckingPayment: "Vérification du paiement", // MODIFIED
        statusPhraseFound: "Message trouvé avec succès !",
        statusPhraseNotFound: "Erreur : Message non trouvé ou traitement incomplet.",
        statusErrorBackend: "Erreur du backend : ",
        statusNetworkError: "Erreur réseau : ",
        statusPleaseEnterTxHash: "Veuillez entrer un hachage de transaction (votre TxID de paiement ou le TxID d'enregistrement blockchain).",
        statusSearchingTxHash: "Recherche de message à l'aide de l'ID de transaction fourni...",
        alertCopySuccess: "Copié dans le presse-papiers !",
        alertCopyFail: "Échec de la copie. Veuillez copier manuellement.",
        alertNoPostcard: "Pas de carte postale à partager !",
        alertShareFail: "Échec du partage de la carte postale. Veuillez copier le lien manuellement.",
        promptShareLink: "Copiez ce lien pour partager votre carte postale :",
        // New translations for image upload
        uploadPhotoTitle: "1. Téléchargez une image personnalisée ou utilisez une image standard à l'étape 3.",
        selectImageBtn: "Sélectionner une image",
        imagePreviewPlaceholder: "Paramètres recommandés pour les images téléchargées : rapport d'aspect 3:4, 900 x 1200, 1576 x 2100, 1772 x 2362, max 5Mo, JPG/PNG/GIF.",
        useThisImageBtn: "Utiliser cette image",
        clearImageBtn: "Effacer l'image",
        imageUploadSuccess: "Image téléchargée ! Cliquez sur 'Utiliser cette image' ou choisissez-en une autre.",
        imageUploadError: "Erreur lors du téléchargement de l'image : ",
        imageUploadProcessing: "Téléchargement de l'image...",
        imageUploadInvalid: "Fichier invalide. Veuillez télécharger une image (jpeg, png, gif) de 5 Mo maximum.",
        imageUploadConsentDisclaimer: "Les images téléchargées deviennent publiquement disponibles sur internet. En les téléchargeant, vous consentez à leur distribution. L'administration du site web n'est pas responsable du contenu des images et photos téléchargées.",
        shareTextStart: "Découvrez mon message enregistré sur la blockchain Ethereum :",
        shareTextEnd: "Visualisez-la ici :",
        // New translations for customization
        customizePostcardTitle: "3. Personnalisez votre Carte Postale",
        fontFamilyLabel: "Famille de Police :",
        fontSizeLabel: "Taille de Police :",
        fontColorLabel: "Couleur de Police :",
        textVerticalPositionLabel: "Position Verticale :",
        textHorizontalPositionLabel: "Position Horizontale :",
        posTop: "Haut",
        posCenter: "Centre",
        posBottom: "Bas",
        alignLeft: "Gauche",
        alignCenter: "Centre",
        alignRight: "Droite",
        shareHttpsWarning: "Le partage fonctionne mieux via HTTPS. Sur iOS, le partage natif peut ne pas apparaître sans HTTPS.",
        useThisImageBtnSuccess: "Utilisation de votre image téléchargée. Cliquez sur 'Enregistrer sur la Blockchain'.",
        // NEW: Receive address input translations
        receiveAddressLabel: "Adresse ETH du destinataire :",
        receiveAddressPlaceholder: "Laisser vide pour utiliser l'adresse de l'expéditeur",
        receiveAddressHint: "Si laissée vide, l'adresse de l'expéditeur de la transaction sera utilisée comme destinataire.",
        statusEditingMode: "Mode édition activé. Effectuez des modifications et cliquez à nouveau sur 'Enregistrer sur la Blockchain' pour soumettre.",
        topSearchTxIdLabel: "Entrez l'Hash de transaction ETH pour lire le message :",
    },
    pt: {
        mainTitle: "SMSin",
        selectLanguageLabel: "Selecionar Idioma:",
        howItWorksTitle: "Como funciona:",
        navRecord: "Gravar", 
        navFind: "Encontrar",   
        navHowItWorks: "Como funciona", 
        howItWorksSteps: [
            "Digite sua mensagem no campo de texto e clique em \"Gravar na Blockchain\". Esta mensagem será incorporada em uma transação ETH mínima e registrada permanentemente na blockchain; qualquer um pode encontrar esta transação e ler sua mensagem.", // MODIFIED
            "Opcionalmente, carregue sua própria foto para usar como plano de fundo do cartão postal (máx. 5MB, JPG/PNG/GIF). ESTE CARTÃO POSTAL NÃO É REGISTRADO NA BLOCKCHAIN ETHEREUM. O cartão postal é usado como um belo plano de fundo para enviar sua saudação ao destinatário.",
            "Personalize seu cartão postal alterando a fonte, tamanho, cor e posição do texto.",
            "Digite o endereço ETH do destinatário abaixo (opcional). Se deixado em branco, o endereço do remetente (o endereço da sua carteira) será usado como destinatário após o pagamento.",
            "Forneceremos um endereço ETH e um valor <strong>exato</strong> para pagamento.",
            "Envie o <strong>valor exato especificado</strong> de ETH para o endereço fornecido usando <strong>qualquer</strong> carteira de criptomoedas (ex: MetaMask, Trust Wallet, Binance, etc.). Você não precisa conectar sua carteira a este site.",
            "Nosso serviço detectará seu pagamento, incorporará sua mensagem nos dados da transação e enviará uma <strong>quantidade mínima de ETH (1 Wei)</strong> ao seu destinatário designado para registrar permanentemente sua mensagem na blockchain. Depois disso, um cartão postal com sua mensagem será exibido em sua tela. Usando o botão \"Compartilhar Este Cartão Postal\", você pode enviar este cartão postal através das redes sociais.", // MODIFIED
            "Você usará seu <strong>Hash de Transação de pagamento inicial</strong> (da etapa 3) ou o <strong>Hash de Transação de Registro na Blockchain</strong> para encontrar os detalhes de sua mensagem mais tarde."
        ],
        importantNoteTitle: "Importante:",
        importantNoteText: "Certifique-se de enviar o valor <strong>EXATO exibido (incluindo todas as casas decimais)</strong>. Qualquer desvio pode impedir que seu pagamento seja correspondido à sua frase.",
        blockchainPermanenceDisclaimerTitle: "Informações Importantes da Blockchain:",
        blockchainPermanenceDisclaimerText: "A mensagem que você registra na blockchain permanecerá na blockchain para sempre e será publicamente acessível para todos os usuários da internet. Ao enviá-la, você concorda com a distribuição pública desta mensagem.",
        recordNewPhraseTitle: "2. Gravar uma Nova Mensagem",
        yourPhraseLabel: "Sua mensagem:",
        phraseLengthHint: "(Máx. 200 caracteres)",
        submitPhraseBtn: "Gravar na Blockchain",
        editBtn: "Editar",
        paymentRequiredTitle: "Pagamento Necessário",
        pleaseSendExactAmount: "Por favor, envie exatamente",
        toTheAddressBelow: "para o endereço abaixo:",
        addressLabel: "Endereço:",
        copyBtn: "Copiar",
        waitingForPayment: "Aguardando seu pagamento...",
        doNotClosePageWarning: "Não feche esta página até que o pagamento seja confirmado!",
        rememberTxIdWarning: "Uma vez confirmado o pagamento, lembre-se do seu Hash de transação de pagamento (TxID) para recuperar sua mensagem mais tarde.",
        yourRecordedPhraseTitle: "Sua Mensagem Gravada!",
        prevPostcardBtn: "<",
        nextPostcardBtn: ">",
        blockchainTxIdLabel: "A administração do site não se responsabiliza pelo conteúdo das imagens carregadas. Este texto, sem image, está salvo na Blockchain ETH TxID:",
        sendPostcardBtn: "Compartilhar Este Cartão Postal",
        findPhraseByAnyTxIdTitle: "4. Encontrar Mensagem por Hash de Transação",
        anyTxIdLabel: "Seu Hash de Transação de Pagamento OU Hash de Registro na Blockchain:",
        findPhraseBtn: "Encontrar Mensagem",
        yourOriginalPaymentAddressLabel: "Seu endereço de pagamento original:",
        amountPaidLabel: "Valor pago:",
        foundReceiveAddressLabel: "Endereço do destinatário (para o pagamento):",
        phraseTextLabel: "Texto da Mensagem:",
        timestampOfSubmissionLabel: "Carimbo de data/hora do envio:",
        blockchainRecordTxIdLabel: "Hash de Transação de Registro na Blockchain:",
        etherscanLinkLabel: "Link do Etherscan (para registro da mensagem):",
        phraseInputPlaceholder: "Digite a mensagem que deseja registrar...",
        searchAnyTxHashInputPlaceholder: "Digite o hash da sua transação de pagamento OU o hash da transação de registro na blockchain...",
        statusEnterPhrase: "Digite sua mensagem.",
        statusSubmittingPhrase: "Enviando mensagem para o backend...",
        statusWaitingForPayment: "Aguardando seu pagamento...",
        statusPaymentReceived: "Pagamento recebido e mensagem registrada!",
        statusPaymentProcessing: "Pagamento recebido. Processando registro na blockchain e retendo fundos...",
        statusFailedBlockchainWrite: "Pagamento recebido, mas falha ao incorporar a mensagem na transação da blockchain. Por favor, entre em contato com o suporte com seu TxID de pagamento: ",
        statusFailedFundForwarding: "Pagamento recebido, mas falha ao incorporar a mensagem na transação da blockchain. Por favor, entre em contato com o suporte com seu TxID de pagamento: ",
        statusPaymentTimeout: "Tempo limite de pagamento. Nenhum pagamento correspondente encontrado após o número máximo de tentativas. Por favor, tente novamente.", // MODIFIED
        statusSessionExpired: "Sessão de pagamento expirada ou não encontrada. Por favor, tente novamente.",
        statusCheckingPayment: "Verificando pagamento", // MODIFIED
        statusPhraseFound: "Mensagem encontrada com sucesso!",
        statusPhraseNotFound: "Erro: Mensagem não encontrada ou processamento incompleto.",
        statusErrorBackend: "Erro do backend: ",
        statusNetworkError: "Erro de rede: ",
        statusPleaseEnterTxHash: "Por favor, digite um hash de transação (seu TxID de pagamento ou o TxID de registro na blockchain).",
        statusSearchingTxHash: "Procurando mensagem usando o Hash de transação fornecido...",
        alertCopySuccess: "Copiado para a área de transferência!",
        alertCopyFail: "Falha ao copiar. Por favor, copie manualmente.",
        alertNoPostcard: "Nenhum cartão postal para compartilhar!",
        alertShareFail: "Falha ao compartilhar o cartão postal. Por favor, copie o link manualmente.",
        promptShareLink: "Copie este link para compartilhar seu cartão postal:",
        // New translations for image upload
        uploadPhotoTitle: "1. Carregue uma imagem personalizada ou use uma padrão na etapa 3.",
        selectImageBtn: "Selecionar Imagem",
        imagePreviewPlaceholder: "Parâmetros recomendados para imagens carregadas: proporção 3:4, 900 x 1200, 1576 x 2100, 1772 x 2362, máx. 5MB, JPG/PNG/GIF.",
        useThisImageBtn: "Usar Esta Imagem",
        clearImageBtn: "Limpar Imagem",
        imageUploadSuccess: "Imagem carregada! Clique em 'Usar Esta Imagem' ou escolha outra.",
        imageUploadError: "Erro ao carregar imagem: ",
        imageUploadProcessing: "Carregando imagem...",
        imageUploadInvalid: "Arquivo inválido. Por favor, carregue uma imagem (jpeg, png, gif) de até 5MB.",
        imageUploadConsentDisclaimer: "As imagens carregadas tornam-se publicamente disponíveis na internet. Ao carregá-las, você consente a sua distribuição. A administração do site não se responsabiliza pelo conteúdo das imagens e fotos carregadas.",
        shareTextStart: "Confira minha mensagem registrada na blockchain Ethereum:",
        shareTextEnd: "Veja aqui:",
        // New translations for customization
        customizePostcardTitle: "3. Personalize seu Cartão Postal",
        fontFamilyLabel: "Fonte:",
        fontSizeLabel: "Tamanho da Fonte:",
        fontColorLabel: "Cor da Fonte:",
        textVerticalPositionLabel: "Posição Vertical:",
        textHorizontalPositionLabel: "Posição Horizontal:",
        posTop: "Superior",
        posCenter: "Centro",
        posBottom: "Inferior",
        alignLeft: "Esquerda",
        alignCenter: "Centro",
        alignRight: "Direita",
        shareHttpsWarning: "O compartilhamento funciona melhor com HTTPS. No iOS, o compartilhamento nativo pode não aparecer sem HTTPS.",
        useThisImageBtnSuccess: "Usando sua imagem carregada. Clique em 'Gravar na Blockchain'.",
        // NEW: Receive address input translations
        receiveAddressLabel: "Endereço ETH do Destinatário:",
        receiveAddressPlaceholder: "Deixe em branco para usar o endereço do remetente",
        receiveAddressHint: "Se deixado em branco, o endereço do remetente da transação será usado como destinatário.",
        statusEditingMode: "Modo de edição ativado. Faça alterações e clique em 'Gravar na Blockchain' novamente para enviar.",
        topSearchTxIdLabel: "Introduza o TXID da transação ETH para ler a mensagem:",
    },
    uk: {
        mainTitle: "SMSin",
        selectLanguageLabel: "Вибрати мову:",
        howItWorksTitle: "Як це працює:",
        navRecord: "Записати", 
        navFind: "Знайти",   
        navHowItWorks: "Як це працює", 
        howItWorksSteps: [
            "Введіть своє повідомлення в поле для тексту та натисніть \"Записати в блокчейн\". Це повідомлення буде вбудоване в мінімальну ETH-транзакцію та постійно записана в блокчейн; будь-яка людина може знайти цю транзакцію та прочитати ваше повідомлення.", // MODIFIED
            "За бажанням, завантажте власну фотографію для використання як фон листівки (макс. 5МБ, JPG/PNG/GIF). ЦЯ ЛИСТІВКА НЕ ЗАПИСУЄТЬСЯ В БЛОКЧЕЙН ETHEREUM. Листівка використовується як гарний фон для відправки вашого привітання одержувачу.",
            "Налаштуйте свою листівку, змінюючи шрифт, розмір, колір та положення тексту.",
            "Введіть ETH-адресу отримувача нижче (необов'язково). Якщо залишити порожнім, адреса відправника (адреса вашого гаманця) буде використана як отримувач після оплати.",
            "Ми надамо ETH-адресу та <strong>точну суму</strong> для оплати.",
            "Надішліть <strong>вказану точну суму</strong> ETH на вказану адресу, використовуючи <strong>будь-який</strong> криптогаманець (наприклад, MetaMask, Trust Wallet, Binance тощо). Вам не потрібно підключати свій гаманець до цього сайту.",
            "Наш сервіс виявить ваш платіж, вбудує ваше повідомлення в дані транзакції та перешле <strong>мінімальну суму ETH (1 Wei)</strong> вашому призначеному отримувачу, щоб постійно записати ваше повідомлення в блокчейн. Після цього на вашому екрані буде показана листівка з вашим повідомленням. Використовуючи кнопку \"Поділитися цією листівкою\" ви можете надіслати цю листівку за допомогою соціальних мереж.", // MODIFIED
            "Ви використовуватимете свій <strong>Hash початкової платіжної транзакції</strong> (з кроку 3) або <strong>Hash транзакції запису в блокчейні</strong>, щоб пізніше знайти деталі свого повідомлення."
        ],
        importantNoteTitle: "Важливо:",
        importantNoteText: "Переконайтеся, що ви надсилаєте <strong>ТОЧНУ відображену суму (включно з усіма знаками після коми)</strong>. Будь-яке відхилення може призвести до того, що ваш платіж не буде зіставлено з вашою фразою.",
        blockchainPermanenceDisclaimerTitle: "Важлива інформація про блокчейн:",
        blockchainPermanenceDisclaimerText: "Повідомлення, яке ви записуєте в блокчейн, залишиться в блокчейні назавжди і буде загальнодоступним для всіх користувачів Інтернету. Записавшии текст повідомлення, ви погоджуєтесь на його публічне розповсюдження.",
        recordNewPhraseTitle: "2. Записати нове повідомлення",
        yourPhraseLabel: "Ваше повідомлення:",
        phraseLengthHint: "(Макс. 200 символів)",
        submitPhraseBtn: "Записати в блокчейн",
        editBtn: "Редагувати",
        paymentRequiredTitle: "Потрібна оплата",
        pleaseSendExactAmount: "Будь ласка, надішліть точно",
        toTheAddressBelow: "на адресу нижче:",
        addressLabel: "Адреса:",
        copyBtn: "Копіювати",
        waitingForPayment: "Очікування вашого платежу...",
        doNotClosePageWarning: "Не закривайте цю сторінку, доки платіж не буде підтверджено!",
        rememberTxIdWarning: "Після підтвердження платежу запам'ятайте свій Hash платіжної транзакції (TxID), щоб пізніше отримати своє повідомлення.",
        yourRecordedPhraseTitle: "Ваше Записане Повідомлення!",
        prevPostcardBtn: "<",
        nextPostcardBtn: ">",
        blockchainTxIdLabel: "Адміністрація сайту не несе відповідальності за вміст завантажених зображень. Цей текст, без зображення, збережений у блокчейні ETH TxID:",
        sendPostcardBtn: "Поділитися цією листівкою",
        findPhraseByAnyTxIdTitle: "4. Знайти Повідомлення за Hash транзакцією",
        anyTxIdLabel: "Ваш Hash платіжної транзакції АБО Hash запису в блокчейні:",
        findPhraseBtn: "Знайти Повідомлення",
        yourOriginalPaymentAddressLabel: "Ваша початкова платіжна адреса:",
        amountPaidLabel: "Сплачена сума:",
        foundReceiveAddressLabel: "Адреса отримувача (для платежу):",
        phraseTextLabel: "Текст повідомлення:",
        timestampOfSubmissionLabel: "Час відправлення:",
        blockchainRecordTxIdLabel: "Hash транзакції запису в блокчейні:",
        etherscanLinkLabel: "Посилання на Etherscan (для запису повідомлення):",
        phraseInputPlaceholder: "Введіть повідомлення, яке ви хочете записати...",
        searchAnyTxHashInputPlaceholder: "Введіть хеш вашої платіжної транзакції АБО хеш транзакції запису в блокчейні...",
        statusEnterPhrase: "Будь ласка, введіть повідомлення.",
        statusSubmittingPhrase: "Надсилання повідомлення до бекенду...",
        statusWaitingForPayment: "Очікування вашого платежу...",
        statusPaymentReceived: "Платіж отримано та повідомлення записано!",
        statusPaymentProcessing: "Платіж отримано. Обробка запису блокчейну та утримання коштів...",
        statusFailedBlockchainWrite: "Платіж отримано, але не вдалося вбудувати повідомлення в блокчейн-транзакцію. Зверніться до служби підтримки зі своїм TxID платежу: ",
        statusFailedFundForwarding: "Платіж отримано, але не вдалося вбудувати повідомлення в блокчейн-транзакцію. Зверніться до служби підтримки зі своїм TxID платежу: ",
        statusPaymentTimeout: "Час очікування платежу вичерпано. Збігів за платежами не знайдено після максимальної кількості спроб. Будь ласка, спробуйте ще раз.", // MODIFIED
        statusSessionExpired: "Сесія платежу вичерпана або не знайдена. Будь ласка, спробуйте ще раз.",
        statusCheckingPayment: "Перевірка платежу", // MODIFIED
        statusPhraseFound: "Повідомлення успішно знайдено!",
        statusPhraseNotFound: "Помилка: Повідомлення не знайдено або обробка не завершена.",
        statusErrorBackend: "Помилка від бекенду: ",
        statusNetworkError: "Мережева помилка: ",
        statusPleaseEnterTxHash: "Будь ласка, введіть хеш транзакції (ваш TxID платежу або TxID запису в блокчейні).",
        statusSearchingTxHash: "Пошук повідомлення за наданим Hash транзакції...",
        alertCopySuccess: "Скопійовано в буфер обміну!",
        alertCopyFail: "Не вдалося скопіювати. Будь ласка, скопіюйте вручну.",
        alertNoPostcard: "Немає листівки для поширення!",
        alertShareFail: "Не вдалося поділитися листівкою. Будь ласка, скопіюйте посилання вручну.",
        promptShareLink: "Скопіюйте це посилання, щоб поділитися своєю листівкою:",
        // New translations for image upload
        uploadPhotoTitle: "1. Завантажте власне зображення або скористайтеся стандартним на кроці 3.",
        selectImageBtn: "Вибрати зображення",
        imagePreviewPlaceholder: "Рекомендовані параметри для завантажуваних зображень: співвідношення сторін 3:4, 900 x 1200, 1576 x 2100, 1772 x 2362, макс. 5МБ, JPG/PNG/GIF.",
        useThisImageBtn: "Використати це зображення",
        clearImageBtn: "Очистити зображення",
        imageUploadSuccess: "Зображення завантажено! Натисніть 'Використати це зображення' або виберіть інше.",
        imageUploadError: "Помилка завантаження зображення: ",
        imageUploadProcessing: "Завантаження зображення...",
        imageUploadInvalid: "Недійсний файл. Будь ласка, завантажте зображення (jpeg, png, gif) розміром до 5МБ.",
        imageUploadConsentDisclaimer: "Завантажені зображення стають публічно доступними в Інтернеті. Завантажуючи, ви даєте згоду на їх розповсюдження. Адміністрація сайту не несе відповідальності за вміст завантажених зображень та фотографій.",
        shareTextStart: "Перегляньте моє повідомлення, записане в блокчейні Ethereum:",
        shareTextEnd: "Переглянути тут:",
        // New translations for customization
        customizePostcardTitle: "3. Налаштуйте свою Листівку",
        fontFamilyLabel: "Гарнітура:",
        fontSizeLabel: "Розмір шрифту:",
        fontColorLabel: "Колір шрифту:",
        textVerticalPositionLabel: "Положення тексту (вертикально):",
        textHorizontalPositionLabel: "Положення тексту (горизонтально):",
        posTop: "Вгорі",
        posCenter: "По центру",
        posBottom: "Внизу",
        alignLeft: "Зліва", 
        alignCenter: "По центру", 
        alignRight: "Справа", 
        shareHttpsWarning: "Спільний доступ найкраще працює через HTTPS. На iOS нативний спільний доступ може не відображатися без HTTPS.",
        useThisImageBtnSuccess: "Використання завантаженого зображення. Натисніть 'Записати в блокчейн'.",
        // NEW: Receive address input translations
        receiveAddressLabel: "ETH Адреса отримувача:",
        receiveAddressPlaceholder: "Залиште порожнім, щоб використовувати адресу відправника",
        receiveAddressHint: "Якщо залишити порожнім, адреса відправника транзакції буде використана як отримувач.",
        statusEditingMode: "Режим редагування активовано. Внесіть зміни та натисніть 'Записати в блокчейн' ще раз, щоб надіслати.",
        topSearchTxIdLabel: "Введіть TXID ETH транзакції, щоб прочитати повідомлення:",
    },
    it: {
        mainTitle: "SMSin",
        selectLanguageLabel: "Seleziona Lingua:",
        howItWorksTitle: "Come funziona:",
        navRecord: "Registra", 
        navFind: "Trova",    
        navHowItWorks: "Come funziona", 
        howItWorksSteps: [
            "Inserisci il tuo messaggio nel campo di testo e clicca su \"Registra nella Blockchain\". Questo messaggio verrà incorporato in una transazione ETH minima e registrato permanentemente sulla blockchain; chiunque può trovare questa transazione e leggere il tuo messaggio.", // MODIFIED
            "Opzionalmente, carica la tua foto da usare come sfondo del biglietto (max 5MB, JPG/PNG/GIF). QUESTA CARTOLINA NON VIENE REGISTRATA SULLA BLOCKCHAIN DI ETHEREUM. La cartolina viene utilizzata come un bellissimo sfondo per inviare il tuo saluto al destinatario.",
            "Personalizza il tuo biglietto cambiando font, dimensioni, colore e posizione del testo.",
            "Inserisci l'indirizzo ETH del destinatario qui sotto (opzionale). Se lasciato vuoto, l'indirizzo del mittente (l'indirizzo del tuo portafoglio) verrà utilizzato come destinatario dopo il pagamento.",
            "Forniremo un indirizzo ETH e un importo <strong>esatto</strong> per il pagamento.",
            "Invia l'importo <strong>esatto specificato</strong> di ETH all'indirizzo fornito utilizzando <strong>qualsiasi</strong> portafoglio di criptovalute (es. MetaMask, Trust Wallet, Binance, etc.). Non è necessario connettere il tuo portafoglio a questo sito.",
            "Il nostro servizio rileverà il tuo pagamento, incorporerà il tuo messaggio nei dati della transazione e inoltrerà una <strong>quantità minima di ETH (1 Wei)</strong> al tuo destinatario designato per registrare permanentemente il tuo messaggio sulla blockchain. Dopo di che, una cartolina con il tuo messaggio verrà mostrata sul tuo schermo. Utilizzando il pulsante \"Condividi questa Cartolina\", puoi inviare questa cartolina tramite i social network.", // MODIFIED
            "Utilizzerai il tuo <strong>Hash Transazione di pagamento iniziale</strong> (dal passaggio 3) o l'<strong>Hash Transazione di Registrazione Blockchain</strong> per trovare i dettagli del tuo messaggio in seguito."
        ],
        importantNoteTitle: "Importante:",
        importantNoteText: "Assicurati di inviare l'importo <strong>ESATTO visualizzato (incluse tutte le cifre decimali)</strong>. Qualsiasi deviazione potrebbe impedire che il tuo pagamento venga abbinato alla tua frase.",
        blockchainPermanenceDisclaimerTitle: "Informazioni importanti sulla Blockchain:",
        blockchainPermanenceDisclaimerText: "Il messaggio che registri sulla blockchain rimarrà sulla blockchain per sempre e sarà pubblicamente accessibile a tutti gli utenti di Internet. Inviando, acconsenti alla loro distribuzione pubblica di questo messaggio.",
        recordNewPhraseTitle: "2. Registra un Nuovo Messaggio",
        yourPhraseLabel: "Il tuo messaggio:",
        phraseLengthHint: "(Max 200 caratteri)",
        submitPhraseBtn: "Registra nella Blockchain",
        editBtn: "Modifica",
        paymentRequiredTitle: "Pagamento richiesto",
        pleaseSendExactAmount: "Per favor, invia esattamente",
        toTheAddressBelow: "all'indirizzo qui sotto:",
        addressLabel: "Indirizzo:",
        copyBtn: "Copia",
        waitingForPayment: "In attesa del tuo pagamento...",
        doNotClosePageWarning: "Non chiudere questa pagina finché il pagamento non è confermato!",
        rememberTxIdWarning: "Una volta confermato il pagamento, ricorda il tuo Hash transazione di pagamento (TxID) per recuperare il tuo messaggio in seguito.",
        yourRecordedPhraseTitle: "Il tuo Messaggio Registrato!",
        prevPostcardBtn: "<",
        nextPostcardBtn: ">",
        blockchainTxIdLabel: "L'amministrazione del sito web non è responsabile per il contenuto delle immagini caricate. Questo testo, senza image, è salvato nella Blockchain ETH TxID:",
        sendPostcardBtn: "Condividi questa Cartolina",
        findPhraseByAnyTxIdTitle: "4. Trova Messaggio tramite Hash Transazione",
        anyTxIdLabel: "Il tuo Hash Transazione di Pagamento O Hash di Registrazione Blockchain:",
        findPhraseBtn: "Trova Messaggio",
        yourOriginalPaymentAddressLabel: "Il tuo indirizzo di pagamento originale:",
        amountPaidLabel: "Importo pagato:",
        foundReceiveAddressLabel: "Indirizzo del destinatario (per il pagamento):",
        phraseTextLabel: "Testo del Messaggio:",
        timestampOfSubmissionLabel: "Data e ora di invio:",
        blockchainRecordTxIdLabel: "Hash Transazione di registrazione Blockchain:",
        etherscanLinkLabel: "Link Etherscan (per il record del messaggio):",
        phraseInputPlaceholder: "Inserisci il messaggio che vuoi registrare...",
        searchAnyTxHashInputPlaceholder: "Inserisci l'hash della tua transazione di pagamento O l'hash della transazione di registrazione blockchain...",
        statusEnterPhrase: "Per favor, inserisci un messaggio.",
        statusSubmittingPhrase: "Invio del messaggio al backend...",
        statusWaitingForPayment: "In attesa del tuo pagamento...",
        statusPaymentReceived: "Pagamento ricevuto e messaggio registrato!",
        statusPaymentProcessing: "Pagamento ricevuto. Elaborazione del record blockchain e trattenuta fondi...",
        statusFailedBlockchainWrite: "Pagamento ricevuto, ma la scrittura del messaggio sulla blockchain è fallita. Contatta il supporto con il tuo TxID di pagamento: ",
        statusFailedFundForwarding: "Pagamento ricevuto, ma la scrittura del messaggio sulla blockchain è fallita. Contatta il supporto con il tuo TxID di pagamento: ",
        statusPaymentTimeout: "Timeout del pagamento. Nessun pagamento corrispondente trovato dopo il numero massimo di tentativi. Riprova per favor.", // MODIFIED
        statusSessionExpired: "Sessione di pagamento scaduta o non trovata. Riprova per favor.",
        statusCheckingPayment: "Verifica del pagamento", // MODIFIED
        statusPhraseFound: "Messaggio trovato con successo!",
        statusPhraseNotFound: "Errore: Messaggio non trovato o elaborazione incompleta.",
        statusErrorBackend: "Erro dal backend: ",
        statusNetworkError: "Erro di rete: ",
        statusPleaseEnterTxHash: "Inserisci un hash di transazione (il tuo TxID di pagamento o il TxID di registrazione blockchain).",
        statusSearchingTxHash: "Ricerca messaggio utilizzando l'Hash transazione fornito...",
        alertCopySuccess: "Copiato negli appunti!",
        alertCopyFail: "Impossibile copiare. Copia manualmente.",
        alertNoPostcard: "Nessuna cartolina da condividere!",
        alertShareFail: "Impossibile condividere la cartolina. Copia il link manualmente.",
        promptShareLink: "Copia questo link per condividere il tuo biglietto:",
        // New translations for image upload
        uploadPhotoTitle: "1. Carica un'immagine personalizzata o usa una standard al passaggio 3.",
        selectImageBtn: "Seleziona immagine",
        imagePreviewPlaceholder: "Parametri consigliati per le immagini caricate: rapporto 3:4, 900 x 1200, 1576 x 2100, 1772 x 2362, max 5MB, JPG/PNG/GIF.",
        useThisImageBtn: "Usa questa immagine",
        clearImageBtn: "Cancella immagine",
        imageUploadSuccess: "Immagine caricata! Clicca su 'Usa questa immagine' o scegline un'altra.",
        imageUploadError: "Errore durante il caricamento dell'immagine: ",
        imageUploadProcessing: "Caricamento immagine...",
        imageUploadInvalid: "File non valido. Carica un'immagine (jpeg, png, gif) fino a 5MB.",
        imageUploadConsentDisclaimer: "Le immagini caricate diventano pubblicamente disponibili su Internet. Caricando, acconsenti alla loro distribuzione. L'amministrazione del sito web non è responsabile per il contenuto delle immagini e delle foto caricate.",
        shareTextStart: "Dai un'occhiata al mio messaggio registrato sulla blockchain di Ethereum:",
        shareTextEnd: "Visualizzala qui:",
        // New translations for customization
        customizePostcardTitle: "3. Personalizza il tuo Biglietto",
        fontFamilyLabel: "Carattere:",
        fontSizeLabel: "Dimensione carattere:",
        fontColorLabel: "Colore carattere:",
        textVerticalPositionLabel: "Posizione verticale testo:",
        textHorizontalPositionLabel: "Posizione orizzontale testo:",
        posTop: "In alto",
        posCenter: "Al centro",
        posBottom: "In basso",
        alignLeft: "A sinistra",
        alignCenter: "Al centro",
        alignRight: "A destra",
        shareHttpsWarning: "La condivisione funziona meglio su HTTPS. Su iOS, la condivisione nativa potrebbe non apparire senza HTTPS.",
        useThisImageBtnSuccess: "Utilizzo della tua immagine caricata. Clicca su 'Registra nella Blockchain'.",
        // NEW: Receive address input translations
        receiveAddressLabel: "Indirizzo ETH del Destinatario:",
        receiveAddressPlaceholder: "Lascia vuoto per utilizzare l'indirizzo del mittente",
        receiveAddressHint: "Se lasciato vuoto, l'indirizzo del mittente della transazione verrà utilizzato come destinatario.",
        statusEditingMode: "Modalità di modifica attivata. Apporta modifiche e clicca di nuovo su 'Registra nella Blockchain' per inviare.",
        topSearchTxIdLabel: "Inserisci il TXID della transazione ETH per leggere il messaggio:",
    }
};

// --- Utility Functions ---
function updateStatus(divElement, message, type = '') {
    if (divElement) {
        divElement.innerHTML = message;
        divElement.className = `status ${type}`;
    }
}
function clearPhraseResult() {
    if (foundUserSenderAddressSpan) foundUserSenderAddressSpan.textContent = 'N/A';
    if (foundPaymentAmountSpan) foundPaymentAmountSpan.textContent = 'N/A';
    if (foundReceiveAddressSpan) foundReceiveAddressSpan.textContent = 'N/A'; 
    if (foundPhraseTextSpan) foundPhraseTextSpan.textContent = 'N/A';
    if (foundSubmissionTimestampSpan) foundSubmissionTimestampSpan.textContent = 'N/A';
    if (foundBlockchainRecordTxHashSpan) foundBlockchainRecordTxHashSpan.textContent = 'N/A';
    if (foundEtherscanLink) {
        foundEtherscanLink.textContent = 'N/A';
        foundEtherscanLink.href = '#';
    }
}
function getEtherscanLink(txHash) {
    if (!providerForSearch || typeof ethers === 'undefined') return `https://etherscan.io/tx/${txHash}`;
    let baseUrl;
    switch (currentChainId) {
        case 1: // Mainnet
            baseUrl = "https://etherscan.io";
            break;
        case 11155111: // Sepolia Testnet
            baseUrl = "https://sepolia.etherscan.io";
            break;
        case 5: // Goerli Testnet (deprecated)
            baseUrl = "https://goerli.etherscan.io";
            break;
        default:
            baseUrl = "https://etherscan.io";
            break;
    }
    return `${baseUrl}/tx/${txHash}`;
}
async function fetchChainId() {
    if (!providerForSearch || typeof ethers === 'undefined') return;
    try {
        const network = await providerForSearch.getNetwork();
        currentChainId = network.chainId;
        console.log(`Frontend connected to Network: ${network.name} (Chain ID: ${network.chainId}) for Etherscan links.`);
    } catch (error) {
        console.error("Failed to fetch chain ID for Etherscan links:", error);
    }
}

// --- Language Functions ---
function setLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    updateLanguageTexts(lang);
    if (phraseInput) phraseInput.placeholder = translations[lang].phraseInputPlaceholder;
    // Update both search inputs
    if (searchUserTxHashInput) searchUserTxHashInput.placeholder = translations[lang].searchAnyTxHashInputPlaceholder;
    if (topSearchTxHashInput) topSearchTxHashInput.placeholder = translations[lang].searchAnyTxHashInputPlaceholder;
    
    if (document.querySelector('.input-hint-wrapper .input-hint[data-lang-key="phraseLengthHint"]')) document.querySelector('.input-hint-wrapper .input-hint[data-lang-key="phraseLengthHint"]').textContent = translations[lang].phraseLengthHint; 
    if (receiveAddressInput) receiveAddressInput.placeholder = translations[lang].receiveAddressPlaceholder;
    if (document.querySelector('.receive-address-section .input-hint[data-lang-key="receiveAddressHint"]')) document.querySelector('.receive-address-section .input-hint[data-lang-key="receiveAddressHint"]').textContent = translations[lang].receiveAddressHint;
    
    updatePhraseLengthCounter(); 
    updatePreviewPostcard(); 
}
function getLanguage() {
    return localStorage.getItem('selectedLanguage') || 'en';
}
function updateLanguageTexts(lang) {
    const texts = translations[lang];
    if (!texts) return;

    // Update how-it-works section to message bubbles
    if (howItWorksBubblesContainer && texts.howItWorksSteps) {
        howItWorksBubblesContainer.innerHTML = ''; // Clear previous content
        texts.howItWorksSteps.forEach((step, index) => {
            const bubble = document.createElement('div');
            bubble.classList.add('message-bubble');
            if (index % 2 === 0) { // Alternate alignment for a chat-like look
                bubble.classList.add('left-bubble');
            } else {
                bubble.classList.add('right-bubble');
            }
            bubble.innerHTML = step; // Use innerHTML to preserve strong/bold tags
            howItWorksBubblesContainer.appendChild(bubble);
        });
    }

    // List of keys whose translations might contain HTML and require innerHTML
    const htmlContentKeys = new Set([
        'importantNoteTitle', // Contains <i> tag
        'importantNoteText',  // Contains <strong> tag
        'blockchainPermanenceDisclaimerText', // Contains strong (if any)
        'statusPaymentReceived', // Contains <a> tag
        'statusFailedBlockchainWrite', // Contains <a> tag
        'statusFailedFundForwarding', // Contains <a> tag
        'shareTextStart',
        'shareTextEnd',
        'doNotClosePageWarning', // Contains <strong> tag
        'rememberTxIdWarning'    // Contains <strong> tag
    ]);

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (texts[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = texts[key];
            } else if (htmlContentKeys.has(key)) {
                element.innerHTML = texts[key];
            } else {
                element.textContent = texts[key];
            }
        }
    });
}

// --- Function to control customization UI elements ---
function setCustomizationControlsState(enabled) {
    // Phrase input
    if (phraseInput) phraseInput.disabled = !enabled;
    
    // Image Upload Controls
    if (imageUploadInput) imageUploadInput.disabled = !enabled;
    if (customFileUploadLabel) customFileUploadLabel.style.pointerEvents = enabled ? 'auto' : 'none';
    if (useCustomImageBtn) useCustomImageBtn.disabled = !enabled;
    if (clearCustomImageBtn) clearCustomImageBtn.disabled = !enabled;
    
    // Postcard Customization Controls
    if (fontFamilySelect) fontFamilySelect.disabled = !enabled;
    if (fontSizeInput) fontSizeInput.disabled = !enabled;
    if (fontColorInput) fontColorInput.disabled = !enabled;
    
    textVerticalPositionRadios.forEach(radio => radio.disabled = !enabled);
    textHorizontalPositionRadios.forEach(radio => radio.disabled = !enabled);

    // Receive Address Input
    if (receiveAddressInput) receiveAddressInput.disabled = !enabled;

    // 'Record to Blockchain' button state: enabled if editing, disabled if not editing OR phrase is empty
    if (submitPhraseBtn) {
        submitPhraseBtn.disabled = isSubmissionInProgress || !enabled || phraseInput.value.trim().length === 0;
    }

    // 'Edit' button state: enabled if submission is in progress, disabled if editing is allowed
    if (editBtn) editBtn.disabled = enabled; 
}


// --- Postcard Functions ---
function renderPostcard(targetCanvas, targetPhraseText, targetTxHashLinkElement, phrase, blockchainRecordTxHash, 
						templateIndex, customImageId = null, customization = {}, isFullScreen = false) {
	if (!targetCanvas || !targetPhraseText) {
		console.error("Missing critical target elements (canvas or phraseText) for renderPostcard.");
		return;
	}
	targetCanvas.classList.remove('fade-in'); 
	void targetCanvas.offsetWidth; 
	targetCanvas.classList.add('fade-in'); 
	
	const backendBaseUrl = BACKEND_API_BASE_URL.replace('/api', '');
	let imageUrl;
	let effectiveCustomization;
	const baseTemplate = postcardTemplates[templateIndex % postcardTemplates.length];
	effectiveCustomization = { ...baseTemplate, ...customization }; 

	if (customImageId && customImageId !== 'none') {
		imageUrl = `${backendBaseUrl}/uploads/${customImageId}`; 
		// Добавим здесь логи для диагностики
		console.log("DEBUG [renderPostcard]: Using custom image.");
		console.log("DEBUG [renderPostcard]: backendBaseUrl:", backendBaseUrl);
		console.log("DEBUG [renderPostcard]: customImageId:", customImageId);
		console.log("DEBUG [renderPostcard]: Constructed imageUrl:", imageUrl); // <-- ЭТО САМЫЙ ВАЖНЫЙ ЛОГ
		// ... остальной код ...
	} else {
		imageUrl = baseTemplate.image; 
		console.log("DEBUG [renderPostcard]: Using template image.");
		console.log("DEBUG [renderPostcard]: Constructed imageUrl:", imageUrl); // <-- И ЭТОТ
	}
	
	// Set background size to 'contain' for ALL postcards, regardless of custom or template
	targetCanvas.style.backgroundSize = 'contain'; 
	targetCanvas.style.backgroundColor = '#f0f0f0'; // Keep consistent background color
	targetCanvas.style.backgroundRepeat = 'no-repeat';
	targetCanvas.style.backgroundPosition = 'center';
	
	targetCanvas.setAttribute('data-text-vertical-align', effectiveCustomization.textVerticalAlign);
	targetCanvas.setAttribute('data-text-horizontal-align', effectiveCustomization.textHorizontalAlign);
	
	targetCanvas.style.backgroundImage = `url(${imageUrl})`; // <-- Здесь устанавливается фон
	
	targetPhraseText.textContent = phrase;
	targetPhraseText.style.color = effectiveCustomization.fontColor;
	targetPhraseText.style.fontFamily = effectiveCustomization.fontFamily;


    // NEW: Adjust font size based on whether it's fullscreen or not
    if (isFullScreen) {
        const baseSizeValue = parseFloat(effectiveCustomization.fontSize || '1.5'); // Use float value, not 'em'
        targetPhraseText.style.fontSize = `${baseSizeValue * 1.5}em`; // Scale by 1.5x for fullscreen, making it larger
    } else {
        targetPhraseText.style.fontSize = effectiveCustomization.fontSize;
    }

    // Handle the TxID link display within the modal (only if it exists)
    if (targetTxHashLinkElement) {
        const txidLinkParent = targetTxHashLinkElement.parentElement; // This is the <p class="txid-link">
        if (blockchainRecordTxHash) { 
            targetTxHashLinkElement.textContent = `${blockchainRecordTxHash.substring(0, 6)}...${blockchainRecordTxHash.substring(blockchainRecordTxHash.length - 4)}`;
            targetTxHashLinkElement.href = getEtherscanLink(blockchainRecordTxHash);
            // JS only toggles display on the parent <p> element, let CSS handle visibility/opacity
            if (txidLinkParent) txidLinkParent.style.display = 'block'; 
        } else {
            targetTxHashLinkElement.textContent = '';
            targetTxHashLinkElement.href = '#';
            // Explicitly hide the parent if no hash
            if (txidLinkParent) txidLinkParent.style.display = 'none'; 
        }
    }
    
    // Ensure text is visible (opacity already 1 by default in CSS, but explicit here too)
    targetPhraseText.style.opacity = '1';
    targetPhraseText.style.visibility = 'visible';
}

function openFullscreenPostcard(phrase, blockchainRecordTxHash, templateIndex, customImageId, customization) {
    if (!fullscreenPostcardModal) return;
    fullscreenPostcardModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
    
    // Render postcard within the modal
    renderPostcard(fullscreenPostcardCanvas, fullscreenPhraseText, fullscreenBlockchainRecordTxHashLink,
                   phrase, blockchainRecordTxHash, templateIndex, customImageId, customization, true); // Pass true for isFullScreen
    
    currentPhraseData = {
        phraseText: phrase,
        blockchainRecordTxHash: blockchainRecordTxHash,
        customImageId: customImageId,
        customization: customization,
        templateIndex: templateIndex 
    };
    
    // Determine current template index for navigation
    if (customImageId && customImageId !== 'none') {
        currentTemplateIndex = -1; // -1 to indicate custom image is active
    } else {
        currentTemplateIndex = templateIndex; 
    }
    updateNavigationArrows(modalLeftArrow, modalRightArrow, customImageId, currentPhraseData);
}

function closeFullscreenPostcard() {
    if (!fullscreenPostcardModal) return;
    fullscreenPostcardModal.classList.remove('active');
    document.body.style.overflow = ''; 
    // Ensure the txid-link is hidden when modal is closed, regardless of its previous state.
    const txidLinkParent = fullscreenBlockchainRecordTxHashLink.parentElement;
    if (txidLinkParent) {
        txidLinkParent.style.display = 'none'; // Explicitly hide when modal is closed
    }
}

function navigatePostcard(direction, canvasElement, phraseTextElement, txLinkElement) {
    const isCustomImageActiveInContext = (currentPhraseData && currentPhraseData.customImageId && currentPhraseData.customImageId !== 'none') || (uploadedCustomImageId && uploadedCustomImageId !== 'none');
    const isRecordedPostcard = currentPhraseData && currentPhraseData.blockchainRecordTxHash;

    // Disable navigation if an active submission/payment is in progress, modal is open, or a recorded postcard is being viewed (no template changes allowed for recorded ones)
    if (isSubmissionInProgress || fullscreenPostcardModal.classList.contains('active') || isCustomImageActiveInContext || isRecordedPostcard) {
        return; 
    }
    
    let newIndex = currentTemplateIndex + direction;
    if (newIndex < 0) {
        newIndex = postcardTemplates.length - 1;
    } else if (newIndex >= postcardTemplates.length) {
        newIndex = 0;
    }
    currentTemplateIndex = newIndex; 
    
    const phraseToRender = phraseInput.value.trim();
    const blockchainRecordTxHashToRender = null; // No TXID in preview mode
    const customImageIdToRender = uploadedCustomImageId; 
    const customizationToRender = getPostcardCustomization();
    
    renderPostcard(canvasElement, phraseTextElement, txLinkElement,
                   phraseToRender, blockchainRecordTxHashToRender,
                   currentTemplateIndex, customImageIdToRender, customizationToRender, false); // Pass false for isFullScreen
    
    updateNavigationArrows(previewLeftArrow, previewRightArrow, uploadedCustomImageId, null); 
    // REMOVED: template name display logic. This element no longer exists in HTML.
}
// Function to enable/disable navigation arrows based on context
function updateNavigationArrows(leftArrow, rightArrow, customImageId, currentPhraseContext = null) {
    if (!leftArrow || !rightArrow) return;
    let isDisabled = false;

    if (isSubmissionInProgress) {
        isDisabled = true;
    }
    // Disable if a custom image is in use OR if viewing a completed/recorded postcard
    else if ((customImageId && customImageId !== 'none') || 
             (currentPhraseContext && currentPhraseContext.blockchainRecordTxHash)) {
        isDisabled = true;
    }
    leftArrow.disabled = isDisabled;
    rightArrow.disabled = isDisabled;
}
function generateShareLink(blockchainRecordTxHash, customImageId = null) {
    let shareLink = `${window.location.origin}${window.location.pathname}?txid=${blockchainRecordTxHash}`;
    if (customImageId && customImageId !== 'none') {
        shareLink += `&imgid=${customImageId}`;
    }
    return shareLink;
}
async function handleShare() {
    if (!currentPhraseData || !currentPhraseData.blockchainRecordTxHash) {
        alert(translations[getLanguage()].alertNoPostcard);
        return;
    }
    const shareLink = generateShareLink(currentPhraseData.blockchainRecordTxHash, currentPhraseData.customImageId);
    const phrase = currentPhraseData.phraseText;
    const shareTitle = translations[getLanguage()].yourRecordedPhraseTitle;
    const shareText = `${translations[getLanguage()].shareTextStart} "${phrase}"! ${translations[getLanguage()].shareTextEnd} ${shareLink}`; 
    if (navigator.share) {
        if (window.location.protocol !== 'https:') {
            alert(translations[getLanguage()].shareHttpsWarning);
            console.warn("navigator.share() requires HTTPS to work reliably, especially on iOS.");
        }
        try {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                url: shareLink
            });
            console.log('Postcard shared successfully');
        } catch (error) {
            console.error('Error sharing postcard:', error);
            if (error.name !== 'AbortError') { 
                alert(translations[getLanguage()].alertShareFail);
            }
        }
    } else {
        prompt(translations[getLanguage()].promptShareLink, shareLink);
    }
}

// --- Postcard Constructor & Preview Logic ---
function updatePreviewPostcard() {
    if (!previewPhraseText || !phraseInput || !previewPostcardCanvas) {
        return; 
    }
    const phrase = phraseInput.value.trim();
    if (!phrase) {
        previewPhraseText.textContent = translations[getLanguage()].phraseInputPlaceholder;
    } else {
        previewPhraseText.textContent = phrase;
    }
    const customization = getPostcardCustomization(); 
    const currentPreviewImageId = uploadedCustomImageId; 
    const currentPreviewTemplateIndex = currentTemplateIndex; 
    
    renderPostcard(previewPostcardCanvas, previewPhraseText, null, 
                   phrase, null, currentPreviewTemplateIndex, currentPreviewImageId, customization, false); // Pass false for isFullScreen
    
    updateNavigationArrows(previewLeftArrow, previewRightArrow, uploadedCustomImageId, null); 
    // REMOVED: template name display logic. This element no longer exists in HTML.
}
function getPostcardCustomization() {
    return {
        fontFamily: fontFamilySelect ? fontFamilySelect.value : 'Playfair Display', 
        fontSize: fontSizeInput ? `${fontSizeInput.value}em` : '1.5em', 
        fontColor: fontColorInput ? fontColorInput.value : '#333333',
        textVerticalAlign: document.querySelector('input[name="textVerticalPosition"]:checked') ? document.querySelector('input[name="textVerticalPosition"]:checked').value : 'center',
        textHorizontalAlign: document.querySelector('input[name="textHorizontalPosition"]:checked') ? document.querySelector('input[name="textHorizontalPosition"]:checked').value : 'center' 
    };
}
if (fontFamilySelect) fontFamilySelect.addEventListener('change', updatePreviewPostcard);
if (fontSizeInput) fontSizeInput.addEventListener('input', () => {
    if (fontSizeValueSpan) fontSizeValueSpan.textContent = `${fontSizeInput.value}em`;
    updatePreviewPostcard();
});
if (fontColorInput) fontColorInput.addEventListener('input', updatePreviewPostcard);
textVerticalPositionRadios.forEach(radio => {
    radio.addEventListener('change', updatePreviewPostcard);
});
textHorizontalPositionRadios.forEach(radio => { 
    radio.addEventListener('change', updatePreviewPostcard);
});
if (phraseInput) phraseInput.addEventListener('input', () => { 
    updatePhraseLengthCounter();
    updatePreviewPostcard();
    if (submitPhraseBtn) {
        submitPhraseBtn.disabled = isSubmissionInProgress || phraseInput.value.trim().length === 0;
    }
});
if (previewLeftArrow) previewLeftArrow.addEventListener('click', () => {
    if (!uploadedCustomImageId && !isSubmissionInProgress) {
        navigatePostcard(-1, previewPostcardCanvas, previewPhraseText, null);
    }
});
if (previewRightArrow) previewRightArrow.addEventListener('click', () => {
    if (!uploadedCustomImageId && !isSubmissionInProgress) {
        navigatePostcard(1, previewPostcardCanvas, previewPhraseText, null);
    }
});

// --- Image Upload Handlers ---
if (imageUploadInput) imageUploadInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
        if (imagePreview) imagePreview.style.opacity = '0';
        if (imagePreviewPlaceholder) imagePreviewPlaceholder.style.display = 'block';
        if (useCustomImageBtn) useCustomImageBtn.style.display = 'none'; 
        if (clearCustomImageBtn) clearCustomImageBtn.style.display = 'none'; 
        updateStatus(imageUploadStatusDiv, '', '');
        uploadedCustomImageId = null; 
        updatePreviewPostcard(); 
        return;
    }
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.type);
    const filesize = file.size <= 5 * 1024 * 1024; 
    if (!mimetype || !filesize) {
        updateStatus(imageUploadStatusDiv, translations[getLanguage()].imageUploadInvalid, 'error');
        if (imagePreview) imagePreview.style.opacity = '0';
        if (imagePreviewPlaceholder) imagePreviewPlaceholder.style.display = 'block';
        if (useCustomImageBtn) useCustomImageBtn.style.display = 'none';
        if (clearCustomImageBtn) clearCustomImageBtn.style.display = 'none';
        uploadedCustomImageId = null; 
        return;
    }
    updateStatus(imageUploadStatusDiv, translations[getLanguage()].imageUploadProcessing, 'warning');
    if (imagePreviewPlaceholder) imagePreviewPlaceholder.style.display = 'none';
    if (useCustomImageBtn) useCustomImageBtn.disabled = true;
    if (clearCustomImageBtn) clearCustomImageBtn.disabled = true;
    const reader = new FileReader();
    reader.onload = (e) => {
        if (imagePreview) {
            imagePreview.src = e.target.result;
            imagePreview.style.opacity = '1';
        }
        updatePreviewPostcard(); 
    };
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append('postcardImage', file);
    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/upload-image`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            updateStatus(imageUploadStatusDiv, translations[getLanguage()].imageUploadSuccess, 'success');
            uploadedCustomImageId = data.customImageId; 
            if (useCustomImageBtn) {
                useCustomImageBtn.style.display = 'block';
                useCustomImageBtn.disabled = false;
            }
            if (clearCustomImageBtn) {
                clearCustomImageBtn.style.display = 'block';
                clearCustomImageBtn.disabled = false;
            }
            updatePreviewPostcard(); 
            if (textInputSection) { // MODIFIED: Scroll to recordSection
                textInputSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            throw new Error(data.error || 'Unknown upload error');
        }
    } catch (error) {
        console.error("Image upload failed:", error);
        updateStatus(imageUploadStatusDiv, `${translations[getLanguage()].imageUploadError} ${error.message}`, 'error');
        if (imagePreview) imagePreview.style.opacity = '0';
        if (imagePreviewPlaceholder) imagePreviewPlaceholder.style.display = 'block';
        if (useCustomImageBtn) useCustomImageBtn.style.display = 'none';
        if (clearCustomImageBtn) clearCustomImageBtn.style.display = 'none';
        uploadedCustomImageId = null;
        updatePreviewPostcard(); 
    }
});
if (useCustomImageBtn) useCustomImageBtn.addEventListener('click', () => {
    updateStatus(imageUploadStatusDiv, translations[getLanguage()].useThisImageBtnSuccess, 'info'); 
    if (textInputSection) { // MODIFIED: Scroll to recordSection
        textInputSection.scrollIntoView({ behavior: 'smooth' });
    }
});
if (clearCustomImageBtn) clearCustomImageBtn.addEventListener('click', () => {
    uploadedCustomImageId = null;
    currentTemplateIndex = 0; 
    if (imageUploadInput) imageUploadInput.value = ''; 
    if (imagePreview) imagePreview.src = '#';
    if (imagePreview) imagePreview.style.opacity = '0';
    if (imagePreviewPlaceholder) imagePreviewPlaceholder.style.display = 'block';
    if (useCustomImageBtn) useCustomImageBtn.style.display = 'none';
    if (clearCustomImageBtn) clearCustomImageBtn.style.display = 'none';
    updateStatus(imageUploadStatusDiv, '', '');
    updatePreviewPostcard(); 
});

// --- Event Handlers (General) ---
// Language switcher
if (langSelect) langSelect.addEventListener('change', (event) => {
    setLanguage(event.target.value);
});

// 1. Record to Blockchain
if (submitPhraseBtn) submitPhraseBtn.addEventListener('click', async () => {
    const phrase = phraseInput.value.trim();
    const receiveAddress = receiveAddressInput.value.trim(); 
    if (!phrase) {
        updateStatus(writeStatusDiv, translations[getLanguage()].statusEnterPhrase, 'error');
        return;
    }
    if (phrase.length > MAX_PHRASE_LENGTH) { 
        updateStatus(writeStatusDiv, `Phrase is too long (max ${MAX_PHRASE_LENGTH} characters).`, 'error'); 
        return;
    }
    if (receiveAddress && !ethers.utils.isAddress(receiveAddress)) {
        updateStatus(writeStatusDiv, `Invalid ETH recipient address: ${receiveAddress}.`, 'error');
        return;
    }

    isSubmissionInProgress = true; 
    setCustomizationControlsState(false);
    if (submitPhraseBtn) submitPhraseBtn.disabled = true;
    if (editBtn) editBtn.disabled = false;

    updateStatus(writeStatusDiv, translations[getLanguage()].statusSubmittingPhrase, 'warning');
    if (paymentWarningBox) paymentWarningBox.style.display = 'block'; // Show warning box
    if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'none';
    const customization = getPostcardCustomization(); 
    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/submit-phrase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                phrase, 
                customImageId: uploadedCustomImageId || null, 
                fontFamily: customization.fontFamily,
                fontSize: customization.fontSize,
                fontColor: customization.fontColor,
                textVerticalAlign: customization.textVerticalAlign,
                textHorizontalAlign: customization.textHorizontalAlign,
                templateIndex: currentTemplateIndex, 
                receiveAddress: receiveAddress || null 
            }), 
        });
        const data = await response.json();
        if (response.ok) {
            currentSessionId = data.sessionId;
            if (paymentAmountEthSpan) paymentAmountEthSpan.textContent = data.amountEth;
            if (paymentAddressSpan) paymentAddressSpan.textContent = data.paymentAddress;
            if (qrCodeImage) qrCodeImage.src = data.qrCodeImage;
            updateStatus(writeStatusDiv, data.message + " " + translations[getLanguage()].statusWaitingForPayment, 'warning');
            if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'block';
            if (paymentWarningBox) { // Scroll to the warning box, which is the desired target
                paymentWarningBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // NEW: Initialize polling attempts and countdown
            currentPollingAttempt = MAX_POLLING_ATTEMPTS;
            countdownSecondsForDisplay = POLLING_INTERVAL_SECONDS;

            if (countdownSpan) countdownSpan.textContent = `(${currentPollingAttempt}/${MAX_POLLING_ATTEMPTS} | ${translations[getLanguage()].statusCheckingPayment} in ${countdownSecondsForDisplay}s)`;
            
            if (paymentPollingInterval) clearInterval(paymentPollingInterval); 
            paymentPollingInterval = setInterval(async () => {
                countdownSecondsForDisplay--;
                
                if (countdownSecondsForDisplay <= 0) {
                    countdownSecondsForDisplay = POLLING_INTERVAL_SECONDS; // Reset inner countdown
                    currentPollingAttempt--; // Decrement outer countdown

                    if (currentPollingAttempt <= 0) {
                        clearInterval(paymentPollingInterval); 
                        paymentPollingInterval = null;
                        if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'none';
                        if (paymentWarningBox) paymentWarningBox.style.display = 'none'; 
                        updateStatus(writeStatusDiv, translations[getLanguage()].statusPaymentTimeout, 'error');
                        currentSessionId = null;

                        isSubmissionInProgress = false; 
                        setCustomizationControlsState(true);
                        updateNavigationArrows(previewLeftArrow, previewRightArrow, uploadedCustomImageId, null);
                        return; // Stop further processing
                    }
                    await checkPaymentStatus(currentSessionId);
                }
                if (countdownSpan) countdownSpan.textContent = `(${currentPollingAttempt}/${MAX_POLLING_ATTEMPTS} | ${translations[getLanguage()].statusCheckingPayment} in ${countdownSecondsForDisplay}s)`;
            }, 1000); 
            await checkPaymentStatus(currentSessionId);
        } else {
            updateStatus(writeStatusDiv, `${translations[getLanguage()].statusErrorBackend} ${data.error || 'Unknown error'}`, 'error');
            isSubmissionInProgress = false; 
            setCustomizationControlsState(true);
            if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'none';
            if (paymentWarningBox) paymentWarningBox.style.display = 'none'; // Hide warning box on error
        }
    } catch (error) {
        console.error("Error submitting phrase:", error);
        updateStatus(writeStatusDiv, `${translations[getLanguage()].statusNetworkError} ${error.message}`, 'error');
        isSubmissionInProgress = false; 
        setCustomizationControlsState(true);
        if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'none';
        if (paymentWarningBox) paymentWarningBox.style.display = 'none'; // Hide warning box on error
    } finally {
        updateNavigationArrows(previewLeftArrow, previewRightArrow, uploadedCustomImageId, null);
    }
});

async function checkPaymentStatus(sessionId) {
    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/check-payment/${sessionId}`);
        const data = await response.json();
        if (response.ok) {
            if (data.status === 'pending_payment' || data.status === 'payment_received' || data.status === 'writing_to_blockchain') {
                updateStatus(writeStatusDiv, translations[getLanguage()].statusPaymentProcessing, 'warning');
            } else if (data.status === 'completed') {
                clearInterval(paymentPollingInterval); 
                paymentPollingInterval = null;
                if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'none';
                if (paymentWarningBox) paymentWarningBox.style.display = 'none'; // Hide warning box on completion
                updateStatus(writeStatusDiv, `${translations[getLanguage()].statusPaymentReceived} Your payment transaction ID (TxID) was: <a href="${getEtherscanLink(data.userPaymentTxHash)}" target="_blank">${data.userPaymentTxHash.substring(0, 6)}...${data.userPaymentTxHash.substring(data.userPaymentTxHash.length - 4)}</a>. <br>The message was recorded to blockchain in TxID: <a href="${getEtherscanLink(data.fundForwardTxHash)}" target="_blank">${data.fundForwardTxHash.substring(0, 6)}...${data.fundForwardTxHash.substring(data.fundForwardTxHash.length - 4)}</a>. Use these TxIDs in the search section below, or view your postcard below!`, 'success');
                if (phraseInput) phraseInput.value = ''; 
                if (receiveAddressInput) receiveAddressInput.value = ''; 
                currentSessionId = null;
                if (clearCustomImageBtn) clearCustomImageBtn.click(); 
                
                isSubmissionInProgress = false; 
                setCustomizationControlsState(true);
                updateNavigationArrows(previewLeftArrow, previewRightArrow, uploadedCustomImageId, null);
                
                if (searchUserTxHashInput) searchUserTxHashInput.value = data.userPaymentTxHash;
                await performPhraseSearch(data.userPaymentTxHash, findStatusDiv); 
            } else if (data.status.startsWith('failed_')) {
                clearInterval(paymentPollingInterval); 
                paymentPollingInterval = null;
                if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'none';
                if (paymentWarningBox) paymentWarningBox.style.display = 'none'; // Hide warning box on failure
                let txidLink = data.fundForwardTxHash ? `<a href="${getEtherscanLink(data.fundForwardTxHash)}" target="_blank">${data.fundForwardTxHash.substring(0, 6)}...${data.fundForwardTxHash.substring(data.fundForwardTxHash.length - 4)}</a>` : 'N/A';
                updateStatus(writeStatusDiv, `${translations[getLanguage()].statusFailedFundForwarding} ${data.userPaymentTxHash || 'N/A'}. Blockchain Record TxID: ${txidLink}.`, 'error'); 
                
                isSubmissionInProgress = false; 
                setCustomizationControlsState(true);
                updateNavigationArrows(previewLeftArrow, previewRightArrow, uploadedCustomImageId, null);
            }
        } else {
            if (data.error === "Session not found.") {
                 clearInterval(paymentPollingInterval);
                 paymentPollingInterval = null;
                 if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'none';
                 if (paymentWarningBox) paymentWarningBox.style.display = 'none'; // Hide warning box on session not found
                 updateStatus(writeStatusDiv, translations[getLanguage()].statusSessionExpired, 'error');
                 currentSessionId = null;

                 isSubmissionInProgress = false; 
                 setCustomizationControlsState(true);
                 updateNavigationArrows(previewLeftArrow, previewRightArrow, uploadedCustomImageId, null);
            }
            console.warn(`Backend status check failed: ${data.error}`);
        }
    } catch (error) {
        console.error("Error checking payment status:", error);
    }
}

// 2. Copy Payment Address
if (copyAddressBtn) copyAddressBtn.addEventListener('click', () => {
    const address = paymentAddressSpan.textContent;
    if (address.trim() === '') { 
        alert(translations[getLanguage()].alertCopyFail + " (Address is empty)");
        return;
    }
    navigator.clipboard.writeText(address).then(() => {
        alert(translations[getLanguage()].alertCopySuccess);
    }).catch(err => {
        console.error('Failed to copy address:', err);
        alert(translations[getLanguage()].alertCopyFail);
    });
});

// Copy Payment Amount
if (copyAmountBtn) copyAmountBtn.addEventListener('click', () => {
    const amount = paymentAmountEthSpan.textContent;
    if (amount.trim() === '') { 
        alert(translations[getLanguage()].alertCopyFail + " (Amount is empty)");
        return;
    }
    navigator.clipboard.writeText(amount).then(() => {
        alert(translations[getLanguage()].alertCopySuccess);
    }).catch(err => {
        console.error('Failed to copy amount:', err);
        alert(translations[getLanguage()].alertCopyFail);
    });
});

// --- Edit Button Handler ---
if (editBtn) editBtn.addEventListener('click', () => {
    isSubmissionInProgress = false; 
    clearInterval(paymentPollingInterval); 
    paymentPollingInterval = null;
    if (paymentDetailsDiv) paymentDetailsDiv.style.display = 'none';
    if (paymentWarningBox) paymentWarningBox.style.display = 'none'; // Hide warning box when editing
    
    updateStatus(writeStatusDiv, translations[getLanguage()].statusEditingMode, 'info');
    
    setCustomizationControlsState(true); 
    updateNavigationArrows(previewLeftArrow, previewRightArrow, uploadedCustomImageId, null);
});


// Postcard navigation in fullscreen modal
if (modalLeftArrow) modalLeftArrow.addEventListener('click', () => {
    // Only allow navigation if a custom image is NOT in use (i.e., using templates)
    if (!(currentPhraseData && currentPhraseData.customImageId && currentPhraseData.customImageId !== 'none')) {
        navigatePostcard(-1, fullscreenPostcardCanvas, fullscreenPhraseText, fullscreenBlockchainRecordTxHashLink);
    }
});
if (modalRightArrow) modalRightArrow.addEventListener('click', () => {
    // Only allow navigation if a custom image is NOT in use (i.e., using templates)
    if (!(currentPhraseData && currentPhraseData.customImageId && currentPhraseData.customImageId !== 'none')) {
        navigatePostcard(1, fullscreenPostcardCanvas, fullscreenPhraseText, fullscreenBlockchainRecordTxHashLink);
    }
});

if (modalSendPostcardBtn) modalSendPostcardBtn.addEventListener('click', handleShare);
if (closeFullscreenModalBtn) closeFullscreenModalBtn.addEventListener('click', closeFullscreenPostcard);
if (fullscreenPostcardCanvas) fullscreenPostcardCanvas.addEventListener('click', handleShare);


// --- Reusable Message Search Function ---
async function performPhraseSearch(txid, statusDiv) {
    if (!txid) {
        updateStatus(statusDiv, translations[getLanguage()].statusPleaseEnterTxHash, 'error');
        clearPhraseResult(); 
        return;
    }
    updateStatus(statusDiv, translations[getLanguage()].statusSearchingTxHash, 'warning');
    clearPhraseResult(); 
    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/find-phrase/${txid}`); 
        const data = await response.json();
        if (response.ok) {
            if (foundUserSenderAddressSpan) foundUserSenderAddressSpan.textContent = data.userSenderAddress;
            if (foundPaymentAmountSpan) foundPaymentAmountSpan.textContent = `${data.userPaidAmountEth} ETH`;
            if (foundReceiveAddressSpan) foundReceiveAddressSpan.textContent = data.receiveAddress || 'N/A'; 
            if (foundPhraseTextSpan) foundPhraseTextSpan.textContent = data.phraseText;
            if (foundSubmissionTimestampSpan) foundSubmissionTimestampSpan.textContent = new Date(data.createdAt).toLocaleString();
            if (foundBlockchainRecordTxHashSpan) foundBlockchainRecordTxHashSpan.textContent = data.fundForwardTxHash;
            if (foundEtherscanLink) {
                foundEtherscanLink.textContent = translations[getLanguage()].etherscanLinkLabel;
                foundEtherscanLink.href = getEtherscanLink(data.fundForwardTxHash);
            }
            let foundStatusMessage = translations[getLanguage()].statusPhraseFound;
            if (data.status === 'failed_fund_forwarding') {
                 foundStatusMessage = `${translations[getLanguage()].statusPhraseFound} (${translations[getLanguage()].statusFailedFundForwarding} check TXID: ${data.userPaymentTxHash || 'N/A'})`; 
            }
            updateStatus(statusDiv, foundStatusMessage, 'success');
            
            openFullscreenPostcard(data.phraseText, data.fundForwardTxHash, data.templateIndex, data.customImageId, { 
                fontFamily: data.fontFamily,
                fontSize: data.fontSize,
                fontColor: data.fontColor,
                textVerticalAlign: data.textVerticalAlign,
                textHorizontalAlign: data.textHorizontalAlign 
            });
        } else {
            updateStatus(statusDiv, `${translations[getLanguage()].statusPhraseNotFound} ${data.error || ''}`, 'error');
        }
    } catch (error) {
        console.error("Error searching for message by transaction ID:", error);
        updateStatus(statusDiv, `${translations[getLanguage()].statusNetworkError} ${error.message}`, 'error');
    }
}


// 3. Find Message by ANY Transaction ID (user's payment or blockchain record) - bottom button
if (findPhraseByUserTxBtn) findPhraseByUserTxBtn.addEventListener('click', async () => {
    const txid = searchUserTxHashInput.value.trim(); 
    await performPhraseSearch(txid, findStatusDiv);
});

// NEW: Find Message by ANY Transaction ID (user's payment or blockchain record) - top button
if (topFindPhraseBtn) topFindPhraseBtn.addEventListener('click', async () => {
    const txid = topSearchTxHashInput.value.trim(); 
    await performPhraseSearch(txid, topFindStatusDiv);
});


// Function to update the character counter
function updatePhraseLengthCounter() {
    if (phraseInput && phraseLengthCounter) {
        const currentLength = phraseInput.value.length;
        phraseLengthCounter.textContent = `${currentLength}/${MAX_PHRASE_LENGTH}`;
        if (currentLength > MAX_PHRASE_LENGTH) {
            phraseLengthCounter.style.color = 'red';
        } else {
            phraseLengthCounter.style.color = '#777'; 
        }
    }
}

// --- NEW: Navigation and Scroll Tracking Logic ---

// Smooth scrolling for navigation links
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-nav-target');
        const targetSection = sections[targetId];
        if (targetSection) {
            // Adjust scroll position to account for fixed header/nav bar
            const isMobileView = window.matchMedia("(max-width: 768px)").matches;
            let offset = 0;
            if (isMobileView) {
                // For mobile, fixed nav is at the bottom, so no need to offset from top
                // But we still want to scroll the target into view, maybe slightly above the middle
            } else {
                // For desktop, fixed nav is conceptually under the header,
                // so we want to scroll to target minus the height of the nav itself.
                // Or just the main header, if the nav is part of its flow.
                const header = document.querySelector('header');
                const mainNav = document.getElementById('main-nav-bar');
                if (header) offset += header.offsetHeight;
                if (mainNav && !isMobileView) offset += mainNav.offsetHeight; // Add nav height on desktop
                offset += 20; // Additional spacing
            }
            
            const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for highlighting active section
const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: '0px 0px -50% 0px', // A section is considered "active" when its top half enters the viewport
    threshold: 0.1 // 10% of the element visible
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const targetId = entry.target.id;
        const navItem = document.querySelector(`[data-nav-target="${targetId}"]`);

        if (navItem) {
            if (entry.isIntersecting) {
                navItems.forEach(item => item.classList.remove('active'));
                navItem.classList.add('active');
            } else {
                // Optionally remove active class when not intersecting,
                // but the logic above will re-add to the correct one.
            }
        }
    });
}, observerOptions);

// Observe each section
for (const key in sections) {
    if (sections[key]) {
        sectionObserver.observe(sections[key]);
    }
}

// Initial active state for the first visible section on load
const updateInitialActiveSection = () => {
    // Determine if we're on mobile (fixed bottom nav) or desktop (fixed top nav)
    const isMobileView = window.matchMedia("(max-width: 768px)").matches;
    let firstActiveFound = false;

    // Calculate a dynamic top offset for intersection checks
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const navHeight = isMobileView ? (mainNavBar?.offsetHeight || 0) : 0; // Only consider mobile nav for bottom offset
    
    // We want a section to be considered "active" if its top is roughly at the top of the content area
    // This is more complex because the fixed nav bar itself is part of the layout.
    // Let's stick to the rootMargin approach of IntersectionObserver which is generally reliable.
    // The initial update is primarily to set a default if no section is in the middle.
    
    // Check from the top of the content
    for (const key in sections) {
        const section = sections[key];
        if (section) {
            const rect = section.getBoundingClientRect();
            // A section is "active" if its top is visible (or slightly above)
            // and its bottom is still visible. Prioritize the first visible from top.
            if (rect.top <= (isMobileView ? window.innerHeight - navHeight - 10 : headerHeight + 10) && rect.bottom >= 0) {
                 // Check if it's actually in the main viewable area
                 const viewportThreshold = window.innerHeight * 0.1; // Top 10%
                 const bottomThreshold = isMobileView ? window.innerHeight - (navHeight * 1.5) : window.innerHeight * 0.9; // Above mobile nav or bottom 10%

                 if (rect.top < bottomThreshold && rect.bottom > viewportThreshold) {
                    navItems.forEach(item => item.classList.remove('active'));
                    const navItem = document.querySelector(`[data-nav-target="${section.id}"]`);
                    if (navItem) {
                        navItem.classList.add('active');
                    }
                    firstActiveFound = true;
                    break; 
                 }
            }
        }
    }

    if (!firstActiveFound && sections.recordSection) { // Default to recordSection if nothing else is clearly active
         navItems.forEach(item => item.classList.remove('active'));
         document.querySelector(`[data-nav-target="recordSection"]`)?.classList.add('active');
    }
};

window.addEventListener('load', updateInitialActiveSection);
window.addEventListener('scroll', updateInitialActiveSection); 
window.addEventListener('resize', updateInitialActiveSection);


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
    setTimeout(showAdBanners, 70); 

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
