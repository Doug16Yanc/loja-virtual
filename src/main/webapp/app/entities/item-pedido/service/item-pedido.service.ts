import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemPedido, NewItemPedido } from '../item-pedido.model';

export type PartialUpdateItemPedido = Partial<IItemPedido> & Pick<IItemPedido, 'id'>;

export type EntityResponseType = HttpResponse<IItemPedido>;
export type EntityArrayResponseType = HttpResponse<IItemPedido[]>;

@Injectable({ providedIn: 'root' })
export class ItemPedidoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-pedidos');

  create(itemPedido: NewItemPedido): Observable<EntityResponseType> {
    return this.http.post<IItemPedido>(this.resourceUrl, itemPedido, { observe: 'response' });
  }

  update(itemPedido: IItemPedido): Observable<EntityResponseType> {
    return this.http.put<IItemPedido>(`${this.resourceUrl}/${this.getItemPedidoIdentifier(itemPedido)}`, itemPedido, {
      observe: 'response',
    });
  }

  partialUpdate(itemPedido: PartialUpdateItemPedido): Observable<EntityResponseType> {
    return this.http.patch<IItemPedido>(`${this.resourceUrl}/${this.getItemPedidoIdentifier(itemPedido)}`, itemPedido, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItemPedido>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItemPedido[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemPedidoIdentifier(itemPedido: Pick<IItemPedido, 'id'>): number {
    return itemPedido.id;
  }

  compareItemPedido(o1: Pick<IItemPedido, 'id'> | null, o2: Pick<IItemPedido, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemPedidoIdentifier(o1) === this.getItemPedidoIdentifier(o2) : o1 === o2;
  }

  addItemPedidoToCollectionIfMissing<Type extends Pick<IItemPedido, 'id'>>(
    itemPedidoCollection: Type[],
    ...itemPedidosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itemPedidos: Type[] = itemPedidosToCheck.filter(isPresent);
    if (itemPedidos.length > 0) {
      const itemPedidoCollectionIdentifiers = itemPedidoCollection.map(itemPedidoItem => this.getItemPedidoIdentifier(itemPedidoItem));
      const itemPedidosToAdd = itemPedidos.filter(itemPedidoItem => {
        const itemPedidoIdentifier = this.getItemPedidoIdentifier(itemPedidoItem);
        if (itemPedidoCollectionIdentifiers.includes(itemPedidoIdentifier)) {
          return false;
        }
        itemPedidoCollectionIdentifiers.push(itemPedidoIdentifier);
        return true;
      });
      return [...itemPedidosToAdd, ...itemPedidoCollection];
    }
    return itemPedidoCollection;
  }
}
