import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";
import AddExpenseForm from "../ExpenseForm/AddExpenseForm";

const Dashboard = ({ total, monthTotal, categories, expenses, onAddExpense }) => {
  const [addExpense, setAddExpense] = React.useState(false);

  // Group expenses by category
  const categoryData = Object.values(
    expenses.reduce((acc, expense) => {
      const cat = expense.category || "Uncategorized";
      if (!acc[cat]) acc[cat] = { name: cat, value: 0 };
      acc[cat].value += Number(expense.amount);
      return acc;
    }, {})
  );

  // Prepare last 7 days spending data
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayExpenses = expenses.filter((e) => e.date === dateStr);
    const totalAmount = dayExpenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );
    return { date: d.getDate(), amount: totalAmount };
  });

  const COLORS = ["#0b0b14", "#4a90e2", "#50e3c2", "#f5a623", "#e94e77"];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Expense Tracker</h2>
          <p>Track your spending and stay within budget</p>
        </div>
        <button className="add-btn" onClick={()=>setAddExpense(true)}>+ Add Expense</button>
      </div>
      {addExpense && (
        <div className="add-expense-modal">
          <AddExpenseForm onClose={() => setAddExpense(false)} onSubmit={onAddExpense} />
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <span>💸 Total Expenses</span>
          <h3>₹{total.toFixed(2)}</h3>
        </div>
        <div className="card">
          <span>📅 This Month</span>
          <h3>₹{monthTotal.toFixed(2)}</h3>
        </div>
        <div className="card">
          <span>📈 Categories</span>
          <h3>{categories}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-card">
          <h4>Spending by Category</h4>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No expenses yet.</p>
          )}
        </div>

        <div className="chart-card">
          <h4>Daily Spending (Last 7 Days)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0b0b14"
                strokeWidth={2}
                dot={{ fill: "#0b0b14" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

