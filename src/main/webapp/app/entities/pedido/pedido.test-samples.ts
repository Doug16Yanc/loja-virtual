import dayjs from 'dayjs/esm';

import { IPedido, NewPedido } from './pedido.model';

export const sampleWithRequiredData: IPedido = {
  id: 18617,
  dataInstant: dayjs('2025-06-14T13:34'),
  statusPedido: 'moment sans',
};

export const sampleWithPartialData: IPedido = {
  id: 13887,
  dataInstant: dayjs('2025-06-14T00:05'),
  statusPedido: 'e-mail ha',
};

export const sampleWithFullData: IPedido = {
  id: 29823,
  dataInstant: dayjs('2025-06-14T08:43'),
  statusPedido: 'neck similar tarragon',
};

export const sampleWithNewData: NewPedido = {
  dataInstant: dayjs('2025-06-14T11:33'),
  statusPedido: 'helpless',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
