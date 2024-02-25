import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}
