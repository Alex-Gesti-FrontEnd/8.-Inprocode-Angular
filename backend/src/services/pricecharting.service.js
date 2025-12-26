import { scrapePriceCharting } from '../scrapers/pricecharting.scraper.js';

export async function fetchGamePrices(slug) {
  const prices = await scrapePriceCharting(slug);

  let avg = null;
  if (prices.loose && prices.cib) {
    avg = (prices.loose + prices.cib) / 2;
  }

  return {
    loose_price: prices.loose,
    cib_price: prices.cib,
    avg_price: avg,
    source: 'pricecharting',
    checked_at: new Date(),
  };
}
