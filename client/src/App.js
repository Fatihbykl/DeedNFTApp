import { Routes, Route } from 'react-router-dom';
import './App.css';
import 'web3';
import Homepage from './components/Homepage';
import SearchDeed from './components/SearchDeed';
import CreateDeed from './components/CreateDeed';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='search' element={<SearchDeed />} />
      <Route path='create' element={<CreateDeed />} />
    </Routes>
  );
}

export default App;
