const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";


for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="tipo-contenedor">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">Daño: ${poke.stats[1].base_stat}</p>
                <p class="stat">Defensa: ${poke.stats[2].base_stat}</p>
            </div>
        </div>
    `;

    div.addEventListener("click", () => {
        openModal(poke);
    });

    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if (botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))

function openModal(pokemon) {
    const modalOverlay = document.getElementById("modalOverlay");
    const modalContent = document.querySelector(".modal-content");

    const weaknesses = {
        normal: ["fighting"],
        fire: ["water", "rock", "ground"],
        water: ["electric", "grass"],
        electric: ["ground"],
        grass: ["fire", "ice", "poison", "flying", "bug"],
        ice: ["fire", "fighting", "rock", "steel"],
        fighting: ["flying", "psychic", "fairy"],
        poison: ["ground", "psychic"],
        ground: ["water", "grass", "ice"],
        flying: ["electric", "ice", "rock"],
        psychic: ["bug", "ghost", "dark"],
        bug: ["fire", "flying", "rock"],
        rock: ["water", "grass", "fighting", "ground", "steel"],
        ghost: ["ghost", "dark"],
        dragon: ["ice", "dragon", "fairy"],
        dark: ["fighting", "bug", "fairy"],
        steel: ["fire", "fighting", "ground"],
        fairy: ["poison", "steel"],
    };

    modalContent.innerHTML = `
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
      <p><strong>N.º:</strong> ${pokemon.id}</p>
      <p><strong>Altura:</strong> ${pokemon.height}m</p>
      <p><strong>Peso:</strong> ${pokemon.weight}kg</p>
      <p><strong>Tipo:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}</p>
      <p><strong>Debilidad:</strong> ${pokemon.types.map(type => weaknesses[type.type.name] ? weaknesses[type.type.name].join(", ") : "None").join(", ")}</p>
      <h3>Estadísticas Base</h3>
      <div class="pokemon-chart-container">
        <canvas id="pokemonChart" width="400" height="400"></canvas>
      </div>
    `;

    const ctx = document.getElementById('pokemonChart').getContext('2d');

    const data = {
        labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
        datasets: [{
            label: 'Base Stats',
            data: [
                pokemon.stats[0].base_stat,
                pokemon.stats[1].base_stat,
                pokemon.stats[2].base_stat,
                pokemon.stats[3].base_stat,
                pokemon.stats[4].base_stat,
                pokemon.stats[5].base_stat
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });

    modalOverlay.style.display = "flex";
}

function closeModal() {
    const modalOverlay = document.getElementById("modalOverlay");
    modalOverlay.style.display = "none";
}



const closeButton = document.getElementById("closeModal");
closeButton.addEventListener("click", () => {
    closeModal();
});



