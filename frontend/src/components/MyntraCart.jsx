import React from 'react';
import { useStore } from '../data/store';
import { ShieldCheck, X } from 'lucide-react';

const MyntraCart = () => {
  const { triggerPause, setDemoView, pauseMerchant } = useStore();

  const handlePlaceOrder = () => {
    // This triggers the ML model and the Pause Modal
    triggerPause(pauseMerchant);
  };

  const merchantAmount = pauseMerchant?.amount || 2499;
  const discount = 553;
  const totalMrp = merchantAmount + discount;

  return (
    <div className="myntra-wrapper" style={{ backgroundColor: '#fff', minHeight: '100dvh', color: '#282c3f', paddingBottom: '120px' }}>
      <nav className="myntra-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', borderBottom: '1px solid #eaeaec' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '1px' }}>MYNTRA</div>
        <div style={{ color: '#696b79', fontSize: '10px', letterSpacing: '2px', fontWeight: 'bold' }}>BAG --------- ADDRESS --------- PAYMENT</div>
        <div style={{ color: '#03a685', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} /> 100% SECURE
        </div>
      </nav>

      <div className="myntra-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ border: '1px solid #eaeaec', padding: '12px', fontSize: '12px', marginBottom: '20px' }}>
          Available Offers: 10% Instant Discount on SBI Credit Cards. T&C.
        </div>

        <div className="cart-item" style={{ display: 'flex', border: '1px solid #eaeaec', padding: '10px', position: 'relative', marginBottom: '15px' }}>
          <img src="https://images.clothes.com/images/123/1.jpg" alt="item" style={{ width: '80px', height: '110px', objectFit: 'cover' }} />
          <div style={{ paddingLeft: '15px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{pauseMerchant?.name || 'Chumbak'}</div>
            <div style={{ color: '#696b79', fontSize: '13px' }}>Ombre Tassels Dreamcatcher</div>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <span style={{ background: '#f5f5f6', padding: '3px 6px', marginRight: '5px' }}>Size: Onesize</span>
              <span style={{ background: '#f5f5f6', padding: '3px 6px' }}>Qty: 1</span>
            </div>
            <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
              ₹{merchantAmount.toLocaleString()} <span style={{ textDecoration: 'line-through', color: '#94969f', fontWeight: 'normal', fontSize: '11px' }}>₹{totalMrp.toLocaleString()}</span>
            </div>
          </div>
          <X size={16} style={{ position: 'absolute', right: '10px', top: '10px', color: '#282c3f' }} />
        </div>

        <div style={{ marginTop: '30px', borderTop: '1px solid #eaeaec', paddingTop: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#535766', marginBottom: '15px' }}>PRICE DETAILS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
            <span>Total MRP</span>
            <span>₹{totalMrp.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
            <span>Discount on MRP</span>
            <span style={{ color: '#03a685' }}>-₹{discount.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold', fontSize: '16px', borderTop: '1px solid #eaeaec', paddingTop: '15px' }}>
            <span>Total Amount</span>
            <span>₹{merchantAmount.toLocaleString()}</span>
          </div>

          <button 
            onClick={handlePlaceOrder}
            style={{ width: '100%', backgroundColor: '#ff3f6c', color: 'white', border: 'none', padding: '15px', fontWeight: 'bold', borderRadius: '4px', marginTop: '25px', cursor: 'pointer' }}
          >
            PLACE ORDER
          </button>
          
          <button 
            onClick={() => setDemoView('list')}
            style={{ width: '100%', background: 'none', border: 'none', color: '#696b79', fontSize: '12px', marginTop: '15px', textDecoration: 'underline' }}
          >
            Back to demo list
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyntraCart;