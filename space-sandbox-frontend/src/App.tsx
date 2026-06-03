import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Sandbox from './pages/Sandbox';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sandbox/:id" element={<Sandbox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
