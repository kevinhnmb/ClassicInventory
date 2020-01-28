import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, catchError } from 'rxjs/operators';
import { formatDate } from '@angular/common'
//////
import { DecimalPipe } from '@angular/common';


/* */
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
export interface SortEvent {
  column: string;
  direction: SortDirection;
}
/* */

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  items: Observable<any[]>;
  firstElement = null;
  lastElement = null;
  myDate = new Date();
  pageSize = 2;
  firstPage = true;

  constructor(private db: AngularFirestore, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.getNextItems(this.pageSize, this.lastElement);
  }

  getPreviousItems(limitVal, previousValue) {
    console.log("Previous items!");
    console.log(previousValue);
    if (previousValue) {
      var itemsRef = this.db.collection(`item_log`, 
        ref=> { 
          return ref.limit(limitVal).orderBy("time_stamp", "desc").endBefore(previousValue); 
        });

    itemsRef.ref.limit(limitVal).orderBy("time_stamp", "desc").startAfter(previousValue).get().then(documentSnapshots => { this.firstElement = documentSnapshots.docs[0];
                                                                                                                             this.lastElement = documentSnapshots.docs[documentSnapshots.docs.length-1];});    

    this.items = itemsRef.snapshotChanges().pipe(
        map(actions => actions.map(a => {
  
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        
        return { id, ...data };
        }))
      );
    }

  }

  getNextItems(limitVal, previousValue) {
    console.log("Next items!");
    if (previousValue) {
      this.firstPage = false;

      var itemsRef = this.db.collection(`item_log`, 
        ref=> { 
          return ref.limit(limitVal).orderBy("time_stamp", "desc").startAfter(previousValue); 
        });

      itemsRef.ref.limit(limitVal).orderBy("time_stamp", "desc").startAfter(previousValue).get().then(documentSnapshots => { this.firstElement = documentSnapshots.docs[0];
                                                                                                                             this.lastElement = documentSnapshots.docs[documentSnapshots.docs.length-1];});

      this.items = itemsRef.snapshotChanges().pipe(
        map(actions => actions.map(a => {
  
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        
        return { id, ...data };
        }))
      );

    } else {

      var itemsRef = this.db.collection(`item_log`, 
        ref=> { 
                return ref.limit(limitVal).orderBy("time_stamp", "desc");
        });

      itemsRef.ref.limit(limitVal).orderBy("time_stamp", "desc").get().then(documentSnapshots => { this.lastElement = documentSnapshots.docs[documentSnapshots.docs.length-1];});
      this.firstElement = null;


      this.items = itemsRef.snapshotChanges().pipe(
        map(actions => actions.map(a => {
  
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        
        return { id, ...data };
        }))
      );

    }
  }

  lastElementCall() {
    if (this.items) {
      console.log(this.lastElement);
    }
  }

  onSort({column, direction}: SortEvent) {
    console.log(column);
    console.log(direction);
  }

  refreshTableSize() {
    this.firstPage = true;
    this.lastElement = null;
    this.getNextItems(this.pageSize, this.lastElement);
  }
}
