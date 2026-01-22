import { useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import './FileUploader.css';

const FileUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setLoadedFile, addObject } = useAppStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();

      setLoadedFile({
        name: file.name,
        type: file.type || file.name.split('.').pop() || 'unknown',
        data: arrayBuffer
      });

      // デモ用: ファイルが読み込まれたら新しいオブジェクトを追加
      const newObject = {
        id: `obj-${Date.now()}`,
        name: file.name,
        type: 'mesh' as const,
        geometry: {
          vertices: [],
          indices: []
        },
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: [1, 1, 1] as [number, number, number],
        visible: true,
        color: '#4CAF50'
      };

      addObject(newObject);
      alert(`ファイル "${file.name}" を読み込みました！`);
    } catch (error) {
      console.error('File upload error:', error);
      alert('ファイルの読み込みに失敗しました');
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
        accept=".stl,.obj,.step,.iges,.stp,.igs"
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
