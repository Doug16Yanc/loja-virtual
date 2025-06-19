import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IItemPedido } from '../item-pedido.model';
import { ItemPedidoService } from '../service/item-pedido.service';

@Component({
  templateUrl: './item-pedido-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ItemPedidoDeleteDialogComponent {
  itemPedido?: IItemPedido;

  protected itemPedidoService = inject(ItemPedidoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemPedidoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
