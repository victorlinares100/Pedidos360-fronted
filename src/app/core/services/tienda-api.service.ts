import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TiendaBackend } from '../models/tienda-api.model';

@Injectable({ providedIn: 'root' })
export class TiendaApiService {
  private baseUrl = `${environment.apiUrlInventario}/tiendas`;

  constructor(private http: HttpClient) {}

  getTiendas(): Observable<TiendaBackend[]> {
    return this.http.get<TiendaBackend[]>(this.baseUrl);
  }

  getTiendaPorId(id: number): Observable<TiendaBackend> {
    return this.http.get<TiendaBackend>(`${this.baseUrl}/${id}`);
  }
}