import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
declare var $: any;
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { SingupService } from './singup.service';
import { PasswordValidation } from './passwordValidation';
import { ToastrService } from 'ngx-toastr';
import { Data } from './../data';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnInit {

  CREATE = 'CREATE';
  UPDATE = 'UPDATE';
  MODE = '';
  accountHeader  = 'Sign Up';

  sex = ['Male', 'Female'];

  errorMessage: any = {
    required: 'Required',
    minlength: 'Min length is',
    maxLength: 'Max length is'
  }
  validation: any = {
    usernameMinLength: 5,
    usernameMaxLength: 20,
    passwordMinLength: 5,
    passwordMaxLength: 20,
    firstNameMinLength: 3,
    firstNameMaxLength: 20,
    lastNameMinLength: 3,
    lastNameMaxLength: 20,
    emailMinLength: 5,
    emailMaxLength: 40,
    phoneNumberMinLength: 8,
    phoneNumberMaxLength: 20,
    locationMinLength: 3,
    locationMaxLength: 20,
    dobMinLength: 3,
    dobMaxLength: 40,
    sexMinLength: 3,
    sexMaxLength: 20,
    aboutMinLength: 100,
    aboutMaxLength: 500,
    socailLinkMinLength: 10,
    socailLinkMaxLength: 100,
    photoLinkMinLength: 5,
    photoLinkMaxLength: 100,
    videoLinkMinLength: 5,
    videoLinkMaxLength: 100,
  }
  photographer: any = {};
  profilePicture: any;
  base64textString = [];
  signupForm: FormGroup;
  signupResponse: any;

  constructor(private formBuilder: FormBuilder, private signUpService: SingupService, private router: Router,
    private toastrService: ToastrService, private data: Data, private _sanitizer: DomSanitizer) {
    this.photographer = this.data.storage;
    console.log(this.photographer);
    if (this.photographer) {
      this.MODE = this.UPDATE;
    } else {
      this.MODE = this.CREATE;
    }
  }

  ngOnInit() {
    this.initSignupForm();
    if (this.MODE == this.UPDATE) {
      this.accountHeader = 'Update Account';
      this.updateSignupForm();
    }
  }

  initSignupForm() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.maxLength(this.validation.usernameMaxLength), Validators.minLength(this.validation.usernameMinLength)])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(this.validation.passwordMaxLength), Validators.minLength(this.validation.passwordMinLength)])],
      firstName: ['', Validators.compose([Validators.required, Validators.maxLength(this.validation.firstNameMaxLength), Validators.minLength(this.validation.firstNameMinLength)])],
      lastName: ['', Validators.compose([Validators.required, Validators.maxLength(this.validation.lastNameMaxLength), Validators.minLength(this.validation.lastNameMinLength)])],
      email: ['', Validators.compose([Validators.required, Validators.maxLength(this.validation.emailMaxLength), Validators.minLength(this.validation.emailMinLength)])],
      phoneNumber: ['', Validators.compose([Validators.maxLength(this.validation.phoneNumberMaxLength), Validators.minLength(this.validation.phoneNumberMinLength)])],
      location: ['', Validators.compose([Validators.maxLength(this.validation.locationMaxLength), Validators.minLength(this.validation.locationMinLength)])],
      dob: ['', Validators.compose([Validators.maxLength(this.validation.dobMaxLength), Validators.minLength(this.validation.dobMinLength)])],
      sex: [this.sex[0]],
      about: ['', Validators.compose([Validators.required, Validators.maxLength(this.validation.aboutMaxLength), Validators.minLength(this.validation.aboutMinLength)])],
      linkFacebook: ['', Validators.compose([Validators.maxLength(this.validation.socailLinkMaxLength), Validators.minLength(this.validation.socailLinkMinLength)])],
      linkInstagram: ['', Validators.compose([Validators.maxLength(this.validation.socailLinkMaxLength), Validators.minLength(this.validation.socailLinkMinLength)])],
      linkTwitter: ['', Validators.compose([Validators.maxLength(this.validation.socailLinkMaxLength), Validators.minLength(this.validation.socailLinkMinLength)])],
      linkLinkedIn: ['', Validators.compose([Validators.maxLength(this.validation.socailLinkMaxLength), Validators.minLength(this.validation.socailLinkMinLength)])],
      photoLink: ['', Validators.compose([Validators.maxLength(this.validation.photoLinkMaxLength), Validators.minLength(this.validation.photoLinkMinLength)])],
      videoLink: ['', Validators.compose([Validators.maxLength(this.validation.videoLinkMaxLength), Validators.minLength(this.validation.videoLinkMinLength)])],
    });
  }

  updateSignupForm() {
    this.profilePicture = this.photographer.profilePicture == null ? null : this._sanitizer.bypassSecurityTrustUrl ('data:image/jpg;base64,'+ this.photographer.profilePicture);
    this.signupForm.setValue({
      username: this.photographer.userName, 
      password: this.photographer.password,
      firstName: this.photographer.firstName,
      lastName: this.photographer.lastName, 
      email: this.photographer.email, 
      phoneNumber: this.photographer.phoneNumber,
      location: this.photographer.location, 
      dob: this.photographer.dob,
      sex: this.photographer.sex ? (this.photographer.sex == 'M' ? 'M' : 'F') : null,
      about: this.photographer.about,
      linkFacebook: this.photographer.linkFacebook,
      linkInstagram: this.photographer.linkInstagram,
      linkTwitter: this.photographer.linkTwitter,
      linkLinkedIn: this.photographer.linkLinkedin,
      photoLink: this.photographer.photoLink,
      videoLink: this.photographer.videoLink
    });
  }
  // confirmPassword: ['', Validators.compose([Validators.required, Validators.maxLength(this.validation.passwordMaxLength), Validators.minLength(this.validation.passwordMinLength), PasswordValidation.MatchPassword])],

  importFile(event) {
    if (event.target.files.length == 0) {
      console.log("No file selected!");
      return
    }
    let file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
      // after here 'file' can be accessed and used for further process
    }
  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.profilePicture = this.base64textString;
  }

  createPhotographer(signupForm) {
    if (this.MODE == this.CREATE) {
      if (signupForm.status === 'VALID') {
        var form = this.signupForm;
        var picture = null;
        if (this.profilePicture) {
          picture = this.profilePicture[0].split(',');
          picture = picture[1];
        }
        var reqObj = {
          userName: form.get('username').value,
          profilePicture: picture,
          password: form.get('password').value,
          firstName: form.get('firstName').value,
          lastName: form.get('lastName').value,
          email: form.get('email').value,
          phoneNumber: form.get('phoneNumber').value ? form.get('phoneNumber').value : null,
          location: form.get('location').value ? form.get('location').value : null,
          dob: form.get('dob').value ? form.get('dob').value : null,
          sex: form.get('sex').value ? (form.get('sex').value == 'Male' ? 'M' : 'F') : null,
          about: form.get('about').value,
          linkFacebook: form.get('linkFacebook').value ? form.get('linkFacebook').value : null,
          linkLinkedin: form.get('linkLinkedIn').value ? form.get('linkLinkedIn').value : null,
          linkTwitter: form.get('linkTwitter').value ? form.get('linkTwitter').value : null,
          linkInstagram: form.get('linkInstagram').value ? form.get('linkInstagram').value : null,
          photoLink: form.get('photoLink').value ? form.get('photoLink').value : null,
          videoLink: form.get('videoLink').value ? form.get('videoLink').value : null
        };
        console.log(reqObj);

        this.signUpService.createAccount(reqObj)
          .subscribe(data => {
            this.signupResponse = data;
            if (this.signupResponse && this.signupResponse.photographersId != 0) {
              this.profilePicture = null;
              this.initSignupForm();
              this.toastrService.success('Account successfully created', 'Thank you for your registration! Your account is now ready to use.', {
                disableTimeOut: true
              });
            }
          }, err => {
            this.toastrService.error(err.error.message, err.error.details.toString(), {
              disableTimeOut: true
            });
            console.log(err);
          });
      }
    } else {
      this.updatePhotographer(signupForm);
    }
  }

  updatePhotographer(signupForm) {
    if (signupForm.status === 'VALID') {
      var form = this.signupForm;
      var picture = null;
      if (Array.isArray(this.profilePicture)) {
        picture = this.profilePicture[0].split(',');
        picture = picture[1];
      } else{
        picture = this.profilePicture.changingThisBreaksApplicationSecurity.split(',');
        picture = picture[1];
      }
      var reqObj = {
        photographersId: this.photographer.photographersId,
        userName: form.get('username').value,
        profilePicture: picture,
        password: form.get('password').value,
        firstName: form.get('firstName').value,
        lastName: form.get('lastName').value,
        email: form.get('email').value,
        phoneNumber: form.get('phoneNumber').value ? form.get('phoneNumber').value : null,
        location: form.get('location').value ? form.get('location').value : null,
        dob: form.get('dob').value ? form.get('dob').value : null,
        sex: form.get('sex').value ? (form.get('sex').value == 'Male' ? 'M' : 'F') : null,
        about: form.get('about').value,
        linkFacebook: form.get('linkFacebook').value ? form.get('linkFacebook').value : null,
        linkLinkedin: form.get('linkLinkedIn').value ? form.get('linkLinkedIn').value : null,
        linkTwitter: form.get('linkTwitter').value ? form.get('linkTwitter').value : null,
        linkInstagram: form.get('linkInstagram').value ? form.get('linkInstagram').value : null,
        photoLink: form.get('photoLink').value ? form.get('photoLink').value : null,
        videoLink: form.get('videoLink').value ? form.get('videoLink').value : null,
        entDt : this.photographer.entDt,
        modDt : this.photographer.modDt,
        isActive : 'Y',
        isApproved : 'Y'
      };
      console.log(reqObj);

      this.signUpService.updateAccont(reqObj)
        .subscribe(data => {
          this.signupResponse = data;
          if (this.signupResponse && this.signupResponse.photographersId != 0) {
            this.toastrService.success('Account successfully updated', 'Hurray', {
              disableTimeOut: true
            });
          }
        }, err => {
          this.toastrService.error(err.error.message, err.error.details.toString(), {
            disableTimeOut: true
          });
          console.log(err);
        });
    }
  }

  navigateToHome() {
    this.router.navigateByUrl('/home');
  }

  revert() {
    this.signupForm.reset();
  }
}
