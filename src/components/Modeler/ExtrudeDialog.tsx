import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import * as THREE from 'three';
import { LineEntity, RectangleEntity, CircleEntity } from '../../types/sketch';
import './ExtrudeDialog.css';

interface ExtrudeDialogProps {
  onClose: () => void;
}

const ExtrudeDialog = ({ onClose }: ExtrudeDialogProps) => {
  const { sketchEntities, selectedPlane, exitSketchMode, addObject } = useAppStore();
  const [extrudeDepth, setExtrudeDepth] = useState(10);
  const [extrudeDirection, setExtrudeDirection] = useState<'positive' | 'negative'>('positive');

  const handleExtrude = () => {
    if (sketchEntities.length === 0) {
      alert('スケッチにエンティティがありません');
      return;
    }

    // スケッチから3D形状を生成
    const geometry = createExtrudedGeometry();

    if (!geometry) {
      alert('この形状は押し出しできません');
      return;
    }

    // 3Dオブジェクトとして追加
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: 0x4CAF50,
        metalness: 0.3,
        roughness: 0.7
      })
    );

    // BufferGeometryからverticesとindicesを抽出
    const positionAttribute = geometry.getAttribute('position');
    const vertices = Array.from(positionAttribute.array);
    const indexAttribute = geometry.getIndex();
    const indices = indexAttribute ? Array.from(indexAttribute.array) : [];

    const newObject = {
      id: `object-${Date.now()}`,
      name: `押し出し-${Date.now()}`,
      type: 'mesh' as const,
      geometry: {
        vertices: vertices,
        indices: indices
      },
      position: [0, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      visible: true,
      color: '#4CAF50',
      mesh: mesh
    };

    addObject(newObject);
    exitSketchMode();
    onClose();
  };

  const createExtrudedGeometry = (): THREE.BufferGeometry | null => {
    // 2Dシェイプを作成
    const shape = new THREE.Shape();

    // 矩形の押し出し
    const rectangles = sketchEntities.filter(e => e.type === 'rectangle') as RectangleEntity[];
    if (rectangles.length > 0) {
      const rect = rectangles[0];
      const width = Math.abs(rect.end.x - rect.start.x) / 50; // スケール調整
      const height = Math.abs(rect.end.y - rect.start.y) / 50;

      shape.moveTo(0, 0);
      shape.lineTo(width, 0);
      shape.lineTo(width, height);
      shape.lineTo(0, height);
      shape.lineTo(0, 0);

      const depth = extrudeDepth / 10;
      const extrudeSettings = {
        depth: extrudeDirection === 'positive' ? depth : -depth,
        bevelEnabled: false
      };

      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    // 円の押し出し
    const circles = sketchEntities.filter(e => e.type === 'circle') as CircleEntity[];
    if (circles.length > 0) {
      const circle = circles[0];
      const radius = circle.radius / 50; // スケール調整

      const circleShape = new THREE.Shape();
      circleShape.absarc(0, 0, radius, 0, Math.PI * 2, false);

      const depth = extrudeDepth / 10;
      const extrudeSettings = {
        depth: extrudeDirection === 'positive' ? depth : -depth,
        bevelEnabled: false
      };

      return new THREE.ExtrudeGeometry(circleShape, extrudeSettings);
    }

    // 線分から閉じたパスを作成
    const lines = sketchEntities.filter(e => e.type === 'line') as LineEntity[];
    if (lines.length >= 3) {
      // 簡易的な実装: 最初の線分から開始
      const firstLine = lines[0];
      shape.moveTo(firstLine.start.x / 50, firstLine.start.y / 50);

      lines.forEach(line => {
        shape.lineTo(line.end.x / 50, line.end.y / 50);
      });

      const depth = extrudeDepth / 10;
      const extrudeSettings = {
        depth: extrudeDirection === 'positive' ? depth : -depth,
        bevelEnabled: false
      };

      try {
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
      } catch (e) {
        console.error('押し出しエラー:', e);
        return null;
      }
    }

    return null;
  };

  const getPlaneName = () => {
    switch (selectedPlane) {
      case 'front': return '正面 (Front Plane)';
      case 'top': return '上面 (Top Plane)';
      case 'right': return '右側面 (Right Plane)';
      default: return '';
    }
  };

  return (
    <div className="extrude-dialog-overlay">
      <div className="extrude-dialog">
        <div className="dialog-header">
          <h3>🔨 押し出しボス/ベース</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="dialog-content">
          <div className="sketch-info-section">
            <div className="info-row">
              <span className="label">スケッチ平面:</span>
              <span className="value">{getPlaneName()}</span>
            </div>
            <div className="info-row">
              <span className="label">エンティティ数:</span>
              <span className="value">{sketchEntities.length}</span>
            </div>
          </div>

          <div className="extrude-settings">
            <div className="setting-group">
              <label>押し出し深さ</label>
              <div className="depth-input-group">
                <input
                  type="number"
                  value={extrudeDepth}
                  onChange={(e) => setExtrudeDepth(parseFloat(e.target.value))}
                  min="0.1"
                  step="0.5"
                />
                <span className="unit">mm</span>
              </div>
              <input
                type="range"
                value={extrudeDepth}
                onChange={(e) => setExtrudeDepth(parseFloat(e.target.value))}
                min="0.1"
                max="50"
                step="0.5"
                className="depth-slider"
              />
            </div>

            <div className="setting-group">
              <label>押し出し方向</label>
              <div className="direction-buttons">
                <button
                  className={`direction-btn ${extrudeDirection === 'positive' ? 'active' : ''}`}
                  onClick={() => setExtrudeDirection('positive')}
                >
                  ⬆ 正方向
                </button>
                <button
                  className={`direction-btn ${extrudeDirection === 'negative' ? 'active' : ''}`}
                  onClick={() => setExtrudeDirection('negative')}
                >
                  ⬇ 負方向
                </button>
              </div>
            </div>
          </div>

          <div className="preview-section">
            <p className="preview-text">
              プレビュー: {extrudeDepth}mm {extrudeDirection === 'positive' ? '正方向' : '負方向'}に押し出します
            </p>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="cancel-btn" onClick={onClose}>
            キャンセル
          </button>
          <button className="extrude-btn" onClick={handleExtrude}>
            ✓ 押し出し
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtrudeDialog;
