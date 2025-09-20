import React, { useState, useEffect } from 'react';
import { fetchSweets } from '../services/sweets';

const defaultSweets = [
  {
    id: "1",
    name: "Almond Delight",
    price: 55,
    quantity: 12,
    description: "Rich almond-based sweet",
    category: "Traditional",
    image: "Almond.png",
  },
  {
    id: "2",
    name: "Chocolate Barfi",
    price: 35,
    quantity: 25,
    description: "Rich chocolate-flavored milk solid sweet",
    category: "Traditional",
    image: "barfi.png",
  },
  {
    id: "3",
    name: "Dark Chocolate Truffle",
    price: 45,
    quantity: 20,
    description: "Premium dark chocolate truffle",
    category: "Modern",
    image: "dark.png",
  },
  {
    id: "4",
    name: "Gulab Jamun",
    price: 30,
    quantity: 40,
    description: "Classic milk-solid ball soaked in rose syrup",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1617191516056-9b1e274ff62b",
  },
  {
    id: "5",
    name: "Rasgulla",
    price: 25,
    quantity: 50,
    description: "Spongy milk dumplings in sugar syrup",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1590080877775-2d224c9cf473",
  },
  {
    id: "6",
    name: "Kaju Katli",
    price: 90,
    quantity: 15,
    description: "Cashew nut fudge sweet",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1617745169957-862bfd6bb39f",
  },
  {
    id: "7",
    name: "Peda",
    price: 40,
    quantity: 28,
    description: "Sweetened condensed milk balls with cardamom",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1614917927497-c62cc431da03",
  },
  {
    id: "8",
    name: "Mysore Pak",
    price: 70,
    quantity: 10,
    description: "Soft gram flour-based rich sweet",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1632940277135-263ad09ae893",
  },
  {
    id: "9",
    name: "Jalebi",
    price: 20,
    quantity: 60,
    description: "Sweet, deep-fried spiral with sugar syrup",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1598327108061-7a7de54e2ed8",
  },
  {
    id: "10",
    name: "Chocolate Fudge",
    price: 85,
    quantity: 18,
    description: "Rich, creamy chocolate fudge squares",
    category: "Modern",
    image: "https://images.unsplash.com/photo-1612413258753-41043510bc57",
  },
];

const Dashboard = ({ user, addToCart }) => {
  const [sweets, setSweets] = useState(defaultSweets);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState('');
  const [qtyById, setQtyById] = useState({});  // Manage qty by sweet id

  useEffect(() => {
    const loadSweets = async () => {
      try {
        const data = await fetchSweets({
          name: search,
          category,
          priceMin,
          priceMax,
          sort
        });
        if (data.length > 0) {
          setSweets(data);
        } else {
          setSweets(defaultSweets);
        }
      } catch {
        setSweets(defaultSweets);
      }
    };
    loadSweets();
  }, [search, category, priceMin, priceMax, sort]);

  const handleQtyChange = (id, delta) => {
    setQtyById(prev => {
      const currentQty = prev[id] || 1;
      const newQty = currentQty + delta;
      const sweet = sweets.find(s => s.id === id);
      if (newQty < 1 || newQty > (sweet?.quantity || 1)) return prev;
      return { ...prev, [id]: newQty };
    });
  };

  const handleAddToCart = (sweet) => {
    const qty = qtyById[sweet.id] || 1;
    addToCart({ ...sweet, quantity: qty });
  };

  return (
    <div className="dashboard-bg">
      <div className="welcome-section">
        <h1>Welcome to Sweet Shop</h1>
        <p>Discover our delicious collection of traditional and modern sweets</p>
      </div>
      <div className="dashboard-search-box">
        <form className="dashboard-search-form" onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Traditional">Traditional</option>
            <option value="Modern">Modern</option>
          </select>
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            min={0}
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            min={0}
          />
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
            <option value="name_desc">Name: Z-A</option>
          </select>
        </form>
      </div>
      <div className="sweets-grid">
        {sweets.map(sweet => (
          <div className="sweet-card" key={sweet.id}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#22b4b8', fontWeight: '500', fontSize: '0.95em' }}>
                  In Stock ({sweet.quantity})
                </span>
                <button
                  onClick={() => handleQtyChange(sweet.id, -1)}
                  disabled={(qtyById[sweet.id] || 1) <= 1}
                  type="button"
                  className="qty-btn"
                >-</button>
                <span style={{ fontWeight: 600 }}>{qtyById[sweet.id] || 1}</span>
                <button
                  onClick={() => handleQtyChange(sweet.id, 1)}
                  disabled={(qtyById[sweet.id] || 1) >= sweet.quantity}
                  type="button"
                  className="qty-btn"
                >+</button>
                <button
                  className="add-cart-btn"
                  onClick={() => handleAddToCart(sweet)}
                  disabled={sweet.quantity === 0}
                  type="button"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
