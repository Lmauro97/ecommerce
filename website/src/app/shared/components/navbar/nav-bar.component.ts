import { Component } from '@angular/core';
import { ModalService } from '../shopping-cart/service/modal.service';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { SharedService } from '../../service/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { PerfilUserServiceService } from '../../../modules/perfil-user/service/perfil-user-service.service';
import { Label } from '../../interfaces/shared-interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  totalProductos: number = 0;
  addSuscribe: Subscription | undefined;
  listCategory: any[] = [];
  filterListCategoria: any;
  activateOptionIngresar: boolean = false;
  fotoPerfil: any = '';
  dataUser: any;
  activateOptionAdmin: boolean = false;
  listLabel: Label[] = [];
  listLabelService: Label[] = [];

  constructor(
    private ModalService: ModalService,
    private cookieService: CookieService,
    private sharedService: SharedService,
    private router: Router,
    private PerfilUserServiceService: PerfilUserServiceService
  ) {
    //etiqueta de busqueda anteriores
    const history = localStorage.getItem('searchHistory');
    if (history) {
      const list = history.split(',');
      list.forEach((label) => {
        this.listLabel?.push({
          id_label: null,
          nombre: label,
        });
      });
      this.getLabel();
    } else {
      this.getLabel();
    }

    this.getlistaProductoUser();
    this.getCategoriaList();
    // *************Esta pendiente de nuevos productos en el carrito********
    this.addSuscribe = this.sharedService.getnotifyNewNavb().subscribe(() => {
      this.getlistaProductoUser();
    });

    /////si esta logeado activa la opcion "Tu Cuenta en el NAV"
    const token = this.cookieService.get('cookieT_258791**');
    this.activateOptionIngresar = token
      ? (this.getDataUserPerfil(), true)
      : false;
  }
  onDestroy() {
    this.addSuscribe?.unsubscribe();
  }

  // *********lista de prodcutos por usuario*********
  getlistaProductoUser() {
    this.ModalService.getListProductUser()
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(
            `${error}, Error al cargar los productos del usuario`,
            'OK'
          );
          return of(null);
        })
      )
      .subscribe((res) => {
        this.totalProductos = res.reduce(
          (acc: number, res: any) => acc + res.amount,
          0
        );
      });
  }

  // *************lista de categorias********
  getCategoriaList() {
    this.sharedService
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
        this.filterListCategoria = resp;
      });
  }

  // *****busca categoria*******
  BuscarCategoria(event: any) {
    if (event.target.value == '') {
      this.filterListCategoria = this.listCategory;
    }
    const searchText = this.normalizeText(event.target.value.toLowerCase());

    this.filterListCategoria = this.listCategory.filter(
      (element: any) =>
        element.category_name &&
        this.normalizeText(element.category_name.toLowerCase()).includes(
          searchText
        )
    );
  }
  //datos del usuario logeado
  getDataUserPerfil() {
    this.PerfilUserServiceService.getDataUserPerfil()
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(
            `${error}, Error al cargar los datos del perfil del usuario`,
            'OK'
          );
          return of(null);
        }),
        finalize(() => {
          const role = this.dataUser.roles.split(',');
          for (let i = 0; i < role.length; i++) {
            role[i] = role[i].trim();
            this.activateOptionAdmin =
              role[i] === 'Administrador de tienda' ||
              role[i] === 'Super Administrador'
                ? true
                : false;
          }
        })
      )
      .subscribe((resp) => {
        this.dataUser = resp[0];
        this.fotoPerfil = resp[0].photo.includes('imgDefaulRegiter.png')
          ? '../assets/img/imgDefaulRegiter.png'
          : resp[0].photo;
      });
  }
  ////quita los acentos
  normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // *****cerrar sesion****
  closeSesion() {
    this.cookieService.deleteAll();
    window.location.reload();
    const token = this.cookieService.get('cookieT_258791**');

    if (token) {
      console.log('no se borro la cookie');
      this.cookieService.deleteAll('cookieT_258791**');
      this.cookieService.deleteAll();
    } else {
      console.log('se borro la cookie');
    }
    this.router.navigate(['/home']);
  }

  //envia texto para filtrar por etiquetas
  buscarProducto(label: any) {
    if (label == '') {
      this.sharedService.notifyFilterLabel(label);
      return;
    }
    label = label.trim();
    const history = localStorage.getItem('searchHistory');

    if (history) {
      let list: any = history.split(',');
      if (list.length >= 5) {
        list = list.slice(1, 5);
        if (!list.includes(label)) {
          list.push(label);
        }
        localStorage.setItem('searchHistory', list.toString());
      } else {
        if (!list.includes(label)) {
          list.push(label);
        }
        localStorage.setItem('searchHistory', list.toString());
      }
    } else {
      localStorage.setItem('searchHistory', label);
    }
    this.sharedService.notifyFilterLabel(label);
  }

  presEnter(event: any) {
    if (event.key == 'Enter') {
      this.buscarProducto(event.target.value);
    }
  }
  // *********lista de etiquetas********
  getLabel() {
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
          this.listLabelService = resp.label;
        }
      });
  }

  filterLabel() {
    this.listLabel = this.listLabelService;
  }
  clearInputLabel() {
    this.listLabel = [];
    localStorage
      .getItem('searchHistory')
      ?.split(',')
      .forEach((label) => {
        this.listLabel.push({
          id_label: null,
          nombre: label,
        });
      });
  }
}
