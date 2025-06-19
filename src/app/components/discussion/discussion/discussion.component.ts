import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from '../../../models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';
import { Discussion } from '../../../models/discussion';
import { Collection } from '../../../models/collection';
import { DiscussionService } from '../../../service/discussionService';
import { MessageService } from '../../../service/messageService';
import { MessageComponent } from '../message/message.component';
import { CollectionService } from '../../../service/collectionService';



@Component({
  selector: 'app-discussion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MessageComponent],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css'

  })

export class DiscussionComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _dataService = inject(DataService);
  private _messageService = inject(MessageService);
  private _discussionService = inject(DiscussionService);
  private _collectionService = inject(CollectionService);
  fb = inject(FormBuilder);
  form:FormGroup = this.fb.group({
    content: ["" , Validators.required ]
  })

  currentUser!:User;

  @Input("collection") collectionId!:number;
  @Input("discussion") discussion!: Discussion;
  list: Message [] = [];
  collection!:Collection;


  ngOnInit(): void {
    const collectionId = this._route.snapshot.paramMap.get("id");
    if(collectionId){
      this.collectionId = Number(collectionId);
      this.findCollectionById();
    } else {
      console.log("id della discussione: " + this.discussion.discussionId);
      this.loadMessages(this.discussion.discussionId!);
    }

    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
  }

  loadDiscussion(){
    this._discussionService.getDiscussionByCollectionAndUserId(this.collection.collectionId).subscribe({
      next: d => {
        console.log(d);
        this.discussion = d[0];
        console.log(this.discussion)
        this.loadMessages(this.discussion.discussionId!);
      } ,
      error: e => alert("Errore nel caricamento della discussione!")
    });
  }

  loadMessages(discussionId: number){
    if(this.discussion) {
      console.log("caricando i messaggi per la discussione con id: " + discussionId);

      this._messageService.getMessagesByDiscussionId(discussionId).subscribe({
        next: m => {
          this.list = m
          console.log(this.list);
                },
        error: e => alert("Errore nel caricamento dei messaggi!")
      });
    }
  }

  findCollectionById(){
    this._collectionService.getCollectionById(this.collectionId).subscribe({
       next: c => {
        this.collection = c
        this.loadDiscussion();
       } ,
        error: e => alert("Errore nel caricamento della collezione!")
    });
  }

  onSubmit(){
    if(this.form.valid) {
      if(!this.discussion){
        this.discussion = {
          buyerId: this.currentUser.userId,
          sellerId: this.collection.userId,
          collectionId: this.collection.collectionId,
          messages: []
        };
        console.log(this.discussion)
        if(this.collection){
          const newMessage:Message =  {
            content: this.form.get("content")?.value,
            senderId: this.currentUser.userId,
            receiverId: this.collection.userId,
          };
          this.discussion.messages.push(newMessage);
          this.list.push(newMessage);

        };

        console.log("formValue", this.form.value)
        this._discussionService.addDiscussion(this.discussion).subscribe({
          next: d => {
            this.discussion = d;
            alert("Discussion creata con id: " + d.discussionId);
          },
          error:err => alert("Errore nella creazione della discussione!" + err)
        });

      }
        else{
          const newMessage:Message = {
            discussionId:this.discussion.discussionId,
            content: this.form.get("content")?.value,
            senderId: this.currentUser.userId,
            receiverId: (this.currentUser.userId == this.discussion.buyerId ? this.discussion.sellerId:this.discussion.buyerId)
          };
          console.log(this.currentUser.userId, this.collectionId)
          console.log(this.discussion)
          console.log(newMessage)
          this.discussion.messages.push(newMessage);
          this.list.push(newMessage);
          this._messageService.addMessage(newMessage).subscribe({
           next: m => {
            alert("messaggio inviato con id: " + m.messageId);
          },
          error:err => alert("Errore nella creazione del messaggio!" + err)
          });
          }
        }
      }

  }


