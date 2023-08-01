import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-register-verify',
  templateUrl: './register-verify.component.html',
  styleUrls: ['./register-verify.component.css']
})
export class RegisterVerifyComponent implements OnInit{

  token: string;
  verified: boolean = false;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      
      if(this.token != '' || this.token == null){
        this.verifyToken(this.token);
      }else{
        alert("NO TOKEN")
      }
    });
  }

  verifyToken(token: string){
    this.authService.verifyUser(token)
    .subscribe({
      next: (next: string) => {
        console.log(next)
        this.verified = true;
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message);
      }
    })
  }


}
