# @osnova/events-firebase

## Install

```sh
# npm
npm install @osnova/events @osnova/events-firebase firebase --save
# yarn
yarn add @osnova/events @osnova/events-firebase firebase
```

## Usage

### FirestoreConnector

Request connector that writes request events as documents to `requestsCollection` and listens `responsesCollection` for responses to that events.

```typescript
import { FirestoreConnector } from '@osnova/events-firebase';

const connector = new FirestoreConnector(firebase, {
  requestsCollection: 'requests',
  responsesCollection: 'responses',
  // will delete processed response event if `true`
  deleteResponse: true,
});

connector.request({ type: 'ping', payload: void 0 }).then((response) => {
  console.log(response);
});
```

First parameter of `FirestoreConnector` is an initialized Firebase application (`firebase.app.App`).

[@osnova/firebase-client](https://github.com/0snova/firebase-client) can be used to easily initialize Firebase.
