import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  activeRoute: string = '';
  avatar: any = ''
  userId: any = ''
  userToken: any = ''
  agentToken: any = ''
  adminToken: any = ''
  notification: any[] = []

  constructor(private router: Router, private http: HttpClient) {
    const jwtToken = localStorage.getItem('adminJwtToken')
    if (jwtToken) {
      this.adminToken = jwtToken
    }
    const token = localStorage.getItem("jwtToken")
    if (token) {
      this.userToken = token
    }
    const agentToken = localStorage.getItem("agentToken")
    if (agentToken) {
      this.agentToken = agentToken
    }

    const avatar = localStorage.getItem('userAvatar')
    this.avatar = avatar
    const userId = localStorage.getItem("userId");
    this.http.get<any>(`http://localhost:5100/notifications/${userId}`).subscribe((res: any) => {
      this.notification = res.filter((notification: any) => notification.userId === userId);
      if(res){
        this.userId = res[0].senderId;
      }else{
        this.userId = null
      }
    });
  }

  onDeleteNotifications() {
    const userId = localStorage.getItem("userId");
    this.http.delete(`http://localhost:5100/notifications/${userId}`).subscribe((res) => {
      this.http.get<any>(`http://localhost:5100/notifications/${userId}`).subscribe((res: any) => {
      this.notification = res.filter((notification: any) => notification.userId === userId);
      this.userId = res[0].senderId;
    });
    })
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
