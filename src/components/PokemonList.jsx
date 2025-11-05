import { useEffect, useState } from "react";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        // 1. Basislijst ophalen
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=80");
        const data = await res.json();

        // 2. Details één voor één ophalen
        const detailedPokemons = [];
        for (const pokemon of data.results) {
          const response = await fetch(pokemon.url);
          const details = await response.json();
          detailedPokemons.push(details);
        }

        // 3. Alles in state zetten
        setPokemons(detailedPokemons);
      } catch (err) {
        console.error("Fout bij ophalen Pokémon data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  if (loading) return <p>Bezig met laden...</p>;


  function showteamdetailsview() {
    //show team
    const teamdiv = document.querySelector('.currentteamdetails');
    teamdiv.innerHTML = JSON.parse(localStorage.getItem('team') || "[]").map(p => `<img src="${p.sprites.front_default}" alt="${p.name}" />`).join("");

    //show team count
    const number = document.querySelector(".currentnumberteam")
    number.innerHTML = JSON.parse(localStorage.getItem('team') || "[]").length;
  }

  function detailclick(detail) {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Example: check if the Pokémon is in favorites
    function updateFavUI() {
      // const currentFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      // if (currentFavorites.includes(detail.name)) {
      //   document.querySelector(".favoritepokimoncard").style.backgroundImage = 'url("https://pics.clipartpng.com/Heart_Shape_PNG_Clipart-3166.png")'; // filled heart
      // } else {
      //   document.querySelector(".favoritepokimoncard").style.backgroundImage = 'url("https://www.freeiconspng.com/uploads/heart-png-29.png")'; // empty heart
      // }
    }

    // Initialize UI
    updateFavUI();
    //show the team
    showteamdetailsview();
    const detailsview = document.querySelector('.detailsview');
    detailsview.style.visibility = "visible"
    const title = document.querySelector('.title');
    title.textContent = detail.name;

    const img = document.querySelector('.img');
    img.setAttribute("src", detail.sprites.front_default);
    img.setAttribute("alt", detail.name);
    const statsList = document.querySelector('.stats ul');
    statsList.innerHTML = `
    <li>HP: ${detail.stats.find(s => s.stat.name === "hp").base_stat}</li>
    <li>Attack: ${detail.stats.find(s => s.stat.name === "attack").base_stat}</li>
    <li>Defense: ${detail.stats.find(s => s.stat.name === "defense").base_stat}</li>
    <li>Special Defense: ${detail.stats.find(s => s.stat.name === "special-defense").base_stat}</li>`;

    const favoritesimage = document.querySelector(".favoritepokimoncard");

    // Replace the element to remove old listeners
    const newFavoritesImage = favoritesimage.cloneNode(true);
    favoritesimage.parentNode.replaceChild(newFavoritesImage, favoritesimage);

    
    newFavoritesImage.addEventListener("click", () => {
      let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

      const existsIndex = favorites.findIndex(fav => fav.name === detail.name);

      if (existsIndex !== -1) {
        favorites.splice(existsIndex, 1);
        newFavoritesImage.style.backgroundImage = 'url("https://www.freeiconspng.com/uploads/heart-png-29.png")';
            } else {
        favorites.push(detail);
        newFavoritesImage.style.backgroundImage = 'url("https://pics.clipartpng.com/Heart_Shape_PNG_Clipart-3166.png")';
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    });


  }


  function closebutton() {
    const detailsview = document.querySelector('.detailsview');
    detailsview.style.visibility = "hidden"
  }

  function storepokemon() {
    const number = document.querySelector(".currentnumberteam")
    const title = document.querySelector(".title");
    const pokemonName = title.textContent;
    const selectedPokemon = pokemons.find(p => p.name === pokemonName);
    if (!selectedPokemon) return;

    // Get current team from localStorage
    const team = JSON.parse(localStorage.getItem('team') || '[]');

    // Add selectedPokemon if not already in team
    if (team.some(p => p.name === selectedPokemon.name)) {
      const error = document.querySelector('.errormassageteamfull');
      error.innerHTML = "already selected"
      error.style.visibility = "visible";
      setTimeout(() => {
        error.style.visibility = "hidden";
      }, 2000);
      return;
    }
    if (team.length < 6) {
      team.push(selectedPokemon);
      localStorage.setItem('team', JSON.stringify(team));
    } else {
      const error = document.querySelector('.errormassageteamfull');
      error.innerHTML = "your team is full!"
      error.style.visibility = "visible";
      setTimeout(() => {
        error.style.visibility = "hidden";
      }, 2000);
    }
    //show the team
    showteamdetailsview()
  }

  function clearteam() {
    localStorage.removeItem('team');
    showteamdetailsview();
    const number = document.querySelector(".currentnumberteam");
    if (number) number.innerHTML = "0";
  }

  return (
    <>
      <div>
        <h2>Pokémon Lijst</h2>
        <div className="cardsContainer">
          {pokemons.map(p => (
            <div onClick={() => detailclick(p)} className="pokemoncard" data-name={p.name} key={p.name}>

              <img className="spritepokimoncard" src={p.sprites.front_default} alt={p.name} />
              <ul>
                <li>
                  HP: {p.stats.find(s => s.stat.name === "hp").base_stat}
                </li>
                <li>
                  Attack: {p.stats.find(s => s.stat.name === "attack").base_stat}
                </li>
                <li>
                  Defence: {p.stats.find(s => s.stat.name === "defense").base_stat}
                </li>
                <li>
                  Special-defense: {p.stats.find(s => s.stat.name === "special-defense").base_stat}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>



      {/* detailsview */}

      <div className="detailsview">
        <button className="closebutton" onClick={closebutton}>X</button>
        <div className="favoritepokimoncard"></div>
        <div className="title">

        </div>
        <img className="img">

        </img>

        <div className="stats">
          <ul>
            <li>HP</li>
            <li>Attack</li>
            <li>Defense</li>
            <li>Special Defense</li>
          </ul>
        </div>

        <button className="addtoteambutton" onClick={storepokemon}>
          Add to team
        </button>
        <button className="clearteambutton" onClick={clearteam}>
          Clear team
        </button>
        <div className="currentteamdetailscontainer">
          <h2>Current Team</h2>
          <span className="errormassageteamfull"></span>
          <span className="currentnumberteam">0</span>/6
          <div className="currentteamdetails">
          </div>
        </div>
      </div>
    </>
  );
}

export default PokemonList;
