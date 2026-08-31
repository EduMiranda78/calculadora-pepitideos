const state = {
  vialMg: null,
  vialCustom: false,
  diluentMl: null,
  diluentCustom: false,
  syringeMaxUi: 30,
  doseUnit: 'mg',
  doseValue: null
};

const vialValues = [5,10,15,20,30,40,50,60,100];
const diluentValues = [0.5,1,1.5,2,2.5,3];
const dosePresets = {
  mg: [0.25,0.5,1,1.7,2,2.4,2.5,4,5,7.5,10,12,12.5,15,17.5,20,25,30],
  mcg: [100,125,250,500,750,1000],
  ui: [5,10,15,20,25,30,40,50,75,100]
};

const $ = id => document.getElementById(id);

function num(value){
  if(typeof value === 'number') return value;
  const n = Number(String(value).trim().replace(',','.'));
  return Number.isFinite(n) ? n : NaN;
}
function fmt(n,max=3){
  return new Intl.NumberFormat('pt-BR',{maximumFractionDigits:max}).format(n);
}
function fmtUi(n){ return fmt(n,1); }

function makeChip(label,value,active,onClick){
  const b=document.createElement('button');
  b.type='button';
  b.className='chip'+(active?' active':'');
  b.textContent=label;
  b.addEventListener('click',onClick);
  return b;
}

function renderVials(){
  const root=$('vialChips');
  root.innerHTML='';
  vialValues.forEach(v=>{
    root.appendChild(makeChip(`${fmt(v)} mg`,v,!state.vialCustom&&state.vialMg===v,()=>{
      state.vialMg=v;
      state.vialCustom=false;
      $('vialOtherWrap').classList.add('hidden');
      $('vialOther').value='';
      renderVials();
      calculate();
    }));
  });
  root.appendChild(makeChip('Outro','other',state.vialCustom,()=>{
    state.vialCustom=true;
    state.vialMg=null;
    $('vialOtherWrap').classList.remove('hidden');
    renderVials();
    $('vialOther').focus();
    calculate();
  }));
}

function renderDiluents(){
  const root=$('diluentChips');
  root.innerHTML='';
  diluentValues.forEach(v=>{
    root.appendChild(makeChip(`${fmt(v)} mL`,v,!state.diluentCustom&&state.diluentMl===v,()=>{
      state.diluentMl=v;
      state.diluentCustom=false;
      $('diluentOtherWrap').classList.add('hidden');
      $('diluentOther').value='';
      renderDiluents();
      calculate();
    }));
  });
  root.appendChild(makeChip('Outro','other',state.diluentCustom,()=>{
    state.diluentCustom=true;
    state.diluentMl=null;
    $('diluentOtherWrap').classList.remove('hidden');
    renderDiluents();
    $('diluentOther').focus();
    calculate();
  }));
}

function renderSyringes(){
  const root=$('syringeOptions');
  root.innerHTML='';
  [[30,.3],[50,.5],[100,1]].forEach(([ui,ml])=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='syringe-option'+(state.syringeMaxUi===ui?' active':'');
    b.innerHTML=`<strong>${ui} UI</strong><span>${fmt(ml)} mL</span><small>Seringa U-100</small>`;
    b.addEventListener('click',()=>{
      state.syringeMaxUi=ui;
      renderSyringes();
      calculate();
    });
    root.appendChild(b);
  });
}

function renderDoseChips(){
  const root=$('doseChips');
  root.innerHTML='';
  dosePresets[state.doseUnit].forEach(v=>{
    root.appendChild(makeChip(fmt(v),v,state.doseValue===v,()=>{
      state.doseValue=v;
      $('doseInput').value=String(v).replace('.',',');
      renderDoseChips();
      calculate();
    }));
  });
}

function getCalc(){
  const vial=state.vialMg;
  const diluent=state.diluentMl;
  const dose=state.doseValue;

  if(!Number.isFinite(vial)||vial<=0||!Number.isFinite(diluent)||diluent<=0||!Number.isFinite(dose)||dose<=0){
    return null;
  }

  const concentrationMgMl=vial/diluent;
  let doseMg,ml,ui;

  if(state.doseUnit==='mg'){
    doseMg=dose;
    ml=doseMg/concentrationMgMl;
    ui=ml*100;
  }else if(state.doseUnit==='mcg'){
    doseMg=dose/1000;
    ml=doseMg/concentrationMgMl;
    ui=ml*100;
  }else{
    ui=dose;
    ml=ui/100;
    doseMg=ml*concentrationMgMl;
  }

  return {
    vialMg:vial,
    diluent,
    dose,
    concentrationMgMl,
    concentrationMcgMl:concentrationMgMl*1000,
    doseMg,
    doseMcg:doseMg*1000,
    ml,
    ui,
    count:vial/doseMg
  };
}

function scaleSettings(maxUi){
  if(maxUi===30) return {major:5,minor:1};
  if(maxUi===50) return {major:10,minor:1};
  return {major:20,minor:2};
}

function drawScale(maxUi){
  const root=$('ticks');
  root.innerHTML='';
  const {major,minor}=scaleSettings(maxUi);

  for(let i=0;i<=maxUi;i+=minor){
    const pct=(i/maxUi)*100;

    const line=document.createElement('span');
    line.className='tick-line'+(i%major===0?' major':'');
    line.style.left=`${pct}%`;
    root.appendChild(line);

    if(i%major===0){
      const label=document.createElement('span');
      label.className='tick-number';
      if(i===0) label.classList.add('first');
      if(i===maxUi) label.classList.add('last');
      label.style.left=`${pct}%`;
      label.textContent=i;
      root.appendChild(label);
    }
  }
}

function updateLiveConcentration(){
  const el=$('liveConcentration');
  if(Number.isFinite(state.vialMg)&&state.vialMg>0&&Number.isFinite(state.diluentMl)&&state.diluentMl>0){
    const c=state.vialMg/state.diluentMl;
    el.innerHTML=`Concentração atual: <strong>${fmt(c,3)} mg/mL</strong>. Cada 10 UI correspondem a <strong>${fmt(c*.1,3)} mg</strong>.`;
  }else{
    el.textContent='Selecione frasco e diluente para ver a concentração.';
  }
}

function calculate(){
  updateLiveConcentration();
  const c=getCalc();

  if(!c){
    $('resultEmpty').classList.remove('hidden');
    $('resultContent').classList.add('hidden');
    drawScale(state.syringeMaxUi);
    return;
  }

  $('resultEmpty').classList.add('hidden');
  $('resultContent').classList.remove('hidden');

  $('resultUi').textContent=fmtUi(c.ui);
  $('resultMl').textContent=fmt(c.ml,3);
  $('resultMg').textContent=fmt(c.doseMg,3);
  $('resultMcg').textContent=fmt(c.doseMcg,1);
  $('concentrationMg').textContent=`${fmt(c.concentrationMgMl,3)} mg/mL`;
  $('concentrationMcg').textContent=`${fmt(c.concentrationMcgMl,1)} mcg/mL`;
  $('doseCount').textContent=fmt(c.count,2);

  const max=state.syringeMaxUi;
  const ml=max/100;
  $('syringeTitle').textContent=`${max} UI · ${fmt(ml,1)} mL`;

  drawScale(max);

  const pct=Math.max(0,Math.min(100,(c.ui/max)*100));
  $('syringeFill').style.width=`${pct}%`;
  $('doseMarker').style.left=`${pct}%`;
  $('doseMarkerLabel').textContent=`${fmtUi(c.ui)} UI`;

  const alert=$('capacityAlert');
  alert.classList.add('hidden');

  if(c.doseMg>c.vialMg){
    alert.textContent='A dose desejada é maior que o conteúdo total disponível no frasco.';
    alert.classList.remove('hidden');
  }else if(c.ui>max){
    alert.textContent='Essa dose ultrapassa a capacidade da seringa selecionada. Escolha uma seringa maior ou ajuste os parâmetros.';
    alert.classList.remove('hidden');
  }

  const tenUiMg=c.concentrationMgMl*.1;
  $('quickExplain').innerHTML=
    `<p><strong>10 UI = 0,1 mL</strong> em qualquer seringa U-100.</p>`+
    `<p>Com a concentração atual de <strong>${fmt(c.concentrationMgMl,3)} mg/mL</strong>, 10 UI correspondem a <strong>${fmt(tenUiMg,3)} mg</strong> (${fmt(tenUiMg*1000,1)} mcg).</p>`+
    `<p>Menos diluente aumenta a concentração. Mais diluente reduz a concentração.</p>`;

  saveHistory(c);
}

function doseDisplay(c){
  return `${fmt(c.dose)} ${state.doseUnit==='ui'?'UI':state.doseUnit}`;
}

function resultText(c){
  return `Calculadora de Doses de Peptídeos

Frasco: ${fmt(c.vialMg)} mg
Diluente: ${fmt(c.diluent)} mL
Seringa: U-100 ${state.syringeMaxUi} UI
Dose desejada: ${doseDisplay(c)}
Concentração: ${fmt(c.concentrationMgMl,3)} mg/mL
Puxe até: ${fmtUi(c.ui)} UI
Equivale a: ${fmt(c.ml,3)} mL | ${fmt(c.doseMg,3)} mg | ${fmt(c.doseMcg,1)} mcg
Doses aproximadas no frasco: ${fmt(c.count,2)}`;
}

let historyTimer;
function saveHistory(c){
  clearTimeout(historyTimer);
  historyTimer=setTimeout(()=>{
    const key='peptideDoseHistory';
    let list=[];
    try{list=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
    const item={
      vial:c.vialMg,
      diluent:c.diluent,
      dose:doseDisplay(c),
      ui:c.ui,
      time:Date.now()
    };
    const sig=`${item.vial}|${item.diluent}|${item.dose}|${fmtUi(item.ui)}`;
    list=list.filter(x=>`${x.vial}|${x.diluent}|${x.dose}|${fmtUi(x.ui)}`!==sig);
    list.unshift(item);
    list=list.slice(0,5);
    localStorage.setItem(key,JSON.stringify(list));
    renderHistory();
  },450);
}

function renderHistory(){
  const root=$('historyList');
  let list=[];
  try{list=JSON.parse(localStorage.getItem('peptideDoseHistory')||'[]')}catch{}
  if(!list.length){
    root.innerHTML='<p class="history-empty">Nenhum cálculo salvo ainda.</p>';
    return;
  }
  root.innerHTML=list.map(x=>`
    <div class="history-item">
      <div>
        <b>${fmt(x.vial)} mg + ${fmt(x.diluent)} mL</b>
        <small>Dose ${x.dose}</small>
      </div>
      <strong>${fmtUi(x.ui)} UI</strong>
    </div>
  `).join('');
}

function clearAll(){
  state.vialMg=null;
  state.vialCustom=false;
  state.diluentMl=null;
  state.diluentCustom=false;
  state.syringeMaxUi=30;
  state.doseUnit='mg';
  state.doseValue=null;

  $('vialOther').value='';
  $('diluentOther').value='';
  $('doseInput').value='';
  $('vialOtherWrap').classList.add('hidden');
  $('diluentOtherWrap').classList.add('hidden');
  $('doseSuffix').textContent='mg';

  document.querySelectorAll('#doseUnitSelector .seg').forEach(b=>{
    b.classList.toggle('active',b.dataset.unit==='mg');
  });

  renderVials();
  renderDiluents();
  renderSyringes();
  renderDoseChips();
  drawScale(30);
  calculate();
}

function toast(msg){
  const el=$('toast');
  el.textContent=msg;
  el.classList.add('show');
  clearTimeout(toast.t);
  toast.t=setTimeout(()=>el.classList.remove('show'),1800);
}

$('vialOther').addEventListener('input',()=>{
  state.vialMg=num($('vialOther').value);
  calculate();
});

$('diluentOther').addEventListener('input',()=>{
  state.diluentMl=num($('diluentOther').value);
  calculate();
});

$('doseInput').addEventListener('input',()=>{
  state.doseValue=num($('doseInput').value);
  renderDoseChips();
  calculate();
});

document.querySelectorAll('#doseUnitSelector .seg').forEach(b=>{
  b.addEventListener('click',()=>{
    state.doseUnit=b.dataset.unit;
    state.doseValue=null;
    $('doseInput').value='';
    $('doseSuffix').textContent=state.doseUnit==='ui'?'UI':state.doseUnit;
    document.querySelectorAll('#doseUnitSelector .seg').forEach(x=>x.classList.toggle('active',x===b));
    renderDoseChips();
    calculate();
  });
});

$('copyBtn').addEventListener('click',async()=>{
  const c=getCalc();
  if(!c) return toast('Preencha os dados primeiro.');
  try{
    await navigator.clipboard.writeText(resultText(c));
    toast('Resultado copiado.');
  }catch{
    toast('Não foi possível copiar.');
  }
});

$('whatsappBtn').addEventListener('click',()=>{
  const c=getCalc();
  if(!c) return toast('Preencha os dados primeiro.');
  window.open(`https://wa.me/?text=${encodeURIComponent(resultText(c))}`,'_blank','noopener');
});

$('clearBtn').addEventListener('click',clearAll);

$('clearHistoryBtn').addEventListener('click',()=>{
  localStorage.removeItem('peptideDoseHistory');
  renderHistory();
  toast('Histórico limpo.');
});

renderVials();
renderDiluents();
renderSyringes();
renderDoseChips();
renderHistory();
drawScale(30);
calculate();
