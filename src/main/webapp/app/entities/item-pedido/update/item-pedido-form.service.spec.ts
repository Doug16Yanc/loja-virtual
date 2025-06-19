import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../item-pedido.test-samples';

import { ItemPedidoFormService } from './item-pedido-form.service';

describe('ItemPedido Form Service', () => {
  let service: ItemPedidoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemPedidoFormService);
  });

  describe('Service methods', () => {
    describe('createItemPedidoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItemPedidoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantidade: expect.any(Object),
            precoUnitario: expect.any(Object),
            produto: expect.any(Object),
            pedido: expect.any(Object),
          }),
        );
      });

      it('passing IItemPedido should create a new form with FormGroup', () => {
        const formGroup = service.createItemPedidoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quantidade: expect.any(Object),
            precoUnitario: expect.any(Object),
            produto: expect.any(Object),
            pedido: expect.any(Object),
          }),
        );
      });
    });

    describe('getItemPedido', () => {
      it('should return NewItemPedido for default ItemPedido initial value', () => {
        const formGroup = service.createItemPedidoFormGroup(sampleWithNewData);

        const itemPedido = service.getItemPedido(formGroup) as any;

        expect(itemPedido).toMatchObject(sampleWithNewData);
      });

      it('should return NewItemPedido for empty ItemPedido initial value', () => {
        const formGroup = service.createItemPedidoFormGroup();

        const itemPedido = service.getItemPedido(formGroup) as any;

        expect(itemPedido).toMatchObject({});
      });

      it('should return IItemPedido', () => {
        const formGroup = service.createItemPedidoFormGroup(sampleWithRequiredData);

        const itemPedido = service.getItemPedido(formGroup) as any;

        expect(itemPedido).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItemPedido should not enable id FormControl', () => {
        const formGroup = service.createItemPedidoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItemPedido should disable id FormControl', () => {
        const formGroup = service.createItemPedidoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
