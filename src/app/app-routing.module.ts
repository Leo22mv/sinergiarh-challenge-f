import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';

const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "", redirectTo: "/home", pathMatch: "full"},
  {path: "**", redirectTo: "/home", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
