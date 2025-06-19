import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IPedido } from '../pedido.model';
import { PedidoService } from '../service/pedido.service';
import { PedidoFormGroup, PedidoFormService } from './pedido-form.service';

@Component({
  selector: 'jhi-pedido-update',
  templateUrl: './pedido-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PedidoUpdateComponent implements OnInit {
  isSaving = false;
  pedido: IPedido | null = null;

  clientesSharedCollection: ICliente[] = [];

  protected pedidoService = inject(PedidoService);
  protected pedidoFormService = inject(PedidoFormService);
  protected clienteService = inject(ClienteService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PedidoFormGroup = this.pedidoFormService.createPedidoFormGroup();

  compareCliente = (o1: ICliente | null, o2: ICliente | null): boolean => this.clienteService.compareCliente(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pedido }) => {
      this.pedido = pedido;
      if (pedido) {
        this.updateForm(pedido);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pedido = this.pedidoFormService.getPedido(this.editForm);
    if (pedido.id !== null) {
      this.subscribeToSaveResponse(this.pedidoService.update(pedido));
    } else {
      this.subscribeToSaveResponse(this.pedidoService.create(pedido));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPedido>>): void {
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

  protected updateForm(pedido: IPedido): void {
    this.pedido = pedido;
    this.pedidoFormService.resetForm(this.editForm, pedido);

    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing<ICliente>(
      this.clientesSharedCollection,
      pedido.cliente,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing<ICliente>(clientes, this.pedido?.cliente)))
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));
  }
}
