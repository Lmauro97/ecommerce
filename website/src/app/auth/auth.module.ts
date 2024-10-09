import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [LoginComponentComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LoginComponentComponent],
})
export class AuthModule {}
