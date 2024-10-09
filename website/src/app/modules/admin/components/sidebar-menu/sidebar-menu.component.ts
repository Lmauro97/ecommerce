import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../services/admin.service';
@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css'],
})
export class SidebarMenuComponent {
  subscription: Subscription;
  totalOrderNew: any;

  constructor(private AdminService: AdminService) {
    this.subscription = this.AdminService.totalOrderNew.subscribe(
      (data: any) => {
        this.totalOrderNew = data < 1 ? 0 : data;
      }
    );
  }
}
