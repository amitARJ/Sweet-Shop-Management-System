import React, { useState } from "react";

const SweetCard = ({ sweet, onAddToCart }) => {
  const [qty, setQty] = useState(1);

  return (
    <div className="sweet-card">
      <div className="sweet-card-img">
        <img
          src={sweet.image || "/default-sweet.jpg"}
          alt={sweet.name}
          style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
        />
      </div>
      <div className="sweet-card-details">
        <div className="sweet-card-top">
          <span className="sweet-card-name">{sweet.name}</span>
          <span className="sweet-card-price">₹{sweet.price?.toFixed(2)}</span>
        </div>
        <div className="sweet-card-desc">{sweet.description || `Rich ${sweet.category?.toLowerCase()} sweet`}</div>
        <div className="sweet-card-qty-row">
          <span className="stock-display">
            In Stock ({sweet.quantity})
          </span>
          <div className="qty-controls">
            <button
              className="qty-btn"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              disabled={qty === 1}
              type="button"
            >-</button>
            <span className="qty-value">{qty}</span>
            <button
              className="qty-btn"
              onClick={() => setQty(q => Math.min(sweet.quantity, q + 1))}
              disabled={qty === sweet.quantity}
              type="button"
            >+</button>
            <button
              className="add-cart-btn"
              disabled={sweet.quantity === 0}
              onClick={() => onAddToCart(sweet, qty)}
              type="button"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
