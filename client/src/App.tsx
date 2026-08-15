import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminTables from './pages/AdminTables';
import AdminMenu from './pages/AdminMenu';
import AdminReservation from './pages/AdminReservation';
import AdminOrders from './pages/AdminOrders';
import CustomerMenu from './pages/CustomerMenu';
import Checkout from './pages/Checkout';
import Reservation from './pages/Reservation';
import OrderTracking from './pages/OrderTracking';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<CustomerMenu />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="reserve" element={<Reservation />} />
          <Route path="tracking" element={<OrderTracking />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="tables" element={<AdminTables />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reservations" element={<AdminReservation />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
