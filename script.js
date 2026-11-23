import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

/* ============================================================
   Joy Trinkets — shared script
   Included by every page. Each page only gets the behavior for
   the elements that actually exist in its HTML.
   ============================================================ */

/* ================= Utilities ================= */
const peso = n => '₱' + n.toLocaleString('en-PH');
const NOTIFICATIONS_STORAGE_KEY = 'joytrinkets_notifications';
const TRADE_OFFERS_STORAGE_KEY = 'joytrinkets_trade_offers';
const MODEL_VIEWER_SETTINGS = {
  cameraUp:[0, 1, 0],
  cameraPosition:[0, 0, 1.8],
  initialCameraLookAt:[0, 0, 0],
  rotation:[-0.7071, 0, 0, 0.7071],
};
const CHARACTER_MODELS = {
  'amber-husky-with-fish-wand':{url:encodeURI('./models/Amber Husky with fish wand.ply')},
  'nicola-splashy-with-crab-hat':{url:encodeURI('./models/Nicola Splashy with crab hat.ply')},
  'owen-periwinkle-with-whale-toy':{url:encodeURI('./models/Owen Periwinkle with whale toy.ply')},
  'ryan-persian-with-turtle-backpack':{url:encodeURI('./models/Ryan Persian with turtle backpack.ply')},
  'sandy-neptune-with-shell-messenger-bag':{url:encodeURI('./models/Sandy Neptune with shell messenger bag.ply')},
  'sophie-snow-with-fish-handbag':{url:encodeURI('./models/Sophie Snow with fish handbag.ply')},
  'shiny-psyduck':{url:encodeURI('./models/Shiny Psyduck.ply')},
  'surprised-psyduck':{url:encodeURI('./models/Surprised Psyduck.ply')},
  'headache-psyduck':{url:encodeURI('./models/Headache Psyduck.ply')},
  'daydreaming-psyduck':{url:encodeURI('./models/Daydreaming Psyduck.ply')},
  'the-ghost':{url:encodeURI('./models/The Ghost.ply')},
  'the-fox':{url:encodeURI('./models/The Fox.ply')},
  'the-crow':{url:encodeURI('./models/The Crow.ply')},
  marionette:{url:encodeURI('./models/Marionette.ply')},
  amnesia:{url:encodeURI('./models/Amnesia.ply')},
  'camo-cutie':{url:encodeURI('./models/Camo Cutie.ply')},
  'denim-cutie':{url:encodeURI('./models/Denim Cutie.ply')},
  'neon-cutie':{url:encodeURI('./models/Neon Cutie.ply')},
  'pink-cutie':{url:encodeURI('./models/Pink Cutie.ply')},
  'vanilla-cutie':{url:encodeURI('./models/Vanilla Cutie.ply')},
  'vintage-cutie':{url:encodeURI('./models/Vintage Cutie.ply')},
  'baby-ice-pop':{url:encodeURI('./models/Baby Ice Pop.ply')},
  'bad-temper':{url:encodeURI('./models/Bad Temper.ply')},
  haircut:{url:encodeURI('./models/Haircut.ply')},
  'lose-a-tooth':{url:encodeURI('./models/Lose a Tooth.ply')},
  'reach-for-the-stars':{url:encodeURI('./models/Reach for the Stars.ply')},
  'the-magical-chef':{url:encodeURI('./models/The Magical Chef.ply')},
  'wake-up-sleepyhead':{url:encodeURI('./models/Wake up! Sleepyhead!.ply')},
  'lotus-pose':{url:encodeURI('./models/Lotus Pose.ply')},
  'ship-pose':{url:encodeURI('./models/Ship Pose.ply')},
  'shoulders-stand-pose':{url:encodeURI('./models/Shouldstand Pose.ply')},
  'shouldstand-pose':{url:encodeURI('./models/Shouldstand Pose.ply')},
  'tree-pose':{url:encodeURI('./models/Tree Pose.ply')},
  'triangle-pose':{url:encodeURI('./models/Triangle Pose.ply')},
  'twist-pose':{url:encodeURI('./models/Twist Pose.ply')},
  'smiski-lotus-pose':{url:encodeURI('./models/Lotus Pose.ply')},
  'smiski-ship-pose':{url:encodeURI('./models/Ship Pose.ply')},
  'smiski-shoulders-stand-pose':{url:encodeURI('./models/Shouldstand Pose.ply')},
  'smiski-shouldstand-pose':{url:encodeURI('./models/Shouldstand Pose.ply')},
  'smiski-tree-pose':{url:encodeURI('./models/Tree Pose.ply')},
  'smiski-triangle-pose':{url:encodeURI('./models/Triangle Pose.ply')},
  'smiski-twist-pose':{url:encodeURI('./models/Twist Pose.ply')},
};

function characterId(name){
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function registeredCharacterModel(name){
  return CHARACTER_MODELS[characterId(name)] || null;
}

function hasCharacterModel(name){
  return Boolean(registeredCharacterModel(name)?.url);
}

function accountStorageKey(namespace, accountId=getSignedInEmail()){
  const normalizedId = String(accountId || '').trim().toLowerCase();
  return `${namespace}_${normalizedId ? encodeURIComponent(normalizedId) : 'guest'}`;
}

function characterModelData(name, modelUrl='', modelOrientation={}){
  const id = characterId(name);
  const {url, ...registryOrientation} = registeredCharacterModel(name) || {};
  return {
    id,
    modelUrl:modelUrl || url || '',
    modelOrientation:{...registryOrientation, ...modelOrientation},
  };
}

function toast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=> t.classList.remove('show'), 2200);
}

function loadNotifications(){
  if(!getSignedInEmail()) return [];
  try{
    const raw = localStorage.getItem(accountStorageKey(NOTIFICATIONS_STORAGE_KEY));
    const stored = raw ? JSON.parse(raw) : [];
    if(!Array.isArray(stored)) throw new Error('Saved notifications are not a list.');
    return stored.filter(item=>item && typeof item.id === 'string' && typeof item.message === 'string')
      .map(item=>({...item, createdAt:Number.isFinite(Number(item.createdAt)) ? Number(item.createdAt) : Date.now()}));
  }catch(error){
    console.error('Could not read notifications.', error);
    return [];
  }
}

function renderNotifications(){
  const notifications = loadNotifications();
  const unreadCount = notifications.filter(item=>!item.read).length;
  document.querySelectorAll('[data-notification-count]').forEach(badge=>{
    badge.textContent = unreadCount > 99 ? '99+' : String(unreadCount);
    badge.hidden = unreadCount === 0;
  });
  document.querySelectorAll('[data-notification-list]').forEach(list=>{
    list.innerHTML = notifications.length
      ? notifications.slice(0, 12).map(item=>`<a class="notification-item ${item.read ? '' : 'unread'}" href="${escAttr(item.href || 'trade.html')}#${escAttr(item.target || 'offers')}" data-notification-id="${escAttr(item.id)}"><span>${escAttr(item.message)}</span><time datetime="${new Date(item.createdAt).toISOString()}">${new Date(item.createdAt).toLocaleString()}</time></a>`).join('')
      : '<p class="notification-empty">You’re all caught up.</p>';
  });
}

function addNotification(message, {href='trade.html', target='offers', toastMessage=''}={}){
  if(!getSignedInEmail()){
    if(toastMessage) toast(toastMessage);
    return;
  }
  const notifications = loadNotifications();
  notifications.unshift({
    id:createLocalId('notification'),
    message,
    href,
    target,
    read:false,
    createdAt:Date.now(),
  });
  try{
    localStorage.setItem(accountStorageKey(NOTIFICATIONS_STORAGE_KEY), JSON.stringify(notifications.slice(0, 60)));
  }catch(error){
    console.error('Could not save notification.', error);
    toast('Your notification could not be saved');
  }
  renderNotifications();
  if(toastMessage) toast(toastMessage);
}

function markNotificationsRead(){
  if(!getSignedInEmail()) return;
  const notifications = loadNotifications().map(item=>({...item, read:true}));
  try{
    localStorage.setItem(accountStorageKey(NOTIFICATIONS_STORAGE_KEY), JSON.stringify(notifications));
  }catch(error){
    console.error('Could not mark notifications as read.', error);
    toast('Notifications could not be updated');
  }
  renderNotifications();
}

function markNotificationRead(notificationId){
  if(!getSignedInEmail()) return;
  const notifications = loadNotifications();
  const notification = notifications.find(item=>item.id === notificationId);
  if(!notification || notification.read) return;
  notification.read = true;
  try{
    localStorage.setItem(accountStorageKey(NOTIFICATIONS_STORAGE_KEY), JSON.stringify(notifications));
  }catch(error){
    console.error('Could not update notification status.', error);
    toast('Notification could not be updated');
  }
  renderNotifications();
}

function escAttr(str){
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function imgFallback(img){
  const div = document.createElement('div');
  div.className = 'img-placeholder';
  div.innerHTML = '<span class="placeholder-brand">JOY<br>TRINKETS</span><span>Collector photo unavailable</span>';
  img.replaceWith(div);
}
window.imgFallback = imgFallback;

function placeholderBox(label, imageUrl){
  if(imageUrl === '?'){
    return `<div class="img-placeholder secret-character-placeholder" role="img" aria-label="${escAttr(label)}"><span aria-hidden="true">?</span></div>`;
  }
  if(imageUrl){
    return `<img class="product-photo" src="${escAttr(imageUrl)}" alt="${escAttr(label)}" onerror="imgFallback(this)">`;
  }
  return `<div class="img-placeholder"><span class="placeholder-brand">JOY<br>TRINKETS</span><span>${escAttr(label)}</span></div>`;
}

/* ================= Shared data ================= */
/* Counts below always equal PRODUCTS.filter(p => p.category === id).length —
   every category card shows exactly as many series as actually exist in PRODUCTS.
   Series names are real, released lines from each brand (not invented). */
const CATEGORIES = [
  {id:'sylvanian', name:'Sylvanian Families', count:'3 sets', icon:'⌂', bg:'#F7E7E8', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBZ2lMZbS5t-_s5sVBzTGMGPWhab81kQwP17AhYTQ_8gZ38xm_GLPrh0XH&s=10'},
  {id:'hirono', name:'Hirono', count:'3 sets', icon:'◌', bg:'#EEE9F5', image:'https://prod-america-res.popmart.com/default/20231102_173452_687387__1200x1200.jpg'},
  {id:'psyduck', name:'Psyduck', count:'1 set', icon:'◡', bg:'#F8EED7', image:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png'},
  {id:'crybaby', name:'Crybaby', count:'3 sets', icon:'♡', bg:'#F8E7EA', image:'https://prod-eurasian-res.popmart.com/default/16_oK4KL5lBhg_1200x1200.jpg'},
  {id:'twinkle', name:'Twinkle Twinkle', count:'3 sets', icon:'✦', bg:'#F5EBDD', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3BTz6yTZuBBiEHIXvTX2W6Y8GVQJRVyPfA54X71Nas-85EW7nUCFbj0RX&s=10'},
  {id:'smiskis', name:'Smiskis', count:'3 sets', icon:'☼', bg:'#E9EFE8', image:'https://smiski.com/e/wp-content/uploads/2018/08/image.png'},
];

function makeCharacters(names, category, series, secretName, characterImages, seriesImage){
  const seriesSlug = `${category}-${series}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const characterImage = (name, index)=>{
    const suppliedImage = characterImages && characterImages[index];
    if(suppliedImage && suppliedImage !== seriesImage) return suppliedImage;
    const characterSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `images/characters/${seriesSlug}/${characterSlug}.jpg`;
  };
  if(names.length && typeof names[0] === 'object'){
    return names.map(character=>({
      name:character.name,
      rarity:character.rarity,
      odds:character.odds,
      image:character.image || '',
      ...characterModelData(character.name, character.modelUrl, character.modelOrientation),
    }));
  }
  return [
    ...names.map((name, index)=>({
      name,
      rarity:'Standard',
      odds:'1/12',
      image:characterImage(name, index),
      ...characterModelData(name),
    })),
    {name:secretName, rarity:'Secret Chase', odds:'1/144', image:characterImage(secretName, names.length), ...characterModelData(secretName)},
  ];
}

function makeSeries({name, category, series, price, tag, tagText, heightCm, image, chase, characters, characterImages, modelUrl, modelOrientation, modelPreview=true}){
  return {
    name, category, series, price, tag, tagText, heightCm, image, chase,
    modelUrl:modelUrl || '', modelOrientation:modelOrientation || null, modelPreview,
    characters:makeCharacters(characters, category, series, chase, characterImages, image),
  };
}

const PRODUCTS = [
  makeSeries({name:'Baby Seashore Friends Series', category:'sylvanian', series:'Baby Seashore Friends Series', price:420, tag:'tag-new', tagText:'New', heightCm:4.5, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd0E3uBVTVizb6J25exHm4l7JM3qD-D5SHhoNekMgTetZROFUkLhtAVclW&s=10', chase:'Allie Fennec with a crown', characters:['Nicola Splashy with crab hat','Jason Osborne in lobster costume','Owen Periwinkle with whale toy','Sandy Neptune with shell messenger bag','Amber Husky with fish wand','Sophie Snow with fish handbag','Ryan Persian with turtle backpack'], characterImages:['https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221335832.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221290790.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221327472.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221314816.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221303042.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221320376.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221308939.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221342664.jpg']}),
  makeSeries({name:'Baby Forest Costume Series', modelPreview:false, category:'sylvanian', series:'Baby Forest Costume Series', price:420, tag:'tag-low', tagText:'Low stock', heightCm:4.5, image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876192457.jpg', chase:'Peppermint Marlowe with leaf mask', characters:[
    {name:'Perri Buckley in an apple costume', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876205185.jpg'},
    {name:'Gilly Golightly in a mushroom costume', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876215847.jpg'},
    {name:'Ambrose Walnut in an acorn outfit', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876229647.jpg'},
    {name:'Mary Marshmallow with a leaf raft', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876239377.jpg'},
    {name:'Julie Outback in a ladybird outfit', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876252180.jpg'},
    {name:'Drake Husky with a green leaf accessory', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876276461.jpg'},
    {name:'Flora Chocolate with a lily of the valley accessory', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876290163.jpg'},
    {name:'Peppermint Marlowe with leaf mask', rarity:'Secret Chase', odds:'1/144', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876303098.jpg'},
  ]}),
  makeSeries({name:'Baby Treats Series', modelPreview:false, category:'sylvanian', series:'Baby Treats Series', price:420, tag:'tag-new', tagText:'New', heightCm:4.5, image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639379953292.jpg', chase:'Sandy Neptune with madeleine', characters:[
    {name:'Adelaide Outback with koala ice cream', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639380049780.jpg'},
    {name:'Perri Buckley with deer lollipop', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639380053868.jpg'},
    {name:'Andy Snow with rabbit waffle', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639379959183.jpg'},
    {name:'Scott Sandy with cat muffin', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639379968045.jpg'},
    {name:'Clara Pookie with panda pancake', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639380046153.jpg'},
    {name:'Bradley Osborne with bear bagel', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639379963790.jpg'},
    {name:'Albert Marshmallow with mouse cake', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639380058055.jpg'},
    {name:'Sandy Neptune with madeleine', rarity:'Secret Chase', odds:'1/144', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639380062511.jpg'},
  ]}),
  makeSeries({name:'Hirono The Other One', category:'hirono', series:'The Other One', price:780, tag:'tag-new', tagText:'New', heightCm:8.5, image:'https://m.media-amazon.com/images/I/71h6xW8QCpL.jpg', chase:'The Monster', characters:[
    {name:'The Ghost', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-the-ghost-main-300x300.png.webp'},
    {name:'The Fox', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-the-fox-main-300x300.png.webp'},
    {name:'The Crow', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-the-crow-main-300x300.png.webp'},
    {name:'The Monster', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-the-monster-main-300x300.png.webp'},
    {name:'Marionette', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-marioneta-main-300x300.png.webp'},
    {name:'Amnesia', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-amnesia-main-300x300.png.webp'},
    {name:'Staring', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-staring-main-300x300.png.webp'},
    {name:'Nowhere Safe', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-nowhere-safe-main-300x300.png.webp'},
    {name:'Cuckoo', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-cuckoo-main-300x300.png.webp'},
    {name:'Being Alive', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-being-alive-main-300x300.png.webp'},
    {name:'Raving', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-raving-main-300x300.png.webp'},
    {name:'Vagrancy', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-vagrancy-main-300x300.png.webp'},
    {name:'Dreaming', rarity:'Secret Chase', odds:'1/144', image:'https://hironoworld.com/wp-content/uploads/2025/01/hirono-dreaming-main-300x300.png.webp'},
  ]}),
  makeSeries({name:'Hirono City of Mercy', modelPreview:false, category:'hirono', series:'City of Mercy', price:850, tag:'tag-low', tagText:'Low stock', heightCm:8.5, image:'https://www.thetoychronicle.com/wp-content/uploads/2022/12/POP-MART-x-Inner-Flow-Hirono-City-of-Mercy-Blind-Box-Series-758x398.jpg', chase:'Belonging', characters:[
    {name:'Fallen Angel', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc-dmOlXGzPP0Dz7k7HMpEg-bRejCK27n_XmZN2yCjUQ&s=10'},
    {name:'Comfortably Numb', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1USMjbhoTq8DNqH3QSJVOY2bG39VtGlCCggQ72hHnYA&s=10'},
    {name:'Healer', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/healer-main-150x150.webp'},
    {name:'Insight', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/insught-main-150x150.webp'},
    {name:'The Other', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/the-other-main-150x150.webp'},
    {name:'Echo', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/echo-main-150x150.webp'},
    {name:'Belonging', rarity:'Secret Chase', odds:'1/144', image:'https://hironoworld.com/wp-content/uploads/2025/01/belonging-main-150x150.webp'},
  ]}),
  makeSeries({name:'Hirono Reshape', modelPreview:false, category:'hirono', series:'Reshape', price:900, tag:'tag-new', tagText:'New', heightCm:8.5, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwRDBP6RQOl8cCMgmomvhAxpF2cCmuRSQizgqkHzJ1wA&s=10', chase:'Puppet', characters:[
    {name:'Healing', rarity:'Standard', odds:'1/12', image:'https://prod-global-biz.popmart.com/globalAdmin/1785916086463_c81e728d9d4c2f636f067f89cc14862c.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Paradise Lost', rarity:'Standard', odds:'1/12', image:'https://prod-global-biz.popmart.com/globalAdmin/1789099092186_c4ca4238a0b923820dcc509a6f75849b.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Drowning', rarity:'Standard', odds:'1/12', image:'https://prod-global-biz.popmart.com/globalAdmin/1789099065193_c9f0f895fb98ab9159f51fd0297e236d.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Costume', rarity:'Standard', odds:'1/12', image:'https://prod-global-biz.popmart.com/globalAdmin/1789099078532_e4da3b7fbbce2345d7772b0674a318d5.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Parasite', rarity:'Standard', odds:'1/12', image:'https://prod-global-biz.popmart.com/globalAdmin/1789099096616_eccbc87e4b5ce2fe28308fd9f2a7baf3.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Voyage', rarity:'Standard', odds:'1/12', image:'https://prod-global-biz.popmart.com/globalAdmin/1789099083678_8f14e45fceea167a5a36dedd4bea2543.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Burst', rarity:'Standard', odds:'1/12', image:'https://prod-global-biz.popmart.com/globalAdmin/1789099087883_45c48cce2e2d7fbdea1afc51c7c6ad26.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Fading', rarity:'Standard', odds:'1/12', image:'https://prod-global-biz.popmart.com/globalAdmin/1789099070364_a87ff679a2f3e71d9181a67b7542122c.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Woodcarving', rarity:'Standard', odds:'1/12', image:'https://prod-global-biz.popmart.com/globalAdmin/1789099105710_1679091c5a880faf6fb5e6087eb1b2dc.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Puppet', rarity:'Secret Chase', odds:'1/144', image:'https://prod-global-biz.popmart.com/globalAdmin/1789099110024_d3d9446802a44259755d38e6d163e820.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
  ]}),

  makeSeries({name:'Psyduck Figure Collection', category:'psyduck', series:'Pokémon Figure Collection', price:890, tag:'tag-new', tagText:'New', heightCm:7.5, image:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png', chase:'Shiny Psyduck', characters:[
    {name:'Daydreaming Psyduck', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFKfkuHdeXg6wkkrjraleynt9cjqOWFZThj5I48NXSTNicip6g3piSRkio&s=10L'},
    {name:'Headache Psyduck', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs_ALPD8OveSOZYzShy3NrZCf76TMa4FmNFdUrPe825A&s'},
    {name:'Surprised Psyduck', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfwgCSM_ObQZp6cg22n5J2TFktg4QylJs-JWOETwdWtxR1n-874082NC6Y&s=10'},
    {name:'Shiny Psyduck', rarity:'Secret Chase', odds:'1/144', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzIIRz59pt70sf9XoxEyeej5RsIDUvYoYoGhGXHD1u6LW14Rn0JZik0ZP-&s=10'},
  ]}),

  makeSeries({name:'Crybaby Crying Again', modelPreview:false, category:'crybaby', series:'Crying Again', price:820, tag:'tag-new', tagText:'New', heightCm:9, image:'https://down-ph.img.susercontent.com/file/cn-11134207-820l4-mk82p23mcged05', chase:'Crying Again - Secret', characters:[
    {name:'Crying Again - Blue', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1736409968827____she-s-alice____.png?x-oss-process=image/format,webp'},
    {name:'Crying Again - Pink', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1736409938007____i-ll-give-you-all-my-love____.png?x-oss-process=image/format,webp'},
    {name:'Crying Again - Yellow', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1736409950023____duck-you____.png?x-oss-process=image/format,webp'},
    {name:'Crying Again - Green', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1736409962650____what-a-frog____.png?x-oss-process=image/format,webp'},
    {name:'Crying Again - Brown', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1736409956466____i-ll-bring-you-a-flower____.png?x-oss-process=image/format,webp'},
    {name:'Crying Again - Secret', rarity:'Secret Chase', odds:'1/144', image:'https://global-static.popmart.com/globalAdmin/1736409988578____secret____.png?x-oss-process=image/format,webp'},
    {name:'Crying Again - Super Secret', rarity:'Secret Chase', odds:'1/144', image:'https://global-static.popmart.com/globalAdmin/1736409981889____super-secret____.png?x-oss-process=image/format,webp'},
  ]}),
  makeSeries({name:'Crybaby Wild but Cutie', category:'crybaby', series:'Wild but Cutie', price:750, tag:'tag-low', tagText:'Low stock', heightCm:9, image:'https://prod-apac-r2.popmart.com/cdn-cgi/image/width=3840%2Cformat=webp/https://prod-eurasian-res.popmart.com/default/20250512_155750_390280____6_____1200x1200.jpg', chase:'Vintage Cutie', characters:[
    {name:'Pink Cutie', rarity:'Standard', odds:'1/12', image:'https://prod-eurasian-res.popmart.com/default/20250512_155750_870769____1_____1200x1200.jpg'},
    {name:'Vanilla Cutie', rarity:'Standard', odds:'1/12', image:'https://pushas.com/cdn/shop/files/POP-MART-CRYBABY-Wild-but-Cutie-Series-Vinyl-Plush-Pendant-_6-Blind-Boxes_-vanilla-cutie.jpeg?v=1751507140&width=1200'},
    {name:'Neon Cutie', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1747019143423____neon-cutie____.png?x-oss-process=image/format,webp'},
    {name:'Denim Cutie', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1747019125295____denim-cutie____.png?x-oss-process=image/format,webp'},
    {name:'Camo Cutie', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1747019118058____camo-cutie____.png?x-oss-process=image/format,webp'},
    {name:'Vintage Cutie', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1747019108985____vintage-cutie____.png?x-oss-process=image/format,webp'},
  ]}),
  makeSeries({name:'Crybaby Monster Tears', modelPreview:false, category:'crybaby', series:'Monster Tears', price:780, tag:'tag-soldout', tagText:'Sold out', heightCm:9, image:'https://www.picclickimg.com/TgsAAOSwIGBkZGbx/POP-MART-Crybaby-Monster-Tears-Series-Blind-Box.webp', chase:'Secret', characters:[
    {name:'Sweet Werewolf', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/11_hegolgQlsS_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Sea Monsterf', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/01_chswdu74K0_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Big Boy Frankief', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/08_b2AYbaYTqY_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Burn Baby Burn', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/10_5APkzu7bnf_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Happie', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/02_tzUAG36qD7_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Soul Eater', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/03_4HlEEt0FGa_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Frosty Candy', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/04_BFnp7m5WeF_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Lady Mummy', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/05_eJa9q2Zhvq_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Spooky Kitty', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/06_X7LyGJooiz_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Mr. Invinsible', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/07_kPqZMOJWZl_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'The Lonely Bones', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/09_H6eGCWKONd_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Witch Wish', rarity:'Standard', odds:'1/12', image:'https://prod-america-res.popmart.com/default/12_22Spocncuz_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Secret', rarity:'Secret Chase', odds:'1/144', image:'https://prod-america-res.popmart.com/default/secret_ZwgJrxSKt3_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
    {name:'Super Secret', rarity:'Secret Chase', odds:'1/144', image:'https://prod-america-res.popmart.com/default/super_secret_t2lzMH7wk7_1200x1200.jpg?x-oss-process=image/resize,w_1600/quality,q_90/format,avif'},
  ]}),

  // TODO: Replace generated character image paths with individual photos for each series.
  makeSeries({name:'Twinkle Twinkle Savor the Moment', modelPreview:false, category:'twinkle', series:'Savor the Moment', price:830, tag:'tag-new', tagText:'New', heightCm:8, image:'https://prod-apac-r2.popmart.com/cdn-cgi/image/width=3840%2Cformat=webp/https://prod-eurasian-res.popmart.com/default/20250923_161016_447485____7_____1200x1200.jpg', chase:'Matcha Cream Snow', characters:[
    {name:'Lazy Moments', rarity:'Standard', odds:'1/12', image:'https://toysez.com/cdn/shop/files/1_3_73a15dda-577b-4b98-91d6-43973db6bd49.jpg?v=1759164814'},
    {name:'Eternity of Pizza', rarity:'Standard', odds:'1/12', image:'https://toysez.com/cdn/shop/files/2_3_3c5d4aa5-dd43-4638-878e-3f3c4675d626.jpg?v=1759164814'},
    {name:'Macaron Moment', rarity:'Standard', odds:'1/12', image:'https://prod-apac-r2.popmart.com/cdn-cgi/image/width=640%2Cformat=webp/https://prod-eurasian-res.popmart.com/default/20250923_161016_352851____3_____1200x1200.jpg'},
    {name:'Earl Teapot', rarity:'Standard', odds:'1/12', image:'https://toysez.com/cdn/shop/files/5_3_4b6d15d9-1e0f-4680-84df-e60073755cd3.jpg?v=1759164814'},
    {name:'Orange Marmalade', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQICVqByqlAekRGbqhhA71Zzpb40oEFVz9nN4WMn3gRnA&s=105'},
    {name:'Lucky Pudding', rarity:'Standard', odds:'1/12', image:'https://prod-apac-r2.popmart.com/cdn-cgi/image/width=640%2Cformat=webp/https://prod-eurasian-res.popmart.com/default/20250923_161016_050042____4_____1200x1200.jpg'},
    {name:'Strong Bread', rarity:'Standard', odds:'1/12', image:'https://toysez.com/cdn/shop/files/7_4_1c6ed068-3f45-4351-bdb9-97d10b3fbe9f_large.jpg?v=1759164814'},
    {name:'Cookie House', rarity:'Standard', odds:'1/12', image:'https://prod-apac-r2.popmart.com/cdn-cgi/image/width=640%2Cformat=webp/https://prod-eurasian-res.popmart.com/default/20250923_161016_370171____6_____1200x1200.jpg'},
    {name:'Star Candy', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqY8PAqXRUIClGBmSJf9CJIASxTR-fP4NZkiHDh50FXYQy1vtcQ_XgSYw&s=10'},
    {name:'Coffee Milk Bath', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS10nPKoBcfqrrmmRWhYUjnzZWEAp4sig2oKDOIX1ypPwaaqQQMzIAgutq3&s=10'},
    {name:'Happy Palmier', rarity:'Standard', odds:'1/12', image:'https://prod-apac-r2.popmart.com/cdn-cgi/image/width=640%2Cformat=webp/https://prod-eurasian-res.popmart.com/default/20250923_161016_842890____2_____1200x1200.jpg'},
    {name:'Chesnut Cream', rarity:'Standard', odds:'1/12', image:'https://prod-apac-r2.popmart.com/cdn-cgi/image/width=640%2Cformat=webp/https://prod-eurasian-res.popmart.com/default/20250923_161016_615153____5_____1200x1200.jpg'},
    {name:'Matcha Cream Snow', rarity:'Secret Chase', odds:'1/144', image:'https://prod-apac-r2.popmart.com/cdn-cgi/image/width=640%2Cformat=webp/https://prod-eurasian-res.popmart.com/default/20250923_161016_277770____8_____1200x1200.jpg'},
  ]}),
  makeSeries({name:'Twinkle Twinkle A Big Hug for You', modelPreview:false, category:'twinkle', series:'A Big Hug for You', price:810, tag:'tag-low', tagText:'Low stock', heightCm:8, image:'https://i.pinimg.com/736x/bc/5e/1b/bc5e1b17c38a3e3250bf169822774c87.jpg', chase:'The Best Gift', characters:[
    {name:'Make a Wish', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1733457544228____make-a-wish____.png?x-oss-process=image/format,webp'},
    {name:'Star Apple', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1733457550314____star-apple____.png?x-oss-process=image/format,webp'},
    {name:'Star Jar', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1733457556439____star-jar____.png?x-oss-process=image/format,webp'},
    {name:'Happy Trumpeter', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1733457563172____happy-trumpeter____.png?x-oss-process=image/format,webp'},
    {name:'Lovely Puppy', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1733457583784____lovely-puppy____.png?x-oss-process=image/format,webp'},
    {name:'A Big Hug', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1733457589240____a-big-hug____.png?x-oss-process=image/format,webp'},
    {name:'Fortune Cookies', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1733457595203____fortune-cookies____.png?x-oss-process=image/format,webp'},
    {name:'Snowman Friend', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1733457602109____snowman-friend____.png?x-oss-process=image/format,webp'},
    {name:'Handwritten Gift', rarity:'Standard', odds:'1/12', image:'https://global-static.popmart.com/globalAdmin/1733457608559____handwritten-gift____.png?x-oss-process=image/format,webp'},
    {name:'The Best Gift', rarity:'Secret Chase', odds:'1/144', image:'https://global-static.popmart.com/globalAdmin/1733457615147____secret____.png?x-oss-process=image/format,webp'},
  ]}),
  makeSeries({name:'Twinkle Twinkle Be a Little Star', category:'twinkle', series:'Be a Little Star', price:900, tag:'tag-new', tagText:'New', heightCm:8, image:'https://prod-apac-r2.popmart.com/cdn-cgi/image/width=1080%2Cformat=webp/https://prod-eurasian-res.popmart.com/default/20250416_173926_717731____5_____1200x1200.jpg', chase:'Reach for the Stars', characters:[
    {name:'Lose a Tooth', rarity:'Standard', odds:'1/12', image:'https://images.stockx.com/images/Pop-Mart-Twinkle-Twinkle-Be-a-Little-Star-Series-Lose-a-Tooth-Figure.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1750192763'},
    {name:'Wake up! Sleepyhead!', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6yV1XQ2B3txwGYeuomy1U0glqH5ABKJRL3PasgIRNmg&s=10'},
    {name:'Haircut', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGOMqFdoCata8sTAk2w8GGSkaGIgzaEARgkxyvyruSjjx8vskAw1RdyR8&s=10'},
    {name:'Bad Temper', rarity:'Standard', odds:'1/12', image:'https://images.stockx.com/images/Pop-Mart-Twinkle-Twinkle-Be-a-Little-Star-Series-Bad-Temper-Figure.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1750192773'},
    {name:'The Magical Chef', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTFoN4IV1hdgWFSSdC1RMP8aSpfQbnbtzQjB3J3ZIhfj5G0trELECFZ8uG&s=10'},
    {name:'Baby Ice Pop', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDguvgcR_uhbf4wW8z5sH-pOMqprfSYgEXweMb_yU1Rvj9a0cE5Is0s0c&s=10'},
    {name:'Reach for the Stars', rarity:'Secret Chase', odds:'1/144', image:'https://media.karousell.com/media/photos/products/2025/4/19/secret_rare_popmart_popmart_tw_1745036319_caeb76b8_progressive.jpg'},
  ]}),

  // Smiski series use six standard designs and one secret question-mark slot.
  makeSeries({name:'Smiski Living Series', modelPreview:false, category:'smiskis', series:'Living Series', price:590, tag:'tag-new', tagText:'New', heightCm:6.5, image:'https://smiski.com/e/wp-content/uploads/2018/08/05.png', chase:'Secret', characters:['Daydreaming','Playing','Hiding','Nap Time','Thinking','Lifting'], characterImages:[
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-MHAyZhcOO2a5RJq-Jvmz7KwC1K1JNr0QQ63CqN4vZo-XakQUtbQIxBYw&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgFIlrViJcShzgOicbpXsS8DeH1QdwNZq_1OU5O_sOWymUguZXe2R5Dxc7&s=10',
    'https://blinkbox.com.au/cdn/shop/files/smiski_living-series_hiding-holding.webp?v=1706086015&width=1406',
    'https://mindzai.com/cdn/shop/files/652eb54139e4ab4dc3c1b6b7_1739601159556_be7ba372-18d0-436b-bc06-3668c1ad316e_5000x.jpg?v=1776017829',
    'https://i.ebayimg.com/images/g/VHcAAOSwXoJoWFUY/s-l1200.jpg',
    'https://blinkbox.com.au/cdn/shop/files/smiski_living-series_individual-lifting.webp?crop=center&height=1500&v=1706086015&width=1500',
    '?',
  ]}),
  makeSeries({name:'Smiski Bed Series', modelPreview:false, category:'smiskis', series:'Bed Series', price:590, tag:'tag-low', tagText:'Low stock', heightCm:6.5, image:'https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_01.png', chase:'Secret (Crescent Moon)', characters:['Before Rest','Sleepy','Co-Sleeping','Reading','At Sleep','Fussing'], characterImages:[
    'https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_04.png',
    'https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_02.png',
    'https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_03.png',
    'https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_04.png',
    'https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_05.png',
    'https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_06.png',
    '?',
  ]}),
  makeSeries({name:'Smiski Yoga Series', category:'smiskis', series:'Yoga Series', price:590, tag:'tag-new', tagText:'New', heightCm:6.5, image:'https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_01.png', chase:'Secret (Twin Angels)', characters:['Lotus Pose','Twist Pose','Ship Pose','Triangle Pose','Shoulders Stand Pose','Tree Pose'], characterImages:[
    'https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_01.png?v=2',
    'https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_02.png',
    'https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_06.png',
    'https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_04.png',
    'https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_03.png',
    'https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_05.png',
    '?',
  ]}),
];

const PULL_POOL_VERSION = 3;
const PULL_OFFER_DURATION = 30 * 60 * 1000;
const AVAILABLE_PULL_POOL = PRODUCTS
  .filter(product=> product.tag !== 'tag-soldout')
  .flatMap(product=> product.characters.map(character=>{
    const denominator = Number(String(character.odds).match(/\/\s*(\d+)/)?.[1]) || 12;
    return {
      id:`${product.name}:${character.id}`,
      characterId:character.id,
      name:character.name,
      productName:product.name,
      seriesName:product.series,
      price:product.price,
      image:character.image || product.image || '',
      rarity:character.rarity,
      odds:character.odds,
      rarityClass:character.rarity === 'Secret Chase' ? 'rarity-secret' : 'rarity-common',
      weight:1 / denominator,
      product,
      character,
    };
  }));
const COLLECTIBLE_PRODUCTS = PRODUCTS;

const MARKETPLACE_CHARACTERS = PRODUCTS.flatMap(product=>product.characters.map(character=>({
    key:`${product.name}::${character.id}`,
    product,
    character,
  })));
const MARKETPLACE_BY_KEY = new Map(MARKETPLACE_CHARACTERS.map(entry=>[entry.key, entry]));
const COMMUNITY_CANDIDATES = MARKETPLACE_CHARACTERS.filter(entry=>entry.product.tag !== 'tag-soldout');
const COMMUNITY_SELLERS = [
  {handle:'@roro.crates', deals:12},
  {handle:'@finchbox', deals:8},
  {handle:'@minttape', deals:21},
  {handle:'@shelfshelf', deals:6},
  {handle:'@pinkboxpe', deals:15},
  {handle:'@collectph', deals:9},
];
const COMMUNITY_LISTINGS = COMMUNITY_CANDIDATES.slice(0, COMMUNITY_SELLERS.length).map((entry, index)=>{
  const iso = MARKETPLACE_CHARACTERS[(index + COMMUNITY_SELLERS.length) % MARKETPLACE_CHARACTERS.length];
  return {
    id:`community-${index + 1}`,
    productName:entry.product.name,
    characterId:entry.character.id,
    type:['trade', 'sale', 'trade-or-buy'][index % 3],
    askPrice:entry.product.price,
    conditions:index % 2 ? ['Opened', 'With Box', 'With Card'] : ['Sealed Foil', 'With Box', 'With Card'],
    seller:COMMUNITY_SELLERS[index].handle,
    verifiedDeals:COMMUNITY_SELLERS[index].deals,
    isoIds:[iso.key],
    openToOffers:index % 2 === 0,
    community:true,
  };
});

/* ================= Cart (persisted across pages) ================= */
function loadCart(){
  let stored;
  const storageKey = accountStorageKey('joyTrinkets_cart');
  try{
    const raw = localStorage.getItem(storageKey);
    stored = raw ? JSON.parse(raw) : [];
  }catch(error){
    console.error('Could not read the cart.', error);
    toast('Your saved cart could not be read');
    return [];
  }
  if(!Array.isArray(stored)){
    console.error('The saved cart is not a valid list.');
    return [];
  }
  let updated = false;
  const loaded = stored.filter(line=>{
    const valid = line.isBoxPull || PRODUCTS.some(product=>product.name === (line.productName || line.name));
    if(!valid) updated = true;
    return valid;
  }).map(line=>{
    if(line.id) return line;
    updated = true;
    return {...line, id:createLocalId('cart')};
  });
  if(updated){
    try{
      localStorage.setItem(storageKey, JSON.stringify(loaded));
    }catch(error){
      console.error('Could not migrate the saved cart.', error);
      toast('Your saved cart could not be updated');
    }
  }
  return loaded;
}
function saveCart(){
  try{
    localStorage.setItem(accountStorageKey('joyTrinkets_cart'), JSON.stringify(cart));
    return true;
  }catch(error){
    console.error('Could not save the cart.', error);
    toast('Your cart could not be saved in this browser');
    return false;
  }
}
let cart = loadCart();
function createLocalId(prefix){
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
const BUNDLE_DISCOUNT_THRESHOLD = 3;
const BUNDLE_DISCOUNT_RATE = 0.10;
const SHIPPING_RATES = {
  metro: 60,
  luzon: 95,
  vismin: 135,
  pickup: 0,
};
const SHIPPING_LABELS = {
  metro: 'Metro Manila Standard / Same-Day',
  luzon: 'Provincial Luzon',
  vismin: 'Visayas & Mindanao',
  pickup: 'In-Store Pickup (Joy Trinkets)',
};

function getSelectedPayment(){
  try{
    return localStorage.getItem('joytrinkets_payment') || '';
  }catch(error){
    console.error('Could not read the selected payment method.', error);
    return '';
  }
}
function setSelectedPayment(method){
  try{
    localStorage.setItem('joytrinkets_payment', method);
  }catch(error){
    console.error('Could not save the selected payment method.', error);
  }
}

function getSignedInEmail(){
  try{
    return localStorage.getItem('joytrinkets_user') || '';
  }catch(error){
    console.error('Could not read the sign-in state.', error);
    return '';
  }
}

function requireSignedIn(message='Please sign in to continue.'){
  if(getSignedInEmail()) return true;
  toast(message);
  renderSignInModal();
  return false;
}

function updateSignInButton(){
  const signedInEmail = getSignedInEmail();
  document.querySelectorAll('[data-modal="signin"], [data-modal="signout"]').forEach(button=>{
    button.dataset.modal = signedInEmail ? 'signout' : 'signin';
    button.textContent = signedInEmail ? 'Sign out' : 'Sign in';
    button.setAttribute('aria-label', signedInEmail ? `Sign out ${signedInEmail}` : 'Sign in');
  });
}

function loadCollection(){
  if(!getSignedInEmail()) return [];
  try{
    const raw = localStorage.getItem(accountStorageKey('joyTrinkets_collection'));
    const collection = raw ? JSON.parse(raw) : [];
    if(raw && !Array.isArray(collection)) console.error('The saved collection is not a valid list.');
    return Array.isArray(collection) ? collection : [];
  }catch(error){
    console.error('Could not read the collection.', error);
    toast('Your saved collection could not be read');
    return [];
  }
}
function saveCollection(collection){
  if(!getSignedInEmail()){
    toast('Sign in before saving changes to your Collection');
    return false;
  }
  try{
    localStorage.setItem(accountStorageKey('joyTrinkets_collection'), JSON.stringify(collection));
    return true;
  }catch(error){
    console.error('Could not save the collection.', error);
    toast('Your collection could not be saved in this browser');
    return false;
  }
}
function addToCart(p){
  const line = cart.find(l=> !l.isBoxPull && (l.productName || l.name) === p.name);
  if(line) line.qty++;
  else cart.push({id:createLocalId('product'), name:p.name, productName:p.name, seriesName:p.series, price:p.price, qty:1, image:p.image || ''});
  if(!saveCart()) return;
  updateCartBadge();
  toast(`${p.name} added to cart`);
}
function addPulledFigureToCart(poolItem, pullId, offerExpiresAt){
  if(!getSignedInEmail()){
    requireSignedIn('Sign in to save this Box Pull reservation to your account');
    return false;
  }
  if(!Number.isFinite(Number(offerExpiresAt)) || offerExpiresAt <= Date.now()) return false;
  const reservationId = `pull-${pullId}`;
  if(cart.some(line=>line.id === reservationId)) return true;
  cart.push({
    id:reservationId,
    pullId,
    isBoxPull:true,
    name:poolItem.name,
    characterName:poolItem.character.name,
    productName:poolItem.productName,
    seriesName:poolItem.seriesName,
    characterId:poolItem.characterId,
    rarity:poolItem.rarity,
    odds:poolItem.odds,
    image:poolItem.image,
    price:poolItem.price,
    qty:1,
    offerExpiresAt,
    accountId:getSignedInEmail().trim().toLowerCase(),
    modelUrl:poolItem.character.modelUrl,
    modelOrientation:poolItem.character.modelOrientation,
  });
  if(!saveCart()){
    cart.pop();
    return false;
  }
  updateCartBadge();
  toast(`${poolItem.name} reservation added to cart`);
  return true;
}
function isPullOfferExpired(line){
  const expiresAt = Number(line.offerExpiresAt);
  return Boolean(line.isBoxPull) && (!Number.isFinite(expiresAt) || expiresAt <= Date.now());
}
function addPurchasedItemsToCollection(lines){
  if(!getSignedInEmail()){
    toast('Sign in before syncing purchases to your Collection');
    return false;
  }
  let collection;
  const storageKey = accountStorageKey('joyTrinkets_collection');
  try{
    const raw = localStorage.getItem(storageKey);
    const stored = raw ? JSON.parse(raw) : [];
    if(!Array.isArray(stored)) throw new Error('Saved collection data is not a list.');
    collection = stored;
  }catch(error){
    console.error('Could not read the collection for checkout.', error);
    toast('Your collection could not be updated; your cart is unchanged');
    return false;
  }
  const recordedPurchases = new Set(collection.map(item=>item.purchaseId).filter(Boolean));
  for(const line of lines){
    if(recordedPurchases.has(line.id)) continue;
    const isPulledCharacter = line.isBoxPull;
    collection.push({
      purchaseId:line.id,
      kind:isPulledCharacter ? 'character' : 'series',
      name:isPulledCharacter ? (line.characterName || line.name) : (line.productName || line.name),
      characterName:isPulledCharacter ? (line.characterName || line.name) : '',
      productName:line.productName || line.name,
      seriesName:line.seriesName || line.productName || line.name,
      qty:line.qty,
      image:line.image || '',
      price:line.price,
      characterId:isPulledCharacter ? line.characterId : '',
      rarity:isPulledCharacter ? line.rarity : '',
      odds:isPulledCharacter ? line.odds : '',
      modelUrl:isPulledCharacter ? line.modelUrl : '',
      modelOrientation:isPulledCharacter ? line.modelOrientation : null,
    });
    recordedPurchases.add(line.id);
  }
  return saveCollection(collection);
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
let modalReturnState = null;

function openModal(html){
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  if(!overlay || !body) return;
  modalReturnState = null;
  disposeGaussianViewer();
  body.innerHTML = html;
  const modalBox = overlay.querySelector('.modal-box');
  if(modalBox){
    const wide = Boolean(body.querySelector('.character-viewer, .model-viewer, .trade-proposal, .trade-form-panel'));
    modalBox.classList.toggle('modal-box-wide', wide);
    modalBox.classList.toggle('modal-box-trade', Boolean(body.querySelector('.trade-proposal, .trade-form-panel')));
  }
  overlay.classList.add('open');
}
let activeGaussianViewer = null;
let activeModelLoadTimeout = null;
let modelViewerRequestVersion = 0;
let activeCharacterProduct = null;
let activeCharacterIndex = 0;

function closeModal(event){
  if(event) event.stopPropagation();
  const returnState = modalReturnState;
  modalReturnState = null;
  disposeGaussianViewer();
  const overlay = document.getElementById('modalOverlay');
  if(returnState && returnState.type === 'trade-proposal'){
    renderTradeProposalModal(returnState.listingId, returnState.formState);
  }else if(returnState){
    renderCharacterModal(returnState.product, returnState.index);
  }else if(overlay){
    overlay.classList.remove('open');
  }
}

function disposeGaussianViewer(){
  modelViewerRequestVersion++;
  clearTimeout(activeModelLoadTimeout);
  activeModelLoadTimeout = null;
  const viewer = activeGaussianViewer;
  activeGaussianViewer = null;
  if(viewer){
    const rootElement = viewer.rootElement;
    if(rootElement && rootElement.parentElement !== document.body){
      // Viewer.dispose() removes its rootElement directly from document.body.
      rootElement.style.display = 'none';
      document.body.appendChild(rootElement);
    }
    viewer.stop();
    if(viewer.renderer) viewer.renderer.forceContextLoss();
    viewer.dispose().catch(error=>console.error('Could not fully dispose the 3D model viewer.', error));
  }
}

function figureHeightText(heightCm){
  return `${heightCm.toFixed(1)} cm / ${(heightCm / 2.54).toFixed(1)} in`;
}

function renderCharacterModal(product, index=0){
  activeCharacterProduct = product;
  activeCharacterIndex = (index + product.characters.length) % product.characters.length;
  const character = product.characters[activeCharacterIndex];
  openModal(`
    <div class="character-viewer">
      <div class="character-viewer-heading"><div><span class="kicker">${escAttr(product.series)}</span><h3>${escAttr(product.name)}</h3></div><span class="character-count">${activeCharacterIndex + 1} of ${product.characters.length}</span></div>
      <div class="character-main">
        <button class="viewer-arrow" type="button" data-character-prev aria-label="Previous character">←</button>
        <div class="character-image-wrap">${placeholderBox(character.name, character.image)}</div>
        <button class="viewer-arrow" type="button" data-character-next aria-label="Next character">→</button>
      </div>
      <div class="character-info">
        <h4>${escAttr(character.name)}</h4><span class="rarity-badge ${character.rarity === 'Secret Chase' ? 'rarity-secret' : 'rarity-common'}">${escAttr(character.rarity)}</span>
        <p>Pull odds <b>${escAttr(character.odds)}</b> <span class="character-height">· ${figureHeightText(product.heightCm)}</span></p>
        <div class="character-thumbnails" aria-label="Choose a character">${product.characters.map((item, itemIndex)=>`<button type="button" class="character-thumb ${itemIndex === activeCharacterIndex ? 'active' : ''}" data-character-index="${itemIndex}" aria-label="View ${escAttr(item.name)}">${placeholderBox(item.name, item.image)}</button>`).join('')}</div>
        <div class="character-actions"><button class="btn btn-primary" type="button" data-character-add ${product.tag === 'tag-soldout' ? 'disabled' : ''}>Add Blind Box to Cart · ${peso(product.price)}</button>${product.modelPreview && hasCharacterModel(character.name) ? `<button class="btn btn-outline" type="button" data-model-preview data-character-id="${escAttr(character.id)}" data-character-name="${escAttr(character.name)}">See 3D Model</button>` : ''}</div>
      </div>
    </div>`);
  const body = document.getElementById('modalBody');
  body.querySelector('[data-character-prev]').addEventListener('click', ()=>renderCharacterModal(product, activeCharacterIndex - 1));
  body.querySelector('[data-character-next]').addEventListener('click', ()=>renderCharacterModal(product, activeCharacterIndex + 1));
  body.querySelectorAll('[data-character-index]').forEach(button=>button.addEventListener('click', ()=>renderCharacterModal(product, Number(button.dataset.characterIndex))));
  const addButton = body.querySelector('[data-character-add]');
  if(addButton) addButton.addEventListener('click', ()=>addToCart(product));
  const modelPreviewButton = body.querySelector('[data-model-preview]');
  if(modelPreviewButton){
    modelPreviewButton.addEventListener('click', event=>{
      const button = event.currentTarget;
      renderModelViewer(product, button.dataset.characterName, character);
    });
  }
}

function renderModelViewer(product, displayName=product.name, character=null, customReturnState=null){
  const returnState = customReturnState || (document.querySelector('#modalOverlay.open #modalBody .character-viewer')
    ? {product:activeCharacterProduct, index:activeCharacterIndex}
    : null);
  const registeredModel = character && registeredCharacterModel(character.name);
  if(!registeredModel?.url){
    toast('3D preview is unavailable for this character');
    return;
  }
  const {url:modelUrl, ...registryOrientation} = registeredModel;
  const orientation = {
    ...MODEL_VIEWER_SETTINGS,
    ...(product.modelOrientation || {}),
    ...registryOrientation,
    ...((character && character.modelOrientation) || {}),
  };
  openModal(`
    <div class="model-viewer">
      <span class="kicker">3D model</span><h3>${escAttr(displayName)}</h3>
      <p class="modal-sub">Drag to rotate · scroll or pinch to zoom</p>
      <div class="model-viewer-stage" data-model-stage>
        <div class="model-loading" data-model-loading role="status"><span class="model-spinner" aria-hidden="true"></span><span>Loading 3D model…</span></div>
        <p class="model-error" data-model-error role="alert" hidden>Could not load this 3D model. Check that the model file is available, then try again.</p>
      </div>
      <div class="model-viewer-actions">
        <button class="btn btn-outline" type="button" data-model-reset disabled>Reset View</button>
        <button class="btn btn-outline" type="button" data-model-close>Close</button>
      </div>
    </div>`);
  modalReturnState = returnState;

  const requestVersion = modelViewerRequestVersion;
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  const stage = body.querySelector('[data-model-stage]');
  const loading = body.querySelector('[data-model-loading]');
  const resetButton = body.querySelector('[data-model-reset]');
  const loadError = body.querySelector('[data-model-error]');
  let timedOut = false;
  body.querySelector('[data-model-close]').addEventListener('click', closeModal);
  resetButton.addEventListener('click', ()=>{
    if(activeGaussianViewer && activeGaussianViewer.controls) activeGaussianViewer.controls.reset();
  });

  try{
    const viewer = new GaussianSplats3D.Viewer({
      rootElement:stage,
      sharedMemoryForWorkers:false,
      cameraUp:orientation.cameraUp,
      initialCameraPosition:orientation.cameraPosition,
      initialCameraLookAt:orientation.initialCameraLookAt,
    });
    activeGaussianViewer = viewer;
    activeModelLoadTimeout = setTimeout(()=>{
      activeModelLoadTimeout = null;
      if(requestVersion !== modelViewerRequestVersion) return;
      timedOut = true;
      console.error(`Timed out loading 3D model "${modelUrl}" for "${displayName}".`);
      loading.hidden = true;
      loadError.textContent = `The 3D model for ${displayName} did not finish loading. Check that "${modelUrl}" exists and try again.`;
      loadError.hidden = false;
    }, 45000);
    viewer.addSplatScene(modelUrl, {
      splatAlphaRemovalThreshold:5,
      showLoadingUI:false,
      rotation:orientation.rotation,
    }).then(()=>{
      clearTimeout(activeModelLoadTimeout);
      activeModelLoadTimeout = null;
      if(timedOut || requestVersion !== modelViewerRequestVersion || !overlay.classList.contains('open')) return;
      viewer.controls.minPolarAngle = 0;
      viewer.controls.maxPolarAngle = Math.PI;
      viewer.start();
      loading.hidden = true;
      resetButton.disabled = false;
    }).catch(error=>{
      clearTimeout(activeModelLoadTimeout);
      activeModelLoadTimeout = null;
      if(timedOut || requestVersion !== modelViewerRequestVersion) return;
      console.error(`Could not load 3D model "${modelUrl}" for "${displayName}".`, error);
      loading.hidden = true;
      loadError.textContent = `Could not load the 3D model for ${displayName}. Check that "${modelUrl}" exists and try again.`;
      loadError.hidden = false;
    });
  }catch(error){
    clearTimeout(activeModelLoadTimeout);
    activeModelLoadTimeout = null;
    console.error(`Could not initialize 3D model viewer for "${modelUrl}" (${displayName}).`, error);
    loading.hidden = true;
    loadError.textContent = `Could not initialize the 3D model for ${displayName}.`;
    loadError.hidden = false;
  }
}

function renderCartModal(){
  if(cart.length === 0){
    openModal(`
      <h3>Your cart</h3>
      <p class="modal-sub">It's empty for now.</p>
      <a class="btn btn-primary" href="drops.html" style="width:100%; justify-content:center;">Browse drops</a>`);
    return;
  }
  const itemCount = cartItemCount();
  const subtotal = cartTotal();
  const discount = itemCount >= BUNDLE_DISCOUNT_THRESHOLD ? Math.round(subtotal * BUNDLE_DISCOUNT_RATE) : 0;
  const hasExpiredPulls = cart.some(isPullOfferExpired);
  const remainingForBundle = Math.max(0, BUNDLE_DISCOUNT_THRESHOLD - itemCount);
  const bundleProgress = itemCount >= BUNDLE_DISCOUNT_THRESHOLD
    ? `<div class="bundle-progress unlocked">10% Bundle Discount unlocked (−${peso(discount)})</div>`
    : `<div class="bundle-progress">Add ${remainingForBundle} more box${remainingForBundle === 1 ? '' : 'es'} to unlock 10% off</div>`;
  const lines = cart.map(l=> `
    <div class="cart-line">
      <div class="cart-line-figure" style="background:var(--surface-2); display:flex; align-items:center; justify-content:center; overflow:hidden;">${l.image ? `<img src="${escAttr(l.image)}" alt="${escAttr(l.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="imgFallback(this)">` : '<span style="font-size:10px; color:var(--muted); text-align:center;">img</span>'}</div>
      <div class="cart-line-info">
        <b>${escAttr(l.name)}</b>
        <span class="item-type-subtitle">${l.isBoxPull ? `Box Pull Reveal · ${escAttr(l.seriesName || 'Unboxed Character')}` : 'Sealed Blind Box'}</span>
        <span>${peso(l.price)} each${isPullOfferExpired(l) ? ' · Offer expired' : ''}</span>
        <span class="cart-line-total">Line total <strong>${peso(l.price * l.qty)}</strong></span>
      </div>
      <div class="cart-line-action">
        ${l.isBoxPull
          ? '<span class="box-pull-lock">Box Pull Reveal · 1 reserved</span>'
          : `<div class="cart-stepper" aria-label="Quantity for ${escAttr(l.name)}">
              <button type="button" data-cart-minus="${escAttr(l.id)}" aria-label="Decrease quantity">−</button>
              <strong>${l.qty}</strong>
              <button type="button" data-cart-plus="${escAttr(l.id)}" aria-label="Increase quantity">+</button>
            </div>`}
        <button class="cart-remove" data-remove="${escAttr(l.id)}">Remove</button>
      </div>
    </div>`).join('');
  openModal(`
    <h3>Your cart</h3>
    <p class="modal-sub">${itemCount} item${itemCount === 1 ? '' : 's'} · packed with care</p>
    ${bundleProgress}
    ${lines}
    <div class="cart-totals">
      <div><span>Subtotal</span><span>${peso(subtotal)}</span></div>
      <div><span>Bundle discount</span><span>${discount ? `−${peso(discount)}` : peso(0)}</span></div>
      <div class="cart-total-row"><strong>Items total</strong><strong>${peso(subtotal - discount)}</strong></div>
    </div>
    <p class="cart-shipping-note">Shipping is confirmed after your delivery address is reviewed.</p>
    <p class="cart-protection-note">Order protection: review your order before confirming. Payment details are never stored here.</p>
    <div class="payment-badges cart-payment-badges" aria-label="Payment methods available">
      ${['GCash','Maya','Credit / Debit Card','Cash on Delivery (COD)'].map(method=>{
        const short = method === 'Credit / Debit Card' ? 'Card' : method === 'Cash on Delivery (COD)' ? 'COD' : method;
        return `<button type="button" class="payment-badges payment-pill ${getSelectedPayment() === method ? 'selected' : ''}" data-payment="${escAttr(method)}" aria-pressed="${getSelectedPayment() === method}">${short}</button>`;
      }).join('')}
    </div>
    ${hasExpiredPulls ? '<p class="checkout-offer-warning" role="alert">Remove expired Box Pull reservations before checkout.</p>' : ''}
    <button class="btn btn-primary" id="checkoutBtn" style="width:100%; justify-content:center; margin-top:18px;" ${hasExpiredPulls ? 'disabled' : ''}>Continue to checkout</button>`);
  const body = document.getElementById('modalBody');
  body.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      cart = cart.filter(l=> l.id !== btn.dataset.remove);
      saveCart();
      updateCartBadge();
      renderCartModal();
    });
  });
  body.querySelectorAll('[data-cart-minus]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const line = cart.find(l=>l.id === btn.dataset.cartMinus);
      if(!line || line.isBoxPull) return;
      line.qty--;
      if(line.qty < 1) cart = cart.filter(l=>l.id !== line.id);
      saveCart();
      updateCartBadge();
      renderCartModal();
    });
  });
  body.querySelectorAll('[data-cart-plus]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const line = cart.find(l=>l.id === btn.dataset.cartPlus);
      if(!line || line.isBoxPull) return;
      line.qty++;
      saveCart();
      updateCartBadge();
      renderCartModal();
    });
  });
  body.querySelectorAll('[data-payment]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      setSelectedPayment(btn.dataset.payment);
      body.querySelectorAll('[data-payment]').forEach(pill=>{
        const selected = pill.dataset.payment === btn.dataset.payment;
        pill.classList.toggle('selected', selected);
        pill.setAttribute('aria-pressed', String(selected));
      });
      toast(`${btn.dataset.payment} selected`);
    });
  });
  const checkoutBtn = body.querySelector('#checkoutBtn');
  if(checkoutBtn) checkoutBtn.addEventListener('click', ()=>{ location.href = 'checkout.html'; });
}

function renderSignInModal(){
  openModal(`
    <h3>Sign in</h3>
    <p class="modal-sub">Demo sign-in — any valid email and password unlocks this feature in this browser.</p>
    <form id="signInForm">
      <div class="form-field"><label for="signInEmail">Email</label><input id="signInEmail" name="email" type="email" autocomplete="email" placeholder="you@email.com" required></div>
      <div class="form-field"><label for="signInPassword">Password</label><input id="signInPassword" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required></div>
      <button class="btn btn-primary" type="submit" style="width:100%; justify-content:center;">Log in</button>
    </form>
    <p style="text-align:center; font-size:13px; color:var(--muted); margin-top:14px;">No account? <button style="background:none;border:none;color:var(--coral); text-decoration:underline; font-size:13px;" id="signupLink">Sign up</button></p>`);
  const body = document.getElementById('modalBody');
  body.querySelector('#signInForm').addEventListener('submit', event=>{
    event.preventDefault();
    const form = event.currentTarget;
    if(!form.reportValidity()) return;
    const email = body.querySelector('#signInEmail').value.trim();
    try{
      localStorage.setItem('joytrinkets_user', email);
    }catch(error){
      console.error('Could not save the sign-in state.', error);
      toast('Sign in could not be saved in this browser');
      return;
    }
    closeModal();
    updateSignInButton();
    toast('Signed in (demo)');
    location.reload();
  });
  body.querySelector('#signupLink').addEventListener('click', ()=> toast('Sign-up flow coming soon'));
}

function renderCatalogModal(){
  const rows = PRODUCTS.map(p=> `
    <div class="modal-list-item">
      <div style="width:44px;height:44px;border-radius:8px;background:var(--surface-2); flex-shrink:0; overflow:hidden; display:flex; align-items:center; justify-content:center;">${p.image ? `<img src="${escAttr(p.image)}" alt="${escAttr(p.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="imgFallback(this)">` : ''}</div>
      <div class="listing-info" style="flex:1;"><b>${p.name}</b><span>${p.series} · ${peso(p.price)}</span></div>
      <button class="catalog-select-btn" type="button" data-select-series="${escAttr(p.name)}">View →</button>
    </div>`).join('');
  openModal(`<h3>Full catalog</h3><p class="modal-sub">${PRODUCTS.length} figures across 6 categories.</p>${rows}`);
  const body = document.getElementById('modalBody');
  body.querySelectorAll('[data-select-series]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const p = PRODUCTS.find(x=> x.name === btn.dataset.selectSeries);
      if(p) renderCharacterModal(p);
    });
  });
}

const TRADE_LISTINGS_STORAGE_KEY = 'joytrinkets_trade_listings';
const TRADE_DEALS_STORAGE_KEY = 'joytrinkets_trade_deals';
const TRADE_CONDITIONS = ['With Box', 'With Card', 'Sealed Foil', 'Opened', 'Loose Figure'];
const TRADE_STAGES = [
  'Offer Agreed & Escrow Locked',
  'Shipped / Dropped Off to Joy Trinkets',
  'In-Store Legit Check',
  'Dispatched to Receiver',
  'Delivered & Collection Updated',
];

function tradeCharacter(productName, characterId){
  return MARKETPLACE_BY_KEY.get(`${productName}::${characterId}`) || null;
}

function tradeKey(entry){
  return `${entry.product.name}::${entry.character.id}`;
}

function loadTradeListings(){
  if(!getSignedInEmail()) return [];
  try{
    const raw = localStorage.getItem(accountStorageKey(TRADE_LISTINGS_STORAGE_KEY));
    if(!raw) return [];
    const stored = JSON.parse(raw);
    if(!Array.isArray(stored)) throw new Error('Saved trade listings are not a list.');
    return stored.filter(listing=>{
      const entry = tradeCharacter(listing.productName, listing.characterId);
      return entry && ['trade', 'sale', 'trade-or-buy'].includes(listing.type);
    }).map(listing=>{
      const entry = tradeCharacter(listing.productName, listing.characterId);
      const savedAskPrice = Number(listing.askPrice);
      return {
        ...listing,
        askPrice:Number.isFinite(savedAskPrice) && savedAskPrice > 0 ? savedAskPrice : entry.product.price,
        conditions:Array.isArray(listing.conditions) ? listing.conditions.filter(item=>TRADE_CONDITIONS.includes(item)) : [],
        isoIds:Array.isArray(listing.isoIds) ? listing.isoIds.filter(key=>MARKETPLACE_BY_KEY.has(key)) : [],
      };
    });
  }catch(error){
    console.error('Could not read marketplace listings.', error);
    toast('Saved marketplace listings could not be read');
    return [];
  }
}

function saveTradeListings(listings){
  if(!getSignedInEmail()) return false;
  try{
    localStorage.setItem(accountStorageKey(TRADE_LISTINGS_STORAGE_KEY), JSON.stringify(listings));
    return true;
  }catch(error){
    console.error('Could not save marketplace listings.', error);
    toast('Your marketplace listing could not be saved');
    return false;
  }
}

function loadTradeOffers(){
  if(!getSignedInEmail()) return [];
  try{
    const raw = localStorage.getItem(accountStorageKey(TRADE_OFFERS_STORAGE_KEY));
    if(!raw) return [];
    const stored = JSON.parse(raw);
    if(!Array.isArray(stored)) throw new Error('Saved trade offers are not a list.');
    const listingIds = new Set([...COMMUNITY_LISTINGS, ...loadTradeListings()].map(listing=>listing.id));
    return stored.filter(offer=>offer && typeof offer.id === 'string'
      && tradeCharacter(offer.productName, offer.characterId)
      && ['incoming', 'sent'].includes(offer.direction)
      && ['pending', 'approved', 'declined'].includes(offer.status)
      && listingIds.has(offer.listingId)
    ).map(offer=>({
      ...offer,
      cash:Math.max(0, Number(offer.cash) || 0),
      offered:Array.isArray(offer.offered) ? offer.offered.filter(item=>
        item && tradeCharacter(item.productName, item.characterId)
      ) : [],
    }));
  }catch(error){
    console.error('Could not read trade offers.', error);
    toast('Saved trade offers could not be read');
    return [];
  }
}

function saveTradeOffers(offers){
  if(!getSignedInEmail()) return false;
  try{
    localStorage.setItem(accountStorageKey(TRADE_OFFERS_STORAGE_KEY), JSON.stringify(offers));
    return true;
  }catch(error){
    console.error('Could not save trade offers.', error);
    toast('Your trade offer could not be saved');
    return false;
  }
}

function createHubWaybill(){
  return `JT-HUB-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function ensureSeedIncomingOffer(listing){
  if(!getSignedInEmail()) return;
  if(!listing.ownerPurchaseId) return;
  const offers = loadTradeOffers();
  if(offers.some(offer=>offer.listingId === listing.id && offer.direction === 'incoming')) return;
  const targetKey = `${listing.productName}::${listing.characterId}`;
  const candidate = MARKETPLACE_CHARACTERS.find(entry=>tradeKey(entry) !== targetKey)
    || MARKETPLACE_CHARACTERS[0];
  if(!candidate) return;
  offers.unshift({
    id:createLocalId('offer'),
    listingId:listing.id,
    productName:listing.productName,
    characterId:listing.characterId,
    direction:'incoming',
    status:'pending',
    offered:[{productName:candidate.product.name, characterId:candidate.character.id}],
    cash:listing.acceptCash ? 120 : 0,
    cashDirection:'add',
    createdAt:Date.now(),
    seeded:true,
  });
  if(!saveTradeOffers(offers)) return;
  const message = listing.acceptCash ? 'New Trade + Cash offer received' : 'New trade offer received';
  addNotification(message, {target:'offers', toastMessage:message});
}

function loadTradeDeals(){
  if(!getSignedInEmail()) return [];
  try{
    const raw = localStorage.getItem(accountStorageKey(TRADE_DEALS_STORAGE_KEY));
    if(!raw) return [];
    const stored = JSON.parse(raw);
    if(!Array.isArray(stored)) throw new Error('Saved trade deals are not a list.');
    const listingById = new Map([...COMMUNITY_LISTINGS, ...loadTradeListings()].map(listing=>[listing.id, listing]));
    return stored.filter(deal=>typeof deal.id === 'string' && tradeCharacter(deal.productName, deal.characterId))
      .map(deal=>{
        const entry = tradeCharacter(deal.productName, deal.characterId);
        const savedAskingPrice = Number(deal.askingPrice);
        const listing = listingById.get(deal.listingId);
        return {
          ...deal,
          askingPrice:Number.isFinite(savedAskingPrice) && savedAskingPrice > 0
            ? savedAskingPrice
            : (listing ? listing.askPrice : entry.product.price),
          catalogPrice:entry.product.price,
          stage:Math.floor(Math.max(0, Math.min(5, Number(deal.stage) || 0))),
          cash:Math.max(0, Number(deal.cash) || 0),
          delivery:deal.delivery === 'dropoff' ? 'dropoff' : 'courier',
          offered:Array.isArray(deal.offered) ? deal.offered.filter(item=>
            item && tradeCharacter(item.productName, item.characterId)
            && (deal.direction === 'incoming' || typeof item.purchaseId === 'string')
          ) : [],
        };
      });
  }catch(error){
    console.error('Could not read active trade deals.', error);
    toast('Saved trade deals could not be read');
    return [];
  }
}

function saveTradeDeals(deals){
  if(!getSignedInEmail()) return false;
  try{
    localStorage.setItem(accountStorageKey(TRADE_DEALS_STORAGE_KEY), JSON.stringify(deals));
    return true;
  }catch(error){
    console.error('Could not save active trade deals.', error);
    toast('Your trade deal could not be saved');
    return false;
  }
}

function ownedTradeCharacters(){
  return loadCollection().flatMap((item, index)=>{
    if(item.kind !== 'character' || item.qty < 1 || !item.purchaseId) return [];
    const entry = tradeCharacter(item.productName, item.characterId);
    if(!entry) return [];
    return [{
      ...entry,
      item,
      purchaseId:item.purchaseId,
      collectionIndex:index,
    }];
  });
}

function allTradeListings(){
  const saved = loadTradeListings();
  return [...COMMUNITY_LISTINGS, ...saved].filter(listing=>tradeCharacter(listing.productName, listing.characterId));
}

function listingTypeLabel(listing){
  if(listing.type === 'sale') return `For Sale · ${peso(listing.askPrice)}`;
  if(listing.type === 'trade-or-buy') return `Trade or Buy · ${peso(listing.askPrice)}`;
  return 'For Trade';
}

function listingImage(entry){
  return placeholderBox(entry.character.name, entry.character.image || entry.product.image);
}

function updatePendingOfferBadge(){
  const pending = loadTradeOffers().filter(offer=>offer.direction === 'incoming' && offer.status === 'pending').length;
  document.querySelectorAll('[data-pending-offer-count]').forEach(badge=>{
    badge.textContent = String(pending);
    badge.hidden = pending === 0;
  });
}

function listingOwnStatus(listing, offers, deals){
  const deal = deals.find(item=>item.id === listing.lockedDealId)
    || deals.find(item=>item.listingId === listing.id);
  if(deal) return deal.stage >= 5 ? 'Completed' : 'In Escrow';
  if(listing.lockedDealId) return 'In Escrow';
  if(offers.some(offer=>offer.listingId === listing.id && offer.direction === 'incoming' && offer.status === 'pending')){
    return 'Offer Pending';
  }
  return 'Live';
}

function renderTradeListings(filter='all'){
  const host = document.getElementById('tradeListings');
  if(!host) return;
  const ownedKeys = new Set(ownedTradeCharacters().map(tradeKey));
  const offers = loadTradeOffers();
  const deals = loadTradeDeals();
  const listings = allTradeListings().filter(listing=>{
    if(filter === 'matches'){
      return listing.isoIds.some(key=>ownedKeys.has(key));
    }
    return filter === 'all' || listing.type === filter;
  });
  if(!listings.length){
    host.innerHTML = `<div class="trade-empty"><b>No matching listings yet.</b><span>Try another filter or post a catalog figure from your Collection.</span></div>`;
    return;
  }
  host.innerHTML = listings.map(listing=>{
    const entry = tradeCharacter(listing.productName, listing.characterId);
    const isoNames = listing.isoIds.map(key=>MARKETPLACE_BY_KEY.get(key)).filter(Boolean)
      .map(item=>`${item.character.name} · ${item.product.series}`);
    const conditionTags = listing.conditions.map(condition=>`<span class="trade-tag">${escAttr(condition)}</span>`).join('');
    const isoText = listing.openToOffers || !isoNames.length ? 'Open to offers' : isoNames.map(escAttr).join(', ');
    const isOwnListing = Boolean(listing.owner);
    const ownStatus = isOwnListing ? listingOwnStatus(listing, offers, deals) : '';
    const modelAction = entry.product.modelPreview && hasCharacterModel(entry.character.name)
      ? `<button type="button" class="btn btn-outline btn-sm" data-trade-model="${escAttr(listing.id)}">See 3D Model</button>`
      : '';
    return `<article class="trade-listing-card">
      <div class="trade-listing-photo">${listingImage(entry)}<span class="rarity-badge ${entry.character.rarity === 'Secret Chase' ? 'rarity-secret' : 'rarity-common'}">${escAttr(entry.character.rarity)}</span></div>
      <div class="trade-listing-content">
        <div class="trade-listing-top"><span class="trade-type-badge trade-type-${escAttr(listing.type)}">${escAttr(listingTypeLabel(listing))}${['trade', 'trade-or-buy'].includes(listing.type) && listing.acceptCash ? ' · +Cash OK' : ''}</span>${isOwnListing ? `<span class="your-listing-badge">Your Listing</span><span class="listing-status-pill status-${ownStatus.toLowerCase().replace(/\s+/g,'-')}">${ownStatus}</span>` : '<span class="escrow-badge">Hub escrow</span>'}</div>
        <h4>${escAttr(entry.character.name)}</h4><p class="trade-series">${escAttr(entry.product.series)}</p>
        <div class="trade-tags">${conditionTags || '<span class="trade-tag">Condition not specified</span>'}</div>
        <p class="trade-seller">${escAttr(listing.seller || '@collector')} <span class="verified-badge">${listing.community ? `✓ ${Number(listing.verifiedDeals) || 0} demo-verified deals · 100% legit pass` : '✓ Joy Hub check on completion'}</span></p>
        <p class="trade-iso"><b>ISO:</b> ${isoText}</p>
        ${listing.type !== 'trade' || listing.acceptCash ? `<p class="trade-listing-value">Estimated catalog value ${peso(entry.product.price)}${listing.type !== 'trade' && listing.askPrice !== entry.product.price ? ` · Asking ${peso(listing.askPrice)}` : ''}</p>` : ''}
        <div class="trade-listing-actions">${modelAction}${isOwnListing
          ? ownStatus === 'In Escrow' ? `<button type="button" class="btn btn-outline btn-sm" data-open-deal="${escAttr(listing.lockedDealId || (deals.find(deal=>deal.listingId === listing.id && deal.stage < 5) || {}).id || '')}">View Deal</button>` : `<button type="button" class="btn btn-outline btn-sm" data-remove-listing="${escAttr(listing.id)}">Remove Listing</button>`
          : `<button type="button" class="btn btn-primary btn-sm" data-trade-propose="${escAttr(listing.id)}">Propose Trade / Buy</button>`}</div>
      </div>
    </article>`;
  }).join('');
  host.querySelectorAll('[data-trade-model]').forEach(button=>button.addEventListener('click', ()=>{
    const listing = allTradeListings().find(item=>item.id === button.dataset.tradeModel);
    const entry = listing && tradeCharacter(listing.productName, listing.characterId);
    if(entry) renderModelViewer(entry.product, entry.character.name, entry.character);
  }));
  host.querySelectorAll('[data-trade-propose]').forEach(button=>button.addEventListener('click', ()=>{
    renderTradeProposalModal(button.dataset.tradePropose);
  }));
  host.querySelectorAll('[data-remove-listing]').forEach(button=>button.addEventListener('click', ()=>{
    removeOwnListing(button.dataset.removeListing);
  }));
  host.querySelectorAll('[data-open-deal]').forEach(button=>button.addEventListener('click', ()=>{
    openTradeTab('deals', button.dataset.openDeal);
  }));
  updatePendingOfferBadge();
}

function collectionOptionLabel(owned){
  return `${owned.character.name} · ${owned.product.series} · Qty ${owned.item.qty}`;
}

function renderTradePostModal(){
  if(!requireSignedIn('Sign in to post a marketplace listing')) return;
  const owned = ownedTradeCharacters();
  const defaultEntry = owned[0] || MARKETPLACE_CHARACTERS[0];
  const figureOptions = MARKETPLACE_CHARACTERS.map(entry=>`<option value="${escAttr(tradeKey(entry))}">${escAttr(entry.character.name)} · ${escAttr(entry.product.series)} — Catalog</option>`).join('');
  const ownedOptions = owned.map(entry=>`<option value="${escAttr(tradeKey(entry))}">${escAttr(collectionOptionLabel(entry))}</option>`).join('');
  const isoOptions = MARKETPLACE_CHARACTERS.map(entry=>`<label class="catalog-chip"><input type="checkbox" name="iso" value="${escAttr(tradeKey(entry))}"><span>${escAttr(entry.character.name)} <small>· ${escAttr(entry.product.series)}</small></span></label>`).join('');
  const signedIn = getSignedInEmail();
  const sellerHandle = signedIn ? `@${signedIn.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '').slice(0,24) || 'collector'}` : '@collector';
  openModal(`<div class="trade-form-panel">
    <span class="kicker">New marketplace listing</span><h3>Post a Trade / Sale Listing</h3>
    <p class="modal-sub">Choose an exact character from your Collection or the existing catalog. Set an asking price and choose which catalog figures you’ll accept.</p>
    <form id="tradePostForm">
      <label class="trade-field">Figure<select name="figure" required>
        ${owned.length ? `<optgroup label="Your Collection">${ownedOptions}</optgroup>` : ''}
        <optgroup label="Existing catalog">${figureOptions}</optgroup>
      </select></label>
      <label class="trade-field">Listing type<select name="type" required><option value="trade">For Trade</option><option value="sale">For Sale</option><option value="trade-or-buy">Trade or Buy</option></select></label>
      <fieldset class="trade-field"><legend>Condition &amp; completeness</legend><div class="trade-check-grid">${TRADE_CONDITIONS.map((condition,index)=>`<label><input type="checkbox" name="conditions" value="${escAttr(condition)}" ${index === 0 ? 'checked' : ''}> ${escAttr(condition)}</label>`).join('')}</div></fieldset>
      <fieldset class="trade-field"><legend>Accept these catalog figures</legend><div class="catalog-chip-list">${isoOptions}</div></fieldset>
      <label class="trade-check" data-accept-cash-wrap><input name="acceptCash" type="checkbox" checked> Accept figure + cash top-up offers</label>
      <label class="trade-field">Asking price (₱)<input name="price" type="number" min="1" step="1" value="${defaultEntry.product.price}" aria-describedby="tradePriceNote"></label>
      <small id="tradePriceNote" class="trade-field-note">Pre-filled with catalog retail price (${peso(defaultEntry.product.price)}) — adjust to set your own asking price.</small>
      <label class="trade-check"><input name="openOffers" type="checkbox" checked> Also open to other catalog offers</label>
      <button class="btn btn-primary" type="submit">Publish listing</button>
    </form>
  </div>`);
  const form = document.getElementById('tradePostForm');
  const figureSelect = form.elements.figure;
  if(defaultEntry) figureSelect.value = tradeKey(defaultEntry);
  const listingTypeSelect = form.elements.type;
  const acceptCashWrap = form.querySelector('[data-accept-cash-wrap]');
  const syncAcceptCashVisibility = ()=>{
    acceptCashWrap.hidden = listingTypeSelect.value === 'sale';
    if(acceptCashWrap.hidden) form.elements.acceptCash.checked = false;
  };
  listingTypeSelect.addEventListener('change', syncAcceptCashVisibility);
  syncAcceptCashVisibility();
  figureSelect.addEventListener('change', ()=>{
    const entry = MARKETPLACE_BY_KEY.get(figureSelect.value);
    if(entry){
      form.elements.price.value = entry.product.price;
      document.getElementById('tradePriceNote').textContent =
        `Pre-filled with catalog retail price (${peso(entry.product.price)}) — adjust to set your own asking price.`;
    }
  });
  form.addEventListener('submit', event=>{
    event.preventDefault();
    if(!requireSignedIn('Sign in to post a marketplace listing')) return;
    const entry = MARKETPLACE_BY_KEY.get(figureSelect.value);
    const conditions = [...form.querySelectorAll('[name="conditions"]:checked')].map(input=>input.value);
    if(!entry || !conditions.length){
      toast('Choose a catalog figure and at least one condition');
      return;
    }
    const type = form.elements.type.value;
    const enteredAskPrice = Number(form.elements.price.value);
    if(['sale', 'trade-or-buy'].includes(type)
      && (!Number.isFinite(enteredAskPrice) || enteredAskPrice <= 0)){
      toast('Enter a valid asking price greater than ₱0');
      form.elements.price.focus();
      return;
    }
    const selectedIso = [...form.querySelectorAll('[name="iso"]:checked')].map(input=>input.value).filter(key=>MARKETPLACE_BY_KEY.has(key));
    const ownedFigure = owned.find(item=>tradeKey(item) === tradeKey(entry));
    const listings = loadTradeListings();
    const listing = {
      id:createLocalId('listing'),
      productName:entry.product.name,
      characterId:entry.character.id,
      type,
      askPrice:Number.isFinite(enteredAskPrice) && enteredAskPrice > 0 ? enteredAskPrice : entry.product.price,
      owner:true,
      ownerPurchaseId:ownedFigure ? ownedFigure.purchaseId : '',
      acceptCash:['trade', 'trade-or-buy'].includes(type) && form.elements.acceptCash.checked,
      conditions,
      seller:sellerHandle,
      verifiedDeals:0,
      isoIds:selectedIso,
      openToOffers:form.elements.openOffers.checked || selectedIso.length === 0,
    };
    listings.unshift(listing);
    if(!saveTradeListings(listings)) return;
    ensureSeedIncomingOffer(listing);
    addNotification('Your listing is live on the marketplace', {target:'listings', toastMessage:'Your listing is live'});
    closeModal();
    document.querySelector('[data-trade-filter="all"]').click();
    document.querySelector('[data-trade-tab="listings"]').click();
    renderTradeListings('all');
  });
}

function updateOfferStatus(offerId, status){
  if(!getSignedInEmail()) return null;
  const offers = loadTradeOffers();
  const offer = offers.find(item=>item.id === offerId);
  if(!offer || offer.status !== 'pending') return null;
  offer.status = status;
  offer.updatedAt = Date.now();
  if(!saveTradeOffers(offers)) return null;
  updatePendingOfferBadge();
  return offer;
}

function createApprovedDeal(offer, listing){
  const target = tradeCharacter(listing.productName, listing.characterId);
  if(!target) return null;
  return {
    id:createLocalId('deal'),
    listingId:listing.id,
    direction:offer.direction,
    productName:listing.productName,
    characterId:listing.characterId,
    ownerPurchaseId:listing.ownerPurchaseId || '',
    askingPrice:listing.askPrice,
    catalogPrice:target.product.price,
    offered:offer.offered,
    cash:offer.cash,
    cashDirection:offer.cashDirection || 'add',
    delivery:'courier',
    waybill:createHubWaybill(),
    shipBy:Date.now() + 48 * 60 * 60 * 1000,
    stage:0,
    accepted:true,
    createdAt:Date.now(),
    seeded:offer.seeded || false,
  };
}

function approveOffer(offerId){
  if(!requireSignedIn('Sign in to manage trade offers')) return;
  const offers = loadTradeOffers();
  const offer = offers.find(item=>item.id === offerId && item.status === 'pending');
  if(!offer) return;
  const listing = allTradeListings().find(item=>item.id === offer.listingId);
  if(!listing){
    toast('This listing is no longer available');
    return;
  }
  const activeDeals = loadTradeDeals();
  if(activeDeals.some(deal=>deal.listingId === listing.id && deal.stage < 5)){
    toast('This listing already has an active escrow deal');
    return;
  }
  if(offer.direction === 'incoming' && (!listing.owner || !listing.ownerPurchaseId)){
    toast('Only a listing linked to your Collection can be approved here');
    return;
  }
  const deal = createApprovedDeal(offer, listing);
  if(!deal) return;
  activeDeals.unshift(deal);
  if(!saveTradeDeals(activeDeals)) return;
  offer.status = 'approved';
  offer.dealId = deal.id;
  offer.updatedAt = Date.now();
  if(!saveTradeOffers(offers)) return;
  if(offer.direction === 'incoming'){
    const listings = loadTradeListings();
    const ownedListing = listings.find(item=>item.id === listing.id);
    if(ownedListing){
      ownedListing.lockedDealId = deal.id;
      if(!saveTradeListings(listings)) return;
    }
  }
  addNotification('Offer approved! Ship to Joy Trinkets Hub', {
    target:`deals-${deal.id}`,
    toastMessage:'Offer approved — escrow locked',
  });
  renderTradeOffers();
  renderTradeListings();
  renderTradeDeals();
}

function declineOffer(offerId){
  if(!requireSignedIn('Sign in to manage trade offers')) return;
  const offer = updateOfferStatus(offerId, 'declined');
  if(!offer) return;
  const message = offer.direction === 'incoming' ? 'Incoming offer declined' : 'Your offer was declined';
  addNotification(message, {target:'offers', toastMessage:message});
  renderTradeOffers();
  renderTradeListings();
}

function simulateSellerApproval(offerId){
  if(!requireSignedIn('Sign in to manage trade offers')) return;
  const offers = loadTradeOffers();
  const offer = offers.find(item=>item.id === offerId && item.direction === 'sent' && item.status === 'pending');
  if(!offer) return;
  const listing = allTradeListings().find(item=>item.id === offer.listingId);
  if(!listing){
    toast('This listing is no longer available');
    return;
  }
  const activeDeals = loadTradeDeals();
  if(activeDeals.some(deal=>deal.listingId === listing.id && deal.stage < 5)){
    toast('This listing already has an active escrow deal');
    return;
  }
  const deal = createApprovedDeal(offer, listing);
  if(!deal) return;
  activeDeals.unshift(deal);
  if(!saveTradeDeals(activeDeals)) return;
  offer.status = 'approved';
  offer.dealId = deal.id;
  offer.updatedAt = Date.now();
  if(!saveTradeOffers(offers)) return;
  addNotification('Offer approved! Ship to Joy Trinkets Hub', {
    target:`deals-${deal.id}`,
    toastMessage:'Seller approved — escrow locked',
  });
  renderTradeOffers();
  renderTradeDeals();
}

function removeOwnListing(listingId){
  if(!requireSignedIn('Sign in to manage marketplace listings')) return;
  const listings = loadTradeListings();
  const listing = listings.find(item=>item.id === listingId && item.owner);
  if(!listing) return;
  if(loadTradeDeals().some(deal=>deal.listingId === listingId && deal.stage < 5)){
    toast('This listing is locked in escrow and cannot be removed');
    return;
  }
  if(!saveTradeListings(listings.filter(item=>item.id !== listingId))) return;
  if(!saveTradeOffers(loadTradeOffers().filter(offer=>offer.listingId !== listingId))) return;
  renderTradeListings();
  renderTradeOffers();
  toast('Listing removed');
}

function formatRemainingTime(timestamp){
  const deadline = Number(timestamp);
  const remaining = Number.isFinite(deadline) ? Math.max(0, deadline - Date.now()) : 48 * 60 * 60 * 1000;
  return `${Math.floor(remaining / 3600000)}h ${Math.floor((remaining % 3600000) / 60000)}m`;
}

function updateShippingCountdowns(){
  document.querySelectorAll('[data-ship-by]').forEach(label=>{
    const deadline = Number(label.dataset.shipBy);
    label.textContent = Number.isFinite(deadline) && deadline > Date.now()
      ? formatRemainingTime(deadline)
      : 'Time expired — contact Joy Trinkets Hub';
  });
}

function renderTradeOffers(){
  if(!getSignedInEmail()) return;
  const incomingHost = document.getElementById('incomingOffers');
  const sentHost = document.getElementById('sentOffers');
  if(!incomingHost || !sentHost) return;
  const offers = loadTradeOffers();
  const incoming = offers.filter(offer=>offer.direction === 'incoming');
  const sent = offers.filter(offer=>offer.direction === 'sent');
  const describeOffer = offer=>{
    const target = tradeCharacter(offer.productName, offer.characterId);
    const offeredNames = offer.offered.map(item=>tradeCharacter(item.productName, item.characterId)).filter(Boolean)
      .map(item=>`${item.character.name} · ${item.product.series}`);
    return {target, offeredNames};
  };
  incomingHost.innerHTML = incoming.length ? incoming.map(offer=>{
    const {target, offeredNames} = describeOffer(offer);
    if(!target) return '';
    const status = offer.status === 'pending' ? 'Needs Your Approval' : offer.status === 'approved' ? 'Approved · In Escrow' : 'Declined';
    const cashLabel = offer.cash ? ` + ${peso(offer.cash)} ${offer.cashDirection === 'request' ? 'requested' : 'top-up'}` : '';
    return `<article class="offer-inbox-card">
      <div><span class="kicker">${offer.seeded ? 'Community offer' : 'Incoming offer'}</span><h5>${escAttr(target.character.name)} · ${escAttr(target.product.series)}</h5>
      <p>They offer: ${offeredNames.length ? offeredNames.map(escAttr).join(', ') : 'Cash only'}${cashLabel}</p>
      <span class="offer-status status-${offer.status}">${status}</span></div>
      ${offer.status === 'pending' ? `<div class="offer-actions"><button type="button" class="btn btn-primary btn-sm" data-approve-offer="${escAttr(offer.id)}">Approve &amp; Lock Escrow</button><button type="button" class="btn btn-outline btn-sm" data-decline-offer="${escAttr(offer.id)}">Decline</button></div>` : ''}
    </article>`;
  }).join('') : '<p class="trade-empty-inline">No incoming offers yet. Post a Collection figure to receive a demo offer.</p>';
  sentHost.innerHTML = sent.length ? sent.map(offer=>{
    const {target, offeredNames} = describeOffer(offer);
    if(!target) return '';
    const status = offer.status === 'pending' ? 'Pending Seller Approval' : offer.status === 'approved' ? 'Approved · In Escrow' : 'Declined';
    const cashLabel = offer.cash ? `${offer.cashDirection === 'request' ? 'Request' : 'You add'} ${peso(offer.cash)}` : '';
    return `<article class="offer-inbox-card">
      <div><span class="kicker">Sent offer</span><h5>${escAttr(target.character.name)} · ${escAttr(target.product.series)}</h5>
      <p>Your figures: ${offeredNames.length ? offeredNames.map(escAttr).join(', ') : 'Cash only'}${cashLabel ? ` · ${escAttr(cashLabel)}` : ''}</p>
      <span class="offer-status status-${offer.status}">${status}</span></div>
      ${offer.status === 'pending' ? `<div class="offer-actions"><button type="button" class="btn btn-outline btn-sm" data-simulate-approval="${escAttr(offer.id)}">Simulate Seller Approval</button><button type="button" class="btn btn-outline btn-sm" data-decline-offer="${escAttr(offer.id)}">Withdraw</button></div>` : ''}
    </article>`;
  }).join('') : '<p class="trade-empty-inline">You have not sent any offers yet.</p>';
  incomingHost.querySelectorAll('[data-approve-offer]').forEach(button=>button.addEventListener('click', ()=>approveOffer(button.dataset.approveOffer)));
  document.querySelectorAll('[data-decline-offer]').forEach(button=>button.addEventListener('click', ()=>declineOffer(button.dataset.declineOffer)));
  sentHost.querySelectorAll('[data-simulate-approval]').forEach(button=>button.addEventListener('click', ()=>simulateSellerApproval(button.dataset.simulateApproval)));
  updatePendingOfferBadge();
}

function openTradeTab(tabName, dealId=''){
  const tab = document.querySelector(`[data-trade-tab="${tabName}"]`);
  if(!tab) return;
  document.querySelectorAll('[data-trade-tab]').forEach(button=>{
    const active = button === tab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-trade-panel]').forEach(panel=>{
    panel.hidden = panel.dataset.tradePanel !== tabName;
  });
  if(['offers', 'deals'].includes(tabName) && !getSignedInEmail()){
    const panel = document.querySelector(`[data-trade-panel="${tabName}"]`);
    panel.innerHTML = `<div class="trade-auth-prompt"><h3>Sign in to manage offers and escrow deals</h3><p>Your listings, offers, and active deal details are private to your account.</p><button class="btn btn-primary" type="button" data-modal="signin">Sign in / Create Account</button></div>`;
    return;
  }
  if(tabName === 'offers') renderTradeOffers();
  if(tabName === 'deals'){
    renderTradeDeals();
    if(dealId){
      const card = [...document.querySelectorAll('[data-deal-card]')].find(item=>item.dataset.dealCard === dealId);
      if(card) card.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }
}

function tradeOfferFormState(body){
  const form = body.querySelector('#tradeProposalForm');
  if(!form) return {};
  return {
    offered: [...form.querySelectorAll('[name="offered"]:checked')].map(input=>input.value),
    cash:form.elements.cash.value,
    cashDirection:form.elements.cashDirection ? form.elements.cashDirection.value : 'add',
    delivery:form.elements.delivery.value,
    fullBuy:form.elements.fullBuy ? form.elements.fullBuy.checked : false,
  };
}

function renderTradeProposalModal(listingId, restoredState={}){
  if(!requireSignedIn('Sign in to propose a trade or purchase')) return;
  const listing = allTradeListings().find(item=>item.id === listingId);
  const entry = listing && tradeCharacter(listing.productName, listing.characterId);
  if(!listing || !entry){
    toast('This marketplace listing is no longer available');
    return;
  }
  const owned = ownedTradeCharacters();
  const isoNames = listing.isoIds.map(key=>MARKETPLACE_BY_KEY.get(key)).filter(Boolean)
    .map(item=>`${item.character.name} · ${item.product.series}`);
  const requiresPurchase = listing.type === 'sale';
  const canBuy = listing.type !== 'trade';
  const canCash = listing.type === 'sale' || listing.acceptCash;
  const targetFigureValue = listing.type === 'trade' ? entry.product.price : listing.askPrice;
  const cashValue = restoredState.cash ?? (requiresPurchase || restoredState.fullBuy ? listing.askPrice : 0);
  const cashDirection = restoredState.cashDirection || 'add';
  const offerRows = owned.length ? owned.map((item,index)=>{
    const checked = (restoredState.offered || []).includes(item.purchaseId);
    return `<label class="trade-offer-item">
      <input type="checkbox" name="offered" value="${escAttr(item.purchaseId)}" ${checked ? 'checked' : ''}>
      <span class="trade-offer-thumb">${placeholderBox(item.character.name, item.character.image || item.product.image)}</span>
      <span class="trade-offer-copy"><strong>${escAttr(item.character.name)}</strong><small>${escAttr(item.product.series)} · ${escAttr(item.character.rarity)} · Qty ${item.item.qty}</small></span>
      <b class="trade-offer-price">${peso(item.product.price)}</b>
    </label>`;
  }).join('') : `<p class="trade-empty-inline">Your Collection has no individually identified figures to offer yet. Add a revealed Box Pull figure to your Collection first.</p>`;
  const previewButton = entry.product.modelPreview && hasCharacterModel(entry.character.name)
    ? `<button type="button" class="btn btn-outline btn-sm" data-proposal-model>See 3D Model</button>`
    : '';
  openModal(`<div class="trade-proposal">
    <span class="kicker">Deal builder · Joy Trinkets Legit Check &amp; Escrow</span><h3>Propose Trade / Buy</h3>
    <div class="trade-proposal-columns">
      <section class="trade-proposal-target">
        <h4>Target figure</h4>
        <div class="trade-target-photo">${listingImage(entry)}</div>
        <span class="rarity-badge ${entry.character.rarity === 'Secret Chase' ? 'rarity-secret' : 'rarity-common'}">${escAttr(entry.character.rarity)}</span>
        <h4>${escAttr(entry.character.name)}</h4><p>${escAttr(entry.product.series)}</p>
        <p><b>${escAttr(listingTypeLabel(listing))}</b></p>
        <div class="trade-tags">${listing.conditions.map(condition=>`<span class="trade-tag">${escAttr(condition)}</span>`).join('')}</div>
        <p class="trade-iso"><b>Seller ISO:</b> ${listing.openToOffers || !isoNames.length ? 'Open to offers' : isoNames.map(escAttr).join(', ')}</p>
        ${previewButton}
      </section>
      <form class="trade-proposal-offer" id="tradeProposalForm">
        <h4>Your offer</h4>
        <fieldset class="trade-field"><legend>Figures from your Collection</legend><div class="trade-offer-list">${offerRows}</div></fieldset>
        <div class="fair-value-box" data-fair-value-box>
          <b>Fair-Value Balance</b>
          <span>Target Figure Value <strong data-target-value>${peso(targetFigureValue)}</strong></span>
          <span>Your Selected Collection Figure(s) Total <strong data-selected-value>${peso(0)}</strong></span>
          <span>Value Difference <strong data-value-difference>${peso(targetFigureValue)}</strong></span>
        </div>
        ${canBuy ? `<label class="trade-check"><input type="checkbox" name="fullBuy" ${requiresPurchase || restoredState.fullBuy ? 'checked' : ''} ${requiresPurchase ? 'disabled' : ''}> Pay full asking price (${peso(listing.askPrice)})</label>` : ''}
        <label class="trade-field">Cash top-up / payment (₱)<input name="cash" type="number" min="0" step="1" value="${Number(cashValue) || 0}" ${requiresPurchase || !canCash || restoredState.fullBuy ? 'disabled' : ''}></label>
        ${!requiresPurchase && canCash ? `<div class="cash-direction-row"><label class="trade-field">Cash direction<select name="cashDirection"><option value="add" ${cashDirection === 'add' ? 'selected' : ''}>You add cash</option><option value="request" ${cashDirection === 'request' ? 'selected' : ''}>Request cash</option></select></label><button class="btn btn-outline btn-sm" type="button" data-auto-fill-difference>Auto-Fill Difference (${peso(Math.abs(targetFigureValue))})</button></div>` : ''}
        <label class="trade-field">Delivery method<select name="delivery"><option value="courier" ${restoredState.delivery !== 'dropoff' ? 'selected' : ''}>Courier to Joy Trinkets Hub</option><option value="dropoff" ${restoredState.delivery === 'dropoff' ? 'selected' : ''}>Drop Off In-Store</option></select></label>
        <div class="trade-escrow-breakdown"><b>Legit Check &amp; Escrow Protection</b><span>Seller asking price: ${peso(listing.askPrice)}</span><span>Catalog retail reference: ${peso(entry.product.price)}</span><span>Offer cash: <strong data-offer-cash>${peso(Number(cashValue) || 0)}</strong></span><span>Hub check &amp; escrow fee: Confirmed at handoff; not charged in this demo</span><small>No payment is collected on this static demo. Figures transfer to Collection only after the final tracker step.</small></div>
        <button class="btn btn-primary" type="submit">Send offer to seller</button>
      </form>
    </div>
  </div>`);
  const form = document.getElementById('tradeProposalForm');
  const fullBuy = form.elements.fullBuy;
  const cashInput = form.elements.cash;
  const cashDisplay = form.querySelector('[data-offer-cash]');
  const autoFillDifference = form.querySelector('[data-auto-fill-difference]');
  const selectedValue = form.querySelector('[data-selected-value]');
  const valueDifference = form.querySelector('[data-value-difference]');
  const updateFairValue = ()=>{
    const selectedTotal = [...form.querySelectorAll('[name="offered"]:checked')].reduce((total,input)=>{
      const offeredEntry = owned.find(item=>item.purchaseId === input.value);
      return total + (offeredEntry ? offeredEntry.product.price : 0);
    }, 0);
    const difference = targetFigureValue - selectedTotal;
    selectedValue.textContent = peso(selectedTotal);
    valueDifference.textContent = `${difference > 0 ? 'You add +' : difference < 0 ? 'Request +' : ''}${peso(Math.abs(difference))}`;
    if(form.elements.cashDirection){
      form.elements.cashDirection.value = difference < 0 ? 'request' : 'add';
      autoFillDifference.textContent = `Auto-Fill Difference (${difference < 0 ? 'Request +' : '+'}${peso(Math.abs(difference))})`;
    }
  };
  form.querySelectorAll('[name="offered"]').forEach(input=>input.addEventListener('change', updateFairValue));
  if(autoFillDifference) autoFillDifference.addEventListener('click', ()=>{
    const selectedTotal = [...form.querySelectorAll('[name="offered"]:checked')].reduce((total,input)=>{
      const offeredEntry = owned.find(item=>item.purchaseId === input.value);
      return total + (offeredEntry ? offeredEntry.product.price : 0);
    }, 0);
    const difference = targetFigureValue - selectedTotal;
    form.elements.cash.value = Math.abs(difference);
    if(form.elements.cashDirection) form.elements.cashDirection.value = difference < 0 ? 'request' : 'add';
    if(fullBuy) fullBuy.checked = false;
    syncPayment();
  });
  const syncPayment = ()=>{
    const fullPayment = Boolean(fullBuy && fullBuy.checked);
    if(fullPayment) cashInput.value = listing.askPrice;
    cashInput.disabled = requiresPurchase || !canCash || fullPayment;
    cashDisplay.textContent = peso(Number(cashInput.value) || 0);
  };
  updateFairValue();
  if(fullBuy) fullBuy.addEventListener('change', syncPayment);
  cashInput.addEventListener('input', ()=>{ cashDisplay.textContent = peso(Number(cashInput.value) || 0); });
  const modelButton = document.querySelector('#modalBody [data-proposal-model]');
  if(modelButton){
    modelButton.addEventListener('click', ()=>{
      const state = tradeOfferFormState(document.getElementById('modalBody'));
      renderModelViewer(entry.product, entry.character.name, entry.character, {type:'trade-proposal', listingId, formState:state});
    });
  }
  form.addEventListener('submit', event=>{
    event.preventDefault();
    if(!requireSignedIn('Sign in to send a trade or purchase offer')) return;
    const fullPayment = Boolean(fullBuy && fullBuy.checked);
    const offeredIds = [...form.querySelectorAll('[name="offered"]:checked')].map(input=>input.value);
    const currentOwned = ownedTradeCharacters();
    const offered = offeredIds.map(id=>currentOwned.find(item=>item.purchaseId === id)).filter(Boolean)
      .map(item=>({purchaseId:item.purchaseId, productName:item.product.name, characterId:item.character.id}));
    const cash = requiresPurchase || fullPayment ? listing.askPrice : canCash ? Math.max(0, Number(cashInput.value) || 0) : 0;
    if(!requiresPurchase && !offered.length && cash <= 0){
      toast('Choose a Collection figure or enter a cash top-up');
      return;
    }
    const offers = loadTradeOffers();
    offers.unshift({
      id:createLocalId('offer'),
      listingId:listing.id,
      productName:entry.product.name,
      characterId:entry.character.id,
      direction:'sent',
      status:'pending',
      offered,
      cash,
      cashDirection:requiresPurchase || fullPayment || !form.elements.cashDirection ? 'add' : form.elements.cashDirection.value,
      createdAt:Date.now(),
    });
    if(!saveTradeOffers(offers)) return;
    closeModal();
    openTradeTab('offers');
    addNotification('Your offer was sent — pending seller approval', {target:'offers', toastMessage:'Offer sent to seller'});
  });
}

function transferTradeDealToCollection(deal){
  const transferId = `trade-${deal.id}`;
  let collection;
  try{
    const raw = localStorage.getItem(accountStorageKey('joyTrinkets_collection'));
    const stored = raw ? JSON.parse(raw) : [];
    if(!Array.isArray(stored)) throw new Error('Saved collection data is not a list.');
    collection = stored;
  }catch(error){
    console.error('Could not read the collection for trade completion.', error);
    toast('Your Collection could not be updated; this deal step was not completed');
    return false;
  }
  if(collection.some(item=>item.tradeDealId === deal.id)) return true;
  const isSeller = deal.direction === 'incoming';
  if(isSeller && !deal.ownerPurchaseId){
    toast('The listed figure is not linked to your Collection; transfer was stopped');
    return false;
  }
  const transferOut = isSeller
    ? [{purchaseId:deal.ownerPurchaseId, productName:deal.productName, characterId:deal.characterId}]
    : (deal.offered || []);
  for(const offered of transferOut){
    const item = collection.find(record=>record.purchaseId === offered.purchaseId
      && record.productName === offered.productName && record.characterId === offered.characterId);
    if(!item || item.qty < 1){
      toast('An offered figure is no longer in your Collection; transfer was stopped');
      return false;
    }
  }
  transferOut.forEach(offered=>{
    const item = collection.find(record=>record.purchaseId === offered.purchaseId);
    item.qty--;
  });
  const remaining = collection.filter(item=>item.qty > 0);
  const receivedEntries = isSeller ? (deal.offered || []) : [{
    productName:deal.productName,
    characterId:deal.characterId,
  }];
  for(const [index, received] of receivedEntries.entries()){
    const target = tradeCharacter(received.productName, received.characterId);
    if(!target) return false;
    remaining.push({
      purchaseId:`${transferId}-${index}`,
      tradeDealId:deal.id,
      kind:'character',
      name:target.character.name,
      characterName:target.character.name,
      productName:target.product.name,
      seriesName:target.product.series,
      qty:1,
      image:target.character.image || target.product.image || '',
      price:target.product.price,
      characterId:target.character.id,
      rarity:target.character.rarity,
      odds:target.character.odds,
      modelUrl:target.character.modelUrl || '',
      modelOrientation:target.character.modelOrientation || null,
    });
  }
  return saveCollection(remaining);
}

function renderTradeDeals(){
  if(!getSignedInEmail()) return;
  const host = document.getElementById('tradeDeals');
  if(!host) return;
  const deals = loadTradeDeals();
  if(!deals.length){
    host.innerHTML = `<div class="trade-empty"><b>No active deals yet.</b><span>Propose a Trade / Buy offer from any marketplace listing to start the Legit Check &amp; Escrow tracker.</span></div>`;
    return;
  }
  host.innerHTML = deals.map(deal=>{
    const entry = tradeCharacter(deal.productName, deal.characterId);
    const offeredText = (deal.offered || []).map(offered=>{
      const target = tradeCharacter(offered.productName, offered.characterId);
      return target ? target.character.name : '';
    }).filter(Boolean);
    const currentStage = deal.stage === 0 ? 'Escrow Locked' : deal.stage >= 5 ? 'Completed' : TRADE_STAGES[deal.stage - 1];
    const cashLabel = deal.cash ? `${deal.cashDirection === 'request' ? 'Request' : 'You add'} ${peso(deal.cash)}` : '';
    return `<article class="trade-deal-card" data-deal-card="${escAttr(deal.id)}">
      <div class="trade-deal-summary">${listingImage(entry)}<div><span class="kicker">${deal.stage === 5 ? 'Completed deal' : 'Active deal'}</span><h4>${escAttr(entry.character.name)}</h4><p>${escAttr(entry.product.series)} · Asking ${peso(deal.askingPrice)} · Catalog ${peso(entry.product.price)}</p></div><span class="trade-deal-status">${escAttr(currentStage)}</span></div>
      <div class="trade-deal-meta"><span>Offer: ${offeredText.length ? offeredText.map(escAttr).join(', ') : 'Cash only'}${cashLabel ? ` · ${escAttr(cashLabel)}` : ''}</span><span>Delivery: ${deal.delivery === 'dropoff' ? 'Drop Off In-Store' : 'Courier to Joy Trinkets Hub'}</span></div>
      ${deal.stage < 5 ? `<div class="trade-waybill"><b>Joy Trinkets Hub Waybill / Drop-Off Code</b><strong>${escAttr(deal.waybill || 'JT-HUB-PENDING')}</strong><span>Ship or drop off within <time data-ship-by="${Number(deal.shipBy) || 0}">${formatRemainingTime(deal.shipBy)}</time></span></div>` : ''}
      <ol class="trade-stage-list">${TRADE_STAGES.map((stage,index)=>`<li class="${deal.stage > index ? 'complete' : deal.stage === index + 1 ? 'current' : ''}"><span>${index + 1}</span><div><b>${escAttr(stage)}</b>${index === 2 ? '<small>Authentic sculpt, paint, foil/box and collector ID card review</small>' : ''}</div></li>`).join('')}</ol>
      <button class="btn btn-outline btn-sm" type="button" data-trade-next="${escAttr(deal.id)}" ${deal.stage >= 5 ? 'disabled' : ''}>${deal.stage >= 5 ? 'Deal completed' : deal.stage === 0 ? 'Confirm Hub Drop-Off / Shipment' : deal.stage === 1 ? 'Confirm In-Store Legit Check' : deal.stage === 2 ? 'Approve & Dispatch' : 'Advance Legit Check & Escrow'}</button>
    </article>`;
  }).join('');
  host.querySelectorAll('[data-trade-next]').forEach(button=>button.addEventListener('click', ()=>{
    if(!requireSignedIn('Sign in to manage active escrow deals')) return;
    const updated = loadTradeDeals();
    const deal = updated.find(item=>item.id === button.dataset.tradeNext);
    if(!deal || deal.stage >= 5) return;
    const nextStage = deal.stage + 1;
    if(nextStage === 5 && !transferTradeDealToCollection(deal)) return;
    deal.stage = nextStage;
    deal.accepted = true;
    if(!saveTradeDeals(updated)) return;
    const stageMessages = [
      'Package marked shipped / dropped off at Joy Trinkets Hub',
      '✅ In-Store Legit Check Approved — Dispatched',
      'Figure dispatched to receiver',
      'Receiver confirmed delivery',
      deal.direction === 'incoming' && !deal.offered.length ? 'Sale completed — your Collection updated' : 'Figure added to your Collection',
    ];
    if(nextStage > 0){
      addNotification(stageMessages[nextStage - 1], {
        target:nextStage === 5 ? 'collection' : `deals-${deal.id}`,
        href:nextStage === 5 ? 'shelf.html' : 'trade.html',
        toastMessage:stageMessages[nextStage - 1],
      });
    }
    renderTradeDeals();
    renderTradeListings();
    if(nextStage === 5) renderTradeOffers();
  }));
}

const INFO_CONTENT = {
  rules: ['Fair drop rules', 'Every limited release runs through anti-bot verification and clear eligibility rules to ensure fair access.'],
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
  updateSignInButton();
  renderNotifications();
  updatePendingOfferBadge();

  document.querySelectorAll('[data-notification-toggle]').forEach(button=>button.addEventListener('click', event=>{
    event.stopPropagation();
    const dropdown = document.getElementById(button.getAttribute('aria-controls'));
    const opening = dropdown.hidden;
    dropdown.hidden = !opening;
    button.setAttribute('aria-expanded', String(opening));
  }));
  document.querySelectorAll('[data-notification-read-all]').forEach(button=>button.addEventListener('click', markNotificationsRead));
  document.querySelectorAll('[data-notification-list]').forEach(list=>list.addEventListener('click', event=>{
    const link = event.target.closest('[data-notification-id]');
    if(!link) return;
    markNotificationRead(link.dataset.notificationId);
    const target = link.hash.slice(1);
    if(location.pathname.endsWith('trade.html') && (target === 'offers' || target === 'listings' || target.startsWith('deals-'))){
      event.preventDefault();
      const tabName = target.startsWith('deals-') ? 'deals' : target;
      openTradeTab(tabName, target.startsWith('deals-') ? target.slice(6) : '');
      const dropdown = document.getElementById('notificationDropdown');
      dropdown.hidden = true;
      document.querySelector('[data-notification-toggle]').setAttribute('aria-expanded', 'false');
    }
  }));
  document.addEventListener('click', event=>{
    document.querySelectorAll('.notification-dropdown:not([hidden])').forEach(dropdown=>{
      if(event.target.closest('.notification-wrap')) return;
      dropdown.hidden = true;
      const toggle = document.querySelector(`[aria-controls="${dropdown.id}"]`);
      if(toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });
  window.addEventListener('storage', event=>{
    if(event.key === 'joytrinkets_user'){
      location.reload();
    }
    if(event.key && event.key.startsWith(`${NOTIFICATIONS_STORAGE_KEY}_`)) renderNotifications();
    if(event.key && event.key.startsWith(`${TRADE_OFFERS_STORAGE_KEY}_`)){
      updatePendingOfferBadge();
      renderTradeOffers();
      renderTradeListings();
    }
  });

  // highlight the current page in the nav
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    if(a.getAttribute('href') === here) a.classList.add('active');
  });

  const overlay = document.getElementById('modalOverlay');
  const modalBox = overlay && overlay.querySelector('.modal-box');
  const modalClose = document.getElementById('modalClose');
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modalBox) modalBox.addEventListener('click', event=>event.stopPropagation());
  if(overlay) overlay.addEventListener('click', e=>{ if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', event=>{
    const characterViewerOpen = document.querySelector('#modalOverlay.open #modalBody .character-viewer');
    if(activeCharacterProduct && characterViewerOpen && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){
      if(event.key === 'ArrowLeft'){
        event.preventDefault();
        renderCharacterModal(activeCharacterProduct, activeCharacterIndex - 1);
      }else if(event.key === 'ArrowRight'){
        event.preventDefault();
        renderCharacterModal(activeCharacterProduct, activeCharacterIndex + 1);
      }
    }
    if(event.key === 'Escape'){
      document.querySelectorAll('.nav-links.open').forEach(nav=>{
        nav.classList.remove('open');
        const toggle = document.querySelector(`[aria-controls="${nav.id}"]`);
        if(toggle){
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open navigation');
        }
      });
      closeModal();
    }
  });

  document.querySelectorAll('[data-nav-toggle]').forEach(toggle=>{
    toggle.addEventListener('click', ()=>{
      const nav = document.getElementById(toggle.getAttribute('aria-controls'));
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('open', !isOpen);
    });
  });
  document.querySelectorAll('.nav-links a').forEach(link=>{
    link.addEventListener('click', ()=>{
      const nav = link.closest('.nav-links');
      nav.classList.remove('open');
      const toggle = document.querySelector(`[aria-controls="${nav.id}"]`);
      if(toggle){
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  });

  /* ---- Page: checkout.html ---- */
  const checkoutItems = document.getElementById('checkoutItems');
  if(checkoutItems){
    const checkoutLayout = document.getElementById('checkoutLayout');
    const checkoutEmpty = document.getElementById('checkoutEmpty');
    const checkoutAuthPrompt = document.getElementById('checkoutAuthPrompt');
    const orderConfirmation = document.getElementById('orderConfirmation');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutOfferWarning = document.getElementById('checkoutOfferWarning');
    const submitButton = checkoutForm.querySelector('[type="submit"]');
    const regionSelect = document.getElementById('checkoutRegion');
    const mobileInput = document.getElementById('checkoutMobile');
    const mobileError = document.getElementById('checkoutMobileError');

    const selectedPayment = getSelectedPayment();
    if(selectedPayment){
      const selectedRadio = Array.from(checkoutForm.querySelectorAll('input[name="payment"]'))
        .find(radio=>radio.value === selectedPayment);
      if(selectedRadio) selectedRadio.checked = true;
    }

    checkoutForm.querySelectorAll('input[name="payment"]').forEach(radio=>{
      radio.addEventListener('change', ()=>setSelectedPayment(radio.value));
    });

    function validateMobile(){
      const normalized = mobileInput.value.trim();
      const valid = /^09\d{9}$/.test(normalized) || /^09\d{2} \d{3} \d{4}$/.test(normalized);
      mobileInput.setAttribute('aria-invalid', String(!valid));
      mobileError.textContent = valid ? '' : 'Enter a Philippine mobile number in 09XX XXX XXXX format.';
      return valid;
    }
    mobileInput.addEventListener('input', ()=>{
      if(mobileInput.value) validateMobile();
      else{
        mobileInput.removeAttribute('aria-invalid');
        mobileError.textContent = '';
      }
    });

    regionSelect.addEventListener('change', renderCheckoutSummary);

    function renderCheckoutSummary(){
      const signedIn = Boolean(getSignedInEmail());
      if(checkoutAuthPrompt) checkoutAuthPrompt.hidden = signedIn;
      if(!signedIn){
        checkoutLayout.hidden = true;
        checkoutEmpty.hidden = true;
        return;
      }
      const itemCount = cartItemCount();
      const subtotal = cartTotal();
      const discount = itemCount >= BUNDLE_DISCOUNT_THRESHOLD ? Math.round(subtotal * BUNDLE_DISCOUNT_RATE) : 0;
      const expiredPulls = cart.filter(isPullOfferExpired);
      const shipping = SHIPPING_RATES[regionSelect.value] ?? SHIPPING_RATES.metro;
      checkoutLayout.hidden = itemCount === 0;
      checkoutEmpty.hidden = itemCount !== 0;
      checkoutItems.innerHTML = cart.map(item=>`
        <div class="checkout-item">
          <div class="checkout-item-image">${item.image ? `<img src="${escAttr(item.image)}" alt="${escAttr(item.name)}" onerror="imgFallback(this)">` : '<span>🎁</span>'}</div>
          <div class="checkout-item-info">
            <b>${escAttr(item.name)}</b>
            <span class="item-type-subtitle">${item.isBoxPull ? `Box Pull Reveal · ${escAttr(item.seriesName || 'Unboxed Character')}` : 'Sealed Blind Box'}</span>
            <span>${peso(item.price)} each${isPullOfferExpired(item) ? ' · Offer expired' : ''}</span>
          </div>
          ${item.isBoxPull
            ? '<span class="box-pull-lock">Box Pull Reveal · 1 reserved</span>'
            : `<div class="checkout-stepper" aria-label="Quantity for ${escAttr(item.name)}">
                <button type="button" data-checkout-minus="${escAttr(item.id)}" aria-label="Decrease quantity">−</button>
                <strong>${item.qty}</strong>
                <button type="button" data-checkout-plus="${escAttr(item.id)}" aria-label="Increase quantity">+</button>
              </div>`}
          <strong>${peso(item.price * item.qty)}</strong>
          ${isPullOfferExpired(item) ? `<button class="cart-remove" type="button" data-checkout-remove="${escAttr(item.id)}">Remove</button>` : ''}
        </div>`).join('');
      checkoutItems.querySelectorAll('[data-checkout-minus]').forEach(button=>{
        button.addEventListener('click', ()=>{
          const line = cart.find(item=>item.id === button.dataset.checkoutMinus);
          if(!line || line.isBoxPull) return;
          line.qty--;
          if(line.qty < 1) cart = cart.filter(item=>item.id !== line.id);
          saveCart();
          updateCartBadge();
          renderCheckoutSummary();
        });
      });
      checkoutItems.querySelectorAll('[data-checkout-plus]').forEach(button=>{
        button.addEventListener('click', ()=>{
          const line = cart.find(item=>item.id === button.dataset.checkoutPlus);
          if(!line || line.isBoxPull) return;
          line.qty++;
          saveCart();
          updateCartBadge();
          renderCheckoutSummary();
        });
      });
      checkoutItems.querySelectorAll('[data-checkout-remove]').forEach(button=>{
        button.addEventListener('click', ()=>{
          cart = cart.filter(item=>item.id !== button.dataset.checkoutRemove);
          saveCart();
          updateCartBadge();
          renderCheckoutSummary();
        });
      });
      checkoutOfferWarning.hidden = expiredPulls.length === 0;
      checkoutOfferWarning.textContent = expiredPulls.length
        ? 'One or more Box Pull offers have expired. Remove those reservations from your cart before placing the order.'
        : '';
      submitButton.disabled = expiredPulls.length > 0;
      document.getElementById('checkoutItemCount').textContent = `${itemCount} item${itemCount === 1 ? '' : 's'}`;
      document.getElementById('checkoutSubtotal').textContent = peso(subtotal);
      document.getElementById('checkoutDiscount').textContent = discount ? `−${peso(discount)}` : peso(0);
      document.getElementById('checkoutShipping').textContent = shipping === 0 ? '₱0 (Free)' : peso(shipping);
      document.getElementById('checkoutTotal').textContent = peso(subtotal - discount + shipping);
      const discountMessage = document.getElementById('discountMessage');
      discountMessage.textContent = itemCount >= BUNDLE_DISCOUNT_THRESHOLD
        ? '10% bundle discount applied!'
        : `Add ${BUNDLE_DISCOUNT_THRESHOLD - itemCount} more item${BUNDLE_DISCOUNT_THRESHOLD - itemCount === 1 ? '' : 's'} for 10% off.`;
      discountMessage.classList.toggle('discount-applied', itemCount >= BUNDLE_DISCOUNT_THRESHOLD);
    }

    renderCheckoutSummary();
    checkoutForm.addEventListener('submit', event=>{
      event.preventDefault();
      if(!requireSignedIn('Sign in before placing your order')) return;
      if(!checkoutForm.reportValidity() || cartItemCount() === 0) return;
      if(!validateMobile()) return;
      if(cart.some(isPullOfferExpired)){
        renderCheckoutSummary();
        return;
      }
      const purchasedLines = cart.map(item=>({...item}));
      if(!addPurchasedItemsToCollection(purchasedLines)) return;
      const itemCount = cartItemCount();
      const subtotal = cartTotal();
      const discount = itemCount >= BUNDLE_DISCOUNT_THRESHOLD ? Math.round(subtotal * BUNDLE_DISCOUNT_RATE) : 0;
      const shipping = SHIPPING_RATES[regionSelect.value] ?? SHIPPING_RATES.metro;
      const payment = checkoutForm.querySelector('input[name="payment"]:checked')?.value || getSelectedPayment();
      const orderId = `#JT-2026-${String(Math.floor(1000 + Math.random()*9000)).padStart(4,'0')}`;
      const deliveryAddress = document.getElementById('checkoutAddress').value.trim();
      const note = document.getElementById('checkoutNote').value.trim();
      const name = document.getElementById('checkoutName').value.trim();
      const email = document.getElementById('checkoutEmail').value.trim();
      const mobile = mobileInput.value.trim();
      const receiptLines = purchasedLines.map(item=>`
        <div class="receipt-line">
          <span><strong>${escAttr(item.name)}</strong><small>${item.isBoxPull ? `Box Pull Reveal · ${escAttr(item.seriesName || '')}` : 'Sealed Blind Box'} · Qty ${item.qty}</small></span>
          <strong>${peso(item.price * item.qty)}</strong>
        </div>`).join('');
      cart = [];
      saveCart();
      updateCartBadge();
      checkoutLayout.hidden = true;
      orderConfirmation.hidden = false;
      document.getElementById('orderReceipt').innerHTML = `
        <div class="receipt-header"><span class="kicker">Order Confirmed</span><h2>Thank you, ${escAttr(name)}!</h2><strong>${orderId}</strong></div>
        <div class="receipt-section"><h3>Items</h3>${receiptLines}</div>
        <div class="receipt-section receipt-totals">
          <div><span>Subtotal</span><strong>${peso(subtotal)}</strong></div>
          <div><span>Bundle discount</span><strong>${discount ? `−${peso(discount)}` : peso(0)}</strong></div>
          <div><span>Shipping · ${escAttr(SHIPPING_LABELS[regionSelect.value])}</span><strong>${shipping === 0 ? '₱0 (Free)' : peso(shipping)}</strong></div>
          <div class="receipt-grand-total"><span>Grand total</span><strong>${peso(subtotal - discount + shipping)}</strong></div>
        </div>
        <div class="receipt-section receipt-details">
          <p><strong>Payment</strong><span>${escAttr(payment)}</span></p>
          <p><strong>Deliver to</strong><span>${escAttr(name)} · ${escAttr(mobile)}<br>${escAttr(deliveryAddress)}</span></p>
          <p><strong>Email</strong><span>${escAttr(email)}</span></p>
          ${note ? `<p><strong>Packaging note</strong><span>${escAttr(note)}</span></p>` : ''}
        </div>`;
    });
  }

  document.addEventListener('click', e=>{
    const trigger = e.target.closest('[data-modal]');
    if(!trigger) return;
    const type = trigger.dataset.modal;
    if(type === 'cart') renderCartModal();
    else if(type === 'signin') renderSignInModal();
    else if(type === 'signout'){
      try{
        localStorage.removeItem('joytrinkets_user');
      }catch(error){
        console.error('Could not clear the sign-in state.', error);
        toast('Sign out could not be completed');
        return;
      }
      updateSignInButton();
      toast('Signed out');
      location.reload();
    }
    else if(type === 'catalog') renderCatalogModal();
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
        ? `<img src="${escAttr(photo)}" alt="${escAttr(c.name)} collection" onerror="imgFallback(this)">`
        : c.icon;
      card.innerHTML = `<div class="category-photo" style="background:${c.bg};">${iconInner}<span class="category-mark">${c.icon}</span></div><div class="category-card-copy"><h4>${c.name}</h4><span>${c.count} collectibles</span></div>`;
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
        const card = document.createElement('div');
        card.className = 'product-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'group');
        card.setAttribute('aria-label', `View characters in ${p.name}`);
        card.innerHTML = `
          <div class="product-figure" style="background:var(--surface-2);">
            <div class="tag-row"><span class="tag ${p.tag}">${p.tagText}</span></div>
            ${placeholderBox(p.name, p.image)}
          </div>
          <div class="product-brand">${p.series}</div>
          <h4>${p.name}</h4>
          <div class="product-chase">${p.chase ? `Chase: ${p.chase}` : 'Standard figure · no chase'}</div>
          <div class="product-view-cue">View characters →</div>
          <div class="product-foot">
            <span class="price">${peso(p.price)}</span>
            <button class="product-select-link" type="button" aria-label="View characters in ${escAttr(p.name)}">Select series →</button>
          </div>`;
        card.querySelector('.product-select-link').addEventListener('click', event=>{
          event.stopPropagation();
          renderCharacterModal(p);
        });
        card.addEventListener('click', event=>{
          renderCharacterModal(p);
        });
        card.addEventListener('keydown', event=>{
          if(event.target === card && (event.key === 'Enter' || event.key === ' ')){
            event.preventDefault();
            renderCharacterModal(p);
          }
        });
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

  /* ---- Page: pull.html — limited to 3 daily catalog reveals ---- */
  const tray = document.getElementById('pullTray');
  if(tray){
    const vaultOdds = document.getElementById('vaultOdds');
    const seriesFilter = document.getElementById('pullSeriesFilter');
    const pullPanel = document.getElementById('pullPanel');
    const signInPrompt = document.getElementById('pullSignInPrompt');
    const result = document.getElementById('pullResult');
    const pullCountEl = document.getElementById('pullCount');
    const DAILY_LIMIT = 3;
    const seriesProducts = PRODUCTS.filter(product=> product.tag !== 'tag-soldout');
    seriesProducts.forEach(product=>{
      const option = document.createElement('option');
      option.value = product.name;
      option.textContent = product.name;
      seriesFilter.appendChild(option);
    });

    function getFilteredPool(){
      const seriesName = seriesFilter.value;
      return AVAILABLE_PULL_POOL.filter(item=> seriesName === 'all' || item.productName === seriesName);
    }
    function renderOdds(){
      const pool = getFilteredPool();
      const totalWeight = pool.reduce((total,item)=> total + item.weight, 0);
      vaultOdds.innerHTML = pool.map(item=>{
        const chance = totalWeight ? item.weight / totalWeight * 100 : 0;
        return `<article class="vault-odds-card">
          <div class="pull-pool-image">${placeholderBox(item.name, item.image)}</div>
          <span class="result-rarity ${item.rarityClass}">${escAttr(item.rarity)}</span>
          <b>${escAttr(item.name)}</b>
          <span>${escAttr(item.seriesName)}</span>
          <span>${chance.toFixed(2)}% pool odds · catalog ${escAttr(item.odds)}</span>
          <strong>${peso(item.price)}</strong>
        </article>`;
      }).join('');
      if(pool.length === 0) vaultOdds.innerHTML = '<p class="vault-demo-note">No available figures in this series.</p>';
    }
    renderOdds();

    if(!getSignedInEmail()){
      pullPanel.hidden = true;
      signInPrompt.hidden = false;
    }else{
      function todayStr(){
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      }
      function loadDaily(){
        let daily;
        try{ daily = JSON.parse(localStorage.getItem(accountStorageKey('joyTrinkets_pullState'))); }catch(e){ daily = null; }
        if(!daily || daily.date !== todayStr() || !Array.isArray(daily.results)){
          return {date:todayStr(), poolVersion:PULL_POOL_VERSION, results:[]};
        }
        if(daily.poolVersion !== PULL_POOL_VERSION){
          daily.results = daily.results.map(item=>({...item, legacy:!item.poolItemId}));
          daily.poolVersion = PULL_POOL_VERSION;
        }
        return daily;
      }
      let daily = loadDaily();
      function saveDaily(){
        try{
          localStorage.setItem(accountStorageKey('joyTrinkets_pullState'), JSON.stringify(daily));
          return true;
        }catch(error){
          console.error('Could not save Box Pull history.', error);
          toast('Your pull history could not be saved in this browser');
          return false;
        }
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
        }else{
          pullCountEl.textContent = `${n} of ${DAILY_LIMIT} boxes opened today`;
        }
      }
      let offerTimer;
      let activePullId = '';
      let pendingPull = false;
      const summary = document.getElementById('pullSummary');
      function getPoolItem(pullResult){
        return AVAILABLE_PULL_POOL.find(item=>item.id === pullResult.poolItemId);
      }
      function isPullInCart(pullResult){
        return Boolean(pullResult.addedToCart || cart.some(line=>line.id === `pull-${pullResult.pullId}`));
      }
      function visibleResults(){
        const selectedSeries = seriesFilter.value;
        if(selectedSeries === 'all') return daily.results;
        return daily.results.filter(pullResult=>{
          const item = getPoolItem(pullResult);
          return item ? item.productName === selectedSeries : pullResult.productName === selectedSeries;
        });
      }
      function renderActiveResult(pullResult){
        clearInterval(offerTimer);
        if(!pullResult){
          result.innerHTML = '<span class="placeholder-text">Tap a box to reveal a figure ↖</span>';
          return;
        }
        const poolItem = getPoolItem(pullResult);
        const offerExpiresAt = Number(pullResult.offerExpiresAt) || 0;
        const offerExpired = offerExpiresAt <= Date.now();
        const product = poolItem && poolItem.product;
        const character = poolItem && poolItem.character;
        const addedToCart = isPullInCart(pullResult);
        const pullOdds = pullResult.poolOddsLabel || '';
        result.innerHTML = `
          <div class="result-figure">${placeholderBox(pullResult.name || 'Unavailable figure', poolItem ? poolItem.image : '')}</div>
          ${poolItem ? `<p class="pull-result-series">${escAttr(poolItem.seriesName)}</p>` : ''}
          <span class="result-rarity ${escAttr(poolItem ? poolItem.rarityClass : 'rarity-common')}">${escAttr(poolItem ? poolItem.rarity : (pullResult.rarity || 'Unavailable'))}</span>
          <h3 class="pull-result-name">${escAttr(poolItem ? poolItem.name : (pullResult.name || 'Unavailable figure'))}</h3>
          <p class="vault-result-note">${poolItem
            ? `${pullOdds} pool odds. This is a revealed in-store figure, not a purchase until checkout.`
            : 'This older pull is no longer available to reserve.'}</p>
          ${product ? `<p class="pull-result-price">${peso(poolItem.price)}</p>` : ''}
          ${product && product.modelPreview && hasCharacterModel(character.name) ? '<button class="btn btn-outline" id="previewPulledFigure" type="button">See 3D Model</button>' : ''}
          ${product ? `
            <p class="vault-offer-countdown" id="vaultOfferCountdown" role="status"></p>
            <button class="btn btn-primary" id="addPulledFigure" style="margin-top:12px;" ${offerExpired || addedToCart ? 'disabled' : ''}>
              ${addedToCart ? 'Added to cart' : `Add to cart · ${peso(poolItem.price)}`}
            </button>` : ''}`;
        const addButton = result.querySelector('#addPulledFigure');
        const previewButton = result.querySelector('#previewPulledFigure');
        if(previewButton) previewButton.addEventListener('click', ()=>renderModelViewer(product, character.name, character));
        const countdown = result.querySelector('#vaultOfferCountdown');
        if(product && countdown){
          const updateOfferCountdown = ()=>{
            const remaining = offerExpiresAt - Date.now();
            if(remaining <= 0){
              countdown.textContent = 'This 30-minute offer has expired.';
              if(addButton) addButton.disabled = true;
              return false;
            }
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            countdown.textContent = `Offer ends in ${minutes}:${String(seconds).padStart(2, '0')}`;
            return true;
          };
          updateOfferCountdown();
          offerTimer = setInterval(()=>{
            if(!updateOfferCountdown()) clearInterval(offerTimer);
          }, 1000);
        }
        if(addButton) addButton.addEventListener('click', ()=>addPullToCart(pullResult));
      }
      function renderTray(){
        const results = visibleResults();
        tray.innerHTML = '';
        for(let i=0;i<DAILY_LIMIT;i++){
          const pullResult = results[i];
          const poolItem = pullResult && getPoolItem(pullResult);
          const box = document.createElement('button');
          box.type = 'button';
          box.className = 'pull-box';
          box.dataset.boxIndex = String(i);
          if(pullResult){
            box.classList.add('opened');
            if(pullResult.pullId === activePullId) box.classList.add('active');
            box.setAttribute('aria-pressed', String(pullResult.pullId === activePullId));
            box.setAttribute('aria-label', `Inspect ${poolItem ? poolItem.name : pullResult.name || 'revealed figure'}`);
            if(poolItem){
              box.innerHTML = `<span class="pull-box-card">
                <span class="pull-box-thumb">${placeholderBox(poolItem.name, poolItem.image)}</span>
                <span class="pull-box-name">${escAttr(poolItem.name)}</span>
                <span class="result-rarity ${escAttr(poolItem.rarityClass)}">${escAttr(poolItem.rarity)}</span>
                <span class="pull-box-price">${peso(poolItem.price)}</span>
                <span class="pull-box-status">${isPullInCart(pullResult) ? 'In Cart' : 'Reserved · Click to inspect'}</span>
              </span>`;
            }else{
              box.innerHTML = `<span class="pull-box-card"><span class="pull-box-name">${escAttr(pullResult.name || 'Unavailable figure')}</span><span class="pull-box-status">Unavailable to reserve</span></span>`;
            }
          }else{
            box.innerHTML = '<span class="pull-box-empty">?</span>';
            box.setAttribute('aria-label', `Open box ${i + 1}`);
            box.disabled = daily.results.length >= DAILY_LIMIT || pendingPull;
          }
          tray.appendChild(box);
        }
      }
      function renderSummary(){
        if(!summary) return;
        const pulls = daily.results;
        summary.hidden = pulls.length < 2;
        if(summary.hidden) return;
        const remainingPulls = pulls.filter(pullResult=>
          getPoolItem(pullResult) && !isPullInCart(pullResult) && Number(pullResult.offerExpiresAt) > Date.now()
        );
        const discountRate = Math.round(BUNDLE_DISCOUNT_RATE * 100);
        summary.innerHTML = `<div class="pull-summary-head"><div><h3>Your Revealed Tray (${pulls.length}/${DAILY_LIMIT})</h3><p>Inspect any pull or add your remaining reservations to cart.</p></div></div>
          <div class="pull-summary-grid">${pulls.map(pullResult=>{
            const poolItem = getPoolItem(pullResult);
            if(!poolItem) return `<article class="pull-summary-card"><span class="pull-box-name">${escAttr(pullResult.name || 'Unavailable figure')}</span><small>Unavailable</small></article>`;
            const inCart = isPullInCart(pullResult);
            return `<article class="pull-summary-card">
              <button class="pull-summary-inspect" type="button" data-inspect-pull="${escAttr(pullResult.pullId)}" aria-label="Inspect ${escAttr(poolItem.name)}">
                <span class="pull-box-thumb">${placeholderBox(poolItem.name, poolItem.image)}</span>
                <span class="pull-box-name">${escAttr(poolItem.name)}</span>
                <span class="result-rarity ${escAttr(poolItem.rarityClass)}">${escAttr(poolItem.rarity)}</span>
                <span class="pull-box-price">${peso(poolItem.price)}</span>
              </button>
              <button class="btn ${inCart ? 'btn-outline' : 'btn-primary'}" type="button" data-add-pull="${escAttr(pullResult.pullId)}" ${inCart || Number(pullResult.offerExpiresAt) <= Date.now() ? 'disabled' : ''}>${inCart ? 'Added ✓' : 'Add to cart'}</button>
            </article>`;
          }).join('')}</div>
          <div class="pull-summary-actions"><small>${pulls.length === DAILY_LIMIT ? `Add all 3 pulls for the ${discountRate}% 3-item bundle discount.` : `${discountRate}% bundle discount applies when your cart has ${BUNDLE_DISCOUNT_THRESHOLD} or more eligible items.`}</small>
          ${remainingPulls.length ? `<button class="btn btn-primary" type="button" data-add-all-pulls>Add All Remaining to Cart (${remainingPulls.length})</button>` : ''}</div>`;
        summary.querySelectorAll('[data-inspect-pull]').forEach(button=>button.addEventListener('click', ()=>{
          const pullResult = daily.results.find(item=>item.pullId === button.dataset.inspectPull);
          if(pullResult) selectPull(pullResult, true);
        }));
        summary.querySelectorAll('[data-add-pull]').forEach(button=>button.addEventListener('click', ()=>{
          const pullResult = daily.results.find(item=>item.pullId === button.dataset.addPull);
          if(pullResult) addPullToCart(pullResult);
        }));
        const addAllButton = summary.querySelector('[data-add-all-pulls]');
        if(addAllButton) addAllButton.addEventListener('click', ()=>{
          for(const pullResult of remainingPulls){
            if(!addPullToCart(pullResult, false)) break;
          }
          refreshPullView();
        });
      }
      function addPullToCart(pullResult, refresh=true){
        const poolItem = getPoolItem(pullResult);
        const offerExpiresAt = Number(pullResult.offerExpiresAt) || 0;
        if(!poolItem || offerExpiresAt <= Date.now() || isPullInCart(pullResult)) return false;
        if(!addPulledFigureToCart(poolItem, pullResult.pullId, offerExpiresAt)) return false;
        pullResult.addedToCart = true;
        if(!saveDaily()) return false;
        if(refresh) refreshPullView();
        return true;
      }
      function selectPull(pullResult, updateSeries=false){
        const poolItem = getPoolItem(pullResult);
        if(updateSeries && poolItem && seriesFilter.value !== 'all' && seriesFilter.value !== poolItem.productName){
          seriesFilter.value = poolItem.productName;
          renderOdds();
        }
        activePullId = pullResult.pullId;
        renderActiveResult(pullResult);
        renderTray();
      }
      function refreshPullView(){
        const visible = visibleResults();
        const active = visible.find(item=>item.pullId === activePullId) || visible[visible.length - 1] || null;
        activePullId = active ? active.pullId : '';
        renderActiveResult(active);
        renderTray();
        renderSummary();
      }
      function buildTray(){
        refreshPullView();
        updateCountText();
      }
      tray.addEventListener('click', event=>{
        const box = event.target.closest('.pull-box');
        if(!box) return;
        const index = Number(box.dataset.boxIndex);
        const results = visibleResults();
        if(results[index]){
          selectPull(results[index]);
          return;
        }
        if(box.disabled || pendingPull || daily.results.length >= DAILY_LIMIT) return;
        const selectedSeries = seriesFilter.value;
        const pool = getFilteredPool();
        const totalWeight = pool.reduce((total,item)=> total + item.weight, 0);
        if(!totalWeight){
          toast('No available figures in this pool');
          return;
        }
        pendingPull = true;
        tray.querySelectorAll('.pull-box:not(.opened)').forEach(item=>{item.disabled = true;});
        box.classList.add('shaking');
        setTimeout(()=>{
          pendingPull = false;
          const roll = Math.random() * totalWeight;
          let cumulativeWeight = 0;
          const picked = pool.find(item=>{
            cumulativeWeight += item.weight;
            return roll < cumulativeWeight;
          }) || pool[pool.length - 1];
          const pullResult = {
            pullId:createLocalId('pull'),
            poolItemId:picked.id,
            productName:picked.productName,
            name:picked.name,
            rarity:picked.rarity,
            poolOddsLabel:`${(picked.weight / totalWeight * 100).toFixed(2)}%`,
            offerExpiresAt:Date.now() + PULL_OFFER_DURATION,
          };
          daily.results.push(pullResult);
          activePullId = pullResult.pullId;
          saveDaily();
          if(seriesFilter.value !== selectedSeries) seriesFilter.value = selectedSeries;
          refreshPullView();
          updateCountText();
        }, 500);
      });
      seriesFilter.addEventListener('change', ()=>{
        renderOdds();
        refreshPullView();
      });
      setInterval(()=>{
        if(daily.date !== todayStr()){
          daily = loadDaily();
          buildTray();
          return;
        }
        const countdown = document.getElementById('pullCountdown');
        if(countdown) countdown.textContent = formatCountdown(msUntilNextTray());
      }, 1000);
      buildTray();
    }
  }

  /* ---- Page: shelf.html ---- */
  const shelfRow = document.getElementById('shelfRow');
  if(shelfRow){
    const signedIn = Boolean(getSignedInEmail());
    const shelfAuthPrompt = document.getElementById('shelfAuthPrompt');
    const shelfCollection = document.getElementById('shelfCollection');
    if(shelfAuthPrompt) shelfAuthPrompt.hidden = signedIn;
    if(shelfCollection) shelfCollection.hidden = !signedIn;
    if(!signedIn) return;
    const collection = loadCollection();
    const ownedCount = collection.reduce((total,item)=> total + item.qty, 0);
    const ownedSeries = new Set(collection
      .filter(item=> item.kind !== 'character' && item.qty > 0)
      .map(item=> item.productName || item.name)
      .filter(name=> COLLECTIBLE_PRODUCTS.some(product=>product.name === name)));
    const ownedCharacters = new Set(collection
      .filter(item=> item.kind === 'character' && item.qty > 0)
      .map(item=> `${item.productName}:${item.characterId}`));
    const uniqueCount = ownedSeries.size + ownedCharacters.size;
    const trackedCount = COLLECTIBLE_PRODUCTS.length + ownedCharacters.size;
    document.getElementById('collectionCount').textContent =
      `${uniqueCount} / ${trackedCount} unique · ${ownedCount} item${ownedCount === 1 ? '' : 's'} owned`;
    document.getElementById('collectionProgress').style.width =
      `${trackedCount ? uniqueCount / trackedCount * 100 : 0}%`;
    COLLECTIBLE_PRODUCTS.forEach(p=>{
      const slot = document.createElement('div');
      const productItems = collection.filter(entry=> entry.kind !== 'character' && (entry.productName || entry.name) === p.name);
      const quantity = productItems.reduce((total,item)=>total + (Number(item.qty) || 0), 0);
      const owned = quantity > 0;
      slot.className = 'shelf-slot' + (owned ? ' filled' : '') + (owned && p.chase ? ' chase' : '');
      slot.title = `${p.name}${owned ? ` · Qty: ${quantity}` : ' · Not owned'}`;
      slot.setAttribute('aria-label', slot.title);
      if(owned){
        slot.style.padding = '0';
        slot.style.overflow = 'hidden';
        slot.innerHTML = `${placeholderBox(p.name, p.image)}<span class="shelf-model-status">Sealed Series Box</span>`;
        slot.style.position = 'relative';
        const quantity = document.createElement('span');
        quantity.className = 'shelf-quantity';
        quantity.textContent = `×${productItems.reduce((total,item)=>total + (Number(item.qty) || 0), 0)}`;
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
    collection.filter(item=> item.kind === 'character' && item.qty > 0).forEach(item=>{
      const product = PRODUCTS.find(entry=> entry.name === item.productName);
      const characterName = item.characterName || item.name;
      const character = product && product.characters.find(entry=>entry.name === characterName);
      const canPreview = Boolean(product && character && product.modelPreview && hasCharacterModel(character.name));
      const slot = document.createElement('div');
      slot.className = 'shelf-slot filled shelf-character-slot';
      slot.title = `${characterName} · ${item.seriesName} · ${item.rarity} · Qty: ${item.qty}`;
      slot.setAttribute('aria-label', slot.title);
      slot.style.position = 'relative';
      slot.style.padding = '0';
      slot.style.overflow = 'hidden';
      slot.innerHTML = `${placeholderBox(characterName, item.image)}
        <div class="shelf-character-meta"><b>${escAttr(characterName)}</b><span>${escAttr(item.seriesName)}</span></div>
        <span class="shelf-character-rarity ${item.rarity === 'Secret Chase' ? 'rarity-secret' : 'rarity-common'}">${escAttr(item.rarity)}</span>
        ${canPreview ? `<button type="button" class="shelf-model-button" aria-label="See 3D model of ${escAttr(characterName)}">See 3D Model</button>` : '<span class="shelf-model-status">3D Preview Unavailable</span>'}
        <span class="shelf-quantity">×${item.qty}</span>`;
      const modelButton = slot.querySelector('.shelf-model-button');
      if(modelButton){
        modelButton.addEventListener('click', event=>{
          event.stopPropagation();
          renderModelViewer(product, character.name, character);
        });
      }
      shelfRow.appendChild(slot);
    });
  }

  /* ---- Page: trade.html ---- */
  const tradeListings = document.getElementById('tradeListings');
  if(tradeListings){
    renderTradeListings();
    renderTradeDeals();
    renderTradeOffers();
    document.querySelectorAll('[data-trade-tab="offers"], [data-trade-tab="deals"]').forEach(button=>{
      button.classList.toggle('trade-tab-locked', !getSignedInEmail());
      button.title = getSignedInEmail() ? '' : 'Sign in to manage offers and escrow deals';
    });
    updateShippingCountdowns();
    setInterval(updateShippingCountdowns, 60000);
    document.querySelectorAll('[data-trade-filter]').forEach(button=>button.addEventListener('click', ()=>{
      document.querySelectorAll('[data-trade-filter]').forEach(filterButton=>{
        const active = filterButton === button;
        filterButton.classList.toggle('active', active);
        filterButton.setAttribute('aria-pressed', String(active));
      });
      renderTradeListings(button.dataset.tradeFilter);
    }));
    document.querySelectorAll('[data-trade-tab]').forEach(button=>button.addEventListener('click', ()=>openTradeTab(button.dataset.tradeTab)));
    document.querySelector('[data-trade-post]').addEventListener('click', ()=>renderTradePostModal());
    if(location.hash === '#offers') openTradeTab('offers');
    else if(location.hash.startsWith('#deals-')) openTradeTab('deals', location.hash.slice(7));
  }
});