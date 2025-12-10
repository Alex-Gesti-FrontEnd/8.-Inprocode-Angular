import { Component, inject, signal } from '@angular/core';
import { GamesService } from '../../core/services/games.service';
import { GameModel } from '../../core/models/game.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  fb = inject(FormBuilder);
  gamesService = inject(GamesService);
  showForm = signal(false);

  games = this.gamesService.games;

  form = this.fb.group({
    name: ['', [Validators.required]],
    console: ['', [Validators.required]],
    genre: ['', [Validators.required]],
    resleaseDate: ['', [Validators.required]],
    avgPrice: [0, [Validators.required]],
    image: [''],
  });

  addGame() {
    if (this.form.valid) {
      this.gamesService.addGame(this.form.value as GameModel);
      this.form.reset();
    }
  }

  editGame(game: GameModel) {
    this.form.patchValue(game);
    this.showForm.set(true);
  }

  deleteGame(id: number) {
    this.gamesService.deleteGame(id);
  }

  toggleForm() {
    this.showForm.update((v) => !v);
  }
}
