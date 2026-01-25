import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

const SceneObjects = () => {
  const objects = useAppStore((state) => state.objects);
  const { selectedObjectId, selectObject } = useAppStore();

  return (
    <>
      {objects.map((obj) => {
        if (!obj.visible) return null;

        const isSelected = selectedObjectId === obj.id;

        // 読み込んだメッシュがある場合はそれを使用
        if (obj.mesh) {
          const clonedMesh = obj.mesh.clone();

          // 色を更新
          clonedMesh.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              if (child.material) {
                const material = child.material.clone();
                if (isSelected) {
                  material.emissive = new THREE.Color(0x444444);
                  material.emissiveIntensity = 0.5;
                } else {
                  material.color = new THREE.Color(obj.color);
                  material.emissive = new THREE.Color(0x000000);
                  material.emissiveIntensity = 0;
                }
                child.material = material;
              }
            }
          });

          return (
            <primitive
              key={obj.id}
              object={clonedMesh}
              position={obj.position}
              rotation={obj.rotation}
              scale={obj.scale}
              onClick={(e: any) => {
                e.stopPropagation();
                selectObject(obj.id);
              }}
            />
          );
        }

        // デフォルトの表示（メッシュがない場合）
        return (
          <mesh
            key={obj.id}
            position={obj.position}
            rotation={obj.rotation}
            scale={obj.scale}
            onClick={(e) => {
              e.stopPropagation();
              selectObject(obj.id);
            }}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={obj.color}
              emissive={isSelected ? 0x444444 : 0x000000}
              emissiveIntensity={isSelected ? 0.5 : 0}
            />
          </mesh>
        );
      })}
    </>
  );
};

export default SceneObjects;
