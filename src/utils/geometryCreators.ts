import * as THREE from 'three';
import { CADObject } from '../types';

/**
 * 立方体を作成
 */
export const createCube = (): CADObject => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4CAF50,
    metalness: 0.5,
    roughness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `cube-${Date.now()}`,
    name: '立方体',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#4CAF50',
    mesh
  };
};

/**
 * 球を作成
 */
export const createSphere = (): CADObject => {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2196F3,
    metalness: 0.5,
    roughness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `sphere-${Date.now()}`,
    name: '球',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#2196F3',
    mesh
  };
};

/**
 * 円柱を作成
 */
export const createCylinder = (): CADObject => {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xFFC107,
    metalness: 0.5,
    roughness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `cylinder-${Date.now()}`,
    name: '円柱',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#FFC107',
    mesh
  };
};

/**
 * 円錐を作成
 */
export const createCone = (): CADObject => {
  const geometry = new THREE.ConeGeometry(0.5, 1, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xFF5722,
    metalness: 0.5,
    roughness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `cone-${Date.now()}`,
    name: '円錐',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#FF5722',
    mesh
  };
};

/**
 * トーラスを作成
 */
export const createTorus = (): CADObject => {
  const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
  const material = new THREE.MeshStandardMaterial({
    color: 0x9C27B0,
    metalness: 0.5,
    roughness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `torus-${Date.now()}`,
    name: 'トーラス',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#9C27B0',
    mesh
  };
};

/**
 * 押し出し形状を作成（矩形から）
 */
export const createExtrusion = (): CADObject => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, 0.5);
  shape.lineTo(0.5, 0.5);
  shape.lineTo(0.5, 0);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 2,
    depth: 0.5,
    bevelEnabled: false
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00BCD4,
    metalness: 0.5,
    roughness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `extrusion-${Date.now()}`,
    name: '押し出し',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [-0.25, 0, -0.25],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#00BCD4',
    mesh
  };
};

/**
 * 回転体を作成
 */
export const createLathe = (): CADObject => {
  const points: THREE.Vector2[] = [];
  for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.3 + 0.2, (i - 5) * 0.1));
  }

  const geometry = new THREE.LatheGeometry(points, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xE91E63,
    metalness: 0.5,
    roughness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `lathe-${Date.now()}`,
    name: '回転体',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#E91E63',
    mesh
  };
};

/**
 * 線を作成
 */
export const createLine = (): CADObject => {
  const points = [
    new THREE.Vector3(-0.5, 0, 0),
    new THREE.Vector3(0, 0.5, 0),
    new THREE.Vector3(0.5, 0, 0)
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
  const line = new THREE.Line(geometry, material);

  return {
    id: `line-${Date.now()}`,
    name: '線',
    type: 'line',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#FFFFFF',
    mesh: line
  };
};

/**
 * 円を作成
 */
export const createCircle = (): CADObject => {
  const geometry = new THREE.CircleGeometry(0.5, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00E676,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `circle-${Date.now()}`,
    name: '円',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#00E676',
    mesh
  };
};

/**
 * 矩形を作成
 */
export const createRectangle = (): CADObject => {
  const geometry = new THREE.PlaneGeometry(1, 0.6);
  const material = new THREE.MeshStandardMaterial({
    color: 0xFF9800,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `rectangle-${Date.now()}`,
    name: '矩形',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#FF9800',
    mesh
  };
};

/**
 * ポリゴンを作成（六角形）
 */
export const createPolygon = (): CADObject => {
  const shape = new THREE.Shape();
  const sides = 6;
  const radius = 0.5;

  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshStandardMaterial({
    color: 0x3F51B5,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    id: `polygon-${Date.now()}`,
    name: 'ポリゴン',
    type: 'mesh',
    geometry: extractGeometryData(geometry),
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    color: '#3F51B5',
    mesh
  };
};

/**
 * ジオメトリからデータを抽出
 */
const extractGeometryData = (geometry: THREE.BufferGeometry) => {
  const position = geometry.attributes.position;
  const index = geometry.index;

  return {
    vertices: position ? Array.from(position.array) : [],
    indices: index ? Array.from(index.array) : [],
    normals: geometry.attributes.normal ? Array.from(geometry.attributes.normal.array) : [],
    uvs: geometry.attributes.uv ? Array.from(geometry.attributes.uv.array) : []
  };
};

/**
 * すべてのジオメトリ作成関数のマップ
 */
export const geometryCreators = {
  cube: createCube,
  sphere: createSphere,
  cylinder: createCylinder,
  cone: createCone,
  torus: createTorus,
  extrusion: createExtrusion,
  lathe: createLathe,
  line: createLine,
  circle: createCircle,
  rectangle: createRectangle,
  polygon: createPolygon
};
