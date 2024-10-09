import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  urlBase = environment.baseUrl;

  public cytiEnvio = new ReplaySubject<any>(1);
  public totalEnvio = new ReplaySubject<any>(1);
  constructor(private http: HttpClient) {}

  // *********envia pago********
  sendPago(body: any): Observable<any> {
    return this.http.post<any>(`${this.urlBase}pagarproduct/`, body);
  }
  // ********lista de todos los productos del usuario********
  getListProductUser(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}listProductUser`);
  }

  // ********lista de los tipos de identidad********
  getListTypeIdentity(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}list/typeIdentity`);
  }
  // ********lista de los departamentos********
  getListDepartament(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}list/departamet`);
  }
  // ********lista de los ciudades********
  getListCity(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}list/city`);
  }

  // ********lista de las tarifas de los envios ********
  getListTarifaEnvio(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}list/tarifa`);
  }

  // ******eliminar producto del carrito*********
  deleteProduct(body: any): Observable<any> {
    return this.http.post<any>(`${this.urlBase}product/deleteProduct`, body);
  }

  // *******Actualizar cantidad de productos********
  updateProduct(body: any): Observable<any> {
    return this.http.post<any>(`${this.urlBase}product/updateProduct`, body);
  }

  // ******Envia el dato de la ciudad de envio para calcular el precio********
  updateCytiEnvio(cyti: any) {
    this.cytiEnvio.next(cyti);
  }
  // *******notifica el cambio de ciudad********
  getnotifycytiEnvio(): any {
    return this.cytiEnvio.asObservable();
  }

  // ******Envia el valor total del envio********
  updateTotalEnvio(totalEnvio: any) {
    this.totalEnvio.next(totalEnvio);
  }
  // *******notifica el cambio de ciudad********
  getnotifyTotalEnvio(): any {
    return this.totalEnvio.asObservable();
  }
}
