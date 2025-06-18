import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserCommentService } from '../../../service/userCommentService';
import { UserComment } from '../../../models/userComment';
import { CollectionService } from '../../../service/collectionService';
import { Collection } from '../../../models/collection';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  comments: UserComment[] = [];
  collectionId!: number;
  isLoading = true;
  errorMessage: string | null = null;
  collection!: Collection; 

  constructor(
    private route: ActivatedRoute,
    private _commentService: UserCommentService,
    private _collectionService: CollectionService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.collectionId = Number(idParam);
      this.findCollection(this.collectionId);
      this.fetchComments();
    } else {
      this.errorMessage = 'Collection ID mancante nei parametri della route.';
      this.isLoading = false;
    }
  }
  findCollection(id: number) {
    this._collectionService.getCollectionById(id).subscribe({
      next: c => this.collection = c,
      error: e => alert("errore nel caricamento della collection: " + e)
    });
  }

  fetchComments(): void {
    this._commentService.getCommentsByCollectionId(this.collectionId).subscribe({
      next: (allComments) => {
        this.comments = allComments;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Errore nel recupero dei commenti: ' + err;
        this.isLoading = false;
      }
    });
  }
}