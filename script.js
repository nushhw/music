// === script.js ===
const player = document.querySelector("#player");
const folderName = document.querySelector("#folderName");
const trackGrid = document.querySelector("#trackGrid");
const nowPlaying = document.querySelector("#nowPlaying");
const sidebar = document.querySelector(".sidebar");
const playBtn = document.querySelector("#playBtn");
const playProgBar = document.querySelector(".player-prog-bar");
const playTime = document.querySelector("#player-time");
const playDur = document.querySelector("#player-duration");
const sidebarCtrl = document.querySelector("#mobile-sidebar-controller");

let objUrl = ""; // ObjectURL of the Blob audio

const secToFull = function(secs) {
  const hrs = Math.floor(secs / 3600);
  const mins = Math.floor((secs - (hrs * 60)) / 60);
  secs = Math.floor(secs - (mins * 60) - (hrs * 3600));
  if (hrs) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  } else {
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
};

const playAudio = function() {
  player.play();
  playBtn.classList.add("display-pause");
}
const pauseAudio = function() {
  player.pause();
  playBtn.classList.remove("display-pause");
}

let myPlaylist = [];

/* const library = {
  "categories": {
    "1": {
      "name": "Item Asylum",
      "defaultHidden": false
    },
    "2": {
      "name": "Lofi",
      "defaultHidden": false
    },
    "3": {
      "name": "Favorites",
      "defaultHidden": false
    },
    "4": {
      "name": "Kirby/Remix",
      "defaultHidden": false
    },
    "5": {
      "name": "Murder Drones",
      "defaultHidden": true,
      "mainArtist": ["AJ DiSpirito"]
    },
    "6": {
      "name": "TADC",
      "defaultHidden": true,
      "mainArtist": ["Gooseworx", "Evan Alderete"]
    },
    "unsupported": {
      "name": "Currently Unavailable",
      "defaultHidden": true,
      "forcedHidden": true
    }
  },
  "library": {
    "Item Asylum": [
      { name: "Baseplate by Aden Mayo", id: "1", numId: 1, file: "mp4", cat: [1] },
      { name: "The Great Strategy", id: "2", numId: 2, file: "mp4", cat: [1] },
    ],
    "Lofi": [
      { name: "Study Lofi", id: "3", numId: 3, file: "mp4", cat: [2] },
      { name: "Cycerin - Winterbliss", id: "4", numId: 4, file: "mp4", cat: [2] },
      /*{ name: "Soothing Piano", id: "5", numId: 5, file: "part", cat: [2] }* /
    ],
    "Favorites": [
      { name: "Dance of the Violins", id: "6", numId: 6, file: "mp4", cat: [3] },
      { name: "Paper Rings", id: "7", numId: 7, file: "mp3", cat: [3] },
      { name: "Fjord of Winds", id: "8", numId: 8, file: "mp4", cat: [3] },
      { name: "Chess Type Beat", file: "mp4", cat: [3] }
    ],
    "Kirby/Remix": [
      { name: "Waluigi Pinball", id: "10", numId: 10, file: "mp4", cat: [4] }
    ],
    "Unavailable": [
      { name: "IMTTJ", file: "", notReady: true, cat: ["unsupported"] },
      { name: "I'm always mean to the jews", file: "", notReady: true, cat: ["unsupported"] }
    ],
    "Hidden": [
      { name: "BITE ME", id: "0", numId: 0, file: "music/3_BM.mpeg", cat: [5] } /* do not remove this entry * /
    ]
  }
}; */

let jsonLibrary = null;
let fetchConcluded = false;
let fetchError = null;

fetch("./library.json")
  .catch((reject) => {
    alert("Sorry, network error. Library cannot be fetched.");
    throw new Error("Fetch error");
  })
  .then((result) => {
    return result.json();
  })
  .catch((reject) => {
    if (reject.message === "Fetch error") {
      throw reject;
    }
    alert("Sorry, file error. Library cannot be fetched.");
    throw new Error("JSON file error");
  })
  .then((result) => {
    jsonLibrary = result;
    fetchConcluded = true;

    // Add stuff to sidebar
    console.log(jsonLibrary);
    for (let [catId, catDetail] of Object.entries(jsonLibrary.categories)) {
      if (!catDetail.defaultHidden) {
        let sidebarItem = document.createElement("div");
        sidebarItem.classList.add("folder");
        let sidebarItemLabel = document.createElement("span");
        sidebarItemLabel.classList.add("sidebar-item-label");
        sidebarItemLabel.append(catDetail.name);
        sidebarItem.append(sidebarItemLabel);
        sidebarItem.addEventListener("click", function() {
          loadFolder(catId);
        });

        let logoBox = document.createElement("span");
        logoBox.classList.add("sidebar-logo");
        console.log(catDetail.logo);
        if (catDetail.logo.char) {
          let logoChar = document.createElement("span");
          logoChar.classList.add("sidebar-logo-char");
          logoChar.append(catDetail.logo.char);
          logoBox.append(logoChar);
        } else if (catDetail.logo.url) {
          let logoImg = document.createElement("img");
          logoImg.classList.add("sidebar-logo-img");
          logoImg.setAttribute("src", catDetail.logo.url);
          logoBox.append(logoImg);
        } else {
          logoBox.innerHTML = "&nbsp;";
        }

        sidebarItem.prepend(logoBox);

        sidebar.append(sidebarItem);
      }
    }
  })
  .catch((reject) => {
    fetchError = reject;
    fetchConcluded = true;
  });

function loadFolder(folderID) {
  folderID = folderID.toString();
  trackGrid.innerHTML = "";

  let category = jsonLibrary.categories[folderID];
  if (!category) {
    alert("Category not found")
    return false;
  }
  let catName = category.name || `Category <${folderID}>`;
  folderName.textContent = catName;

  let catTracks = jsonLibrary.tracks.filter((track) => track.cat.some((id) => id.toString() === folderID));

  catTracks.forEach(track => {
    const card = document.createElement("div");
    card.classList.add("track");

    const title = document.createElement("div");
    title.classList.add("track-title");
    title.innerHTML = "&nbsp;";
    title.append(track.name); // prevent XSS

    const artist = document.createElement("div");
    artist.classList.add("track-artist");
    let artistText = (track.mainArtist?.join(", ") || category.mainArtist?.join(", ") || "");
    let featText = (track.featArtist?.join(", ") || category.featArtist?.join(", ") || "");
    if (featText) {
      featText = `(ft. ${featText})`;
    }
    artist.innerHTML = "&nbsp";
    artist.append(`${artistText} ${featText}`);

    const menuBtn = document.createElement("div");
    menuBtn.innerText = "⋮";
    menuBtn.style.cssText = "float: right; cursor: pointer; font-size: 20px;";

    const menu = document.createElement("div");
    menu.style.cssText = "display: none; position: absolute; background: #222; color: #fff; padding: 6px; border: 1px solid #555; border-radius: 5px; z-index: 999;";

    if (folderID !== "🎿 My Playlist") {
      menu.innerHTML = "<div class='menu-add' style='cursor:pointer;'>Add to My Playlist</div>";
      menu.querySelector(".menu-add").onclick = () => {
        myPlaylist.push(track);
        alert(`✅ Added \"${track.name}\" to your playlist!`);
        menu.style.display = "none";
      };
    }

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll('.menu').forEach(m => m.style.display = "none");
      menu.style.display = "block";

      const rect = menuBtn.getBoundingClientRect();
      menu.style.position = "absolute";
      menu.style.left = rect.left + "px";
      menu.style.top = rect.bottom + "px";
    });


    card.onclick = () => {
      if (track.notReady) {
        alert("❌ This track isn't downloaded yet.");
        return;
      }

      const srcLink = `./tracks/Tk${track.id}.${track.file.split(".").findLast(()=>true)}`;
      
      playBtn.classList.add("loading-btn");

      fetch(srcLink)
        .catch((reject) => {
          alert("Sorry, network error. Audio cannot be fetched.");
          throw new Error("Fetch error");
        })
        .then((result) => {
          console.log(result);
          if (!result.ok) {
            alert(`Sorry, file cannot be found, HTTP ${result.status} ${result.statusText}. Audio cannot be fetched.`);
            throw new Error("HTTP error");
          }
          console.log("Received fetch result, running blob() (this may take a while)...");
          return result.blob();
        })
        .catch((reject) => {
          if (reject.message === "Fetch error" || reject.message === "HTTP error") {
            throw reject;
          }
          alert("Sorry, file error. Audio cannot be fetched.");
          throw new Error("Audio file error");
        })
        .then((result) => {
          console.log(result);
          console.log("Received blob...");
          if (result.size === 0) {
            alert("Sorry, blob error. Audio cannot be fetched.")
            throw new Error("Blob error");
          }
          nowPlaying.textContent = "🎶 " + track.name;
          nowPlaying.classList.remove("not-playing");
          if (objUrl) URL.revokeObjectURL(objUrl);
          objUrl = URL.createObjectURL(result);
          console.log(objUrl);
          player.pause();
          player.src = objUrl;
          player.pause();
          
          playDur.textContent = secToFull(player.duration);
          player.currentTime = 0;
          playTime.textContent = secToFull(0);
          playProgBar.style.backgroundImage = "linear-gradient(to right, var(--accent-color) 0% 0%, #999999 0% 100%)";
          
          playBtn.classList.remove("loading-btn");
          
          playAudio();
          return true;
        })
        .catch((reject) => {
          console.error(reject);
          playBtn.classList.remove("loading-btn");
          return false;
        });
    };

    card.appendChild(title);
    card.appendChild(artist);
    card.appendChild(menuBtn);
    card.appendChild(menu);
    menu.classList.add("menu");
    trackGrid.appendChild(card);

    sidebar.classList.remove("mobile-visible");
  });
}

document.addEventListener("click", () => {
  document.querySelectorAll('.menu').forEach(m => m.style.display = "none");
});

sidebarCtrl.addEventListener("click", function() {
  sidebar.classList.toggle("mobile-visible");
});

playBtn.addEventListener("click", function() {
  if (!player.src) return false;

  if (player.paused) playAudio();
  else pauseAudio();
})

setInterval(function() {
  if (!player.src) return;
  const currTime = player.currentTime;
  const durTime = player.duration;
  playTime.textContent = secToFull(currTime);
  playDur.textContent = secToFull(durTime);
  const timePercent = currTime / durTime * 100;
  playProgBar.style.backgroundImage = `linear-gradient(to right, var(--accent-color) 0% ${timePercent}%, #999999 ${timePercent}% 100%)`;
  if (player.paused) {
    playBtn.classList.remove("display-pause");
  } else {
    playBtn.classList.add("display-pause");
  }
}, 500);