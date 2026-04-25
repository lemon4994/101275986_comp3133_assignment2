import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployeeById(id: $id) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!,
    $first_name: String,
    $last_name: String,
    $email: String,
    $gender: String,
    $designation: String,
    $salary: Float,
    $date_of_joining: String,
    $department: String,
    $employee_photo: String
  ) {
    updateEmployee(
      id: $id,
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
  gender = 'Other';
  designation = '';
  salary: number | null = null;
  date_of_joining = '';
  department = '';
  newPhotoBase64: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadEmployee();
  }

  loadEmployee() {
    this.apollo.query({
      query: GET_EMPLOYEE,
      fetchPolicy: 'no-cache',
      variables: { id: this.id }
    }).subscribe({
      next: (result: any) => {
        const emp = result?.data?.getEmployeeById;

        if (!emp) {
          return;
        }

        this.ngZone.run(() => {
          this.first_name = emp.first_name;
          this.last_name = emp.last_name;
          this.email = emp.email;
          this.gender = emp.gender ?? 'Other';
          this.designation = emp.designation;
          this.salary = emp.salary;
          this.date_of_joining = this.toInputDate(emp.date_of_joining);
          this.department = emp.department;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private toInputDate(value: unknown): string {
    if (value === null || value === undefined || value === '') return '';

    const raw = String(value);
    const date = /^\d+$/.test(raw) ? new Date(Number(raw)) : new Date(raw);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().split('T')[0];
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
    const variables: any = {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      gender: this.gender,
      designation: this.designation,
      salary: this.salary !== null ? Number(this.salary) : null,
      date_of_joining: this.date_of_joining,
      department: this.department
    };

    if (this.newPhotoBase64) {
      variables.employee_photo = this.newPhotoBase64;
    }

    this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE,
      variables
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
