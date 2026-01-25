import { useAppStore } from '../../store/useAppStore';
import { GeometricConstraint, LineEntity } from '../../types/sketch';
import './GeometricConstraintPanel.css';

const GeometricConstraintPanel = () => {
  const {
    selectedEntityId,
    sketchEntities,
    geometricConstraints,
    addGeometricConstraint,
    removeGeometricConstraint,
    updateSketchEntity
  } = useAppStore();

  const selectedEntity = sketchEntities.find(e => e.id === selectedEntityId);
  const entityConstraints = geometricConstraints.filter(c => c.entityIds.includes(selectedEntityId || ''));

  if (!selectedEntity) {
    return (
      <div className="geometric-constraint-panel">
        <div className="panel-header">
          <h3>🔧 幾何拘束</h3>
        </div>
        <div className="panel-content">
          <p className="no-selection">エンティティを選択してください</p>
        </div>
      </div>
    );
  }

  const handleAddHorizontal = () => {
    if (selectedEntity.type !== 'line') return;

    const lineEntity = selectedEntity as LineEntity;
    const newConstraint: GeometricConstraint = {
      id: `geo-${Date.now()}-${Math.random()}`,
      type: 'horizontal',
      entityIds: [selectedEntity.id]
    };

    // 線を水平に修正
    const midY = (lineEntity.start.y + lineEntity.end.y) / 2;
    updateSketchEntity(selectedEntity.id, {
      start: { ...lineEntity.start, y: midY },
      end: { ...lineEntity.end, y: midY }
    });

    addGeometricConstraint(newConstraint);
  };

  const handleAddVertical = () => {
    if (selectedEntity.type !== 'line') return;

    const lineEntity = selectedEntity as LineEntity;
    const newConstraint: GeometricConstraint = {
      id: `geo-${Date.now()}-${Math.random()}`,
      type: 'vertical',
      entityIds: [selectedEntity.id]
    };

    // 線を垂直に修正
    const midX = (lineEntity.start.x + lineEntity.end.x) / 2;
    updateSketchEntity(selectedEntity.id, {
      start: { ...lineEntity.start, x: midX },
      end: { ...lineEntity.end, x: midX }
    });

    addGeometricConstraint(newConstraint);
  };

  const getConstraintTypeLabel = (type: GeometricConstraint['type']) => {
    switch (type) {
      case 'horizontal': return '水平';
      case 'vertical': return '垂直';
      case 'parallel': return '平行';
      case 'perpendicular': return '直角';
      case 'coincident': return '一致';
      case 'concentric': return '同心';
      case 'tangent': return '接線';
      default: return type;
    }
  };

  const getConstraintIcon = (type: GeometricConstraint['type']) => {
    switch (type) {
      case 'horizontal': return '━';
      case 'vertical': return '┃';
      case 'parallel': return '∥';
      case 'perpendicular': return '⊥';
      case 'coincident': return '●';
      case 'concentric': return '◎';
      case 'tangent': return '⊢';
      default: return '?';
    }
  };

  const canApplyHorizontal = selectedEntity.type === 'line' && !entityConstraints.some(c => c.type === 'horizontal' || c.type === 'vertical');
  const canApplyVertical = selectedEntity.type === 'line' && !entityConstraints.some(c => c.type === 'vertical' || c.type === 'horizontal');

  return (
    <div className="geometric-constraint-panel">
      <div className="panel-header">
        <h3>🔧 幾何拘束</h3>
      </div>

      <div className="panel-content">
        <div className="constraint-buttons">
          <button
            className="constraint-btn"
            onClick={handleAddHorizontal}
            disabled={!canApplyHorizontal}
            title="水平拘束を追加"
          >
            <span className="constraint-icon">━</span>
            <span className="constraint-label">水平</span>
          </button>

          <button
            className="constraint-btn"
            onClick={handleAddVertical}
            disabled={!canApplyVertical}
            title="垂直拘束を追加"
          >
            <span className="constraint-icon">┃</span>
            <span className="constraint-label">垂直</span>
          </button>

          <button
            className="constraint-btn"
            disabled
            title="平行拘束（未実装）"
          >
            <span className="constraint-icon">∥</span>
            <span className="constraint-label">平行</span>
          </button>

          <button
            className="constraint-btn"
            disabled
            title="直角拘束（未実装）"
          >
            <span className="constraint-icon">⊥</span>
            <span className="constraint-label">直角</span>
          </button>
        </div>

        <div className="constraints-list">
          <div className="list-header">
            <span>適用中の拘束</span>
          </div>

          {entityConstraints.length === 0 ? (
            <p className="no-constraints">拘束がありません</p>
          ) : (
            <div className="constraint-items">
              {entityConstraints.map(constraint => (
                <div key={constraint.id} className="constraint-item">
                  <div className="constraint-info">
                    <span className="constraint-icon-large">
                      {getConstraintIcon(constraint.type)}
                    </span>
                    <span className="constraint-name">
                      {getConstraintTypeLabel(constraint.type)}
                    </span>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeGeometricConstraint(constraint.id)}
                    title="削除"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel-hint">
          <p>💡 ヒント: 線分に水平・垂直拘束を適用できます</p>
        </div>
      </div>
    </div>
  );
};

export default GeometricConstraintPanel;
