import { IItemPedido, NewItemPedido } from './item-pedido.model';

export const sampleWithRequiredData: IItemPedido = {
  id: 19308,
  quantidade: 20861,
  precoUnitario: 14666.49,
};

export const sampleWithPartialData: IItemPedido = {
  id: 18462,
  quantidade: 11242,
  precoUnitario: 3094.35,
};

export const sampleWithFullData: IItemPedido = {
  id: 17748,
  quantidade: 6466,
  precoUnitario: 10814.54,
};

export const sampleWithNewData: NewItemPedido = {
  quantidade: 10302,
  precoUnitario: 29530.69,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
