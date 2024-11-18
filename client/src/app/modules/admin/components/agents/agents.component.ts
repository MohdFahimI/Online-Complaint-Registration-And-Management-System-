import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent {
  agents: any[] = []
  constructor(private http: HttpClient) {
    this.http.get<any[]>('http://localhost:5100/users').subscribe((res) => {
      const agents = res.filter((user) => user.type === 'agent')
      this.agents = agents
    });
  }
}
