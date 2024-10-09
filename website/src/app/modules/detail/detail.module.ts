import { NgModule } from '@angular/core';
import { DetailComponent } from './pages/detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailRoutingModule } from './detail.routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DetailComponent],
  imports: [DetailRoutingModule, SharedModule, CommonModule],
  exports: [DetailComponent],
})
export class DetailModule {}
