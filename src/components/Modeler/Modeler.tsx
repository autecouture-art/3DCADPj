import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls } from '@react-three/drei';
import { useAppStore } from '../../store/useAppStore';
import ModelingToolbar from './ModelingToolbar';
import SceneObjects from '../Viewer/SceneObjects';
import './Modeler.css';

const Modeler = () => {
  const { gridVisible, axesVisible } = useAppStore();

  return (
    <div className="modeler">
      <ModelingToolbar />

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
            <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 5, 0xff0000]} />
            <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 5, 0x00ff00]} />
            <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 5, 0x0000ff]} />
          </>
        )}

        <SceneObjects />

        <OrbitControls makeDefault />
      </Canvas>

      <div className="modeler-info">
        <div className="info-item">
          <span>モデリングモード:</span>
          <span>オブジェクトを作成して編集できます</span>
        </div>
      </div>
    </div>
  );
};

export default Modeler;
