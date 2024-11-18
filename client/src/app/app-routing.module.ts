import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { RaiseTicketComponent } from './components/raise-ticket/raise-ticket.component';
import { MyComplaintsComponent } from './components/my-complaints/my-complaints.component';
import { ChatComponent } from './components/chat/chat.component';
import { AgentComponent } from './components/agent/agent.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'complaint',component:RaiseTicketComponent},
  {path:'home',component:HomeComponent},
  {path:'my-complaints',component:MyComplaintsComponent},
  {path:'chat/:id',component:ChatComponent},
  {path:'agents',component:AgentComponent},
  {
    path:'admin',loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path:'agent',loadChildren: () => import('./agent-module/admin/admin.module').then((m) => m.AdminModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
