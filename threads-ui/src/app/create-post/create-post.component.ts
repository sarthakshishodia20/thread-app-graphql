import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

// ==========================================
// CREATE POST — KAISE KAAM KARTA HAI:
//
// 1. User content type karta hai
// 2. "Post" click → createPost() chalta hai
// 3. Apollo se MUTATION bhejte hain:
//    POST /graphql
//    Headers: { Authorization: "Bearer <token>" }   ← Apollo automatically
//    Body: { mutation createPost(content: "...") }
// 4. Backend context.user se authorId nikalta hai (token se)
// 5. Success → /feed pe redirect
//
// NOTE: authorId hum nahi bhejte! Backend khud token se nikalta hai.
// ==========================================

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($content: String!, $imageUrl: String) {
    createPost(content: $content, imageUrl: $imageUrl)
  }
`;

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  content = '';
  imageUrl = '';
  loading = false;
  errorMsg = '';
  charLimit = 500;

  constructor(private apollo: Apollo, private router: Router) {}

  get charsLeft(): number {
    return this.charLimit - this.content.length;
  }

  submitPost() {
    if (!this.content.trim()) {
      this.errorMsg = 'Content empty nahi hona chahiye';
      return;
    }
    if (this.content.length > this.charLimit) {
      this.errorMsg = `Content ${this.charLimit} characters se zyada nahi hona chahiye`;
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.apollo.mutate<{ createPost: boolean }>({
      mutation: CREATE_POST_MUTATION,
      variables: {
        content: this.content.trim(),
        imageUrl: this.imageUrl.trim() || null
      }
    }).subscribe({
      next: ({ data }) => {
        this.loading = false;
        if (data?.createPost) {
          this.router.navigate(['/feed']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.message || 'Post submit nahi hua. Try again.';
      }
    });
  }
}
