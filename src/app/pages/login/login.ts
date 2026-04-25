import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, RouterLink } from '@angular/router';

const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      message
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';

  constructor(private apollo: Apollo, private router: Router) {}

  onSubmit() {
    this.apollo.query({
      query: LOGIN_QUERY,
      fetchPolicy: 'no-cache',
      variables: {
        username: this.username,
        password: this.password
      }
    }).subscribe({
      next: (result: any) => {
        const loginResult = result?.data?.login;

        if (!loginResult?.success) {
          alert(loginResult?.message || 'Invalid username or password');
          return;
        }

        if (loginResult.token) {
          localStorage.setItem('token', loginResult.token);
        }

        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error(err);
        alert('Invalid username or password');
      }
    });
  }
}
