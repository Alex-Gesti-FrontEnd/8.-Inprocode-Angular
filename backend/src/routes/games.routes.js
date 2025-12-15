import express from 'express';
import { getConnection } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM games');
    res.json(rows);
    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving games', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, console, genre, releaseDate, avgPrice, image } = req.body;
  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      'INSERT INTO games (name, console, genre, releaseDate, avgPrice, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, console, genre, releaseDate, avgPrice, image]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding game' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, console, genre, releaseDate, avgPrice, image } = req.body;
  try {
    const connection = await getConnection();
    await connection.query(
      'UPDATE games SET name = ?, console = ?, genre = ?, releaseDate = ?, avgPrice = ?, image = ? WHERE id = ?',
      [name, console, genre, releaseDate, avgPrice, image, id]
    );
    res.json({ id, ...req.body });
    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating game' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    await connection.query('DELETE FROM games WHERE id = ?', [id]);
    res.status(204).end();
    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting game' });
  }
});

export default router;
