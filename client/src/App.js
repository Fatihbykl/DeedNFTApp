import { Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'web3';
import Homepage from './components/Homepage';
import SearchDeed from './components/SearchDeed';
import CreateDeed from './components/CreateDeed';
import MyDeeds from './components/MyDeeds';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='search' element={<SearchDeed />} />
      <Route path='create' element={<CreateDeed />} />
      <Route path='mydeeds' element={<MyDeeds />} />
    </Routes>
  );
}

export default App;
