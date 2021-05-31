import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

const salesKey = 'fila-sales-manager';
const salesJSON = localStorage.getItem(salesKey);
let sales: any[] = salesJSON
  ? JSON.parse(salesJSON)
  : [
      {
        id: 1,
        storeName: 'Fila',
        category: 'Footwear',
        subCategory: 'Fitness',
        sku: 'ABCD',
        quantity: 50,
        salesAmount: 5000
      }
    ];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/sales') && method === 'GET':
          return getSales();
        case url.match(/\/sales\/\d+$/) && method === 'GET':
          return getSaleById();
        case url.endsWith('/sales') && method === 'POST':
          return createSale();
        case url.match(/\/sales\/\d+$/) && method === 'PUT':
          return updateSale();
        case url.match(/\/sales\/\d+$/) && method === 'DELETE':
          return deleteSale();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function getSales() {
      return ok(sales.map(x => basicDetails(x)));
    }

    function getSaleById() {
      const sale = sales.find(x => x.id === idFromUrl());
      return ok(basicDetails(sale));
    }

    function createSale() {
      const sale = body;

      // assign sale id and a few other properties then save
      sale.id = newSaleId();
      sales.push(sale);
      localStorage.setItem(salesKey, JSON.stringify(sales));

      return ok();
    }

    function updateSale() {
      let params = body;
      let sale = sales.find(x => x.id === idFromUrl());

      // update and save sale
      Object.assign(sale, params);
      localStorage.setItem(salesKey, JSON.stringify(sales));

      return ok();
    }

    function deleteSale() {
      sales = sales.filter(x => x.id !== idFromUrl());
      localStorage.setItem(salesKey, JSON.stringify(sales));
      return ok();
    }

    // helper functions

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message: any) {
      return throwError({ error: { message } }).pipe(
        materialize(),
        delay(500),
        dematerialize()
      ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function basicDetails(sale: any) {
      const {
        id,
        storeName,
        category,
        subCategory,
        sku,
        quantity,
        salesAmount
      } = sale;
      return {
        id,
        storeName,
        category,
        subCategory,
        sku,
        quantity,
        salesAmount
      };
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function newSaleId() {
      return sales.length ? Math.max(...sales.map(x => x.id)) + 1 : 1;
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
