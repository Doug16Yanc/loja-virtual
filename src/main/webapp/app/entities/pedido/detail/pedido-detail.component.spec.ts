import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PedidoDetailComponent } from './pedido-detail.component';

describe('Pedido Management Detail Component', () => {
  let comp: PedidoDetailComponent;
  let fixture: ComponentFixture<PedidoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./pedido-detail.component').then(m => m.PedidoDetailComponent),
              resolve: { pedido: () => of({ id: 24162 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PedidoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load pedido on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PedidoDetailComponent);

      // THEN
      expect(instance.pedido()).toEqual(expect.objectContaining({ id: 24162 }));
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
