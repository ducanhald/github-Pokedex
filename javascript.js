const pokemonContainer = document.querySelector(".pokemon-container");
const buttons = document.querySelectorAll(".button-container button");
const page = document.querySelectorAll(".page");
const heading = document.querySelector("#heading")
const khuvuc = [
    ["Châu Á", 1, 100],
    ["Châu Phi", 101, 200],
    ["Châu Âu", 201, 300],
    ["Châu Đại Dương", 301, 400],
    ["Châu Mỹ", 401, 500]
];
let kvhientai = 0;
let firstTime = true;
const searchBoxContainer = document.createElement("div");
searchBoxContainer.setAttribute("class", "search-box-container");
searchBoxContainer.innerHTML = `<input type="text" class="search-box" placeholder="Tìm Kiếm Pokemon"></input>
<i class="fas fa-search"></i>`;
async function getPokemons(pokemonStartID, pokemonEndID) {


    buttons.forEach((element) => {
        element.classList.add("chonpokemon");
    });


    const responses = [];
    for (let id = pokemonStartID; id <= pokemonEndID; id++) {
        const response = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        responses.push(response);
    }
    const proms = await Promise.all(responses);
    const promises = await Promise.all(proms.map((el) => el.json()));


    pokemonContainer.innerHTML = "";

    if (firstTime) {
        document.body.insertBefore(searchBoxContainer, pokemonContainer);
        firstTime = false;
    }

    promises.forEach((el, ind) => {
        const pokemonName = el.name;
        const pokemonTypes = [];
        el.types.forEach((item) => {
            pokemonTypes.push(item.type.name);
        });
        const imageURL = el.sprites.other["official-artwork"].front_default;
        pokemonContainer.innerHTML += `
    <div class="pc-container">
      <div class="pokemon-card">
        <div class="card_front">
          <img src=${imageURL}></img>
          <div class="circle"></div>
          <h5 class="poke-id"> STT : ${el.id} </h5>
          <h5 class="poke-name"> Tên : ${pokemonName.replace(/\w/, (ch) =>ch.toUpperCase())} </h5>
          <h5> Hệ : ${pokemonTypes.join(" / ").replace(/\b\w/g, (ch) => ch.toUpperCase())} </h5>
        </div>
        <div class="card_back">
          <h5 class="poke-name"> Chỉ số của : ${pokemonName.replace(/\w/, (ch) =>ch.toUpperCase())} </h5>
          <div class="poke-stats-name">Máu: ${el.stats[0].base_stat}</div>
          <div class="poke-stats-name">Tấn Công: ${el.stats[1].base_stat}</div>
          <div class="poke-stats-name">Phòng thủ: ${el.stats[2].base_stat}</div>
          <div class="poke-stats-name">Tấn công đặc biệt: ${el.stats[3].base_stat}</div>
          <div class="poke-stats-name">Phòng thủ đặc biệt: ${el.stats[4].base_stat}</div>
          <div class="poke-stats-name">Tốc độ: ${el.stats[5].base_stat}</div>
        </div>
      </div>
    </div>
		`;
    });

    setTimeout(() => {
        buttons.forEach((el) => { el.classList.remove("chonpokemon"); });
    }, 0);

    instantiateListener();
}

function instantiateListener() {
    const pokemons = document.querySelectorAll(".pokemon-card .poke-name");
    const searchBox = document.querySelector(".search-box");

    searchBox.addEventListener("keyup", (e) => {
        const inp = searchBox.value.toLowerCase();

        pokemons.forEach((pokemon) => {
            const name = pokemon.textContent.toLowerCase();
            if (name.indexOf(inp) !== -1) {
                pokemon.parentElement.parentElement.parentElement.style.display = "flex";
            } else {
                pokemon.parentElement.parentElement.parentElement.style.display = "none";
            }
        });
    });
}

buttons.forEach((el) => {
    el.addEventListener("click", (e) => {
        const searchBox = document.querySelector(".search-box");
        if (searchBox) {
            searchBox.value = "";
        }
        if (
            e.target.id === "right-btn" &&
            !e.target.classList.contains("chonpokemon")
        ) {
            page[kvhientai].classList.remove("current-page");
            kvhientai = (kvhientai + 1) % khuvuc.length;
            page[kvhientai].classList.add("current-page");
            heading.innerText = " Pokemon " + khuvuc[kvhientai][0];
            getPokemons(khuvuc[kvhientai][1], khuvuc[kvhientai][2]);
        } else if (
            e.target.id === "left-btn" &&
            !e.target.classList.contains("chonpokemon")
        ) {
            page[kvhientai].classList.remove("current-page");
            kvhientai = (kvhientai - 1 + khuvuc.length) % khuvuc.length;
            page[kvhientai].classList.add("current-page");
            heading.innerText = " Pokemon " + khuvuc[kvhientai][0];
            getPokemons(khuvuc[kvhientai][1], khuvuc[kvhientai][2]);
        }
    });
});

page.forEach((el) => {
    el.addEventListener("click", (e) => {
        const searchBox = document.querySelector(".search-box");
        if (searchBox) {
            searchBox.value = "";
        }
        if (!buttons[0].classList.contains("chonpokemon")) {
            page[kvhientai].classList.remove("current-page");
            kvhientai = el.textContent - 1;
            page[kvhientai].classList.add("current-page");
            heading.innerText = " Pokemon " + khuvuc[kvhientai][0];
            getPokemons(khuvuc[kvhientai][1], khuvuc[kvhientai][2]);
        }
    });
});

getPokemons(khuvuc[0][1], khuvuc[0][2]);