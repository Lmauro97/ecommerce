import { Injectable } from '@angular/core';
import { addProductoCar } from '../../all-product/interfaces/interfaces-all-product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  urlBase = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // *********adiciona producto al carrito********
  addProductoCarCategory(body: addProductoCar): Observable<any> {
    return this.http.post<any>(`${this.urlBase}shoppingCar/addProduct`, body);
  }

  // ********lista de todos los productos por categoria********
  getListProductCategoria(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlBase}list-product/categoria/${id}`);
  }
}
