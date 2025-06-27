import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface RegisterAdminData {
  username: string;
  email: string;
  password: string;
  adminCode: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const savedUser = localStorage.getItem('currentUser');
    const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';

    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
    this.isAdminSubject.next(savedIsAdmin);
  }

  // Основные методы аутентификации
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((user: any) => {
        this.setCurrentUser(user);
        this.checkAdminStatus(user);
      })
    );
  }

  // Методы для работы с администраторами
  registerAdmin(data: RegisterAdminData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username: data.username,
      email: data.email,
      password: data.password,
      adminCode: data.adminCode
    }).pipe(
      tap((user: any) => {
        this.setCurrentUser(user);
        if (data.adminCode === '123') {
          this.setAdminStatus(true);
        }
      })
    );
  }

  getAdminCode(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/admin-code`);
  }

  verifyAdmin(code: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/verify-admin`, code, {
      headers: { 'Content-Type': 'text/plain' }
    }).pipe(
      tap((isValid: boolean) => {
        if (isValid) {
          this.setAdminStatus(true);
        }
      })
    );
  }

  // Быстрый вход администратора (опционально)
  loginAsAdmin(): Observable<any> {
    return this.login('admin@example.com', 'admin123');
  }

  // Вспомогательные методы
  private checkAdminStatus(user: any) {
    if (user?.roles?.includes('ADMIN')) {
      this.setAdminStatus(true);
    }
  }

  private setAdminStatus(value: boolean) {
    this.isAdminSubject.next(value);
    localStorage.setItem('isAdmin', String(value));
  }

  private setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    this.currentUserSubject.next(null);
    this.setAdminStatus(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
  }

  // Геттеры
  get isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  get currentUser(): any {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    return this.currentUser?.id || null;
  }
}