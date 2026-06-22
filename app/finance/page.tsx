"use client";

import { useStore } from '@/lib/store';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { FileText, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function FinancePage() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, projects } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [isCreating, setIsCreating] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    clientEmail: '',
    projectId: '',
    amount: '',
    dueDate: ''
  });

  const revenueData = useMemo(() => {
    const monthlyAcc: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(m => monthlyAcc[m] = 0);

    invoices.forEach(inv => {
      if (inv.status === 'paid' || inv.status === 'sent') {
        try {
          const date = new Date(inv.dueDate); // Use dueDate or you could use created_at if available
          const month = format(date, 'MMM');
          monthlyAcc[month] += Number(inv.amount) || 0;
        } catch {
          // ignore invalid dates
        }
      }
    });

    return months.map(month => ({
      month,
      revenue: monthlyAcc[month]
    }));
  }, [invoices]);

  if (!mounted) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      clientName: newInvoice.clientName,
      clientEmail: newInvoice.clientEmail,
      projectId: newInvoice.projectId,
      amount: parseFloat(newInvoice.amount) || 0,
      dueDate: newInvoice.dueDate || new Date().toISOString(),
      status: 'draft',
      items: []
    });
    setIsCreating(false);
    setNewInvoice({ clientName: '', clientEmail: '', projectId: '', amount: '', dueDate: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 bg-[#FAF9F6] dark:bg-stone-900 min-h-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50 dark:border-stone-800">
        <div>
          <h1 className="text-4xl font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-100 mb-2">Finance & Invoices</h1>
          <p className="text-stone-500 font-medium tracking-wide text-sm">Track billables, create receipts, and monitor cash flow.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="bg-stone-900 text-white hover:bg-stone-800">
          <Plus className="w-4 h-4 mr-2" /> New Invoice
        </Button>
      </header>

      {/* Analytics Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <h3 className="text-stone-500 font-medium text-sm mb-2 uppercase tracking-wide">Projected Annual Revenue</h3>
          <p className="text-4xl font-semibold text-stone-900 dark:text-stone-100">₦{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-stone-400 mt-2">Based on sent & paid invoices</p>
        </div>
        <div className="md:col-span-2 bg-white border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm h-72">
          <h3 className="text-stone-700 font-medium text-sm mb-6">Revenue Projections (₦)</h3>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEFEF" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} tickFormatter={(val) => `₦${val}`} />
                <Tooltip 
                  cursor={{ fill: '#F5F5F4' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E5E5', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#1c1917" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {isCreating && (
        <section className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          <h3 className="font-serif text-2xl font-semibold text-stone-800 mb-6">Draft Invoice</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Client Name</label>
              <input required type="text" className="w-full border border-stone-200 rounded-md h-11 px-3 text-sm focus:ring-1 focus:ring-stone-400 focus:outline-none" value={newInvoice.clientName} onChange={e => setNewInvoice({...newInvoice, clientName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Client Email</label>
              <input required type="email" className="w-full border border-stone-200 rounded-md h-11 px-3 text-sm focus:ring-1 focus:ring-stone-400 focus:outline-none" value={newInvoice.clientEmail} onChange={e => setNewInvoice({...newInvoice, clientEmail: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Amount (₦)</label>
              <input required type="number" min="0" step="0.01" className="w-full border border-stone-200 rounded-md h-11 px-3 text-sm focus:ring-1 focus:ring-stone-400 focus:outline-none" value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Due Date</label>
              <input required type="date" className="w-full border border-stone-200 rounded-md h-11 px-3 text-sm focus:ring-1 focus:ring-stone-400 focus:outline-none" value={newInvoice.dueDate} onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})} />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-4">
              <Button type="submit" className="bg-stone-900 border-none text-white whitespace-nowrap">Save Draft</Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </form>
        </section>
      )}

      {invoices.length === 0 ? (
        <div className="p-12 text-center border font-medium border-dashed border-stone-300 rounded-2xl bg-white text-stone-500">
          No invoices yet.
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-stone-600 text-xs uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 font-semibold text-stone-600 text-xs uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 font-semibold text-stone-600 text-xs uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 font-semibold text-stone-600 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-stone-600 text-xs uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 font-semibold text-stone-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-stone-500 text-xs">
                    <a href={`/invoices/${invoice.id}`} className="hover:underline hover:text-stone-900 font-semibold text-stone-700">
                      INV-{invoice.id.slice(0, 6).toUpperCase()}
                    </a>
                  </td>
                  <td className="px-6 py-4 font-medium text-stone-800">
                    {invoice.clientName}
                    <div className="text-xs text-stone-400 font-normal">{invoice.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-stone-700">₦{invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-500 font-mono text-xs">{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <select 
                      className="text-xs border-stone-200 rounded bg-white text-stone-600 focus:ring-1 focus:ring-stone-400"
                      value={invoice.status}
                      onChange={(e) => updateInvoice(invoice.id, { status: e.target.value as any })}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                    </select>
                    <button
                      onClick={() => confirm('Delete this invoice?') && deleteInvoice(invoice.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded transition-colors"
                      title="Delete Invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
