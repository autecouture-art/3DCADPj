import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import './PropertiesPanel.css';

const PropertiesPanel = () => {
  const { objects, selectedObjectId, updateObject } = useAppStore();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 });
  const [color, setColor] = useState('#4CAF50');
  const [name, setName] = useState('');

  useEffect(() => {
    if (selectedObject) {
      setPosition({
        x: selectedObject.position[0],
        y: selectedObject.position[1],
        z: selectedObject.position[2]
      });
      setRotation({
        x: (selectedObject.rotation[0] * 180) / Math.PI,
        y: (selectedObject.rotation[1] * 180) / Math.PI,
        z: (selectedObject.rotation[2] * 180) / Math.PI
      });
      setScale({
        x: selectedObject.scale[0],
        y: selectedObject.scale[1],
        z: selectedObject.scale[2]
      });
      setColor(selectedObject.color);
      setName(selectedObject.name);
    }
  }, [selectedObject]);

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newPosition = { ...position, [axis]: numValue };
    setPosition(newPosition);

    if (selectedObjectId) {
      updateObject(selectedObjectId, {
        position: [newPosition.x, newPosition.y, newPosition.z]
      });
    }
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newRotation = { ...rotation, [axis]: numValue };
    setRotation(newRotation);

    if (selectedObjectId) {
      updateObject(selectedObjectId, {
        rotation: [
          (newRotation.x * Math.PI) / 180,
          (newRotation.y * Math.PI) / 180,
          (newRotation.z * Math.PI) / 180
        ]
      });
    }
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 1;
    const newScale = { ...scale, [axis]: numValue };
    setScale(newScale);

    if (selectedObjectId) {
      updateObject(selectedObjectId, {
        scale: [newScale.x, newScale.y, newScale.z]
      });
    }
  };

  const handleUniformScale = (value: string) => {
    const numValue = parseFloat(value) || 1;
    setScale({ x: numValue, y: numValue, z: numValue });

    if (selectedObjectId) {
      updateObject(selectedObjectId, {
        scale: [numValue, numValue, numValue]
      });
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (selectedObjectId) {
      updateObject(selectedObjectId, { color: newColor });
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (selectedObjectId) {
      updateObject(selectedObjectId, { name: newName });
    }
  };

  const handleReset = () => {
    if (selectedObjectId) {
      updateObject(selectedObjectId, {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      });
      setPosition({ x: 0, y: 0, z: 0 });
      setRotation({ x: 0, y: 0, z: 0 });
      setScale({ x: 1, y: 1, z: 1 });
    }
  };

  if (!selectedObject) {
    return (
      <div className="properties-panel">
        <div className="panel-header">
          <h3>プロパティ</h3>
        </div>
        <div className="panel-empty">
          <p>オブジェクトを選択してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3>プロパティ</h3>
      </div>

      <div className="panel-content">
        {/* 名前 */}
        <div className="property-section">
          <label className="property-label">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="property-input"
          />
        </div>

        {/* 位置 */}
        <div className="property-section">
          <label className="property-label">位置 (X, Y, Z)</label>
          <div className="property-row">
            <div className="property-input-group">
              <span className="axis-label">X</span>
              <input
                type="number"
                step="0.1"
                value={position.x.toFixed(2)}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="property-input-small"
              />
            </div>
            <div className="property-input-group">
              <span className="axis-label">Y</span>
              <input
                type="number"
                step="0.1"
                value={position.y.toFixed(2)}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="property-input-small"
              />
            </div>
            <div className="property-input-group">
              <span className="axis-label">Z</span>
              <input
                type="number"
                step="0.1"
                value={position.z.toFixed(2)}
                onChange={(e) => handlePositionChange('z', e.target.value)}
                className="property-input-small"
              />
            </div>
          </div>
        </div>

        {/* 回転 */}
        <div className="property-section">
          <label className="property-label">回転 (度)</label>
          <div className="property-row">
            <div className="property-input-group">
              <span className="axis-label">X</span>
              <input
                type="number"
                step="1"
                value={rotation.x.toFixed(1)}
                onChange={(e) => handleRotationChange('x', e.target.value)}
                className="property-input-small"
              />
            </div>
            <div className="property-input-group">
              <span className="axis-label">Y</span>
              <input
                type="number"
                step="1"
                value={rotation.y.toFixed(1)}
                onChange={(e) => handleRotationChange('y', e.target.value)}
                className="property-input-small"
              />
            </div>
            <div className="property-input-group">
              <span className="axis-label">Z</span>
              <input
                type="number"
                step="1"
                value={rotation.z.toFixed(1)}
                onChange={(e) => handleRotationChange('z', e.target.value)}
                className="property-input-small"
              />
            </div>
          </div>
        </div>

        {/* スケール */}
        <div className="property-section">
          <label className="property-label">スケール</label>
          <div className="property-row">
            <div className="property-input-group">
              <span className="axis-label">統一</span>
              <input
                type="number"
                step="0.1"
                min="0.01"
                value={scale.x.toFixed(2)}
                onChange={(e) => handleUniformScale(e.target.value)}
                className="property-input-small"
              />
            </div>
          </div>
          <div className="property-row">
            <div className="property-input-group">
              <span className="axis-label">X</span>
              <input
                type="number"
                step="0.1"
                min="0.01"
                value={scale.x.toFixed(2)}
                onChange={(e) => handleScaleChange('x', e.target.value)}
                className="property-input-small"
              />
            </div>
            <div className="property-input-group">
              <span className="axis-label">Y</span>
              <input
                type="number"
                step="0.1"
                min="0.01"
                value={scale.y.toFixed(2)}
                onChange={(e) => handleScaleChange('y', e.target.value)}
                className="property-input-small"
              />
            </div>
            <div className="property-input-group">
              <span className="axis-label">Z</span>
              <input
                type="number"
                step="0.1"
                min="0.01"
                value={scale.z.toFixed(2)}
                onChange={(e) => handleScaleChange('z', e.target.value)}
                className="property-input-small"
              />
            </div>
          </div>
        </div>

        {/* 色 */}
        <div className="property-section">
          <label className="property-label">色</label>
          <div className="color-picker-group">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="color-picker"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="color-input"
            />
          </div>
        </div>

        {/* アクション */}
        <div className="property-actions">
          <button className="reset-btn" onClick={handleReset}>
            🔄 リセット
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
