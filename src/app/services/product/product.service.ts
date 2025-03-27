import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductFilter } from '../../shared/models/product-filter';
import { PagedResponse } from '../../shared/models/paged-response';
import { ProductOut } from '../../shared/models/product-out';
import { baseUrl } from '../../shared/utilities/baseUrl';
import { ProductBase } from '../../shared/models/product-base';
import { BaseOut } from '../../shared/models/base-out';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  get(filter: ProductFilter) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    let params = new HttpParams()
    if (filter.name) params = params.set("name", filter.name)
    if (filter.page) params = params.set("page", filter.page)
    if (filter.limit) params = params.set("limit", filter.limit)
    if (filter.category) params = params.set("category", filter.category)
    if (filter.min_price) params = params.set("min_price", filter.min_price)
    if (filter.max_price) params = params.set("max_price", filter.max_price)
    if (filter.min_quantity) params = params.set("min_quantity", filter.min_quantity)
    if (filter.max_quantity) params = params.set("max_quantity", filter.max_quantity)
    return this.http.get<PagedResponse<ProductOut>>(`${baseUrl}/product`, { headers, params })
  }
  add(data: ProductBase, file: File | undefined) {
    const headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    const formData = new FormData()
    formData.append("product_data", JSON.stringify(data))
    if (file) formData.append("product_image", file)
    return this.http.post<BaseOut>(`${baseUrl}/product`, formData, { headers })
  }
  edit(data: ProductBase, file: File | undefined, id: string) {
    const headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    const formData = new FormData()
    formData.append("product_data", JSON.stringify(data))
    if (file) formData.append("product_image", file)
    return this.http.put<BaseOut>(`${baseUrl}/product/${id}`, formData, { headers })
  }
  delete(id: string) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.delete<BaseOut>(`${baseUrl}/product/${id}`, { headers })
  }
}
