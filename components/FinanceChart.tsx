"use client";

import { useStore } from '@/lib/store';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, isSameMonth, parseISO } from 'date-fns';

export function FinanceChart() {
  const invoices = useStore((state) => state.invoices);

  const data = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i));
    
    return months.map(month => {
      const monthInvoices = invoices.filter(inv => isSameMonth(parseISO(inv.createdAt), month));
      const paid = monthInvoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.items.reduce((a, b) => a + (b.rate * b.quantity), 0), 0);
      const pending = monthInvoices.filter(i => i.status === 'pending' || i.status === 'sent').reduce((acc, curr) => acc + curr.items.reduce((a, b) => a + (b.rate * b.quantity), 0), 0);
      
      return {
        name: format(month, 'MMM'),
        paid,
        pending
      };
    });
  }, [invoices]);

  const totalPaid = data.reduce((acc, curr) => acc + curr.paid, 0);

  return (
    <div className="w-full">
      <div className="mb-4">
        <span className="text-xs text-stone-500 font-semibold tracking-wider uppercase">6-Month Revenue</span>
        <div className="text-2xl font-sans font-bold text-stone-900 mt-1">₦{totalPaid.toLocaleString()}</div>
      </div>
      <div className="h-40 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A8A29E' }} dy={10} />
            <Tooltip 
              cursor={{ fill: '#F5F5F4' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E5E5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`₦${value.toLocaleString()}`, undefined]}
            />
            <Bar dataKey="paid" stackId="a" fill="#1C1917" radius={[0, 0, 4, 4]} name="Paid" />
            <Bar dataKey="pending" stackId="a" fill="#D6D3D1" radius={[4, 4, 0, 0]} name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
