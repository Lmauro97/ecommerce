import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { AddProductService } from '../../services/add-product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../shared/service/shared.service';
import { Label } from '../../../../shared/interfaces/shared-interface';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent {
  urlImgPrincipal = {
    url: '',
    name: '',
  };
  listImg: any = [];
  mensajeError: string = '';
  formCreateProduct: FormGroup;
  listCategory: any = [];
  listEstados: any = [];
  listProviders: any = [];
  archivos: any = [];
  dataProduct: any = [];
  listOwner: any = [];

  idProductEdit: any;
  labelList: any = [];
  dataListLabel: Label[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private addProductService: AddProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.formCreateProduct = this.formBuilder.group({
      nombreProduct: ['', Validators.required],
      categoriaProduct: ['', Validators.required],
      precioCompra: ['', Validators.required],
      precioVenta: ['', Validators.required],
      precioPromocion: '',
      estado: ['', Validators.required],
      referenciaFabrica: ['', Validators.required],
      proveedor: ['', Validators.required],
      linkMercadoLibre: '',
      linkYoutube: '',
      stock: ['', Validators.required],
      descripcion: ['', Validators.required],
      caracteristicas: ['', Validators.required],
      activaPromo: false,
      pesoTotal: ['', Validators.required],
      owner: ['', Validators.required],
      label: '',
    });

    this.getCategoriaList();
    this.getListState();
    this.getListProveedores();
    this.getListaOwner();
    this.getLabelList();
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idProductEdit = params.get('id');
      if (this.idProductEdit) {
        this.addProductService
          .getDataProductEdit(this.idProductEdit)
          .pipe(
            catchError((error) => {
              console.log(
                `${error}, Error al cargar los daots del producto`,
                'OK'
              );
              return of(null);
            }),

            finalize(() => {
              const linkMercadoLibre =
                this.dataProduct[0].linkMercadoLibre !== ''
                  ? this.dataProduct[0].linkMercadoLibre
                  : '';
              this.urlImgPrincipal = {
                url: this.dataProduct[0].main_photo,
                name: '',
              };

              this.labelList = this.dataProduct[0].label.split(',');
              //carga los datos al formulario
              this.formCreateProduct.patchValue({
                nombreProduct: this.dataProduct[0].nombreProduct,
                categoriaProduct: this.dataProduct[0].categoriaProduct,
                precioCompra: this.dataProduct[0].precioCompra,
                precioVenta: this.dataProduct[0].precioVenta,
                precioPromocion: this.dataProduct[0].precioPromocion,
                estado: this.dataProduct[0].estado,
                referenciaFabrica: this.dataProduct[0].referenciaFabrica,
                proveedor: this.dataProduct[0].proveedor,
                linkMercadoLibre: linkMercadoLibre,
                stock: this.dataProduct[0].stock,
                descripcion: this.dataProduct[0].descripcion,
                caracteristicas: this.dataProduct[0].caracteristicas,
                owner: this.dataProduct[0].id_owner,
                linkYoutube: this.dataProduct[0].linkYoutube,
                activaPromo: this.dataProduct[0].on_promocion,
                pesoTotal: this.dataProduct[0].peso_total,
              });
            })
          )
          .subscribe((resp) => {
            this.dataProduct = resp;
          });
      }
    });
  }

  // *************lista de dueños********
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

  // metodo para subir las imagenes
  onFileChange(event: any): void {
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
        this.mensajeError = 'Solo se permiten archivos PNG';
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

  // *********metodo para enviar el formulario*********
  onSubmit(): void {
    const formularioImg = new FormData();

    if (!this.validatePrecioPromocion()) {
      this.formCreateProduct.markAllAsTouched();
      return;
    }

    this.archivos.forEach((archivo: File) => {
      formularioImg.append('listImg', archivo);
    });

    formularioImg.append('idProductEdit', this.idProductEdit);
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
    if (labelList.charAt(0) === ',') {
      labelList = labelList.substring(1);
    }

    formularioImg.append('label', labelList);

    this.addProductService
      .editProducto(formularioImg)
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`${error}, Error al crear el producto`, 'OK');
          return of(null);
        }),
        finalize(() => {})
      )
      .subscribe((resp) => {
        this.router.navigate(['productos/lista']);
      });
  }

  // ********metodo para adicionar la etiqueta*********
  addLabel() {
    const label = this.formCreateProduct.value.label.trim().toLowerCase();

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

  getLabelList() {
    this.sharedService
      .getLabel()
      .pipe(
        catchError((error) => {
          console.log(`${error}, Error al cargar las etiquetas`, 'OK');
          return of(null);
        }),
        finalize(() => {
          // console.log('finalizo la carga de etiquetas');
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
}
