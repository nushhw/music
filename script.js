// === script.js (YouTube Embed Version) ===
const playerEmbed = document.getElementById("playerEmbed");
const folderName = document.getElementById("folderName");
const trackGrid = document.getElementById("trackGrid");
const nowPlaying = document.getElementById("nowPlaying");

let myPlaylist = [];

const library = {
  "Item Asylum": [
    { name: "Baseplate by Aden Mayo", file: "b2KdyuqGMkc" },
    { name: "The Great Strategy", file: "QC4UKsoQqyY" }
  ],
  "Lofi": [
    { name: "Study Lofi", file: "NsImQYDW8IA" },
    { name: "Cycerin - Winterbliss", file: "FvfF2c1amLY" },
    { name: "Soothing Piano", file: "7maJOI3QMu0" }
  ],
  "Favorites": [
    { name: "Dance of the Violins", file: "1fu3Q1giB94" },
    { name: "Paper Rings", file: "exampleAudioId" },
    { name: "Fjord of Winds", file: "scI3AwqLAHA" },
    { name: "Chess Type Beat", file: "JikhhOsY8KQ" }
  ],
  "Kirby/Remix": [
    { name: "Waluigi Pinball", file: "GdaX5iX0ZaU" }
  ],
  "Unavailable": [
    { name: "IMTTJ", file: "" },
    { name: "I'm always mean to the jews", file: "" }
  ],
  "Hidden": [
    { name: "BITE ME", file: "exampleHiddenId" }
  ]
};

function loadFolder(folder) {
  const menuBtn = document.querySelector(`.folder[data-list="${folder}"]`);
  let activeFolders = document.querySelectorAll(".folder.active");
  for (btn of activeFolders) {
    btn.classList.remove("active");
  }
  menuBtn.classList.add("active");
  
  folderName.textContent = folder;
  trackGrid.innerHTML = "";
  const folderImage = document.getElementById("folderImage");
  if (folderImage) folderImage.style.display = "none";

  const tracks = folder === "🎿 My Playlist" ? myPlaylist : (library[folder] || []);

  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "track";
    card.style.position = "relative";

    const title = document.createElement("div");
    title.innerText = track.name;

    const menuBtn = document.createElement("div");
    menuBtn.innerText = "⋮";
    menuBtn.style.cssText = "float: right; cursor: pointer; font-size: 20px;";

    const menu = document.createElement("div");
    menu.className = "menu";
    menu.style.cssText = `
      display: none;
      position: absolute;
      top: 30px;
      right: 10px;
      background: #222;
      color: #fff;
      padding: 6px 12px;
      border: 1px solid #555;
      border-radius: 6px;
      z-index: 999;
      box-shadow: 0 0 10px #000;
    `;

    if (folder !== "🎿 My Playlist") {
      menu.innerHTML = "<div class='menu-add' style='cursor:pointer;'>Add to My Playlist</div>";
      menu.querySelector(".menu-add").onclick = () => {
        myPlaylist.push(track);
        alert(`✅ Added \"${track.name}\" to your playlist!`);
        menu.style.display = "none";
      };
    }

    menuBtn.onclick = (e) => {
      e.stopPropagation();
      document.querySelectorAll('.menu').forEach(m => m.style.display = "none");
      menu.style.display = "block";
    };

    card.onclick = () => {
      if (!track.file) {
        alert("❌ This track isn't downloaded yet.");
        return;
      }
      playerEmbed.style.display = "block";
      playerEmbed.src = `https://www.youtube.com/embed/${track.file}?autoplay=1&controls=0`;
      nowPlaying.textContent = "🎶 Now playing: " + track.name;
    };

    card.appendChild(title);
    card.appendChild(menuBtn);
    card.appendChild(menu);
    trackGrid.appendChild(card);
  });
}

document.addEventListener("click", () => {
  document.querySelectorAll('.menu').forEach(m => m.style.display = "none");
});
