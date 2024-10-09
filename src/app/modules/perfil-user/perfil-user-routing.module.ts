import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/shared/page/home/main-home/home.component';
import { PagesPerfilUserComponent } from './pages/pages-perfil-user/pages-perfil-user.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: PagesPerfilUserComponent },
      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilUserRoutingModule {}
