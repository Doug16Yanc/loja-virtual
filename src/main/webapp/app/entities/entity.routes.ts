import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'lojaVirtualApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'produto',
    data: { pageTitle: 'lojaVirtualApp.produto.home.title' },
    loadChildren: () => import('./produto/produto.routes'),
  },
  {
    path: 'cliente',
    data: { pageTitle: 'lojaVirtualApp.cliente.home.title' },
    loadChildren: () => import('./cliente/cliente.routes'),
  },
  {
    path: 'pedido',
    data: { pageTitle: 'lojaVirtualApp.pedido.home.title' },
    loadChildren: () => import('./pedido/pedido.routes'),
  },
  {
    path: 'item-pedido',
    data: { pageTitle: 'lojaVirtualApp.itemPedido.home.title' },
    loadChildren: () => import('./item-pedido/item-pedido.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
