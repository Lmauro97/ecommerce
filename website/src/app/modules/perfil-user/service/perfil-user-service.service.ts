import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { purchaseUser } from '../interface/interface-user_perfil';
@Injectable({
  providedIn: 'root',
})
export class PerfilUserServiceService {
  public executeMethod: EventEmitter<any> = new EventEmitter<any>();
  public fotoPerfil: Subject<any> = new Subject<any>();
  public listPurchaseUser: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  private http = inject(HttpClient);
  constructor() {}

  // *********trae los datos del usuario para el perfil*******
  getDataUserPerfil(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}user/getUserPerfil`);
  }
  uploadImgPerfil(file: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}user/updateFoto`, file);
  }
  editProfile(body: any): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}user/update`, body);
  }


  //seguimiento de compras
  getPurchaseTrackingUser(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}user/listaCompras`);
  }

  //lista de pqrs de usuario
  getListPqrsUser(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}pqrs/listaUser`);
  }

  //lista de facturas
  getListFacturasUser(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}user/listaFacturas`);
  }
}
