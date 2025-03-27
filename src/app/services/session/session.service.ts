import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationParams } from '../../shared/models/pagination-params';
import { PagedResponse } from '../../shared/models/paged-response';
import { Session } from '../../shared/models/session';
import { baseUrl } from '../../shared/utilities/baseUrl';
import { BaseOut } from '../../shared/models/base-out';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }

  get(filter: PaginationParams) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    let params = new HttpParams()
      .set("page", filter.page)
      .set("limit", filter.limit)
    if (filter.name) params = params.set("name", filter.name)
    return this.http.get<PagedResponse<Session>>(`${baseUrl}/session`, { headers, params })
  }
  add(session: Session) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.post<BaseOut>(`${baseUrl}/session`, session, { headers })
  }
  edit(session: Session, id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.put<BaseOut>(`${baseUrl}/session/${id}`, session, { headers })
  }
}
