import { Routes, Route } from 'react-router-dom';
import Roadmap from './components/Roadmap';
import Terminal from './components/Terminal';

function App() {
  return (
    <Routes>
      <Route path="/terminal" element={<Terminal />} />
      <Route path="/" element={<Roadmap />} />
    </Routes>
  );
}

export default App;

