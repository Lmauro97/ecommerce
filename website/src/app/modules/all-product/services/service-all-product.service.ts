import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { addProductoCar } from '../interfaces/interfaces-all-product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceAllProductService {
  adicionaProductoCar = new ReplaySubject<any>(1);
  urlBase = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // ********lista de todos los productos********
  getListAllProduct(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}list-product/activo`);
  }
  //verifica si el producto esta en el carrito
  verificarCar(body: any): Observable<any> {
    return this.http.post<any>(`${this.urlBase}shoppingCar/verificarCar`, body);
  }

  // *********adiciona producto al carrito********
  addProductoCar(body: addProductoCar): Observable<any> {
    // Realiza la solicitud HTTP con los encabezados configurados
    return this.http.post<any>(`${this.urlBase}shoppingCar/addProduct`, body);
  }
  // *****envia notificacion de nuevo producto en el carrito********
  notifyNewProduct(): any {
    // console.log('adicionaProductoCar');
    this.adicionaProductoCar.next(true);
  }
  // *******notifica nuevo producto  en el carrito********
  getnotifyNewProduct(): any {
    return this.adicionaProductoCar.asObservable();
  }
}
