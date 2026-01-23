/**
 * eDrawings File Handler
 *
 * eDrawingsファイル（.eprt, .easm, .edrwなど）はSolidWorksのビューアー専用形式で、
 * プロプライエタリなバイナリ形式のため、ブラウザで直接読み込むことはできません。
 *
 * このモジュールは以下を提供します：
 * 1. eDrawingsファイルの検出
 * 2. ユーザーへの変換ガイドの表示
 * 3. 推奨される変換方法の提示
 */

/**
 * eDrawingsファイルかどうかを判定
 * @param filename ファイル名
 * @returns eDrawingsファイルの場合true
 */
export const isEDrawingsFile = (filename: string): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  // eDrawings形式の拡張子
  const edrawingsExtensions = [
    'eprt',  // eDrawings Part
    'easm',  // eDrawings Assembly
    'edrw',  // eDrawings Drawing
    'edrawings',
  ];
  return edrawingsExtensions.includes(extension || '');
};

/**
 * eDrawingsファイルの種類を取得
 * @param filename ファイル名
 * @returns ファイルの種類の説明
 */
const getEDrawingsFileType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'eprt':
      return 'パーツファイル';
    case 'easm':
      return 'アセンブリファイル';
    case 'edrw':
      return '図面ファイル';
    case 'edrawings':
      return 'eDrawingsファイル';
    default:
      return 'ファイル';
  }
};

/**
 * eDrawings変換ガイドメッセージを生成
 * @param file eDrawingsファイル
 * @returns 変換ガイドメッセージ
 */
const getEDrawingsConversionMessage = (file: File): string => {
  const fileType = getEDrawingsFileType(file.name);

  return `
eDrawings ${fileType}が選択されました: ${file.name}

⚠️ eDrawingsファイルはプロプライエタリ形式のため、このアプリケーションで直接読み込むことはできません。

📋 推奨される変換方法：

1. 【SolidWorks/eDrawingsで変換】
   - eDrawings Viewerまたは元のCADソフトウェア（SolidWorks等）を使用
   - ファイルを開く
   - 「名前を付けて保存」→「STEP (.step, .stp)」形式でエクスポート
   - エクスポートしたSTEPファイルをこのアプリにアップロード

2. 【対応形式】
   ✅ STEP (.step, .stp) - ISO標準形式（推奨）
   ✅ IGES (.iges, .igs) - 広く使用される交換形式
   ✅ STL (.stl) - 3Dプリント用メッシュ形式

3. 【オンライン変換サービス】（eDrawings → STEP）
   注: eDrawings形式の変換は専用ソフトウェアが必要な場合があります
   - eDrawings Viewer（無料）: https://www.solidworks.com/edrawings
   - 元のCADファイルがある場合は、そちらからSTEPエクスポートを推奨

💡 ヒント：
- STEPファイルは産業標準で、ほとんどのCADソフトウェアで開けます
- eDrawingsは主に閲覧用なので、編集可能な形式が必要な場合は元のCADファイルを使用してください
  `.trim();
};

/**
 * eDrawings変換ガイドを表示
 * @param file eDrawingsファイル
 */
export const showEDrawingsConversionGuide = (file: File): void => {
  const message = getEDrawingsConversionMessage(file);

  // コンソールに詳細を表示
  console.info('eDrawings File Detected:', {
    filename: file.name,
    size: `${(file.size / 1024).toFixed(2)} KB`,
    type: file.type || 'application/octet-stream',
    fileType: getEDrawingsFileType(file.name),
  });

  // ユーザーにアラートで通知
  alert(message);
};

/**
 * eDrawingsファイル情報を取得
 * @param file eDrawingsファイル
 * @returns ファイル情報オブジェクト
 */
export const getEDrawingsFileInfo = (file: File) => {
  return {
    isEDrawings: isEDrawingsFile(file.name),
    fileType: getEDrawingsFileType(file.name),
    filename: file.name,
    size: file.size,
    sizeKB: (file.size / 1024).toFixed(2),
    extension: file.name.split('.').pop()?.toLowerCase() || '',
  };
};
