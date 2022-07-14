import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  //The messageService property must be public because you're going to bind to it in the template.
  //NB: Angular only binds to public component properties.
  constructor(public messageService: MessageService) {}

  ngOnInit(): void {}
}
