// === script.js ===
const player = document.getElementById("player");
const folderName = document.getElementById("folderName");
const trackGrid = document.getElementById("trackGrid");
const nowPlaying = document.getElementById("nowPlaying");

let myPlaylist = [];

const library = {
  "Item Asylum": [
    { name: "Baseplate by Aden Mayo", file: "music/Baseplate by Aden Mayo.mp3" },
    { name: "The Great Strategy", file: "music/The Great Strategy.mp3" },
    { name: "Filibuster Invasion Theme", file: "" }
  ],
  "Lofi": [
    { name: "Study Lofi", file: "music/lofi hip hop mix radio-beat to relax⧸study too[10 min] [NsImQYDW8IA].mp4" },
    { name: "Cycerin - Winterbliss", file: "music/Cycerin - Winterbliss.mp3" },
    { name: "Soothing Piano", file: "music/The Most Beautiful & Relaxing Piano Pieces (Vol. 1) [WJ3-F02-F_Y].f616.mp4" }
  ],
  "Favorites": [
    { name: "Dance of the Violins", file: "music/F-777 - Dance of The Violins [1fu3Q1giB94].mp4" },
    { name: "Empire (slowed)", file: "music/Empire slowed.mp3" },
    { name: "Paper Rings", file: "music/Taylor Swift - Paper Rings (Official Audio).mp3" },
    { name: "Fjord of Winds", file: "music/Fjord of Winds.mp3" },
    { name: "Chess Type Beat", file: "music/Chess Type Beat.mp3" }
  ],
  "Kirby/Remix": [
    { name: "Meta Knight Battle Remake", file: "music/Meta Knight Battle Remake.mp3" },
    { name: "Kirby - Gourmet Race Remix", file: "music/Kirby - Gourmet Race remix.mp3" },
    { name: "Waluigi Pinball", file: "music/Waluigi pinball.mp3" }
  ],
  "Unavailable": [
    { name: "IMTTJ", file: "" },
    { name: "I'm always mean to the jews", file: "" }
  ],
  "🎿 My Playlist": myPlaylist
};

function loadFolder(folder) {
  folderName.textContent = folder;
  trackGrid.innerHTML = "";

  const tracks = folder === "🎿 My Playlist" ? myPlaylist : library[folder];

  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "track";

    const title = document.createElement("div");
    title.innerText = track.name;

    const menuBtn = document.createElement("div");
    menuBtn.innerText = "⋮";
    menuBtn.style.cssText = "float: right; cursor: pointer; font-size: 20px;";

    const menu = document.createElement("div");
    menu.style.cssText = "display: none; position: absolute; background: #222; color: #fff; padding: 6px; border: 1px solid #555; border-radius: 5px; z-index: 999;";

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
      menu.style.left = e.pageX + "px";
      menu.style.top = e.pageY + "px";
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
    card.classList.add("menu");
    trackGrid.appendChild(card);
  });
}

document.addEventListener("click", () => {
  document.querySelectorAll('.menu').forEach(m => m.style.display = "none");
});
