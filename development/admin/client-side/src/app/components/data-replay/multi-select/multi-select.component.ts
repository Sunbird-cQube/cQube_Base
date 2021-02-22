import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit {
  @Input() list: any[];
  @Input() selection;
  @Input() width1;
  @Input() width2;
  @Input() text;
  @Output() shareCheckedList = new EventEmitter();
  @Output() shareIndividualCheckedList = new EventEmitter();

  status;
  checkedList: any = [];
  constructor() { }

  showDropDown;

  getSelectedValue(id, status) {
    if (status) {
      this.checkedList.push(id);
    } else {
      var index = this.checkedList.indexOf(id);
      this.checkedList.splice(index, 1);
    }
    this.shareCheckedlist();
  }

  resetSelected() {
    this.checkedList = [];
  }

  getSelected() {
    this.shareCheckedlist();
  }
  shareCheckedlist() {
    this.shareCheckedList.emit(this.checkedList);
  }

  ngOnInit() { }

}
