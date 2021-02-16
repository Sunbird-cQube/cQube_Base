import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit {
  @Input() list: any[];

  @Output() shareCheckedList = new EventEmitter();
  @Output() shareIndividualCheckedList = new EventEmitter();

  status;
  @Input() checkedList: any[];
  currentSelected: {};
  constructor() {
    this.checkedList = [];
  }

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

  getSelected() {
    this.shareCheckedlist();
  }
  shareCheckedlist() {
    this.shareCheckedList.emit(this.checkedList);
  }

  ngOnInit() { }

}
