import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
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

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-view.html',
  styleUrls: ['./employee-view.css']
})
export class EmployeeView {
  employee: any = null;
  loading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private apollo: Apollo, private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    const id = this.route.snapshot.paramMap.get('id');

    this.apollo.query({
      query: GET_EMPLOYEE,
      fetchPolicy: 'no-cache',
      variables: { id }
    }).subscribe({
      next: (result: any) => {
        const employee = result?.data?.getEmployeeById;

        this.ngZone.run(() => {
          if (!employee) {
            this.employee = null;
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }

          this.employee = {
            ...employee,
            date_of_joining_display: this.toDisplayDate(employee.date_of_joining)
          };
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error(err);
        this.ngZone.run(() => {
          this.employee = null;
          this.loading = false;
          this.errorMessage = 'Failed to load employee details';
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
}
