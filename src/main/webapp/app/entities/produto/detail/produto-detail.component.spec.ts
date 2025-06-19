import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProdutoDetailComponent } from './produto-detail.component';

describe('Produto Management Detail Component', () => {
  let comp: ProdutoDetailComponent;
  let fixture: ComponentFixture<ProdutoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./produto-detail.component').then(m => m.ProdutoDetailComponent),
              resolve: { produto: () => of({ id: 3606 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProdutoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load produto on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProdutoDetailComponent);

      // THEN
      expect(instance.produto()).toEqual(expect.objectContaining({ id: 3606 }));
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
