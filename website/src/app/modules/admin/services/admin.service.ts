import { HttpClient } from '@angular/common/http';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  executeMethod: EventEmitter<any> = new EventEmitter<any>();
  executeMethodOpenEdit: EventEmitter<any> = new EventEmitter<any>();
  // ordenes no entregadas
  totalOrderNew: EventEmitter<any> = new EventEmitter<any>();

  getListOrdes(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}analitics/ordersList`);
  }

  // ********lista de los tipos de identidad********
  getListTypeIdentity(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}list/typeIdentity`);
  }
  // ********lista de los departamentos********
  getListDepartament(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}list/departamet`);
  }
  // ********lista de los ciudades********
  getListCity(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}list/city`);
  }
  // ********lista de usuarios********
  getListUser(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}user/lista`);
  }
  // ********lista de todos los productos********
  getListAllProduct(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}list-product/activo`);
  }

  createOrder(data: any): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}analitics/newOrdersList`,
      data
    );
  }

  entregarOrder(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}analitics/entrega`, data);
  }
}
