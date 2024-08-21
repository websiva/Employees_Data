import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { employee } from '../model/employee';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private http:HttpClient) { }

  GetAllEmployees(){
    return this.http.get<employee[]>(`${environment.apiUrl}?code=${environment.apiKey}`);
  }


}
