import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Heart, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '../components/ui/progress';

export const WishlistPage: React.FC = () => {
  const { wishlist, addWishlistItem, deleteWishlistItem, updateWishlistItem } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetPrice: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetPrice) return;

    await addWishlistItem({
      name: formData.name,
      targetPrice: parseFloat(formData.targetPrice),
      priority: formData.priority,
      note: formData.note,
      currentProgress: 0,
    });

    setFormData({
      name: '',
      targetPrice: '',
      priority: 'medium',
      note: '',
    });
    setIsOpen(false);
  };

  const handleUpdateProgress = async (id: string, current: number, target: number) => {
    const amount = window.prompt('Enter amount to add (Rp):');
    if (amount) {
      const newProgress = Math.min(current + parseFloat(amount), target);
      await updateWishlistItem(id, { currentProgress: newProgress });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      await deleteWishlistItem(id);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-5xl mx-auto pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Wishlist</h1>
          <p className="text-sm lg:text-base text-gray-500 mt-1">Items you're saving up for</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Wishlist</DialogTitle>
              <DialogDescription>
                Add something you want to buy and track your progress.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="New laptop, vacation, etc."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetPrice">Target Price (Rp)</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  placeholder="5000000"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Why do you want this?"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                Add to Wishlist
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {wishlist.length === 0 ? (
        <Card className="p-12 bg-white rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Start adding items you want to save for!</p>
          <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
            Add Your First Item
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlist.map((item) => {
            const percentage = Math.min((item.currentProgress / item.targetPrice) * 100, 100);
            return (
              <Card key={item.id} className="p-5 lg:p-6 bg-white rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                      <span className={`px-2 py-0.5 text-[10px] lg:text-xs rounded-full ${
                        item.priority === 'high' ? 'bg-red-100 text-red-700' :
                        item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.note || 'No description'}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Rp {item.currentProgress.toLocaleString('id-ID')}</span>
                    <span className="text-gray-400">Target: Rp {item.targetPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                  <p className="text-right text-xs font-bold text-indigo-600">{percentage.toFixed(1)}%</p>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={() => handleUpdateProgress(item.id, item.currentProgress, item.targetPrice)}
                    className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl shadow-none"
                    disabled={percentage >= 100}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {percentage >= 100 ? 'Goal Reached!' : 'Add Savings'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
