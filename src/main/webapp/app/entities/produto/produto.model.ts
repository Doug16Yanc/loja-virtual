export interface IProduto {
  id: number;
  nome?: string | null;
  preco?: number | null;
  descricao?: string | null;
  quantidade?: number | null;
}

export type NewProduto = Omit<IProduto, 'id'> & { id: null };
