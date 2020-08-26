import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentsComponent implements OnInit {
  resourcesPosts: any;
  latestPost: any;
  showBusy: boolean = true;
  constructor(public db: AngularFireDatabase, private _snackBar: MatSnackBar) { }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  ngOnInit(): void {
    this.getResourcesPosts();
  }

  getResourcesPosts(): void {
    this.db.list('postContents').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() as {} })
        )
      )
    ).subscribe(resources => {
      this.showBusy = false;
      resources.sort(function (a: any, b: any) {
        if (a.timestamp < b.timestamp)
          return 1;
        else if (a.timestamp > b.timestamp)
          return -1;
        else
          return 0;
      });
      this.resourcesPosts = resources;
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message,'OK', {
      duration: 60000,
      panelClass: 'snackbar',
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  deletePost(key): void {
    // this

    // var updates = {};
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    let post = this.db.object('postContents/' + key);
    post.remove();
    this.openSnackBar("Post Deleted Successfully")
  }

  // editPost(key): void {
  //   // this

  //   // var updates = {};
  //   // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  //   let post = this.db.object('postContents/' + key);
  //   this.openSnackBar("Post Deleted Successfully")
  // }
}
