import { Injectable } from '@angular/core';
import { TOKEN, USER } from '../model/constants';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public setUser(value: User): void {
    return sessionStorage.setItem(USER, JSON.stringify(value));
  }

  public setToken(value: string): void {
    return sessionStorage.setItem(TOKEN, value);
  }

  public getUser(): User | null {
    const user = sessionStorage.getItem(USER);
    return JSON.parse(user) || null;
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN);
  }

  public clearAuthData(): void {
    sessionStorage.removeItem(USER);
    sessionStorage.removeItem(TOKEN);
  }
}
