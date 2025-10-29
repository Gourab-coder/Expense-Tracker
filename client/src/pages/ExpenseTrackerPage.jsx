import React, { useState, useMemo, use } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar/Navbar";
import Dashboard from "../components/Dashboard/Dashboard";
import AllExpenses from "../components/AllExpenses/AllExpenses";
import "./ExpenseTrackerPage.css";
import { useEffect } from "react";
import AddExpenseForm from "../components/ExpenseForm/AddExpenseForm";

const ExpenseTrackerPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const token = localStorage.getItem('token');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // --- Handlers for expenses ---
  const handleGetExpenseData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  }
  
  const handleAddExpense = async (form) => {
    const url = `${API_BASE_URL}/expenses/add`;
    try {
      const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // After adding, we should refetch or add the new expense to the state
    const newExpense = await response.json();
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    setActiveTab("allExpenses"); // Switch to all expenses to see the new one
    return newExpense;
    } catch (error) {
      console.error("Failed to add expense:", error);   
    }
  };
  
  const handleUpdateExpense = async (form) => {
    // Guard clause to prevent error if editingExpense is null
    if (!editingExpense) {
      console.error("Attempted to update without an expense selected.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/update/${editingExpense._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedExpense = await response.json();
      setExpenses(expenses.map(exp => exp._id === editingExpense._id ? { ...exp, ...updatedExpense } : exp));
      setEditingExpense(null);
      setActiveTab("allExpenses");
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };
  
  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // On successful deletion, filter the expense out of the local state
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };
  
  const handleEditExpense = (expense) => {
    // This function is now responsible for setting the expense to be edited.
    // The AllExpenses component will handle showing the form.
    setEditingExpense(expense);
    // We no longer need to switch tabs here.
    // setActiveTab("addExpense"); 
  };

  useEffect(() => {
    if (!token) {
      navigate('/auth'); 
    }
    handleGetExpenseData();
  }, []);
  
  // --- Memoized calculations for dashboard ---
  const { total, monthTotal, categoryCount } = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    
    const currentMonth = new Date().getMonth();
    const monthTotal = expenses
      .filter(exp => new Date(exp.date).getMonth() === currentMonth)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
      
    const categoryCount = new Set(expenses.map(exp => exp.category)).size;
    
    return { total, monthTotal, categoryCount };
  }, [expenses]);
  
  return (
    <div className="expense-tracker-page">
      <div>
        <Navbar />
      </div>
      <div>
        <div className="tabs">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeTab === "addExpense" ? "active" : ""}
            onClick={() => {
              setEditingExpense(null);
              setActiveTab("addExpense");
            }}
          >
            Add Expense
          </button>
          <button
            className={activeTab === "allExpenses" ? "active" : ""}
            onClick={() => setActiveTab("allExpenses")}
          >
            All Expenses
          </button>
        </div>
        {activeTab === "dashboard" && (
          <Dashboard 
            expenses={expenses} 
            total={total} 
            monthTotal={monthTotal} 
            categories={categoryCount} 
            onAddExpense={handleAddExpense} />
        )}
        {activeTab === "allExpenses" && (
          <AllExpenses 
            expenses={expenses} 
            onAddExpense={handleAddExpense}
            onUpdateExpense={(form) => handleUpdateExpense(form)} 
            onDeleteExpense={handleDeleteExpense} 
            onEdit={handleEditExpense} />
        )}
        {activeTab === "addExpense" && (
          <AddExpenseForm
            onClose={() => setActiveTab("allExpenses")}
            onSubmit={handleAddExpense}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseTrackerPage;
