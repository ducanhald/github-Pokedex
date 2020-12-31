const pokemonContainer = document.querySelector(".pokemon-container");
const buttons = document.querySelectorAll(".button-container button");
const page = document.querySelectorAll(".page");
const heading = document.querySelector("#heading");

const khuvuc = [
    ["Châu Á", 1, 151],
    ["Châu Phi", 152, 251],
    ["Châu Âu", 252, 386],
    ["Châu Đại Dương", 387, 483],
    ["Châu Mỹ", 494, 649]
];

let currentGen = 0;
let firstTime = true;

const colors = {
    grass: "#d2f2c2",
    poison: "#f7cdf7",
    fire: "#ffd1b5",
    flying: "#eae3ff",
    water: "#c2f3ff",
    bug: "#e0e8a2",
    normal: "#e6e6c3",
    electric: "#fff1ba",
    ground: "#e0ccb1",
    fighting: "#fcada9",
    psychic: "#ffc9da",
    rock: "#f0e09c",
    fairy: "#ffdee5",
    steel: "#e6eaf0",
    ice: "#e8feff",
    ghost: "#dbbaff",
    dragon: "#c4bdff",
    dark: "#a9abb0"
};

const searchBoxContainer = document.createElement("div");
searchBoxContainer.setAttribute("class", "search-box-container");
searchBoxContainer.innerHTML = `
<input type="text" class="search-box" placeholder="Tìm Kiếm"></input>
<i class="fas fa-search"></i>
`;



async function getPokemons(pokemonStartID, pokemonEndID) {
    // Adding the loader
    pokemonContainer.innerHTML = `<span class="loader"></span>`;

    // Restricting Clicking on Buttons
    buttons.forEach((el) => {
        el.classList.add("restrict-click");
    });

    // Fetching all pokemons
    const responses = [];
    for (let id = pokemonStartID; id <= pokemonEndID; id++) {
        const response = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        responses.push(response);
    }
    const proms = await Promise.all(responses);
    const promises = await Promise.all(proms.map((el) => el.json()));

    // Removing the loader
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
          <h5 class="poke-id"> ID : ${el.id} </h5>
          <h5 class="poke-name"> ${pokemonName.replace(/\w/, (ch) =>
											ch.toUpperCase()
										)} </h5>
          <h5> Hệ : ${pokemonTypes
											.join(" / ")
											.replace(/\b\w/g, (ch) => ch.toUpperCase())} 
          </h5>
        </div>
        <div class="card_back">
          <div class="poke-stats-name">Máu: ${el.stats[0].base_stat}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
											colors[pokemonTypes[0]]
										} ${el.stats[0].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[0].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Tấn Công: ${el.stats[1].base_stat}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
											colors[pokemonTypes[0]]
										} ${el.stats[1].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[1].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Phòng thủ: ${el.stats[2].base_stat}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
											colors[pokemonTypes[0]]
										} ${el.stats[2].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[2].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Tấn công đặc biệt: ${
											el.stats[3].base_stat
										}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
											colors[pokemonTypes[0]]
										} ${el.stats[3].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[3].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Phòng thủ đặc biệt: ${
											el.stats[4].base_stat
										}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
											colors[pokemonTypes[0]]
										} ${el.stats[4].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[4].base_stat}%"
          >
          </div>
          <div class="poke-stats-name">Tốc độ: ${el.stats[5].base_stat}</div>
          <div class="poke-stats-bar"
          style="background: linear-gradient(to right, ${
											colors[pokemonTypes[0]]
										} ${el.stats[5].base_stat}%, ${colors[pokemonTypes[0]]}71 
          ${el.stats[5].base_stat}%"
          >
          </div>
        </div>
      </div>
    </div>
		`;
        const pokemonCards = document.querySelectorAll(".card_front");
        const pokemonCard = pokemonCards[pokemonCards.length - 1];
        if (pokemonTypes[1]) {
            pokemonCard.style.background =
                "linear-gradient(150deg," +
                colors[el.types[0].type.name] +
                " 50%," +
                colors[el.types[1].type.name] +
                " 50%)";
        } else {
            pokemonCard.style.background = colors[pokemonTypes[0]];
        }
    });

    // Enabling Clicking on Buttons
    setTimeout(() => {
        buttons.forEach((el) => {
            el.classList.remove("restrict-click");
        });
    }, 500);

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
            !e.target.classList.contains("restrict-click")
        ) {
            page[currentGen].classList.remove("current-page");
            currentGen = (currentGen + 1) % khuvuc.length;
            page[currentGen].classList.add("current-page");
            heading.innerText = " Pokemon " + khuvuc[currentGen][0];
            getPokemons(khuvuc[currentGen][1], khuvuc[currentGen][2]);
        } else if (
            e.target.id === "left-btn" &&
            !e.target.classList.contains("restrict-click")
        ) {
            page[currentGen].classList.remove("current-page");
            currentGen = (currentGen - 1 + khuvuc.length) % khuvuc.length;
            page[currentGen].classList.add("current-page");
            heading.innerText = " Pokemon " + khuvuc[currentGen][0];
            getPokemons(khuvuc[currentGen][1], khuvuc[currentGen][2]);
        }
    });
});

page.forEach((el) => {
    el.addEventListener("click", (e) => {
        const searchBox = document.querySelector(".search-box");
        if (searchBox) {
            searchBox.value = "";
        }
        if (!buttons[0].classList.contains("restrict-click")) {
            page[currentGen].classList.remove("current-page");
            currentGen = el.textContent - 1;
            page[currentGen].classList.add("current-page");
            heading.innerText = " Pokemon " + khuvuc[currentGen][0];
            getPokemons(khuvuc[currentGen][1], khuvuc[currentGen][2]);
        }
    });
});

getPokemons(khuvuc[0][1], khuvuc[0][2]);