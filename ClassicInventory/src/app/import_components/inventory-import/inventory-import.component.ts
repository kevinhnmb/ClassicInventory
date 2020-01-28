import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory-import',
  templateUrl: './inventory-import.component.html',
  styleUrls: ['./inventory-import.component.scss']
})
export class InventoryImportComponent implements OnInit {

  @ViewChild('labelImport', {static: false})
  labelImport: ElementRef;

  formImport: FormGroup;
  fileToUpload: File = null;

  constructor(private auth :AngularFireAuth, public db: AngularFirestore) { 
    this.formImport = new FormGroup({
      importFile: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    
  }

  onFileChange(files: FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }

  import(): void {
    console.log('import ' + this.fileToUpload.name);

    var reader = new FileReader();

    reader.addEventListener('loadend', (e) => {
      const text = reader.result as String;

      // Loop and write data to Firestore.
      var byLine = text.split(/\r?\n/);

      var i = 1;

      for(i = 1; i < byLine.length; i++) {
        var current = byLine[i].split(",");

        this.db.collection("inventory_codes").add({item_code: current[0], item_name: current[1]});

      }


    });
    
    reader.readAsText(this.fileToUpload);
  }

}
