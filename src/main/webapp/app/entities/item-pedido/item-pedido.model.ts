import { IProduto } from 'app/entities/produto/produto.model';
import { IPedido } from 'app/entities/pedido/pedido.model';

export interface IItemPedido {
  id: number;
  quantidade?: number | null;
  precoUnitario?: number | null;
  produto?: IProduto | null;
  pedido?: IPedido | null;
}

export type NewItemPedido = Omit<IItemPedido, 'id'> & { id: null };
