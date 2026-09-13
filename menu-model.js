/* Pure menu and Miami business-hours logic, shared by the UI and verification. */
window.KING_PALACE_MODEL = (() => {
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const normalize = value => String(value).toLocaleLowerCase().replace(/[’']/g, '');
  return {
    filterMenu(menu, category, searchTerm) {
      const query = normalize(searchTerm).trim();
      return menu.items.filter(item => {
        const categoryMatches = category === 'all' || item.category === category;
        const text = normalize(`${item.name} ${item.note} ${menu.categories[item.category].label}`);
        return categoryMatches && (!query || text.includes(query));
      });
    },
    formatPrice(price) { return price === null ? 'Market' : currency.format(price); },
    businessHours(now = new Date()) {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(now);
      const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
      const minutes = Number(values.hour) * 60 + Number(values.minute);
      return { weekday: values.weekday, open: values.weekday !== 'Wed' && minutes >= 660 && minutes < 1290 };
    }
  };
})();
