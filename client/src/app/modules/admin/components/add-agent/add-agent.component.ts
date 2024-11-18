import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent {

  complaintForm: FormGroup;

  constructor(private http:HttpClient, private route:Router) {
    this.complaintForm  = new FormGroup({
      name:new FormControl(null,Validators.required)
    })
   }

   onSubmit(details: { name: string }): void {
    const complaint = {
      name:details.name
    }
    this.http.post('http://localhost:5100/agents', complaint).subscribe((response) => {
        window.alert('Agent Added Successfully!');
        this.complaintForm.reset()
    }, error => {
        window.alert('Agent Failed!');
        console.log(error);
    });
}

}

