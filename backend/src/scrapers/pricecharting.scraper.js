import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function scrapePriceCharting(slug, platform) {
  if (!slug) throw new Error('Slug is required for PriceCharting');

  const url = `https://www.pricecharting.com/game/${platform.toLowerCase()}/${slug}`;

  console.log('Scraping:', url);

  const response = await fetch(url);
  if (!response.ok) throw new Error('PriceCharting page not found');

  const html = await response.text();
  const $ = cheerio.load(html);

  const loose = $('#used_price .price').first().text();
  const cib = $('#complete_price .price').first().text();

  const parsePrice = (text) => (text ? parseFloat(text.replace('$', '').replace(',', '')) : null);

  return {
    loose_price: parsePrice(loose),
    cib_price: parsePrice(cib),
    avg_price:
      loose && cib
        ? (parsePrice(loose) + parsePrice(cib)) / 2
        : parsePrice(loose) || parsePrice(cib),
    source: 'pricecharting',
  };
}
