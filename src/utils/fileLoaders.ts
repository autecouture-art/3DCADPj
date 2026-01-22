import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { PLYLoader } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';

export interface LoadedModel {
  geometry?: THREE.BufferGeometry;
  mesh?: THREE.Mesh | THREE.Group;
  scene?: THREE.Group;
}

/**
 * STLファイルを読み込む
 */
export const loadSTL = async (file: File): Promise<LoadedModel> => {
  return new Promise((resolve, reject) => {
    const loader = new STLLoader();
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const geometry = loader.parse(arrayBuffer);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
          color: 0x808080,
          metalness: 0.5,
          roughness: 0.5
        });
        const mesh = new THREE.Mesh(geometry, material);

        resolve({ geometry, mesh });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * OBJファイルを読み込む
 */
export const loadOBJ = async (file: File): Promise<LoadedModel> => {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const object = loader.parse(text);

        // デフォルトマテリアルを適用
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x808080,
              metalness: 0.5,
              roughness: 0.5
            });
          }
        });

        resolve({ mesh: object });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * PLYファイルを読み込む
 */
export const loadPLY = async (file: File): Promise<LoadedModel> => {
  return new Promise((resolve, reject) => {
    const loader = new PLYLoader();
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const geometry = loader.parse(arrayBuffer);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
          color: 0x808080,
          metalness: 0.5,
          roughness: 0.5,
          vertexColors: geometry.hasAttribute('color')
        });
        const mesh = new THREE.Mesh(geometry, material);

        resolve({ geometry, mesh });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * FBXファイルを読み込む
 */
export const loadFBX = async (file: File): Promise<LoadedModel> => {
  return new Promise((resolve, reject) => {
    const loader = new FBXLoader();
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const object = loader.parse(arrayBuffer, '');

        resolve({ mesh: object });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * glTF/GLBファイルを読み込む
 */
export const loadGLTF = async (file: File): Promise<LoadedModel> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;

        loader.parse(arrayBuffer, '', (gltf) => {
          resolve({ mesh: gltf.scene, scene: gltf.scene });
        }, (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * ファイル拡張子から適切なローダーを選択して読み込む
 */
export const loadCADFile = async (file: File): Promise<LoadedModel> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'stl':
      return loadSTL(file);
    case 'obj':
      return loadOBJ(file);
    case 'ply':
      return loadPLY(file);
    case 'fbx':
      return loadFBX(file);
    case 'gltf':
    case 'glb':
      return loadGLTF(file);
    case 'step':
    case 'stp':
    case 'iges':
    case 'igs':
      throw new Error(`${extension.toUpperCase()}ファイルのサポートは将来の実装予定です。現在はSTL, OBJ, PLY, FBX, glTFをサポートしています。`);
    default:
      throw new Error(`Unsupported file format: ${extension}`);
  }
};
