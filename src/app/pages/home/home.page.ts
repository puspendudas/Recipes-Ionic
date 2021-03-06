import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoadingService } from 'src/app/services/loading.service';
import { finalize } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Recipes } from "src/app/interface/recipe";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  recipes

  constructor(
    private authenticationService: AuthenticationService,
    public apiservices : ApiServices,
    public http: HttpClient,
    public storage: Storage,
    public loading: LoadingService,
    private router:Router,
  ) { }

  ngOnInit() {
    this.fetchdata()
  }

  refresh(ev) {
    setTimeout(() => {
      this.fetchdata()
    }, 3000);
  }

  async fetchdata(){
    await this.loading.presentLoading();

    let access_token = await this.storage.get('access_token');

      let httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${access_token}`})
      };

      this.http.get(`${this.apiservices.api_url}recipe/`,httpOptions).pipe(finalize(() => this.loading.dismissLoading()))
      .subscribe(async (res) => {
        const response:any =res;
        this.recipes = response as Recipes;
      },(reserror)=>{
        console.log(reserror.error.detail);
      })
  }

  viewRecipe(id, name){
    let navigationExtras: NavigationExtras = {
      state: {
        rcp_id: id,
        rcp_name: name
      }
    }
    this.router.navigate(['recipe'], navigationExtras);
  }

  logout(){
    this.authenticationService.logout();
  }

}
