import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import './Tools.css';

type ToolCategory = 'measure' | 'analyze' | 'export' | 'utilities';

const Tools = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('measure');
  const { objects } = useAppStore();

  const calculateTotalVolume = () => {
    // デモ用の計算
    return (objects.length * 1.5).toFixed(2);
  };

  const calculateSurfaceArea = () => {
    // デモ用の計算
    return (objects.length * 6.0).toFixed(2);
  };

  const renderMeasureTools = () => (
    <div className="tool-content">
      <h3>計測ツール</h3>
      <div className="tool-grid">
        <div className="tool-card">
          <div className="tool-icon">📏</div>
          <h4>距離測定</h4>
          <p>2点間の距離を測定します</p>
          <button className="tool-action-btn">測定を開始</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">📐</div>
          <h4>角度測定</h4>
          <p>3点を使って角度を測定します</p>
          <button className="tool-action-btn">測定を開始</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">📦</div>
          <h4>体積計算</h4>
          <p>オブジェクトの体積を計算します</p>
          <div className="result-display">{calculateTotalVolume()} m³</div>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🔲</div>
          <h4>表面積計算</h4>
          <p>オブジェクトの表面積を計算します</p>
          <div className="result-display">{calculateSurfaceArea()} m²</div>
        </div>

        <div className="tool-card">
          <div className="tool-icon">⚖️</div>
          <h4>重心計算</h4>
          <p>オブジェクトの重心位置を計算します</p>
          <button className="tool-action-btn">計算</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🎯</div>
          <h4>バウンディングボックス</h4>
          <p>オブジェクトの境界ボックスを表示します</p>
          <button className="tool-action-btn">表示</button>
        </div>
      </div>
    </div>
  );

  const renderAnalyzeTools = () => (
    <div className="tool-content">
      <h3>解析ツール</h3>
      <div className="tool-grid">
        <div className="tool-card">
          <div className="tool-icon">🔍</div>
          <h4>ジオメトリチェック</h4>
          <p>モデルの整合性を検証します</p>
          <button className="tool-action-btn">検証を開始</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🔗</div>
          <h4>干渉チェック</h4>
          <p>オブジェクト間の干渉を検出します</p>
          <button className="tool-action-btn">チェック</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">📊</div>
          <h4>統計情報</h4>
          <p>モデルの統計データを表示します</p>
          <div className="stats-display">
            <div className="stat-item">
              <span>オブジェクト数:</span>
              <span>{objects.length}</span>
            </div>
            <div className="stat-item">
              <span>合計頂点数:</span>
              <span>{objects.length * 8}</span>
            </div>
          </div>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🌡️</div>
          <h4>肉厚解析</h4>
          <p>モデルの肉厚を解析します</p>
          <button className="tool-action-btn">解析</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🔬</div>
          <h4>曲率解析</h4>
          <p>サーフェスの曲率を視覚化します</p>
          <button className="tool-action-btn">表示</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">⚡</div>
          <h4>ドラフト角度解析</h4>
          <p>成形用のドラフト角度を確認します</p>
          <button className="tool-action-btn">解析</button>
        </div>
      </div>
    </div>
  );

  const renderExportTools = () => (
    <div className="tool-content">
      <h3>エクスポートツール</h3>
      <div className="tool-grid">
        <div className="tool-card">
          <div className="tool-icon">💾</div>
          <h4>STLエクスポート</h4>
          <p>STL形式でエクスポートします</p>
          <button className="tool-action-btn">エクスポート</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">💾</div>
          <h4>OBJエクスポート</h4>
          <p>OBJ形式でエクスポートします</p>
          <button className="tool-action-btn">エクスポート</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">💾</div>
          <h4>STEPエクスポート</h4>
          <p>STEP形式でエクスポートします</p>
          <button className="tool-action-btn">エクスポート</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🖼️</div>
          <h4>画像エクスポート</h4>
          <p>現在のビューを画像として保存します</p>
          <button className="tool-action-btn">保存</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">📹</div>
          <h4>アニメーション出力</h4>
          <p>回転アニメーションを生成します</p>
          <button className="tool-action-btn">生成</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">📄</div>
          <h4>技術図面出力</h4>
          <p>2D図面を生成します</p>
          <button className="tool-action-btn">生成</button>
        </div>
      </div>
    </div>
  );

  const renderUtilities = () => (
    <div className="tool-content">
      <h3>ユーティリティ</h3>
      <div className="tool-grid">
        <div className="tool-card">
          <div className="tool-icon">🔧</div>
          <h4>メッシュ修復</h4>
          <p>破損したメッシュを修復します</p>
          <button className="tool-action-btn">修復</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🎨</div>
          <h4>メッシュ簡略化</h4>
          <p>ポリゴン数を削減します</p>
          <button className="tool-action-btn">簡略化</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">✨</div>
          <h4>メッシュ平滑化</h4>
          <p>サーフェスを滑らかにします</p>
          <button className="tool-action-btn">平滑化</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🔄</div>
          <h4>座標系変換</h4>
          <p>異なる座標系に変換します</p>
          <button className="tool-action-btn">変換</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">📏</div>
          <h4>単位変換</h4>
          <p>モデルの単位を変換します</p>
          <button className="tool-action-btn">変換</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🎲</div>
          <h4>バッチ処理</h4>
          <p>複数ファイルを一括処理します</p>
          <button className="tool-action-btn">開始</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tools">
      <div className="tools-header">
        <h2>CADツール</h2>
        <div className="category-tabs">
          <button
            className={`tab ${activeCategory === 'measure' ? 'active' : ''}`}
            onClick={() => setActiveCategory('measure')}
          >
            📏 計測
          </button>
          <button
            className={`tab ${activeCategory === 'analyze' ? 'active' : ''}`}
            onClick={() => setActiveCategory('analyze')}
          >
            🔍 解析
          </button>
          <button
            className={`tab ${activeCategory === 'export' ? 'active' : ''}`}
            onClick={() => setActiveCategory('export')}
          >
            💾 エクスポート
          </button>
          <button
            className={`tab ${activeCategory === 'utilities' ? 'active' : ''}`}
            onClick={() => setActiveCategory('utilities')}
          >
            🔧 ユーティリティ
          </button>
        </div>
      </div>

      <div className="tools-body">
        {activeCategory === 'measure' && renderMeasureTools()}
        {activeCategory === 'analyze' && renderAnalyzeTools()}
        {activeCategory === 'export' && renderExportTools()}
        {activeCategory === 'utilities' && renderUtilities()}
      </div>
    </div>
  );
};

export default Tools;
