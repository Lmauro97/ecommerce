import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LabelList } from '../interfaces/shared-interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  notificaProductoCar = new ReplaySubject<any>(1);
  notificaFilterLabel = new ReplaySubject<any>(1);

  public modalRegisterSubject = new Subject<boolean>();
  public modalRememberSubject = new Subject<boolean>();

  public executeMethod: EventEmitter<any> = new EventEmitter<{
    tipo: string;
    message: string;
  }>(); //para el modal alert

  urlBase = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // ********lista de todos los productos********
  getListTopProduct(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}list-product/topProduct`);
  }

  // ********lista de todos los productos del usuario********
  getListProductUser(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}listProductUser`);
  }
  // ********lista de todos los tipos de pqrs********
  getListPqrs(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}pqrs/lista`);
  }

  // *****envia notificacion de nuevo producto en el carrito********
  notifyNewNavb(): any {
    // console.log('adicionaProductoCar');
    this.notificaProductoCar.next(true);
  }
  // *******notifica nuevo producto  en el carrito********
  getnotifyNewNavb(): any {
    return this.notificaProductoCar.asObservable();
  }

  // *****envia notificacion para el filtro de los productos por etiquetas********
  notifyFilterLabel(label: any) {
    this.notificaFilterLabel.next(label);
  }
  // *******notifica para el filtro de los productos por etiqueta********
  getnotifyFilterLabel(): any {
    return this.notificaFilterLabel.asObservable();
  }

  // *********lista de categorias********
  getListCategory(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}categoria`);
  }
  // *******Registra el nuevo usuario********
  registerUser(body: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}user/nuevo`, body);
  }
  // ******Servicio de los datos para el banner********
  getBanner(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}list-product/productBanner`);
  }
  // ******abre el modal********
  openModalRegister() {
    this.modalRegisterSubject.next(true);
  }
  // *************cierra el modal********
  // closeModalRegister() {
  //   this.modalRegisterSubject.next(false);
  // }

  // ******abre el modal de recordar contraseña********
  openModalRemember() {
    this.modalRememberSubject.next(true);
  }

  //enviar pqrs
  sendPqrs(body: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}pqrs/addPqrs`, body);
  }
  // ******lista de etiquetas********
  getLabel(): Observable<LabelList> {
    return this.http.get<LabelList>(`${this.urlBase}list/label`);
  }

  // ******recuperacion de contraseña********

  rememberPassword(body: any): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}auth/remember-pass`,
      body
    );
  }
}
