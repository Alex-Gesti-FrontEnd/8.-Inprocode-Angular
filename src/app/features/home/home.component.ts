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

  platforms = signal<string[]>([]);

  form = this.fb.group({
    name: ['', [Validators.required]],
    platform: ['', [Validators.required]],
    genre: ['', [Validators.required]],
    releaseDate: ['', [Validators.required]],
    avgPrice: [0, [Validators.required]],
    image: [''],
  });

  ngOnInit() {
    this.gamesService.fetchGames();
  }

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

  autoFillFromIGDB() {
    const name = this.form.value.name;
    if (!name) return;

    this.gamesService.searchIGDB(name).subscribe((data) => {
      this.platforms.set(data.platforms?.map((p: any) => p.name) ?? []);

      this.form.patchValue({
        name: data.name,
        genre: data.genres?.[0]?.name ?? '',
        releaseDate: data.first_release_date
          ? new Date(data.first_release_date * 1000).toISOString().slice(0, 10)
          : '',
        image: data.cover ? `https:${data.cover.url.replace('t_thumb', 't_cover_big')}` : '',
        platform: '',
      });
    });
  }
}
