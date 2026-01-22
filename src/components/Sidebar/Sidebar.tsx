import { useAppStore } from '../../store/useAppStore';
import './Sidebar.css';

const Sidebar = () => {
  const { objects, selectedObjectId, selectObject, removeObject, updateObject } = useAppStore();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>オブジェクト</h2>
        <span className="object-count">{objects.length}</span>
      </div>

      <div className="object-list">
        {objects.length === 0 ? (
          <div className="empty-state">
            <p>オブジェクトがありません</p>
          </div>
        ) : (
          objects.map((obj) => (
            <div
              key={obj.id}
              className={`object-item ${selectedObjectId === obj.id ? 'selected' : ''}`}
              onClick={() => selectObject(obj.id)}
            >
              <div className="object-info">
                <span className="object-name">{obj.name}</span>
                <span className="object-type">{obj.type}</span>
              </div>
              <div className="object-controls">
                <button
                  className="control-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateObject(obj.id, { visible: !obj.visible });
                  }}
                  title={obj.visible ? '非表示' : '表示'}
                >
                  {obj.visible ? '👁️' : '👁️‍🗨️'}
                </button>
                <button
                  className="control-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeObject(obj.id);
                  }}
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
