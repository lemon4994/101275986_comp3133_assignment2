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
      position
      department
      photoUrl
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
      this.employee = result.data.getEmployeeById;
    });
  }
}
