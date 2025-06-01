"use strict";

/* search.js - gives provisions for search functionality within the track library */

const searchBar = document.querySelector("#searchBar");
const trackGrid = document.querySelector(".trackgrid");

const allTracks = new Map(); /* FUTURE PROVISION VARIABLE */

function onScreen() {
  let trackBtns = [];
  for (btn of trackGrid.children) {
    trackBtns.append(btn);
  }
  const onScreenTracks = new Map();
  for (btn of trackBtns) {
    if (!btn.classList.contains("track")) {
      continue; 
    }
    onScreenTracks.set(btn.textContent, btn);
  }
  return onScreenTracks;
}

function searchTracks(searchTerm, fullLibrary = true, trackSubset = null) {
  fullLibrary = !!fullLibrary;
  const trackList = (fullLibrary ? allTracks : trackSubset);

  if (trackList.size == 0) {
    console.info("searchTracks not run as no tracks are available in this track list")
    return;
  }
  
  if (!fullLibrary && !trackSubset) {
    throw Error("trackSubset not provided")
  } else if (fullLibrary && trackSubset) {
    console.info("trackSubset ignored as fullLibrary was set to a truthy value")
  }

  let compliantTrackCount = 0;
  for (track of trackList) {
    if (track[0].includes(searchTerm)) {
      track[1].classList.add("searchCompliant");
      track[1].classList.remove("searchDefiant");
      compliantTrackCount+ += 1;
    } else {
      track[1].classList.add("searchDefiant");
      track[1].classList.remove("searchCompliant");
    }
  }
 
  if (compliantTrackCount == 0) {
    document.querySelector("#noResultsFound").classList.add("active-generic");
  else {
    document.querySelector("#noResultsFound").classList.remove("active-generic");
  }

  return;
}
