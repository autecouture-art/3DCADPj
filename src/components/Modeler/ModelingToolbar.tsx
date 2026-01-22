import { useAppStore } from '../../store/useAppStore';
import { geometryCreators } from '../../utils/geometryCreators';
import './ModelingToolbar.css';

const ModelingToolbar = () => {
  const { addObject } = useAppStore();

  const createGeometry = (type: keyof typeof geometryCreators) => {
    const newObject = geometryCreators[type]();

    // ランダムな位置に配置
    newObject.position = [
      Math.random() * 4 - 2,
      Math.random() * 2 + 1,
      Math.random() * 4 - 2
    ];

    addObject(newObject);
  };

  return (
    <div className="modeling-toolbar">
      <div className="tool-section">
        <h3>基本図形</h3>
        <div className="tool-buttons">
          <button className="tool-btn" onClick={() => createGeometry('cube')} title="立方体">
            📦 立方体
          </button>
          <button className="tool-btn" onClick={() => createGeometry('sphere')} title="球">
            ⚪ 球
          </button>
          <button className="tool-btn" onClick={() => createGeometry('cylinder')} title="円柱">
            🥫 円柱
          </button>
          <button className="tool-btn" onClick={() => createGeometry('cone')} title="円錐">
            🔺 円錐
          </button>
          <button className="tool-btn" onClick={() => createGeometry('torus')} title="トーラス">
            🍩 トーラス
          </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>CAD操作</h3>
        <div className="tool-buttons">
          <button className="tool-btn" onClick={() => createGeometry('extrusion')} title="押し出し">
            ⬆️ 押し出し
          </button>
          <button className="tool-btn" onClick={() => createGeometry('lathe')} title="回転">
            🔄 回転体
          </button>
          <button className="tool-btn" title="ブーリアン結合" disabled>
            ➕ 結合
          </button>
          <button className="tool-btn" title="ブーリアン減算" disabled>
            ➖ 減算
          </button>
          <button className="tool-btn" title="フィレット" disabled>
            ◀️ フィレット
          </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>スケッチ</h3>
        <div className="tool-buttons">
          <button className="tool-btn" onClick={() => createGeometry('line')} title="線">
            📏 線
          </button>
          <button className="tool-btn" onClick={() => createGeometry('circle')} title="円">
            ⭕ 円
          </button>
          <button className="tool-btn" onClick={() => createGeometry('rectangle')} title="矩形">
            ▭ 矩形
          </button>
          <button className="tool-btn" onClick={() => createGeometry('polygon')} title="ポリゴン">
            ⬡ ポリゴン
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelingToolbar;
