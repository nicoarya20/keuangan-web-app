import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
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
    date: new Date().toISOString().split('T')[0],
    type: 'saving' as 'saving' | 'investment',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.goalName || !formData.date) return;

    await addSaving({
      amount: parseFloat(formData.amount),
      goalName: formData.goalName,
      date: formData.date,
      type: formData.type,
    });

    setFormData({
      amount: '',
      goalName: '',
      date: new Date().toISOString().split('T')[0],
      type: 'saving',
    });
    setIsOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteSaving(id);
    }
  };

  const totalSavings = savings
    .filter((s) => s.type === 'saving')
    .reduce((sum, s) => sum + s.amount, 0);
  
  const totalInvestments = savings
    .filter((s) => s.type === 'investment')
    .reduce((sum, s) => sum + s.amount, 0);

  // Chart data
  const chartData = [...savings]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(s => ({
      date: format(parseISO(s.date), 'MMM dd'),
      amount: s.amount,
      type: s.type
    }));

  return (
    <div className="space-y-6 lg:space-y-8 max-w-5xl mx-auto pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Savings & Investments</h1>
          <p className="text-sm lg:text-base text-gray-500 mt-1">Track your progress towards financial goals</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Saving</DialogTitle>
              <DialogDescription>
                Set a goal for your future savings and investments.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="goalName">Goal / Investment Name</Label>
                <Input
                  id="goalName"
                  placeholder="Emergency Fund"
                  value={formData.goalName}
                  onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>

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
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
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

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                Save Record
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 lg:p-5 bg-white rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Total Savings</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                Rp {totalSavings.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-5 bg-white rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs lg:text-sm text-gray-600">Total Investments</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
                Rp {totalInvestments.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Growth Overview</h3>
        <div className="h-[200px] lg:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis hide />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">History</h3>
        <div className="space-y-3">
          {savings.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No records yet.</p>
          ) : (
            savings.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.type === 'saving' ? 'bg-indigo-50' : 'bg-green-50'
                  }`}>
                    {item.type === 'saving' ? (
                      <PiggyBank className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">{item.goalName}</p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {format(parseISO(item.date), 'MMM dd, yyyy')} • {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm lg:text-base font-bold text-gray-900">
                    Rp {item.amount.toLocaleString('id-ID')}
                  </p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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
