/* ============================================================
   Joy Trinkets — shared script
   Included by every page. Each page only gets the behavior for
   the elements that actually exist in its HTML.
   ============================================================ */

/* ================= Utilities ================= */
const peso = n => '₱' + n.toLocaleString('en-PH');

function toast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=> t.classList.remove('show'), 2200);
}

function escAttr(str){
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
}

function imgFallback(img){
  const div = document.createElement('div');
  div.className = 'img-placeholder';
  div.innerHTML = '<span>⚠️ Image failed to load</span>';
  img.replaceWith(div);
}

function placeholderBox(label, imageUrl){
  if(imageUrl){
    return `<img class="product-photo" src="${escAttr(imageUrl)}" alt="${escAttr(label)}" onerror="imgFallback(this)">`;
  }
  return `<div class="img-placeholder"><span>🖼 ${label}<br>Add photo</span></div>`;
}

/* ================= Shared data ================= */
/* Counts below always equal PRODUCTS.filter(p => p.category === id).length —
   every category card shows exactly as many series as actually exist in PRODUCTS.
   Series names are real, released lines from each brand (not invented). */
const CATEGORIES = [
  {id:'sylvanian', name:'Sylvanian Families', count:'12 sets', icon:'🏡', bg:'#FFE1E8', image:'https://wallpaperaccess.com/full/12265707.jpg'},
  {id:'hirono',     name:'Hirono',             count:'8 sets',  icon:'🌙', bg:'#EFE7FF', image:'https://wallpapercave.com/wp/wp13689077.jpg'},
  {id:'crybaby',    name:'Crybaby',            count:'7 sets',  icon:'💧', bg:'#E3F0FF', image:'https://prod-eurasian-res.popmart.com/default/16_oK4KL5lBhg_1200x1200.jpg'},
  {id:'pucky',      name:'Pucky',              count:'5 sets',  icon:'🐰', bg:'#FFF3D6', image:'https://prod-eurasian-res.popmart.com/default/%E5%9C%BA%E6%99%AF1_SazKShm6TQ_1200x1200.jpg'},
  {id:'zsiga',      name:'Zsiga',              count:'4 sets',  icon:'🦋', bg:'#E1F9F1', image:'https://tse3.mm.bing.net/th/id/OIP.95C84mNDbpT9uYZ7Oz8hngHaHa?r=0&pid=Api&h=220&P=0'},
  {id:'twinkle',    name:'Twinkle Twinkle',    count:'6 sets',  icon:'⭐', bg:'#FFE9DC', image:'https://tse1.mm.bing.net/th/id/OIP.6XUVNUP0vF8NRHOEdHOI1QHaFE?r=0&pid=Api&h=220&P=0'},
];

/* `chase` is the real secret/hidden figure documented for that series, where one exists.
   Used to power the "Secret chase" filter instead of a per-item tag. */
const PRODUCTS = [
  // Sylvanian Families — 12
  {name:'Chocolate Rabbit Family',  category:'sylvanian', series:'Sylvanian Families', price:950,  tag:'tag-new',     tagText:'New', image:'https://legacydistribution.it/cdn/shop/files/5jbx8twikwogwnwmzk4zz1yyuodz6v8n_1_2048x2048.jpg?v=1759235424'},
  {name:'Walnut Squirrel Family',   category:'sylvanian', series:'Sylvanian Families', price:890,  tag:'tag-low',     tagText:'Low stock', image:'https://busybeetoys.net/cdn/shop/files/Calico-Critters-Walnut-squirrel-family-CC2299-busy-bee-toys_01_800x664.png?v=1775494557'},
  {name:'Persian Cat Family',       category:'sylvanian', series:'Sylvanian Families', price:1090, tag:'tag-new',     tagText:'New', image:'https://toyshoppe.co.uk/wp-content/uploads/2025/10/sylvanian-families-persian-cat-family-set-1.jpg'},
  {name:'Cottontail Rabbit Family', category:'sylvanian', series:'Sylvanian Families', price:780,  tag:'tag-new',     tagText:'New', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/8711915031349.jpg'},
  {name:'Bramble Hedgehog Family',  category:'sylvanian', series:'Sylvanian Families', price:820,  tag:'tag-low',     tagText:'Low stock', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/5054131040188_uk.jpg'},
  {name:'Marshmallow Mouse Family', category:'sylvanian', series:'Sylvanian Families', price:760,  tag:'tag-new',     tagText:'New', image:'https://tse2.mm.bing.net/th/id/OIP.H8xdfCp8ZMchDJ-D-q9EvwHaD1?r=0&pid=Api&h=220&P=0'},
  {name:'Yellow Labrador Family',   category:'sylvanian', series:'Sylvanian Families', price:980,  tag:'tag-soldout', tagText:'Sold out', image:'https://www.donalds.co.uk/wp-content/uploads/2022/10/5182-1.jpg'},
  {name:'Striped Cat Family',       category:'sylvanian', series:'Sylvanian Families', price:840,  tag:'tag-new',     tagText:'New', image:'https://cdn.shopify.com/s/files/1/1885/4211/products/5180_StripedCatFamily_CC.jpg?v=1606403734'},
  {name:'Maple Cat Family',         category:'sylvanian', series:'Sylvanian Families', price:900,  tag:'tag-low',     tagText:'Low stock', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/5290_01_Maple_Cat_Family.jpg'},
  {name:'Springer Kangaroo Family', category:'sylvanian', series:'Sylvanian Families', price:1050, tag:'tag-new',     tagText:'New', image:'https://sylvanianstorekeepers.com/cdn/shop/files/4766c_pr284_4_14adc644-259f-4f20-a87f-583c270e13fb.jpg?v=1722947195'},
  {name:'Toy Poodle Family',        category:'sylvanian', series:'Sylvanian Families', price:970,  tag:'tag-new',     tagText:'New', image:'https://luksusbaby.com.cn/cdn/shop/products/5259-2.jpg?v=1709218469&width=1500'},
  {name:'Tuxedo Cat Family',        category:'sylvanian', series:'Sylvanian Families', price:860,  tag:'tag-low',     tagText:'Low stock', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/5054131051818_uk.jpg'},

  // Hirono — 8
  {name:'The Other One',      category:'hirono', series:'Hirono', price:780, tag:'tag-new',     tagText:'New',      chase:'The Monster', image:'https://prod-america-res.popmart.com/default/20231102_173452_687387__1200x1200.jpg'},
  {name:'Little Mischief',    category:'hirono', series:'Hirono', price:780, tag:'tag-low',     tagText:'Low stock', image:'https://down-ph.img.susercontent.com/file/cn-11134207-7r98o-lza6e277lroz56'},
  {name:'City of Mercy',      category:'hirono', series:'Hirono', price:850, tag:'tag-new',     tagText:'New',      chase:'Belonging', image:'https://down-ph.img.susercontent.com/file/th-11134207-7qul0-lk0z8wrf4ls9e4'},
  {name:'Mime',               category:'hirono', series:'Hirono', price:820, tag:'tag-low',     tagText:'Low stock', image:'https://m.media-amazon.com/images/I/71Ni+LiSCfL._AC_SL1500_.jpg'},
  {name:'Reshape',            category:'hirono', series:'Hirono', price:900, tag:'tag-new',     tagText:'New', image:'https://prod-eurasian-res.popmart.com/default/20240313_110520_855074__1200x1251.jpg?x-oss-process=image/format,webp'},
  {name:'Shelter',            category:'hirono', series:'Hirono', price:950, tag:'tag-new',     tagText:'New',      chase:'Stuffed Bear', image:'https://down-my.img.susercontent.com/file/cn-11134207-7r98o-lzsujv7vfxirf4'},
  {name:'Echo',               category:'hirono', series:'Hirono', price:990, tag:'tag-soldout', tagText:'Sold out', image:'https://down-ph.img.susercontent.com/file/sg-11134275-7rept-m8egxe9ocoide6'},
  {name:"Monsters' Carnival", category:'hirono', series:'Hirono', price:870, tag:'tag-new',     tagText:'New',      chase:'The Disembodies', image:'https://blindboxcollections.com/cdn/shop/files/CoffeeBreak-18.png?v=1760696735'},

  // Crybaby — 7
  {name:'Monster Tears',        category:'crybaby', series:'Crybaby', price:780, tag:'tag-new',     tagText:'New',      chase:'Moth Queen', image:'https://down-my.img.susercontent.com/file/cn-11134207-7r98o-lz627es7pcpudf'},
  {name:'Wild but Cutie',       category:'crybaby', series:'Crybaby', price:750, tag:'tag-low',     tagText:'Low stock', chase:'Wild Cutie', image:'https://down-my.img.susercontent.com/file/cn-11134207-7ras8-m9qqk7v3nonm07'},
  {name:'Crying Again',         category:'crybaby', series:'Crybaby', price:820, tag:'tag-new',     tagText:'New', image:'https://down-ph.img.susercontent.com/file/cn-11134207-7ras8-m0leadz4njrbdc'},
  {name:'Crying to the Moon',   category:'crybaby', series:'Crybaby', price:790, tag:'tag-low',     tagText:'Low stock', image:'https://down-my.img.susercontent.com/file/cn-11134208-820l4-mi2op27o03yc91'},
  {name:'Crying for Love',      category:'crybaby', series:'Crybaby', price:860, tag:'tag-new',     tagText:'New', image:'https://down-my.img.susercontent.com/file/cn-11134207-7ras8-m58ibwvxashnc7'},
  {name:'Crying in the Woods',  category:'crybaby', series:'Crybaby', price:810, tag:'tag-soldout', tagText:'Sold out', image:'https://crybabyworld.com/wp-content/uploads/2025/03/Crying-In-The-Woods-Series.jpg'},
  {name:'Tears Launch Project', category:'crybaby', series:'Crybaby', price:830, tag:'tag-new',     tagText:'New',      chase:'Tear Jerker', image:'https://prod-america-res.popmart.com/default/20260213_103535_413934____2_crybaby-tears-launch-project-series-plush-pendant-blind-box_plush-toys_details_pop-mart-us_____1200x1348.jpg?x-oss-process=image/format,webp'},

  // Pucky — 5
  {name:'Sleeping Babies',  category:'pucky', series:'Pucky', price:890, tag:'tag-new',     tagText:'New',      chase:'Little Moon Baby', image:'https://tse3.mm.bing.net/th/id/OIP.79X1uV_dgfsJsShG0mPxvQHaHa?r=0&pid=Api&h=220&P=0'},
  {name:'Forest Elf',       category:'pucky', series:'Pucky', price:850, tag:'tag-low',     tagText:'Low stock', chase:'Batcat Fairy', image:'https://down-th.img.susercontent.com/file/sg-11134201-7rdyn-m0jpfuyfa2dg71'},
  {name:'Forest Party',     category:'pucky', series:'Pucky', price:900, tag:'tag-new',     tagText:'New', image:'https://prod-eurasian-res.popmart.com/default/20230928_102627_637666__1200x1200.jpg'},
  {name:'Sleeping Forest',  category:'pucky', series:'Pucky', price:950, tag:'tag-soldout', tagText:'Sold out',  chase:'Lotus', image:'https://1.bp.blogspot.com/-j_4tHy5ghec/ZjcuVmFcUjI/AAAAAAACVlM/ExHu-JZB47Q-vVk4UtDZDG1C5CWwoW8SgCNcBGAsYHQ/s1600/Sleeping-Forest-Series-Pucky-Pop-Mart-Figure-2.jpg'},
  {name:'Flying Babies',    category:'pucky', series:'Pucky', price:870, tag:'tag-new',     tagText:'New', image:'https://d2cva83hdk3bwc.cloudfront.net/pop-mart-pucky-flying-babies-series-single-box-2.jpg'},

  // Zsiga — 4
  {name:'Let It Be',      category:'zsiga', series:'Zsiga', price:780, tag:'tag-new',     tagText:'New',      chase:'Moment of Peace', image:'https://prod-eurasian-res.popmart.com/default/20240614_141433_544280_____05_____1200x1212.jpg?x-oss-process=image/format,webp'},
  {name:'We All Are Kids',category:'zsiga', series:'Zsiga', price:800, tag:'tag-low',     tagText:'Low stock', image:'https://prod-eurasian-res.popmart.com/default/20240919_141512_656152_____04_____1200x1117.jpg?x-oss-process=image/format,webp'},
  {name:"We're So Cute",  category:'zsiga', series:'Zsiga', price:760, tag:'tag-new',     tagText:'New',      chase:'Bear in the Window', image:'https://d2cva83hdk3bwc.cloudfront.net/pop-mart-zsiga-we-re-so-cute-series-figures-gift-set-1.jpg'},
  {name:'Twins',          category:'zsiga', series:'Zsiga', price:820, tag:'tag-soldout', tagText:'Sold out', image:'https://media.okini.land/174020-large_default/popmart-zsiga-twins-series-box-9-pieces.jpg'},

  // Twinkle Twinkle — 6
  {name:'Savor the Moment',       category:'twinkle', series:'Twinkle Twinkle', price:830, tag:'tag-new', tagText:'New',      chase:'Matcha Cream Snow', image:'https://m.media-amazon.com/images/I/71eEjXaUYfL._AC_SL1500_.jpg'},
  {name:'A Big Hug for You',      category:'twinkle', series:'Twinkle Twinkle', price:810, tag:'tag-low', tagText:'Low stock', chase:'The Best Gift', image:'https://i.ebayimg.com/images/g/f7oAAeSw9MtorHa5/s-l1600.webp'},
  {name:'We Are Twinkle Twinkle', category:'twinkle', series:'Twinkle Twinkle', price:850, tag:'tag-new', tagText:'New',      chase:'The Master of Chill', image:'https://down-th.img.susercontent.com/file/cn-11134207-7r98o-lyygo8h71pir2d'},
  {name:'Be a Little Star',       category:'twinkle', series:'Twinkle Twinkle', price:900, tag:'tag-new', tagText:'New',      chase:'Reach for the Stars', image:'https://blindboxcollections.com/cdn/shop/files/IMG_2855.heic?v=1747560066'},
  {name:'1.2.3! Twinkle Twinkle', category:'twinkle', series:'Twinkle Twinkle', price:780, tag:'tag-low', tagText:'Low stock', image:'https://down-ph.img.susercontent.com/file/cn-11134207-7ras8-m8gal17u0h7h95'},
  {name:'Create Your Taste',      category:'twinkle', series:'Twinkle Twinkle', price:790, tag:'tag-new', tagText:'New', image:'https://cdn.ennxo.com/content/uploads/1600/twinkle-twinkle-create-your-taste-series-figures-2.jpg'},
];

const BASE_LISTINGS = [
  {name:'Walnut Squirrel Family', desc:'→ for City of Mercy or Let It Be', by:'@roro.crates', time:'2h ago', bg:'#FFE1E8'},
  {name:'Little Mischief',        desc:'x2 dupes → open to offers',       by:'@finchbox',    time:'5h ago', bg:'#FFF3D6'},
  {name:'Crying Again',           desc:'→ for any Monster Tears chase',   by:'@minttape',    time:'1d ago', bg:'#E1F9F1'},
];
const EXTRA_LISTINGS = [
  {name:'Let It Be',      desc:'→ looking for the Chocolate Rabbit Family', by:'@shelfshelf', time:'1d ago', bg:'#FFE9DC'},
  {name:'Be a Little Star', desc:'Chase pulled → offers only',              by:'@pinkboxpe',  time:'2d ago', bg:'#EFE7FF'},
  {name:'Sleeping Babies',  desc:'x3 dupes → will bundle',                  by:'@collectph',  time:'3d ago', bg:'#E3F0FF'},
];

/* ================= Cart (persisted across pages) ================= */
function loadCart(){
  try{
    return JSON.parse(localStorage.getItem('joytrinkets_cart')) || [];
  }catch(e){ return []; }
}
function saveCart(){
  try{ localStorage.setItem('joytrinkets_cart', JSON.stringify(cart)); }catch(e){ /* ignore */ }
}
let cart = loadCart();

function loadCollection(){
  try{
    const collection = JSON.parse(localStorage.getItem('joytrinkets_collection')) || [];
    return Array.isArray(collection) ? collection : [];
  }catch(e){ return []; }
}
function saveCollection(collection){
  try{ localStorage.setItem('joytrinkets_collection', JSON.stringify(collection)); }catch(e){ /* ignore */ }
}
function addToCollection(item, quantity=1){
  const collection = loadCollection();
  const owned = collection.find(entry=> entry.name === item.name);
  if(owned) owned.qty += quantity;
  else collection.push({name:item.name, qty:quantity});
  saveCollection(collection);
}
function addToCart(p){
  const line = cart.find(l=> l.name === p.name);
  if(line) line.qty++; else cart.push({name:p.name, price:p.price, qty:1, image:p.image || ''});
  saveCart();
  updateCartBadge();
  toast(`${p.name} added to cart`);
}
function updateCartBadge(){
  const el = document.getElementById('cartCount');
  if(el) el.textContent = cart.reduce((s,l)=> s + l.qty, 0);
}
function cartItemCount(){
  return cart.reduce((s,l)=> s + l.qty, 0);
}
function cartTotal(){
  return cart.reduce((s,l)=> s + l.price * l.qty, 0);
}

/* ================= Modal system ================= */
function openModal(html){
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  if(!overlay || !body) return;
  body.innerHTML = html;
  overlay.classList.add('open');
}
function closeModal(){
  const overlay = document.getElementById('modalOverlay');
  if(overlay) overlay.classList.remove('open');
}

function renderCartModal(){
  if(cart.length === 0){
    openModal(`
      <h3>Your cart</h3>
      <p class="modal-sub">It's empty for now.</p>
      <a class="btn btn-primary" href="drops.html" style="width:100%; justify-content:center;">Browse drops</a>`);
    return;
  }
  const lines = cart.map(l=> `
    <div class="cart-line">
      <div class="cart-line-figure" style="background:var(--surface-2); display:flex; align-items:center; justify-content:center; overflow:hidden;">${l.image ? `<img src="${escAttr(l.image)}" alt="${escAttr(l.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="imgFallback(this)">` : '<span style="font-size:10px; color:var(--muted); text-align:center;">img</span>'}</div>
      <div class="cart-line-info"><b>${l.name}</b><span>${peso(l.price)} × ${l.qty}</span></div>
      <button class="cart-remove" data-remove="${l.name}">Remove</button>
    </div>`).join('');
  openModal(`
    <h3>Your cart</h3>
    <p class="modal-sub">${cartItemCount()} item(s)</p>
    ${lines}
    <div class="cart-total-row"><span>Total</span><span>${peso(cartTotal())}</span></div>
    <button class="btn btn-primary" id="checkoutBtn" style="width:100%; justify-content:center; margin-top:18px;">Checkout</button>`);
  const body = document.getElementById('modalBody');
  body.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      cart = cart.filter(l=> l.name !== btn.dataset.remove);
      saveCart();
      updateCartBadge();
      renderCartModal();
    });
  });
  const checkoutBtn = body.querySelector('#checkoutBtn');
  if(checkoutBtn) checkoutBtn.addEventListener('click', ()=>{ location.href = 'checkout.html'; });
}

function renderSignInModal(){
  openModal(`
    <h3>Sign in</h3>
    <p class="modal-sub">Demo form — no account is actually created.</p>
    <div class="form-field"><label>Email</label><input type="email" placeholder="you@email.com"></div>
    <div class="form-field"><label>Password</label><input type="password" placeholder="••••••••"></div>
    <button class="btn btn-primary" id="loginBtn" style="width:100%; justify-content:center;">Log in</button>
    <p style="text-align:center; font-size:13px; color:var(--muted); margin-top:14px;">No account? <button style="background:none;border:none;color:var(--coral); text-decoration:underline; font-size:13px;" id="signupLink">Sign up</button></p>`);
  const body = document.getElementById('modalBody');
  body.querySelector('#loginBtn').addEventListener('click', ()=>{
    closeModal();
    toast('Signed in (demo)');
  });
  body.querySelector('#signupLink').addEventListener('click', ()=> toast('Sign-up flow coming soon'));
}

function renderCatalogModal(){
  const rows = PRODUCTS.map(p=> `
    <div class="modal-list-item">
      <div style="width:44px;height:44px;border-radius:8px;background:var(--surface-2); flex-shrink:0; overflow:hidden; display:flex; align-items:center; justify-content:center;">${p.image ? `<img src="${escAttr(p.image)}" alt="${escAttr(p.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="imgFallback(this)">` : ''}</div>
      <div class="listing-info" style="flex:1;"><b>${p.name}</b><span>${p.series} · ${peso(p.price)}</span></div>
      <button class="add-btn" style="width:32px;height:32px;font-size:15px;" ${p.tag==='tag-soldout'?'disabled':''} data-add="${p.name}">+</button>
    </div>`).join('');
  openModal(`<h3>Full catalog</h3><p class="modal-sub">${PRODUCTS.length} figures across 6 categories.</p>${rows}`);
  const body = document.getElementById('modalBody');
  body.querySelectorAll('[data-add]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const p = PRODUCTS.find(x=> x.name === btn.dataset.add);
      if(p) addToCart(p);
    });
  });
}

function listingFigure(l){
  const match = PRODUCTS.find(p=> p.name === l.name);
  if(match && match.image){
    return `<div class="listing-figure" style="background:${l.bg}; overflow:hidden; padding:0;"><img src="${escAttr(match.image)}" alt="${escAttr(l.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="imgFallback(this)"></div>`;
  }
  return `<div class="listing-figure" style="background:${l.bg};">🎁</div>`;
}

function listingRow(l){
  return `
    <div class="listing-row">
      ${listingFigure(l)}
      <div class="listing-info"><b>${l.name} ${l.desc}</b><span>Listed by ${l.by} · ${l.time}</span></div>
      <span class="escrow-badge">Escrow</span>
    </div>`;
}

function renderListingsModal(){
  const rows = [...BASE_LISTINGS, ...EXTRA_LISTINGS].map(l=> `
    <div class="modal-list-item">
      ${listingFigure(l)}
      <div class="listing-info" style="flex:1;"><b>${l.name} ${l.desc}</b><span>${l.by} · ${l.time}</span></div>
      <button class="btn btn-outline btn-sm" data-propose="${l.name}">Propose</button>
    </div>`).join('');
  openModal(`<h3>All trade listings</h3><p class="modal-sub">Every trade runs through escrow until both sides confirm.</p>${rows}`);
  const body = document.getElementById('modalBody');
  body.querySelectorAll('[data-propose]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ toast(`Trade proposal sent for ${btn.dataset.propose}`); });
  });
}

function renderRaffleModal(){
  const code = 'RAF-' + Math.floor(1000 + Math.random()*8999);
  openModal(`
    <h3>You're entered! 🎟️</h3>
    <p class="modal-sub">Entry code <b>${code}</b> for the Walnut Squirrel Family chase run. Winners are drawn live once the timer hits zero — no bots, one entry per verified account.</p>
    <button class="btn btn-mint" id="raffleDone" style="width:100%; justify-content:center;">Got it</button>`);
  document.getElementById('modalBody').querySelector('#raffleDone').addEventListener('click', closeModal);
}

const INFO_CONTENT = {
  rules: ['Fair drop rules', 'Every limited release runs through anti-bot verification. One account, one entry, winners drawn live and logged for transparency.'],
  sell: ['Sell on Joy Trinkets', 'Independent toy designers can apply for a storefront with built-in anti-bot drop tools and IP protection. Applications open soon.'],
  antibot: ['Anti-bot drop tools', 'Every checkout for a limited drop is screened for automated behavior before an order is allowed to go through.'],
  contact: ['Contact us', 'Reach the Joy Trinkets team anytime at hello@joytrinkets.example — this is a demo project, so this inbox is not monitored.'],
};
function renderInfoModal(key){
  const [title, body_] = INFO_CONTENT[key];
  openModal(`<h3>${title}</h3><p class="modal-sub">${body_}</p><button class="btn btn-outline" id="infoClose" style="width:100%; justify-content:center;">Close</button>`);
  document.getElementById('modalBody').querySelector('#infoClose').addEventListener('click', closeModal);
}

/* ================= Global click delegation (every page) ================= */
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartBadge();

  // highlight the current page in the nav
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    if(a.getAttribute('href') === here) a.classList.add('active');
  });

  const overlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(overlay) overlay.addEventListener('click', e=>{ if(e.target === overlay) closeModal(); });

  /* ---- Page: checkout.html ---- */
  const checkoutItems = document.getElementById('checkoutItems');
  if(checkoutItems){
    const checkoutLayout = document.getElementById('checkoutLayout');
    const checkoutEmpty = document.getElementById('checkoutEmpty');
    const orderConfirmation = document.getElementById('orderConfirmation');
    const checkoutForm = document.getElementById('checkoutForm');
    const discountRate = 0.10;
    const discountThreshold = 3;

    function renderCheckoutSummary(){
      const itemCount = cartItemCount();
      const subtotal = cartTotal();
      const discount = itemCount >= discountThreshold ? Math.round(subtotal * discountRate) : 0;
      checkoutLayout.hidden = itemCount === 0;
      checkoutEmpty.hidden = itemCount !== 0;
      checkoutItems.innerHTML = cart.map(item=>`
        <div class="checkout-item">
          <div class="checkout-item-image">${item.image ? `<img src="${escAttr(item.image)}" alt="${escAttr(item.name)}" onerror="imgFallback(this)">` : '<span>🎁</span>'}</div>
          <div class="checkout-item-info"><b>${escAttr(item.name)}</b><span>${peso(item.price)} × ${item.qty}</span></div>
          <strong>${peso(item.price * item.qty)}</strong>
        </div>`).join('');
      document.getElementById('checkoutItemCount').textContent = `${itemCount} item${itemCount === 1 ? '' : 's'}`;
      document.getElementById('checkoutSubtotal').textContent = peso(subtotal);
      document.getElementById('checkoutDiscount').textContent = discount ? `−${peso(discount)}` : peso(0);
      document.getElementById('checkoutTotal').textContent = peso(subtotal - discount);
      const discountMessage = document.getElementById('discountMessage');
      discountMessage.textContent = itemCount >= discountThreshold
        ? '10% bundle discount applied!'
        : `Add ${discountThreshold - itemCount} more item${discountThreshold - itemCount === 1 ? '' : 's'} for 10% off.`;
      discountMessage.classList.toggle('discount-applied', itemCount >= discountThreshold);
    }

    renderCheckoutSummary();
    checkoutForm.addEventListener('submit', event=>{
      event.preventDefault();
      if(!checkoutForm.reportValidity() || cartItemCount() === 0) return;
      const orderId = 'JT-' + Math.floor(10000 + Math.random()*89999);
      cart.forEach(item=> addToCollection(item, item.qty));
      cart = [];
      saveCart();
      updateCartBadge();
      checkoutLayout.hidden = true;
      orderConfirmation.hidden = false;
      document.getElementById('orderNumber').textContent = orderId;
    });
  }

  document.addEventListener('click', e=>{
    const trigger = e.target.closest('[data-modal]');
    if(!trigger) return;
    const type = trigger.dataset.modal;
    if(type === 'cart') renderCartModal();
    else if(type === 'signin') renderSignInModal();
    else if(type === 'catalog') renderCatalogModal();
    else if(type === 'listings') renderListingsModal();
    else if(type === 'raffle') renderRaffleModal();
    else renderInfoModal(type);
  });

  /* ---- Page: categories.html / index.html category grid ---- */
  const categoryGrid = document.getElementById('categoryGrid');
  if(categoryGrid){
    CATEGORIES.forEach(c=>{
      const card = document.createElement('a');
      card.href = `drops.html?category=${c.id}`;
      card.className = 'category-card';
      // c.image lets you paste a specific photo per category; otherwise we fall
      // back to that category's first product photo, then to the emoji icon.
      const fallbackProduct = PRODUCTS.find(p=> p.category === c.id && p.image);
      const photo = c.image || (fallbackProduct ? fallbackProduct.image : '');
      const iconInner = photo
        ? `<img src="${escAttr(photo)}" alt="${escAttr(c.name)}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" onerror="imgFallback(this)">`
        : c.icon;
      card.innerHTML = `<div class="category-icon" style="background:${c.bg}; overflow:hidden;">${iconInner}</div><h4>${c.name}</h4><span>${c.count}</span>`;
      categoryGrid.appendChild(card);
    });
  }

  /* ---- Page: drops.html ---- */
  const productGrid = document.getElementById('productGrid');
  if(productGrid){
    let activeFilter = 'all';
    const params = new URLSearchParams(location.search);
    let activeCategory = params.get('category');

    function matchesFilter(p){
      if(activeCategory && p.category !== activeCategory) return false;
      if(activeFilter === 'instock') return p.tag !== 'tag-soldout';
      if(activeFilter === 'secret') return !!p.chase;
      if(activeFilter === 'under') return p.price < 800;
      return true;
    }

    function renderProducts(){
      productGrid.innerHTML = '';
      const list = PRODUCTS.filter(matchesFilter);
      if(list.length === 0){
        productGrid.innerHTML = `<p style="color:var(--muted); grid-column:1/-1;">Nothing matches that filter yet — try clearing it.</p>`;
        return;
      }
      list.forEach(p=>{
        const soldOut = p.tag === 'tag-soldout';
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="product-figure" style="background:var(--surface-2);">
            <div class="tag-row"><span class="tag ${p.tag}">${p.tagText}</span></div>
            ${placeholderBox(p.name, p.image)}
          </div>
          <h4>${p.name}</h4>
          <div class="series">${p.series}${p.chase ? ` · Chase: ${p.chase}` : ''}</div>
          <div class="product-foot">
            <span class="price">${peso(p.price)}</span>
            <button class="add-btn" ${soldOut ? 'disabled' : ''} aria-label="Add to cart">+</button>
          </div>`;
        card.querySelector('.add-btn').addEventListener('click', ()=> addToCart(p));
        productGrid.appendChild(card);
      });
    }

    const categoryBanner = document.getElementById('categoryBanner');
    if(activeCategory && categoryBanner){
      const cat = CATEGORIES.find(c=> c.id === activeCategory);
      categoryBanner.style.display = 'flex';
      categoryBanner.querySelector('span').textContent = `Filtered to ${cat ? cat.name : activeCategory}`;
      categoryBanner.querySelector('button').addEventListener('click', ()=>{
        activeCategory = null;
        categoryBanner.style.display = 'none';
        history.replaceState(null, '', 'drops.html');
        renderProducts();
      });
    }

    const filterPills = document.getElementById('filterPills');
    if(filterPills){
      filterPills.addEventListener('click', e=>{
        const pill = e.target.closest('.filter-pill');
        if(!pill) return;
        filterPills.querySelectorAll('.filter-pill').forEach(el=> el.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.dataset.filter;
        renderProducts();
      });
    }

    renderProducts();
  }

  /* ---- Page: drops.html — full catalog modal button already wired via [data-modal] ---- */

  /* ---- Page: pull.html — limited to 3 boxes per day ---- */
  const tray = document.getElementById('pullTray');
  if(tray){
    const result = document.getElementById('pullResult');
    const pullCountEl = document.getElementById('pullCount');
    const pullPool = PRODUCTS.filter(p=> p.tag !== 'tag-soldout');
    const DAILY_LIMIT = 3;

    function todayStr(){
      const d = new Date();
      return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    }
    function loadDaily(){
      let daily;
      try{ daily = JSON.parse(localStorage.getItem('joytrinkets_daily_pull')); }catch(e){ daily = null; }
      if(!daily || daily.date !== todayStr()) daily = {date: todayStr(), results: []};
      return daily;
    }
    let daily = loadDaily();
    function saveDaily(){
      try{ localStorage.setItem('joytrinkets_daily_pull', JSON.stringify(daily)); }catch(e){ /* ignore */ }
    }
    function msUntilNextTray(){
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0);
      return next - now;
    }
    function formatCountdown(ms){
      if(ms < 0) ms = 0;
      const h = Math.floor(ms/3600000);
      const m = Math.floor((ms%3600000)/60000);
      const s = Math.floor((ms%60000)/1000);
      return `${h}h ${m}m ${s}s`;
    }
    function updateCountText(){
      const n = daily.results.length;
      if(n >= DAILY_LIMIT){
        pullCountEl.innerHTML = `${n} of ${DAILY_LIMIT} boxes opened today · new tray in <span id="pullCountdown">${formatCountdown(msUntilNextTray())}</span>`;
      } else {
        pullCountEl.textContent = `${n} of ${DAILY_LIMIT} boxes opened today`;
      }
    }
    function renderResult(r){
      result.innerHTML = `
        <div class="result-figure">${placeholderBox(r.name, r.image)}</div>
        <span class="result-rarity ${r.rarityClass}">${r.rarityLabel}</span>
        <h3 style="font-size:19px; margin-bottom:6px;">${r.name}</h3>
        <p style="color:var(--muted); font-size:13.5px;">Added to your collection shelf.</p>`;
    }
    function buildTray(){
      tray.innerHTML = '';
      for(let i=0;i<DAILY_LIMIT;i++){
        const box = document.createElement('button');
        box.className = 'pull-box';
        if(daily.results[i]){
          box.classList.add('opened');
          box.textContent = '✓';
          box.disabled = true;
        } else {
          box.textContent = '?';
        }
        tray.appendChild(box);
      }
      if(daily.results.length > 0) renderResult(daily.results[daily.results.length - 1]);
      else result.innerHTML = '<span class="placeholder-text">Tap a box in the tray to pull ↖</span>';
      updateCountText();
    }
    tray.addEventListener('click', e=>{
      const box = e.target.closest('.pull-box');
      if(!box || box.disabled || daily.results.length >= DAILY_LIMIT) return;
      box.classList.add('shaking');
      setTimeout(()=>{
        box.classList.remove('shaking');
        box.classList.add('opened');
        box.textContent = '✓';
        box.disabled = true;
        const picked = pullPool[Math.floor(Math.random()*pullPool.length)];
        const r = Math.random();
        const rarity = r < 0.06 ? 'secret' : r < 0.30 ? 'rare' : 'common';
        const rarityClass = rarity === 'secret' ? 'rarity-secret' : rarity === 'rare' ? 'rarity-rare' : 'rarity-common';
        const rarityLabel = rarity === 'secret' ? '✨ Secret chase' : rarity === 'rare' ? 'Rare' : 'Common';
        const pullResult = {name: picked.name, image: picked.image, rarityClass, rarityLabel};
        daily.results.push(pullResult);
        saveDaily();
        addToCollection(picked);
        renderResult(pullResult);
        updateCountText();
      }, 500);
    });
    // keep the countdown ticking, and roll over to a fresh tray right at midnight
    setInterval(()=>{
      if(daily.date !== todayStr()){
        daily = loadDaily();
        buildTray();
        return;
      }
      const el = document.getElementById('pullCountdown');
      if(el) el.textContent = formatCountdown(msUntilNextTray());
    }, 1000);
    buildTray();
  }

  /* ---- Page: shelf.html ---- */
  const shelfRow = document.getElementById('shelfRow');
  if(shelfRow){
    const collection = loadCollection();
    const ownedCount = collection.reduce((total,item)=> total + item.qty, 0);
    const uniqueCount = collection.filter(item=> item.qty > 0 && PRODUCTS.some(p=> p.name === item.name)).length;
    document.getElementById('collectionCount').textContent =
      `${uniqueCount} / ${PRODUCTS.length} unique · ${ownedCount} item${ownedCount === 1 ? '' : 's'} owned`;
    document.getElementById('collectionProgress').style.width =
      `${PRODUCTS.length ? uniqueCount / PRODUCTS.length * 100 : 0}%`;
    PRODUCTS.forEach(p=>{
      const slot = document.createElement('div');
      const item = collection.find(entry=> entry.name === p.name);
      const owned = item && item.qty > 0;
      slot.className = 'shelf-slot' + (owned ? ' filled' : '') + (owned && p.chase ? ' chase' : '');
      slot.title = `${p.name}${owned ? ` · Qty: ${item.qty}` : ' · Not owned'}`;
      slot.setAttribute('aria-label', slot.title);
      if(owned){
        slot.style.padding = '0';
        slot.style.overflow = 'hidden';
        slot.innerHTML = placeholderBox(p.name, p.image);
        slot.style.position = 'relative';
        const quantity = document.createElement('span');
        quantity.className = 'shelf-quantity';
        quantity.textContent = `×${item.qty}`;
        slot.appendChild(quantity);
        if(p.chase){
          const star = document.createElement('span');
          star.className = 'shelf-chase-star';
          star.textContent = '★';
          slot.appendChild(star);
        }
      }
      shelfRow.appendChild(slot);
    });
  }

  /* ---- Page: trade.html ---- */
  const tradeListings = document.getElementById('tradeListings');
  if(tradeListings){
    tradeListings.innerHTML = BASE_LISTINGS.map(listingRow).join('');
  }
  if(document.getElementById('tHrs')){
    let totalSecs = 4*3600 + 26*60 + 51;
    function pad(n){ return n.toString().padStart(2,'0'); }
    setInterval(()=>{
      if(totalSecs <= 0) return;
      totalSecs--;
      document.getElementById('tHrs').textContent = pad(Math.floor(totalSecs/3600));
      document.getElementById('tMin').textContent = pad(Math.floor((totalSecs%3600)/60));
      document.getElementById('tSec').textContent = pad(totalSecs%60);
    }, 1000);
  }
});