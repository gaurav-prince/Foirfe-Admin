import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public db: AngularFireDatabase) {
    // this.items = db.list('items').valueChanges();
  }

  text: string = '';
  htmlText: string = '';
  title: string = '';
  saveDisabled: boolean = true;
  publishDisabled: boolean = true;
  deleteDisabled: boolean = true;
  postId: string = null;
  snackbarVisible: boolean = false;
  snackbarText: string = '';
  thumbnail: any = null;
  category: string = '';

  ngOnInit(): void {
  }

  openSnackBar(message: string) {
    this.snackbarText = message;
    this.snackbarVisible = true;
    setTimeout(function () {
      this.snackbarVisible = false;
      this.snackbarText = '';
    }, 3000);
    this.snackbarVisible = false;
  }

  upload(files: File[]): void {
    console.log(files);
  }

  onSave(): void {
    let tempData = {
      title: this.title,
      htmltext: this.htmlText,
      publishedState: false,
      category:this.category,
      timestamp: new Date().toLocaleString()
    };
    if (this.postId) {
      this.db.list('postContents').update(this.postId, tempData);
    }
    else {
      let postRef: any = this.db.list('postContents').push(tempData);
      this.postId = postRef.path.pieces_[1];
    }
    this.saveDisabled = true;
    // this.openSnackBar("Post Saved Successfully")
  }

  onPublish(): void {
    let tempData = {
      title: this.title,
      htmltext: this.htmlText,
      publishedState: true,
      category:this.category,
      timestamp: new Date().toLocaleString()
    };
    if (this.postId) {
      this.db.list('postContents').update(this.postId, tempData);
    }
    else {
      this.db.list('postContents').push(tempData);
    }
    this.publishDisabled = true;
    // this.openSnackBar("Post Published Successfully")
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
