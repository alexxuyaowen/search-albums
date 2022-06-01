const userInput = new URLSearchParams(window.location.search).get("search");

const limitTemp = new URLSearchParams(window.location.search).get("limit");
let limit = limitTemp ? +limitTemp : 5;

const resultInfo = document.getElementById("result-info");
const loader = document.querySelector('.loader');
const albums = document.getElementById("albums");
const loadMore = document.getElementById("loadMore");

const albumsArr = new Array();

let resultCount;
let dataResults = new Array();

if (userInput !== null) {
  window.history.pushState({page: 0}, `${limit}`, `?search=${userInput}&limit=${limit}`);

  resultInfo.style.display = "none";
  loader.style.display = "inline";
  document.body.style.cursor = "wait";
  loadMore.style.display = "none";

  fetchJsonp(`https://itunes.apple.com/search?term=${userInput}&media=music&entity=album&attribute=artistTerm&limit=200`)
    .then(res => res.json())
    .then(data => {
      

      resultInfo.style.display = "inline";
      loader.style.display = "none";
      document.body.style.cursor = "default";
      loadMore.style.display = "block";

      dataResults = [...data.results];
      resultCount = data.resultCount;

      for (let i = 0; i < Math.min(resultCount, limit); i++) {
        albumsArr.push(data.results[i])
      }

      resultInfo.innerHTML = `${albumsArr.length}/${resultCount} results for "${userInput}"`;

      albums.innerHTML = albumsArr.map(e => albumHTML(e)).join("");

      if (limit >= resultCount) {
        loadMore.style.display = "none";
      }
    })
}

function albumHTML(e) {
  return `<div class="album ${e.collectionId}" id=${e.collectionId}>
            <img src=${e.artworkUrl100} class="cover-pic ${e.collectionId}">
            <p class="collection-name ${e.collectionId}">${e.collectionName}</p>
          </div>`
}

loadMore.addEventListener('click', () => {
    for (let i = limit; i < Math.min(resultCount, limit+5); i++) {
      albumsArr.push(dataResults[i])
    }

    limit += 5;

    resultInfo.innerHTML = `${albumsArr.length}/${resultCount} results for "${userInput}"`;

    albums.innerHTML = albumsArr.map(e => albumHTML(e)).join("");

    window.history.pushState({page: 0}, `${limit}`, `?search=${userInput}&limit=${limit}`)

    if (limit >= resultCount) {
      loadMore.style.display = "none";
    }

})

// hide an album on click
// albums.addEventListener('click', e => {
//   const id = e.target.className.split(" ")[1];
  
//   if (id) {
//     count--;
//     document.getElementById(id).style.display = "none";
//     resultInfo.innerHTML = `${count} results for "${userInput}"`;
//   }
// });

// widen searchbar on focus
document.getElementById("user-input").addEventListener('focus', () => document.querySelector(".search-bar").style.width = "50%", true);
// document.querySelector("#user-input").addEventListener('blur', () => document.querySelector(".search-bar").style.width = "35%", true);

// window.addEventListener('click', e => console.log(e.target));


// delete an album on click 
// albums.addEventListener('click', e=> {
//   const target = Number(e.target.className.split(" ")[1]);
//   console.log(target)

//   fetchJsonp(`https://itunes.apple.com/search?term=${userInput}&media=music&entity=album&attribute=artistTerm&limit=200`)
//     .then(res => res.json())
//     .then(data => {
//       console.log(albumArr);
//       albumArr.filter(e => e.collectionId !== target);
//       console.log(albumArr);
//       albums.innerHTML = albumArr.map(e => albumHTML(e)).join("");
//       resultInfo.innerHTML = `${albumArr.length} results for "${userInput}"`;
//     });
// })