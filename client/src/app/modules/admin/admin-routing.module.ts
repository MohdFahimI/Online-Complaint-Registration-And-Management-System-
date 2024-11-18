import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AgentsComponent } from './components/agents/agents.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { HomeComponent } from './components/home/home.component';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { CustomersComponent } from './components/customers/customers.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'agents', component: AgentsComponent },
      { path: 'complaints', component: ComplaintsComponent },
      { path: 'add-agent', component: AddAgentComponent },
      { path: 'customers', component: CustomersComponent },
      {path:'chat/:id',component:ChatComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
