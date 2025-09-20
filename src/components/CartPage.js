import React from "react";

const CartPage = ({ cart, setCart }) => {
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const removeItem = (idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="dashboard-bg">
      <div className="welcome-section">
        <h1>Shopping Cart</h1>
        <p>Review your selected sweets and proceed to checkout</p>
      </div>
      <div className="cart-page-box">
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", opacity: 0.35, margin: "40px 0" }}>
            <img src="cart.png" alt="No items" width={60} />
            <div style={{ fontWeight: 600, marginTop: 6 }}>Your cart is empty</div>
          </div>
        ) : (
          <>
            <ul className="cart-items-list">
              {cart.map((item, idx) => (
                <li key={idx} className="cart-item-li">
                  <img src={item.image || "/default-sweet.jpg"} alt={item.name} width={64} height={40} style={{ objectFit: "cover", borderRadius: 6 }} />
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">₹{item.price?.toFixed(2)}</span>
                  <button className="cart-remove-btn" onClick={() => removeItem(idx)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="cart-total-bar">
              <strong>Total: ₹{total.toFixed(2)}</strong>
              <button className="checkout-btn" disabled>
                Checkout (Demo)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
