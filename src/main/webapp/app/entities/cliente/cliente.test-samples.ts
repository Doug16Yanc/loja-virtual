import { ICliente, NewCliente } from './cliente.model';

export const sampleWithRequiredData: ICliente = {
  id: 2897,
  nome: 'wherever alongside per',
  email: 'C>~`4@K\\i<qG',
};

export const sampleWithPartialData: ICliente = {
  id: 6094,
  nome: 'besides',
  email: '(@x\\bR',
};

export const sampleWithFullData: ICliente = {
  id: 17129,
  nome: 'circumference',
  email: 'WN3@4B*&6#\\Qe2k99v',
  telefone: 'truthfully',
};

export const sampleWithNewData: NewCliente = {
  nome: 'under',
  email: 't@G\\+K;*C?',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
