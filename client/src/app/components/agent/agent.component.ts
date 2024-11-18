import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent {
  avatar: any = ''
  userId: any = ''
  notifications: any[] = []

  constructor(private router: Router, private http: HttpClient) {
    const avatar = localStorage.getItem('userAvatar')
    this.avatar = avatar
    const userId = localStorage.getItem("userId");


    // this.http.get<any>(`http://localhost:5100/notifications/${userId}`).subscribe((res: any) => {
    //   this.notification = res.filter((notification: any) => notification.userId === userId);
    //   if(res){
    //     this.userId = res[0].senderId;
    //     console.log(res)
    //   }else{
    //     this.userId = null
    //   }
    // });

    this.http.get<any[]>(`http://localhost:5100/agent-notifications/${userId}`).subscribe((res:any) => {
      this.notifications = res.filter((notification: any) => notification.userId === userId);
      
        if(res){
          this.userId = res[0].senderId;
        }else{
          this.userId = null
        }
        console.log(this.notifications)
    })
    
  }

}
