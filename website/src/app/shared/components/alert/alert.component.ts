import {
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { Observable, Subscription } from 'rxjs';
import { ServiceAllProductService } from 'src/app/modules/all-product/services/service-all-product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  addSuscribe: Subscription | undefined;

  private router = inject(Router);

  private subscription: Subscription;
  @ViewChild('modalAlertButton') modalAlertButton!: ElementRef;
  contMsm = {
    tipo: 'Error',
    message: 'Error',
  };

  constructor(
    private sharedService: SharedService,
    private serviceAllProductService: ServiceAllProductService
  ) {
    this.subscription = this.sharedService.executeMethod.subscribe(
      (data: any) => {
        if (data.message !== '') {
          this.contMsm = {
            tipo: data.tipo,
            message: data.message,
          };
        }
        this.openModal();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openModal() {
    this.modalAlertButton.nativeElement.click();
  }

  closeModal() {
    if (
      this.contMsm.message ===
      'Token modificado o vencido, debes iniciar sesión nuevamente'
    ) {
      //refresk page
      window.location.reload();
    }
  }
}
