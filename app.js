const API_KEY= "api_key=c2ef2992f71ecf6a2afa634fdef80f82";
const URL_BASE = "https://api.themoviedb.org/3";
const URL_API = URL_BASE + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const URL_SEARCH = URL_BASE + "/search/movie?" + API_KEY
const IMG_URL = "https://image.tmdb.org/t/p/w500";


const mainElement = document.getElementById("mainDisMov");


const searchBtn =  document.getElementById("logoSearch");
const searchBar = document.getElementById("searchBox");
const searchInput = document.getElementById("inputSearch");
const searchMovie = document.getElementById("loupe");

const pageNext = document.getElementById("next");
const pagePrevious = document.getElementById("previous");
const pageNum = document.getElementById("pageNum");
let currentPage = 1;
let nextPage = 2;
let previousPage = 3;
let lastURL='';
let totalPage = 100;

const FilterCategories = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
]

const tags = document.getElementById("tags");

searchBtn.addEventListener("click", ()=>{
    searchBar.classList.toggle("active");
    searchInput.value = ""
}); 

setFilter();
let SelectedTag = [];
function setFilter(){
    tags.innerHTML="";
    FilterCategories.forEach((cat)=>{
        const tag =  document.createElement("div");
        tag.classList.add("tag");
        tag.id = cat.id;
        tag.textContent= cat.name;
        tag.addEventListener("click", ()=>{
            if (SelectedTag.indexOf(cat.id) === -1) {
                SelectedTag.push(cat.id);
            }
            else{
                SelectedTag.splice(SelectedTag.indexOf(cat.id),1);
            } 
            getMovies(URL_API  + '&with_genres='+encodeURI(SelectedTag.join(',')));
            highlignCategories(); 
            
        });
        
        tags.appendChild(tag);
    });
}

function highlignCategories(){
 
    const allTags = document.querySelectorAll(".tag");
    allTags.forEach((tag)=>{
                tag.classList.remove("highlight");
             });


    if (SelectedTag !== 0){}
        SelectedTag.forEach((id) =>{
            const hightLightCat = document.getElementById(id);
            hightLightCat.classList.add("highlight");
        });

    }



getMovies(URL_API);

function getMovies(url){
    lastURL = url;
    fetch(url).then(resp => resp.json()).then(data => {
        if (data.results.length !== 0){
           displayMovies(data.results);
           
           currentPage = data.page;
           nextPage = currentPage+1;
           previousPage = currentPage-1;
           totalPage = data.total_pages;

           pageNum.innerHTML = currentPage;

            if (currentPage <= 1){
              pagePrevious.classList.add("disable");
              pageNext.classList.remove("disable");
            }
            else if(currentPage === totalPage){ 
              pagePrevious.classList.remove("disable");
              pageNext.classList.add("disable");
            } 
            else{
              pagePrevious.classList.remove("disable");
              pageNext.classList.remove("disable");
            }

         }
        else{
            mainElement.innerHTML =`<h1 style="color:black; margin: 0 auto; height:50px; background-color:white"> NO RESULT !</h1>`
        }
    });
}


function displayMovies(data){

    mainElement.innerHTML = "";

    data.forEach(movie => {

        const {title, poster_path, vote_average, overview} = movie;

        const movieEL = document.createElement("div");
        movieEL.classList.add("movie")
        movieEL.innerHTML = `
                    <img src="${poster_path? IMG_URL+poster_path : "http://via.placeholder.com/1080x1580"}" alt="imgMovie">

                    <div class="movieInfo">
                        <h3>${title}</h3>
                        <span class="${getColor(vote_average)}">${vote_average}</span>
                    </div>

                    <div class="synopsie">
                        <h3>Overview</h3>
                        ${overview}
                    </div>`;

        mainElement.appendChild(movieEL);
    });
}


function getColor(note){
    if (note < 5){
        return "badNoteColor";
    }
    else if (note < 8){
        return "averageNoteColor";
    }
    else
        return "goodNoteColor"
}
                

searchInput.addEventListener("keyup", (e)=>{
    if (e.key === "Enter"){
        const searchItem = searchInput.value;
        
        if (searchItem !==''){
            getMovies(URL_SEARCH + "&query=" + searchItem + "&")
        }
        else{
            getMovies(URL_API);
        }
    }
});


pageNext.addEventListener("click", ()=>{
  if (nextPage <= totalPage){
    pageCall(nextPage);
  }

pagePrevious.addEventListener("click", ()=>{
  if (previousPage > 0){
    pageCall(previousPage);
  }
});

});

function pageCall(page){
  let splitURL = lastURL.split("?");
  let queryParam = splitURL[1].split('&');
  let key = queryParam[queryParam.length-1].split("=");

  console.log(`${splitURL} +  ${queryParam} +  ${key}`);

  if (key[0] != 'page'){
    let url = lastURL + '&page=' + page;
    getMovies(url);
  }
  else{
    key[1] = page.toString();
    let a  = key.join("=");
    queryParam[queryParam.length-1] = a;
    let b = queryParam.join("&");
    let url = splitURL[0] + "?" + b;
    getMovies(url);
  }
}