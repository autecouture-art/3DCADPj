import { useRef } from 'react';
import { Mesh } from 'three';
import { useAppStore } from '../../store/useAppStore';

const SceneObjects = () => {
  const objects = useAppStore((state) => state.objects);
  const { selectedObjectId, selectObject } = useAppStore();

  return (
    <>
      {objects.map((obj) => {
        if (!obj.visible) return null;

        const isSelected = selectedObjectId === obj.id;

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
            {obj.type === 'mesh' && (
              <boxGeometry args={[1, 1, 1]} />
            )}
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
