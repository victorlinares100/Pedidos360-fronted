import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PedidoBackend } from '../models/pedido-api.model';

@Injectable({ providedIn: 'root' })
export class PedidoApiService {
  private baseUrl = `${environment.apiUrlPedidos}/pedidos`;

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<PedidoBackend[]> {
    return this.http.get<PedidoBackend[]>(this.baseUrl);
  }

  getPedidoPorId(id: number): Observable<PedidoBackend> {
    return this.http.get<PedidoBackend>(`${this.baseUrl}/${id}`);
  }

  crearPedido(pedido: Omit<PedidoBackend, 'idPedido'>): Observable<PedidoBackend> {
    return this.http.post<PedidoBackend>(this.baseUrl, pedido);
  }

  actualizarPedido(id: number, pedido: Partial<PedidoBackend>): Observable<PedidoBackend> {
    return this.http.put<PedidoBackend>(`${this.baseUrl}/${id}`, pedido);
  }

  eliminarPedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}