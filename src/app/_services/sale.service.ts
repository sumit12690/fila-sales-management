import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Sale } from '../_models';

const baseUrl = `${environment.apiUrl}/sales`;

@Injectable({ providedIn: 'root' })
export class SaleService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Sale[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<Sale>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(baseUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${baseUrl}/${id}`, params);
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
