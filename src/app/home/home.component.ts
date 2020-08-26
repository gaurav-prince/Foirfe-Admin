import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { QuillModule } from 'ngx-quill'
import { map } from 'rxjs/operators';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  constructor(public db: AngularFireDatabase,private _snackBar: MatSnackBar, private route: ActivatedRoute) {
    // this.items = db.list('items').valueChanges();
  }
  editor = new QuillModule();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
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
  id: string = '';
  sub: any = '';
  resourcePost: any;
  receivedResourcePost: any;

  ngOnInit(): void {
    this.sub = this.route.queryParams
    .subscribe(params => {
      this.id = params['id'] || 0;
    })
    if (this.id) {
      this.getResourcePost(this.id);
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message,'OK', {
      duration: 3000,
      panelClass: 'snackbar',
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  upload(files: File[]): void {
    console.log(files);
  }

  onSave(): void {
    let tempData = {
      title: this.title,
      text:this.text,
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
    this.openSnackBar("Post Saved Successfully")
  }

  onPublish(): void {
    let tempData = {
      title: this.title,
      text:this.text,
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
    this.openSnackBar("Post Published Successfully")
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

  getResourcePost(params): void {
    this.db.list('postContents').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() as {} })
        )
      )
    ).subscribe(res => {
      this.resourcePost = res.find((item) => {
        return item.key === params;
      });
      this.title = this.resourcePost.title;
      this.category = this.resourcePost.category;
      this.text = this.resourcePost.text;
      this.htmlText = this.resourcePost.htmltext;
      this.postId = this.resourcePost.key;
    });
  }
}
