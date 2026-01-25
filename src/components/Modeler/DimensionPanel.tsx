import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { DimensionConstraint, LineEntity, RectangleEntity, CircleEntity } from '../../types/sketch';
import './DimensionPanel.css';

const DimensionPanel = () => {
  const {
    selectedEntityId,
    sketchEntities,
    dimensionConstraints,
    addDimensionConstraint,
    updateDimensionConstraint,
    removeDimensionConstraint
  } = useAppStore();

  const [editingDimensionId, setEditingDimensionId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const selectedEntity = sketchEntities.find(e => e.id === selectedEntityId);
  const entityDimensions = dimensionConstraints.filter(d => d.entityId === selectedEntityId);

  if (!selectedEntity) {
    return (
      <div className="dimension-panel">
        <div className="panel-header">
          <h3>📏 寸法</h3>
        </div>
        <div className="panel-content">
          <p className="no-selection">エンティティを選択してください</p>
        </div>
      </div>
    );
  }

  const handleAddDimension = () => {
    if (!selectedEntity) return;

    let dimensionType: DimensionConstraint['type'] = 'length';
    let defaultValue = 0;
    let label = '';

    if (selectedEntity.type === 'line') {
      const lineEntity = selectedEntity as LineEntity;
      dimensionType = 'length';
      const dx = lineEntity.end.x - lineEntity.start.x;
      const dy = lineEntity.end.y - lineEntity.start.y;
      defaultValue = Math.sqrt(dx * dx + dy * dy);
      label = `L${entityDimensions.length + 1}`;
    } else if (selectedEntity.type === 'circle') {
      const circleEntity = selectedEntity as CircleEntity;
      dimensionType = 'radius';
      defaultValue = circleEntity.radius;
      label = `R${entityDimensions.length + 1}`;
    } else if (selectedEntity.type === 'rectangle') {
      const rectEntity = selectedEntity as RectangleEntity;
      // 矩形の場合、幅を寸法として追加
      dimensionType = 'length';
      defaultValue = Math.abs(rectEntity.end.x - rectEntity.start.x);
      label = `W${entityDimensions.length + 1}`;
    }

    const newDimension: DimensionConstraint = {
      id: `dim-${Date.now()}-${Math.random()}`,
      type: dimensionType,
      entityId: selectedEntity.id,
      value: defaultValue,
      label
    };

    addDimensionConstraint(newDimension);
  };

  const handleEditDimension = (dimension: DimensionConstraint) => {
    setEditingDimensionId(dimension.id);
    setEditValue(dimension.value.toFixed(2));
  };

  const handleSaveDimension = (dimensionId: string) => {
    const value = parseFloat(editValue);
    if (!isNaN(value) && value > 0) {
      updateDimensionConstraint(dimensionId, value);
    }
    setEditingDimensionId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingDimensionId(null);
    setEditValue('');
  };

  const getDimensionTypeLabel = (type: DimensionConstraint['type']) => {
    switch (type) {
      case 'length': return '長さ';
      case 'radius': return '半径';
      case 'diameter': return '直径';
      case 'angle': return '角度';
      case 'distance': return '距離';
      default: return type;
    }
  };

  const getEntityTypeLabel = (entityType: string) => {
    switch (entityType) {
      case 'line': return '線分';
      case 'circle': return '円';
      case 'rectangle': return '矩形';
      default: return entityType;
    }
  };

  return (
    <div className="dimension-panel">
      <div className="panel-header">
        <h3>📏 寸法</h3>
      </div>

      <div className="panel-content">
        <div className="selected-entity-info">
          <div className="info-row">
            <span className="label">選択:</span>
            <span className="value">{getEntityTypeLabel(selectedEntity.type)}</span>
          </div>
        </div>

        <div className="dimensions-list">
          <div className="list-header">
            <span>拘束一覧</span>
            <button
              className="add-dimension-btn"
              onClick={handleAddDimension}
              title="寸法を追加"
            >
              ＋ 追加
            </button>
          </div>

          {entityDimensions.length === 0 ? (
            <p className="no-dimensions">寸法がありません</p>
          ) : (
            <div className="dimension-items">
              {entityDimensions.map(dimension => (
                <div key={dimension.id} className="dimension-item">
                  <div className="dimension-info">
                    <span className="dimension-label">{dimension.label}</span>
                    <span className="dimension-type">
                      {getDimensionTypeLabel(dimension.type)}
                    </span>
                  </div>

                  {editingDimensionId === dimension.id ? (
                    <div className="dimension-edit">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        step="0.1"
                        min="0"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveDimension(dimension.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <button
                        className="save-btn"
                        onClick={() => handleSaveDimension(dimension.id)}
                      >
                        ✓
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={handleCancelEdit}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="dimension-value">
                      <span className="value-number">{dimension.value.toFixed(2)}</span>
                      <div className="dimension-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditDimension(dimension)}
                          title="編集"
                        >
                          ✎
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => removeDimensionConstraint(dimension.id)}
                          title="削除"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel-hint">
          <p>💡 ヒント: 寸法値をクリックして編集できます</p>
        </div>
      </div>
    </div>
  );
};

export default DimensionPanel;
