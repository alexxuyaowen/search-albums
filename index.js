const urlParams = new URLSearchParams(window.location.search);
const userInput = urlParams.get("search");
const limitTemp = urlParams.get("limit");
let limit = limitTemp ? +limitTemp : 5;

const resultInfo = document.getElementById("result-info");
const loader = document.querySelector('.loader');
const albums = document.getElementById("albums");

let albumsArr = new Array();
let resultCount;

if (userInput !== null) {
  isLoading(true);

  fetchJsonp(`https://itunes.apple.com/search?term=${userInput}&media=music&entity=album&attribute=artistTerm&limit=200`)
    .then(res => res.json())
    .then(data => {
      isLoading(false);

      albumsArr = [...data.results];
      resultCount = data.resultCount;

      render();
    })
}

// animations while loading
function isLoading(state) {
  if (state) {
    resultInfo.style.display = "none";
    loader.style.display = "inline";
    document.body.style.cursor = "wait";
    loadMore.style.display = "none";
  } else {
    resultInfo.style.display = "inline";
    loader.style.display = "none";
    document.body.style.cursor = "default";
    loadMore.style.display = "block";
  }
}

// format an album into HTML
function albumHTML(e, id) {
  return `<div class="album">
            <img onclick="detail(${id})" src=${e.artworkUrl100} class="cover-pic">
            <p onclick="detail(${id})" class="collection-name">${e.collectionName.length > 42 ? e.collectionName.substring(0, 42)+"..." : e.collectionName}</p>
          </div>`
}

// load the albums
function render() {
  limit = Math.min(resultCount, limit);
  window.history.pushState({page: 0}, `${limit}`, `?search=${userInput}&limit=${limit}`);
  resultInfo.innerHTML = `${limit}/${resultCount} results for "${userInput}"`;
  albums.innerHTML = albumsArr.slice(0, limit).map((e, id) => albumHTML(e, id)).join("");

  if (limit === resultCount) {
    loadMore.style.display = "none";
  }
}

// load 5 more albums on interaction
document.getElementById("loadMore").addEventListener('click', () => {
  limit += 5;
  render();
})

// go to the detail page for an album on click
function detail(i) {
  const link = albumsArr[i].collectionViewUrl;

  window.open(link.substring(0, link.length-5), "_blank").focus(); // filter out the "?uo=4" at the end of the link, which may cause problems
}

// widen searchbar on focus
document.getElementById("user-input").addEventListener('focus', () => document.querySelector(".search-bar").style.width = "50%", true);
// document.querySelector("#user-input").addEventListener('blur', () => document.querySelector(".search-bar").style.width = "35%", true);
// window.addEventListener('click', e => console.log(e.target));

