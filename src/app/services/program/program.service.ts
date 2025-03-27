import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Program } from '../../shared/models/program';
import { baseUrl } from '../../shared/utilities/baseUrl';
import { BaseOut } from '../../shared/models/base-out';
import { ProgramBase } from '../../shared/models/program-base';
import { GiftCard } from '../../shared/models/gift-card';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private http: HttpClient) { }

  get() {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.get<Program[]>(`${baseUrl}/program`, { headers })
  }
  add(program: ProgramBase) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.post<BaseOut>(`${baseUrl}/program`, program, { headers })
  }
  sendCode(data: GiftCard) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.post<BaseOut>(`${baseUrl}/program/sendGiftCard`, data, { headers })
  }
  printCode(item_id: number) {
    const headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    })
    return this.http.get(`${baseUrl}/program/generate-pdf/${item_id}`, { headers: headers, responseType: 'blob' })
  }
}
