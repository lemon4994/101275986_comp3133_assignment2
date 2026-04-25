import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, RouterLink } from '@angular/router';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
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
  email = '';
  password = '';

  constructor(private apollo: Apollo, private router: Router) {}

  onSubmit() {
    this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        email: this.email,
        password: this.password
      }
    }).subscribe({
      next: (result: any) => {
        localStorage.setItem('token', result.data.login.token);
        this.router.navigate(['/employees']);
      },
      error: () => {
        alert('Invalid email or password');
      }
    });
  }
}
