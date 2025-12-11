import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Super Mario Odyssey',
      console: 'Switch',
      avgPrice: 49.99,
      releaseDate: '2017-10-27',
    },
  ]);
});

export default router;
