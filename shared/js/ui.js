/* ==========================================================
   UI COMPARTIDA · encabezado y modal reutilizables
   ========================================================== */
function renderHeader({ title, backHref=null, homeHref=null, settingsHref=null, extraHref=null, extraIcon='history', extraTitle='Historial' }){
  const backBtn = backHref
    ? `<a href="${backHref}" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 tap"><span class="material-symbols-outlined text-[#8C261F]">arrow_back</span></a>`
    : `<div class="w-10 h-10"></div>`;
  document.getElementById('header').innerHTML = `
    <header class="sticky top-0 z-40 w-full h-16 flex items-center justify-between px-4 bg-[#FEF9F0]/95 backdrop-blur border-b border-[#D4A373]/30">
      <div class="flex items-center gap-2">${backBtn}<h1 class="font-bold text-[20px] text-[#8C261F]">${esc(title)}</h1></div>
      <div class="flex items-center gap-1">
        ${homeHref ? `<a href="${homeHref}" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 tap" title="Inicio"><span class="material-symbols-outlined text-[#8C261F]">home</span></a>` : ''}
        ${extraHref ? `<a href="${extraHref}" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 tap" title="${esc(extraTitle)}"><span class="material-symbols-outlined text-[20px] text-[#8C261F]">${extraIcon}</span></a>` : ''}
        ${settingsHref ? `<a href="${settingsHref}" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 tap" title="Ajustes"><span class="material-symbols-outlined text-[#8C261F]">settings</span></a>` : ''}
      </div>
    </header>`;
}
function showModal(html){
  document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop">${html}</div>`;
}
function closeModal(){ document.getElementById('modal-root').innerHTML = ''; }
