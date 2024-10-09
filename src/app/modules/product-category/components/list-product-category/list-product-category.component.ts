import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { dataListProduct } from '../../interface/interface-product';
import { CategoryService } from '../../service/category.service';
import { addProductoCar } from 'src/app/modules/all-product/interfaces/interfaces-all-product';
import { catchError, of } from 'rxjs';
import { ServiceAllProductService } from 'src/app/modules/all-product/services/service-all-product.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-list-product-category',
  templateUrl: './list-product-category.component.html',
  styleUrls: ['./list-product-category.component.css'],
})
export class ListProductCategoryComponent {
  listProduct: dataListProduct[] = [
    {
      idProduct: 1,
      newProduct: true,
      images:
        '../../../../../assets/img/img-product/Dinosaurio Lanza Fuego.png',
      category: 'Juegos y juguetes',
      nameProduct: 'Dinosaurio Lanza Fuego',
      descriptionProduct:
        'Este increíble dinosaurio terrorífico le dará a tus hijos tardes enteras de diversión. Podrán disfrutar enormemente de sus luces y con su rugido podrán asustar a sus amigos. Además pone huevos, es ideal para un regalo de cumpleaños, navidad o para una ocasión especial. • Al dinosaurio se le añade agua y se introducen los huevos, al encenderse podrá caminar y sacar agua en spray por su boca mientras ruge y pone huevos.• Hecho de plástico 100% resistente no tóxico.• El dinosaurio pone huevos y saca vapor de su boca.• Requiere 3 pilas "AA" (No incluidas)• Tiene luces y sonido.• El producto incluye el dinosaurio con sus luces y sonido, dos huevos y un envase para colocar agua.• Dimensión del juguete 47x28x14cm',
      priceProduct: 64900,
      stock: 15,
    },
    {
      idProduct: 2,
      newProduct: true,
      images:
        '../../../../../assets/img/img-product/carro moto electrico niños.png',
      category: 'Juegos y juguetes',
      nameProduct: 'carro moto eléctrico niños',
      descriptionProduct:
        'puerto usb auxiliar de audio prendido sonido de motor puertas se abren con seguroswing luces traseras y y delanteras en led rin de lujo botones en el timon musica incorporada bluetooth control remoto, pedal, bateria 6v cargador 110 3 motores amortiguador arnes de seguridad 1 puntoedad sugerida: 1.5 a 5 años largo: 103 cmancho: 60 cmalto : 51 cm kidshoptiendavirtual especialista en hacerte feliz a ti y tus hijos',
      priceProduct: 810900,
      stock: 5,
    },
    {
      idProduct: 3,
      newProduct: false,
      images:
        '../../../../../assets/img/img-product/patineta scooter monopatin vapor humo.png',
      category: 'Juegos y juguetes',
      nameProduct: 'patineta scooter monopatin vapor humo',
      descriptionProduct:
        'Novedosa patineta scooter kids eléctrica con luces led y humo de colores características diseño: 3 ruedas. ruedas: poliuretano alta densidad, actualizables con luces. mango: aluminio - altura ajustable. agarre: suave. batería: litio 3,7 v. freno: pie en la llanta trasera. carga: cable usb. edad: niños y niñas de 3 a 10 años. turbias: producen humo y tienen luces. música: 3 tipos de sonido diferentes. características: para que la patineta produzca vapor se deben llenar los tanques con agua y cargar la batería. tiempo de carga: 160 minutos. tamaño: ajustable de 65 cm y hasta 85 cm.',
      priceProduct: 227600,
      stock: 5,
    },
    {
      idProduct: 4,
      newProduct: true,
      images:
        '../../../../../assets/img/img-product/Juego De Mesa Monos Locos Diversión.png',
      category: 'Juegos y juguetes',
      nameProduct: 'Juego De Mesa Monos Locos Diversión',
      descriptionProduct:
        'Bienvenidos a Tienda Qcarachitos Venimos a Traerte gran variedad en artículos para encantar tu día. #LoQuieroLoEncuentroEnQcarachitos Este juego es muy divertido de jugar, ¡toda una monada! El objetivo es evitar que los monos se caigan del árbol durante tu turno. Crea una red de varitas de colores a través del árbol y coloca a los monos en su interior. Después, lanza el dado y tomen turnos para quitar una varilla a la vez, del color que indique el dado. El menor de los jugadores empieza. Si en el dado te sale un color del que ya se sacaron todas las varillas, es tu día de suerte, ya que te saltas ese turno. Ten cuidado: si haces un movimiento en falso, los monos se caerán y deberás agregarlos a tu cuenta. El jugador que derribe menos monos gana. Incluye 30 monos, 30 varillas de diversos colores , 1 tapete de árbol, 2 tronco de árbol y un dado especial. De 2 a 4 jugadores. Tienda Qcarachitos Artículos para encantar tu día. Ventas al mayor y al detal ofreciendo una gran variedad en productos de alta calidad para tu mayor seguridad, escríbenos y recibe las mejores ofertas',
      priceProduct: 64800,
      stock: 18,
    },
    {
      idProduct: 5,
      newProduct: true,
      images:
        '../../../../../assets/img/img-product/set de arte maleta metálica 145 piezas rosa.png',
      category: 'Juegos y juguetes',
      nameProduct: 'set de arte maleta metálica 145 piezas rosa',
      descriptionProduct:
        'set de arte maleta metálica unicornio, vienen 145 piezas, colores, crayones, marcadores, pinturas, mezcladores, lápices, botadores, zacapuntas, pinceles. garantía no cuenta con garantía solo revisar que llegue en perfeto estado de no ser asi se realiza el cambio',
      priceProduct: 19800,
      stock: 22,
    },
  ];
  @Input() productCategoria: any;
  @ViewChild('cantidad') cantidad: ElementRef | undefined;
  productCategoriaFin: any;
  msmAddProduct: string = '';
  idProducto: string = '';
  alertProductosEmpty: string = '';
  constructor(
    private CategoryService: CategoryService,
    private ServiceAllProductService: ServiceAllProductService,
    private sharedService: SharedService,
    private LoginService: LoginService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.alertProductosEmpty = '';
    if (
      changes['productCategoria'] &&
      changes['productCategoria'].currentValue
    ) {
      this.productCategoriaFin = this.productCategoria;
      if (this.productCategoriaFin.length == 0) {
        this.alertProductosEmpty = 'No hay productos en esta categoria';
      }
    }
  }
  // *************adiciona producto al carrito********
  // addProductoCar(idProducto: string, cantidad: any) {

  //   const body: addProductoCar = {
  //     id_product: idProducto,
  //     id_user: '1',
  //     amount: parseInt(cantidad.value),
  //   };

  //   this.CategoryService.addProductoCarCategory(body)
  //     .pipe(
  //       catchError((error) => {
  //         // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
  //         console.log(`${error}, Error al cargar los registros`, 'OK');
  //         return of(null);
  //       })
  //     )
  //     .subscribe((resp) => {
  //       //manejo de respuesta
  //       if (
  //         resp == 'Cantidad Actualizada' ||
  //         resp == 'Producto Agregado Con Exito'
  //       ) {
  //         this.ServiceAllProductService.notifyNewProduct(); //notifica al carrito (MODAL) que se agrego un producto
  //         this.sharedService.notifyNewNavb(); //notifica al componente navbar que se agrego un producto
  //         this.cantidad!.nativeElement.value = 1;
  //         // this.msmAddProduct = resp;
  //         // this.idProducto = idProducto;
  //         // setTimeout(() => {
  //         //   this.msmAddProduct = '';
  //         //   this.idProducto = '';
  //         // }, 2500);
  //       }
  //     });
  // }

  // *************adiciona producto al carrito********
  addProductoCar(idProducto: string) {
    const body: addProductoCar = {
      id_product: idProducto,
      amount: 1,
    };

    this.ServiceAllProductService.addProductoCar(body)
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
          this.idProducto = idProducto;
          setTimeout(() => {
            this.msmAddProduct = '';
            this.idProducto = '';
          }, 2500);
        } else if (
          resp == 'Debes iniciar sesión nuevamente' ||
          resp == 'Token modificado o vencido, debes iniciar sesión nuevamente'
        ) {
          this.LoginService.openModal();
          this.msmAddProduct = resp;
          this.idProducto = idProducto;
          setTimeout(() => {
            this.msmAddProduct = '';
            this.idProducto = '';
          }, 3500);
        } else {
          this.msmAddProduct = resp;
          this.idProducto = idProducto;
          setTimeout(() => {
            this.msmAddProduct = '';
            this.idProducto = '';
          }, 3500);
        }
      });
  }
  ///*********verifica si hay productos en el carrito*********
  verifificarCar(id_producto: string) {
    const body = {
      id_product: id_producto,
      amount: 1,
    };

    this.ServiceAllProductService.verificarCar(body)
      .pipe(
        catchError((error) => {
          console.log(`${error}, Error al cargar los registros`, 'OK');
          return of(null);
        })
      )
      .subscribe((res) => {
        this.router.navigate(['/checkout']);
      });
  }
}
