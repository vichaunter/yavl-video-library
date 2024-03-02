import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ConfigScreen from './screens/ConfigScreen';
import HomeScreen from './screens/HomeScreen';
import useConfigStore from './store/useConfigStore';
import { useEffect } from 'react';

export default function App() {
  const [loadConfig] = useConfigStore((state) => [state.load]);

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/config" element={<ConfigScreen />} />
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}
