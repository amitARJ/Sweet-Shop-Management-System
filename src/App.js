import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import CartPage from "./components/CartPage";
import { getCurrentUser, logout } from "./services/auth";

// Wrapper to provide location to NavBar (since hooks don't work outside Router)
const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load user (simple: just from token, you might decode for full info)
    const token = getCurrentUser();
    if (token) {
      // You may want to decode token for username/email/isAdmin, here is a mock:
      // For demo, we use static; replace with proper decode logic in real app.
      setUser({
        username: localStorage.getItem("username") || "demo",
        email: localStorage.getItem("email") || "demo@sweetshop.com",
        isAdmin: localStorage.getItem("isAdmin") === "true" // or from token decode
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setCart([]);
  };

  const addToCart = (sweet) => {
    setCart((prev) => [...prev, sweet]);
  };

  const cartItemCount = cart.length;

  const hideNavOnRoutes = ["/login", "/register"];
  const showNavbar = user && !hideNavOnRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && (
        <NavBar user={user} onLogout={handleLogout} cartItemCount={cartItemCount} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Dashboard user={user} addToCart={addToCart} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
<Route
  path="/login"
  element={
    !user ? (
      <Login
        onLogin={(userInfo) => {
          setUser({
            username: userInfo.username,
            email: userInfo.email,
            isAdmin: userInfo.is_admin,
          });
          localStorage.setItem("username", userInfo.username || "");
          localStorage.setItem("email", userInfo.email || "");
          localStorage.setItem("isAdmin", userInfo.is_admin || false);
        }}
      />
    ) : (
      <Navigate to="/" />
    )
  }
/>

<Route
  path="/register"
  element={
    !user ? (
      <Register
        onRegister={(userInfo) => {
          setUser({
            username: userInfo.username,
            email: userInfo.email,
            isAdmin: userInfo.is_admin,
          });
          localStorage.setItem("username", userInfo.username || "");
          localStorage.setItem("email", userInfo.email || "");
          localStorage.setItem("isAdmin", userInfo.is_admin || false);
        }}
      />
    ) : (
      <Navigate to="/" />
    )
  }
/>

        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={user && user.isAdmin ? <AdminPanel user={user} /> : <Navigate to="/" />}
        />
        {/* TODO: Implement Cart page when ready */}
        <Route
          path="/cart"
          element={user ? <CartPage cart={cart} setCart={setCart} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
