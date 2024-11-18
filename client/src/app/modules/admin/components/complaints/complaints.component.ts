import { Component, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { ObjectId } from 'bson';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent {
  complaints: any[] = []
  agents: any[] = []
  selectedAgent: string = ''

  constructor(private http: HttpClient) {
    this.http.get<any[]>(`http://localhost:5100/complaints`).subscribe((res) => {
      this.complaints = res
    })

    this.http.get<any[]>(`http://localhost:5100/users`).subscribe((res:any[]) => {
      const response = res.filter((user) => user.type === 'agent')
      this.agents = response
    })
  }

  onSubmitStatus(id: string, status: string) {
    console.log(status)
    this.http.put(`http://localhost:5100/complaints/${id}/update-status`, {status:status}).subscribe((res) => {
      this.http.get<any[]>(`http://localhost:5100/complaints`).subscribe((res) => {
        this.complaints = res
      })
    })
  }

  onAssign(userId: String,complaint: String, agent: String, ) {
    const details = {
      customerId: userId,
      complaintId: complaint,
      agentId: agent
    };
  
    // console.log(details);
  
    this.http.post(`http://localhost:5100/agents-complaints/${complaint}`, details)
      .subscribe(response => {
        alert('Complaint Assigned Successful!')
      });
  
    this.selectedAgent = "";
  }
}
