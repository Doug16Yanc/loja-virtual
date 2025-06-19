import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IItemPedido } from '../item-pedido.model';

@Component({
  selector: 'jhi-item-pedido-detail',
  templateUrl: './item-pedido-detail.component.html',
  imports: [SharedModule, RouterModule],
  standalone: true,
})
export class ItemPedidoDetailComponent {
  itemPedido = input<IItemPedido | null>(null);

  previousState(): void {
    window.history.back();
  }
}
