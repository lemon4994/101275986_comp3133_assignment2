import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $first_name: String!,
    $last_name: String!,
    $email: String,
    $gender: String,
    $designation: String!,
    $salary: Float!,
    $date_of_joining: String!,
    $department: String!,
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      gender: $gender,
      designation: $designation,
      salary: $salary,
      date_of_joining: $date_of_joining,
      department: $department,
      employee_photo: $employee_photo
    ) {
      _id
    }
  }
`;

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-add.html',
  styleUrls: ['./employee-add.css']
})
export class EmployeeAdd {
  first_name = '';
  last_name = '';
  email = '';
  gender = 'Other';
  designation = '';
  salary: number | null = null;
  date_of_joining = '';
  department = '';
  photoBase64: string | null = null;

  constructor(private apollo: Apollo, private router: Router) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        gender: this.gender,
        designation: this.designation,
        salary: Number(this.salary),
        date_of_joining: this.date_of_joining,
        department: this.department,
        employee_photo: this.photoBase64
      }
    }).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add employee');
      }
    });
  }
}
