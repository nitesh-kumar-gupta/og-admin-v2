import { Component, OnInit } from '@angular/core';
import { ScriptService } from './services/script.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public _script: ScriptService){}
  title = 'app';
  ngOnInit(){
    this._script.load('bootBox').then(data => { 
    });
  }

}
