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
    const params = new HttpParams()
      .set("name", filter.name)
      .set("page", filter.page)
      .set("limit", filter.limit)
      .set("category", filter.category)
      .set("min_price", filter.min_price)
      .set("max_price", filter.max_price)
      .set("min_quantity", filter.min_quantity)
      .set("max_quantity", filter.max_quantity)
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
  edit(data: ProductBase, file: File | undefined, id: number) {
    const headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    const formData = new FormData()
    formData.append("product_data", JSON.stringify(data))
    if (file) formData.append("product_image", file)
    return this.http.put<BaseOut>(`${baseUrl}/product/${id}`, formData, { headers })
  }
  delete(id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.delete<BaseOut>(`${baseUrl}/product/${id}`, { headers })
  }
}
