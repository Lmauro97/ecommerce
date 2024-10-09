import { Component } from '@angular/core';
import { PerfilUserServiceService } from '../../service/perfil-user-service.service';
import { catchError, of, pipe } from 'rxjs';
import { pqrs } from '../../interface/interface-user_perfil';
@Component({
  selector: 'app-pqrs-user',
  templateUrl: './pqrs-user.component.html',
  styleUrls: ['./pqrs-user.component.css'],
})
export class PqrsUserComponent {
  listPqrs: pqrs[] = [];
  totalPqrs: number = 0;

  constructor(private PerfilUserServiceService: PerfilUserServiceService) {
    this.getListPqrsUser();
  }

  ngOnInit(): void {
    this.getListPqrsUser();
  }

  getListPqrsUser() {
    this.PerfilUserServiceService.getListPqrsUser()
      .pipe(
        catchError((error) => {
          console.log('Error al cargar el listado de pqrs del usuario', 'OK ');
          return of(null);
        })
      )
      .subscribe((res) => {
        this.listPqrs = res;
        this.totalPqrs = this.listPqrs.length;
      });
  }
}
