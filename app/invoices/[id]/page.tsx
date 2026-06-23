"use client";

import { useStore } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Download, Printer, Send, CreditCard, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function InvoicePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { invoices, identity, updateInvoice } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const invoice = invoices.find(i => i.id === id);

  if (!mounted) return <div className="p-12 text-stone-500">Loading...</div>;
  if (!invoice) return <div className="p-12 text-stone-500">Invoice not found.</div>;

  const invoiceIdStr = `INV-${invoice.id.slice(0, 8).toUpperCase()}`;

  const sendEmail = async () => {
    setIsSending(true);
    try {
      const subject = `Invoice ${invoiceIdStr} from ${identity?.name || 'Agency'}`;
      const body = `Hi ${invoice.clientName},\n\nPlease find your invoice ${invoiceIdStr} linked here for the amount of ₦${invoice.amount.toFixed(2)}.\n\nThank you,\n${identity?.name || 'Agency'}`;

      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: invoice.clientEmail,
          subject,
          text: body,
        }),
      });

      if (!res.ok) {
        // Fallback to mailto if API fails (e.g. no API key)
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        window.location.assign(`mailto:${invoice.clientEmail}?subject=${encodedSubject}&body=${encodedBody}`);
      } else {
        alert('Invoice sent to client!');
      }
      updateInvoice(invoice.id, { status: 'sent' });
    } catch (e) {
      console.error(e);
      alert('Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  const taxAmount = invoice.amount * 0.15; // 15% tax example
  const subtotal = invoice.amount;
  const total = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-[#F2EBE1] p-4 md:p-8 flex items-center justify-center relative font-sans text-[#3A1F1B]">
      <button onClick={() => router.back()} className="absolute top-4 left-4 p-2 text-[#3A1F1B]/60 hover:text-[#3A1F1B] hover:bg-[#EAE1D3] rounded transition-colors hidden md:block">
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Invoice Document */}
      <div className="w-full max-w-[800px] bg-[#FEFCFA] rounded-[24px] overflow-hidden shadow-xl shadow-stone-900/5 mb-24 print:shadow-none print:mb-0 print:bg-white relative">
        <div className="h-48 w-full bg-[#EAE1D3] relative overflow-hidden m-6 mb-8 rounded-[16px] w-[calc(100%-48px)]">
          {/* Default desert placeholder, like the reference */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1682687982501-1e5898cb8f4b?q=80&w=2070&auto=format&fit=crop" 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-10 pb-12">
          <div className="flex justify-between items-start mb-16">
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-2 text-[#3A1F1B]">INVOICE</h1>
              <p className="text-xl font-medium tracking-wide text-[#3A1F1B]/70">{invoiceIdStr}</p>
            </div>
            <div className="w-12 h-12 bg-[#1B110F] text-white rounded-full flex items-center justify-center font-serif text-xl font-bold">
              {identity?.name ? identity.name[0] : 'A'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12 text-sm">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#3A1F1B]/50 pb-2 border-b border-[#3A1F1B]/10 mb-4">From</h3>
              <p className="font-semibold text-lg mb-1">{identity?.name || 'Agency Name'}</p>
              <p className="text-[#3A1F1B]/70 leading-relaxed font-mono text-xs mt-2">
                {identity?.email || 'hello@agency.com'}<br/>
                1547 Wilson Street<br/>
                San Diego, CA, US<br/>
                +1 234 5678
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#3A1F1B]/50 pb-2 border-b border-[#3A1F1B]/10 mb-4">To</h3>
              <p className="font-semibold text-lg mb-1">{invoice.clientName}</p>
              <p className="text-[#3A1F1B]/70 leading-relaxed font-mono text-xs mt-2">
                {invoice.clientEmail}
              </p>
            </div>
          </div>

          <div className="flex gap-12 mb-16 text-xs font-mono font-medium tracking-wide text-[#3A1F1B]">
            <div>
              <span className="text-[#3A1F1B]/50 mr-2">DATE:</span> {format(new Date(invoice.createdAt), 'MMM d, yyyy').toUpperCase()}
            </div>
            <div>
              <span className="text-[#3A1F1B]/50 mr-2">DUE:</span> {format(new Date(invoice.dueDate), 'MMM d, yyyy').toUpperCase()}
            </div>
          </div>

          {/* Table */}
          <div className="mb-8">
            <div className="grid grid-cols-12 border-b-2 border-[#3A1F1B]/20 pb-3 text-[10px] uppercase font-bold tracking-widest text-[#3A1F1B]/50">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map(item => (
                <div key={item.id} className="grid grid-cols-12 border-b border-[#3A1F1B]/10 py-5 text-sm font-medium">
                  <div className="col-span-6">{item.description}</div>
                  <div className="col-span-2 text-right font-mono text-[#3A1F1B]/70">{item.quantity}</div>
                  <div className="col-span-2 text-right font-mono text-[#3A1F1B]/70">₦{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-semibold">₦{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-12 border-b border-[#3A1F1B]/10 py-5 text-sm font-medium">
                <div className="col-span-6">General Services</div>
                <div className="col-span-2 text-right font-mono text-[#3A1F1B]/70">1</div>
                <div className="col-span-2 text-right font-mono text-[#3A1F1B]/70">₦{subtotal.toFixed(2)}</div>
                <div className="col-span-2 text-right font-semibold">₦{subtotal.toFixed(2)}</div>
              </div>
            )}

            <div className="w-1/2 ml-auto mt-6">
              <div className="grid grid-cols-2 py-2 text-sm text-[#3A1F1B]/70">
                <div className="text-right pr-6">Subtotal</div>
                <div className="text-right font-mono">₦{subtotal.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 py-2 border-b border-[#3A1F1B]/20 text-sm text-[#3A1F1B]/70">
                <div className="text-right pr-6">Tax (15%)</div>
                <div className="text-right font-mono">₦{taxAmount.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 py-4 text-lg font-bold">
                <div className="text-right pr-6">TOTAL</div>
                <div className="text-right">₦{total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#3A1F1B]/70 space-y-6">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#3A1F1B]/50 mb-2">Payment Details</h4>
              <p className="font-mono">Method: Bank Transfer<br/>Bank: SVB<br/>Account: 1234 5678 9877 1235<br/>Routing/SWIFT: EU0012</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#3A1F1B]/50 mb-2">Notes</h4>
              <p>Thank you for your business!</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#3A1F1B]/50 mb-2">Terms & Conditions</h4>
              <p className="max-w-2xl leading-relaxed">Payment is due within the specified due date. Late payments may incur a penalty of 1.5% per month. All prices are exclusive of applicable taxes unless otherwise stated. This invoice is subject to the laws of the issuing jurisdiction.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1B110F] text-[#FEFCFA] px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 print:hidden">
        <div className="flex items-center gap-4 border-r border-[#FEFCFA]/20 pr-6">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-[#1B110F]">
             {identity?.name ? identity.name[0] : 'A'}
          </div>
          <div>
            <div className="text-[10px] font-mono opacity-60 tracking-wider">{invoiceIdStr}</div>
            <div className="font-bold">₦{total.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={() => {
            try {
              window.print();
            } catch (e) {
              alert("Printing is disabled in this preview environment. Please open the app in a new tab to print, or use your browser's print function.");
            }
          }} className="p-2 hover:bg-black/5 rounded-full transition-colors" title="Print">
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={() => {
             alert("To save as PDF, click print and select 'Save as PDF' as the destination."); 
             try { window.print(); } catch (e) {} 
          }} className="p-2 hover:bg-black/5 rounded-full transition-colors" title="Download PDF">
            <Download className="w-4 h-4" />
          </button>
        </div>

        <Button onClick={sendEmail} disabled={isSending} variant="default" className="bg-[#FEFCFA] hover:bg-[#EAE1D3] text-[#1B110F] font-semibold rounded-full px-6 flex items-center gap-2">
          <Send className="w-4 h-4" />
          {isSending ? 'Sending...' : 'Send Email'}
        </Button>
      </div>
    </div>
  );
}
