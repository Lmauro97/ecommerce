import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';
@Component({
  selector: 'app-banner-home',
  templateUrl: './banner-home.component.html',
  styleUrls: ['./banner-home.component.css'],
})
export class BannerHomeComponent {
  banner: any = [];
  constructor(private SharedService: SharedService) {}

  ngOnInit(): void {
    this.SharedService.getBanner().subscribe((res) => {
      this.banner = res;
    });
  }
}
