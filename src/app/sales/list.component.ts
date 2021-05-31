import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { SaleService } from '../_services';
import { Sale } from '../_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  users!: Sale[];

  constructor(private saleService: SaleService) {}

  ngOnInit() {
    this.saleService
      .getAll()
      .pipe(first())
      .subscribe(users => (this.users = users));
  }

  deleteUser(id: string) {
    const user = this.users.find(x => x.id === id);
    if (!user) return;
    user.isDeleting = true;
    this.saleService
      .delete(id)
      .pipe(first())
      .subscribe(() => (this.users = this.users.filter(x => x.id !== id)));
  }
}
