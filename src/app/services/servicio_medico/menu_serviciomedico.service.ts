import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { INavData } from '@coreui/angular';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenusService {  
  
  private apiUrlmenu : string = environment.apiUrlServMedico + 'menus/';

  constructor(private http: HttpClient) { }

  menusAll() : Observable<INavData[]> {
    return this.http.get<INavData[]>(this.apiUrlmenu + 'consultar')
			.pipe(
		//		tap(result => console.log(`menusAll: (${result.length})`)),
				catchError(this.handleError)
			);
  }

  menusUser(user: string) : Observable<INavData[]> {
    return this.http.get<INavData[]>(this.apiUrlmenu + 'consultar/' + user)
			.pipe(
			//	tap(result => console.log(`menuUser: (${result.length})`)),
				catchError(this.handleError)
			);
  }  

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}