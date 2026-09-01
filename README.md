# Pokémon Evolution Decision Helper

A small static website answering the case question: **“Should I evolve this Pokémon?”**

## What it does

The user can search a Pokémon by name or Pokédex number. The page identifies its next evolution from the supplied Excel data, displays corresponding Pokémon images, compares six battle stats, and gives a clear recommendation. Branching evolution chains (for example Eevee) are supported; the page compares the branch with the highest total base stats and lists the alternatives.

## Decision rule

The case spreadsheet does not contain evolution levels, stones, friendship, moves, held items, or other game-specific requirements. Therefore the recommendation is intentionally transparent and data-driven:

- If no next evolution exists in the dataset: **No** (final form).
- If a next evolution exists and its total base battle stats are higher: **Yes**.
- For branching evolutions: compare all immediate next forms and use the highest total base-stat option for the main recommendation.

Total base stats = HP + Attack + Defense + Special Attack + Special Defense + Speed.

## Files

- `index.html` – page structure
- `styles.css` – responsive styling
- `app.js` – search, evolution matching and recommendation logic
- `data/pokemon-data.js` – processed data from the supplied `pokemon.xlsx`

Only canonical species rows (`id == species_id`) are used for evolution logic so alternate/Mega forms are not incorrectly treated as evolutionary stages.

Pokémon artwork is loaded from the public [PokéAPI sprites repository](https://github.com/PokeAPI/sprites). The repository states that its sprite collection includes official-artwork PNGs; Pokémon image content remains copyright The Pokémon Company.

## Run locally

Open `index.html` directly in a browser. No build step, package manager, API key, or backend is required.

## Publish with GitHub Pages

1. Create a **public GitHub repository** (for example `pokemon-case`).
2. Upload all files and folders from this project, keeping the same folder structure.
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch **main** and folder **/(root)**, then save.
6. GitHub will show the live Pages URL after deployment.

## Submission text

Replace the placeholders after publishing:

**Live website:** `https://YOUR-USERNAME.github.io/pokemon-case/`

**Public GitHub repository:** `https://github.com/YOUR-USERNAME/pokemon-case`

**Time spent:** I spent approximately **[YOUR ACTUAL TIME]** working on the case, including understanding the dataset, implementing the website, testing it, and publishing it.

**Cost:** The direct monetary cost was **0 DKK**. I used GitHub Pages for free hosting and ChatGPT Plus as an AI coding assistant. ChatGPT was used to help inspect the supplied dataset, define an explainable decision rule, generate the initial HTML/CSS/JavaScript, and prepare the repository structure. Because ChatGPT Plus is a subscription rather than a per-request API charge, there was no identifiable incremental cost for these prompts. If your grader wants usage expressed as a quota percentage, replace this sentence with the approximate percentage shown/estimated from your own account usage.

## Data note

The processed dataset is committed locally in `data/pokemon-data.js`, so the decision functionality does not depend on a live data API. Only artwork is loaded externally.
