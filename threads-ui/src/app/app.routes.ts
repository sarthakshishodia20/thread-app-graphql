import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

// ==========================================
// ROUTES — SAMJHO:
//
// /login  → Login page (koi bhi dekh sakta hai)
// /register → Register page (koi bhi)
// /feed → Posts feed (sirf logged-in users) ← authGuard protect karta hai
// /create → Create post (sirf logged-in) ← authGuard protect karta hai
// /profile → Profile (sirf logged-in) ← authGuard protect karta hai
// '' (empty) → /feed pe redirect
// ** (koi bhi) → /login pe redirect
// ==========================================

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('./feed/feed.component').then(m => m.FeedComponent),
    canActivate: [authGuard]  // ← Protected!
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-post/create-post.component').then(m => m.CreatePostComponent),
    canActivate: [authGuard]  // ← Protected!
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]  // ← Protected!
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
