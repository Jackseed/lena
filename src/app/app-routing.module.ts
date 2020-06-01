import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GridComponent } from "./grid/grid.component";
import { ProjectComponent } from "./project/project.component";
import { ProjectFormComponent } from "./admin/project-form/project-form.component";

const routes: Routes = [
  { path: "home", component: GridComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "admin", component: ProjectFormComponent },
  { path: ":title", component: ProjectComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
