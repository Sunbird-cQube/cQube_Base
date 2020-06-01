import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor() { }
  handleError(errorResponse: HttpErrorResponse) {
    let errorMsg = '';

    if (errorResponse.error instanceof ErrorEvent) {
      console.log('this is client side error');
      errorMsg = `Error: ${errorResponse.error.message}`;
      //console.error('Client Side Error:', errorResponse.error.message);
    } else {
      console.log('this is server side error');
      errorMsg = `Error Code: ${errorResponse.status}, Message: ${errorResponse.message}`;
      //console.error('Server Side Error ', errorResponse);
    }
    console.log(errorMsg);
    return throwError(errorMsg);
    // return throwError('There is a problem with the service . we are notified and working on it.Please try again later ')

  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError(this.handleError)
      )
  };
}