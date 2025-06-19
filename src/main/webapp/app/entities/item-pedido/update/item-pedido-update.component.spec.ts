import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IProduto } from 'app/entities/produto/produto.model';
import { ProdutoService } from 'app/entities/produto/service/produto.service';
import { IPedido } from 'app/entities/pedido/pedido.model';
import { PedidoService } from 'app/entities/pedido/service/pedido.service';
import { IItemPedido } from '../item-pedido.model';
import { ItemPedidoService } from '../service/item-pedido.service';
import { ItemPedidoFormService } from './item-pedido-form.service';

import { ItemPedidoUpdateComponent } from './item-pedido-update.component';

describe('ItemPedido Management Update Component', () => {
  let comp: ItemPedidoUpdateComponent;
  let fixture: ComponentFixture<ItemPedidoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemPedidoFormService: ItemPedidoFormService;
  let itemPedidoService: ItemPedidoService;
  let produtoService: ProdutoService;
  let pedidoService: PedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItemPedidoUpdateComponent],
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
      .overrideTemplate(ItemPedidoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemPedidoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemPedidoFormService = TestBed.inject(ItemPedidoFormService);
    itemPedidoService = TestBed.inject(ItemPedidoService);
    produtoService = TestBed.inject(ProdutoService);
    pedidoService = TestBed.inject(PedidoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Produto query and add missing value', () => {
      const itemPedido: IItemPedido = { id: 30572 };
      const produto: IProduto = { id: 3606 };
      itemPedido.produto = produto;

      const produtoCollection: IProduto[] = [{ id: 3606 }];
      jest.spyOn(produtoService, 'query').mockReturnValue(of(new HttpResponse({ body: produtoCollection })));
      const additionalProdutos = [produto];
      const expectedCollection: IProduto[] = [...additionalProdutos, ...produtoCollection];
      jest.spyOn(produtoService, 'addProdutoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemPedido });
      comp.ngOnInit();

      expect(produtoService.query).toHaveBeenCalled();
      expect(produtoService.addProdutoToCollectionIfMissing).toHaveBeenCalledWith(
        produtoCollection,
        ...additionalProdutos.map(expect.objectContaining),
      );
      expect(comp.produtosSharedCollection).toEqual(expectedCollection);
    });

    it('should call Pedido query and add missing value', () => {
      const itemPedido: IItemPedido = { id: 30572 };
      const pedido: IPedido = { id: 24162 };
      itemPedido.pedido = pedido;

      const pedidoCollection: IPedido[] = [{ id: 24162 }];
      jest.spyOn(pedidoService, 'query').mockReturnValue(of(new HttpResponse({ body: pedidoCollection })));
      const additionalPedidos = [pedido];
      const expectedCollection: IPedido[] = [...additionalPedidos, ...pedidoCollection];
      jest.spyOn(pedidoService, 'addPedidoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemPedido });
      comp.ngOnInit();

      expect(pedidoService.query).toHaveBeenCalled();
      expect(pedidoService.addPedidoToCollectionIfMissing).toHaveBeenCalledWith(
        pedidoCollection,
        ...additionalPedidos.map(expect.objectContaining),
      );
      expect(comp.pedidosSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const itemPedido: IItemPedido = { id: 30572 };
      const produto: IProduto = { id: 3606 };
      itemPedido.produto = produto;
      const pedido: IPedido = { id: 24162 };
      itemPedido.pedido = pedido;

      activatedRoute.data = of({ itemPedido });
      comp.ngOnInit();

      expect(comp.produtosSharedCollection).toContainEqual(produto);
      expect(comp.pedidosSharedCollection).toContainEqual(pedido);
      expect(comp.itemPedido).toEqual(itemPedido);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemPedido>>();
      const itemPedido = { id: 14110 };
      jest.spyOn(itemPedidoFormService, 'getItemPedido').mockReturnValue(itemPedido);
      jest.spyOn(itemPedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemPedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemPedido }));
      saveSubject.complete();

      // THEN
      expect(itemPedidoFormService.getItemPedido).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemPedidoService.update).toHaveBeenCalledWith(expect.objectContaining(itemPedido));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemPedido>>();
      const itemPedido = { id: 14110 };
      jest.spyOn(itemPedidoFormService, 'getItemPedido').mockReturnValue({ id: null });
      jest.spyOn(itemPedidoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemPedido: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemPedido }));
      saveSubject.complete();

      // THEN
      expect(itemPedidoFormService.getItemPedido).toHaveBeenCalled();
      expect(itemPedidoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemPedido>>();
      const itemPedido = { id: 14110 };
      jest.spyOn(itemPedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemPedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemPedidoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProduto', () => {
      it('should forward to produtoService', () => {
        const entity = { id: 3606 };
        const entity2 = { id: 14085 };
        jest.spyOn(produtoService, 'compareProduto');
        comp.compareProduto(entity, entity2);
        expect(produtoService.compareProduto).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePedido', () => {
      it('should forward to pedidoService', () => {
        const entity = { id: 24162 };
        const entity2 = { id: 19016 };
        jest.spyOn(pedidoService, 'comparePedido');
        comp.comparePedido(entity, entity2);
        expect(pedidoService.comparePedido).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
