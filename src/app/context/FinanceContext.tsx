import React, { createContext, useContext, useState, useEffect } from 'react';

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
  isLoading: boolean;
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
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/api';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [incomesRes, expensesRes, wishlistRes, savingsRes, budgetsRes] = await Promise.all([
        fetch(`${API_URL}/incomes`),
        fetch(`${API_URL}/expenses`),
        fetch(`${API_URL}/wishlist`),
        fetch(`${API_URL}/savings`),
        fetch(`${API_URL}/budgets`),
      ]);

      const [incomesData, expensesData, wishlistData, savingsData, budgetsData] = await Promise.all([
        incomesRes.json(),
        expensesRes.json(),
        wishlistRes.json(),
        savingsRes.json(),
        budgetsRes.json(),
      ]);

      setIncomes(incomesData);
      setExpenses(expensesData.map((e: any) => ({
        ...e,
        tags: e.tags ? e.tags.split(',') : []
      })));
      setWishlist(wishlistData);
      setSavings(savingsData);
      
      const budgetsRecord: Record<string, number> = {};
      budgetsData.forEach((b: any) => {
        budgetsRecord[b.category] = b.amount;
      });
      setCategoryBudgets(budgetsRecord);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const addIncome = async (income: Omit<Income, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(income),
      });
      const newIncome = await res.json();
      setIncomes((prev) => [newIncome, ...prev]);
    } catch (error) {
      console.error('Failed to add income:', error);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      const newExpense = await res.json();
      setExpenses((prev) => [{
        ...newExpense,
        tags: newExpense.tags ? newExpense.tags.split(',') : []
      }, ...prev]);
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const addWishlistItem = async (item: Omit<WishlistItem, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const newItem = await res.json();
      setWishlist((prev) => [newItem, ...prev]);
    } catch (error) {
      console.error('Failed to add wishlist item:', error);
    }
  };

  const addSaving = async (saving: Omit<Saving, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/savings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saving),
      });
      const newSaving = await res.json();
      setSavings((prev) => [newSaving, ...prev]);
    } catch (error) {
      console.error('Failed to add saving:', error);
    }
  };

  const updateWishlistItem = async (id: string, updates: Partial<WishlistItem>) => {
    try {
      const res = await fetch(`${API_URL}/wishlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedItem = await res.json();
      setWishlist((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
    } catch (error) {
      console.error('Failed to update wishlist item:', error);
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await fetch(`${API_URL}/incomes/${id}`, { method: 'DELETE' });
      setIncomes((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete income:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const deleteWishlistItem = async (id: string) => {
    try {
      await fetch(`${API_URL}/wishlist/${id}`, { method: 'DELETE' });
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete wishlist item:', error);
    }
  };

  const deleteSaving = async (id: string) => {
    try {
      await fetch(`${API_URL}/savings/${id}`, { method: 'DELETE' });
      setSavings((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete saving:', error);
    }
  };

  const setCategoryBudget = async (category: string, budget: number) => {
    try {
      await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount: budget }),
      });
      setCategoryBudgets((prev) => ({ ...prev, [category]: budget }));
    } catch (error) {
      console.error('Failed to set category budget:', error);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        expenses,
        wishlist,
        savings,
        isLoading,
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