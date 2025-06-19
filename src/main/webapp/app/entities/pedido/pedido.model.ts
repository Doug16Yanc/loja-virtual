import dayjs from 'dayjs/esm';
import { ICliente } from 'app/entities/cliente/cliente.model';

export interface IPedido {
  id: number;
  dataInstant?: dayjs.Dayjs | null;
  statusPedido?: string | null;
  cliente?: ICliente | null;
}

export type NewPedido = Omit<IPedido, 'id'> & { id: null };
