import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AddProductService {
  constructor(private http: HttpClient) {}

  // *********lista de categorias********
  getListCategory(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}categoria`);
  }
  // *********lista de estados********
  getListState(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}list/state`);
  }

  // *****lista de proveedores********
  getLisProviders(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}list/providers`);
  }

  // *********adiciona producto nuevo********
  addProductoNew(body: any): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}product/crearProducto`,
      body
    );
  }
  // *********Editar producto ********
  editProducto(body: any): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}product/EditProducto`,
      body
    );
  }

  // ********lista de todos los productos********
  getListAllProduct(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}list-product/`);
  }
  // ***********trae los datos del producto que se va a editar**********
  getDataProductEdit(id: any): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrl}product/detalleProductEdit/${id}`
    );
  }

  // ***********trae los propietarios**********
  getDataOwner(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}list/owner`);
  }

  addNewLabel(labelNew: any): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}list/insertLabel`,
      labelNew
    );
  }
}
