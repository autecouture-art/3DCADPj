import { useAppStore } from '../../store/useAppStore';
import './Toolbar.css';

const Toolbar = () => {
  const { mode, setMode, toggleGrid, toggleAxes, clearScene } = useAppStore();

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h1 className="toolbar-title">3D CAD Suite</h1>
      </div>

      <div className="toolbar-section">
        <button
          className={`toolbar-btn ${mode === 'viewer' ? 'active' : ''}`}
          onClick={() => setMode('viewer')}
          title="3D Viewer"
        >
          👁️ ビューアー
        </button>
        <button
          className={`toolbar-btn ${mode === 'modeler' ? 'active' : ''}`}
          onClick={() => setMode('modeler')}
          title="3D Modeler"
        >
          🔨 モデラー
        </button>
        <button
          className={`toolbar-btn ${mode === 'converter' ? 'active' : ''}`}
          onClick={() => setMode('converter')}
          title="File Converter"
        >
          🔄 コンバーター
        </button>
        <button
          className={`toolbar-btn ${mode === 'tools' ? 'active' : ''}`}
          onClick={() => setMode('tools')}
          title="CAD Tools"
        >
          🛠️ ツール
        </button>
      </div>

      <div className="toolbar-section">
        <button className="toolbar-btn" onClick={toggleGrid} title="Toggle Grid">
          📐 グリッド
        </button>
        <button className="toolbar-btn" onClick={toggleAxes} title="Toggle Axes">
          📏 軸
        </button>
        <button className="toolbar-btn danger" onClick={clearScene} title="Clear Scene">
          🗑️ クリア
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
