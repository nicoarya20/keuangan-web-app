import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Income {
  id: string;
  amount: number;
  category: string;
  date: string;
  recurring: boolean;
  note?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  tags?: string[];
}

export interface WishlistItem {
  id: string;
  name: string;
  targetPrice: number;
  currentProgress: number;
  priority: 'low' | 'medium' | 'high';
  note?: string;
}

export interface Saving {
  id: string;
  amount: number;
  goalName: string;
  date: string;
  type: 'saving' | 'investment';
}

interface FinanceContextType {
  incomes: Income[];
  expenses: Expense[];
  wishlist: WishlistItem[];
  savings: Saving[];
  addIncome: (income: Omit<Income, 'id'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  addWishlistItem: (item: Omit<WishlistItem, 'id'>) => Promise<void>;
  addSaving: (saving: Omit<Saving, 'id'>) => Promise<void>;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  deleteWishlistItem: (id: string) => Promise<void>;
  deleteSaving: (id: string) => Promise<void>;
  categoryBudgets: Record<string, number>;
  setCategoryBudget: (category: string, budget: number) => Promise<void>;
  isLoading: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const API_URL = 'http://127.0.0.1:4000/api';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [incRes, expRes, wishRes, savRes, budRes] = await Promise.all([
        fetch(`${API_URL}/incomes`),
        fetch(`${API_URL}/expenses`),
        fetch(`${API_URL}/wishlist`),
        fetch(`${API_URL}/savings`),
        fetch(`${API_URL}/budgets`),
      ]);

      const [inc, exp, wish, sav, bud] = await Promise.all([
        incRes.json(),
        expRes.json(),
        wishRes.json(),
        savRes.json(),
        budRes.json(),
      ]);

      setIncomes(inc);
      // Backend stores tags as comma-separated string, frontend expects array
      setExpenses(exp.map((e: any) => ({ ...e, tags: e.tags ? e.tags.split(',') : [] })));
      setWishlist(wish);
      setSavings(sav);
      
      const budgetsMap: Record<string, number> = {};
      bud.forEach((b: any) => {
        budgetsMap[b.category] = b.amount;
      });
      setCategoryBudgets(budgetsMap);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Gagal memuat data dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addIncome = async (income: Omit<Income, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(income),
      });
      if (!res.ok) throw new Error();
      const newIncome = await res.json();
      setIncomes((prev) => [newIncome, ...prev]);
      toast.success('Pendapatan berhasil ditambahkan.');
    } catch (error) {
      toast.error('Gagal menambahkan pendapatan.');
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      if (!res.ok) throw new Error();
      const newExpense = await res.json();
      setExpenses((prev) => [{ ...newExpense, tags: newExpense.tags ? newExpense.tags.split(',') : [] }, ...prev]);
      toast.success('Pengeluaran berhasil ditambahkan.');
    } catch (error) {
      toast.error('Gagal menambahkan pengeluaran.');
    }
  };

  const addWishlistItem = async (item: Omit<WishlistItem, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error();
      const newItem = await res.json();
      setWishlist((prev) => [newItem, ...prev]);
      toast.success('Wishlist berhasil ditambahkan.');
    } catch (error) {
      toast.error('Gagal menambahkan wishlist.');
    }
  };

  const addSaving = async (saving: Omit<Saving, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/savings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saving),
      });
      if (!res.ok) throw new Error();
      const newSaving = await res.json();
      setSavings((prev) => [newSaving, ...prev]);
      toast.success('Tabungan berhasil ditambahkan.');
    } catch (error) {
      toast.error('Gagal menambahkan tabungan.');
    }
  };

  const updateWishlistItem = async (id: string, updates: Partial<WishlistItem>) => {
    try {
      const res = await fetch(`${API_URL}/wishlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      setWishlist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      toast.success('Wishlist berhasil diperbarui.');
    } catch (error) {
      toast.error('Gagal memperbarui wishlist.');
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/incomes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setIncomes((prev) => prev.filter((item) => item.id !== id));
      toast.success('Pendapatan berhasil dihapus.');
    } catch (error) {
      toast.error('Gagal menghapus pendapatan.');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      toast.success('Pengeluaran berhasil dihapus.');
    } catch (error) {
      toast.error('Gagal menghapus pengeluaran.');
    }
  };

  const deleteWishlistItem = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/wishlist/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      toast.success('Wishlist berhasil dihapus.');
    } catch (error) {
      toast.error('Gagal menghapus wishlist.');
    }
  };

  const deleteSaving = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/savings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setSavings((prev) => prev.filter((item) => item.id !== id));
      toast.success('Tabungan berhasil dihapus.');
    } catch (error) {
      toast.error('Gagal menghapus tabungan.');
    }
  };

  const setCategoryBudget = async (category: string, amount: number) => {
    try {
      const res = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount }),
      });
      if (!res.ok) throw new Error();
      setCategoryBudgets((prev) => ({ ...prev, [category]: amount }));
      toast.success(`Anggaran ${category} berhasil diperbarui.`);
    } catch (error) {
      toast.error('Gagal memperbarui anggaran.');
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        expenses,
        wishlist,
        savings,
        addIncome,
        addExpense,
        addWishlistItem,
        addSaving,
        updateWishlistItem,
        deleteIncome,
        deleteExpense,
        deleteWishlistItem,
        deleteSaving,
        categoryBudgets,
        setCategoryBudget,
        isLoading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
