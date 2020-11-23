import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ComingSoonComponent implements OnInit {
  pageTitle;
  constructor(private route: ActivatedRoute,) { }

  ngOnInit(): void {
  //  var value =  this.route.snapshot.params['name'];
  //     this.pageTitle = value;
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
  }

}
