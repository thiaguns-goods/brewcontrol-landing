(() => {
  'use strict';
  const normalize = (value = '') => value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

  const menuButton = document.querySelector('[data-help-menu]');
  const nav = document.querySelector('[data-help-nav]');
  if (menuButton && nav) {
    const close = () => { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Abrir menu'); };
    menuButton.addEventListener('click', () => { const open=nav.classList.toggle('is-open'); menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu'); });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click',close));
    window.addEventListener('resize', () => { if(window.innerWidth>820) close(); }, {passive:true});
  }

  const searchInput=document.querySelector('[data-help-search]');
  const results=document.querySelector('[data-help-results]');
  const resultCount=document.querySelector('[data-help-result-count]');
  const empty=document.querySelector('[data-help-empty]');
  const clearButton=document.querySelector('[data-help-clear]');
  const index=Array.isArray(window.BREW_HELP_INDEX)?window.BREW_HELP_INDEX:[];
  const synonyms=window.BREW_HELP_SYNONYMS||{};

  const expandTerms=query=>{
    const base=normalize(query).split(' ').filter(Boolean); const expanded=new Set(base);
    Object.entries(synonyms).forEach(([key,values])=>{ const k=normalize(key); const v=values.map(normalize); if(base.includes(k)||v.some(x=>base.includes(x))){expanded.add(k);v.forEach(x=>expanded.add(x));} });
    return Array.from(expanded).filter(Boolean);
  };
  const scoreEntry=(entry,query)=>{
    const terms=expandTerms(query); if(!terms.length)return 0;
    const fields={title:normalize(entry.title),aliases:normalize((entry.aliases||[]).join(' ')),tasks:normalize((entry.tasks||[]).join(' ')),description:normalize(entry.description),module:normalize(entry.module),roles:normalize((entry.roles||[]).join(' ')),tags:normalize((entry.tags||[]).join(' ')),content:normalize(entry.content)};
    let score=0; terms.forEach(term=>{ if(fields.title===term)score+=120;if(fields.title.includes(term))score+=52;if(fields.aliases.includes(term))score+=44;if(fields.tasks.includes(term))score+=36;if(fields.module.includes(term))score+=30;if(fields.tags.includes(term))score+=22;if(fields.roles.includes(term))score+=18;if(fields.description.includes(term))score+=14;if(fields.content.includes(term))score+=8; });
    const q=normalize(query); if(fields.title.includes(q))score+=75;if(fields.aliases.includes(q))score+=55; return score;
  };
  const renderResults=query=>{
    if(!searchInput||!results||!empty)return; const clean=query.trim(); if(clearButton)clearButton.hidden=!clean;
    if(clean.length<2){results.innerHTML='';results.hidden=true;empty.hidden=true;if(resultCount)resultCount.textContent='';return;}
    const matches=index.map(entry=>({entry,score:scoreEntry(entry,clean)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.entry.title.localeCompare(b.entry.title,'pt-BR')).slice(0,8);
    results.innerHTML='';results.hidden=matches.length===0;empty.hidden=matches.length!==0;if(resultCount)resultCount.textContent=matches.length?`${matches.length} resultado${matches.length>1?'s':''}`:'Nenhum resultado';
    matches.forEach(({entry})=>{ const link=document.createElement('a');link.className='search-result';link.href=entry.href;link.innerHTML=`<span class="result-main"><strong>${entry.title}</strong><span>${entry.description}</span></span><span class="result-meta"><b>${entry.module}</b><small>${entry.status}</small></span>`;results.appendChild(link); });
  };
  if(searchInput&&results&&empty){
    searchInput.addEventListener('input',e=>renderResults(e.target.value));
    searchInput.addEventListener('keydown',event=>{ const links=Array.from(results.querySelectorAll('a')); if(event.key==='ArrowDown'&&links.length){event.preventDefault();links[0].focus();}else if(event.key==='Enter'&&links.length&&searchInput.value.trim().length>=2){event.preventDefault();links[0].click();}else if(event.key==='Escape'){searchInput.value='';renderResults('');} });
    results.addEventListener('keydown',event=>{ const links=Array.from(results.querySelectorAll('a'));const current=links.indexOf(document.activeElement);if(current<0)return;if(event.key==='ArrowDown'){event.preventDefault();(links[current+1]||links[0]).focus();}else if(event.key==='ArrowUp'){event.preventDefault();current===0?searchInput.focus():links[current-1].focus();}else if(event.key==='Escape'){event.preventDefault();searchInput.focus();searchInput.value='';renderResults('');} });
    clearButton?.addEventListener('click',()=>{searchInput.value='';renderResults('');searchInput.focus();});
    document.querySelectorAll('[data-search-term]').forEach(button=>button.addEventListener('click',()=>{searchInput.value=button.dataset.searchTerm||button.textContent||'';renderResults(searchInput.value);searchInput.focus();}));
    const initialQuery=new URLSearchParams(window.location.search).get('q');if(initialQuery){searchInput.value=initialQuery;renderResults(initialQuery);}
  }

  const moduleNames={producao:['Produção','Conteúdo operacional aguardando auditoria documental.'],estoque:['Estoque e Almoxarifado','Conteúdo operacional aguardando auditoria documental.'],ativos:['Ativos e Barris','Conteúdo operacional aguardando auditoria documental.'],comercial:['Comercial','Conteúdo operacional aguardando auditoria documental.'],logistica:['Logística','Conteúdo operacional aguardando auditoria documental.'],financeiro:['Financeiro','Conteúdo operacional aguardando auditoria documental.'],brewpub:['Brewpub','Conteúdo operacional aguardando auditoria documental.'],fiscal:['Fiscal','Conteúdo operacional e fiscal aguardando revisão e homologação.'],'pdv-mobile':['PDV Mobile','Conteúdo operacional aguardando auditoria documental.']};
  const moduleTitle=document.querySelector('[data-module-title]');
  if(moduleTitle){const key=new URLSearchParams(window.location.search).get('m')||'producao';const selected=moduleNames[key]||moduleNames.producao;document.querySelectorAll('[data-module-title]').forEach(el=>el.textContent=selected[0]);document.querySelectorAll('[data-module-note]').forEach(el=>el.textContent=selected[1]);document.title=`${selected[0]} — Central de Ajuda BrewControl`;}
})();