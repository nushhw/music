// === script.js ===
const player = document.getElementById("player");
const folderName = document.getElementById("folderName");
const trackGrid = document.getElementById("trackGrid");
const nowPlaying = document.getElementById("nowPlaying");

let myPlaylist = [];

const library = {
  "Item Asylum": [
    { name: "Baseplate by Aden Mayo", file: "music/Baseplate - Item Asylum [b2KdyuqGMkc].mp4" },
    { name: "The Great Strategy", file: "music/The Great Strategy (2005) Roblox Theme 2006 [QC4UKsoQqyY].mp4" },
  ],
  "Lofi": [
    { name: "Study Lofi", file: "music/lofi hip hop mix radio-beat to relax⧸study too[10 min] [NsImQYDW8IA].mp4" },
    { name: "Cycerin - Winterbliss", file: "music/cycerin - Winterbliss [FvfF2c1amLY].mp4" },
    { name: "Soothing Piano", file: "The Most Beautiful & Relaxing Piano Pieces (Vol. 1) [WJ3-F02-F_Y].f616.mp4.part" }
  ],
  "Favorites": [
    { name: "Dance of the Violins", file: "music/F-777 - Dance of The Violins [1fu3Q1giB94].mp4" },
    { name: "Paper Rings", file: "music/Taylor Swift - Paper Rings (Official Audio).mp3" },
    { name: "Fjord of Winds", file: "music/Fjord of Winds (Metal Remix) [scI3AwqLAHA].mp4" },
    { name: "Chess Type Beat", file: "Chess Type Beat ｜ joyful - chess (slowed) [JikhhOsY8KQ].mp4" }
  ],
  "Kirby/Remix": [
    { name: "Waluigi Pinball", file: "music/DS Wario Stadium ⧸ DS Waluigi Pinball - Mario Kart 8 Deluxe OST [GdaX5iX0ZaU].mp4" }
  ],
  "Unavailable": [
    { name: "IMTTJ", file: "" },
    { name: "I'm always mean to the jews", file: "" }
  ],
  "Hidden": [
    { name: "BITE ME", file: "music/3_BM.mpeg" } // do not remove this entry
  ]
};

function loadFolder(folder) {
  folderName.textContent = folder;
  trackGrid.innerHTML = "";

  const tracks = folder === "🎿 My Playlist" ? myPlaylist : (library[folder] || []);

  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "track";
    card.style.position = "relative"; // Anchor for menu

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
        alert(`✅ Added "${track.name}" to your playlist!`);
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
      player.src = track.file;
      player.play();
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
