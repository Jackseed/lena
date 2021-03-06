import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GridComponent } from "./grid/grid.component";
import { ProjectFormComponent } from "./admin/project-form/project-form.component";
import { ProjectListComponent } from "./admin/project-list/project-list.component";
import { ProjectViewComponent } from "./project-view/project-view.component";
import { CategoryListComponent } from "./admin/category-list/category-list.component";
import { VignetteListComponent } from "./admin/vignette-list/vignette-list.component";
import { AuthComponent } from "./admin/auth/auth.component";
import { AuthGuard } from "./admin/auth/auth.guard";
import { ContactPageComponent } from "./contact-page/contact-page.component";

const routes: Routes = [
  { path: "home", component: GridComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "admin/login", component: AuthComponent },
  { path: "admin", component: ProjectListComponent, canActivate: [AuthGuard] },
  {
    path: "admin/categories",
    component: CategoryListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/vignettes",
    component: VignetteListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/:id/edit",
    component: ProjectFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/:id/view",
    component: ProjectViewComponent,
    canActivate: [AuthGuard]
  },
  { path: "contact", component: ContactPageComponent },
  {
    path: ":id/view",
    component: ProjectViewComponent
  },
  { path: ":title", component: ProjectViewComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled"
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
