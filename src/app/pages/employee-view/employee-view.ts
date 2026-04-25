import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CommonModule } from '@angular/common';

const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    getEmployeeById(_id: $id) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-view.html',
  styleUrls: ['./employee-view.css']
})
export class EmployeeView {
  employee: any = null;

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    const id = this.route.snapshot.paramMap.get('id');

    this.apollo.watchQuery({
      query: GET_EMPLOYEE,
      variables: { id }
    }).valueChanges.subscribe((result: any) => {
      const employee = result?.data?.getEmployeeById;

      if (!employee) {
        this.employee = null;
        return;
      }

      this.employee = {
        ...employee,
        date_of_joining_display: this.toDisplayDate(employee.date_of_joining)
      };
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
}
