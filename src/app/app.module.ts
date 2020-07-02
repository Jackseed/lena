import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MenuComponent } from "./menu/menu.component";
import { ProjectComponent } from "./project/project.component";
import { GridComponent } from "./grid/grid.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatGridListModule } from "@angular/material/grid-list";
import { LayoutComponent } from "./layout/layout.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { AngularFireModule } from "@angular/fire";
import { ProjectFormComponent } from "./admin/project-form/project-form.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DropzoneDirective } from "./admin/dropzone.directive";
import { UploaderComponent } from "./admin/uploader/uploader.component";
import { UploadTaskComponent } from "./admin/upload-task/upload-task.component";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
registerLocaleData(localeFr);
import { ProjectListComponent } from "./project-list/project-list.component";
import { ProjectViewComponent } from "./project-view/project-view.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CategoryListComponent } from "./admin/category-list/category-list.component";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { VignetteListComponent } from "./admin/vignette-list/vignette-list.component";
import { FooterComponent } from "./footer/footer.component";
import { DragableGridComponent } from "./admin/dragable-grid/dragable-grid.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { VignetteFormComponent } from "./admin/vignette-form/vignette-form.component";
import { AuthComponent } from "./admin/auth/auth.component";
import { MatCardModule } from "@angular/material/card";

const firebaseConfig = {
  apiKey: "AIzaSyDi0VGkbRt-rPpaWFcEHzkDC9yQK4cMWyQ",
  authDomain: "lena-website-26d6e.firebaseapp.com",
  databaseURL: "https://lena-website-26d6e.firebaseio.com",
  projectId: "lena-website-26d6e",
  storageBucket: "lena-website-26d6e.appspot.com",
  messagingSenderId: "629985807671",
  appId: "1:629985807671:web:a3ae2cb224629232b11eb2",
};

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ProjectComponent,
    GridComponent,
    LayoutComponent,
    ToolbarComponent,
    ProjectFormComponent,
    DropzoneDirective,
    UploaderComponent,
    UploadTaskComponent,
    ProjectListComponent,
    ProjectViewComponent,
    CategoryListComponent,
    VignetteListComponent,
    FooterComponent,
    DragableGridComponent,
    VignetteFormComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    NoopAnimationsModule,
    FlexLayoutModule,
    MatGridListModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCardModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: "fr-FR" }],
  bootstrap: [AppComponent],
})
export class AppModule {}
