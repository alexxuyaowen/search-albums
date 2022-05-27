const userInput = new URLSearchParams(window.location.search).get("search");

const albums =document.getElementById("albums");
const searchIcon = document.getElementById("search-icon");

let resultInfo = document.getElementById("result-info");




fetchJsonp(`https://itunes.apple.com/search?term=${userInput}&media=music&entity=album&attribute=artistTerm&limit=200`)
.then(res => res.json())
.then(data => {
  resultInfo.innerHTML = `${data.resultCount} results for "${userInput}"`;

  data.results.forEach(e => albums.innerHTML += `<div class="album">
    <img src=${e.artworkUrl100} class="cover-pic">
    <p class="collection-name">${e.collectionName}</p>
  </div>`);

})
