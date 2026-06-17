import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

// ==========================================
// PROFILE COMPONENT — KAISE KAAM KARTA HAI:
//
// Yeh sabse interesting part hai — Authorization dikhata hai!
//
// 1. Apollo POST request bhejta hai /graphql
//    Header mein: Authorization: Bearer <token>
// 2. Backend server mein:
//    - Token verify hota hai
//    - context.user = { id, email } set hota hai
//    - getCurrentLoggedInUser resolver context.user.id se DB se user dhundta hai
// 3. Logged-in user ki info return hoti hai
//
// Agar token nahi hai → null return hoga (ya error)
// ==========================================

const GET_CURRENT_USER = gql`
  query GetCurrentLoggedInUser {
    getCurrentLoggedInUser {
      id
      firstName
      lastName
      email
      profileImageUrl
    }
  }
`;

interface CurrentUser {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: CurrentUser | null = null;
  loading = true;
  errorMsg = '';

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.query<{ getCurrentLoggedInUser: CurrentUser }>({
      query: GET_CURRENT_USER
    }).subscribe({
      next: ({ data }) => {
        this.user = data.getCurrentLoggedInUser;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Profile load nahi hua: ' + err.message;
        this.loading = false;
      }
    });
  }

  getInitials(firstName: string, lastName?: string): string {
    const f = firstName?.[0] || '';
    const l = lastName?.[0] || '';
    return (f + l).toUpperCase();
  }
}
