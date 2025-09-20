import React, { useState, useEffect } from 'react';
import { fetchSweets, addSweet, updateSweet, deleteSweet, restockSweet } from '../services/sweets';

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [editingSweet, setEditingSweet] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadSweets = async () => {
    try {
      const data = await fetchSweets();
      setSweets(data);
    } catch (err) {
      setError('Failed to load sweets');
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const resetForm = () => {
    setForm({ name: '', category: '', price: '', quantity: '' });
    setEditingSweet(null);
    setError('');
    setMessage('');
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addSweet(form);
      setMessage('Sweet added');
      resetForm();
      loadSweets();
    } catch (err) {
      setError('Add failed');
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet.id);
    setForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
    });
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateSweet(editingSweet, form);
      setMessage('Sweet updated');
      resetForm();
      loadSweets();
    } catch (err) {
      setError('Update failed');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteSweet(id);
      setMessage('Sweet deleted');
      loadSweets();
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleRestock = async (id) => {
    const quantity = prompt('Enter restock quantity:');
    if (!quantity || isNaN(quantity) || quantity <= 0) return;
    setError('');
    try {
      await restockSweet(id, parseInt(quantity, 10));
      setMessage('Restocked successfully');
      loadSweets();
    } catch (err) {
      setError('Restock failed');
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      <form onSubmit={editingSweet ? handleUpdate : handleAdd}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" required />
        <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="Quantity" required />
        <button type="submit">{editingSweet ? 'Update Sweet' : 'Add Sweet'}</button>
        {editingSweet && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <ul>
        {sweets.map(sweet => (
          <li key={sweet.id}>
            <strong>{sweet.name}</strong> - {sweet.category} - ${sweet.price.toFixed(2)} - Qty: {sweet.quantity}
            <button onClick={() => handleEdit(sweet)}>Edit</button>
            <button onClick={() => handleDelete(sweet.id)}>Delete</button>
            <button onClick={() => handleRestock(sweet.id)}>Restock</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
