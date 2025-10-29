import React, { useState } from "react";
import "./AllExpenses.css"; // Make sure this import exists
import { FaTrashAlt, FaFilter } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import AddExpenseForm from "../ExpenseForm/AddExpenseForm";
import UpdateExpenseForm from "../ExpenseForm/UpdateExpenseForm";

const AllExpenses = ({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense, onEdit }) => {
  const [addExpense, setAddExpense] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Date");
  const [editingId, setEditingId] = useState(null); // Track which expense is being edited

  const filteredExpenses = expenses
    .filter((expense) =>
      expense.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (expense) =>
        categoryFilter === "All Categories" ||
        expense.category === categoryFilter
    )
    .sort((a, b) => {
      if (sortBy === "Date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "Amount") return b.amount - a.amount;
      return 0;
    });

  const uniqueCategories = [
    "All Categories",
    ...new Set(expenses.map((e) => e.category)),
  ];

  return (
    <div className="all-expenses">
      <div className="expenses-header">
        <h2>All Expenses</h2>
        <button className="add-expense-btn" onClick={() => setAddExpense(true)}>
          <IoMdAdd /> Add Expense
        </button>
      </div>
      {addExpense && (
        <div className="add-expense-modal">
          <AddExpenseForm
            onClose={() => setAddExpense(false)}
            onSubmit={onAddExpense}
          />
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-dropdowns">
          <div className="dropdown">
            <FaFilter className="icon" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Date">Date</option>
            <option value="Amount">Amount</option>
          </select>
        </div>
      </div>

      {/* Expense List */}
      <div className="expense-list">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div key={expense._id} className="expense-item">
              <div>
                <h4>{expense.title}</h4>
                <span className="category-tag">{expense.category}</span>
                <p className="date">
                  {new Date(expense.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="expense-right">
                <p className="amount">₹{expense.amount.toFixed(2)}</p>
                <button className="expense-edit" onClick={() => {
                  onEdit(expense); // Set the expense to be edited in the parent state
                  setEditingId(expense._id); // Open the modal for this expense
                }}>
                  Edit
                </button>
                {editingId === expense._id && (
                  <div>
                    <UpdateExpenseForm
                      onClose={() => setEditingId(null)}
                      onSubmit={onUpdateExpense}
                      initialData={expense}
                    />
                  </div>
                )}
                <FaTrashAlt
                  className="delete-icon"
                  onClick={() => onDeleteExpense(expense._id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="no-expenses">No expenses found.</p>
        )}
      </div>
    </div>
  );
};

export default AllExpenses;
