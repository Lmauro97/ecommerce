import { Component, ElementRef, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { catchError, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  listUser: any;
  listUserOrigin: any;
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  @ViewChild('searchDateInput') searchDateInput: ElementRef | undefined;
  grupPaginate: any = [];
  activeIndex = 0; // Índice de la página activa

  constructor(
    private AdminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getListuser();
  }
  getListuser() {
    this.AdminService.getListUser()
      .pipe(
        catchError((error) => {
          return of(null);
        })
      )
      .subscribe((res) => {
        this.listUser = res;
        this.listUserOrigin = res;
        let paginate = 0;
        for (let i = 0; i < res.length; i++) {
          if (i % 10 === 0) {
            this.grupPaginate.push([]);
            paginate++;
          }
          this.grupPaginate[paginate - 1].push(res[i]);
        }
      });
  }

  searchUser(value: any) {
    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    };
    const normalizedValue = normalizeString(value);
    this.listUser = this.listUserOrigin.filter((order: any) => {
      return Object.keys(order).some((key: any) => {
        const orderValue = order[key];
        if (orderValue !== null && orderValue !== undefined) {
          const normalizedOrderValue = normalizeString(orderValue.toString());
          return normalizedOrderValue.includes(normalizedValue);
        }
        return false;
      });
    });
  }

  clearSearch() {
    this.searchInput!.nativeElement.value = '';
    this.searchDateInput!.nativeElement.value = '';

    let paginate = 0;
    this.grupPaginate = [];
    for (let i = 0; i < this.listUserOrigin.length; i++) {
      if (i % 10 === 0) {
        this.grupPaginate.push([]);
        paginate++;
      }
      this.grupPaginate[paginate - 1].push(this.listUserOrigin[i]);
    }
    this.listUser = [...this.grupPaginate[0]];
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }
  searchDate(date: any) {
    // date_register: '2024-08-18T04:49:04.000Z',
    this.listUser = this.listUserOrigin.filter((user: any) => {
      return user.date_register.includes(date);
    });
  }
  paginate(index: any, paginate: any) {
    window.scrollTo(0, 0);
    this.activeIndex = paginate;
    this.listUser = index;
  }
  nextPaginator() {
    if (this.activeIndex < this.grupPaginate.length - 1) {
      this.activeIndex++;
      this.listUser = this.grupPaginate[this.activeIndex];
    }
  }
  prevPaginator() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.listUser = this.grupPaginate[this.activeIndex];
    }
  }
  scrollRight(direction: any) {
    if (direction === 'left') {
      document.getElementById('scrollDiv')!.scrollLeft -= 700;
    } else if (direction === 'right') {
      document.getElementById('scrollDiv')!.scrollLeft += 700;
    }
  }
}
