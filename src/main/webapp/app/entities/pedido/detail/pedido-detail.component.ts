import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IPedido } from '../pedido.model';

@Component({
  selector: 'jhi-pedido-detail',
  templateUrl: './pedido-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class PedidoDetailComponent {
  pedido = input<IPedido | null>(null);

  previousState(): void {
    window.history.back();
  }
}
