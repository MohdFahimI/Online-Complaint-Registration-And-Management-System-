import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Complaint {
  status: string;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  user: any = '';
  currentUser: any = '';
  senderId: any = '';
  totalComplaints: any[] = [];
  pendingComplaints: any[] = [];
  resolvedComplaints: any[] = [];
  messages: any[] = [];
  messageInput: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {

    // const token = localStorage.getItem("token")
    // if (!token) {
    //   this.router.navigate(['/login'])
    // }
    const senderId = localStorage.getItem('userId');
    this.route.params.subscribe(params => {
      this.http.get<any>(`http://localhost:5100/user/${params['id']}`).subscribe((res) => {
        this.user = res;
      });
    });

    this.route.params.subscribe(params => {
      this.http.get<any>(`http://localhost:5100/user/${senderId}`).subscribe((res) => {
        this.currentUser = res;
      });
    });

    this.senderId = senderId
    this.http.get<any[]>('http://localhost:5100/messages').subscribe((res) => {
      this.messages = res;
    });

    this.http.get<Complaint[]>(`http://localhost:5100/customer-complaints/${senderId}`).subscribe((res: Complaint[]) => {
      this.totalComplaints = res;
      this.resolvedComplaints = res.filter((data: Complaint) => data.status !== 'pending');
      this.pendingComplaints = res.filter((data: Complaint) => data.status === 'pending');
      console.log(this.totalComplaints);
    });
  }



  sendComment(userId: string, messageInput: string) {
    const senderId = localStorage.getItem('userId');

    this.http.post('http://localhost:5100/messages', { receiverId: userId, senderId, content: messageInput }).subscribe(
      (response) => {
        this.http.get<any[]>('http://localhost:5100/messages').subscribe((res) => {
          this.messages = res.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          this.messageInput = '';
        });

        this.http.post('http://localhost:5100/notifications', { senderId: senderId, userId: userId, content: messageInput }).subscribe((res) => {

        })

        this.http.post('http://localhost:5100/agent-notifications', { senderId: senderId, userId: userId, content: messageInput }).subscribe((res) => {

        })
      },
      (error) => {
        console.error('Failed to post comment:', error);
      }
    );
  }

}
