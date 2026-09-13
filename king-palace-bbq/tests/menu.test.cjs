const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = vm.createContext({ window: {}, Intl, Date });
for (const file of ['menu-data.js', 'menu-model.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'site', file), 'utf8'), context);
}
const { KING_PALACE_MENU: menu, KING_PALACE_MODEL: model } = context.window;

test('every dish has a recognized category, unique name and valid published price', () => {
  assert.equal(menu.items.length, 38);
  assert.equal(new Set(menu.items.map(item => item.name)).size, menu.items.length);
  for (const item of menu.items) {
    assert.ok(menu.categories[item.category], item.name);
    assert.ok(item.price === null || Number.isFinite(item.price) && item.price > 0, item.name);
    assert.equal(typeof item.note, 'string');
  }
});

test('category filters show the correct dishes and all restores the complete selection', () => {
  const bbq = model.filterMenu(menu, 'bbq', '');
  assert.equal(bbq.length, 8);
  assert.ok(bbq.every(item => item.category === 'bbq'));
  for (const category of Object.keys(menu.categories)) {
    assert.ok(model.filterMenu(menu, category, '').length > 0, category);
  }
  assert.equal(model.filterMenu(menu, 'all', '').length, menu.items.length);
});

test('search finds dishes across categories and ignores capitalization and whitespace', () => {
  const results = model.filterMenu(menu, 'all', ' DUCK ');
  assert.ok(results.length >= 3);
  assert.ok(results.some(item => item.category === 'rice'));
  assert.ok(results.some(item => item.category === 'bbq'));
  assert.equal(model.filterMenu(menu, 'all', "General Tso's").length, 1);
  assert.equal(model.filterMenu(menu, 'all', '<script>missing</script>').length, 0);
});

test('unknown seafood prices are never invented', () => {
  assert.equal(model.formatPrice(null), 'Market');
  assert.equal(model.formatPrice(16), '$16');
  assert.equal(menu.items.find(item => item.name === 'Whole Live Lobster').price, null);
});

test('opening and closing boundaries use Miami summer time', () => {
  assert.equal(model.businessHours(new Date('2026-09-12T14:59:59Z')).open, false);
  assert.equal(model.businessHours(new Date('2026-09-12T15:00:00Z')).open, true);
  assert.equal(model.businessHours(new Date('2026-09-13T01:29:59Z')).open, true);
  assert.equal(model.businessHours(new Date('2026-09-13T01:30:00Z')).open, false);
});

test('Wednesdays are closed throughout the listed service window', () => {
  const result = model.businessHours(new Date('2026-09-16T17:00:00Z'));
  assert.equal(result.weekday, 'Wed');
  assert.equal(result.open, false);
});

test('winter timezone offset and midnight do not cause false opening status', () => {
  assert.equal(model.businessHours(new Date('2026-12-14T15:59:59Z')).open, false);
  assert.equal(model.businessHours(new Date('2026-12-14T16:00:00Z')).open, true);
  assert.equal(model.businessHours(new Date('2026-12-15T02:30:00Z')).open, false);
  assert.equal(model.businessHours(new Date('2026-12-15T05:00:00Z')).open, false);
});

test('main document has valid restaurant metadata, local files and fragment targets', () => {
  const root = path.join(__dirname, '..', 'site');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'duplicate DOM ids');
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), target);
  for (const [, target] of html.matchAll(/(?:src|href)="([^"#:]+)"/g)) {
    assert.ok(fs.existsSync(path.join(root, target)), `missing local file: ${target}`);
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema['@type'], 'Restaurant');
  assert.equal(schema.telephone, '+1-305-949-2339');
  assert.ok(!schema.openingHoursSpecification[0].dayOfWeek.includes('Wednesday'));
  assert.equal(schema.openingHoursSpecification[0].dayOfWeek.length, 6);
  assert.ok(html.includes('August 2025'), 'historical-price disclosure missing');
});
