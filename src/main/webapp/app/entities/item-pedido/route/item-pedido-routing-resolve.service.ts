import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemPedido } from '../item-pedido.model';
import { ItemPedidoService } from '../service/item-pedido.service';

const itemPedidoResolve = (route: ActivatedRouteSnapshot): Observable<null | IItemPedido> => {
  const id = route.params.id;
  if (id) {
    return inject(ItemPedidoService)
      .find(id)
      .pipe(
        mergeMap((itemPedido: HttpResponse<IItemPedido>) => {
          if (itemPedido.body) {
            return of(itemPedido.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default itemPedidoResolve;
