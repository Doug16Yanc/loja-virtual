import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { PedidoService } from '../service/pedido.service';
import { IPedido } from '../pedido.model';
import { PedidoFormService } from './pedido-form.service';

import { PedidoUpdateComponent } from './pedido-update.component';

describe('Pedido Management Update Component', () => {
  let comp: PedidoUpdateComponent;
  let fixture: ComponentFixture<PedidoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pedidoFormService: PedidoFormService;
  let pedidoService: PedidoService;
  let clienteService: ClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PedidoUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PedidoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PedidoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pedidoFormService = TestBed.inject(PedidoFormService);
    pedidoService = TestBed.inject(PedidoService);
    clienteService = TestBed.inject(ClienteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Cliente query and add missing value', () => {
      const pedido: IPedido = { id: 19016 };
      const cliente: ICliente = { id: 13484 };
      pedido.cliente = cliente;

      const clienteCollection: ICliente[] = [{ id: 13484 }];
      jest.spyOn(clienteService, 'query').mockReturnValue(of(new HttpResponse({ body: clienteCollection })));
      const additionalClientes = [cliente];
      const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
      jest.spyOn(clienteService, 'addClienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      expect(clienteService.query).toHaveBeenCalled();
      expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(
        clienteCollection,
        ...additionalClientes.map(expect.objectContaining),
      );
      expect(comp.clientesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const pedido: IPedido = { id: 19016 };
      const cliente: ICliente = { id: 13484 };
      pedido.cliente = cliente;

      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      expect(comp.clientesSharedCollection).toContainEqual(cliente);
      expect(comp.pedido).toEqual(pedido);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPedido>>();
      const pedido = { id: 24162 };
      jest.spyOn(pedidoFormService, 'getPedido').mockReturnValue(pedido);
      jest.spyOn(pedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pedido }));
      saveSubject.complete();

      // THEN
      expect(pedidoFormService.getPedido).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pedidoService.update).toHaveBeenCalledWith(expect.objectContaining(pedido));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPedido>>();
      const pedido = { id: 24162 };
      jest.spyOn(pedidoFormService, 'getPedido').mockReturnValue({ id: null });
      jest.spyOn(pedidoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pedido: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pedido }));
      saveSubject.complete();

      // THEN
      expect(pedidoFormService.getPedido).toHaveBeenCalled();
      expect(pedidoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPedido>>();
      const pedido = { id: 24162 };
      jest.spyOn(pedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pedidoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCliente', () => {
      it('should forward to clienteService', () => {
        const entity = { id: 13484 };
        const entity2 = { id: 20795 };
        jest.spyOn(clienteService, 'compareCliente');
        comp.compareCliente(entity, entity2);
        expect(clienteService.compareCliente).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
