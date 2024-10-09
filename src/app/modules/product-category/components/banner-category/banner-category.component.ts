import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-category',
  templateUrl: './banner-category.component.html',
  styleUrls: ['./banner-category.component.css'],
})
export class BannerCategoryComponent {
  @Input() nombreCategoria: any;
}
