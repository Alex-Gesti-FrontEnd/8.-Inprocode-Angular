import { scrapePriceCharting } from '../scrapers/pricecharting.scraper.js';
import { getConnection } from '../db.js';

export async function fetchGamePrices(gameId, slug, platform) {
  if (!slug) throw new Error('Slug missing for PriceCharting');

  const prices = await scrapePriceCharting(slug, platform);

  const connection = await getConnection();

  await connection.query(
    `
    INSERT INTO games_prices
    (game_id, loose_price, cib_price, avg_price, source, checked_at)
    VALUES (?, ?, ?, ?, ?, NOW())
    `,
    [gameId, prices.loose_price, prices.cib_price, prices.avg_price, prices.source]
  );

  await connection.end();

  return prices;
}
