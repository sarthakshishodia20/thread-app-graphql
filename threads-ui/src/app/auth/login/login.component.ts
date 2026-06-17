import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../../services/auth.service';

// ==========================================
// LOGIN COMPONENT — KAISE KAAM KARTA HAI:
//
// 1. User email + password fill karta hai
// 2. "Login" click hota hai → loginUser() function chalta hai
// 3. Apollo se GraphQL QUERY bhejte hain:
//    POST /graphql
//    Body: { query: "query { getUserToken(email: ..., password: ...) }" }
// 4. Server JWT token return karta hai
// 5. Token localStorage mein save → /feed pe redirect
// ==========================================

// GraphQL Query define karo
const LOGIN_QUERY = gql`
  query GetUserToken($email: String!, $password: String!) {
    getUserToken(email: $email, password: $password)
  }
`;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router
  ) {}

  loginUser() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Email aur password dono required hain';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    // GraphQL Query call karo
    this.apollo.query<{ getUserToken: string }>({
      query: LOGIN_QUERY,
      variables: {
        email: this.email,
        password: this.password
      }
    }).subscribe({
      next: ({ data }) => {
        const token = data.getUserToken;
        this.authService.saveToken(token); // Token save karo
        this.loading = false;
        this.router.navigate(['/feed']); // Feed pe jao
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.message || 'Login failed. Check credentials.';
      }
    });
  }
}
