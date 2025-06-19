export interface ICliente {
  id: number;
  nome?: string | null;
  email?: string | null;
  telefone?: string | null;
}

export type NewCliente = Omit<ICliente, 'id'> & { id: null };
