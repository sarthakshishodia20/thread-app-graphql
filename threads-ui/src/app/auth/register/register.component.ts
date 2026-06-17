import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

// ==========================================
// REGISTER COMPONENT — KAISE KAAM KARTA HAI:
//
// 1. User form fill karta hai (firstName, lastName, email, password)
// 2. "Register" click hota hai → registerUser() function chalta hai
// 3. Apollo se GraphQL MUTATION bhejte hain:
//    POST /graphql
//    Body: { query: "mutation { createUser(firstName:...) }" }
// 4. Server true/false return karta hai
// 5. Success → /login pe redirect
//
// MUTATION vs QUERY farak:
//   - Query = data READ karna (GET jaisa)
//   - Mutation = data WRITE karna (POST/PUT/DELETE jaisa)
// ==========================================

const REGISTER_MUTATION = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    )
  }
`;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private apollo: Apollo, private router: Router) {}

  registerUser() {
    if (!this.firstName || !this.email || !this.password) {
      this.errorMsg = 'Sab required fields fill karo';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    // GraphQL Mutation call karo
    this.apollo.mutate<{ createUser: boolean }>({
      mutation: REGISTER_MUTATION,
      variables: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      }
    }).subscribe({
      next: ({ data }) => {
        this.loading = false;
        if (data?.createUser) {
          this.successMsg = 'Account ban gaya! Login karo...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.message || 'Registration failed. Try again.';
      }
    });
  }
}
