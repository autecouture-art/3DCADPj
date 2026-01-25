import './SketchToolbar.css';

type SketchTool = 'select' | 'line' | 'rectangle' | 'circle';

interface SketchToolbarProps {
  currentTool: SketchTool;
  onToolChange: (tool: SketchTool) => void;
  onExit: () => void;
  onExtrude: () => void;
  planeName: string;
}

const SketchToolbar = ({ currentTool, onToolChange, onExit, onExtrude, planeName }: SketchToolbarProps) => {
  return (
    <div className="sketch-toolbar">
      <div className="sketch-toolbar-left">
        <div className="plane-indicator">
          <span className="plane-icon">📐</span>
          <span className="plane-name">{planeName}</span>
        </div>
      </div>

      <div className="sketch-toolbar-center">
        <div className="sketch-tools">
          <button
            className={`sketch-tool-btn ${currentTool === 'select' ? 'active' : ''}`}
            onClick={() => onToolChange('select')}
            title="選択ツール"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M3 3 L10 20 L13 13 L20 10 Z" fill="currentColor" />
            </svg>
            <span>選択</span>
          </button>

          <button
            className={`sketch-tool-btn ${currentTool === 'line' ? 'active' : ''}`}
            onClick={() => onToolChange('line')}
            title="線分"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>線分</span>
          </button>

          <button
            className={`sketch-tool-btn ${currentTool === 'rectangle' ? 'active' : ''}`}
            onClick={() => onToolChange('rectangle')}
            title="矩形"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>矩形</span>
          </button>

          <button
            className={`sketch-tool-btn ${currentTool === 'circle' ? 'active' : ''}`}
            onClick={() => onToolChange('circle')}
            title="円"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>円</span>
          </button>
        </div>
      </div>

      <div className="sketch-toolbar-right">
        <button
          className="extrude-btn"
          onClick={onExtrude}
          title="押し出しボス/ベース"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <rect x="4" y="8" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M14 8 L20 4 L20 14 L14 18" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="14" y1="8" x2="20" y2="4" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>押し出し</span>
        </button>

        <button
          className="exit-sketch-btn"
          onClick={onExit}
          title="スケッチを終了"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M18 6 L6 18 M6 6 L18 18" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>スケッチ終了</span>
        </button>
      </div>
    </div>
  );
};

export default SketchToolbar;
