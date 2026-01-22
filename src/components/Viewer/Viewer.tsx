import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Sphere, Cylinder, Cone } from '@react-three/drei';
import { useAppStore } from '../../store/useAppStore';
import SceneObjects from './SceneObjects';
import FileUploader from './FileUploader';
import './Viewer.css';

const Viewer = () => {
  const { gridVisible, axesVisible } = useAppStore();

  return (
    <div className="viewer">
      <FileUploader />
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: '#1a1a1a' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

        {gridVisible && <Grid args={[20, 20]} cellColor="#6e6e6e" sectionColor="#4e4e4e" />}

        {axesVisible && (
          <>
            {/* X軸 (赤) */}
            <Cylinder args={[0.02, 0.02, 5]} position={[2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshBasicMaterial color="red" />
            </Cylinder>
            <Cone args={[0.08, 0.2]} position={[5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <meshBasicMaterial color="red" />
            </Cone>

            {/* Y軸 (緑) */}
            <Cylinder args={[0.02, 0.02, 5]} position={[0, 2.5, 0]}>
              <meshBasicMaterial color="green" />
            </Cylinder>
            <Cone args={[0.08, 0.2]} position={[0, 5, 0]}>
              <meshBasicMaterial color="green" />
            </Cone>

            {/* Z軸 (青) */}
            <Cylinder args={[0.02, 0.02, 5]} position={[0, 0, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="blue" />
            </Cylinder>
            <Cone args={[0.08, 0.2]} position={[0, 0, 5]} rotation={[Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="blue" />
            </Cone>
          </>
        )}

        <SceneObjects />

        <OrbitControls makeDefault />
      </Canvas>

      <div className="viewer-info">
        <div className="info-item">
          <span>カメラコントロール:</span>
          <span>左クリック: 回転 | 右クリック: パン | ホイール: ズーム</span>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
