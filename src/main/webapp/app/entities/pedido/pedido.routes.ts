import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PedidoResolve from './route/pedido-routing-resolve.service';

const pedidoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/pedido.component').then(m => m.PedidoComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/pedido-detail.component').then(m => m.PedidoDetailComponent),
    resolve: {
      pedido: PedidoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/pedido-update.component').then(m => m.PedidoUpdateComponent),
    resolve: {
      pedido: PedidoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/pedido-update.component').then(m => m.PedidoUpdateComponent),
    resolve: {
      pedido: PedidoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pedidoRoute;
