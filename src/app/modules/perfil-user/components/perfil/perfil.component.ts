import { Component, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { PerfilUserServiceService } from '../../service/perfil-user-service.service';
import { catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent {
  dataUserPerfil: any = {};
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  errorImg: boolean = false;
  msmErrorImg: string = '';
  tracking: boolean = true;
  billing: boolean = false;
  pqrs_user: boolean = false;
  deliveries: boolean = false;
  returns_user: boolean = false;
  rolesUser: { [key: string]: string } = {};

  constructor(
    private PerfilUserServiceService: PerfilUserServiceService,
    private router: Router
  ) {
    this.getDataUserPerfil();
  }

  openModal() {
    this.PerfilUserServiceService.executeMethod.emit();
  }

  //datos del usuario logeado
  getDataUserPerfil() {
    this.PerfilUserServiceService.getDataUserPerfil()
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`Error al cargar los datos del perfil del usuario`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        if (resp === null || resp === 'Debes iniciar sesión nuevamente') {
          this.router.navigate(['/home']);
          return;
        }

        this.dataUserPerfil = resp[0];

        const roles = this.dataUserPerfil.roles.split(',');
        for (let i = 0; i < roles.length; i++) {
          const nombreProiedad = `nombreRol${i}`;
          this.rolesUser[nombreProiedad] = roles[i];
          this.dataUserPerfil.photo = this.dataUserPerfil.photo.includes(
            'imgDefaulRegiter.png'
          )
            ? '../assets/img/imgDefaulRegiter.png'
            : this.dataUserPerfil.photo;
        }
      });
  }

  //evento para abrir el input file
  openFileInput() {
    this.fileInput?.nativeElement.click();
  }

  //evento para subir imagen nueva
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar que la imagen sea menor a 2MB
      if (file.size > 2097152) {
        this.errorImg = true;
        this.msmErrorImg = 'La imagen es muy grande';
        return;
      }
      // Validar que la imagen sea de tipo png
      if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') {


      }else{
        this.errorImg = true;
        this.msmErrorImg = 'La imagen debe estar en uno de los siguientes formatos PNG,JPG,JPEG';
        return;
      }
      this.errorImg = false;

      let archivos = event.target.files;

      let formularioImg = new FormData();
      formularioImg.append('listImg', archivos[0]);

      this.PerfilUserServiceService.uploadImgPerfil(formularioImg)
        .pipe(
          catchError((error) => {
            console.log(`${error}, Error al subir la imagen`, 'OK');
            return of(null);
          }),
          finalize(() => {
            this.getDataUserPerfil();
          })
        )
        .subscribe((resp) => {
          if (resp === null) {
            return;
          }
        });
    }
  }

  //evento para mostrar las opciones del perfil
  activateOption(option: string) {
    this.tracking = option === 'tracking' ? true : false;
    this.billing = option === 'billing' ? true : false;
    this.pqrs_user = option === 'pqrs_user' ? true : false;
    this.deliveries = option === 'deliveries' ? true : false;
    this.returns_user = option === 'returns_user' ? true : false;
  }
}
