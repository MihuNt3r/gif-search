import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { GIPHY_API_KEY } from '../env.generated';
import type { Gif, GiphySearchResponse, GiphySingleResponse } from '../models/gif.model';

const GIPHY_API = 'https://api.giphy.com/v1/gifs';

@Injectable({ providedIn: 'root' })
export class GiphyService {
  http = inject(HttpClient);

  search(query: string, limit = 25, offset = 0): Observable<Gif[]> {
    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('q', query)
      .set('limit', String(limit))
      .set('offset', String(offset));
    return this.http
      .get<GiphySearchResponse>(`${GIPHY_API}/search`, { params })
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Gif> {
    const params = new HttpParams().set('api_key', GIPHY_API_KEY);
    return this.http
      .get<GiphySingleResponse>(`${GIPHY_API}/${id}`, { params })
      .pipe(map((res) => res.data));
  }
}
