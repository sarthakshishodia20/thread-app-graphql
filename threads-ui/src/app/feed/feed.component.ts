import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

// ==========================================
// FEED COMPONENT — KAISE KAAM KARTA HAI:
//
// 1. Component load hote hi ngOnInit() chalta hai
// 2. Apollo se getAllPosts QUERY bhejte hain
//    POST /graphql
//    Body: { query: "query { getAllPosts { id content authorId createdAt } }" }
//    Header: Authorization: Bearer <token>  (Apollo automatically dalta hai)
// 3. Server saare posts return karta hai
// 4. HTML mein *ngFor se render karo
// ==========================================

// GraphQL Query
const GET_ALL_POSTS = gql`
  query GetAllPosts {
    getAllPosts {
      id
      content
      imageUrl
      authorId
      createdAt
    }
  }
`;

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  createdAt: string;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  errorMsg = '';

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.apollo.query<{ getAllPosts: Post[] }>({
      query: GET_ALL_POSTS
    }).subscribe({
      next: ({ data }) => {
        this.posts = data.getAllPosts || [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Posts load nahi hue: ' + err.message;
        this.loading = false;
      }
    });
  }

  // Timestamp ko readable format mein convert karo
  formatDate(dateStr: string): string {
    const date = new Date(Number(dateStr));
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  // Author initials (sirf authorId se)
  getInitials(authorId: string): string {
    return authorId.slice(0, 2).toUpperCase();
  }
}
