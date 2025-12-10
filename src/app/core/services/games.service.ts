import { Injectable, signal } from '@angular/core';
import { GameModel } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  games = signal<GameModel[]>([
    {
      id: 1,
      name: 'Super Mario Odyssey',
      console: 'Nintendo Switch',
      genre: 'Platformer',
      releaseDate: '2017-10-27',
      avgPrice: 59.99,
      image: 'https://m.media-amazon.com/images/I/91SF0Tzmv4L._AC_UF894,1000_QL80_.jpg',
    },
  ]);

  addGame(game: GameModel) {
    const newGame = { ...game, id: Date.now() };
    this.games.update((old) => [...old, newGame]);
  }

  deleteGame(id: number) {
    this.games.update((old) => old.filter((g) => g.id !== id));
  }
}
