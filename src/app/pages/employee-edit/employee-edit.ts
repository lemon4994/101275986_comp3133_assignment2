import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployeeById(_id: $id) {
      _id
      first_name
      last_name
      email
      position
      department
      photoUrl
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!,
    $first_name: String!,
    $last_name: String!,
    $email: String!,
    $position: String!,
    $department: String!,
    $photoUrl: String
  ) {
    updateEmployee(
      _id: $id,
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      position: $position,
      department: $department,
      photoUrl: $photoUrl
    ) {
      _id
    }
  }
`;

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './employee-edit.html',
  styleUrls: ['./employee-edit.css']
})
export class EmployeeEdit {
  id: string | null = null;

  first_name = '';
  last_name = '';
  email = '';
  position = '';
  department = '';
  photoUrl: string | null = null;
  newPhotoBase64: string | null = null;

  constructor(private route: ActivatedRoute, private apollo: Apollo, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadEmployee();
  }

  loadEmployee() {
    this.apollo.watchQuery({
      query: GET_EMPLOYEE,
      variables: { id: this.id }
    }).valueChanges.subscribe((result: any) => {
      const emp = result?.data?.getEmployeeById;

      if (!emp) {
        return;
      }

      this.first_name = emp.first_name;
      this.last_name = emp.last_name;
      this.email = emp.email;
      this.position = emp.position;
      this.department = emp.department;
      this.photoUrl = emp.photoUrl ?? null;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.newPhotoBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: {
        id: this.id,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        position: this.position,
        department: this.department,
        photoUrl: this.newPhotoBase64 || this.photoUrl
      }
    }).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update employee');
      }
    });
  }
}
