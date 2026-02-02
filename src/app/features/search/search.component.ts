import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GiphyService } from '../../core/services/giphy.service';
import type { Gif } from '../../core/models/gif.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  query = signal('');
  gifs = signal<Gif[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  hasSearched = signal(false);

  constructor(private giphy: GiphyService) {}

  onSearch(): void {
    const q = this.query().trim();
    if (!q) return;
    this.hasSearched.set(true);
    this.loading.set(true);
    this.error.set(null);
    this.giphy.search(q).subscribe({
      next: (list) => {
        this.gifs.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Search failed');
        this.gifs.set([]);
        this.loading.set(false);
      }
    });
  }
}
