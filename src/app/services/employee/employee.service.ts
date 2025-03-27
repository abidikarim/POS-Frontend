import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResponse } from '../../shared/models/paged-response';
import { EmployeeBase } from '../../shared/models/employee-base';
import { baseUrl } from '../../shared/utilities/baseUrl';
import { PossibleFields } from '../../shared/models/import-fields';
import { BaseOut } from '../../shared/models/base-out';
import { EmployeeEdit } from '../../shared/models/employee-edit';
import { PaginationParams } from '../../shared/models/pagination-params';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  get(filter: PaginationParams) {
    const headers = new HttpHeaders({
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    let params = new HttpParams()
    if (filter.name) params = params.set("name", filter.name)
    if (filter.limit) params = params.set("limit", filter.limit)
    if (filter.page) params = params.set("page", filter.page)

    return this.http.get<PagedResponse<EmployeeBase>>(`${baseUrl}/employee/`, { headers, params })
  }
  getPossibleFields() {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.get<PossibleFields>(`${baseUrl}/possibleImportFields`, { headers })
  }
  add(data: EmployeeBase) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.post<BaseOut>(`${baseUrl}/employee`, data, { headers })
  }
  edit(data: EmployeeEdit, id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.put<BaseOut>(`${baseUrl}/employee/${id}`, data, { headers })
  }
  delete(id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.delete<BaseOut>(`${baseUrl}/employee/${id}`, { headers })
  }
}
