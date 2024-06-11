import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard'
import AddProducts from './pages/AddProducts/AddProducts'
import EditProducts from './pages/EditProducts/EditProducts'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/AddProduct" element={<AddProducts />} />
        <Route path="/EditProduct/:id" element={<EditProducts />} />

      </Routes>
    </Router>

  );
}

export default App;
