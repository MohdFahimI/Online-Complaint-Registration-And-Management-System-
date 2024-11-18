import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  complaints: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const id = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:5100/complaints/${id}`).subscribe(
      (res) => {
        this.complaints = res;
        console.log(this.complaints);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
