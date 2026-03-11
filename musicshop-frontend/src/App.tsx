// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Importy komponentów layoutu
import Header from './components/layout/Header';
import CategoryNav from './components/layout/CategoryNav';
import Footer from './components/layout/Footer';
import RegisterPage from './pages/RegisterPage';

// Importy stron i modali
import ProductsPage from './pages/ProductsPage';
import CartModal from './components/cart/CartModal';
import './style.css'; 
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

const HomePage = () => (
    <div className="container" style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h1 className="section-title">Witamy w NovaMarket!</h1>
        <p>Wybierz kategorię z paska powyżej, aby zobaczyć nasze produkty w akcji.</p>
    </div>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="main-wrapper">
          <Header />
          <CategoryNav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gitary" element={<ProductsPage category="gitary" title="Gitary" />} />
            <Route path="/fortepiany" element={<ProductsPage category="fortepiany" title="Pianina i Fortepiany" />} />
            <Route path="/keyboardy" element={<ProductsPage category="keyboardy" title="Keyboardy" />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/admin' element={<ProtectedRoute requiredRole='ROLE_ADMIN'><AdminPage /></ProtectedRoute>} />
          </Routes>
          <CartModal />
          <Footer /> {/* <-- Komponent ładuje się teraz z osobnego pliku */}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;