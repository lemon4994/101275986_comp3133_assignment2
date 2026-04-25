import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, RouterLink } from '@angular/router';

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  username = '';
  email = '';
  password = '';

  constructor(private apollo: Apollo, private router: Router) {}

  onSubmit() {
    this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        username: this.username,
        email: this.email,
        password: this.password
      }
    }).subscribe({
      next: (result: any) => {
        const token = result?.data?.signup?.token;

        if (token) {
          localStorage.setItem('token', token);
        }

        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create account');
      }
    });
  }
}
