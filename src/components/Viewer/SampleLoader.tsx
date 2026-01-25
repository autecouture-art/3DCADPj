import { useAppStore } from '../../store/useAppStore';
import { loadCADFile } from '../../utils/fileLoaders';
import './SampleLoader.css';

const SampleLoader = () => {
  const { setLoadedFile, addObject } = useAppStore();

  const loadSampleFile = async (filename: string, displayName: string) => {
    try {
      // publicフォルダからサンプルファイルをフェッチ
      const response = await fetch(`/3DCADPj/samples/${filename}`);
      if (!response.ok) {
        throw new Error('サンプルファイルの読み込みに失敗しました');
      }

      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'application/octet-stream' });

      // CADファイルとして読み込む
      const loadedModel = await loadCADFile(file);
      const arrayBuffer = await file.arrayBuffer();

      setLoadedFile({
        name: displayName,
        type: file.name.split('.').pop() || 'unknown',
        data: arrayBuffer
      });

      // 読み込んだ3Dモデルをシーンに追加
      const newObject = {
        id: `obj-${Date.now()}`,
        name: displayName,
        type: 'mesh' as const,
        geometry: {
          vertices: loadedModel.geometry?.attributes.position?.array
            ? Array.from(loadedModel.geometry.attributes.position.array)
            : [],
          indices: loadedModel.geometry?.index?.array
            ? Array.from(loadedModel.geometry.index.array)
            : []
        },
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: [1, 1, 1] as [number, number, number],
        visible: true,
        color: '#4CAF50',
        mesh: loadedModel.mesh
      };

      addObject(newObject);
      alert(`サンプル "${displayName}" を読み込みました！`);
    } catch (error) {
      console.error('Sample file load error:', error);
      alert(`サンプルの読み込みに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };

  return (
    <div className="sample-loader">
      <div className="sample-title">📦 サンプルファイル</div>
      <div className="sample-buttons">
        <button
          className="sample-btn"
          onClick={() => loadSampleFile('cube.stl', '立方体 (STL)')}
        >
          🎲 立方体
        </button>
      </div>
    </div>
  );
};

export default SampleLoader;
