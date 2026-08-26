import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductoBackend } from '../models/producto-api.model';

@Injectable({ providedIn: 'root' })
export class ProductoApiService {
  private baseUrl = `${environment.apiUrlInventario}/productos`;

  constructor(private http: HttpClient) {}

  getProductos(): Observable<ProductoBackend[]> {
    return this.http.get<ProductoBackend[]>(this.baseUrl);
  }

  getProductoPorId(id: number): Observable<ProductoBackend> {
    return this.http.get<ProductoBackend>(`${this.baseUrl}/${id}`);
  }

  crearProducto(producto: Omit<ProductoBackend, 'idProducto'>): Observable<ProductoBackend> {
    return this.http.post<ProductoBackend>(this.baseUrl, producto);
  }

  actualizarProducto(id: number, producto: Partial<ProductoBackend>): Observable<ProductoBackend> {
    return this.http.put<ProductoBackend>(`${this.baseUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}