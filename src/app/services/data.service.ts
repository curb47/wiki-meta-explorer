import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

/**
 * BaseDataService - Since Angular doesn't support Interface DI, we use a base class
 * definition here that is meant to be extended. So this effectively operates as an
 * Interface
 */
@Injectable()
export class BaseDataService {

  public sendMessage(message: Request): void {
    throw new Error('Method unsupported');
  }
  public getReceivedMessages$(): Subject<Response> {
    throw new Error('Method unsupported');
  }
}

/**
 * DataService provides the interface to the back-end data servicing
 * this application.
 */
@Injectable()
export class DataService extends BaseDataService {

  constructor() {
    super();
    // this.connect();
  }

  //////////////////////////////////////////////
  // INNER WORKINGS
  //////////////////////////////////////////////

  private _url = 'wss://wiki-meta-explorer.herokuapp.com';  // TODO: Put into coniguration
  public set url(url: string) {
    this._url = url;
  }
  private websocket: WebSocket;
  private _connecting: boolean = false;
  private _connected: boolean = false;
  
  /**
   * Connect method connects to the data back-end. This method automatically
   * gets triggered when `sendMessage` is called. This is a cheap way of introducing
   * the concept of automatic reconnect without implementing it the "real" way.
   */
  private connect() {
    if (this._connected) {
      return;
    }

    this.websocket = new WebSocket(this._url, ['soap', 'xmpp']);
    this._connecting = true;

    // Setup WebSocket listeners
    this.websocket.onopen = (event: Event) => {
      this.handleOpen(event);
    };

    this.websocket.onmessage = (event: MessageEvent) => {
      this.handleMessage(event.data);
    };

    this.websocket.onerror = (event: ErrorEvent) => {
      this.handleError(event);
    };

    this.websocket.onclose = (event: CloseEvent) => {
      this.handleClose(event);
    };
  }

  private _pendingMessages: Request[] = [];
  /**
   * Sends the message to the back-end over the WebSocket connection.
   * @param message 
   */
  public sendMessage(message: Request): void {
    if (this._connected) {
      this._sendMessage(message);
    }
    else {
      if (!this._connecting) {
        // Attempt to reconnect
        this.connect();
      }
      this._pendingMessages.push(message);
    }
  }

  private _sendMessage(message: Request): void {
    // We assume this is connected since logic for that is determined elsewhere.
    if (!this._connected) {
      throw new Error('Not connected');
    }

    this.websocket.send(JSON.stringify(message));
  }

  private _receivedMessages$: Subject<Response> = new Subject<Response>();
  /**
   * An Observable that updates every time a message is received.
   */
  public getReceivedMessages$(): Subject<Response> {
    return this._receivedMessages$;
  }

  
  //////////////////////////////////////////
  // WEBSOCKET EVENT HANDLERS
  //////////////////////////////////////////
  private handleOpen(event: Event): void {
    this._connecting = false;
    this._connected = true;

    while (this._pendingMessages.length > 0) {
      this._sendMessage(this._pendingMessages.shift());
    }
  }

  private handleMessage(strData: string): void {
    if (!strData) return; // Don't process if no data
    let data: any = JSON.parse(strData);
    this._receivedMessages$.next(new Response(data.id, data.name, data.data));
  }

  private handleError(event: ErrorEvent): void {
    // TODO: Do something meaningful with this error
    console.log('WebSocket Error: ', event);
  }

  private handleClose(event: CloseEvent): void {
    this._connecting = false;
    this._connected = false;
  }
}



/**
 * Request is a helper class for formatting requests to the server
 */
export class Request {
  constructor(public id: string, public name: string, public args?: any) {}
}

/**
 * Response is a helper class for formatted responses from the server
 */
export class Response {
  constructor(public id: string, public name: string, public data?: any) {}
}
