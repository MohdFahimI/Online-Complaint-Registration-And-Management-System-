import { Component } from '@angular/core';
// import { faBars, faTachometerAlt, faShoppingBag, faShoppingCart, faTags, faMoneyBill,faComment,faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public isSidebarHidden = false;
  // public barIcon = faBars

  data = [
    {
      path: '/admin/dashboard',
      icon: 'fas fa-chart-bar',
      name: 'Dashboard'
    },
    {
      path: '/admin/customers',
      icon: 'fas fa-users',
      name: 'Customers'
    },
    {
      path: '/admin/complaints',
      icon: 'fas fa-exclamation-triangle',
      name: 'Complaints'
    },
    {
      path: '/admin/agents',
      icon: 'fas fa-user-friends',
      name: 'Agents'
    },
    // {
    //   path: '/admin/add-agent',
    //   icon: 'fas fa-user-plus',
    //   name: 'Add Agent'
    // }
  ];
  

  constructor() {
  }

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}

