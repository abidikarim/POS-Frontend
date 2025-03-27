import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderFilter } from '../../shared/models/order-filter';
import { PagedResponse } from '../../shared/models/paged-response';
import { OrderOut } from '../../shared/models/order-out';
import { baseUrl } from '../../shared/utilities/baseUrl';
import { OrderBase } from '../../shared/models/order-base';
import { BaseOut } from '../../shared/models/base-out';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  get(filter: OrderFilter) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    let params = new HttpParams()
      .set("page", filter.page)
      .set("limit", filter.limit)
    if (filter.name) params = params.set("name", filter.name)
    if (filter.ref) params = params.set("ref", filter.ref)
    if (filter.session_id) params = params.set("session_id", filter.session_id)
    if (filter.number) params = params.set("number", filter.number)
    return this.http.get<PagedResponse<OrderOut>>(`${baseUrl}/order`, { headers, params })
  }
  add(order: OrderBase) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.post<BaseOut>(`${baseUrl}/order`, order, { headers })
  }
}
