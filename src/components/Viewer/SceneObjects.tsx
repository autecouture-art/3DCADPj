import { useRef, useEffect } from 'react';
import { Mesh, BufferGeometry } from 'three';
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
          return (
            <primitive
              key={obj.id}
              object={obj.mesh.clone()}
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
              color={isSelected ? '#ffff00' : obj.color}
              wireframe={isSelected}
            />
          </mesh>
        );
      })}
    </>
  );
};

export default SceneObjects;
