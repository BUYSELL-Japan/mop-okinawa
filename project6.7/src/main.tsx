import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// PWAのインストールプロンプトを保存
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // インストールプロンプトが利用可能であることを示すUIを表示
  const installBanner = document.createElement('div');
  installBanner.id = 'pwa-install-banner';
  installBanner.className = 'fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 flex justify-between items-center z-[9999]';
  installBanner.innerHTML = `
    <div class="flex-1">
      <p class="font-medium">ホーム画面に追加して、より快適に使用できます</p>
      <p class="text-sm opacity-90">オフラインでも使用可能になります</p>
    </div>
    <div class="flex gap-2">
      <button id="pwa-install-later" class="px-4 py-2 text-sm">後で</button>
      <button id="pwa-install-button" class="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium">インストール</button>
    </div>
  `;

  document.body.appendChild(installBanner);

  // インストールボタンのイベントリスナー
  document.getElementById('pwa-install-button')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      installBanner.remove();
    }
  });

  // 「後で」ボタンのイベントリスナー
  document.getElementById('pwa-install-later')?.addEventListener('click', () => {
    installBanner.remove();
  });
});

// Register service worker with auto-update
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // アプリの更新が必要な場合のUI
    const updateBanner = document.createElement('div');
    updateBanner.className = 'fixed bottom-0 left-0 right-0 bg-green-600 text-white p-4 flex justify-between items-center z-[9999]';
    updateBanner.innerHTML = `
      <p class="flex-1">新しいバージョンが利用可能です</p>
      <button id="pwa-update-button" class="px-4 py-2 bg-white text-green-600 rounded-lg text-sm font-medium">更新する</button>
    `;
    document.body.appendChild(updateBanner);

    document.getElementById('pwa-update-button')?.addEventListener('click', () => {
      updateSW();
      updateBanner.remove();
    });
  },
  onOfflineReady() {
    console.log('アプリケーションがオフラインで利用可能になりました');
    // オフライン準備完了時の通知
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]';
    notification.textContent = 'オフラインでも使用できるようになりました';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  },
  onRegistered(swUrl, r) {
    console.log('Service Worker registered:', swUrl);
    
    // 定期的な更新チェック
    setInterval(async () => {
      if (r) {
        try {
          await r.update();
          console.log('Service Worker update check completed');
        } catch (err) {
          console.error('Service Worker update failed:', err);
        }
      }
    }, 60 * 60 * 1000); // 1時間ごと
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);