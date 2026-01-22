import { useState, useRef } from 'react';
import './Converter.css';

interface ConversionJob {
  id: string;
  fileName: string;
  fromFormat: string;
  toFormat: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress: number;
  outputData?: ArrayBuffer | string;
}

const Converter = () => {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fromFormat, setFromFormat] = useState('STL');
  const [toFormat, setToFormat] = useState('OBJ');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [
    { value: 'STL', label: 'STL (Stereolithography)' },
    { value: 'OBJ', label: 'OBJ (Wavefront)' },
    { value: 'STEP', label: 'STEP (ISO 10303)' },
    { value: 'IGES', label: 'IGES (Initial Graphics Exchange)' },
    { value: 'PLY', label: 'PLY (Polygon File Format)' },
    { value: 'FBX', label: 'FBX (Filmbox)' },
    { value: 'GLTF', label: 'glTF (GL Transmission Format)' },
    { value: 'DXF', label: 'DXF (Drawing Exchange Format)' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'STL';
      setFromFormat(ext);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      alert('ファイルを選択してください');
      return;
    }

    if (fromFormat === toFormat) {
      alert('変換元と変換先の形式が同じです');
      return;
    }

    const newJob: ConversionJob = {
      id: `job-${Date.now()}`,
      fileName: selectedFile.name,
      fromFormat,
      toFormat,
      status: 'pending',
      progress: 0
    };

    setJobs(prev => [newJob, ...prev]);

    // シミュレートされた変換プロセス
    setTimeout(() => {
      setJobs(prev => prev.map(job =>
        job.id === newJob.id ? { ...job, status: 'converting' as const } : job
      ));

      // 進捗シミュレーション
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setJobs(prev => prev.map(job =>
          job.id === newJob.id ? { ...job, progress } : job
        ));

        if (progress >= 100) {
          clearInterval(interval);
          setJobs(prev => prev.map(job =>
            job.id === newJob.id ? {
              ...job,
              status: 'completed' as const,
              progress: 100,
              outputData: new ArrayBuffer(0)
            } : job
          ));
        }
      }, 200);
    }, 500);
  };

  const handleDownload = (job: ConversionJob) => {
    if (job.status !== 'completed') return;

    const blob = new Blob([new Uint8Array(0)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.fileName.split('.')[0]}_converted.${job.toFormat.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearCompleted = () => {
    setJobs(prev => prev.filter(job => job.status !== 'completed'));
  };

  return (
    <div className="converter">
      <div className="converter-content">
        <div className="converter-panel">
          <h2>CADファイルコンバーター</h2>

          <div className="conversion-setup">
            <div className="file-select-area">
              <input
                ref={fileInputRef}
                type="file"
                accept=".stl,.obj,.step,.iges,.stp,.igs,.ply,.fbx,.gltf,.glb,.dxf"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="converter-file-input"
              />
              <label htmlFor="converter-file-input" className="file-select-btn">
                📁 ファイルを選択
              </label>
              {selectedFile && (
                <div className="selected-file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}
            </div>

            <div className="format-selectors">
              <div className="format-selector">
                <label>変換元</label>
                <select value={fromFormat} onChange={(e) => setFromFormat(e.target.value)}>
                  {supportedFormats.map(fmt => (
                    <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                  ))}
                </select>
              </div>

              <div className="format-arrow">→</div>

              <div className="format-selector">
                <label>変換先</label>
                <select value={toFormat} onChange={(e) => setToFormat(e.target.value)}>
                  {supportedFormats.map(fmt => (
                    <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="convert-btn" onClick={handleConvert} disabled={!selectedFile}>
              🔄 変換を開始
            </button>
          </div>

          <div className="supported-formats">
            <h3>対応フォーマット</h3>
            <div className="format-list">
              {supportedFormats.map(fmt => (
                <span key={fmt.value} className="format-badge">{fmt.value}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="jobs-panel">
          <div className="jobs-header">
            <h3>変換履歴</h3>
            <button className="clear-btn" onClick={clearCompleted}>
              🗑️ 完了済みをクリア
            </button>
          </div>

          <div className="jobs-list">
            {jobs.length === 0 ? (
              <div className="empty-jobs">
                <p>変換履歴がありません</p>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className={`job-item ${job.status}`}>
                  <div className="job-info">
                    <div className="job-name">{job.fileName}</div>
                    <div className="job-conversion">
                      {job.fromFormat} → {job.toFormat}
                    </div>
                  </div>

                  <div className="job-status">
                    {job.status === 'pending' && <span className="status-badge pending">待機中</span>}
                    {job.status === 'converting' && (
                      <>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${job.progress}%` }} />
                        </div>
                        <span className="status-text">{job.progress}%</span>
                      </>
                    )}
                    {job.status === 'completed' && (
                      <>
                        <span className="status-badge completed">完了</span>
                        <button className="download-btn" onClick={() => handleDownload(job)}>
                          💾 ダウンロード
                        </button>
                      </>
                    )}
                    {job.status === 'error' && <span className="status-badge error">エラー</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
