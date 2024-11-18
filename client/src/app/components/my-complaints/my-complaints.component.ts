import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-complaints',
  templateUrl: './my-complaints.component.html',
  styleUrls: ['./my-complaints.component.css']
})
export class MyComplaintsComponent {
  complaints: any[] = []

  constructor(private http:HttpClient, private route:Router){
    const userId = localStorage.getItem('userId')
    this.http.get<any[]>(`http://localhost:5100/user-complaints/${userId}`).subscribe((res) => {
      this.complaints = res
      console.log(res)
    })

    const jwtToken = localStorage.getItem('adminJwtToken')
    if (jwtToken){
      this.route.navigate(['/admin/dashboard'])
    }
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      this.route.navigate(['/login'])
    }
  }
}
