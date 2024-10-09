import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  urlBase = environment.baseUrl;

  private modalSubject = new Subject<boolean>();
  modalObservable = this.modalSubject.asObservable();
  constructor(private http: HttpClient) {}

  // ********lista de todos los productos del usuario********
  getListProductUser(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}listProductUser`);
  }
  // ******eliminar producto del carrito*********
  deleteProduct(body: any): Observable<any> {
    return this.http.post<any>(`${this.urlBase}product/deleteProduct`, body);
  }

  // *******Actualizar cantidad de productos********
  updateProduct(body: any): Observable<any> {
    return this.http.post<any>(`${this.urlBase}product/updateProduct`, body);
  }
  // ******abre el modal********
  openModal() {
    this.modalSubject.next(true);
  }
  // *************cierra el modal********
  closeModal() {
    this.modalSubject.next(false);
  }
}
