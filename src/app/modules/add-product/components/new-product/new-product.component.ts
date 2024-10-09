import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddProductService } from '../../services/add-product.service';
import { catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { Label } from 'src/app/shared/interfaces/shared-interface';
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent {
  urlImgPrincipal = {
    url: '',
    name: '',
  };
  listImg: any = [];
  listOwner: any = [];
  mensajeError: string = '';
  formCreateProduct: FormGroup;
  listCategory: any = [];
  listEstados: any = [];
  listProviders: any = [];
  archivos: any = [];
  valorSugerido: number = 0;
  labelList: any = [];
  dataListLabel: Label[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private addProductService: AddProductService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.formCreateProduct = this.formBuilder.group({
      nombreProduct: ['', Validators.required],
      categoriaProduct: ['', Validators.required],
      precioCompra: ['', Validators.required],
      precioVenta: ['', Validators.required],
      precioPromocion: '0',
      estado: ['', Validators.required],
      referenciaFabrica: ['', Validators.required],
      proveedor: ['', Validators.required],
      linkMercadoLibre: '',
      linkYoutube: '',
      stock: ['', Validators.required],
      descripcion: ['', Validators.required],
      caracteristicas: ['', Validators.required],
      fechaCompra: ['', Validators.required],
      activaPromo: false,
      pesoTotal: ['', Validators.required],
      owner: ['', Validators.required], //dueño
      label: '',
    });

    this.getCategoriaList();
    this.getListState();
    this.getListProveedores();
    this.getListaOwner();
    this.getLabelList();
  }

  // *************lista de categorias********
  getCategoriaList() {
    this.addProductService
      .getListCategory()
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`${error}, Error al cargar las categorias`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        this.listCategory = resp;
      });
  }
  // ****lista de estados**********
  getListState() {
    this.addProductService
      .getListState()
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`${error}, Error al cargar los estados`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        this.listEstados = resp;
      });
  }

  // ****lista de proveedores**********
  getListProveedores() {
    this.addProductService
      .getLisProviders()
      .pipe(
        catchError((error) => {
          console.log(`${error}, Error al cargar los proveedores`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        this.listProviders = resp;
      });
  }
  // ********lista de dueños**********
  getListaOwner() {
    this.addProductService
      .getDataOwner()
      .pipe(
        catchError((error) => {
          console.log(`${error}, Error al cargar los dueños`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        this.listOwner = resp;
      });
  }

  // ********metodo para adicionar la etiqueta*********
  addLabel() {
    const label = this.formCreateProduct.value.label.toLowerCase();

    if (!label) {
      return;
    }

    const foundLabel = this.dataListLabel.find(
      (element) => element.nombre.toLowerCase() == label
    );

    if (!foundLabel) {
      this.addProductService
        .addNewLabel({ label: label })
        .pipe(
          catchError((error) => {
            console.log(`${error}, Error al crear la etiqueta `, 'OK');
            return of(null);
          }),
          finalize(() => {
            this.getLabelList();
          })
        )
        .subscribe((resp) => {
          const data = {
            tipo:
              resp.message == 'Nueva etiqueta insertada correctamente'
                ? 'Exito'
                : 'Error',
            message: resp.message,
          };
          this.sharedService.executeMethod.emit(data);
        });
    }

    if (this.labelList.includes(label)) {
      this.mensajeError = 'La etiqueta ya existe';
      setTimeout(() => {
        this.mensajeError = '';
      }, 3000);
      return;
    }

    this.labelList.push(label);
    this.formCreateProduct.patchValue({
      label: '',
    });
  }

  // ********metodo para editar la etiqueta*********
  editLabel(index: number) {
    this.formCreateProduct.patchValue({
      label: index,
    });
    this.labelList.splice(index, 1);
  }

  //detectar enter
  keyDownEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addLabel();
    }
  }

  // metodo para subir las imagenes
  onFileChange(event: any): void {
    this.urlImgPrincipal = { url: '', name: '' };
    const archivos = event.target.files;
    this.archivos = Array.from(archivos); // Convert FileList to array

    // Obtiene la lista de archivos seleccionados
    const files: FileList = event.target.files;
    // Reinicia la lista de imágenes
    this.listImg = [];

    if (files.length > 5) {
      this.mensajeError = 'Solo se pueden subir máximo 5 imágenes';
      setTimeout(() => {
        this.mensajeError = '';
      }, 3000);
      return;
    }

    // Agrega cada archivo a la lista
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Verifica la extensión del archivo
      if (
        !file.name.toLowerCase().endsWith('.png') &&
        !file.name.toLowerCase().endsWith('.webp')
      ) {
        this.mensajeError = 'Solo se permiten archivos PNG o WEBP';
        setTimeout(() => {
          this.mensajeError = '';
        }, 3000);
        return;
      }

      // Lee el contenido del archivo como base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // Crea un objeto de imagen con la URL de la imagen, el base64 y el nombre del archivo
        const img = {
          url: URL.createObjectURL(file),
          name: file.name,
        };

        // Agrega el objeto de imagen a la lista
        this.listImg.push(img);
      };

      // Lee el contenido del archivo como base64
      reader.readAsDataURL(file);
    }
  }

  // ********metodo para seleccionar la imagen principal*********
  selectImgPrincipal(img: any): void {
    // console.log(img);
    if (img && img) {
      this.urlImgPrincipal = img;
    }
  }

  // precio sugerido minimo 30% mayor al precio de compra
  precioSugerido() {
    const precioCompra = this.formCreateProduct.value.precioCompra;

    if (precioCompra < 30000) {
      this.valorSugerido = precioCompra + 10000;
      return this.formCreateProduct.patchValue({
        precioVenta: precioCompra + 10000,
      });
    }

    if (precioCompra) {
      const precioVenta = precioCompra * 1.3;
      this.valorSugerido = precioVenta;
      this.formCreateProduct.patchValue({
        precioVenta: precioVenta,
      });
    }
  }
  // *********metodo para enviar el formulario*********
  onSubmit(): void {
    if (this.formCreateProduct.invalid) {
      this.formCreateProduct.markAllAsTouched();
      return;
    }
    if (!this.validatePrecioPromocion()) {
      this.formCreateProduct.markAllAsTouched();
      return;
    }
    if (this.listImg.length < 1 && !this.urlImgPrincipal.name) {
      this.mensajeError = 'Debe subir al menos una imagen';
      setTimeout(() => {
        this.mensajeError = '';
      }, 3000);
      return;
    }

    // Validar que el precio de promoción esté lleno si la promoción está activa
    if (
      !this.formCreateProduct.value.precioPromocion &&
      this.formCreateProduct.value.activaPromo
    ) {
      this.mensajeError = 'Debe ingresar el precio de promoción';
      setTimeout(() => {
        this.mensajeError = '';
      }, 3000);
      return;
    }
    const formularioImg = new FormData();

    this.archivos.forEach((archivo: File) => {
      formularioImg.append('listImg', archivo);
    });

    formularioImg.append(
      'nombreProduct',
      this.formCreateProduct.value.nombreProduct
    );
    formularioImg.append(
      'categoriaProduct',
      this.formCreateProduct.value.categoriaProduct
    );
    formularioImg.append(
      'precioCompra',
      this.formCreateProduct.value.precioCompra
    );
    formularioImg.append(
      'precioVenta',
      this.formCreateProduct.value.precioVenta
    );
    formularioImg.append(
      'precioPromocion',
      this.formCreateProduct.value.precioPromocion
    );
    formularioImg.append('estado', this.formCreateProduct.value.estado);
    formularioImg.append(
      'referenciaFabrica',
      this.formCreateProduct.value.referenciaFabrica
    );
    formularioImg.append('proveedor', this.formCreateProduct.value.proveedor);
    formularioImg.append(
      'linkMercadoLibre',
      this.formCreateProduct.value.linkMercadoLibre
    );
    formularioImg.append('stock', this.formCreateProduct.value.stock);
    formularioImg.append(
      'descripcion',
      this.formCreateProduct.value.descripcion
    );
    formularioImg.append(
      'caracteristicas',
      this.formCreateProduct.value.caracteristicas
    );
    formularioImg.append('urlImgPrincipal', this.urlImgPrincipal.name);
    formularioImg.append(
      'fechaCompra',
      this.formCreateProduct.value.fechaCompra
    );
    formularioImg.append(
      'linkYoutube',
      this.formCreateProduct.value.linkYoutube
    );

    formularioImg.append(
      'activaPromo',
      this.formCreateProduct.value.activaPromo
    );

    formularioImg.append('pesoTotal', this.formCreateProduct.value.pesoTotal);
    formularioImg.append('owner', this.formCreateProduct.value.owner);

    let labelList = JSON.stringify(this.labelList);
    labelList = labelList.replace(/"/g, '');
    labelList = labelList.replace('[', '');
    labelList = labelList.replace(']', '');
    formularioImg.append('label', labelList);

    this.addProductService
      .addProductoNew(formularioImg)
      .pipe(
        catchError((error) => {
          console.log(`${error}, Error al crear el producto`, 'OK ');
          return of(null);
        })
      )
      .subscribe((resp) => {
        console.log(resp);
        if (resp == 'Producto Registrado') {
          this.valorSugerido = 0;
          this.router.navigate(['productos/lista']);
        }
      });
  }

  ///limpia el formulario
  clearform() {
    this.formCreateProduct.reset();
    this.urlImgPrincipal = { url: '', name: '' };
    this.listImg = [];
    this.valorSugerido = 0;
  }

  validatePrecioPromocion() {
    if (
      this.formCreateProduct.value.activaPromo === true &&
      (this.formCreateProduct.value.precioPromocion <= 0 ||
        this.formCreateProduct.value.precioPromocion === '')
    ) {
      this.formCreateProduct.patchValue({
        precioPromocion: '',
      });

      this.formCreateProduct
        .get('precioPromocion')
        ?.setValidators([Validators.required]);

      this.formCreateProduct.get('precioPromocion')?.setErrors({
        incorrect: true,
      });

      return false;
    } else {
      return true;
    }
  }

  getLabelList() {
    this.sharedService
      .getLabel()
      .pipe(
        catchError((error) => {
          console.log(`${error}, Error al cargar las etiquetas`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        if (resp) {
          this.dataListLabel = resp.label.sort((a, b) => {
            return a.nombre.localeCompare(b.nombre);
          });
        }
      });
  }

  limpiarPuntosPrecios(inputName: string, value: any) {
    if (value) {
      this.formCreateProduct.patchValue({
        [inputName]: value.replace(/\./g, ''),
      });
    }
  }
}
