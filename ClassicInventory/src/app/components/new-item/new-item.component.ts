import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { formatDate } from '@angular/common'

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {

  item_codes: Observable<any[]>;
  codes = [];
  myForm: FormGroup;
  item_names: Observable<any[]>;

  constructor(private db: AngularFirestore, private fb: FormBuilder, private router: Router, private auth: AuthService) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      itemCode: '',
      //itemName: '',
      itemQuantity: ''
    });

    
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      //(searchText) => this.getItemCodes(searchText)
      switchMap( (searchText) => searchText.length < 3 ? [] : this.getItemCodes(searchText))
    )


  submit(frm) {
    console.log(frm.value);

    if (frm.value.itemCode && frm.value.itemQuantity) {
      var result = 0;

      if (frm.value.itemCode.item_quantity) {
        result += frm.value.itemCode.item_quantity + frm.value.itemQuantity
      } else {
        result += frm.value.itemQuantity; 
      }

      

      this.db.collection(`inventory_codes`).doc(frm.value.itemCode.id).set({item_quantity: result}, {merge: true});
      this.db.collection(`item_log`).add({
                                            item_code: frm.value.itemCode.item_code, 
                                            item_quantity: frm.value.itemQuantity, 
                                            uid: this.auth.getAuth().auth.currentUser.uid, 
                                            display_name: this.auth.getAuth().auth.currentUser.displayName,
                                            time_stamp: formatDate(new Date(),'MMMM d, y, h:mm:ss a z','en')
                                          });

      this.router.navigateByUrl('');
    }
  }

  getItemCodes(startText) {

    console.log(startText);

    if (startText) {
      this.item_codes = this.db.collection(`inventory_codes`, ref=>{
        return ref.where('item_code','>=', startText).where('item_code', '<=', startText+'\uf8ff')
      }
      ).snapshotChanges().pipe(
        map(actions => 
          
          actions.map(a => {  
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
      );
    }

    return this.item_codes;
  }

  resultFormatterCodes(value: any) {
    
    return value.item_code;
  }
  
  inputFormatterCodes(value: any) {
    if (value.item_code) {
      document.getElementById("itemNameInput").setAttribute("placeholder", value.item_name);
      return value.item_code;
    } else {
      return value;
    }
  }
}