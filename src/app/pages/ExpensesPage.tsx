import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, TrendingDown, Trash2, AlertCircle, Settings } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { Progress } from '../components/ui/progress';

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Wellness',
  'Education',
  'Gift & Donation',
  'Other',
];

export const ExpensesPage: React.FC = () => {
  const { expenses, addExpense, deleteExpense, categoryBudgets, setCategoryBudget } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: EXPENSE_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    note: '',
    tags: '',
  });

  const [budgetData, setBudgetData] = useState({
    category: EXPENSE_CATEGORIES[0],
    amount: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) return;

    await addExpense({
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      note: formData.note,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
    });

    setFormData({
      amount: '',
      category: EXPENSE_CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      note: '',
      tags: '',
    });
    setIsOpen(false);
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetData.amount) return;

    await setCategoryBudget(budgetData.category, parseFloat(budgetData.amount));
    setBudgetData({ category: EXPENSE_CATEGORIES[0], amount: '' });
    setIsBudgetOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  // Calculate stats
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(exp => {
    const date = parseISO(exp.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).reduce((sum, exp) => sum + exp.amount, 0);

  // Budget tracking
  const budgetStats = Object.entries(categoryBudgets).map(([category, limit]) => {
    const spent = expenses
      .filter(exp => {
        const date = parseISO(exp.date);
        return exp.category === category && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { category, limit, spent, percentage: Math.min((spent / limit) * 100, 100) };
  });

  return (
    <div className="space-y-6 lg:space-y-8 max-w-5xl mx-auto pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm lg:text-base text-gray-500 mt-1">Manage your spending and budgets</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsBudgetOpen(true)}
            className="rounded-xl flex-1 sm:flex-none"
          >
            <Settings className="w-4 h-4 mr-2" />
            Set Budgets
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Add a new spending record to track your expenses.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (Rp)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (Comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="food, lunch, office"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input
                    id="note"
                    placeholder="What was this for?"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                  Add Expense
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Modal */}
      <Dialog open={isBudgetOpen} onOpenChange={setIsBudgetOpen}>
        <DialogContent className="rounded-2xl sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Category Budgets</DialogTitle>
            <DialogDescription>
              Set a monthly spending limit for each category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBudgetSubmit} className="space-y-4">
            <div>
              <Label htmlFor="budget-category">Category</Label>
              <Select
                value={budgetData.category}
                onValueChange={(value) => setBudgetData({ ...budgetData, category: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget-amount">Monthly Limit (Rp)</Label>
              <Input
                id="budget-amount"
                type="number"
                placeholder="2000000"
                value={budgetData.amount}
                onChange={(e) => setBudgetData({ ...budgetData, amount: e.target.value })}
                className="rounded-xl"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl">
              Save Budget
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 lg:p-5 bg-white rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Total Monthly Spending</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                Rp {monthlyExpenses.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] lg:text-xs text-gray-500 mt-2">Current month</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-5 bg-white rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Active Budgets</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                {Object.keys(categoryBudgets).length} Categories
              </p>
              <p className="text-[10px] lg:text-xs text-gray-500 mt-2">Monitoring limits</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Budgets Progress */}
      {budgetStats.length > 0 && (
        <Card className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Budget Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetStats.map((stat) => (
              <div key={stat.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{stat.category}</span>
                  <span className="text-gray-500">
                    Rp {stat.spent.toLocaleString('id-ID')} / {stat.limit.toLocaleString('id-ID')}
                  </span>
                </div>
                <Progress 
                  value={stat.percentage} 
                  className="h-2"
                  // indicatorClassName={stat.percentage > 90 ? 'bg-red-500' : stat.percentage > 70 ? 'bg-amber-500' : 'bg-green-500'}
                />
                <p className="text-[10px] lg:text-xs text-right text-gray-400">
                  {stat.percentage.toFixed(1)}% used
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Expense List */}
      <Card className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No expenses yet. Start tracking your spending!</p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 lg:gap-4 flex-1">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{expense.category}</p>
                      {expense.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] lg:text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {format(parseISO(expense.date), 'MMM dd, yyyy')}
                    </p>
                    {expense.note && (
                      <p className="text-xs lg:text-sm text-gray-600 mt-1 line-clamp-1">{expense.note}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-lg lg:text-xl font-bold text-red-600">
                      -Rp {expense.amount.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
