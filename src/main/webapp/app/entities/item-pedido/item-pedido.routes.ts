import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ItemPedidoResolve from './route/item-pedido-routing-resolve.service';

const itemPedidoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/item-pedido.component').then(m => m.ItemPedidoComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/item-pedido-detail.component').then(m => m.ItemPedidoDetailComponent),
    resolve: {
      itemPedido: ItemPedidoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/item-pedido-update.component').then(m => m.ItemPedidoUpdateComponent),
    resolve: {
      itemPedido: ItemPedidoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/item-pedido-update.component').then(m => m.ItemPedidoUpdateComponent),
    resolve: {
      itemPedido: ItemPedidoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default itemPedidoRoute;
