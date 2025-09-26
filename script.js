/* ---------- Inicializace mapy ---------- */
const map = L.map('map', {preferCanvas:true}).setView([50.087,14.420], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

/* ---------- data bodů (hlavní + zkušební) ----------
 - video: pouze YouTube ID (např. '0fCOJPyp2C4')
 - readUrl: URL na tvé stránce (může být relativní)
----------------------------------------------*/
const pointsData = [
  // hlavní památky (5)
  { id:'hrad',   title:'Pražský hrad',           lat:50.0903, lng:14.3989, category:'sights', video:'0fCOJPyp2C4', audio:'audio/hrad.mp3', readUrl:'https://www.pragtourist.cz/prager-burg/' },
  { id:'stare',  title:'Staroměstské náměstí',   lat:50.0875, lng:14.4212, category:'sights', video:'VIDEO_ID_2', audio:'audio/staromestske.mp3', readUrl:'/detail/staromestske.html' },
  { id:'zid',    title:'Židovská čtvrť',         lat:50.089641,lng:14.417987, category:'sights', video:'VIDEO_ID_3', audio:'audio/zidovska.mp3', readUrl:'/detail/zidovska.html' },
  { id:'most',   title:'Karlův most',            lat:50.0865, lng:14.4125, category:'sights', video:'VIDEO_ID_4', audio:'audio/karluv.mp3', readUrl:'/detail/karluv.html' },
  { id:'vaclav', title:'Václavské náměstí',      lat:50.0810, lng:14.4260, category:'sights', video:'s4nHvs49424', audio:'audio/vaclavske.mp3', readUrl:'/detail/vaclavske.html' },

  // zkušební body: 2 WC
  { id:'wc1', title:'WC - Staroměstská', lat:50.0870, lng:14.4205, category:'toilets', video:'', audio:'', readUrl:'' },
  { id:'wc2', title:'WC - Můstek',      lat:50.0890, lng:14.4170, category:'toilets', video:'', audio:'', readUrl:'' },

  // 3 restaurace
  { id:'r1', title:'Restaurace Lokál', lat:50.0860, lng:14.4230, category:'food', video:'', audio:'', readUrl:'' },
  { id:'r2', title:'Restaurace Mlejnice', lat:50.0840, lng:14.4250, category:'food', video:'', audio:'', readUrl:'' },
  { id:'r3', title:'U Fleků', lat:50.0900, lng:14.4190, category:'food', video:'', audio:'', readUrl:'' },

  // 4 kavárny
  { id:'c1', title:'Café Louvre',      lat:50.0880, lng:14.4230, category:'cafes', video:'', audio:'', readUrl:'' },
  { id:'c2', title:'Můj šálek kávy',   lat:50.0860, lng:14.4190, category:'cafes', video:'', audio:'', readUrl:'' },
  { id:'c3', title:'Café Slavia',      lat:50.0830, lng:14.4260, category:'cafes', video:'', audio:'', readUrl:'' },
  { id:'c4', title:'Kavárna Test',     lat:50.0850, lng:14.4180, category:'cafes', video:'', audio:'', readUrl:'' },

  // 2 směnárny
  { id:'fx1', title:'Směnárna Exchange', lat:50.0875, lng:14.4215, category:'fx', video:'', audio:'', readUrl:'' },
  { id:'fx2', title:'Směnárna Praha City', lat:50.0855, lng:14.4190, category:'fx', video:'', audio:'', readUrl:'' }
];

/* ---------- Kategorie -> marker cluster vrstvy ---------- */
const layers = {
  sights: L.markerClusterGroup({chunkedLoading:true}),
  toilets: L.markerClusterGroup({chunkedLoading:true}),
  food: L.markerClusterGroup({chunkedLoading:true}),
  cafes: L.markerClusterGroup({chunkedLoading:true}),
  fx: L.markerClusterGroup({chunkedLoading:true})
};

/* ikony podle kategorie (můžeš změnit URL ikon) */
function iconFor(cat){
  const base = {iconSize:[30,30], iconAnchor:[15,30], popupAnchor:[0,-28]};
  switch(cat){
    case 'sights': return L.icon(Object.assign({}, base, {iconUrl:'https://cdn-icons-png.flaticon.com/512/854/854878.png'}));
    case 'toilets':return L.icon(Object.assign({}, base, {iconUrl:'https://cdn-icons-png.flaticon.com/512/149/149059.png'}));
    case 'food':   return L.icon(Object.assign({}, base, {iconUrl:'https://cdn-icons-png.flaticon.com/512/3075/3075977.png'}));
    case 'cafes':  return L.icon(Object.assign({}, base, {iconUrl:'https://cdn-icons-png.flaticon.com/512/1384/1384031.png'}));
    case 'fx':     return L.icon(Object.assign({}, base, {iconUrl:'https://cdn-icons-png.flaticon.com/512/2950/2950670.png'}));
    default: return L.icon(Object.assign({}, base, {iconUrl:'https://cdn-icons-png.flaticon.com/512/252/252025.png'}));
  }
}

/* vytvoření markerů z pointsData */
const markersById = {};
pointsData.forEach(p=>{
  const m = L.marker([p.lat,p.lng], {icon: iconFor(p.category)});
  m.on('click', ()=> openOverlayFor(p));
  layers[p.category].addLayer(m);
  markersById[p.id] = m;
});

/* přidat vrstvy do mapy (výchozí zapnuto všechny) */
Object.values(layers).forEach(g => g.addTo(map));

/* control layers (legend/checkbox) */
const overlays = {
  "Památky": layers.sights,
  "Toalety": layers.toilets,
  "Restaurace": layers.food,
  "Kavárny": layers.cafes,
  "Směnárny": layers.fx
};
L.control.layers(null, overlays, {collapsed:false}).addTo(map);

/* ---------- Polyline trasa (Václav -> Hrad) ---------- */
const routeCoords = [
  [50.0810,14.4260], // Václavské
  [50.0855,14.4220], // Na Můstku
  [50.0865,14.4215],
  [50.0875,14.4212], // Staroměstské
  [50.0868,14.4125], // směr Karlův most
  [50.0860,14.4135],
  [50.0868,14.4115],
  [50.0872,14.4105],
  [50.0875,14.4095],
  [50.0880,14.4040],
  [50.0903,14.3989]  // Hrad
];
const poly = L.polyline(routeCoords,{color:'red', weight:4, opacity:0.9}).addTo(map);
map.fitBounds(poly.getBounds(), {padding:[40,40]});

/* ---------- Overlay (popup overlay) ---------- */
const overlayContainer = document.getElementById('overlayContainer');

let globalAudio = null;   // jediný audio element
let currentVideoId = '';  // sledování videa

function openOverlayFor(point){
  // vytvoří DOM overlay
  const html = `
  <div class="eg-overlay" id="egOverlay" role="dialog" aria-modal="true">
    <div class="eg-card">
      <div class="eg-header">
        <div class="eg-title">${point.title}</div>
        <button class="eg-close" id="egCloseBtn" aria-label="Zavřít">✕</button>
      </div>
      <div class="eg-tabs" id="egTabs">
        <div class="eg-tab active" data-tab="video">Video</div>
        <div class="eg-tab" data-tab="read">Mehr Lesen</div>
        <div class="eg-tab" data-tab="audio">Audio</div>
      </div>
      <div class="eg-body">
        <div class="eg-media" id="egMedia">
          <iframe id="egIframe" class="eg-iframe" src="${point.video? 'https://www.youtube.com/embed/'+point.video : ''}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="eg-playermode">
          <button id="egBtnVideo">Video</button>
          <button id="egBtnRead">Mehr Lesen</button>
          <button id="egBtnAudio">Audio</button>
        </div>
        <div class="eg-content" id="egContent">
          <div id="readArea" style="display:none; width:100%; height:100%;"></div>
          <div id="audioArea" style="display:none;">
            <div class="audio-controls">
              <button id="playAudioBtn">▶ Přehrát</button>
              <div id="audioLabel" style="font-weight:600;padding-left:8px;">${point.audio? point.audio: 'Žádné audio'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
  overlayContainer.innerHTML = html;

  // reference
  const egOverlay = document.getElementById('egOverlay');
  const egCloseBtn = document.getElementById('egCloseBtn');
  const tabs = document.querySelectorAll('.eg-tab');
  const btnVideo = document.getElementById('egBtnVideo');
  const btnRead = document.getElementById('egBtnRead');
  const btnAudio = document.getElementById('egBtnAudio');
  const egIframe = document.getElementById('egIframe');
  const readArea = document.getElementById('readArea');
  const audioArea = document.getElementById('audioArea');
  const playAudioBtn = document.getElementById('playAudioBtn');
  const audioLabel = document.getElementById('audioLabel');

  // close
  egCloseBtn.addEventListener('click', closeOverlay);
  egOverlay.addEventListener('click', (e)=> { if(e.target===egOverlay) closeOverlay(); });

  // tab switching (header)
  tabs.forEach(t => t.addEventListener('click', ()=> activateTab(t.dataset.tab, point)));

  // bottom buttons
  btnVideo.addEventListener('click', ()=> activateTab('video', point));
  btnRead.addEventListener('click', ()=> activateTab('read', point));
  btnAudio.addEventListener('click', ()=> activateTab('audio', point));

  // audio play/pause
  let localAudio = null;
  playAudioBtn.addEventListener('click', ()=>{
    // zastav video
    stopVideo(egIframe);
    // Zastav globální audio, pokud běží
    if(globalAudio && !globalAudio.paused){ globalAudio.pause(); globalAudio.currentTime = 0; }
    if(!localAudio){
      if(point.audio){
        localAudio = new Audio(point.audio);
        globalAudio = localAudio;
        localAudio.addEventListener('ended', ()=> { playAudioBtn.textContent='▶ Přehrát'; });
      } else {
        alert('Audio není k dispozici pro toto místo.');
        return;
      }
    }
    if(localAudio.paused){ localAudio.play(); playAudioBtn.textContent='⏸ Pauza'; }
    else { localAudio.pause(); playAudioBtn.textContent='▶ Přehrát'; }
  });

  // initial show video tab
  activateTab('video', point);
}

/* přepínání tabů */
function activateTab(tab, point){
  document.querySelectorAll('.eg-tab').forEach(n=> n.classList.toggle('active', n.dataset.tab===tab));
  // buttons style
  document.getElementById('egBtnVideo').style.opacity = tab==='video'?1:0.85;
  document.getElementById('egBtnRead').style.opacity = tab==='read'?1:0.85;
  document.getElementById('egBtnAudio').style.opacity = tab==='audio'?1:0.85;

  const iframe = document.getElementById('egIframe');
  const readArea = document.getElementById('readArea');
  const audioArea = document.getElementById('audioArea');

  if(tab==='video'){
    // show iframe, hide others
    if(iframe){
      if(!iframe.src || iframe.src===''){ iframe.src = point.video? 'https://www.youtube.com/embed/'+point.video : ''; }
      iframe.style.display = 'block';
    }
    readArea.style.display='none';
    audioArea.style.display='none';
  } else if(tab==='read'){
    // stop video
    stopVideo(iframe);
    // load readUrl into iframe inside readArea
    if(point.readUrl){
      readArea.innerHTML = `<iframe src="${point.readUrl}" style="width:100%;height:100%;border:0"></iframe>`;
    } else {
      readArea.innerHTML = `<div style="padding:8px">Text není k dispozici.</div>`;
    }
    readArea.style.display='block';
    audioArea.style.display='none';
    if(iframe) iframe.style.display='none';
  } else if(tab==='audio'){
    stopVideo(iframe);
    readArea.style.display='none';
    audioArea.style.display='block';
    if(iframe) iframe.style.display='none';
  }
}

/* zastaví video (jednoduché řešení) */
function stopVideo(iframe){
  if(!iframe) return;
  // vyprázdni src -> pauza/reload
  iframe.src = '';
}

/* zavření overlay */
function closeOverlay(){
  // zastavit globální audio
  if(globalAudio && !globalAudio.paused){ globalAudio.pause(); globalAudio.currentTime = 0; }
  overlayContainer.innerHTML = '';
}

/* ---------- Locate: nepřetahovat mapu, jen ukazovat pozici ----------
   - watchPosition používáme pro aktualizaci polohy (marker), ale nepřesouváme mapu
   - tlačítko locateBtn pak při kliknutí centeruje mapu jednorázově
---------------------------------------------------------------*/
const locateBtn = document.getElementById('locateBtn');
let userMarker = null;
if('geolocation' in navigator){
  // watch position for updating marker (no auto center)
  navigator.geolocation.watchPosition((pos)=>{
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    if(userMarker){ userMarker.setLatLng([lat,lon]); }
    else {
      userMarker = L.circleMarker([lat,lon], {radius:8, color:'#136aec', fillColor:'#136aec', fillOpacity:0.9}).addTo(map);
    }
  }, (err)=> {
    console.warn('geolocation watch error', err);
  }, {enableHighAccuracy:true, maximumAge:3000});
} else {
  console.warn('Geolocation not supported');
}

// locate button click -> center map on current position
locateBtn.addEventListener('click', ()=>{
  if(userMarker){
    map.setView(userMarker.getLatLng(), 17);
  } else {
    // try to get one position and center
    navigator.geolocation.getCurrentPosition((pos)=>{
      map.setView([pos.coords.latitude,pos.coords.longitude], 17);
    }, ()=> alert('Nelze získat polohu.'));
  }
});

/* ---------- utility: při velkém počtu bodů lze dynamicky doplnit další položky ---------- */
function addPoint(p){
  pointsData.push(p);
  const m = L.marker([p.lat,p.lng], {icon:iconFor(p.category)});
  m.on('click', ()=> openOverlayFor(p));
  layers[p.category].addLayer(m);
}

/* ---------- hotovo ---------- */
/* Doporučení:
 - nahraj audio soubory do /audio/ a uprav cesty v pointsData
 - uprav video ID v pointsData (pouze ID)
 - použij vlastní ikony v iconFor()
 - pokud chceš "přihlásit" stažení bodů, načítej externí JSON a volat addPoint()
*/


