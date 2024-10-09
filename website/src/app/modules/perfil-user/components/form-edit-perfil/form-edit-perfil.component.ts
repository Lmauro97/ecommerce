import { Component, ElementRef, ViewChild } from '@angular/core';
import { PerfilUserServiceService } from '../../service/perfil-user-service.service';
import { AdminService } from 'src/app/modules/admin/services/admin.service';

import { finalize, Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { SharedService } from '../../../../shared/service/shared.service';
import { CheckoutService } from 'src/app/modules/checkout/service/checkout.service';
@Component({
  selector: 'app-form-edit-perfil',
  templateUrl: './form-edit-perfil.component.html',
  styleUrls: ['./form-edit-perfil.component.css'],
})
export class FormEditPerfilComponent {
  form: any;
  listDepart: any = [];
  listCityGlobal: any = [];
  listCity: any = [];
  dataUser: any = [];
  typeDoc: any = [];
  @ViewChild('checkoutLink') cerrarModalPerfil!: ElementRef;
  // private subscription: Subscription;

  constructor(
    private PerfilUserServiceService: PerfilUserServiceService,
    private fb: FormBuilder,
    private AdminService: AdminService,
    private sharedService: SharedService,
    private checkoutService: CheckoutService
  ) {
    this.form = this.fb.group({
      address: [''],
      identification_card: [''],
      last_name: [''],
      mail: [''],
      name_city: [''],
      names: [''],
      names_department: [''],
      phone: [''],
      tipo_identificacion: [''],
    });
    // this.subscription = this.PerfilUserServiceService.executeMethod.subscribe(
    //   (data: any) => {
    //     console.log('btn ok3');
    //   }
    // );
    this.checkoutService.getListTypeIdentity().subscribe({
      next: (data: any) => {
        this.typeDoc = data;
      },
      error: (error: any) => {
        console.log('error');
      },
    });
    //llamo a los departamentos
    this.AdminService.getListDepartament().subscribe({
      next: (data: any) => {
        this.listDepart = data;
        //llamo a las ciudades
        this.AdminService.getListCity().subscribe({
          next: (data: any) => {
            this.listCityGlobal = data;
            //llamo los datos del usuario
            this.PerfilUserServiceService.getDataUserPerfil().subscribe({
              next: (data: any) => {
                this.dataUser = data;
                const departament = this.listDepart.find(
                  (item: any) =>
                    item.names_department === data[0].names_department
                );
                const city = this.listCityGlobal.find(
                  (item: any) => item.name_city === data[0].name_city
                );
                this.listCity = this.listCityGlobal.filter(
                  (item: any) => item.id_department == city.id_department
                );
                const tipoDoc = this.typeDoc.find(
                  (item: any) => item.names_card == data[0].tipo_identificacion
                );
                this.form.patchValue({
                  last_name: data[0].last_name,
                  names: data[0].names,
                  tipo_identificacion: tipoDoc.id,
                  identification_card: data[0].identification_card,
                  mail: data[0].mail,
                  names_department: departament.id,
                  name_city: city.id,
                  phone: data[0].phone,
                  address: data[0].address,
                });
                this.disabledGenerate([
                  'mail',
                  'identification_card',
                  'phone',
                  'tipo_identificacion',
                ]);
              },
              error: (error: any) => {
                console.log('error');
              },
            });
          },
          error: (error: any) => {
            console.log('error');
          },
        });
      },
      error: (error: any) => {
        console.log('error');
      },
    });
  }
  disabledGenerate(fields: string[]): void {
    fields.forEach((field) => {
      this.form.get(field)?.disable();
    });
  }

  selectDepartament() {
    const id = this.form.get('names_department').value;
    this.listCity = this.listCityGlobal.filter(
      (item: any) => item.id_department == id
    );
  }

  closeAndNavigate() {
    const body = {
      names: this.form.get('names').value,
      last_name: this.form.get('last_name').value,
      id_department: parseInt(this.form.get('names_department').value, 10),
      id_city: parseInt(this.form.get('name_city').value, 10),
      address: this.form.get('address').value,
    };
    this.PerfilUserServiceService.editProfile(body)
      .pipe(
        finalize(() => {
          window.location.reload();
        })
      )
      .subscribe({
        next: (data: any) => {
          const message = {
            tipo: 'Exito',
            message: 'Datos actualizados correctamente',
          };
          this.sharedService.executeMethod.emit(message);
        },
        error: (error: any) => {
          // console.log('error');
        },
      });
  }
}
