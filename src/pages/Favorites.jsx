import { useEffect, useState } from "react";

function Favorites() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        // Get favorites from localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites') || "[]");
        if (favorites.length === 0) {
          setPokemons([]);
          return;
        }

        // Fetch details for each favorite
        const detailedPokemons = [];
        for (const fav of favorites) {
          // If favorite is just a name, fetch by name
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${fav.name || fav}`);
          const details = await response.json();
          detailedPokemons.push(details);
        }

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

  // ...rest of your functions (showteamdetailsview, detailclick, etc.) remain unchanged

  // (Copy all your other functions here unchanged)

  function showteamdetailsview() {
    const teamdiv = document.querySelector('.currentteamdetails');
    teamdiv.innerHTML = JSON.parse(localStorage.getItem('team') || "[]").map(p => `<img src="${p.sprites.front_default}" alt="${p.name}" />`).join("");
    const number = document.querySelector(".currentnumberteam")
    number.innerHTML = JSON.parse(localStorage.getItem('team') || "[]").length;
  }

  function detailclick(detail) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    showteamdetailsview()
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
    <li>Special Defense: ${detail.stats.find(s => s.stat.name === "special-defense").base_stat}</li>
  `;
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

    const team = JSON.parse(localStorage.getItem('team') || '[]');

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
        <h2>Favoriete Pokémon</h2>
        <div className="cardsContainer">
          {pokemons.length === 0 && <p>Geen favoriete Pokémon gevonden.</p>}
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

      <div className="detailsview">
        <button className="closebutton" onClick={closebutton}>X</button>
        <div className="title"></div>
        <img className="img"></img>
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
          <div className="currentteamdetails"></div>
        </div>
      </div>
    </>
  );
}

export default Favorites;
