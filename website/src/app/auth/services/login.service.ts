import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public modalSubject = new Subject<boolean>();
  public modalEmiter: EventEmitter<any> = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {}

  // **********datos del login**********
  loginUser(body: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}auth/login`, body);
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
