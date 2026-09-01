const pokemon = window.POKEMON_DATA || [];
const byId = new Map(pokemon.map(p => [p.id, p]));
const byName = new Map(pokemon.map(p => [p.name.toLowerCase(), p]));
const childrenBySpecies = new Map();

for (const p of pokemon) {
  if (p.evolvesFromSpeciesId == null) continue;
  if (!childrenBySpecies.has(p.evolvesFromSpeciesId)) childrenBySpecies.set(p.evolvesFromSpeciesId, []);
  childrenBySpecies.get(p.evolvesFromSpeciesId).push(p);
}

const search = document.querySelector('#pokemonSearch');
const options = document.querySelector('#pokemonOptions');
const button = document.querySelector('#checkButton');
const error = document.querySelector('#searchError');
const result = document.querySelector('#result');
const banner = document.querySelector('#decisionBanner');
const comparison = document.querySelector('#comparison');
const statsPanel = document.querySelector('#statSection');

const pretty = value => value.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
const bst = p => Object.values(p.stats).reduce((sum, n) => sum + n, 0);
const imageUrl = p => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;
const fallbackUrl = p => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.imageFile}`;

for (const p of pokemon) {
  const option = document.createElement('option');
  option.value = pretty(p.name);
  option.label = `#${String(p.id).padStart(3,'0')}`;
  options.appendChild(option);
}

function findPokemon(raw) {
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  if (/^#?\d+$/.test(value)) return byId.get(Number(value.replace('#',''))) || null;
  return byName.get(value.replaceAll(' ', '-')) || null;
}

function pokemonCard(p, label) {
  const typeTags = p.types.map(t => `<span class="type">${pretty(t)}</span>`).join('');
  return `<article class="pokemon-card" style="--accent:${p.color1 || '#94a3b8'}">
    <div class="card-top"><div><span class="dex">${label} · #${String(p.id).padStart(3,'0')}</span><h3>${pretty(p.name)}</h3></div><strong>BST ${bst(p)}</strong></div>
    <img class="pokemon-image" src="${imageUrl(p)}" alt="${pretty(p.name)}" onerror="this.onerror=null;this.src='${fallbackUrl(p)}'">
    <div class="types">${typeTags}</div>
    <div class="meta">
      <div><span>Height</span><strong>${(p.height / 10).toFixed(1)} m</strong></div>
      <div><span>Weight</span><strong>${(p.weight / 10).toFixed(1)} kg</strong></div>
      <div><span>Base XP</span><strong>${p.baseExperience}</strong></div>
    </div>
  </article>`;
}

function statLabel(key) {
  return ({hp:'HP', attack:'Attack', defense:'Defense', special_attack:'Sp. Attack', special_defense:'Sp. Defense', speed:'Speed'})[key];
}

function statsComparison(current, next) {
  const max = 180;
  const rows = Object.keys(current.stats).map(key => {
    const a = current.stats[key], b = next.stats[key], d = b - a;
    const klass = d > 0 ? 'positive' : d < 0 ? 'negative' : '';
    const sign = d > 0 ? '+' : '';
    return `<div class="stat-row">
      <span class="stat-name">${statLabel(key)}</span>
      <div class="stat-bars" title="Current ${a}; next ${b}">
        <div class="bar"><span style="width:${Math.min(100, a/max*100)}%"></span></div>
        <div class="bar next"><span style="width:${Math.min(100, b/max*100)}%"></span></div>
      </div>
      <span class="delta ${klass}">${sign}${d}</span>
    </div>`;
  }).join('');
  const delta = bst(next) - bst(current);
  return `<h2>Stat change</h2>${rows}<div class="branch-note"><strong>Total base stat change: ${delta >= 0 ? '+' : ''}${delta}</strong>. Gray is the current form; green is the selected next evolution.</div>`;
}

function render(p) {
  error.textContent = '';
  const nextForms = (childrenBySpecies.get(p.speciesId) || []).sort((a,b) => bst(b)-bst(a));
  result.classList.remove('hidden');

  if (nextForms.length === 0) {
    banner.className = 'decision-banner no';
    banner.innerHTML = `<h2>No — ${pretty(p.name)} has no next evolution.</h2><p>It is a final evolutionary form in the supplied dataset, so there is nothing further to evolve into.</p>`;
    comparison.innerHTML = pokemonCard(p, 'Selected Pokémon');
    statsPanel.innerHTML = `<h2>Current battle stats</h2>` + Object.entries(p.stats).map(([k,v]) => `<div class="stat-row"><span class="stat-name">${statLabel(k)}</span><div class="bar"><span style="width:${Math.min(100,v/180*100)}%"></span></div><strong class="delta">${v}</strong></div>`).join('') + `<div class="branch-note"><strong>Total base stats: ${bst(p)}</strong></div>`;
    return;
  }

  const best = nextForms[0];
  const gain = bst(best) - bst(p);
  const should = gain > 0;
  banner.className = `decision-banner ${should ? 'yes' : 'no'}`;
  banner.innerHTML = should
    ? `<h2>Yes — evolving improves the battle stats.</h2><p>${pretty(best.name)} gains ${gain} total base-stat points compared with ${pretty(p.name)}.</p>`
    : `<h2>No — the next form does not improve total battle stats.</h2><p>The strongest next option changes total base stats by ${gain}.</p>`;

  comparison.innerHTML = pokemonCard(p, 'Current') + pokemonCard(best, nextForms.length > 1 ? 'Best next option' : 'Next evolution');
  statsPanel.innerHTML = statsComparison(p, best) + (nextForms.length > 1
    ? `<div class="branch-note">This Pokémon has ${nextForms.length} possible next evolutions in the dataset: ${nextForms.map(x => `${pretty(x.name)} (BST ${bst(x)})`).join(', ')}. The comparison above uses the option with the highest total base stats.</div>`
    : '');
}

function check() {
  const p = findPokemon(search.value);
  if (!p) {
    result.classList.add('hidden');
    error.textContent = 'Pokémon not found. Try a name such as Pikachu or a Pokédex number such as 25.';
    return;
  }
  search.value = pretty(p.name);
  render(p);
}

button.addEventListener('click', check);
search.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });

// Friendly initial state
search.value = 'Pikachu';
render(byName.get('pikachu'));
