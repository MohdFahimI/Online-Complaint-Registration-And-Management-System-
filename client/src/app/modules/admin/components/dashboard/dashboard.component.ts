import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  complaints = 0;
  customers = 0;
  agents = 0;
  data = [
    { name: 'Complaints', count: `${this.complaints}`, routerLink: '/admin/complaints' },
    { name: 'Customers', count: `${this.customers}`, routerLink: '/admin/customers' },
    { name: 'Agents', count: `${this.agents}`, routerLink: '/admin/agents' },
    // { name: 'Add Agents', count: "___", routerLink: '/admin/add-agents' },
  ];

  constructor(private http: HttpClient) {
    this.http.get<any[]>('http://localhost:5100/complaints').subscribe((res) => {
      this.complaints = res.length;
      this.data[0].count = `Total complaints: ${this.complaints}`;
    });

    this.http.get<any[]>('http://localhost:5100/users').subscribe((res: any[]) => {
      const customers = res.filter((user) => user.type === 'user');
      this.customers = customers.length;
      this.data[1].count = `Total Customers: ${this.customers}`;
    });

    this.http.get<any[]>('http://localhost:5100/users').subscribe((res: any[]) => {
      const agents = res.filter((user) => user.type === 'agent');
      this.agents = agents.length;
      this.data[2].count = `Total Agents: ${this.agents}`;
    });
  }
}
