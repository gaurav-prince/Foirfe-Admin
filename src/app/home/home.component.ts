import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public db: AngularFireDatabase, private snackBar: MatSnackBar) {
    // this.items = db.list('items').valueChanges();
  }

  text: string = '';
  htmlText: string = '';
  title: string = '';
  saveDisabled: boolean = true;
  publishDisabled: boolean = true;
  deleteDisabled: boolean = true;
  postId: string = null;

  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onSave(): void {
    let tempData = {
      title: this.title,
      htmltext: this.htmlText,
      publishedState: false
    };
    if (this.postId) {
      this.db.list('postContents').update(this.postId, tempData);
    }
    else {
      let postRef: any = this.db.list('postContents').push(tempData);
      this.postId = postRef.path.pieces_[1];
    }
    this.saveDisabled = true;
    this.openSnackBar("Post Saved Successfully",null)
  }

  onPublish(): void {
    let tempData = {
      title: this.title,
      htmltext: this.htmlText,
      publishedState: true
    };
    if (this.postId) {
      this.db.list('postContents').update(this.postId, tempData);
    }
    else {
      this.db.list('postContents').push(tempData);
    }
    this.publishDisabled = true;
    this.openSnackBar("Post Published Successfully",null)
  }

  onDelete(): void {
    this.title = '';
  }

  onTextChange(event): void {
    this.saveDisabled = false;
    this.publishDisabled = false;
    this.deleteDisabled = false;
    this.text = event.text;
    this.htmlText = event.html;
  }
}
