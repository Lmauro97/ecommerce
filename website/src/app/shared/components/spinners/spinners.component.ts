import { Component } from '@angular/core';
import { LoaderService } from '../../service/loader-service.service';
@Component({
  selector: 'app-spinners',
  templateUrl: './spinners.component.html',
  styleUrls: ['./spinners.component.css'],
})
export class SpinnersComponent {
  isLoading$ = this.loaderService.isLoading$;

  constructor(private readonly loaderService: LoaderService) {}
}
