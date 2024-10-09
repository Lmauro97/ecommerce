import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { addProductoCar } from '../all-product/interfaces/interfaces-all-product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceDetailService {
  urlBase = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getDetail(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}product/detalleProduct/${id}`);
  }
  // *********adiciona producto al carrito********
  addProductoCar(body: addProductoCar): Observable<any> {
    // Realiza la solicitud HTTP con los encabezados configurados
    return this.http.post<any>(`${this.urlBase}shoppingCar/addProduct`, body);
  }
}
