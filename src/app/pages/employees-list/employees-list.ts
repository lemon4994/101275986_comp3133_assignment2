import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

const GET_EMPLOYEES = gql`
  query {
    getEmployees {
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

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(_id: $id)
  }
`;

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employees-list.html',
  styleUrls: ['./employees-list.css']
})
export class EmployeesList {
  employees: any[] = [];

  constructor(private apollo: Apollo, private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    this.loadEmployees();
  }

  loadEmployees() {
    this.apollo.query({
      query: GET_EMPLOYEES,
      fetchPolicy: 'no-cache'
    }).subscribe({
      next: (result: any) => {
        const employees = result?.data?.getEmployees;
        this.ngZone.run(() => {
          this.employees = Array.isArray(employees)
            ? employees.map((employee: any) => ({
                ...employee,
                date_of_joining_display: this.toDisplayDate(employee.date_of_joining)
              }))
            : [];
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error(err);
        this.ngZone.run(() => {
          this.employees = [];
          this.cdr.detectChanges();
        });
      }
    });
  }

  private toDisplayDate(value: unknown): string {
    if (value === null || value === undefined || value === '') return '';

    const raw = String(value);
    const date = /^\d+$/.test(raw) ? new Date(Number(raw)) : new Date(raw);

    if (Number.isNaN(date.getTime())) {
      return raw;
    }

    return date.toLocaleDateString();
  }

  deleteEmployee(id: string) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.apollo.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { id }
    }).subscribe(() => {
      this.loadEmployees();
    });
  }
}
