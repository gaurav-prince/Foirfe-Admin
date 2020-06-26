import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  text:string='hello';

  ngOnInit(): void {
  }

  onTextChange(event):void{
    console.log(event);
      this.text=event.text;
  }
}
