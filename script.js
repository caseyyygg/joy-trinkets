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
  div.innerHTML = '<span class="placeholder-brand">JOY<br>TRINKETS</span><span>Collector photo unavailable</span>';
  img.replaceWith(div);
}

function placeholderBox(label, imageUrl){
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
  {id:'sylvanian', name:'Sylvanian Families', count:'3 sets', icon:'⌂', bg:'#F7E7E8', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/8711915031349.jpg'},
  {id:'hirono', name:'Hirono', count:'3 sets', icon:'◌', bg:'#EEE9F5', image:'https://prod-america-res.popmart.com/default/20231102_173452_687387__1200x1200.jpg'},
  {id:'psyduck', name:'Psyduck', count:'1 set', icon:'◡', bg:'#F8EED7', image:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png'},
  {id:'crybaby', name:'Crybaby', count:'3 sets', icon:'♡', bg:'#F8E7EA', image:'https://prod-eurasian-res.popmart.com/default/16_oK4KL5lBhg_1200x1200.jpg'},
  {id:'twinkle', name:'Twinkle Twinkle', count:'3 sets', icon:'✦', bg:'#F5EBDD', image:'https://m.media-amazon.com/images/I/71eEjXaUYfL._AC_SL1500_.jpg'},
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
    }));
  }
  return [
    ...names.map((name, index)=>({
      name,
      rarity:'Standard',
      odds:'1/12',
      image:characterImage(name, index),
    })),
    {name:secretName, rarity:'Secret Chase', odds:'1/144', image:characterImage(secretName, names.length)},
  ];
}

function makeSeries({name, category, series, price, tag, tagText, heightCm, image, chase, characters, characterImages}){
  return {
    name, category, series, price, tag, tagText, heightCm, image, chase,
    characters:makeCharacters(characters, category, series, chase, characterImages, image),
  };
}

const PRODUCTS = [
  makeSeries({name:'Baby Seashore Friends Series', category:'sylvanian', series:'Baby Seashore Friends Series', price:420, tag:'tag-new', tagText:'New', heightCm:4.5, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd0E3uBVTVizb6J25exHm4l7JM3qD-D5SHhoNekMgTetZROFUkLhtAVclW&s=10', chase:'Allie Fennec with a crown', characters:['Nicola Splashy with crab hat','Jason Osborne in lobster costume','Owen Periwinkle with whale toy','Sandy Neptune with shell messenger bag','Amber Husky with fish wand','Sophie Snow with fish handbag','Ryan Persian with turtle backpack'], characterImages:['https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221335832.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221290790.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221327472.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221314816.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221303042.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221320376.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221308939.jpg','https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2447_1684221342664.jpg']}),
  makeSeries({name:'Baby Forest Costume Series', category:'sylvanian', series:'Baby Forest Costume Series', price:420, tag:'tag-low', tagText:'Low stock', heightCm:4.5, image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876192457.jpg', chase:'Peppermint Marlowe with leaf mask', characters:[
    {name:'Perri Buckley in an apple costume', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876205185.jpg'},
    {name:'Gilly Golightly in a mushroom costume', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876215847.jpg'},
    {name:'Ambrose Walnut in an acorn outfit', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876229647.jpg'},
    {name:'Mary Marshmallow with a leaf raft', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876239377.jpg'},
    {name:'Julie Outback in a ladybird outfit', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876252180.jpg'},
    {name:'Drake Husky with a green leaf accessory', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876276461.jpg'},
    {name:'Flora Chocolate with a lily of the valley accessory', rarity:'Standard', odds:'1/12', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876290163.jpg'},
    {name:'Peppermint Marlowe with leaf mask', rarity:'Secret Chase', odds:'1/144', image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2528_1702876303098.jpg'},
  ]}),
  makeSeries({name:'Baby Treats Series', category:'sylvanian', series:'Baby Treats Series', price:420, tag:'tag-new', tagText:'New', heightCm:4.5, image:'https://www.sylvanianfamilies.com/assets/includes_gl/img/products/2276_1639379953292.jpg', chase:'Sandy Neptune with madeleine', characters:[
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
  makeSeries({name:'Hirono City of Mercy', category:'hirono', series:'City of Mercy', price:850, tag:'tag-low', tagText:'Low stock', heightCm:8.5, image:'https://www.thetoychronicle.com/wp-content/uploads/2022/12/POP-MART-x-Inner-Flow-Hirono-City-of-Mercy-Blind-Box-Series-758x398.jpg', chase:'Belonging', characters:[
    {name:'Fallen Angel', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc-dmOlXGzPP0Dz7k7HMpEg-bRejCK27n_XmZN2yCjUQ&s=10'},
    {name:'Comfortably Numb', rarity:'Standard', odds:'1/12', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1USMjbhoTq8DNqH3QSJVOY2bG39VtGlCCggQ72hHnYA&s=10'},
    {name:'Healer', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/healer-main-150x150.webp'},
    {name:'Insight', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/insught-main-150x150.webp'},
    {name:'The Other', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/the-other-main-150x150.webp'},
    {name:'Echo', rarity:'Standard', odds:'1/12', image:'https://hironoworld.com/wp-content/uploads/2025/01/echo-main-150x150.webp'},
    {name:'Belonging', rarity:'Secret Chase', odds:'1/144', image:'https://hironoworld.com/wp-content/uploads/2025/01/belonging-main-150x150.webp'},
  ]}),
  makeSeries({name:'Hirono Reshape', category:'hirono', series:'Reshape', price:900, tag:'tag-new', tagText:'New', heightCm:8.5, image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwRDBP6RQOl8cCMgmomvhAxpF2cCmuRSQizgqkHzJ1wA&s=10', chase:'Puppet', characters:[
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

  // TODO: Replace generated character image paths with individual photos for each series.
  makeSeries({name:'Crybaby Crying Again', category:'crybaby', series:'Crying Again', price:820, tag:'tag-new', tagText:'New', heightCm:9, image:'https://down-ph.img.susercontent.com/file/cn-11134207-7ras8-m0leadz4njrbdc', chase:'Crying Again Secret', characters:['Crying Again - Blue','Crying Again - Pink','Crying Again - Yellow','Crying Again - Green','Crying Again - Purple','Crying Again - White']}),
  makeSeries({name:'Crybaby Wild but Cutie', category:'crybaby', series:'Wild but Cutie', price:750, tag:'tag-low', tagText:'Low stock', heightCm:9, image:'https://down-my.img.susercontent.com/file/cn-11134207-7ras8-m9qqk7v3nonm07', chase:'Wild Cutie', characters:['Bunny','Bear','Fox','Tiger','Deer','Lamb']}),
  makeSeries({name:'Crybaby Monster Tears', category:'crybaby', series:'Monster Tears', price:780, tag:'tag-soldout', tagText:'Sold out', heightCm:9, image:'https://down-my.img.susercontent.com/file/cn-11134207-7r98o-lz627es7pcpudf', chase:'Moth Queen', characters:['Monster Tears - Blue','Monster Tears - Pink','Monster Tears - Yellow','Monster Tears - Green','Monster Tears - Purple','Monster Tears - White']}),

  // TODO: Replace generated character image paths with individual photos for each series.
  makeSeries({name:'Twinkle Twinkle Savor the Moment', category:'twinkle', series:'Savor the Moment', price:830, tag:'tag-new', tagText:'New', heightCm:8, image:'https://m.media-amazon.com/images/I/71eEjXaUYfL._AC_SL1500_.jpg', chase:'Matcha Cream Snow', characters:['Sweet Morning','Little Picnic','Quiet Afternoon','Warm Embrace','Evening Wish','Sunday Stroll']}),
  makeSeries({name:'Twinkle Twinkle A Big Hug for You', category:'twinkle', series:'A Big Hug for You', price:810, tag:'tag-low', tagText:'Low stock', heightCm:8, image:'https://i.ebayimg.com/images/g/f7oAAeSw9MtorHa5/s-l1600.webp', chase:'The Best Gift', characters:['A Big Hug','Tiny Gift','Warm Wishes','Sweet Dreams','Little Star','Long Embrace']}),
  makeSeries({name:'Twinkle Twinkle Be a Little Star', category:'twinkle', series:'Be a Little Star', price:900, tag:'tag-new', tagText:'New', heightCm:8, image:'https://down-ph.img.susercontent.com/file/cn-11134207-7ras8-m8gal17u0h7h95', chase:'Reach for the Stars', characters:['Starry Night','Moonbeam','Wish Maker','Cloud Nine','Shining Bright','Starlight']}),

  // Smiski — official blind-box series; each has six designs and a rare secret.
  // TODO: Add individual Secret Smiski image URLs to each Smiski characterImages list.
  makeSeries({name:'Smiski Living Series', category:'smiskis', series:'Living Series', price:590, tag:'tag-new', tagText:'New', heightCm:6.5, image:'https://smiski.com/e/wp-content/uploads/2018/08/05.png', chase:'Secret Smiski', characters:['Daydreaming','Playing','Hiding','Nap Time','Thinking','Lifting'], characterImages:['https://smiski.com/e/wp-content/uploads/2018/08/05.png','https://smiski.com/e/wp-content/uploads/2018/08/04.png','https://smiski.com/e/wp-content/uploads/2018/08/02.png','https://smiski.com/e/wp-content/uploads/2018/08/03.png','https://smiski.com/e/wp-content/uploads/2018/08/01.png','https://smiski.com/e/wp-content/uploads/2018/08/06.png']}),
  makeSeries({name:'Smiski Bed Series', category:'smiskis', series:'Bed Series', price:590, tag:'tag-low', tagText:'Low stock', heightCm:6.5, image:'https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_01.png', chase:'Secret Smiski', characters:['Before Rest','Sleepy','Co-sleeping','Reading','At Sleep','Fussing'], characterImages:['https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_01.png','https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_02.png','https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_03.png','https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_04.png','https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_05.png','https://smiski.com/e/wp-content/uploads/2019/07/img_bed_products_06.png']}),
  makeSeries({name:'Smiski Yoga Series', category:'smiskis', series:'Yoga Series', price:590, tag:'tag-new', tagText:'New', heightCm:6.5, image:'https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_01.png', chase:'Secret Smiski', characters:['Lotus Pose','Twist Pose','Shouldstand Pose','Triangle Pose','Tree Pose','Ship Pose'], characterImages:['https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_01.png','https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_02.png','https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_03.png','https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_04.png','https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_05.png','https://smiski.com/e/wp-content/uploads/2019/09/img_yoga_06.png']}),
];

const PULL_POOL_VERSION = 2;
const PULL_OFFER_DURATION = 30 * 60 * 1000;
const PULL_EXCLUSIVES = [
  {name:'Moonpetal Keeper', series:'Joy Trinkets Vault', price:980, rarityLabel:'Vault Exclusive', rarityClass:'rarity-common', odds:55, heightCm:7},
  {name:'Starlight Parade', series:'Joy Trinkets Vault', price:1280, rarityLabel:'Rare Exclusive', rarityClass:'rarity-rare', odds:30, heightCm:7},
  {name:'Dreamweaver Guardian', series:'Joy Trinkets Vault', price:1680, rarityLabel:'Ultra-Rare Exclusive', rarityClass:'rarity-ultra', odds:12, heightCm:7},
  {name:'Golden Wish Keeper', series:'Joy Trinkets Vault', price:2280, rarityLabel:'Secret Chase', rarityClass:'rarity-secret', odds:3, heightCm:7},
];
const COLLECTIBLE_PRODUCTS = [...PRODUCTS, ...PULL_EXCLUSIVES];

const BASE_LISTINGS = [
  {name:'Baby Seashore Friends Series', desc:'→ open to offers for another Sylvanian baby series', by:'@roro.crates', time:'2h ago', bg:'#FFE1E8'},
  {name:'Hirono The Other One', desc:'x2 dupes → open to offers', by:'@finchbox', time:'5h ago', bg:'#FFF3D6'},
  {name:'Crybaby Crying Again', desc:'→ open to offers for another Crybaby series', by:'@minttape', time:'1d ago', bg:'#E1F9F1'},
];
const EXTRA_LISTINGS = [
  {name:'Smiski Yoga Series', desc:'→ looking for another Smiski series', by:'@shelfshelf', time:'1d ago', bg:'#FFE9DC'},
  {name:'Twinkle Twinkle Be a Little Star', desc:'Chase pulled → offers only', by:'@pinkboxpe', time:'2d ago', bg:'#EFE7FF'},
  {name:'Psyduck Figure Collection', desc:'x3 dupes → will bundle', by:'@collectph', time:'3d ago', bg:'#E3F0FF'},
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
const BUNDLE_DISCOUNT_THRESHOLD = 3;
const BUNDLE_DISCOUNT_RATE = 0.10;

function getSignedInEmail(){
  try{
    return localStorage.getItem('joytrinkets_user') || '';
  }catch(error){
    console.error('Could not read the sign-in state.', error);
    return '';
  }
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
  stopScaleCamera();
  body.innerHTML = html;
  const modalBox = overlay.querySelector('.modal-box');
  if(modalBox) modalBox.classList.toggle('modal-box-wide', Boolean(body.querySelector('.character-viewer, .scale-viewer')));
  overlay.classList.add('open');
}
let activeCameraStream = null;
let cameraRequestVersion = 0;
let activeCharacterProduct = null;
let activeCharacterIndex = 0;

function closeModal(){
  stopScaleCamera();
  const overlay = document.getElementById('modalOverlay');
  if(overlay) overlay.classList.remove('open');
}

function stopScaleCamera(){
  cameraRequestVersion++;
  if(activeCameraStream){
    activeCameraStream.getTracks().forEach(track=>track.stop());
    activeCameraStream = null;
  }
  const body = document.getElementById('modalBody');
  if(body){
    const video = body.querySelector('[data-camera-video]');
    if(video) video.srcObject = null;
    const stage = body.querySelector('[data-camera-stage]');
    if(stage) stage.hidden = true;
    const start = body.querySelector('[data-camera-start]');
    if(start){
      start.hidden = false;
      start.disabled = false;
      start.textContent = 'Start camera';
    }
    const sizeControl = body.querySelector('[data-camera-size-control]');
    if(sizeControl) sizeControl.hidden = true;
    const fallback = body.querySelector('[data-camera-fallback]');
    if(fallback) fallback.hidden = true;
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
        <div class="character-actions"><button class="btn btn-primary" type="button" data-character-add ${product.tag === 'tag-soldout' ? 'disabled' : ''}>Add Blind Box to Cart</button><button class="btn btn-outline" type="button" data-size-preview>📏 See on hand / actual size</button></div>
      </div>
    </div>`);
  const body = document.getElementById('modalBody');
  body.querySelector('[data-character-prev]').addEventListener('click', ()=>renderCharacterModal(product, activeCharacterIndex - 1));
  body.querySelector('[data-character-next]').addEventListener('click', ()=>renderCharacterModal(product, activeCharacterIndex + 1));
  body.querySelectorAll('[data-character-index]').forEach(button=>button.addEventListener('click', ()=>renderCharacterModal(product, Number(button.dataset.characterIndex))));
  const addButton = body.querySelector('[data-character-add]');
  if(addButton) addButton.addEventListener('click', ()=>addToCart(product));
  body.querySelector('[data-size-preview]').addEventListener('click', ()=>renderScalePreview(product, character));
}

function renderScalePreview(product, character){
  stopScaleCamera();
  const heightCm = product.heightCm || 6.5;
  const figureName = character ? character.name : product.name;
  const figureImage = character ? character.image : product.image;
  openModal(`
    <div class="scale-viewer">
      <span class="kicker">True-scale preview</span><h3>${escAttr(character ? character.name : product.name)}</h3>
      <p class="modal-sub">Figure height: <b>${figureHeightText(heightCm)}</b></p>
      <div class="scale-tabs" role="tablist"><button class="scale-tab active" type="button" data-scale-tab="objects" role="tab" aria-selected="true">In-Hand &amp; Object Scale</button><button class="scale-tab" type="button" data-scale-tab="camera" role="tab" aria-selected="false">Live Camera Hand Overlay</button></div>
      <section class="scale-panel" data-scale-panel="objects">
        <div class="object-scale-controls"><label for="scaleObject">Compare with</label><select id="scaleObject"><option value="18">Open Palm (18 cm)</option><option value="14.7">Smartphone (14.7 cm)</option><option value="2.7">₱10 Coin (2.7 cm)</option></select></div>
        <div class="object-scale-stage">
          <div class="scale-ruler" style="height:${heightCm}cm"><span>${heightCm} cm</span></div>
          <div class="scale-figure" style="height:${heightCm}cm">${placeholderBox(character ? character.name : product.name, character ? character.image : product.image)}</div>
          <div class="scale-object palm" data-object-visual style="height:18cm; --object-height:18cm; --object-width:8.1cm"><span>Open Palm · 18 cm</span></div>
        </div>
        <p class="scale-disclaimer">Displayed at proportional CSS scale. Actual physical size on screen varies by device, display settings, and zoom.</p>
      </section>
      <section class="scale-panel camera-panel" data-scale-panel="camera" hidden>
        <p class="camera-help">Allow camera access, then hold your palm up to compare the figure size.</p>
        <button class="btn btn-outline camera-start" type="button" data-camera-start>Start camera</button>
        <div class="camera-stage" data-camera-stage hidden><video data-camera-video autoplay playsinline muted></video><div class="camera-figure" data-camera-figure aria-label="${escAttr(figureName)}">${placeholderBox(figureName, figureImage)}</div><p class="camera-fallback" data-camera-fallback hidden></p></div>
        <label class="camera-size-control" data-camera-size-control hidden>Figure size <input type="range" min="40" max="420" value="${Math.round(heightCm * 38)}" data-camera-size></label>
        <p class="scale-disclaimer">Camera preview is local to this device. Physical sizing may vary with camera distance and display settings.</p>
      </section>
    </div>`);
  const body = document.getElementById('modalBody');
  const objectSelect = body.querySelector('#scaleObject');
  const objectVisual = body.querySelector('[data-object-visual]');
  objectSelect.addEventListener('change', ()=>{
    const cm = Number(objectSelect.value);
    objectVisual.style.height = `${cm}cm`;
    objectVisual.style.setProperty('--object-height', `${cm}cm`);
    objectVisual.style.setProperty('--object-width', `${cm * (cm === 2.7 ? 1 : 0.48)}cm`);
    objectVisual.classList.toggle('palm', cm === 18);
    objectVisual.classList.toggle('phone', cm === 14.7);
    objectVisual.classList.toggle('coin', cm === 2.7);
    objectVisual.querySelector('span').textContent = `${objectSelect.options[objectSelect.selectedIndex].text}`;
  });
  body.querySelectorAll('[data-scale-tab]').forEach(tab=>tab.addEventListener('click', async ()=>{
    stopScaleCamera();
    body.querySelectorAll('[data-scale-tab]').forEach(item=>{
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    body.querySelectorAll('[data-scale-panel]').forEach(panel=>panel.hidden = panel.dataset.scalePanel !== tab.dataset.scaleTab);
    if(tab.dataset.scaleTab === 'camera') await startScaleCamera(body, character, product);
  }));
}

async function startScaleCamera(body, character, product){
  const requestVersion = ++cameraRequestVersion;
  const start = body.querySelector('[data-camera-start]');
  const stage = body.querySelector('[data-camera-stage]');
  const video = body.querySelector('[data-camera-video]');
  const fallback = body.querySelector('[data-camera-fallback]');
  const sizeControl = body.querySelector('[data-camera-size-control]');
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    stage.hidden = false;
    fallback.hidden = false;
    fallback.textContent = 'Camera preview is not available in this browser or connection. Try a secure HTTPS page or use the object scale tab.';
    return;
  }
  start.disabled = true;
  start.textContent = 'Requesting camera…';
  try{
    const stream = await navigator.mediaDevices.getUserMedia({video:true});
    const overlay = document.getElementById('modalOverlay');
    const cameraPanel = body.querySelector('[data-scale-panel="camera"]');
    if(requestVersion !== cameraRequestVersion || !body.isConnected || !overlay.classList.contains('open') || !cameraPanel || cameraPanel.hidden){
      stream.getTracks().forEach(track=>track.stop());
      return;
    }
    activeCameraStream = stream;
    video.srcObject = stream;
    stage.hidden = false;
    sizeControl.hidden = false;
    start.hidden = true;
    const figure = body.querySelector('[data-camera-figure]');
    const slider = body.querySelector('[data-camera-size]');
    slider.addEventListener('input', ()=>figure.style.height = `${slider.value}px`);
    let dragging = false;
    figure.addEventListener('pointerdown', event=>{ dragging = true; figure.setPointerCapture(event.pointerId); });
    figure.addEventListener('pointerup', ()=>dragging = false);
    figure.addEventListener('pointercancel', ()=>dragging = false);
    figure.addEventListener('pointermove', event=>{
      if(!dragging) return;
      const rect = stage.getBoundingClientRect();
      figure.style.left = `${Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100))}%`;
      figure.style.top = `${Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100))}%`;
    });
  }catch(error){
    if(requestVersion !== cameraRequestVersion) return;
    console.warn('Camera access was unavailable for the size preview.', error);
    stage.hidden = false;
    fallback.hidden = false;
    fallback.textContent = error.name === 'NotAllowedError'
      ? 'Camera permission was declined. You can enable it in your browser settings, or use the object scale tab.'
      : 'The camera could not be started. Check that it is available and try again, or use the object scale tab.';
    start.disabled = false;
    start.textContent = 'Try camera again';
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
  const lines = cart.map(l=> `
    <div class="cart-line">
      <div class="cart-line-figure" style="background:var(--surface-2); display:flex; align-items:center; justify-content:center; overflow:hidden;">${l.image ? `<img src="${escAttr(l.image)}" alt="${escAttr(l.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="imgFallback(this)">` : '<span style="font-size:10px; color:var(--muted); text-align:center;">img</span>'}</div>
      <div class="cart-line-info"><b>${l.name}</b><span>${peso(l.price)} × ${l.qty}</span></div>
      <button class="cart-remove" data-remove="${l.name}">Remove</button>
    </div>`).join('');
  openModal(`
    <h3>Your cart</h3>
    <p class="modal-sub">${itemCount} item${itemCount === 1 ? '' : 's'} · packed with care</p>
    ${lines}
    <div class="cart-totals">
      <div><span>Subtotal</span><span>${peso(subtotal)}</span></div>
      <div><span>Bundle discount</span><span>${discount ? `−${peso(discount)}` : peso(0)}</span></div>
      <div class="cart-total-row"><strong>Items total</strong><strong>${peso(subtotal - discount)}</strong></div>
    </div>
    <p class="cart-shipping-note">Shipping is confirmed after your delivery address is reviewed.</p>
    <p class="cart-protection-note">Order protection: review your order before confirming. Payment details are never stored here.</p>
    <div class="payment-badges cart-payment-badges" aria-label="Payment methods available"><span>GCash</span><span>Maya</span><span>Card</span><span>COD</span></div>
    <button class="btn btn-primary" id="checkoutBtn" style="width:100%; justify-content:center; margin-top:18px;">Continue to checkout</button>`);
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
    if(document.getElementById('pullTray')) location.reload();
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
  updateSignInButton();

  // highlight the current page in the nav
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    if(a.getAttribute('href') === here) a.classList.add('active');
  });

  const overlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  if(modalClose) modalClose.addEventListener('click', closeModal);
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
    const orderConfirmation = document.getElementById('orderConfirmation');
    const checkoutForm = document.getElementById('checkoutForm');
    function renderCheckoutSummary(){
      const itemCount = cartItemCount();
      const subtotal = cartTotal();
      const discount = itemCount >= BUNDLE_DISCOUNT_THRESHOLD ? Math.round(subtotal * BUNDLE_DISCOUNT_RATE) : 0;
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
      discountMessage.textContent = itemCount >= BUNDLE_DISCOUNT_THRESHOLD
        ? '10% bundle discount applied!'
        : `Add ${BUNDLE_DISCOUNT_THRESHOLD - itemCount} more item${BUNDLE_DISCOUNT_THRESHOLD - itemCount === 1 ? '' : 's'} for 10% off.`;
      discountMessage.classList.toggle('discount-applied', itemCount >= BUNDLE_DISCOUNT_THRESHOLD);
    }

    renderCheckoutSummary();
    checkoutForm.addEventListener('submit', event=>{
      event.preventDefault();
      if(!checkoutForm.reportValidity() || cartItemCount() === 0) return;
      const orderId = 'JT-' + Math.floor(10000 + Math.random()*89999);
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
      if(document.getElementById('pullTray')) location.reload();
    }
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
        const soldOut = p.tag === 'tag-soldout';
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
            <button class="add-btn" ${soldOut ? 'disabled' : ''} aria-label="Add ${escAttr(p.name)} to cart">${soldOut ? 'Sold out' : 'Add to Cart'}</button>
          </div>`;
        const addButton = card.querySelector('.add-btn');
        addButton.addEventListener('click', event=>{ event.stopPropagation(); addToCart(p); });
        card.addEventListener('click', event=>{
          if(event.target.closest('.add-btn')) return;
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

  /* ---- Page: pull.html — limited to 3 boxes per day ---- */
  const tray = document.getElementById('pullTray');
  if(tray){
    const vaultOdds = document.getElementById('vaultOdds');
    vaultOdds.innerHTML = PULL_EXCLUSIVES.map(item=>`
      <article class="vault-odds-card">
        <span class="result-rarity ${item.rarityClass}">${escAttr(item.rarityLabel)}</span>
        <b>${escAttr(item.name)}</b>
        <span>${item.odds}% chance · ${peso(item.price)}</span>
      </article>`).join('');
    const pullPanel = document.getElementById('pullPanel');
    const signInPrompt = document.getElementById('pullSignInPrompt');
    if(!getSignedInEmail()){
      pullPanel.hidden = true;
      signInPrompt.hidden = false;
    }else{
    const result = document.getElementById('pullResult');
    const pullCountEl = document.getElementById('pullCount');
    const DAILY_LIMIT = 3;

    function todayStr(){
      const d = new Date();
      return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    }
    function loadDaily(){
      let daily;
      try{ daily = JSON.parse(localStorage.getItem('joytrinkets_daily_pull')); }catch(e){ daily = null; }
      if(!daily || daily.date !== todayStr() || daily.poolVersion !== PULL_POOL_VERSION){
        daily = {date: todayStr(), poolVersion: PULL_POOL_VERSION, results: []};
      }
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
    let offerTimer;
    function renderResult(r){
      clearInterval(offerTimer);
      const product = PULL_EXCLUSIVES.find(p=> p.name === r.name);
      const offerExpiresAt = Number(r.offerExpiresAt) || 0;
      const offerExpired = offerExpiresAt <= Date.now();
      result.innerHTML = `
        <div class="result-figure">${placeholderBox(r.name, r.image)}</div>
        <span class="result-rarity ${escAttr(r.rarityClass)}">${escAttr(r.rarityLabel)}</span>
        <h3 style="font-size:19px; margin-bottom:6px;">${escAttr(r.name)}</h3>
        <p class="vault-result-note">${product
          ? `Vault exclusive · ${product.odds}% pull odds. This reveal is a chance to buy, not an item you own.`
          : 'This pull came from an older vault and is no longer available to buy.'}</p>
        ${product ? `
          <p class="vault-offer-countdown" id="vaultOfferCountdown" role="status"></p>
          <button class="btn btn-primary" id="addPulledFigure" style="margin-top:12px;" ${offerExpired || r.addedToCart ? 'disabled' : ''}>
            ${r.addedToCart ? 'Added to cart' : `Add to cart · ${peso(product.price)}`}
          </button>` : ''}`;
      const addButton = result.querySelector('#addPulledFigure');
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
      if(addButton) addButton.addEventListener('click', ()=>{
        if(Date.now() >= offerExpiresAt || r.addedToCart) return;
        addToCart(product);
        r.addedToCart = true;
        saveDaily();
        addButton.disabled = true;
        addButton.textContent = 'Added to cart';
      });
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
        const roll = Math.random() * 100;
        let cumulativeOdds = 0;
        const picked = PULL_EXCLUSIVES.find(item=>{
          cumulativeOdds += item.odds;
          return roll < cumulativeOdds;
        });
        const pullResult = {
          name:picked.name,
          rarityClass:picked.rarityClass,
          rarityLabel:picked.rarityLabel,
          offerExpiresAt:Date.now() + PULL_OFFER_DURATION,
        };
        daily.results.push(pullResult);
        saveDaily();
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
  }

  /* ---- Page: shelf.html ---- */
  const shelfRow = document.getElementById('shelfRow');
  if(shelfRow){
    const collection = loadCollection();
    const ownedCount = collection.reduce((total,item)=> total + item.qty, 0);
    const uniqueCount = collection.filter(item=> item.qty > 0 && COLLECTIBLE_PRODUCTS.some(p=> p.name === item.name)).length;
    document.getElementById('collectionCount').textContent =
      `${uniqueCount} / ${COLLECTIBLE_PRODUCTS.length} unique · ${ownedCount} item${ownedCount === 1 ? '' : 's'} owned`;
    document.getElementById('collectionProgress').style.width =
      `${COLLECTIBLE_PRODUCTS.length ? uniqueCount / COLLECTIBLE_PRODUCTS.length * 100 : 0}%`;
    COLLECTIBLE_PRODUCTS.forEach(p=>{
      const slot = document.createElement('div');
      const item = collection.find(entry=> entry.name === p.name);
      const owned = item && item.qty > 0;
      slot.className = 'shelf-slot' + (owned ? ' filled' : '') + (owned && p.chase ? ' chase' : '');
      slot.title = `${p.name}${owned ? ` · Qty: ${item.qty}` : ' · Not owned'}`;
      slot.setAttribute('aria-label', slot.title);
      if(owned){
        slot.style.padding = '0';
        slot.style.overflow = 'hidden';
        slot.innerHTML = `${placeholderBox(p.name, p.image)}<button type="button" class="shelf-size-button" aria-label="Preview actual size of ${escAttr(p.name)}">📏 Size</button>`;
        slot.style.position = 'relative';
        slot.querySelector('.shelf-size-button').addEventListener('click', event=>{
          event.stopPropagation();
          renderScalePreview(p, null);
        });
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