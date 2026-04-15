<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>PLAY GAME</title>

    <!-- Мобильная адаптация -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta name="description" content="Онлайн мини игра. Играй прямо в браузере с любого устройства." />
    <meta name="keywords" content="игра онлайн, браузерная игра, мини игра" />

    <style>
        :root { --bg: #0f172a; --panel: #111827; --muted: #aaa; }
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background: var(--bg);
            color: #fff;
            font-family: Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            display: flex;
            flex-direction: column;
        }

        header {
            padding: 12px 16px;
            background: var(--panel);
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            flex: 0 0 auto;
        }

        .game-wrapper {
            flex: 1 1 auto; /* занимает оставшееся место */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            box-sizing: border-box;
        }

        .game-container {
            width: 100%;
            max-width: 900px;
            aspect-ratio: 16 / 9;
            background: #000;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        iframe.game-embed {
            width: 100%;
            height: 100%;
            display: block;
            border: none;
            background: linear-gradient(180deg,#081024 0%, #001018 100%);
        }

        footer {
            padding: 10px 12px;
            font-size: 13px;
            color: var(--muted);
            text-align: center;
            flex: 0 0 auto;
        }

        /* Ad banner styles - full width at bottom when shown */
        .ad-banner-wrapper {
            position: fixed;
            left: 0;
            right: 0;
            bottom: -100%; /* hidden by default off-screen */
            width: 100%;
            z-index: 9999;
            background: transparent;
            display: none;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }

        .ad-banner-wrapper .ad-inner {
            position: relative;
            width: 100%;
            max-width: none;
        }

        .ad-banner-wrapper img {
            width: 100%;
            height: auto;
            display: block;
            cursor: pointer;
        }

        .ad-close-button {
            position: absolute;
            top: 8px;
            right: 10px;
            font-size: 20px;
            color: #fff;
            background: rgba(0,0,0,0.5);
            border: none;
            border-radius: 50%;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
        }

        @media (max-width: 600px) {
            header { font-size: 16px; }
            .game-container { border-radius: 6px; }
            .ad-close-button { width: 30px; height: 30px; font-size: 18px; }
        }
        /* Desktop: center ads and make them 25% width of viewport */
        @media (min-width: 769px) {
            .ad-banner-wrapper {
                /* allow JS to position centrally; ensure no full-width stretching */
                left: 50%;
                right: auto;
                width: auto;
                display: none;
                transform: translateX(-50%);
            }
            .ad-banner-wrapper .ad-inner {
                width: 25vw; /* 25% of viewport width */
            }
            .ad-banner-wrapper img {
                border-radius: 8px;
            }
        }
    </style>
</head>
	<body>

		<header>
			🎮 SOCCER
		</header>

		<!-- Top Google Ad (replace client and slot with your values) -->
		<div id="topAdWrapper" aria-hidden="false">
			<!-- Google AdSense loader (replace ca-pub-REPLACE_WITH_YOUR_PUB_ID) -->
			<script async="" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3940256099942544" crossorigin="anonymous"></script>
			<!-- Responsive ad unit -->
			<ins class="adsbygoogle" style="display:block; text-align:center;" data-ad-client="ca-pub-3940256099942544" data-ad-slot="6300978111" data-ad-format="auto" data-full-width-responsive="true"></ins>
			<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
		</div>

		<div class="game-wrapper">
			<div class="game-container">
           <iframe src="https://html5.gamedistribution.com/fc1c68fa04af4e0785a0fd3a12a08783/?gd_sdk_referrer_url=https://zoneunfolded.onrender.com" width="750" height="1334" scrolling="none" frameborder="0"></iframe>
			</div>
		</div>
		<div class="game-wrapper">
			<div class="game-container">
         <iframe src="https://html5.gamedistribution.com/22c23c982349439294e9a3d0d55b7a76/?gd_sdk_referrer_url=https://oneunfolded.onrender.com" width="900" height="600" scrolling="none" frameborder="0"></iframe>
			</div>
		</div>
		<div class="game-wrapper">
			<div class="game-container">
            <iframe src="https://html5.gamedistribution.com/0ea7b7e7316a47c38ac5c98ddd42ec4a/?gd_sdk_referrer_url=https://www.example.com/games/{game-path}" width="800" height="600" scrolling="none" frameborder="0"></iframe>
			</div>
		</div>
       <br />
        <br />
        <br />
        <br />
        <br />
        <br />
		<!-- Banner 1 (pict1) -->
		<div id="adBannerWrapper1" class="ad-banner-wrapper" aria-hidden="true">
			<div class="ad-inner">
				<img id="adImage1" src="pict/pict1.gif" alt="ad1" />
				<button id="adCloseBtn1" class="ad-close-button" aria-label="close">&times;</button>
			</div>
		</div>

		<!-- Banner 2 (pict2) -->
		<div id="adBannerWrapper2" class="ad-banner-wrapper" aria-hidden="true">
			<div class="ad-inner">
				<img id="adImage2" src="pict/pict2.gif" alt="ad2" />
			</div>
		</div>

		<footer>
			© 2026
		</footer>

		<script src="frontend.js"></script>

	</body>
</html>
