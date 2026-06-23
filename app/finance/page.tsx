"use client";

import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText, Plus, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FinancePage() {
  const { invoices, addInvoice, updateInvoice, projects } = useStore();
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

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 bg-[#FAF9F6] min-h-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
        <div>
          <h1 className="text-4xl font-serif font-semibold tracking-tight text-stone-900 mb-2">Finance & Invoices</h1>
          <p className="text-stone-500 font-medium tracking-wide text-sm">Track billables, create receipts, and monitor cash flow.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="bg-stone-900 text-white hover:bg-stone-800">
          <Plus className="w-4 h-4 mr-2" /> New Invoice
        </Button>
      </header>

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
                      className="text-xs border-stone-200 rounded bg-white text-stone-600 focus:ring-1 focus:ring-stone-400 py-1"
                      value={invoice.status}
                      onChange={(e) => updateInvoice(invoice.id, { status: e.target.value as any })}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                    </select>
                    <button 
                      onClick={() => useStore.getState().deleteInvoice(invoice.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-semibold px-2"
                    >
                      Delete
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
