"use client"
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams } from 'next/navigation';

// Map game titles to check-ign supported names and their field configs
const GAME_CONFIGS = {
  'Mobile Legends': { requiresZone: true, userIdLabel: 'User ID', zoneLabel: 'Zone ID', userIdPlaceholder: 'e.g. 37309094', zonePlaceholder: 'e.g. 2060' },
  'Mobile Legends: Bang Bang': { requiresZone: true, userIdLabel: 'User ID', zoneLabel: 'Zone ID', userIdPlaceholder: 'e.g. 37309094', zonePlaceholder: 'e.g. 2060' },
  'Valorant': { requiresZone: false, userIdLabel: 'Riot ID', zoneLabel: '', userIdPlaceholder: 'e.g. Faker#1234' },
  'Genshin Impact': { requiresZone: false, userIdLabel: 'UID', zoneLabel: '', userIdPlaceholder: 'e.g. 800123456' },
  'Free Fire': { requiresZone: false, userIdLabel: 'Player ID', zoneLabel: '', userIdPlaceholder: 'e.g. 123456789' },
  'Honkai Star Rail': { requiresZone: false, userIdLabel: 'UID', zoneLabel: '', userIdPlaceholder: 'e.g. 800654321' },
  'Honkai Impact 3': { requiresZone: false, userIdLabel: 'UID', zoneLabel: '', userIdPlaceholder: 'e.g. 12345678' },
  'Call of Duty Mobile': { requiresZone: false, userIdLabel: 'Player ID', zoneLabel: '', userIdPlaceholder: 'e.g. 67890123' },
  'Arena of Valor': { requiresZone: false, userIdLabel: 'Player ID', zoneLabel: '', userIdPlaceholder: 'e.g. 12345' },
};

const DEFAULT_CONFIG = { requiresZone: true, userIdLabel: 'User ID', zoneLabel: 'Zone ID', userIdPlaceholder: 'Enter your ID', zonePlaceholder: 'Enter zone/server' };



export default function GameDetail() {
  const params = useParams();
  const id = params.id;

  const [game, setGame] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);


  // Verification state
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [verifyError, setVerifyError] = useState('');

  // Checkout state
  // Checkout state
  const [isOrdering, setIsOrdering] = useState(false);

  // Get game-specific config
  const gameConfig = useMemo(() => {
    if (!game) return DEFAULT_CONFIG;
    return GAME_CONFIGS[game.title] || DEFAULT_CONFIG;
  }, [game]);

  const handleVerify = async () => {
    if (!userId) return;
    if (gameConfig.requiresZone && !zoneId) return;

    setVerifying(true);
    setVerifyError('');
    setVerified(false);
    setVerifiedData(null);
    try {
      const res = await fetch('/api/verify-mlbb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, zoneId, gameTitle: game?.title })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerified(true);
        setVerifiedData(data.data);
      } else {
        setVerifyError(data.error || 'Player not found. Please check your ID.');
      }
    } catch {
      setVerifyError('Failed to verify. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleOrder = async () => {
    if (!selectedItem || !userId) return;
    setIsOrdering(true);
    
    try {
      // Get current user session
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Silakan login terlebih dahulu untuk melakukan pembelian.');
        setIsOrdering(false);
        return;
      }
      
      const payload = {
        userId: session.user.id,
        userEmail: session.user.email,
        gameId: game.id,
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        price: selectedItem.price,
        playerInfo: `${userId}${zoneId ? ` (${zoneId})` : ''} - ${verifiedData?.name || 'Unverified'}`,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Redirect to Xendit Invoice URL
        window.location.href = data.invoice_url;
      } else {
        alert('Checkout failed: ' + (data.error || 'Unknown error'));
        setIsOrdering(false);
      }
    } catch (err) {
      console.error('Order error:', err);
      alert('Terjadi kesalahan saat memproses pesanan.');
      setIsOrdering(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch game details
        const gameRes = await fetch(`/api/admin/data?table=games`);
        const gamesData = await gameRes.json();
        const currentGame = gamesData.find(g => g.id === id);
        
        if (currentGame) {
          setGame(currentGame);
        }

        // Fetch game items
        const itemsRes = await fetch(`/api/admin/data?table=game_items&game_id=${id}`);
        let itemsData = await itemsRes.json();
        
        // Manual filter if needed
        if (Array.isArray(itemsData)) {
          itemsData = itemsData.filter(i => i.game_id === id);
          setItems(itemsData);
          
          if (itemsData.length > 0) {
            const firstCategory = itemsData[0].category || 'All';
            setSelectedCategory(firstCategory);
          }
        }
      } catch (err) {
        console.error('Error fetching game data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id]);

  // Derived categories
  const categories = useMemo(() => {
    const cats = new Set();
    items.forEach(i => cats.add(i.category || 'All'));
    return Array.from(cats).sort();
  }, [items]);

  // Filtered items based on category
  const filteredItems = useMemo(() => {
    return items.filter(i => (i.category || 'All') === selectedCategory);
  }, [items, selectedCategory]);



  // Handle item selection change to ensure we don't have stale selection
  useEffect(() => {
    setSelectedItem(null);
  }, [selectedCategory]);

  // Completion steps tracker
  const step1Complete = verified;
  const step2Complete = !!selectedItem;

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col justify-center items-center min-h-screen mt-20">
          <div className="relative flex justify-center items-center">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full w-20 h-20 animate-pulse"></div>
            <div className="w-16 h-16 border-4 border-surface-variant border-t-primary rounded-full animate-spin relative z-10"></div>
            <span className="material-symbols-outlined absolute text-primary z-20 text-2xl animate-pulse">sports_esports</span>
          </div>
          <h2 className="mt-6 font-display-sm text-display-sm text-on-surface tracking-wide">NexusPay</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 animate-pulse">Loading game details...</p>
        </main>
      </>
    );
  }

  if (!game) {
    return (
      <>
        <Navbar />
        <main className="flex-grow w-full max-w-container-max mx-auto flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl">videogame_asset_off</span>
            <p className="font-body-lg">Game not found.</p>
          </div>
        </main>
      </>
    );
  }


  return (
    <>
      <Navbar />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-16 mt-20">

        {/* Hero Banner */}
        <section className="gsap-hero relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] flex items-end pb-8 px-6 md:px-12 ambient-shadow-primary glass-panel">
          <div className="absolute inset-0 z-0">
            <div 
              className="bg-cover bg-center w-full h-full opacity-80 mix-blend-overlay" 
              style={{ backgroundImage: `url('${game.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'}')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
          </div>
          <div className="relative z-10 w-full max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-tertiary text-on-tertiary font-label-md text-label-md px-3 py-1 rounded-full uppercase tracking-wider text-xs">
                {game.category || 'Game'}
              </span>
              <span className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-3 py-1 rounded-full uppercase tracking-wider text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span> Instant Delivery
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg md:text-[56px] text-on-surface mb-4">{game.title}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              {game.description || `Top up ${game.title} fast and cheap! Simply enter your account details, select your item, complete the payment, and it will be added immediately to your account.`}
            </p>
          </div>
        </section>

        {/* Progress Indicator */}
        <section className="flex items-center justify-center gap-2 md:gap-4">
          {[
            { num: 1, label: 'Input Account', done: step1Complete },
            { num: 2, label: 'Select Item', done: step2Complete },
          ].map((step, idx) => (
            <React.Fragment key={step.num}>
              {idx > 0 && (
                <div className={`hidden sm:block h-[2px] w-8 md:w-16 rounded-full transition-colors ${
                  step.done || (idx === 1 && step1Complete) || (idx === 2 && step2Complete) ? 'bg-primary' : 'bg-outline-variant/30'
                }`} />
              )}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-headline-md text-sm transition-all ${
                  step.done ? 'bg-green-500 text-white shadow-md shadow-green-500/30' : 'bg-surface-container border border-outline-variant text-on-surface-variant'
                }`}>
                  {step.done ? <span className="material-symbols-outlined text-[16px]">check</span> : step.num}
                </div>
                <span className={`hidden sm:inline font-label-md text-label-md transition-colors ${step.done ? 'text-green-600' : 'text-on-surface-variant'}`}>
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Account Details */}
            <section className="gsap-step glass-panel rounded-xl p-6 md:p-8 ambient-shadow-primary">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-headline-md text-headline-md ${verified ? 'bg-green-500 text-white' : 'bg-primary text-on-primary'}`}>
                  {verified ? <span className="material-symbols-outlined text-[18px]">check</span> : '1'}
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Input Account</h2>
                {verified && <span className="material-symbols-outlined text-green-500 text-[22px]">verified</span>}
              </div>
              <div className={`grid grid-cols-1 ${gameConfig.requiresZone ? 'md:grid-cols-2' : ''} gap-6`}>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant block"><span className="text-red-500">*</span>{gameConfig.userIdLabel}</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 font-body-md text-body-md outline-none transition-all shadow-sm text-on-surface" 
                    placeholder={gameConfig.userIdPlaceholder} 
                    type="text" 
                    value={userId}
                    onChange={(e) => { setUserId(e.target.value); setVerified(false); setVerifiedData(null); setVerifyError(''); }}
                  />
                </div>
                {gameConfig.requiresZone && (
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block"><span className="text-red-500">*</span>{gameConfig.zoneLabel}</label>
                    <input 
                      className="w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-4 py-3 font-body-md text-body-md outline-none transition-all shadow-sm text-on-surface" 
                      placeholder={gameConfig.zonePlaceholder || 'Enter zone/server'} 
                      type="text" 
                      value={zoneId}
                      onChange={(e) => { setZoneId(e.target.value); setVerified(false); setVerifiedData(null); setVerifyError(''); }}
                    />
                  </div>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={!userId || (gameConfig.requiresZone && !zoneId) || verifying}
                className="mt-4 px-6 py-2.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.98]"
              >
                {verifying ? (
                  <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Verifying...</>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">person_search</span> Verify Account</>
                )}
              </button>

              {/* Verified Result */}
              {verified && verifiedData && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="material-symbols-outlined text-green-500 text-[28px]">check_circle</span>
                  <div>
                    <p className="text-on-surface font-body-md">Selamat datang, <strong>{verifiedData.name}</strong> 🎮</p>
                    {verifiedData.game && <p className="text-on-surface-variant font-caption text-caption">{verifiedData.game}</p>}
                    {verifiedData.note && <p className="text-on-surface-variant font-caption text-caption italic">{verifiedData.note}</p>}
                  </div>
                </div>
              )}

              {/* Error */}
              {verifyError && (
                <div className="mt-4 p-4 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="material-symbols-outlined text-error text-[28px]">error</span>
                  <p className="text-error font-body-md">{verifyError}</p>
                </div>
              )}

              <p className="font-caption text-caption text-outline mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">help</span>
                Untuk menemukan ID kamu, cek profil akun in-game.
              </p>
            </section>

            {/* Step 2: Recharge Amount */}
            <section className="gsap-step glass-panel rounded-xl p-6 md:p-8 ambient-shadow-primary">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-headline-md text-headline-md ${step2Complete ? 'bg-green-500 text-white' : 'bg-primary text-on-primary'}`}>
                  {step2Complete ? <span className="material-symbols-outlined text-[18px]">check</span> : '2'}
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Select Recharge Amount</h2>
              </div>

              {categories.length > 0 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
                        selectedCategory === cat 
                          ? 'bg-primary text-on-primary' 
                          : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-on-surface-variant border-2 border-dashed border-outline-variant/50 rounded-xl">
                  <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">inventory_2</span>
                  <p>No items available for this category right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredItems.map(item => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div key={item.id} className="relative group cursor-pointer" onClick={() => setSelectedItem(item)}>
                        <div className={`block w-full h-full bg-surface-container-lowest border rounded-xl p-4 transition-all relative overflow-hidden ${
                          isSelected ? 'border-primary ring-2 ring-primary shadow-lg shadow-primary/10' : 'border-outline-variant hover:border-primary/50 hover:shadow-md'
                        }`}>
                          {item.bonus && (
                            <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-1 rounded-bl-lg z-20">
                              {item.bonus}
                            </div>
                          )}
                          <div className={`absolute inset-0 bg-primary/5 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
                          
                          <div className="flex flex-col items-center justify-center gap-2 relative z-10 py-2">
                            {item.icon_url ? (
                              <img src={item.icon_url} alt="icon" className="w-8 h-8 object-contain" />
                            ) : (
                              <span className={`material-symbols-outlined text-3xl ${isSelected ? 'text-primary' : 'text-primary/70'}`}>diamond</span>
                            )}
                            <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center line-clamp-2 min-h-[48px] flex items-center">{item.name}</span>
                            <span className="font-caption text-caption text-on-surface-variant uppercase font-bold tracking-wider mt-1">
                              Rp {Number(item.price).toLocaleString('id-ID')}
                            </span>
                          </div>

                          {/* Selected checkmark */}
                          {isSelected && (
                            <div className="absolute top-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-20">
                              <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>


          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <section className="gsap-summary glass-panel rounded-xl p-6 md:p-8 ambient-shadow-secondary sticky top-28">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6 border-b border-outline-variant pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    {gameConfig.userIdLabel}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface max-w-[140px] truncate text-right">
                    {userId ? `${userId} ${zoneId ? `(${zoneId})` : ''}` : '-'}
                  </span>
                </div>
                {verified && verifiedData && (
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">badge</span>
                      Player
                    </span>
                    <span className="font-label-md text-label-md text-green-600">{verifiedData.name}</span>
                  </div>
                )}
                <div className="flex justify-between items-start gap-4">
                  <span className="font-body-md text-body-md text-on-surface-variant shrink-0 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    Item
                  </span>
                  <span className="font-label-md text-label-md text-on-surface text-right">
                    {selectedItem ? selectedItem.name : 'No item selected'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">sell</span>
                    Price
                  </span>
                  <span className="font-label-md text-label-md text-on-surface">
                    {selectedItem ? `Rp ${Number(selectedItem.price).toLocaleString('id-ID')}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">percent</span>
                    Admin Fee
                  </span>
                  <span className="font-label-md text-label-md text-green-600">Gratis</span>
                </div>
              </div>

              <div className="border-t border-outline-variant pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Total</span>
                  <span className="font-headline-md text-headline-md text-primary">
                    {selectedItem ? `Rp ${Number(selectedItem.price).toLocaleString('id-ID')}` : 'Rp 0'}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleOrder}
                disabled={!selectedItem || !userId || isOrdering}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline-lg-mobile text-[18px] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isOrdering ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Buy Now
                  </>
                )}
              </button>

              {/* Missing steps hint */}
              {(!userId || !selectedItem) && (
                <div className="mt-4 p-3 bg-surface-container rounded-lg">
                  <p className="font-caption text-caption text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] mt-0.5 text-primary">info</span>
                    <span>
                      {!userId ? 'Masukkan User ID terlebih dahulu.' : 'Pilih item yang ingin dibeli.'}
                    </span>
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant font-caption text-caption">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Secure Payment Guaranteed
              </div>
            </section>
          </div>
        </div>
      </main>

<Footer />
    </>
  );
}
