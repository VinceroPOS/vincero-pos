'use client';
import { useState, useEffect, useMemo } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '112212') {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] bg-cream">
        <section className="bg-gradient-to-br from-[#2e1e19] to-[#684332] text-white p-12 md:p-[9vw_7vw] flex flex-col justify-center relative overflow-hidden">
          <div className="absolute w-[460px] h-[460px] border border-white/20 rounded-full -right-40 -bottom-48 shadow-[0_0_0_45px_rgba(255,255,255,0.03),0_0_0_90px_rgba(255,255,255,0.02)]"></div>
          <div className="mb-6 relative z-10">
            <img src="/logo.png" alt="THE CAFE VINCERO" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#d4af37] shadow-2xl object-cover bg-white" />
          </div>
          <h1 className="text-[clamp(30px,4vw,53px)] leading-[1.05] m-0 mb-4 tracking-[-1.6px] font-bold">THE CAFE<br/>VINCERO</h1>
          <p className="max-w-[410px] text-[#e0d2c7] leading-[1.8] relative z-10">A thoughtful cafe experience, managed beautifully. Orders, billing and daily performance — all in one place.</p>
          <div className="mt-10 text-xs text-[#d6c4b7] leading-[1.9] hidden md:block">22/A Kandy Road, Dalugama, Kelaniya<br/>0762478581<br/><br/>EST. 2026 • VINCERO POS</div>
        </section>
        <section className="grid place-items-center p-7">
          <div className="w-full max-w-[390px]">
            <div className="text-xs font-bold text-muted uppercase tracking-[1.6px] mb-1">Welcome back</div>
            <h2 className="text-[29px] font-bold m-0 mb-2">Sign in to POS</h2>
            <p className="text-muted m-0 mb-7">Enter your staff credentials to continue.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-muted uppercase tracking-[0.6px]">Username</label><input className="input-field" value={username} onChange={e=>setUsername(e.target.value)} required /></div>
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-muted uppercase tracking-[0.6px]">Password</label><input className="input-field" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" required /></div>
              <button className="btn btn-primary w-full py-3.5 mt-2" type="submit">Sign in →</button>
              {loginError && <div className="text-red text-xs mt-3">Incorrect username or password.</div>}
            </form>
          </div>
        </section>
      </div>
    );
  }

  return <MainApp onLogout={() => setIsLoggedIn(false)} />;
}

function MainApp({ onLogout }) {
  const [currentPage, setCurrentPage] = useState('pos');
  const [data, setData] = useState({ products: [], orders: [], tables: [], customers: [] });
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vincero_theme');
    if (saved === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('vincero_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('vincero_theme', 'light');
      }
      return next;
    });
  };

  const fetchData = () => {
    fetch(`/api/all?_t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const navItems = [
    { id: 'pos', icon: '▦', label: 'POS & Billing' },
    { id: 'orders', icon: '▤', label: 'Orders' },
    { id: 'menu', icon: '☕', label: 'Menu & Products' },
    { id: 'tables', icon: '▥', label: 'Tables' },
    { id: 'reports', icon: '📈', label: 'Sales Reports' },
    { id: 'customers', icon: '♙', label: 'Customers' },
    { id: 'settings', icon: '⚙', label: 'Settings' }
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-cream font-bold text-coffee">Loading Database...</div>;

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark text-[#f7ede3] bg-[#140e0c]' : 'text-[#2d2521] bg-cream'} font-sans`}>
      <aside className="w-[238px] bg-coffee dark:bg-[#100a08] text-white p-5 flex-col z-10 hidden md:flex h-full print:hidden">
        <div className="brand mb-6 border-b border-white/20 pb-5 flex flex-col items-center text-center">
          <img src="/logo.png" alt="THE CAFE VINCERO" className="w-16 h-16 rounded-full border-2 border-[#d4af37] shadow-lg mb-2.5 object-cover bg-white" />
          <h1 className="font-bold tracking-widest text-[15px] m-0">THE CAFE VINCERO</h1>
          <p className="text-[10px] text-[#d6c7ba] mt-0.5 tracking-widest font-semibold">EST. 2026 • MANAGEMENT</p>
        </div>
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`text-left px-3 py-3 rounded-lg font-semibold flex gap-3 items-center transition-colors ${currentPage === item.id ? 'bg-white/10 text-white' : 'text-[#d9ccc2] hover:bg-white/5 hover:text-white'}`}>
              <span className="w-5 text-center text-base">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-3 border-t border-white/10 mt-auto">
          <button
            onClick={toggleDarkMode}
            className="w-full text-left px-3 py-2.5 rounded-lg font-semibold flex items-center justify-between text-xs text-[#d9ccc2] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span>Theme Mode</span>
            <span className="px-2 py-0.5 rounded bg-white/10 font-bold">{darkMode ? '🌙 Dark' : '☀️ Light'}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full print:hidden">
        <header className="flex justify-between items-start mb-6 print:hidden">
          <div>
            <div className="text-[11px] font-extrabold text-muted uppercase tracking-[1.6px]">CAFE OPERATIONS</div>
            <h2 className="text-[25px] font-bold mt-1 tracking-tight">{navItems.find(n => n.id === currentPage)?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
             <button
               onClick={toggleDarkMode}
               className="btn btn-soft text-xs py-2 px-3 flex items-center gap-1.5 font-bold cursor-pointer"
               title="Toggle Dark / Light Theme"
             >
               {darkMode ? '🌙 Dark' : '☀️ Light'}
             </button>
             <div className="flex items-center gap-2 bg-[#e7f4ec] dark:bg-[#173024] text-green px-3 py-2 rounded-full font-bold text-xs"><span className="w-2 h-2 rounded-full bg-green"></span> SQLite Active</div>
             <button onClick={onLogout} className="btn btn-soft text-xs py-2">Log out</button>
          </div>
        </header>

        <div className={currentPage === 'pos' ? 'block' : 'hidden'}>
          <POSSection data={data} refreshData={fetchData} navigate={setCurrentPage} setActiveReceipt={setActiveReceipt} />
        </div>
        <div className={currentPage === 'orders' ? 'block' : 'hidden'}>
          <OrdersSection orders={data.orders} refreshData={fetchData} setActiveReceipt={setActiveReceipt} />
        </div>
        <div className={currentPage === 'menu' ? 'block' : 'hidden'}>
          <MenuSection products={data.products} refreshData={fetchData} />
        </div>
        <div className={currentPage === 'tables' ? 'block' : 'hidden'}>
          <TablesSection tables={data.tables} orders={data.orders} navigate={setCurrentPage} />
        </div>
        <div className={currentPage === 'reports' ? 'block' : 'hidden'}>
          <ReportsSection orders={data.orders} />
        </div>
        <div className={currentPage === 'customers' ? 'block' : 'hidden'}>
          <CustomersSection customers={data.customers} />
        </div>
        <div className={currentPage === 'settings' ? 'block' : 'hidden'}>
          <SettingsSection />
        </div>
      </main>

      {/* Global Thermal Receipt Layout for Printing */}
      {activeReceipt && (
        <div id="thermal-receipt" className="hidden print:block print:w-[72mm] print:mx-auto print:text-black print:font-mono print:text-xs">
          <h2 className="text-center font-bold text-base mb-1">THE CAFE VINCERO</h2>
          <div className="text-center mb-2">22/A Kandy Road, Dalugama<br/>Tel: 0762478581</div>
          <hr className="border-t border-dashed border-black my-2" />
          <div>Bill No: {activeReceipt.billNo}</div>
          <div>Date: {new Date(activeReceipt.date).toLocaleString()}</div>
          <div>Service: {activeReceipt.service}</div>
          {activeReceipt.customerName && <div>Customer: {activeReceipt.customerName}</div>}
          <hr className="border-t border-dashed border-black my-2" />
          <table className="w-full text-left">
            <thead>
              <tr><th>Item</th><th>Qty</th><th className="text-right">Amt</th></tr>
            </thead>
            <tbody>
              {activeReceipt.items?.map((i, idx) => (
                <tr key={idx}>
                  <td className="py-1">{i.name}</td>
                  <td>{i.qty}</td>
                  <td className="text-right">{(i.price * i.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="border-t border-dashed border-black my-2" />
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>Rs. {Number(activeReceipt.total).toFixed(2)}</span>
          </div>
          {activeReceipt.payment === 'Cash' && (
            <>
              <div className="flex justify-between mt-1">
                <span>Cash Tendered</span>
                <span>Rs. {Number(activeReceipt.cashTendered || activeReceipt.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Change / Balance</span>
                <span>Rs. {Number(activeReceipt.changeAmount || 0).toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="mt-1">Payment: {activeReceipt.payment}</div>
          <hr className="border-t border-dashed border-black my-2" />
          <div className="text-center mt-4">THANK YOU! VISIT AGAIN ❤️</div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// WHATSAPP & RECEIPT HELPERS
// ----------------------------------------------------
function formatSriLankanPhone(num) {
  if (!num) return '';
  let clean = num.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '94' + clean.slice(1);
  } else if (!clean.startsWith('94') && clean.length === 9) {
    clean = '94' + clean;
  }
  return clean;
}

function generateWhatsAppBillText(receipt) {
  if (!receipt) return '';
  const dateStr = new Date(receipt.date || Date.now()).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  
  let lines = [];
  lines.push('☕ *THE CAFE VINCERO*');
  lines.push('📍 22/A Kandy Road, Dalugama | 📞 0762478581');
  lines.push('──────────────────────────────');
  lines.push(`🧾 *BILL NO:* ${receipt.billNo || 'INVOICE'}`);
  lines.push(`📅 *DATE:* ${dateStr}`);
  if (receipt.customerName) lines.push(`👤 *CUSTOMER:* ${receipt.customerName}`);
  lines.push(`🛎 *SERVICE:* ${receipt.service || 'Dine In'}`);
  lines.push('──────────────────────────────');
  lines.push('*ORDER ITEMS:*');
  receipt.items?.forEach(item => {
    lines.push(`• ${item.qty}x ${item.name} — Rs. ${(item.price * item.qty).toFixed(2)}`);
  });
  lines.push('──────────────────────────────');
  lines.push(`💵 *TOTAL: Rs. ${Number(receipt.total).toFixed(2)}*`);
  lines.push(`💳 *PAYMENT:* ${receipt.payment || 'Cash'}`);
  if (receipt.payment === 'Cash' && receipt.cashTendered) {
    lines.push(`💰 Cash Given: Rs. ${Number(receipt.cashTendered).toFixed(2)}`);
    lines.push(`🪙 Balance / Change: Rs. ${Number(receipt.changeAmount || 0).toFixed(2)}`);
  }
  lines.push('──────────────────────────────');
  lines.push('Thank you for choosing *The Cafe Vincero*! Visit again ❤️');

  return lines.join('\n');
}

// ----------------------------------------------------
// POS SECTION
// ----------------------------------------------------
function POSSection({ data: { products, orders, tables }, refreshData, navigate, setActiveReceipt }) {
  const [cart, setCart] = useState([]);
  const [cashTendered, setCashTendered] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceType, setServiceType] = useState('Dine In');
  const [tableId, setTableId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [completedSale, setCompletedSale] = useState(null);
  const [waPhone, setWaPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = (product) => {
    setCart(prev => prev.find(i => i.id === product.id) 
      ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) 
      : [...prev, { ...product, qty: 1 }]
    );
  };

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));

  const total = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);

  const changeAmount = useMemo(() => {
    if (!cashTendered) return 0;
    const cash = parseFloat(cashTendered);
    return isNaN(cash) ? 0 : Math.max(0, cash - total);
  }, [cashTendered, total]);

  const handleCheckout = async (status = 'Completed') => {
    if (cart.length === 0) return alert('Cart is empty!');
    const cashVal = paymentMethod === 'Cash' ? (parseFloat(cashTendered) || total) : total;
    if (paymentMethod === 'Cash' && cashTendered && parseFloat(cashTendered) < total) {
      return alert('Cash tendered is less than total amount!');
    }

    const orderData = {
      customerName,
      phone: customerPhone,
      service: serviceType,
      tableId: serviceType === 'Dine In' ? tableId : null,
      subtotal: total,
      total,
      cashTendered: cashVal,
      changeAmount: paymentMethod === 'Cash' ? Math.max(0, cashVal - total) : 0,
      paymentMethod,
      status,
      items: cart
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const resData = await res.json();
      if (res.ok) {
        const fullReceipt = {
          ...orderData,
          billNo: resData.billNo,
          date: resData.date,
          payment: paymentMethod
        };
        setActiveReceipt(fullReceipt);
        setCompletedSale(fullReceipt);
        setWaPhone(customerPhone || '');
        setCart([]);
        setCashTendered('');
        setCustomerName('');
        setCustomerPhone('');
        refreshData();
      } else {
        alert('Failed to save order: ' + resData.error);
      }
    } catch (e) {
      alert('Error completing checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    if (cart.length === 0) return alert('Add items to order before printing bill!');
    const cashVal = paymentMethod === 'Cash' ? (parseFloat(cashTendered) || total) : total;
    setActiveReceipt({
      billNo: 'ESTIMATE',
      date: new Date().toISOString(),
      service: serviceType,
      customerName,
      items: cart,
      total,
      cashTendered: cashVal,
      changeAmount: paymentMethod === 'Cash' ? Math.max(0, cashVal - total) : 0,
      payment: paymentMethod
    });
    setTimeout(() => { window.print(); }, 200);
  };

  const todayOrders = orders.filter(o => o.status === 'Completed' && new Date(o.date).toDateString() === new Date().toDateString());
  const todaySales = todayOrders.reduce((acc, o) => acc + o.total, 0);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5 print:hidden">
        <div className="card"><div className="text-[12px] font-bold text-muted">TODAY'S SALES</div><div className="text-[26px] font-extrabold my-2">Rs. {todaySales.toFixed(2)}</div></div>
        <div className="card"><div className="text-[12px] font-bold text-muted">ORDERS TODAY</div><div className="text-[26px] font-extrabold my-2">{todayOrders.length}</div></div>
        <div className="card"><div className="text-[12px] font-bold text-muted">AVERAGE ORDER</div><div className="text-[26px] font-extrabold my-2">Rs. {(todayOrders.length ? todaySales/todayOrders.length : 0).toFixed(2)}</div></div>
        <div className="card cursor-pointer hover:border-gold" onClick={()=>navigate('tables')}><div className="text-[12px] font-bold text-muted">OPEN TABLES</div><div className="text-[26px] font-extrabold my-2">{orders.filter(o => o.status === 'Saved' && o.service === 'Dine In').length}</div><div className="text-[11px] text-muted">Click to manage</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.85fr] gap-5 items-start print:hidden">
        <div className="card">
          <h3 className="font-bold text-base mb-4">Build an order</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} onClick={() => addToCart(p)} className="border border-line rounded-[14px] p-3 bg-white cursor-pointer hover:border-gold transition-all flex flex-col justify-between">
                <div>
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                  ) : (
                    <div className="w-full h-20 bg-[#f5eadc] rounded-lg flex items-center justify-center font-bold text-coffee2 text-xs mb-2">NO IMAGE</div>
                  )}
                  <div className="font-bold text-sm">{p.name}</div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[11px] text-muted">{p.category}</span>
                  <span className="font-extrabold text-coffee2 text-sm">Rs. {p.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:sticky lg:top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg m-0">Current order</h3>
            <span className="bg-[#f2e7da] text-coffee2 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">{serviceType.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-[11px] font-bold text-muted uppercase">Service type</label>
              <select className="input-field mt-1" value={serviceType} onChange={e=>setServiceType(e.target.value)}>
                <option>Dine In</option>
                <option>Takeaway</option>
                <option>Delivery</option>
              </select>
            </div>
            {serviceType === 'Dine In' && (
              <div>
                <label className="text-[11px] font-bold text-muted uppercase">Table</label>
                <select className="input-field mt-1" value={tableId} onChange={e=>setTableId(e.target.value)}>
                  <option value="">Select Table</option>
                  {tables.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="mb-2">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wide">Customer Phone</label>
            <input className="input-field mt-1" placeholder="07XXXXXXXX" value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wide">Customer Name</label>
            <input className="input-field mt-1" placeholder="Name" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
          </div>

          <div className="min-h-[150px] max-h-[260px] overflow-auto border-t border-b border-line py-2">
            {cart.length === 0 ? (
              <div className="text-center text-muted py-10">Your order is empty.</div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#f0e9e0] last:border-0">
                  <div>
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-[11px] text-muted">Rs. {item.price.toFixed(2)} each</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={()=>updateQty(item.id, -1)} className="bg-[#f0e7dc] px-2 py-0.5 rounded-md font-bold text-sm">-</button>
                      <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                      <button onClick={()=>updateQty(item.id, 1)} className="bg-[#f0e7dc] px-2 py-0.5 rounded-md font-bold text-sm">+</button>
                      <button onClick={()=>updateQty(item.id, -item.qty)} className="text-red ml-2 font-bold text-lg">×</button>
                    </div>
                  </div>
                  <div className="font-extrabold text-sm whitespace-nowrap">Rs. {(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>

          <div className="py-3 space-y-2.5">
            <div className="flex justify-between items-center text-lg font-black pt-2 border-t border-line">
              <span>Total Amount</span>
              <span className="text-coffee">Rs. {total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted text-sm font-semibold">Payment Method</span>
              <select className="input-field w-32 py-1" value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}>
                <option>Cash</option>
                <option>Card</option>
                <option>QR Payment</option>
              </select>
            </div>

            {paymentMethod === 'Cash' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-muted text-sm font-semibold">Cash Given</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5000"
                    className="input-field text-right w-32 py-1 font-bold"
                    value={cashTendered}
                    onChange={e=>setCashTendered(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center bg-[#e7f4ec] p-2.5 rounded-lg border border-[#c3e6d1]">
                  <span className="font-bold text-green text-sm">Change Due (ඉතිරි මුදල)</span>
                  <span className="font-extrabold text-green text-base">Rs. {changeAmount.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-4">
            <button
              disabled={isSubmitting || cart.length === 0}
              className={`btn btn-primary w-full py-4 text-[15px] font-bold shadow-lg flex items-center justify-center gap-2 ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
              onClick={() => handleCheckout('Completed')}
            >
              {isSubmitting ? 'Recording Sale...' : '✓ Complete Sale & Record'}
            </button>
          </div>
        </div>
      </div>

      {/* Sale Completed & Quick Print / WhatsApp Modal */}
      {completedSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-[#e7f4ec] text-green rounded-full flex items-center justify-center mx-auto text-3xl font-black mb-3 shadow-inner">
                ✓
              </div>
              <h3 className="text-2xl font-black text-coffee m-0">Sale Completed & Recorded!</h3>
              <p className="text-xs text-muted mt-1">
                Bill No: <span className="font-bold text-coffee">{completedSale.billNo}</span> • {new Date(completedSale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Bill Summary Card */}
            <div className="bg-[#fcf8f3] border border-[#eee4d7] rounded-2xl p-4 mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Total Amount</span>
                <span className="text-2xl font-black text-coffee">Rs. {Number(completedSale.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted mb-1">
                <span>Payment Method</span>
                <span className="font-bold text-[#2d2521]">{completedSale.payment}</span>
              </div>
              {completedSale.payment === 'Cash' && (
                <div className="flex justify-between items-center text-xs text-muted mb-1">
                  <span>Cash Given / Balance</span>
                  <span className="font-bold text-[#2d2521]">Rs. {Number(completedSale.cashTendered).toFixed(2)} / Rs. {Number(completedSale.changeAmount).toFixed(2)}</span>
                </div>
              )}
              {completedSale.customerName && (
                <div className="flex justify-between items-center text-xs text-muted mb-1">
                  <span>Customer</span>
                  <span className="font-bold text-[#2d2521]">{completedSale.customerName}</span>
                </div>
              )}
              <div className="text-[11px] text-muted border-t border-[#e8ded0] pt-2 mt-2 max-h-24 overflow-y-auto">
                {completedSale.items?.map(i => `${i.qty}x ${i.name}`).join(' • ')}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Thermal Print Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveReceipt(completedSale);
                  setTimeout(() => { window.print(); }, 200);
                }}
                className="btn btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-105"
              >
                🖨 Print Thermal Receipt / Bill
              </button>

              {/* WhatsApp Sender Box */}
              <div className="border border-[#cde8d5] bg-[#f4fbf6] p-3.5 rounded-2xl">
                <label className="text-[11px] font-bold text-[#1f8749] uppercase tracking-wide block mb-1.5 flex items-center justify-between">
                  <span>💬 Send Receipt via WhatsApp</span>
                  <span className="text-[10px] text-muted lowercase">auto-formatted</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter phone (e.g. 0762478581)"
                    value={waPhone}
                    onChange={e => setWaPhone(e.target.value)}
                    className="input-field text-xs py-2 bg-white flex-1 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const phoneToSend = formatSriLankanPhone(waPhone);
                      const text = generateWhatsAppBillText(completedSale);
                      const url = phoneToSend 
                        ? `https://wa.me/${phoneToSend}?text=${encodeURIComponent(text)}`
                        : `https://wa.me/?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                    }}
                    className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow transition-all whitespace-nowrap cursor-pointer"
                  >
                    Send WhatsApp ↗
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#e0f0e5] text-[11px]">
                  <span className="text-muted">Direct digital bill message to customer</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generateWhatsAppBillText(completedSale));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[#128C7E] font-bold hover:underline cursor-pointer"
                  >
                    {copied ? '✓ Copied!' : 'Copy Bill Text'}
                  </button>
                </div>
              </div>

              {/* Done & Start Next Order */}
              <button
                type="button"
                onClick={() => setCompletedSale(null)}
                className="btn btn-soft w-full py-2.5 text-xs font-bold text-muted hover:text-coffee cursor-pointer"
              >
                + Done & Start Next Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ----------------------------------------------------
// ORDERS SECTION (Edit, Delete with DP1122, Print)
// ----------------------------------------------------
function OrdersSection({ orders, refreshData, setActiveReceipt }) {
  const [editingOrder, setEditingOrder] = useState(null);
  const [passwordPrompt, setPasswordPrompt] = useState({ open: false, type: '', orderId: null, data: null });
  const [inputPassword, setInputPassword] = useState('');

  const requestAction = (type, order) => {
    setInputPassword('');
    if (type === 'delete') {
      setPasswordPrompt({ open: true, type: 'delete', orderId: order.id, data: order });
    } else if (type === 'edit') {
      setPasswordPrompt({ open: true, type: 'edit', orderId: order.id, data: { ...order } });
    }
  };

  const handlePasswordSubmit = async () => {
    if (inputPassword !== 'DP1122') {
      return alert('Incorrect security password!');
    }

    if (passwordPrompt.type === 'delete') {
      try {
        const res = await fetch(`/api/orders?id=${passwordPrompt.orderId}&password=${inputPassword}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Order deleted successfully!');
          refreshData();
        } else alert('Failed to delete order.');
      } catch (e) { alert('Error deleting order.'); }
    } else if (passwordPrompt.type === 'edit') {
      setEditingOrder(passwordPrompt.data);
    }
    setPasswordPrompt({ open: false, type: '', orderId: null, data: null });
  };

  const saveEditedOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingOrder, password: 'DP1122' })
      });
      if (res.ok) {
        alert('Order updated successfully!');
        setEditingOrder(null);
        refreshData();
      } else alert('Failed to update order');
    } catch (e) { alert('Error updating order'); }
  };

  const handlePrint = (order) => {
    setActiveReceipt(order);
    setTimeout(() => { window.print(); }, 200);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg m-0">Order History</h3>
        <span className="text-xs text-muted">Protected • Security Password Required for Edit & Delete</span>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Bill No</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Date</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Customer</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Payment</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Total</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Status</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td className="p-3 border-b border-[#eee5da] font-bold">{o.billNo}</td>
                <td className="p-3 border-b border-[#eee5da]">{new Date(o.date).toLocaleString()}</td>
                <td className="p-3 border-b border-[#eee5da]">{o.customerName || 'Walk-in'}<br/><span className="text-xs text-muted">{o.phone}</span></td>
                <td className="p-3 border-b border-[#eee5da]">{o.payment}</td>
                <td className="p-3 border-b border-[#eee5da] font-bold">Rs. {Number(o.total).toFixed(2)}</td>
                <td className="p-3 border-b border-[#eee5da]">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${o.status==='Completed'?'bg-[#e7f4ec] text-green':'bg-[#fff0d9] text-[#976018]'}`}>{o.status}</span>
                </td>
                <td className="p-3 border-b border-[#eee5da] text-right space-x-1">
                  <button onClick={()=>handlePrint(o)} className="btn btn-soft text-xs py-1 px-2.5">Print</button>
                  <button
                    onClick={() => {
                      const phoneToSend = formatSriLankanPhone(o.phone);
                      const text = generateWhatsAppBillText(o);
                      const url = phoneToSend 
                        ? `https://wa.me/${phoneToSend}?text=${encodeURIComponent(text)}`
                        : `https://wa.me/?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                    }}
                    title="Send via WhatsApp"
                    className="px-2 py-1 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs rounded-lg font-bold"
                  >
                    💬 WhatsApp
                  </button>
                  <button onClick={()=>requestAction('edit', o)} className="btn btn-soft text-xs py-1 px-2.5 text-coffee">Edit</button>
                  <button onClick={()=>requestAction('delete', o)} className="btn btn-danger text-xs py-1 px-2.5">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Password Prompt Modal */}
      {passwordPrompt.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h4 className="font-bold text-base mb-2">Security Verification</h4>
            <p className="text-xs text-muted mb-4">Please enter the security password to {passwordPrompt.type} this order.</p>
            <input
              type="password"
              placeholder="Enter password"
              className="input-field mb-4"
              value={inputPassword}
              onChange={e=>setInputPassword(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={()=>setPasswordPrompt({ open: false, type: '', orderId: null, data: null })} className="btn btn-soft text-xs">Cancel</button>
              <button onClick={handlePasswordSubmit} className="btn btn-primary text-xs">Verify & Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h4 className="font-bold text-base mb-4">Edit Order {editingOrder.billNo}</h4>
            <form onSubmit={saveEditedOrder} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted uppercase">Customer Name</label>
                <input className="input-field mt-1" value={editingOrder.customerName || ''} onChange={e=>setEditingOrder({ ...editingOrder, customerName: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase">Customer Phone</label>
                <input className="input-field mt-1" value={editingOrder.phone || ''} onChange={e=>setEditingOrder({ ...editingOrder, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-muted uppercase">Service</label>
                  <select className="input-field mt-1" value={editingOrder.service} onChange={e=>setEditingOrder({ ...editingOrder, service: e.target.value })}>
                    <option>Dine In</option><option>Takeaway</option><option>Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase">Status</label>
                  <select className="input-field mt-1" value={editingOrder.status} onChange={e=>setEditingOrder({ ...editingOrder, status: e.target.value })}>
                    <option>Completed</option><option>Saved</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase">Total Amount</label>
                <input type="number" step="0.01" className="input-field mt-1 font-bold" value={editingOrder.total} onChange={e=>setEditingOrder({ ...editingOrder, total: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={()=>setEditingOrder(null)} className="btn btn-soft text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary text-xs">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// MENU & PRODUCTS SECTION (Edit, Delete, Image upload)
// ----------------------------------------------------
function MenuSection({ products, refreshData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', category: 'Coffee', price: '', image: '', available: true });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openNew = () => {
    setCurrentProduct({ id: null, name: '', category: 'Coffee', price: '', image: '', available: true });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setCurrentProduct({ ...p });
    setModalOpen(true);
  };

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products?id=${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteTarget(null);
        refreshData();
      } else {
        alert('Failed to delete product from database.');
      }
    } catch (e) {
      alert('Error deleting product: ' + e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = currentProduct.id ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentProduct,
          price: parseFloat(currentProduct.price) || 0
        })
      });
      if (res.ok) {
        setModalOpen(false);
        refreshData();
      } else alert('Failed to save product');
    } catch (e) { alert('Error saving product'); }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-lg m-0">Menu & Products</h3>
          <p className="text-xs text-muted m-0 mt-0.5">Manage products and upload images without emojis/icons.</p>
        </div>
        <button onClick={openNew} className="btn btn-primary text-xs py-2">+ Add Product</button>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Image</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Item Name</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Category</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Price</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Status</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="p-3 border-b border-[#eee5da]">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-[#eee5da] text-muted text-[9px] font-bold rounded-lg flex items-center justify-center text-center">NO IMG</div>
                  )}
                </td>
                <td className="p-3 border-b border-[#eee5da] font-bold">{p.name}</td>
                <td className="p-3 border-b border-[#eee5da]">{p.category}</td>
                <td className="p-3 border-b border-[#eee5da] font-bold">Rs. {Number(p.price).toFixed(2)}</td>
                <td className="p-3 border-b border-[#eee5da]">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${p.available ? 'bg-[#e7f4ec] text-green' : 'bg-red/10 text-red'}`}>
                    {p.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="p-3 border-b border-[#eee5da] text-right space-x-1">
                  <button onClick={()=>openEdit(p)} className="btn btn-soft text-xs py-1 px-2.5">Edit</button>
                  <button onClick={()=>setDeleteTarget(p)} className="btn btn-danger text-xs py-1 px-2.5">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h4 className="font-bold text-base mb-4">{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted uppercase">Product Name</label>
                <input required className="input-field mt-1" value={currentProduct.name} onChange={e=>setCurrentProduct({ ...currentProduct, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-muted uppercase">Category</label>
                  <input required className="input-field mt-1" value={currentProduct.category} onChange={e=>setCurrentProduct({ ...currentProduct, category: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase">Price (Rs.)</label>
                  <input required type="number" step="0.01" className="input-field mt-1" value={currentProduct.price} onChange={e=>setCurrentProduct({ ...currentProduct, price: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase">Product Image</label>
                <input type="file" accept="image/*" className="input-field mt-1 text-xs" onChange={handleImageUpload} />
                {currentProduct.image && (
                  <div className="mt-2">
                    <img src={currentProduct.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-line" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="availCheck" checked={currentProduct.available} onChange={e=>setCurrentProduct({ ...currentProduct, available: e.target.checked })} />
                <label htmlFor="availCheck" className="text-xs font-bold text-[#2d2521]">Product is Available</label>
              </div>
              <div className="flex justify-between items-center pt-3">
                {currentProduct.id && (
                  <button
                    type="button"
                    onClick={() => {
                      const prodToDelete = { ...currentProduct };
                      setModalOpen(false);
                      setDeleteTarget(prodToDelete);
                    }}
                    className="text-xs text-red hover:underline font-bold"
                  >
                    🗑 Delete Product
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button type="button" onClick={()=>setModalOpen(false)} className="btn btn-soft text-xs">Cancel</button>
                  <button type="submit" className="btn btn-primary text-xs">Save Product</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 bg-red/10 text-red rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-3">
              🗑
            </div>
            <h4 className="font-bold text-lg text-coffee mb-1">Delete Product?</h4>
            <p className="text-xs text-muted mb-4">
              Are you sure you want to permanently delete <strong className="text-coffee">{deleteTarget.name}</strong> (Rs. {Number(deleteTarget.price).toFixed(2)})?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="btn btn-soft text-xs px-4 py-2 flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="btn btn-danger text-xs px-4 py-2 flex-1"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// REMAINING SECTIONS
// ----------------------------------------------------
function TablesSection({ tables, orders, navigate }) {
  const activeTables = new Set(orders.filter(o => o.status === 'Saved' && o.service === 'Dine In').map(o => o.tableId));
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {tables.map(t => (
        <div key={t.id} className="card flex flex-col justify-between items-start min-h-[160px]">
          <div className="flex justify-between w-full items-center">
            <div className="text-3xl">🪑</div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${activeTables.has(t.id)?'bg-[#fff0d9] text-[#976018]':'bg-[#e7f4ec] text-green'}`}>
              {activeTables.has(t.id)?'Occupied':'Available'}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg m-0">{t.name}</h3>
            <p className="text-xs text-muted mt-1">{activeTables.has(t.id)?'Has active saved order':'Ready for guests'}</p>
          </div>
          <button className="btn btn-primary w-full text-sm mt-3" onClick={()=>navigate('pos')}>Start Order</button>
        </div>
      ))}
    </div>
  );
}

function ReportsSection({ orders }) {
  const completed = orders.filter(o => o.status === 'Completed');
  const totalRev = completed.reduce((sum, o) => sum + o.total, 0);

  const itemMap = {};
  completed.forEach(o => o.items?.forEach(i => {
    if (!itemMap[i.name]) itemMap[i.name] = { qty: 0, total: 0 };
    itemMap[i.name].qty += i.qty;
    itemMap[i.name].total += (i.price * i.qty);
  }));
  const topItems = Object.entries(itemMap).map(([name, d]) => ({ name, ...d })).sort((a,b)=>b.qty - a.qty);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card"><div className="text-[12px] font-bold text-muted">LIFETIME REVENUE</div><div className="text-[26px] font-extrabold my-2">Rs. {totalRev.toFixed(2)}</div></div>
        <div className="card"><div className="text-[12px] font-bold text-muted">TOTAL COMPLETED ORDERS</div><div className="text-[26px] font-extrabold my-2">{completed.length}</div></div>
      </div>
      <div className="card">
        <h3 className="font-bold text-lg mb-4">Top Selling Items</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Product</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Quantity Sold</th>
              <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topItems.map(i => (
              <tr key={i.name}>
                <td className="p-3 border-b border-[#eee5da] font-bold">{i.name}</td>
                <td className="p-3 border-b border-[#eee5da]">{i.qty}</td>
                <td className="p-3 border-b border-[#eee5da]">Rs. {i.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomersSection({ customers }) {
  return (
    <div className="card">
      <h3 className="font-bold text-lg mb-4">Customer Directory</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Name</th>
            <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Phone</th>
            <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Visits</th>
            <th className="p-3 text-[11px] text-muted border-b border-[#eee5da]">Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td className="p-3 border-b border-[#eee5da] font-bold">{c.name}</td>
              <td className="p-3 border-b border-[#eee5da]">{c.phone}</td>
              <td className="p-3 border-b border-[#eee5da]">{c.visits}</td>
              <td className="p-3 border-b border-[#eee5da] font-bold text-green">Rs. {Number(c.spent).toFixed(2)}</td>
              <td className="p-3 border-b border-[#eee5da] text-right space-x-1">
                <button onClick={() => requestAction('edit', c)} className="btn btn-soft text-xs py-1 px-2.5 text-coffee">Edit</button>
                <button onClick={() => requestAction('delete', c)} className="btn btn-danger text-xs py-1 px-2.5">Delete</button>
              </td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="font-bold text-lg mb-4">Business Details</h3>
        <div className="space-y-4">
          <div><label className="text-[11px] font-bold text-muted uppercase">Business Name</label><input className="input-field mt-1" defaultValue="THE CAFE VINCERO" /></div>
          <div><label className="text-[11px] font-bold text-muted uppercase">Address</label><input className="input-field mt-1" defaultValue="22/A Kandy Road, Dalugama" /></div>
          <button className="btn btn-primary w-full mt-2">Save Details</button>
        </div>
      </div>
      <div className="card">
        <h3 className="font-bold text-lg mb-4">Account Security</h3>
        <div className="space-y-4">
          <div><label className="text-[11px] font-bold text-muted uppercase">Current Password</label><input className="input-field mt-1" type="password" /></div>
          <div><label className="text-[11px] font-bold text-muted uppercase">New Password</label><input className="input-field mt-1" type="password" /></div>
          <button className="btn btn-primary w-full mt-2">Update Password</button>
        </div>
      </div>
    </div>
  );
}
