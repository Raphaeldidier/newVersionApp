import { Injectable } from '@angular/core';
import { NativeStorage } from 'ionic-native';

@Injectable()
export class TokenAuth {
  LOCAL_TOKEN_KEY = 'yourTokenKey';

  constructor() {
  }

  public loadUserCredentials(){
  	NativeStorage.getItem(this.LOCAL_TOKEN_KEY).then(
	    token => console.log("My token = "+token),
	    error => console.error(error)
	  );
      // useCredentials(token);
  }

  public storeUserCredentials(token) {
    NativeStorage.setItem(this.LOCAL_TOKEN_KEY, token).then(
	    () => console.log('Stored item!'),
	    error => console.error('Error storing item', error)
	  );
    // useCredentials(token);
  }

}
