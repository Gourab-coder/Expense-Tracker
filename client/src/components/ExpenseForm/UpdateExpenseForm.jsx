import React, { useState, useEffect } from "react";
import "./AddExpenseForm.css";
import { useNavigate } from "react-router-dom";

const UpdateExpenseForm = ({ onClose, onSubmit, initialData: existingExpense }) => {
  const getInitialFormState = () => ({
    amount: "",
    title: "",
    category: "",
    date: "",
    description: "",
  });

  const [form, setForm] = useState(getInitialFormState());
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/auth');
  }

  useEffect(() => {
    if (existingExpense) {
      const formattedDate = existingExpense.date
        ? new Date(existingExpense.date).toISOString().split("T")[0]
        : "";
      setForm({ ...getInitialFormState(), date: formattedDate });
    }
  }, [existingExpense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For editing, merge new values with existing ones.
      // If a form field is empty, use the existing value.
      const dataToSend = {
        title: form.title || existingExpense.title,
        amount: form.amount || existingExpense.amount,
        category: form.category || existingExpense.category,
        date: form.date, // Date is always taken from the form's state
        description: form.description
      };

      await onSubmit(dataToSend);
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Expense</h3>
          <button onClick={onClose} className="close-btn">✖</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder={existingExpense.title}
            value={form.title}
            onChange={handleChange}
          />
          <input
            type="number"
            name="amount"
            placeholder={String(existingExpense.amount)}
            value={form.amount}
            onChange={handleChange}
          />
          <select
            name="category"
            value={form.category || existingExpense.category}
            onChange={handleChange}
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
          />
          <textarea
            name="description"
            placeholder={existingExpense.description || "Enter expense description..."}
            value={form.description}
            onChange={handleChange}
          ></textarea>

          <div className="modal-actions">
            <button type="submit" className="primary">Update</button>
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpenseForm;
