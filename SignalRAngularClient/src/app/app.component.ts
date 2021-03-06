import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Message } from './message';
import { HubConnection } from "@microsoft/signalr";
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SignalRAngularClient';
  name = "";
  message: string ="";
  messages:Message[] = [];
  chatStarted: boolean;
  connection: HubConnection;

  constructor(private http: HttpClient) {
    this.connection = new signalR
    .HubConnectionBuilder()
    .withUrl(environment.apiEndpointUrl)
    .build();

    this.connection.start()
    .then(() => { });    
  }

  public chat(){
    this.chatStarted = true;
    this.messages = []; 
    this.connection.on("newMessage", data => {
      //console.log(data);
      this.addToMessages(data);
    });
  }

  addToMessages(data: Message) {
    //console.log(data)
    this.messages.push(data);
  }

  public send(){
    let data:Message = new Message();
    data.Text = this.message;
    data.Name = this.name;
    const body:any = {};
    body.Target = "newMessage";
    body.Message = data;
    
    const apiUrl = environment.apiEndpointUrl + "SignalRSendMessage"
    this.http
    .post(apiUrl, body)
    .subscribe(
      (data: any) => {
        //console.log(`Func Hub sendMessage: ${data}`)
      },
      error => console
      .error(`An error occurred in sendMessage: ${error}`)
    );

    this.message = "";
  }
}
