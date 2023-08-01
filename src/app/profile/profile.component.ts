import { Component,OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { UserserviceService } from '../_services/userservice.service';
import { ImageProcessingServiceService } from '../_services/image-processing-service.service';
import { User } from '../_model-dto/user/user';
import {map} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http'
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  
  constructor(
    private authService: AuthService, 
    private user_service: UserserviceService,
    private imageProcessingService: ImageProcessingServiceService,
  ){}

  

  user: User = new User();

  ngOnInit(): void {
    this.getUserDetail();
  }

  public getUserDetail(){
    this.user_service.getUserByUsername(this.authService.getUsername()!)
    .pipe(
      map((user: User) => 
        this.imageProcessingService.createUserImage(user)
      )
    )
    .subscribe({
      next: (next: User) =>{
        console.log(next)
        this.user = next;
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }

  
}
