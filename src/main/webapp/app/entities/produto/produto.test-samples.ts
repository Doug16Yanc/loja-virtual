import { IProduto, NewProduto } from './produto.model';

export const sampleWithRequiredData: IProduto = {
  id: 30780,
  nome: 'realistic provided',
  preco: 7076.12,
};

export const sampleWithPartialData: IProduto = {
  id: 20754,
  nome: 'creamy',
  preco: 28901.24,
  descricao: 'infatuated gorgeous tepid',
};

export const sampleWithFullData: IProduto = {
  id: 21138,
  nome: 'speedily toward between',
  preco: 24748.77,
  descricao: 'huzzah',
  quantidade: 5501,
};

export const sampleWithNewData: NewProduto = {
  nome: 'impact',
  preco: 6127.74,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
