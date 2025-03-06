import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationParams } from '../../shared/models/pagination-params';
import { PagedResponse } from '../../shared/models/paged-response';
import { CategoryOut } from '../../shared/models/category-out';
import { baseUrl } from '../../shared/utilities/baseUrl';
import { CategoryBase } from '../../shared/models/category-base';
import { BaseOut } from '../../shared/models/base-out';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  get(pg_params: PaginationParams) {
    const params = new HttpParams()
      .set("name", pg_params.name)
      .set("limit", pg_params.limit)
      .set("page", pg_params.page)
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.get<PagedResponse<CategoryOut>>(`${baseUrl}/category`, { headers, params })
  }
  add(data: CategoryBase, file: File | undefined) {
    const headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    const formData = new FormData()
    formData.append("category_data", JSON.stringify(data))
    if (file) formData.append("category_image", file)
    return this.http.post<BaseOut>(`${baseUrl}/category`, formData, { headers })
  }
  edit(data: CategoryBase, file: File | undefined, id: number) {
    const headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    const formData = new FormData()
    formData.append("category_data", JSON.stringify(data))
    if (file) formData.append("category_image", file)
    return this.http.put<BaseOut>(`${baseUrl}/category/${id}`, formData, { headers })
  }
  delete(id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.delete<BaseOut>(`${baseUrl}/category/${id}`, { headers })
  }
}
