import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactRequest, ContactResponse } from '../models/contact.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  sendContactMessage(request: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiUrl}/api/contact`, request);
  }
}
