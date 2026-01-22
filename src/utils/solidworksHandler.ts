/**
 * SolidWorksファイル処理ユーティリティ
 *
 * SolidWorksファイル（.sldprt, .sldasm）は独自のバイナリ形式のため、
 * ブラウザで直接読み込むことはできません。
 *
 * このモジュールは以下の機能を提供します：
 * 1. SolidWorksファイルの検出
 * 2. 変換方法のガイダンス
 * 3. オンライン変換サービスへのリンク
 */

export interface SolidWorksFileInfo {
  name: string;
  size: number;
  type: 'part' | 'assembly' | 'drawing';
  extension: string;
}

/**
 * SolidWorksファイルかどうかを判定
 */
export const isSolidWorksFile = (filename: string): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return ['sldprt', 'sldasm', 'slddrw'].includes(extension || '');
};

/**
 * SolidWorksファイルのタイプを取得
 */
export const getSolidWorksFileType = (filename: string): SolidWorksFileInfo['type'] | null => {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'sldprt':
      return 'part';
    case 'sldasm':
      return 'assembly';
    case 'slddrw':
      return 'drawing';
    default:
      return null;
  }
};

/**
 * SolidWorksファイルの情報を表示するメッセージ
 */
export const getSolidWorksConversionMessage = (file: File): string => {
  const fileType = getSolidWorksFileType(file.name);
  const typeJa = fileType === 'part' ? 'パーツ' : fileType === 'assembly' ? 'アセンブリ' : '図面';

  return `
SolidWorks ${typeJa}ファイルが検出されました: ${file.name}

SolidWorksファイルは独自のバイナリ形式のため、直接読み込むことはできません。
以下のいずれかの方法で変換してください：

【推奨方法】
1. SolidWorksで開き、STEP形式 (.step, .stp) でエクスポート
2. エクスポートしたSTEPファイルをこのアプリで開く

【SolidWorksでのエクスポート手順】
1. SolidWorksでファイルを開く
2. [ファイル] → [名前を付けて保存]
3. ファイルの種類で「STEP AP214 (*.step)」を選択
4. 保存

【オンライン変換サービス（代替方法）】
以下のサービスでSTEP形式に変換できます：
- CAD Exchanger (https://cadexchanger.com/)
- AnyConv (https://anyconv.com/sldprt-to-step-converter/)
- Online-Convert (https://www.online-convert.com/)

変換後のSTEPファイルをアップロードしてください。
  `.trim();
};

/**
 * SolidWorksファイル変換ガイドを表示
 */
export const showSolidWorksConversionGuide = (file: File): void => {
  const message = getSolidWorksConversionMessage(file);

  // ダイアログを表示
  const shouldOpenGuide = window.confirm(
    `${message}\n\n詳しい変換ガイドを開きますか？`
  );

  if (shouldOpenGuide) {
    // 変換ガイドページを開く（将来的にはアプリ内のガイドページにリンク）
    window.open('https://help.solidworks.com/2021/english/SolidWorks/sldworks/c_STEP_Export.htm', '_blank');
  }
};

/**
 * SolidWorksファイルの代わりにSTEPファイルを選択するよう促す
 */
export const promptForSTEPFile = (): void => {
  alert(
    'SolidWorksファイルはサポートされていません。\n\n' +
    'SolidWorksでSTEP形式にエクスポートしてから、\n' +
    'STEPファイルをアップロードしてください。'
  );
};

/**
 * オンライン変換サービスのリスト
 */
export const conversionServices = [
  {
    name: 'CAD Exchanger',
    url: 'https://cadexchanger.com/',
    description: 'プロフェッショナルなCAD変換サービス',
    formats: ['STEP', 'IGES', 'STL', 'OBJ']
  },
  {
    name: 'AnyConv',
    url: 'https://anyconv.com/sldprt-to-step-converter/',
    description: '無料のオンラインコンバーター',
    formats: ['STEP', 'STL']
  },
  {
    name: 'Online-Convert',
    url: 'https://www.online-convert.com/',
    description: '多様なフォーマットに対応',
    formats: ['STEP', 'STL', 'OBJ']
  }
];
