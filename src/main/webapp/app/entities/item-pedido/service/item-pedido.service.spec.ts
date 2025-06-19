import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IItemPedido } from '../item-pedido.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../item-pedido.test-samples';

import { ItemPedidoService } from './item-pedido.service';

const requireRestSample: IItemPedido = {
  ...sampleWithRequiredData,
};

describe('ItemPedido Service', () => {
  let service: ItemPedidoService;
  let httpMock: HttpTestingController;
  let expectedResult: IItemPedido | IItemPedido[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ItemPedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ItemPedido', () => {
      const itemPedido = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itemPedido).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemPedido', () => {
      const itemPedido = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itemPedido).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemPedido', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemPedido', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItemPedido', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItemPedidoToCollectionIfMissing', () => {
      it('should add a ItemPedido to an empty array', () => {
        const itemPedido: IItemPedido = sampleWithRequiredData;
        expectedResult = service.addItemPedidoToCollectionIfMissing([], itemPedido);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemPedido);
      });

      it('should not add a ItemPedido to an array that contains it', () => {
        const itemPedido: IItemPedido = sampleWithRequiredData;
        const itemPedidoCollection: IItemPedido[] = [
          {
            ...itemPedido,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItemPedidoToCollectionIfMissing(itemPedidoCollection, itemPedido);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemPedido to an array that doesn't contain it", () => {
        const itemPedido: IItemPedido = sampleWithRequiredData;
        const itemPedidoCollection: IItemPedido[] = [sampleWithPartialData];
        expectedResult = service.addItemPedidoToCollectionIfMissing(itemPedidoCollection, itemPedido);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemPedido);
      });

      it('should add only unique ItemPedido to an array', () => {
        const itemPedidoArray: IItemPedido[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itemPedidoCollection: IItemPedido[] = [sampleWithRequiredData];
        expectedResult = service.addItemPedidoToCollectionIfMissing(itemPedidoCollection, ...itemPedidoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemPedido: IItemPedido = sampleWithRequiredData;
        const itemPedido2: IItemPedido = sampleWithPartialData;
        expectedResult = service.addItemPedidoToCollectionIfMissing([], itemPedido, itemPedido2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemPedido);
        expect(expectedResult).toContain(itemPedido2);
      });

      it('should accept null and undefined values', () => {
        const itemPedido: IItemPedido = sampleWithRequiredData;
        expectedResult = service.addItemPedidoToCollectionIfMissing([], null, itemPedido, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemPedido);
      });

      it('should return initial array if no ItemPedido is added', () => {
        const itemPedidoCollection: IItemPedido[] = [sampleWithRequiredData];
        expectedResult = service.addItemPedidoToCollectionIfMissing(itemPedidoCollection, undefined, null);
        expect(expectedResult).toEqual(itemPedidoCollection);
      });
    });

    describe('compareItemPedido', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItemPedido(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 14110 };
        const entity2 = null;

        const compareResult1 = service.compareItemPedido(entity1, entity2);
        const compareResult2 = service.compareItemPedido(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 14110 };
        const entity2 = { id: 30572 };

        const compareResult1 = service.compareItemPedido(entity1, entity2);
        const compareResult2 = service.compareItemPedido(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 14110 };
        const entity2 = { id: 14110 };

        const compareResult1 = service.compareItemPedido(entity1, entity2);
        const compareResult2 = service.compareItemPedido(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
