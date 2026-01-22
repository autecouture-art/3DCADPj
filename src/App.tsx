import { useAppStore } from './store/useAppStore';
import Toolbar from './components/Toolbar/Toolbar';
import Sidebar from './components/Sidebar/Sidebar';
import Viewer from './components/Viewer/Viewer';
import Modeler from './components/Modeler/Modeler';
import Converter from './components/Converter/Converter';
import Tools from './components/Tools/Tools';
import './App.css';

function App() {
  const mode = useAppStore((state) => state.mode);

  const renderContent = () => {
    switch (mode) {
      case 'viewer':
        return <Viewer />;
      case 'modeler':
        return <Modeler />;
      case 'converter':
        return <Converter />;
      case 'tools':
        return <Tools />;
      default:
        return <Viewer />;
    }
  };

  return (
    <div className="app">
      <Toolbar />
      <div className="app-content">
        <Sidebar />
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
