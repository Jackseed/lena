import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
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
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AngularFireModule } from "@angular/fire";

const firebaseConfig = {
  apiKey: "AIzaSyDi0VGkbRt-rPpaWFcEHzkDC9yQK4cMWyQ",
  authDomain: "lena-website-26d6e.firebaseapp.com",
  databaseURL: "https://lena-website-26d6e.firebaseio.com",
  projectId: "lena-website-26d6e",
  storageBucket: "lena-website-26d6e.appspot.com",
  messagingSenderId: "629985807671",
  appId: "1:629985807671:web:a3ae2cb224629232b11eb2"
};

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ProjectComponent,
    GridComponent,
    LayoutComponent,
    ToolbarComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
