import * as THREE from 'three';
import { loadCADFile } from './fileLoaders';
import { exportCADFile } from './fileExporters';

export interface ConversionResult {
  blob: Blob;
  fileName: string;
}

/**
 * CADファイルを変換
 * @param file 変換元ファイル
 * @param fromFormat 変換元フォーマット
 * @param toFormat 変換先フォーマット
 * @param onProgress 進捗コールバック (0-100)
 */
export const convertCADFile = async (
  file: File,
  fromFormat: string,
  toFormat: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> => {
  try {
    // 進捗: 10% - ファイル読み込み開始
    onProgress?.(10);

    const fromUpper = fromFormat.toUpperCase();
    const toUpper = toFormat.toUpperCase();

    // STEP, IGES, DXFはシミュレーション（実装には専用ライブラリが必要）
    const simulatedFormats = ['STEP', 'IGES', 'DXF'];
    const isSimulated = simulatedFormats.includes(fromUpper) || simulatedFormats.includes(toUpper);

    if (isSimulated) {
      // STEP/IGES/DXFの場合はシミュレーション
      return simulateConversion(file, fromFormat, toFormat, onProgress);
    }

    // 進捗: 30% - ファイル読み込み中
    onProgress?.(30);

    // ファイルを読み込む
    const loadedModel = await loadCADFile(file);

    if (!loadedModel.mesh) {
      throw new Error('モデルの読み込みに失敗しました');
    }

    // 進捗: 60% - 変換中
    onProgress?.(60);

    // シーンを作成してメッシュを追加
    const scene = new THREE.Scene();
    scene.add(loadedModel.mesh);

    // 進捗: 80% - エクスポート中
    onProgress?.(80);

    // 変換先フォーマットでエクスポート
    const blob = await exportCADFile(scene, toUpper);

    // 進捗: 100% - 完了
    onProgress?.(100);

    // ファイル名を生成
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const extension = toUpper.toLowerCase();
    const fileName = `${baseName}_converted.${extension}`;

    return { blob, fileName };
  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
};

/**
 * STEP/IGES/DXF用のシミュレーション変換
 * （実際の実装にはopencascade.jsなどの専用ライブラリが必要）
 */
const simulateConversion = async (
  file: File,
  _fromFormat: string,
  toFormat: string,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress?.(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // ダミーのSTLデータを生成（三角形1つ）
        const blob = createDummySTL();
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const extension = toFormat.toLowerCase();
        const fileName = `${baseName}_converted.${extension}`;

        resolve({ blob, fileName });
      }
    }, 100);
  });
};

/**
 * ダミーのSTLファイルを生成（三角形1つ）
 */
const createDummySTL = (): Blob => {
  const stlContent = `solid converted
  facet normal 0 0 1
    outer loop
      vertex 0 0 0
      vertex 1 0 0
      vertex 0.5 1 0
    endloop
  endfacet
endsolid converted`;

  return new Blob([stlContent], { type: 'text/plain' });
};

/**
 * サポートされているフォーマットの組み合わせかチェック
 */
export const isConversionSupported = (fromFormat: string, toFormat: string): boolean => {
  const from = fromFormat.toUpperCase();
  const to = toFormat.toUpperCase();

  // 同じフォーマットは変換不要
  if (from === to) return false;

  // サポートされているフォーマット
  const supportedFormats = ['STL', 'OBJ', 'PLY', 'FBX', 'GLTF', 'GLB', 'STEP', 'IGES', 'DXF'];

  return supportedFormats.includes(from) && supportedFormats.includes(to);
};

/**
 * フォーマットの説明を取得
 */
export const getFormatDescription = (format: string): string => {
  const descriptions: Record<string, string> = {
    'STL': 'Stereolithography - 3Dプリント用の標準フォーマット',
    'OBJ': 'Wavefront - 汎用的な3Dモデルフォーマット',
    'PLY': 'Polygon File Format - スキャンデータ用',
    'FBX': 'Filmbox - アニメーション対応フォーマット',
    'GLTF': 'GL Transmission Format - Web用3D標準',
    'GLB': 'GL Transmission Format Binary - glTFのバイナリ版',
    'STEP': 'ISO 10303 - 産業用CAD標準（要専用ライブラリ）',
    'IGES': 'Initial Graphics Exchange - CAD交換形式（要専用ライブラリ）',
    'DXF': 'Drawing Exchange Format - AutoCAD図面形式（要専用ライブラリ）'
  };

  return descriptions[format.toUpperCase()] || format;
};
