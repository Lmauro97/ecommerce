import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { catchError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.component.html',
  styleUrls: ['./pqrs.component.css'],
})
export class PqrsComponent {
  formPqrs: FormGroup;
  archivos: any = [];
  mensajeError: string = '';
  smsResp: any = '';
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder
  ) {
    this.formPqrs = this.formBuilder.group({
      tipoSolicitud: ['', Validators.required],
      detalleTramite: ['', Validators.required],
      file: ['', Validators.required],
    });
  }

  listPqrs: any = [];
  ngOnInit() {
    this.getListPqrs();
  }

  // ********lista de todos los tipos de pqrs********
  getListPqrs() {
    this.sharedService
      .getListPqrs()
      .pipe(
        catchError((error) => {
          console.log(error);
          return error;
        })
      )
      .subscribe((data) => {
        this.listPqrs = data;
      });
  }
  // metodo para enviar el formulario
  sendForm() {
    if (this.formPqrs.invalid) {
      this.formPqrs.markAllAsTouched();
      return;
    }
    const formularioFile = new FormData();
    formularioFile.append('fileSolicitud', this.archivos[0]);
    formularioFile.append('tipoSolicitud', this.formPqrs.value.tipoSolicitud);
    formularioFile.append('detalleTramite', this.formPqrs.value.detalleTramite);

    this.sharedService
      .sendPqrs(formularioFile)
      .pipe(
        catchError((error) => {
          console.log(error);
          return error;
        })
      )
      .subscribe((resp) => {
        this.smsResp = resp;

        if (resp.includes('Pqrs Registrado')) {
          this.formPqrs.reset();
          this.archivos = [];
          this.mensajeError = '';
          this.closeBtn.nativeElement.click();
        }
        setTimeout(() => {
          this.smsResp = '';
        }, 3000);

        const alert = {
          tipo: resp.includes('Pqrs Registrado') ? 'Exito' : 'Error',
          message: resp,
        };
        this.sharedService.executeMethod.emit(alert);
      });
  }

  // metodo para subir archivos
  onFileChange(event: any): void {
    this.archivos = event.target.files;
    // Verifica la extensión del archivo
    if (
      !this.archivos[0].name.toLowerCase().endsWith('.png') &&
      !this.archivos[0].name.toLowerCase().endsWith('.pdf')
    ) {
      this.mensajeError = 'Solo se permiten archivos PNG o PDF';
      setTimeout(() => {
        this.formPqrs.patchValue({
          file: '',
        });

        this.mensajeError = '';
      }, 3000);
      return;
    } else if (this.archivos[0].size > 2097152) {
      this.mensajeError = 'El archivo no debe superar los 2MB';
      setTimeout(() => {
        this.formPqrs.patchValue({
          file: '',
        });

        this.mensajeError = '';
      }, 3000);
      return;
    } else {
      this.mensajeError = '';
    }
  }
  limpiarFor() {
    this.formPqrs.reset();
    this.archivos = [];
    this.mensajeError = '';
  }
}
