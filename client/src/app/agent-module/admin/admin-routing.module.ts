import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componets/home/home.component';
import { DashboardComponent } from './componets/dashboard/dashboard.component';
import { ChatComponent } from './componets/chat/chat.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'agent-dashboard', component: DashboardComponent },
      { path: 'chat/:id', component: ChatComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
