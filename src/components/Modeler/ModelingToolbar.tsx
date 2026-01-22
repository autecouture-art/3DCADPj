import { useAppStore } from '../../store/useAppStore';
import './ModelingToolbar.css';

const ModelingToolbar = () => {
  const { addObject } = useAppStore();

  const createPrimitive = (type: string) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newObject = {
      id: `obj-${Date.now()}`,
      name: `${type}-${Date.now()}`,
      type: 'mesh' as const,
      geometry: {
        vertices: [],
        indices: []
      },
      position: [
        Math.random() * 4 - 2,
        Math.random() * 2 + 1,
        Math.random() * 4 - 2
      ] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      visible: true,
      color: randomColor
    };

    addObject(newObject);
  };

  return (
    <div className="modeling-toolbar">
      <div className="tool-section">
        <h3>基本図形</h3>
        <div className="tool-buttons">
          <button className="tool-btn" onClick={() => createPrimitive('Box')} title="立方体">
            📦 立方体
          </button>
          <button className="tool-btn" onClick={() => createPrimitive('Sphere')} title="球">
            ⚪ 球
          </button>
          <button className="tool-btn" onClick={() => createPrimitive('Cylinder')} title="円柱">
            🥫 円柱
          </button>
          <button className="tool-btn" onClick={() => createPrimitive('Cone')} title="円錐">
            🔺 円錐
          </button>
          <button className="tool-btn" onClick={() => createPrimitive('Torus')} title="トーラス">
            🍩 トーラス
          </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>CAD操作</h3>
        <div className="tool-buttons">
          <button className="tool-btn" title="押し出し">
            ⬆️ 押し出し
          </button>
          <button className="tool-btn" title="回転">
            🔄 回転体
          </button>
          <button className="tool-btn" title="ブーリアン結合">
            ➕ 結合
          </button>
          <button className="tool-btn" title="ブーリアン減算">
            ➖ 減算
          </button>
          <button className="tool-btn" title="フィレット">
            ◀️ フィレット
          </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>スケッチ</h3>
        <div className="tool-buttons">
          <button className="tool-btn" title="線">
            📏 線
          </button>
          <button className="tool-btn" title="円">
            ⭕ 円
          </button>
          <button className="tool-btn" title="矩形">
            ▭ 矩形
          </button>
          <button className="tool-btn" title="ポリゴン">
            ⬡ ポリゴン
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelingToolbar;
