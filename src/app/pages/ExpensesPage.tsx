import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, TrendingDown, Trash2, AlertCircle, Settings } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { Progress } from '../components/ui/progress';

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Other',
];

export const ExpensesPage: React.FC = () => {
  const { expenses, addExpense, deleteExpense, categoryBudgets, setCategoryBudget, isLoading } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState('Food & Dining');
  const [budgetAmount, setBudgetAmount] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Dining',
    date: format(new Date(), 'yyyy-MM-dd'),
    note: '',
    tags: '',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    addExpense({
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      note: formData.note,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
    });

    setFormData({
      amount: '',
      category: 'Food & Dining',
      date: format(new Date(), 'yyyy-MM-dd'),
      note: '',
      tags: '',
    });
    setIsOpen(false);
    toast.success('Expense added successfully!');
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    toast.success('Expense deleted');
  };

  const handleSetBudget = () => {
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }
    setCategoryBudget(budgetCategory, parseFloat(budgetAmount));
    setBudgetAmount('');
    setIsBudgetOpen(false);
    toast.success(`Budget set for ${budgetCategory}`);
  };

  // Monthly calculations
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = parseISO(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });

  const totalExpense = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Category breakdown
  const categoryBreakdown = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Expense Tracking</h1>
          <p className="text-sm lg:text-base text-gray-500 mt-1">Monitor your spending</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isBudgetOpen} onOpenChange={setIsBudgetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl w-full sm:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                Set Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set Category Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget-category">Category</Label>
                  <Select value={budgetCategory} onValueChange={setBudgetCategory}>
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
                  <Label htmlFor="budget-amount">Monthly Budget (Rp)</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    placeholder="1000000"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <Button
                  onClick={handleSetBudget}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Set Budget
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 rounded-xl w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
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
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Input
                    id="note"
                    placeholder="What did you buy?"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (Optional, comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="lunch, work"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-xl">
                  Add Expense
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <Card className="p-4 lg:p-5 bg-white rounded-2xl shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs lg:text-sm text-gray-600">Total Expenses (This Month)</p>
            <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
              Rp {totalExpense.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] lg:text-xs text-gray-500 mt-2">{monthlyExpenses.length} transactions</p>
          </div>
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
          </div>
        </div>
      </Card>

      {/* Category Budgets */}
      {Object.keys(categoryBudgets).length > 0 && (
        <Card className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
          <div className="space-y-4">
            {Object.entries(categoryBudgets).map(([category, budget]) => {
              const spent = categoryBreakdown[category] || 0;
              const percentage = (spent / budget) * 100;
              const isOverBudget = percentage > 100;
              const isWarning = percentage > 80 && percentage <= 100;

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs lg:text-sm font-medium text-gray-700 truncate mr-2">{category}</span>
                    <span className="text-[10px] lg:text-sm text-gray-500 whitespace-nowrap">
                      Rp {spent.toLocaleString('id-ID')} / Rp {budget.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={`h-1.5 lg:h-2 ${
                      isOverBudget
                        ? '[&>div]:bg-red-500'
                        : isWarning
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-green-500'
                    }`}
                  />
                  {isOverBudget && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] lg:text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>Over budget by Rp {(spent - budget).toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Expense List */}
      <Card className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">All Expenses</h3>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              No expense records yet. Track your first expense!
            </p>
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
                    <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{expense.category}</p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {format(parseISO(expense.date), 'MMM dd, yyyy')}
                    </p>
                    {expense.note && (
                      <p className="text-xs lg:text-sm text-gray-600 mt-1 line-clamp-1">{expense.note}</p>
                    )}
                    {expense.tags && expense.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {expense.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] lg:text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
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
};
