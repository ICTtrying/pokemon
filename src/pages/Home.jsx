import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [team, setTeam] = useState([]);

  // Load team once
  useEffect(() => {
    const savedTeam = JSON.parse(localStorage.getItem("team") || "[]");
    setTeam(savedTeam);
  }, []);

  // Delete Pokémon from team
  function deletepokemon(pokemon) {
    const updatedTeam = team.filter((p) => p.name !== pokemon.name);
    localStorage.setItem("team", JSON.stringify(updatedTeam));
    setTeam(updatedTeam); // update state instead of reloading
  }

  function clearteam() {
    localStorage.removeItem('team');
    window.location.reload();
  }

  return (
    <>
      <div>
        <h1>Home</h1>
        <p className="header-sub-text">
          Set up your own team right from the List page and start managing your members with ease!
        </p>
        <button className="clearteambutton" onClick={clearteam}>clear all</button>

        <div className="Team-Container">
          {team.length > 0 ? (
            team.map((p) => (
              <div key={p.name} className="listlink-card">
                <button className="deletepokemon" onClick={() => deletepokemon(p)}>
                  X
                </button>
                <h2>{p.name}</h2>
                <img src={p.sprites.front_default} alt={p.name} />
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
            ))
          ) : (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <h2>empty</h2>
                  <p>Choose your team now on the List page!</p>
                  <Link className="listlink-card" to="/list">
                    Go to List page
                  </Link>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
