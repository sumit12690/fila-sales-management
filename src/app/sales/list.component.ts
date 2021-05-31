import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { SaleService } from '../_services';
import { Sale } from '../_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  sales!: Sale[];

  constructor(private saleService: SaleService) {}

  ngOnInit() {
    this.saleService
      .getAll()
      .pipe(first())
      .subscribe(sales => (this.sales = sales));
  }

  deleteSale(id: string) {
    const sale = this.sales.find(x => x.id === id);
    if (!sale) return;
    sale.isDeleting = true;
    this.saleService
      .delete(id)
      .pipe(first())
      .subscribe(() => (this.sales = this.sales.filter(x => x.id !== id)));
  }
}
