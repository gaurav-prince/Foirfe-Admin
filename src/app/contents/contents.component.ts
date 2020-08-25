import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit {
  resourcesPosts: any;
  latestPost: any;
  showBusy: boolean = true;
  constructor(public db: AngularFireDatabase) { }

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
      // this.latestPost = resources.pop();
      this.resourcesPosts = resources;
    });
  }

  deletePost(key): void {
    // this

    // var updates = {};
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    let post = this.db.object('postContents/' + key);
    post.remove();
  }
}
