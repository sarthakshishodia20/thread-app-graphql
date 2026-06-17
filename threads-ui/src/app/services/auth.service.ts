import { Injectable } from '@angular/core';

// ==========================================
// AUTH SERVICE — SAMJHO:
//
// Jab user login karta hai → token localStorage mein save hota hai
// Jab user koi protected page kholta hai → isLoggedIn() check hota hai
// Jab user logout karta hai → token delete hota hai
// Apollo Client automatically is token ko har request mein use karta hai
// ==========================================

const TOKEN_KEY = 'threads_token';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Token save karo
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Token nikaalo
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Login hai ya nahi?
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout — token delete karo
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
