import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
} from '@angular/core';

import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { ServiceDetailService } from '../service-detail.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { addProductoCar } from '../../all-product/interfaces/interfaces-all-product';
import { catchError, of } from 'rxjs';
import { ServiceAllProductService } from '../../all-product/services/service-all-product.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent {
  rutaImagenZoom = '';
  imagenVisible = false;
  @ViewChildren('imageElement') imageElements!: QueryList<ElementRef>;
  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;
  @ViewChild('videoFrame', { static: true }) videoFrame: ElementRef | undefined;

  @ViewChild('cantidad') cantidad!: ElementRef | undefined;
  urlDetail: any = {};
  highlightPosition = { x: 0, y: 0 };
  highlightVisible = false;
  backgroundPosition: any;
  imgmediosPago = [
    {
      url: '../assets/img/logos pagina/254f9960-57b9-11e8-a82b-59483d0f8e12-m.svg',
      alt: 'pse',
    },
    {
      url: '../assets/img/logos pagina/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg',
      alt: 'visa',
    },
    {
      url: '../assets/img/logos pagina/aa2b8f70-5c85-11ec-ae75-df2bef173be2-m.svg',
      alt: 'mastercard',
    },
    {
      url: '../assets/img/logos pagina/e5ee1d00-f39b-11eb-8e0d-6f4af49bf82e-m.svg',
      alt: 'efecty',
    },
    {
      url: '../assets/img/logos pagina/f1fc5b20-f39b-11eb-a186-1134488bf456-m.svg',
      alt: 'codensa',
    },
  ];
  msmAddProduct: string = '';
  idProducto: any;
  constructor(
    private cd: ChangeDetectorRef,
    private serviceDetail: ServiceDetailService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private ServiceAllProductService: ServiceAllProductService,
    private sharedService: SharedService,
    private LoginService: LoginService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let valueParametro = params.get('id'); // Asume que el parámetro se llama 'id'
      const parts = valueParametro!.split('-');
      this.idProducto = parts.pop();
      if (this.idProducto) {
        this.serviceDetail.getDetail(this.idProducto).subscribe((data) => {
          const x = data;
          this.urlDetail = {
            urlMain: x[0].fotoPrincipal,
            url: x[0].listFotos,
            title: x[0].tituloProducto,
            price: x[0].precio,
            precioPromocion: x[0].precioPromocion,
            carapteristicas: x[0].caracteristicas,
            descripcion: x[0].descripcion,
            stock: x[0].stock,
            on_promocion: x[0].on_promocion,
            url_video: x[0].url_video || null,
            link_mercado_libre: x[0].link_mercado_libre || null,
          };
          this.cd.detectChanges();
        });
      }
    });
  }
  activeSlideIndex = 0;

  goToSlide(index: number) {
    this.activeSlideIndex = index;
  }
  onMouseMove(event: MouseEvent, imageElement: HTMLImageElement) {
    //se debe habilitar en el html 
    // class="image-container"
    //             (mousemove)="onMouseMove($event, imageElement)"
    //             (mouseleave)="onMouseLeave($event)"
    const rect = imageElement.getBoundingClientRect();
    const highlightWidth = imageElement.width * 0.5; // 50%
    const highlightHeight = imageElement.height * 0.4; // 40%
    this.highlightPosition.x = event.clientX - rect.left - highlightWidth / 2;
    this.highlightPosition.y = event.clientY - rect.top - highlightHeight / 2;
    this.highlightVisible = true;
    this.rutaImagenZoom = imageElement.src;
    this.imagenVisible = true;
    const x = ((event.clientX - rect.left) / imageElement.offsetWidth) * 100;
    const y = ((event.clientY - rect.top) / imageElement.offsetHeight) * 100;
    this.backgroundPosition = `${x}% ${y}%`;
  }

  onMouseLeave(event: MouseEvent) {
    this.highlightVisible = false;
    this.imagenVisible = false;
  }
  onMouseOver(imageUrl: string) {
    this.rutaImagenZoom = imageUrl;
    this.imagenVisible = true;
  }

  onMouseOut() {
    this.imagenVisible = false;
  }

  //cierra el modal y detiene el video
  closeModal() {
    // Obtén el elemento de video
    let videoElement: HTMLVideoElement = document.querySelector('video')!;

    // Detén el video
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  }
  // *************adiciona producto al carrito********
  addProductoCar(idProducto: any) {
    if (this.cantidad!.nativeElement.value > this.urlDetail.stock) {
      this.msmAddProduct = 'La cantidad supera el stock disponible';
      setTimeout(() => {
        this.msmAddProduct = '';
      }, 3500);
      return;
    }

    const body: addProductoCar = {
      id_product: idProducto,
      amount: parseInt(this.cantidad!.nativeElement.value),
    };

    this.serviceDetail
      .addProductoCar(body)
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`${error}, Error al cargar los registros`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        //manejo de respuesta
        if (
          resp == 'Cantidad Actualizada' ||
          resp == 'Producto Agregado Con Exito'
        ) {
          this.ServiceAllProductService.notifyNewProduct(); //notifica al carrito (MODAL) que se agrego un producto
          this.sharedService.notifyNewNavb(); //notifica al componente navbar que se agrego un producto
          this.msmAddProduct = resp;
          setTimeout(() => {
            this.msmAddProduct = '';
          }, 2500);
        } else if (
          resp == 'Debes iniciar sesión nuevamente' ||
          resp == 'Token modificado o vencido, debes iniciar sesión nuevamente'
        ) {
          this.LoginService.openModal();
          this.msmAddProduct = resp;
          setTimeout(() => {
            this.msmAddProduct = '';
          }, 3500);
        } else {
          this.msmAddProduct = resp;
          setTimeout(() => {
            this.msmAddProduct = '';
          }, 3500);
        }
      });
  }
}
