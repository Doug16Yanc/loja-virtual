import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemPedidoDetailComponent } from './item-pedido-detail.component';

describe('ItemPedido Management Detail Component', () => {
  let comp: ItemPedidoDetailComponent;
  let fixture: ComponentFixture<ItemPedidoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPedidoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./item-pedido-detail.component').then(m => m.ItemPedidoDetailComponent),
              resolve: { itemPedido: () => of({ id: 14110 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ItemPedidoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPedidoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load itemPedido on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ItemPedidoDetailComponent);

      // THEN
      expect(instance.itemPedido()).toEqual(expect.objectContaining({ id: 14110 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
