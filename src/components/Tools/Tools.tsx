import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  calculateVolume,
  calculateSurfaceArea as calcSurfaceArea,
  calculateCenterOfMass,
  calculateBoundingBox,
  getGeometryStats,
  checkIntersection,
  checkGeometryQuality
} from '../../utils/geometryAnalysis';
import { exportCADFile, downloadBlob } from '../../utils/fileExporters';
import './Tools.css';

type ToolCategory = 'measure' | 'analyze' | 'export' | 'utilities';

const Tools = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('measure');
  const { objects } = useAppStore();

  const calculateTotalVolume = () => {
    let totalVolume = 0;
    objects.forEach(obj => {
      if (obj.mesh) {
        totalVolume += calculateVolume(obj.mesh);
      }
    });
    return totalVolume.toFixed(4);
  };

  const calculateTotalSurfaceArea = () => {
    let totalArea = 0;
    objects.forEach(obj => {
      if (obj.mesh) {
        totalArea += calcSurfaceArea(obj.mesh);
      }
    });
    return totalArea.toFixed(4);
  };

  const handleCalculateCenterOfMass = () => {
    if (objects.length === 0 || !objects[0].mesh) {
      alert('オブジェクトがありません');
      return;
    }
    const center = calculateCenterOfMass(objects[0].mesh);
    alert(`重心位置:\nX: ${center.x.toFixed(3)}\nY: ${center.y.toFixed(3)}\nZ: ${center.z.toFixed(3)}`);
  };

  const handleCalculateBoundingBox = () => {
    if (objects.length === 0 || !objects[0].mesh) {
      alert('オブジェクトがありません');
      return;
    }
    const bbox = calculateBoundingBox(objects[0].mesh);
    alert(`バウンディングボックス:\nサイズ: ${bbox.size.x.toFixed(2)} × ${bbox.size.y.toFixed(2)} × ${bbox.size.z.toFixed(2)}\n中心: (${bbox.center.x.toFixed(2)}, ${bbox.center.y.toFixed(2)}, ${bbox.center.z.toFixed(2)})`);
  };

  const handleGeometryCheck = () => {
    if (objects.length === 0 || !objects[0].mesh) {
      alert('オブジェクトがありません');
      return;
    }
    const quality = checkGeometryQuality(objects[0].mesh);
    const message = quality.issues.length > 0
      ? `問題が見つかりました:\n${quality.issues.join('\n')}`
      : 'ジオメトリに問題はありません';
    alert(message);
  };

  const handleIntersectionCheck = () => {
    if (objects.length < 2 || !objects[0].mesh || !objects[1].mesh) {
      alert('2つ以上のオブジェクトが必要です');
      return;
    }
    const intersects = checkIntersection(objects[0].mesh, objects[1].mesh);
    alert(intersects ? '干渉が検出されました' : '干渉はありません');
  };

  const getTotalStats = () => {
    let totalVertices = 0;
    let totalFaces = 0;
    let totalEdges = 0;

    objects.forEach(obj => {
      if (obj.mesh) {
        const stats = getGeometryStats(obj.mesh);
        totalVertices += stats.vertexCount;
        totalFaces += stats.faceCount;
        totalEdges += stats.edgeCount;
      }
    });

    return { totalVertices, totalFaces, totalEdges };
  };

  const handleExport = async (format: string) => {
    if (objects.length === 0 || !objects[0].mesh) {
      alert('エクスポートするオブジェクトがありません');
      return;
    }

    try {
      const blob = await exportCADFile(objects[0].mesh, format);
      downloadBlob(blob, `export.${format.toLowerCase()}`);
      alert(`${format}形式でエクスポートしました`);
    } catch (error) {
      alert(`エクスポートに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };

  const stats = getTotalStats();

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
          <div className="result-display">{calculateTotalVolume()} 単位³</div>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🔲</div>
          <h4>表面積計算</h4>
          <p>オブジェクトの表面積を計算します</p>
          <div className="result-display">{calculateTotalSurfaceArea()} 単位²</div>
        </div>

        <div className="tool-card">
          <div className="tool-icon">⚖️</div>
          <h4>重心計算</h4>
          <p>オブジェクトの重心位置を計算します</p>
          <button className="tool-action-btn" onClick={handleCalculateCenterOfMass}>計算</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🎯</div>
          <h4>バウンディングボックス</h4>
          <p>オブジェクトの境界ボックスを表示します</p>
          <button className="tool-action-btn" onClick={handleCalculateBoundingBox}>表示</button>
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
          <button className="tool-action-btn" onClick={handleGeometryCheck}>検証を開始</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🔗</div>
          <h4>干渉チェック</h4>
          <p>オブジェクト間の干渉を検出します</p>
          <button className="tool-action-btn" onClick={handleIntersectionCheck}>チェック</button>
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
              <span>{stats.totalVertices}</span>
            </div>
            <div className="stat-item">
              <span>合計面数:</span>
              <span>{stats.totalFaces}</span>
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
          <button className="tool-action-btn" onClick={() => handleExport('STL')}>エクスポート</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">💾</div>
          <h4>OBJエクスポート</h4>
          <p>OBJ形式でエクスポートします</p>
          <button className="tool-action-btn" onClick={() => handleExport('OBJ')}>エクスポート</button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">💾</div>
          <h4>glTFエクスポート</h4>
          <p>glTF形式でエクスポートします</p>
          <button className="tool-action-btn" onClick={() => handleExport('GLTF')}>エクスポート</button>
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
