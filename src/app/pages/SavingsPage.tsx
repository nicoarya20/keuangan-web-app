import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, PiggyBank, TrendingUp, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const SavingsPage: React.FC = () => {
  const { savings, addSaving, deleteSaving } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    goalName: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'saving' as 'saving' | 'investment',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!formData.goalName) {
      toast.error('Please enter a goal name');
      return;
    }

    addSaving({
      amount: parseFloat(formData.amount),
      goalName: formData.goalName,
      date: formData.date,
      type: formData.type,
    });

    setFormData({
      amount: '',
      goalName: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'saving',
    });
    setIsOpen(false);
    toast.success('Saving added successfully!');
  };

  const handleDelete = (id: string) => {
    deleteSaving(id);
    toast.success('Saving deleted');
  };

  const totalSavings = savings
    .filter((s) => s.type === 'saving')
    .reduce((sum, saving) => sum + saving.amount, 0);
  
  const totalInvestments = savings
    .filter((s) => s.type === 'investment')
    .reduce((sum, saving) => sum + saving.amount, 0);

  const totalAmount = totalSavings + totalInvestments;

  // Growth chart data
  const sortedSavings = [...savings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let cumulativeAmount = 0;
  const growthData = sortedSavings.map((saving) => {
    cumulativeAmount += saving.amount;
    return {
      date: format(parseISO(saving.date), 'MMM dd'),
      total: cumulativeAmount,
    };
  });

  // Goals breakdown
  const goalBreakdown = savings.reduce((acc, saving) => {
    acc[saving.goalName] = (acc[saving.goalName] || 0) + saving.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Savings & Investment</h1>
          <p className="text-sm lg:text-base text-gray-500 mt-1">Track your wealth growth</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Saving
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Saving/Investment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  placeholder="Emergency Fund, Retirement, etc."
                  value={formData.goalName}
                  onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'saving' | 'investment') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saving">Saving</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
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

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl">
                Add Saving
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 lg:p-5 bg-white rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Total Amount</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                Rp {totalAmount.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] lg:text-xs text-gray-500 mt-2">All savings & investments</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-5 bg-white rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Savings</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                Rp {totalSavings.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] lg:text-xs text-gray-500 mt-2">Safe deposits</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-5 bg-white rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Investments</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                Rp {totalInvestments.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] lg:text-xs text-gray-500 mt-2">Growth assets</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Growth Visualization</h3>
        {growthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '10px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} dot={{r: 3}} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            No savings data yet
          </div>
        )}
      </Card>

      {/* Goals Breakdown */}
      {Object.keys(goalBreakdown).length > 0 && (
        <Card className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Goals Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(goalBreakdown).map(([goal, amount]) => (
              <div key={goal} className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-xs lg:text-sm text-purple-700 font-medium truncate">{goal}</p>
                <p className="text-lg lg:text-xl font-bold text-purple-900 mt-1">
                  Rp {amount.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Savings List */}
      <Card className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">All Savings & Investments</h3>
        <div className="space-y-3">
          {savings.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              No savings records yet. Start building your wealth!
            </p>
          ) : (
            savings.map((saving) => (
              <div
                key={saving.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 lg:gap-4 flex-1">
                  <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      saving.type === 'saving' ? 'bg-green-50' : 'bg-indigo-50'
                    }`}
                  >
                    {saving.type === 'saving' ? (
                      <PiggyBank className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                    ) : (
                      <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{saving.goalName}</p>
                      <span
                        className={`px-2 py-0.5 text-[10px] lg:text-xs rounded-full ${
                          saving.type === 'saving'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {saving.type.charAt(0).toUpperCase() + saving.type.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {format(parseISO(saving.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-lg lg:text-xl font-bold text-purple-600">
                      +Rp {saving.amount.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(saving.id)}
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
