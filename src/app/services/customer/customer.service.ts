import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationParams } from '../../shared/models/pagination-params';
import { baseUrl } from '../../shared/utilities/baseUrl';
import { PagedResponse } from '../../shared/models/paged-response';
import { Customer } from '../../shared/models/customer';
import { BaseOut } from '../../shared/models/base-out';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  get(filter: PaginationParams) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    let params = new HttpParams()
    if (filter.name) params = params.set("name", filter.name)
    if (filter.limit) params = params.set("limit", filter.limit)
    if (filter.page) params = params.set("page", filter.page)
    return this.http.get<PagedResponse<Customer>>(`${baseUrl}/customer`, { headers, params })
  }
  add(customer: Customer) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.post<BaseOut>(`${baseUrl}/customer`, customer, { headers })
  }
  edit(customer: Customer, id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.put<BaseOut>(`${baseUrl}/customer/${id}`, customer, { headers })
  }
  delete(id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.delete<BaseOut>(`${baseUrl}/customer/${id}`, { headers })
  }
}
