const API_URL = "http://localhost:8000/api/sweets";

export const fetchSweets = async ({ name, category, priceMin, priceMax, sort }) => {
  let query = [];
  if (name) query.push(`name=${encodeURIComponent(name)}`);
  if (category) query.push(`category=${encodeURIComponent(category)}`);
  if (priceMin) query.push(`price_min=${priceMin}`);
  if (priceMax) query.push(`price_max=${priceMax}`);
  if (sort) query.push(`sort=${encodeURIComponent(sort)}`);
  
  const queryString = query.length ? `?${query.join('&')}` : '';
  
  const res = await fetch(`/api/sweets${queryString}`);
  if (!res.ok) throw new Error("Failed to fetch sweets");
  return await res.json();
};

export const addSweet = async (sweetData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sweetData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to add sweet");
  }
  return res.json();
};

export const updateSweet = async (id, sweetData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sweetData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to update sweet");
  }
  return res.json();
};

export const deleteSweet = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete sweet");
  }
};

export const purchaseSweet = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}/purchase`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to purchase sweet");
  }
};

export const restockSweet = async (id, quantity) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}/restock?quantity=${quantity}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to restock sweet");
  }
};

