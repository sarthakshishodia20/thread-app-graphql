import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ==========================================
// AUTH GUARD — SAMJHO:
//
// Jab bhi koi /feed, /create, /profile pe jaane ki koshish karta hai
// Guard pehle check karta hai: "kya token hai?"
// - Agar nahi hai → /login pe redirect
// - Agar hai → page allow
//
// Route pe lagaate hain: canActivate: [authGuard]
// ==========================================

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Jaane do!
  }

  // Nahi hai token → login page pe bhejo
  router.navigate(['/login']);
  return false;
};
