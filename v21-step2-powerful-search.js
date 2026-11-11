/* ExploreUP V21 — Powerful Search
 * Loads the existing district data only when the search page is used.
 * Search results link to the shared city guide and its matching category.
 */
(function () {
  'use strict';

  const input = document.getElementById('powerSearch');
  const filter = document.getElementById('categoryFilter');
  const results = document.getElementById('searchResults');
  const count = document.getElementById('searchCount');
  if (!input || !filter || !results || !count) return;

  const categories = [
    { value: 'places', label: 'Places & District Guides', section: 'places' },
    { value: 'food', label: 'Food', section: 'food' },
    { value: 'hotels', label: 'Hotels & Stays', section: 'hotels' },
    { value: 'cinema', label: 'Cinemas', section: 'cinema' },
    { value: 'health', label: 'Health', section: 'health' },
    { value: 'transport', label: 'Transport', section: 'transport' },
    { value: 'services', label: 'Essential Services', section: 'services' }
  ];

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const normalize = value => String(value ?? '')
    .toLocaleLowerCase('en-IN')
    .normalize('NFKC')
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let districtPromise;

  async function mapLimit(items, limit, worker) {
    const output = new Array(items.length);
    let cursor = 0;
    async function run() {
      while (cursor < items.length) {
        const index = cursor++;
        output[index] = await worker(items[index]);
      }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
    return output;
  }

  function loadDistricts() {
    if (districtPromise) return districtPromise;
    districtPromise = (async () => {
      const homeResponse = await fetch('/index.html', { cache: 'no-store' });
      if (!homeResponse.ok) throw new Error('Could not load the district directory.');
      const homeHTML = await homeResponse.text();
      const paths = [...homeHTML.matchAll(/<script\b[^>]*\bsrc=["']\.\/(districts\/[^"']+\/data\.js)["']/gi)]
        .map(match => match[1]);
      const uniquePaths = [...new Set(paths)];
      if (!uniquePaths.length) throw new Error('No district data files were found.');

      const records = await mapLimit(uniquePaths, 8, async path => {
        try {
          const response = await fetch('/' + path, { cache: 'force-cache' });
          if (!response.ok) return null;
          const source = await response.text();
          const match = source.match(/window\.ExploreUPDistricts\.push\((\{[\s\S]*?\})\);/);
          if (!match) return null;
          const record = JSON.parse(match[1]);
          return record && record.name ? record : null;
        } catch (_) {
          return null;
        }
      });
      return records.filter(Boolean);
    })();
    return districtPromise;
  }

  function buildCandidates(districts) {
    return districts.flatMap(city => categories.map(category => {
      let description = '';
      let searchable = '';
      if (category.value === 'places') {
        description = city.tag || city.about || 'Explore this Uttar Pradesh district.';
        searchable = [city.name, city.tag, city.places, city.about, 'places attractions district guide'].join(' ');
      } else if (category.value === 'food') {
        description = city.food || 'Explore local food highlights and food traditions.';
        searchable = [city.name, city.food, 'food local dishes cuisine'].join(' ');
      } else {
        description = 'Open the ' + category.label.toLowerCase() + ' section for ' + city.name + '. Availability of individual listings may vary by district.';
        searchable = [city.name, category.label, category.value, 'stay accommodation hospital clinic bus train road emergency local'].join(' ');
      }
      return {
        city: city.name,
        label: city.name + ' — ' + category.label,
        description,
        category: category.label,
        section: category.section,
        searchable: normalize(searchable)
      };
    }));
  }

  let candidatesPromise;
  async function getCandidates() {
    if (!candidatesPromise) {
      candidatesPromise = loadDistricts().then(buildCandidates);
    }
    return candidatesPromise;
  }

  function score(item, query) {
    const tokens = query.split(' ').filter(Boolean);
    if (!tokens.every(token => item.searchable.includes(token))) return -1;
    const city = normalize(item.city);
    let value = 10;
    if (city === query) value += 30;
    if (city.startsWith(query)) value += 15;
    if (item.searchable.startsWith(query)) value += 8;
    for (const token of tokens) {
      if (city === token) value += 12;
      else if (city.startsWith(token)) value += 6;
    }
    return value;
  }

  function showMessage(message) {
    results.innerHTML = '<div class="no-results">' + escapeHTML(message) + '</div>';
  }

  async function render() {
    const query = normalize(input.value);
    const selected = filter.value || 'all';
    if (query.length < 2) {
      count.textContent = 'Type at least 2 characters';
      showMessage('Search for a district, place, food, hotel, cinema, health or transport topic.');
      return;
    }

    count.textContent = 'Loading district information…';
    showMessage('Searching all available district records…');

    try {
      const all = await getCandidates();
      const pool = selected === 'all' ? all : all.filter(item =>
        categories.some(category => category.value === selected && category.label === item.category)
      );
      const ranked = pool
        .map(item => ({ item, score: score(item, query) }))
        .filter(entry => entry.score >= 0)
        .sort((a, b) => b.score - a.score || a.item.city.localeCompare(b.item.city))
        .slice(0, 24);

      if (!ranked.length) {
        count.textContent = '0 results';
        showMessage('No matching results found. Try a district name or a different category.');
        return;
      }

      count.textContent = ranked.length + (ranked.length === 24 ? '+ results' : ' results');
      results.innerHTML = ranked.map(({ item }) => {
        const href = '/city.html?city=' + encodeURIComponent(item.city) +
          '&category=' + encodeURIComponent(item.section);
        return '<a class="search-result" href="' + href + '">' +
          '<span class="result-type">' + escapeHTML(item.category) + '</span>' +
          '<span class="result-title">' + escapeHTML(item.label) + '</span>' +
          '<span class="result-desc">' + escapeHTML(item.description) + '</span>' +
          '<span class="result-go">Open →</span>' +
          '</a>';
      }).join('');
    } catch (error) {
      count.textContent = 'Search unavailable';
      showMessage('District search could not load right now. Please refresh and try again.');
      console.error('ExploreUP search:', error);
    }
  }

  let scheduled = false;
  function scheduleRender() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      render();
    });
  }

  input.addEventListener('input', scheduleRender);
  filter.addEventListener('change', render);
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      input.value = '';
      scheduleRender();
    }
  });

  count.textContent = 'Search 75 Uttar Pradesh districts';
  showMessage('Start with a district name, a place, or a topic such as food, hotels or transport.');
})();
