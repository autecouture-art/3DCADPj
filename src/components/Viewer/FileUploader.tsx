import { useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { loadCADFile } from '../../utils/fileLoaders';
import './FileUploader.css';

const FileUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setLoadedFile, addObject } = useAppStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // 実際にCADファイルを読み込む
      const loadedModel = await loadCADFile(file);

      const arrayBuffer = await file.arrayBuffer();

      setLoadedFile({
        name: file.name,
        type: file.type || file.name.split('.').pop() || 'unknown',
        data: arrayBuffer
      });

      // 読み込んだ3Dモデルをシーンに追加
      const newObject = {
        id: `obj-${Date.now()}`,
        name: file.name,
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
        mesh: loadedModel.mesh // Three.jsメッシュオブジェクトを保持
      };

      addObject(newObject);
      alert(`ファイル "${file.name}" を正常に読み込みました！`);
    } catch (error) {
      console.error('File upload error:', error);
      alert(`ファイルの読み込みに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input" className="upload-btn">
        📁 CADファイルを開く
      </label>
    </div>
  );
};

export default FileUploader;
