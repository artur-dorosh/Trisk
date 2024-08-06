import { Injectable } from '@angular/core';
import { catchError, delay, filter, Observable, of, switchMap, throwError } from 'rxjs';
import { UserResponse } from '../interfaces/user-reponse.interface';
import { User } from '../interfaces/user.interface';
import { Gender } from '../enums/gender';
import HTTP_ERRORS from '../constants/http-errors.constant';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private userData: User = {
    name: 'Artemii',
    surname: 'Dorosh',
    age: 29,
    email: 'doroshartemii@gmail.com',
    gender: Gender.MALE,
    isLegal: true
  };

  getUserData(): Observable<UserResponse> {
    return of({ userInfo: {} as User, success: false, status: 500 }).pipe(
      delay(500),
      switchMap((response: UserResponse) => this.interceptEmulation(of(response)))
    );
  }

  saveUserData(formValue: Partial<User>): Observable<UserResponse> {
    const dataForUpdate: Partial<User> = Object.entries(formValue)
      .filter(([key, value]) => value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    this.userData = { ...this.userData, ...dataForUpdate };

    return of({ userInfo: this.userData, success: true, status: 200 }).pipe(
      delay(1000),
      switchMap((response: UserResponse) => this.interceptEmulation(of(response)))
    );
  }

  private interceptEmulation(response: Observable<any>): Observable<any> {
    return response.pipe(
      switchMap((response) => response.success ? of(response) : throwError(() => HTTP_ERRORS[response.status])),
      catchError((error) => {
        console.log(error); // here we can show snackbar in order to notify user about error details
        return of(null);
      }),
      filter(Boolean)
    )
  }
}
