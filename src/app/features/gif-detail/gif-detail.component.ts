import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GiphyService } from '../../core/services/giphy.service';
import type { Gif } from '../../core/models/gif.model';

@Component({
  selector: 'app-gif-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gif-detail.component.html',
  styleUrl: './gif-detail.component.scss'
})
export class GifDetailComponent {
  private route = inject(ActivatedRoute);
  private giphy = inject(GiphyService);
  private http = inject(HttpClient);

  gif = signal<Gif | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  copyLabel = signal('Копіювати посилання');
  downloadLabel = signal('Завантажити');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      this.error.set('Невідомий GIF');
      return;
    }
    this.giphy.getById(id).subscribe({
      next: (g) => {
        this.gif.set(g);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Не вдалося завантажити');
        this.loading.set(false);
      }
    });
  }

  get originalUrl(): string {
    const g = this.gif();
    return g?.images?.original?.url ?? '';
  }

  get displayDate(): string {
    const g = this.gif();
    if (!g?.import_datetime) return '—';
    try {
      const d = new Date(g.import_datetime);
      return d.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return g.import_datetime;
    }
  }

  get author(): string {
    const g = this.gif();
    if (g?.user?.display_name) return g.user.display_name;
    if (g?.user?.username) return g.user.username;
    if (g?.username) return g.username;
    return '—';
  }

  copyLink(): void {
    const url = this.originalUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(
      () => this.copyLabel.set('Скопійовано!'),
      () => this.copyLabel.set('Помилка копіювання')
    );
    setTimeout(() => this.copyLabel.set('Копіювати посилання'), 2000);
  }

  download(): void {
    const g = this.gif();
    const url = this.originalUrl;
    if (!url || !g) return;
    const filename = (g.title || g.id || 'gif').replace(/[^\w\s-]/g, '').trim() || 'gif' + '.gif';
    this.downloadLabel.set('Завантаження...');
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
        this.downloadLabel.set('Завантажено');
        setTimeout(() => this.downloadLabel.set('Завантажити'), 2000);
      },
      error: () => {
        this.downloadLabel.set('Помилка завантаження');
        setTimeout(() => this.downloadLabel.set('Завантажити'), 2000);
      }
    });
  }
}
