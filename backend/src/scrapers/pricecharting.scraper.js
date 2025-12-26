import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function scrapePriceCharting(slug) {
  const url = `https://www.pricecharting.com/game/${slug}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('PriceCharting not reachable');

  const html = await res.text();
  const $ = cheerio.load(html);

  const loose = $('#used_price span.price').first().text();
  const cib = $('#complete_price span.price').first().text();

  return {
    loose: parsePrice(loose),
    cib: parsePrice(cib),
  };
}

function parsePrice(text) {
  if (!text) return null;
  return Number(text.replace('$', '').replace(',', '').trim());
}
