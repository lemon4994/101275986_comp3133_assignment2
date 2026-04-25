import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

const GET_EMPLOYEES = gql`
  query {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      position
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

  constructor(private apollo: Apollo) {
    this.loadEmployees();
  }

  loadEmployees() {
    this.apollo.watchQuery({
      query: GET_EMPLOYEES
    }).valueChanges.subscribe((result: any) => {
      this.employees = result.data.getAllEmployees;
    });
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
