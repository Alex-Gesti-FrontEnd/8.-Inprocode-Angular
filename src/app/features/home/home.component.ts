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

  editingId = signal<number | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required]],
    console: ['', [Validators.required]],
    genre: ['', [Validators.required]],
    releaseDate: ['', [Validators.required]],
    avgPrice: [0, [Validators.required]],
    image: [''],
  });

  addGame() {
    if (this.form.invalid) return;

    const gameData = this.form.value as GameModel;

    if (this.editingId()) {
      this.gamesService.updateGame(this.editingId()!, gameData);
      this.editingId.set(null);
    } else {
      this.gamesService.addGame(gameData);
    }

    this.form.reset();
    this.showForm.set(false);
  }

  editGame(game: GameModel) {
    this.editingId.set(game.id!);
    this.form.patchValue(game);
    this.showForm.set(true);
  }

  deleteGame(id: number) {
    this.gamesService.deleteGame(id);
  }

  toggleForm() {
    this.showForm.update((v) => !v);

    if (!this.showForm()) {
      this.editingId.set(null);
      this.form.reset();
    }
  }
}
