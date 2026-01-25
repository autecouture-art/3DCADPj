import { useAppStore } from '../../store/useAppStore';
import './PlaneSelector.css';

type PlaneType = 'front' | 'top' | 'right';

const PlaneSelector = () => {
  const { isSketchMode, enterSketchMode } = useAppStore();

  const handlePlaneSelect = (plane: PlaneType) => {
    enterSketchMode(plane);
  };

  // すでにスケッチモードの場合は何も表示しない
  if (isSketchMode) {
    return null;
  }

  return (
    <div className="plane-selector">
      <div className="plane-selector-header">
        <h3>📐 スケッチを開始</h3>
        <p>スケッチ平面を選択してください</p>
      </div>

      <div className="plane-buttons">
        <button
          className="plane-btn front-plane"
          onClick={() => handlePlaneSelect('front')}
          title="正面（Front Plane）"
        >
          <div className="plane-icon">
            <svg width="60" height="60" viewBox="0 0 60 60">
              {/* 正面平面のアイコン */}
              <rect x="15" y="15" width="30" height="30" fill="none" stroke="#4CAF50" strokeWidth="2"/>
              <line x1="30" y1="15" x2="30" y2="45" stroke="#4CAF50" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="15" y1="30" x2="45" y2="30" stroke="#4CAF50" strokeWidth="1" strokeDasharray="2,2"/>
            </svg>
          </div>
          <span className="plane-name">正面</span>
          <span className="plane-subtitle">Front Plane</span>
        </button>

        <button
          className="plane-btn top-plane"
          onClick={() => handlePlaneSelect('top')}
          title="上面（Top Plane）"
        >
          <div className="plane-icon">
            <svg width="60" height="60" viewBox="0 0 60 60">
              {/* 上面平面のアイコン */}
              <ellipse cx="30" cy="30" rx="20" ry="8" fill="none" stroke="#2196F3" strokeWidth="2"/>
              <line x1="30" y1="22" x2="30" y2="38" stroke="#2196F3" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="10" y1="30" x2="50" y2="30" stroke="#2196F3" strokeWidth="1" strokeDasharray="2,2"/>
            </svg>
          </div>
          <span className="plane-name">上面</span>
          <span className="plane-subtitle">Top Plane</span>
        </button>

        <button
          className="plane-btn right-plane"
          onClick={() => handlePlaneSelect('right')}
          title="右側面（Right Plane）"
        >
          <div className="plane-icon">
            <svg width="60" height="60" viewBox="0 0 60 60">
              {/* 右側面平面のアイコン */}
              <path d="M 20 15 L 40 20 L 40 40 L 20 45 Z" fill="none" stroke="#FF9800" strokeWidth="2"/>
              <line x1="30" y1="17.5" x2="30" y2="42.5" stroke="#FF9800" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="20" y1="30" x2="40" y2="30" stroke="#FF9800" strokeWidth="1" strokeDasharray="2,2"/>
            </svg>
          </div>
          <span className="plane-name">右側面</span>
          <span className="plane-subtitle">Right Plane</span>
        </button>
      </div>

      <div className="plane-selector-footer">
        <p className="hint-text">💡 ヒント: スケッチ平面を選択すると、2D描画モードに入ります</p>
      </div>
    </div>
  );
};

export default PlaneSelector;
