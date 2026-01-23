/**
 * Device Detection Utility
 *
 * デバイスの種類を検出し、モバイルデバイス向けに
 * アプリケーションの動作を最適化するためのユーティリティ
 */

/**
 * デバイス情報を保持する型
 */
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isIPhone: boolean;
  isIPad: boolean;
  isDesktop: boolean;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
}

/**
 * iOSデバイスかどうかを判定
 */
export const isIOS = (): boolean => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
};

/**
 * iPhoneかどうかを判定
 */
export const isIPhone = (): boolean => {
  const ua = navigator.userAgent;
  return /iPhone/.test(ua) && !(window as any).MSStream;
};

/**
 * iPadかどうかを判定
 */
export const isIPad = (): boolean => {
  const ua = navigator.userAgent;
  // iOS 13+のiPadはデスクトップとして識別される場合があるため、タッチポイントもチェック
  return (
    /iPad/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) && !(window as any).MSStream;
};

/**
 * Androidデバイスかどうかを判定
 */
export const isAndroid = (): boolean => {
  const ua = navigator.userAgent;
  return /Android/.test(ua);
};

/**
 * タブレットかどうかを判定
 */
export const isTablet = (): boolean => {
  const ua = navigator.userAgent;
  return (
    isIPad() ||
    (/Android/.test(ua) && !/Mobile/.test(ua)) ||
    /Tablet/.test(ua)
  );
};

/**
 * モバイルデバイスかどうかを判定
 */
export const isMobile = (): boolean => {
  // 画面幅による判定も組み合わせる
  const screenWidth = window.innerWidth;
  const isMobileWidth = screenWidth <= 768;

  // User Agentによる判定
  const ua = navigator.userAgent;
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // タッチ対応かどうかもチェック
  const hasTouchScreen =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;

  return isMobileUA || (isMobileWidth && hasTouchScreen);
};

/**
 * デスクトップかどうかを判定
 */
export const isDesktop = (): boolean => {
  return !isMobile();
};

/**
 * 現在のデバイス情報を取得
 */
export const getDeviceInfo = (): DeviceInfo => {
  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isIPhone: isIPhone(),
    isIPad: isIPad(),
    isDesktop: isDesktop(),
    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  };
};

/**
 * デバイス情報をコンソールに出力（デバッグ用）
 */
export const logDeviceInfo = (): void => {
  const info = getDeviceInfo();
  console.log('Device Information:', {
    Type: info.isMobile
      ? info.isTablet
        ? 'Tablet'
        : 'Mobile'
      : 'Desktop',
    Platform: info.isIOS
      ? 'iOS'
      : info.isAndroid
      ? 'Android'
      : 'Other',
    Device: info.isIPhone
      ? 'iPhone'
      : info.isIPad
      ? 'iPad'
      : 'Unknown',
    Screen: `${info.screenWidth}x${info.screenHeight}`,
    UserAgent: info.userAgent,
  });
};

/**
 * ビューワーモード専用デバイスかどうかを判定
 * iPhoneやAndroidスマートフォンはビューワーモードに最適
 */
export const shouldUseViewerMode = (): boolean => {
  return isMobile() && !isTablet();
};

/**
 * タッチ操作が可能かどうかを判定
 */
export const hasTouchSupport = (): boolean => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};
