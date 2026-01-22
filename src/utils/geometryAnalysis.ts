import * as THREE from 'three';

/**
 * 2点間の距離を計算
 */
export const calculateDistance = (
  point1: THREE.Vector3,
  point2: THREE.Vector3
): number => {
  return point1.distanceTo(point2);
};

/**
 * 3点を使って角度を計算（度数法）
 */
export const calculateAngle = (
  point1: THREE.Vector3,
  vertex: THREE.Vector3,
  point2: THREE.Vector3
): number => {
  const v1 = point1.clone().sub(vertex).normalize();
  const v2 = point2.clone().sub(vertex).normalize();
  const angle = Math.acos(v1.dot(v2));
  return THREE.MathUtils.radToDeg(angle);
};

/**
 * メッシュの体積を計算
 */
export const calculateVolume = (mesh: THREE.Mesh | THREE.Group): number => {
  let totalVolume = 0;

  mesh.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geometry = child.geometry;

      if (!geometry.index || !geometry.attributes.position) {
        return;
      }

      const positions = geometry.attributes.position;
      const indices = geometry.index;

      // 四面体分割法で体積を計算
      for (let i = 0; i < indices.count; i += 3) {
        const i1 = indices.getX(i);
        const i2 = indices.getX(i + 1);
        const i3 = indices.getX(i + 2);

        const v1 = new THREE.Vector3(
          positions.getX(i1),
          positions.getY(i1),
          positions.getZ(i1)
        );
        const v2 = new THREE.Vector3(
          positions.getX(i2),
          positions.getY(i2),
          positions.getZ(i2)
        );
        const v3 = new THREE.Vector3(
          positions.getX(i3),
          positions.getY(i3),
          positions.getZ(i3)
        );

        // スケールを適用
        v1.applyMatrix4(child.matrixWorld);
        v2.applyMatrix4(child.matrixWorld);
        v3.applyMatrix4(child.matrixWorld);

        // 符号付き体積
        const signedVolume = v1.dot(v2.cross(v3)) / 6.0;
        totalVolume += signedVolume;
      }
    }
  });

  return Math.abs(totalVolume);
};

/**
 * メッシュの表面積を計算
 */
export const calculateSurfaceArea = (mesh: THREE.Mesh | THREE.Group): number => {
  let totalArea = 0;

  mesh.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geometry = child.geometry;

      if (!geometry.index || !geometry.attributes.position) {
        return;
      }

      const positions = geometry.attributes.position;
      const indices = geometry.index;

      for (let i = 0; i < indices.count; i += 3) {
        const i1 = indices.getX(i);
        const i2 = indices.getX(i + 1);
        const i3 = indices.getX(i + 2);

        const v1 = new THREE.Vector3(
          positions.getX(i1),
          positions.getY(i1),
          positions.getZ(i1)
        );
        const v2 = new THREE.Vector3(
          positions.getX(i2),
          positions.getY(i2),
          positions.getZ(i2)
        );
        const v3 = new THREE.Vector3(
          positions.getX(i3),
          positions.getY(i3),
          positions.getZ(i3)
        );

        // スケールを適用
        v1.applyMatrix4(child.matrixWorld);
        v2.applyMatrix4(child.matrixWorld);
        v3.applyMatrix4(child.matrixWorld);

        // 三角形の面積（ヘロンの公式）
        const edge1 = v2.clone().sub(v1);
        const edge2 = v3.clone().sub(v1);
        const cross = edge1.cross(edge2);
        const area = cross.length() / 2.0;

        totalArea += area;
      }
    }
  });

  return totalArea;
};

/**
 * メッシュの重心を計算
 */
export const calculateCenterOfMass = (mesh: THREE.Mesh | THREE.Group): THREE.Vector3 => {
  const center = new THREE.Vector3();
  let totalVertices = 0;

  mesh.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geometry = child.geometry;
      const positions = geometry.attributes.position;

      if (positions) {
        for (let i = 0; i < positions.count; i++) {
          const vertex = new THREE.Vector3(
            positions.getX(i),
            positions.getY(i),
            positions.getZ(i)
          );
          vertex.applyMatrix4(child.matrixWorld);
          center.add(vertex);
          totalVertices++;
        }
      }
    }
  });

  if (totalVertices > 0) {
    center.divideScalar(totalVertices);
  }

  return center;
};

/**
 * バウンディングボックスを計算
 */
export const calculateBoundingBox = (mesh: THREE.Mesh | THREE.Group): {
  min: THREE.Vector3;
  max: THREE.Vector3;
  size: THREE.Vector3;
  center: THREE.Vector3;
} => {
  const box = new THREE.Box3();

  mesh.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geometry = child.geometry;
      geometry.computeBoundingBox();

      if (geometry.boundingBox) {
        const childBox = geometry.boundingBox.clone();
        childBox.applyMatrix4(child.matrixWorld);
        box.union(childBox);
      }
    }
  });

  const size = new THREE.Vector3();
  box.getSize(size);

  const center = new THREE.Vector3();
  box.getCenter(center);

  return {
    min: box.min,
    max: box.max,
    size,
    center
  };
};

/**
 * メッシュの統計情報を取得
 */
export const getGeometryStats = (mesh: THREE.Mesh | THREE.Group): {
  vertexCount: number;
  faceCount: number;
  edgeCount: number;
} => {
  let vertexCount = 0;
  let faceCount = 0;

  mesh.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geometry = child.geometry;

      if (geometry.attributes.position) {
        vertexCount += geometry.attributes.position.count;
      }

      if (geometry.index) {
        faceCount += geometry.index.count / 3;
      } else if (geometry.attributes.position) {
        faceCount += geometry.attributes.position.count / 3;
      }
    }
  });

  // オイラーの公式: V - E + F = 2 (閉じた多面体の場合)
  // E = V + F - 2
  const edgeCount = vertexCount + faceCount - 2;

  return {
    vertexCount,
    faceCount,
    edgeCount: Math.max(0, edgeCount) // 負の値を防ぐ
  };
};

/**
 * 2つのメッシュが干渉しているかチェック
 */
export const checkIntersection = (
  mesh1: THREE.Mesh | THREE.Group,
  mesh2: THREE.Mesh | THREE.Group
): boolean => {
  const box1 = new THREE.Box3().setFromObject(mesh1);
  const box2 = new THREE.Box3().setFromObject(mesh2);

  return box1.intersectsBox(box2);
};

/**
 * メッシュの品質チェック
 */
export const checkGeometryQuality = (mesh: THREE.Mesh | THREE.Group): {
  hasNonManifoldEdges: boolean;
  hasHoles: boolean;
  isWatertight: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  let hasNonManifoldEdges = false;
  let hasHoles = false;

  mesh.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geometry = child.geometry;

      // 法線があるかチェック
      if (!geometry.attributes.normal) {
        issues.push('法線情報がありません');
      }

      // インデックスがあるかチェック
      if (!geometry.index) {
        issues.push('インデックスバッファがありません');
      }

      // 頂点数チェック
      if (geometry.attributes.position && geometry.attributes.position.count === 0) {
        issues.push('頂点がありません');
      }
    }
  });

  const isWatertight = !hasHoles && !hasNonManifoldEdges;

  return {
    hasNonManifoldEdges,
    hasHoles,
    isWatertight,
    issues
  };
};
