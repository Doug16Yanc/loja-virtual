import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProduto } from 'app/entities/produto/produto.model';
import { ProdutoService } from 'app/entities/produto/service/produto.service';
import { IPedido } from 'app/entities/pedido/pedido.model';
import { PedidoService } from 'app/entities/pedido/service/pedido.service';
import { ItemPedidoService } from '../service/item-pedido.service';
import { IItemPedido } from '../item-pedido.model';
import { ItemPedidoFormGroup, ItemPedidoFormService } from './item-pedido-form.service';

@Component({
  selector: 'jhi-item-pedido-update',
  templateUrl: './item-pedido-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ItemPedidoUpdateComponent implements OnInit {
  isSaving = false;
  itemPedido: IItemPedido | null = null;

  produtosSharedCollection: IProduto[] = [];
  pedidosSharedCollection: IPedido[] = [];

  protected itemPedidoService = inject(ItemPedidoService);
  protected itemPedidoFormService = inject(ItemPedidoFormService);
  protected produtoService = inject(ProdutoService);
  protected pedidoService = inject(PedidoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ItemPedidoFormGroup = this.itemPedidoFormService.createItemPedidoFormGroup();

  compareProduto = (o1: IProduto | null, o2: IProduto | null): boolean => this.produtoService.compareProduto(o1, o2);

  comparePedido = (o1: IPedido | null, o2: IPedido | null): boolean => this.pedidoService.comparePedido(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemPedido }) => {
      this.itemPedido = itemPedido;
      if (itemPedido) {
        this.updateForm(itemPedido);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemPedido = this.itemPedidoFormService.getItemPedido(this.editForm);
    if (itemPedido.id !== null) {
      this.subscribeToSaveResponse(this.itemPedidoService.update(itemPedido));
    } else {
      this.subscribeToSaveResponse(this.itemPedidoService.create(itemPedido));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemPedido>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(itemPedido: IItemPedido): void {
    this.itemPedido = itemPedido;
    this.itemPedidoFormService.resetForm(this.editForm, itemPedido);

    this.produtosSharedCollection = this.produtoService.addProdutoToCollectionIfMissing<IProduto>(
      this.produtosSharedCollection,
      itemPedido.produto,
    );
    this.pedidosSharedCollection = this.pedidoService.addPedidoToCollectionIfMissing<IPedido>(
      this.pedidosSharedCollection,
      itemPedido.pedido,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.produtoService
      .query()
      .pipe(map((res: HttpResponse<IProduto[]>) => res.body ?? []))
      .pipe(
        map((produtos: IProduto[]) => this.produtoService.addProdutoToCollectionIfMissing<IProduto>(produtos, this.itemPedido?.produto)),
      )
      .subscribe((produtos: IProduto[]) => (this.produtosSharedCollection = produtos));

    this.pedidoService
      .query()
      .pipe(map((res: HttpResponse<IPedido[]>) => res.body ?? []))
      .pipe(map((pedidos: IPedido[]) => this.pedidoService.addPedidoToCollectionIfMissing<IPedido>(pedidos, this.itemPedido?.pedido)))
      .subscribe((pedidos: IPedido[]) => (this.pedidosSharedCollection = pedidos));
  }
}
