import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-pages-category',
  templateUrl: './pages-category.component.html',
  styleUrls: ['./pages-category.component.css'],
})
export class PagesCategoryComponent {
  listCategory: any;
  listProduct: any;
  nombreCategoria: any;
  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let valueParametro = params.get('id'); // Asume que el parámetro se llama 'id'
      const parts = valueParametro?.replaceAll('-', ' ');
      if (parts !== null && parts !== undefined && parts !== '') {
        this.getCategories(parts);
      }
    });
  }

  //lista de categorias
  getCategories(params: string) {
    this.sharedService
      .getListCategory()
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`${error}, Error al cargar las categorias`, 'OK');
          return of(null);
        }),
        finalize(() => {
          this.getListaProductosCategoria(params);
        })
      )
      .subscribe((resp) => {
        this.listCategory = resp;
      });
  }

  // ********lista de productos por categoria********
  getListaProductosCategoria(nombreCategoria: string) {
    this.nombreCategoria = nombreCategoria;
    const categoriaFind = this.listCategory.find(
      (categoria: any) => categoria.category_name == nombreCategoria
    ).id;
    this.categoryService
      .getListProductCategoria(categoriaFind)
      .pipe(
        catchError((error) => {
          // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje de error.
          console.log(`${error}, Error al cargar los registros`, 'OK');
          return of(null);
        })
      )
      .subscribe((resp) => {
        this.listProduct = resp.filter((producto: any) => producto.stock > 0);
        console.log(this.listProduct);
      });
  }
}
