import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {ADMIN_USERNAME, PASSWORD} from '../const';
import type {Result} from '../types/result';
import type {LoginSession} from '../types/resp/loginSession';
import type {Response} from '../types/response';
import MockApi from '../api/mockApi';
import {LoginForm} from '../types/req/LoginForm';
import {UpdatePassForm} from '../types/req/UpdatePassForm';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private loginSession: LoginSession = {
    token: '12345678901',
    uid: 111,
    username: ADMIN_USERNAME
  }

  constructor() {}

  login(loginForm: LoginForm): Observable<Result<LoginSession>> {
    const isValidUser = loginForm.username === ADMIN_USERNAME && loginForm.password === PASSWORD;

    if (isValidUser) {
      this.isAuthenticated = true
      return MockApi.operateSuccessfullyWithData(this.loginSession).pipe(
        map((response: Response<Result<LoginSession>>) => response.data)
      );
    } else {
      return MockApi.operateUnsuccessfully('用户名或密码不正确').pipe(
        map((response: Response<Result<object>>) => ({
          code: response.data.code,
          msg: response.data.msg,
          data: undefined
        }) as Result<LoginSession>)
      );
    }
  }

  updatePass(updatePassForm: UpdatePassForm): Observable<Result<void>> {
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  logout(): Observable<Result<void>> {
    this.isAuthenticated = false;
    return MockApi.operateSuccessfully().pipe(
      map((response: Response<Result<void>>) => response.data)
    );
  }

  isLoggedIn(): boolean {
    const loginToken = sessionStorage.getItem('loginToken')
    if (loginToken && !this.isAuthenticated) {
      this.isAuthenticated = true
    }
    return this.isAuthenticated;
  }
}
