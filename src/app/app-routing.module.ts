import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GridComponent } from "./grid/grid.component";
import { ProjectComponent } from "./project/project.component";
import { ProjectFormComponent } from "./admin/project-form/project-form.component";
import { ProjectListComponent } from "./project-list/project-list.component";
import { ProjectViewComponent } from "./project-view/project-view.component";
import { CategoryListComponent } from "./admin/category-list/category-list.component";
import { VignetteListComponent } from "./admin/vignette-list/vignette-list.component";

const routes: Routes = [
  { path: "home", component: GridComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "admin", component: ProjectListComponent },
  { path: "admin/categories", component: CategoryListComponent },
  { path: "admin/vignettes", component: VignetteListComponent },
  { path: "admin/:id/edit", component: ProjectFormComponent },
  { path: "admin/:id/view", component: ProjectViewComponent },
  { path: ":title", component: ProjectComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
