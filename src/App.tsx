import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import Toolbar from './components/Toolbar/Toolbar';
import Sidebar from './components/Sidebar/Sidebar';
import Viewer from './components/Viewer/Viewer';
import Modeler from './components/Modeler/Modeler';
import Converter from './components/Converter/Converter';
import Tools from './components/Tools/Tools';
import PasswordAuth from './components/Auth/PasswordAuth';
import PropertiesPanel from './components/Properties/PropertiesPanel';
import { getDeviceInfo, shouldUseViewerMode, logDeviceInfo } from './utils/deviceDetection';
import './App.css';

function App() {
  const mode = useAppStore((state) => state.mode);
  const setMode = useAppStore((state) => state.setMode);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 認証状態の確認
  useEffect(() => {
    const authStatus = localStorage.getItem('cad_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // デバイス検出とモバイル最適化
  useEffect(() => {
    const deviceInfo = getDeviceInfo();

    // デバッグ用にデバイス情報を出力
    logDeviceInfo();

    // モバイルデバイス（特にiPhone）の場合、ビューワーモードに自動設定
    if (shouldUseViewerMode()) {
      setMode('viewer');
      console.log('Mobile device detected: Automatically switched to Viewer mode');

      // モバイルデバイス向けのメッセージを表示
      if (deviceInfo.isIPhone) {
        console.log('📱 iPhone detected - Optimized for viewing 3D CAD files');
      } else if (deviceInfo.isAndroid) {
        console.log('📱 Android device detected - Optimized for viewing 3D CAD files');
      }
    }
  }, [setMode]);

  const renderContent = () => {
    switch (mode) {
      case 'viewer':
        return <Viewer />;
      case 'modeler':
        return <Modeler />;
      case 'converter':
        return <Converter />;
      case 'tools':
        return <Tools />;
      default:
        return <Viewer />;
    }
  };

  // 認証されていない場合はログイン画面を表示
  if (!isAuthenticated) {
    return <PasswordAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const deviceInfo = getDeviceInfo();
  const isMobileDevice = deviceInfo.isMobile && !deviceInfo.isTablet;

  return (
    <div className={`app ${isMobileDevice ? 'mobile-mode' : ''}`}>
      {/* モバイルデバイスの場合はツールバーを簡略化 */}
      {!isMobileDevice && <Toolbar />}
      {isMobileDevice && (
        <div className="mobile-toolbar">
          <span className="mobile-title">📱 3D CAD Viewer</span>
        </div>
      )}
      <div className="app-content">
        {/* モバイルデバイスの場合はサイドバーを非表示 */}
        {!isMobileDevice && <Sidebar />}
        <div className="main-content">
          {renderContent()}
        </div>
        {/* プロパティパネル（モデラーモードでのみ表示） */}
        {!isMobileDevice && mode === 'modeler' && <PropertiesPanel />}
      </div>
    </div>
  );
}

export default App;
