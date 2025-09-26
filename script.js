// Inicializace mapy
const map = L.map('map').setView([50.087, 14.42], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

// Seznam míst
const places = [
  { id:'hrad', title:'Pražský hrad', lat:50.0903, lng:14.3989,
    video:'0fCOJPyp2C4',
    audio:'audio/hrad.mp3',
    readUrl:'https://www.pragtourist.cz/prager-burg/'
  },
  { id:'staromak', title:'Staroměstské náměstí', lat:50.087, lng:14.420,
    video:'0fCOJPyp2C4',
    audio:'audio/staromak.mp3',
    readUrl:'https://www.pragtourist.cz/altstadtplatz/'
  },
  { id:'karluvmost', title:'Karlův most', lat:50.0864, lng:14.4114,
    video:'0fCOJPyp2C4',
    audio:'audio/most.mp3',
    readUrl:'https://www.pragtourist.cz/karluv-most/'
  }
];

// Přidání markerů
places.forEach(place => {
  const marker = L.marker([place.lat, place.lng]).addTo(map);
  marker.on('click', () => openPopup(place));
});

// Funkce pro otevření popupu
function openPopup(place) {
  const popupOverlay = document.createElement("div");
  popupOverlay.className = "popup-overlay";

  const popupContent = document.createElement("div");
  popupContent.className = "popup-content";

  popupContent.innerHTML = `
    <button class="popup-close">✖</button>
    <div class="popup-tabs">
      <button class="tab-btn active" data-tab="video">Video</button>
      <button class="tab-btn" data-tab="text">Mehr lesen</button>
      <button class="tab-btn" data-tab="audio">Audio</button>
    </div>

    <div class="tab-content video-tab">
      <iframe src="https://www.youtube.com/embed/${place.video}" allowfullscreen></iframe>
    </div>

    <div class="tab-content text-tab" style="display:none;">
      <iframe src="${place.readUrl}" frameborder="0"></iframe>
    </div>

    <div class="tab-content audio-tab" style="display:none;">
      <audio controls>
        <source src="${place.audio}" type="audio/mpeg">
        Tvůj prohlížeč nepodporuje přehrávání audia.
      </audio>
    </div>
  `;

  popupOverlay.appendChild(popupContent);
  document.body.appendChild(popupOverlay);

  // zavírací tlačítko
  popupContent.querySelector(".popup-close").addEventListener("click", () => popupOverlay.remove());

  // přepínání záložek
  const buttons = popupContent.querySelectorAll(".tab-btn");
  const videoFrame = popupContent.querySelector(".video-tab iframe");
  const textFrame = popupContent.querySelector(".text-tab iframe");
  const audioPlayer = popupContent.querySelector("audio");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      popupContent.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");

      if (btn.dataset.tab === "video") {
        popupContent.querySelector(".video-tab").style.display = "block";
        audioPlayer.pause();
        videoFrame.src = `https://www.youtube.com/embed/${place.video}`;
      } else if (btn.dataset.tab === "text") {
        popupContent.querySelector(".text-tab").style.display = "block";
        videoFrame.src = "";
        audioPlayer.pause();
      } else if (btn.dataset.tab === "audio") {
        popupContent.querySelector(".audio-tab").style.display = "block";
        videoFrame.src = "";
        audioPlayer.play();
      }
    });
  });
}

// Finde mich tlačítko
document.getElementById("findMeBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 16);
      L.circleMarker([latitude, longitude], { radius: 8, color: "blue" }).addTo(map);
    });
  } else {
    alert("Geolokace není podporována vaším zařízením.");
  }
});
