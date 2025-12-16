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
  platformsData = signal<{ platform: string; region: string; releaseDate: string }[]>([]);

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
      type GameVersion = { platform: string; region: string; releaseDate: string };

      const allVersions: GameVersion[] = (data.release_dates ?? []).map(
        (r: any): GameVersion => ({
          platform: r.platform?.name ?? '',
          region: r.region ?? '',
          releaseDate: r.date ? new Date(r.date * 1000).toISOString().slice(0, 10) : '',
        })
      );

      const versions: GameVersion[] = allVersions.filter((v) => v.platform);
      this.platformsData.set(versions);
      this.platforms.set([...new Set(versions.map((v) => v.platform))]);

      this.form.patchValue({
        name: data.name,
        genre: data.genres?.[0]?.name ?? '',
        releaseDate: '',
        image: data.cover ? `https:${data.cover.url.replace('t_thumb', 't_cover_big')}` : '',
        platform: '',
      });
    });
  }

  onPlatformChange(selected: string) {
    const version = this.platformsData().find((v) => v.platform === selected);
    if (version) {
      this.form.patchValue({
        platform: version.platform,
        releaseDate: version.releaseDate,
      });
    }
  }
}
