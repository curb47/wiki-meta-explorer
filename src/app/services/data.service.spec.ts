import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  // sendMessage
  it('should send a message', inject([DataService], (service: DataService) => {
    // TODO:
  }));

  // getReceivedMessages$
  it('should fire off received messages', inject([DataService], (service: DataService) => {
    // TODO:
  }));

  // handleOpen
  it('should connect and send off pending messages', inject([DataService], (service: DataService) => {
    // TODO:
  }));

  // handleMessage
  it('should fire off notification of new messages', inject([DataService], (service: DataService) => {
    // TODO:
  }));

  // handleError
  it('should do something useful on error', inject([DataService], (service: DataService) => {
    // TODO:
  }));

  // handleClose
  it('should indicate connection has been closed', inject([DataService], (service: DataService) => {
    // TODO:
  }));
});
