import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResponse } from '../../shared/models/paged-response';
import { baseUrl } from '../../shared/utilities/baseUrl';
import { PriceList } from '../../shared/models/pricelist';
import { PricelistBase } from '../../shared/models/pricelist-base';
import { BaseOut } from '../../shared/models/base-out';
import { PricelistLineBase } from '../../shared/models/pricelist-line-base';

@Injectable({
  providedIn: 'root'
})
export class PricelistService {

  constructor(private http: HttpClient) { }

  get() {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.get<PriceList[]>(`${baseUrl}/pricelist`, { headers })
  }
  add(pricelist: PricelistBase) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.post<BaseOut>(`${baseUrl}/pricelist`, pricelist, { headers })
  }
  addPricelistLine(line: PricelistLineBase) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.post<BaseOut>(`${baseUrl}/pricelistline`, line, { headers })
  }
  edit(pricelist: PricelistBase, id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.put<BaseOut>(`${baseUrl}/pricelist/${id}`, pricelist, { headers })
  }
  editPricelistLine(line: PricelistLineBase, id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.put<BaseOut>(`${baseUrl}/pricelistline/${id}`, line, { headers })
  }
  deletePricelistLine(id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.delete<BaseOut>(`${baseUrl}/pricelistline/${id}`, { headers })
  }
}

