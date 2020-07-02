import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { auth } from "firebase/app";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  form: FormGroup;

  type: "login" | "reset" = "login";
  loading = false;

  serverMessage: string;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private router: Router
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userData = user;
        localStorage.setItem("user", JSON.stringify(userData));
        JSON.parse(localStorage.getItem("user"));
      }
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.minLength(6), Validators.required]],
      passwordConfirm: ["", []],
    });
  }

  changeType(val) {
    this.type = val;
  }

  get isLogin() {
    return this.type === "login";
  }

  get isPasswordReset() {
    return this.type === "reset";
  }

  get email() {
    return this.form.get("email");
  }
  get password() {
    return this.form.get("password");
  }

  get passwordConfirm() {
    return this.form.get("passwordConfirm");
  }

  async onSubmit() {
    this.loading = true;

    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        this.afAuth
          .setPersistence(auth.Auth.Persistence.LOCAL)
          .then(() => {
            this.afAuth.signInWithEmailAndPassword(email, password);
            console.log("logged in!");
            this.router.navigate([`admin`]);
          })
          .catch((error) => {
            this.serverMessage = error.message;
          });
      }
      if (this.isPasswordReset) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.serverMessage = "Check your email";
      }
    } catch (err) {
      this.serverMessage = err;
    }

    this.loading = false;
  }
}
