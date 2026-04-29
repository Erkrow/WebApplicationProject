import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import './styles/tokens.css';
import './index.css'
import './App.css';

import Header from './components/layout/Header';
import CategoryNav from './components/layout/CategoryNav';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductPageWrapper from './pages/ProductPageWrapper';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import CartModal from './components/cart/CartModal';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <CategoryNav />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
<Route path="/products/:category" element={<ProductPageWrapper />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/admin' element={<ProtectedRoute requiredRole='ROLE_ADMIN'><AdminPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <CartModal />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
