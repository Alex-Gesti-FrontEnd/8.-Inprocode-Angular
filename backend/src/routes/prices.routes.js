import express from 'express';
import { getConnection } from '../db.js';
import { fetchGamePrices } from '../services/pricecharting.service.js';

const router = express.Router();

router.post('/:gameId', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM games WHERE id = ?', [req.params.gameId]);
    await connection.end();

    if (!rows.length) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const game = rows[0];

    if (!game.slug) {
      return res.status(400).json({
        message: 'Slug missing for this game. Please provide the slug manually.',
        slugHelpUrl: 'https://www.pricecharting.com/',
      });
    }

    const prices = await fetchGamePrices(game.id, game.slug, game.platform);

    res.json({
      message: 'Price updated',
      prices,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error fetching price',
      error: err.message,
    });
  }
});

export default router;
