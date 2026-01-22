import * as THREE from 'three';
import { STLExporter } from 'three-stdlib';
import { OBJExporter } from 'three-stdlib';
import { GLTFExporter } from 'three-stdlib';

/**
 * STL形式でエクスポート
 */
export const exportSTL = (object: THREE.Object3D, binary: boolean = true): Blob => {
  const exporter = new STLExporter();

  if (binary) {
    const result = exporter.parse(object, { binary: true });
    // DataViewをArrayBufferに変換
    const arrayBuffer = result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength) as ArrayBuffer;
    return new Blob([arrayBuffer], { type: 'application/octet-stream' });
  } else {
    const result = exporter.parse(object, { binary: false });
    return new Blob([result], { type: 'text/plain' });
  }
};

/**
 * OBJ形式でエクスポート
 */
export const exportOBJ = (object: THREE.Object3D): Blob => {
  const exporter = new OBJExporter();
  const result = exporter.parse(object);
  return new Blob([result], { type: 'text/plain' });
};

/**
 * glTF形式でエクスポート
 */
export const exportGLTF = async (object: THREE.Object3D, binary: boolean = false): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();

    exporter.parse(
      object,
      (result) => {
        if (binary) {
          resolve(new Blob([result as ArrayBuffer], { type: 'application/octet-stream' }));
        } else {
          const output = JSON.stringify(result, null, 2);
          resolve(new Blob([output], { type: 'application/json' }));
        }
      },
      (error) => {
        reject(error);
      },
      { binary }
    );
  });
};

/**
 * PLY形式でエクスポート（簡易版）
 */
export const exportPLY = (object: THREE.Object3D): Blob => {
  const vertices: number[] = [];
  const faces: number[][] = [];
  let vertexCount = 0;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geometry = child.geometry;
      const position = geometry.attributes.position;

      if (position) {
        const offset = vertexCount;

        // 頂点を追加
        for (let i = 0; i < position.count; i++) {
          vertices.push(
            position.getX(i),
            position.getY(i),
            position.getZ(i)
          );
        }

        // 面を追加
        if (geometry.index) {
          for (let i = 0; i < geometry.index.count; i += 3) {
            faces.push([
              geometry.index.getX(i) + offset,
              geometry.index.getX(i + 1) + offset,
              geometry.index.getX(i + 2) + offset
            ]);
          }
        } else {
          for (let i = 0; i < position.count; i += 3) {
            faces.push([i + offset, i + 1 + offset, i + 2 + offset]);
          }
        }

        vertexCount += position.count;
      }
    }
  });

  // PLYヘッダーとデータを生成
  let plyContent = 'ply\n';
  plyContent += 'format ascii 1.0\n';
  plyContent += `element vertex ${vertexCount}\n`;
  plyContent += 'property float x\n';
  plyContent += 'property float y\n';
  plyContent += 'property float z\n';
  plyContent += `element face ${faces.length}\n`;
  plyContent += 'property list uchar int vertex_indices\n';
  plyContent += 'end_header\n';

  // 頂点データ
  for (let i = 0; i < vertices.length; i += 3) {
    plyContent += `${vertices[i]} ${vertices[i + 1]} ${vertices[i + 2]}\n`;
  }

  // 面データ
  for (const face of faces) {
    plyContent += `3 ${face[0]} ${face[1]} ${face[2]}\n`;
  }

  return new Blob([plyContent], { type: 'text/plain' });
};

/**
 * フォーマットに応じてエクスポート
 */
export const exportCADFile = async (
  object: THREE.Object3D,
  format: string
): Promise<Blob> => {
  switch (format.toUpperCase()) {
    case 'STL':
      return exportSTL(object, true);
    case 'OBJ':
      return exportOBJ(object);
    case 'GLTF':
      return exportGLTF(object, false);
    case 'GLB':
      return exportGLTF(object, true);
    case 'PLY':
      return exportPLY(object);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

/**
 * ファイルをダウンロード
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
