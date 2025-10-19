// GTM用のユーティリティ関数
export const sendGTMEvent = (eventName: string, data: Record<string, any>) => {
  // ブラウザ環境でのみ実行
  if (typeof window === 'undefined') {
    console.warn('GTM: Server-side environment, skipping event');
    return;
  }

  // dataLayerの初期化を確認
  if (!window.dataLayer) {
    window.dataLayer = [];
    console.warn('GTM: dataLayer was not initialized, creating new one');
  }

  // イベントデータを送信
  const eventData = {
    event: eventName,
    ...data
  };

  try {
    window.dataLayer.push(eventData);
    console.log('🎯 GTM Event Sent:', eventData);
  } catch (error) {
    console.error('❌ GTM Event Error:', error);
  }
};

// ピンクリックイベント専用関数
export const sendPinClickEvent = (pinName: string) => {
  console.log('📍 Sending pin click event for:', pinName);
  sendGTMEvent('pin_click', {
    pinName: pinName
  });
};

// アフィリエイトリンククリックイベント専用関数
export const sendAffiliateLinkClickEvent = (linkUrl: string, locationName: string, pinTitle: string, linkType: string) => {
  console.log('🔗 Sending affiliate link click event:', { linkUrl, locationName, pinTitle, linkType });
  sendGTMEvent('affiliate_link_click', {
    link_url: linkUrl,
    location_name: locationName,
    pin_title: pinTitle,
    link_type: linkType
  });
};