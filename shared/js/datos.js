/* ==========================================================
   CAPA DE DATOS COMPARTIDA · Heritage Service Utility
   Todos los módulos (Menú, Talabartería, Abarrotes) leen y
   escriben aquí para que la información esté sincronizada.
   ========================================================== */
const LS_KEYS = { products:'hs_products', cart:'hs_cart', sales:'hs_sales', services:'hs_services', settings:'hs_settings' };

const SEED_PRODUCTS = [];

function addDays(n){ const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }

const SEED_SERVICES = [];

const SEED_SETTINGS = { ventas:true, servicios:true, promos:false, recordatorios:true };

function load(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch(e){ return fallback; }
}
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

/* `state` lee/escribe directo en localStorage, así cada página
   (aunque sea un archivo .html distinto) siempre ve los datos
   más recientes sin necesidad de una sola app en memoria. */
const state = {
  get products(){ return load(LS_KEYS.products, SEED_PRODUCTS); },
  set products(v){ save(LS_KEYS.products, v); },
  get cart(){ return load(LS_KEYS.cart, []); },
  set cart(v){ save(LS_KEYS.cart, v); },
  get sales(){ return load(LS_KEYS.sales, []); },
  set sales(v){ save(LS_KEYS.sales, v); },
  get services(){ return load(LS_KEYS.services, SEED_SERVICES); },
  set services(v){ save(LS_KEYS.services, v); },
  get settings(){ return load(LS_KEYS.settings, SEED_SETTINGS); },
  set settings(v){ save(LS_KEYS.settings, v); },
};

function money(n){ return '$' + Number(n).toFixed(2); }
function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function timeAgo(ts){
  const d = new Date(ts);
  return d.toLocaleDateString('es-MX',{day:'2-digit',month:'short'}) + ' · ' + d.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'});
}

function cartCount(){ return state.cart.reduce((a,i)=>a+i.qty,0); }
function cartTotal(){ return state.cart.reduce((a,i)=>a+i.qty*i.price,0); }

const STATUS_LABEL = { en_progreso:'En progreso', listo:'Listo para entrega', entregado:'Entregado' };
const STATUS_BADGE = { en_progreso:'badge-progress', listo:'badge-ready', entregado:'badge-delivered' };

function getParam(name){ return new URLSearchParams(location.search).get(name); }

/* ==========================================================
   HISTORIAL PERMANENTE · agrupación por día
   Estas funciones NUNCA eliminan datos, sólo los organizan
   para su consulta. Los registros de ventas/servicios se
   conservan de forma indefinida en localStorage.
   ========================================================== */
function dayKey(ts){ return new Date(ts).toISOString().slice(0,10); }
function dayLabel(dayStr){
  const d = new Date(dayStr + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });
}

/* Devuelve la lista de días (más reciente primero) que tienen
   al menos un registro en `entries`, usando `getTs` para
   obtener el timestamp de cada entrada. */
function listDays(entries, getTs){
  const set = new Set(entries.map(e => dayKey(getTs(e))));
  return [...set].sort((a,b) => b.localeCompare(a));
}

/* Agrupa las ventas de un día concreto en productos únicos,
   sumando la cantidad vendida de cada uno (no se repiten). */
function aggregateSalesByDay(dayStr){
  const map = new Map();
  state.sales.filter(s => dayKey(s.createdAt) === dayStr).forEach(sale => {
    sale.items.forEach(it => {
      const key = it.name + '|' + it.price;
      if(!map.has(key)) map.set(key, { name: it.name, price: it.price, qty: 0 });
      map.get(key).qty += it.qty;
    });
  });
  return [...map.values()].sort((a,b) => a.name.localeCompare(b.name));
}

/* Agrupa los servicios de talabartería de un día concreto por
   tipo de producto + servicio solicitado, sumando cuántas
   veces se registró esa combinación (no se repiten). */
function aggregateServicesByDay(dayStr){
  const map = new Map();
  state.services.filter(s => dayKey(s.createdAt) === dayStr).forEach(s => {
    const key = s.productType + '|' + s.serviceRequested;
    if(!map.has(key)) map.set(key, { productType: s.productType, serviceRequested: s.serviceRequested, qty: 0 });
    map.get(key).qty += 1;
  });
  return [...map.values()].sort((a,b) => a.productType.localeCompare(b.productType));
}
