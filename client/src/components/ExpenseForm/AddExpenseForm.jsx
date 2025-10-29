import React, { useState } from "react";
import "./AddExpenseForm.css";
import { useNavigate } from "react-router-dom";

const AddExpenseForm = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    amount: "",
    title: "",
    category: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    description: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/auth');
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(form);
      onClose(); // Close the modal after saving
    } catch (error) {
      console.log("Failed to add expense:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Expense</h3>
          <button onClick={onClose} className="close-btn">✖</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Enter expense description..."
            value={form.description}
            onChange={handleChange}
          ></textarea>

          <div className="modal-actions">
            <button type="submit" className="primary">Add</button>
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
