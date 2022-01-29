import { addDoc, collection, Firestore } from '@firebase/firestore';
import { EventTransfererAsync, EnhanceEvent, eventIdentity, IdentifiableEvent } from '@osnova/events';
import { AnyEvent } from '@osnova/events/Events';

type GetRefFn<Event extends AnyEvent> = <E extends Event>(event: E) => string;

export class FirestoreEventTransferer<Event extends AnyEvent>
  implements EventTransfererAsync<Event, Event & IdentifiableEvent>
{
  private firestore!: Firestore;
  private getRef!: GetRefFn<Event>;
  private enhanceEvent: EnhanceEvent<Event, Event & IdentifiableEvent> = eventIdentity as EnhanceEvent<
    Event,
    Event & IdentifiableEvent
  >;

  constructor(
    firestore: Firestore,
    getRef: GetRefFn<Event>,
    enhanceEvent: EnhanceEvent<Event, Event & IdentifiableEvent> = eventIdentity as EnhanceEvent<
      Event,
      Event & IdentifiableEvent
    >
  ) {
    this.firestore = firestore;
    this.getRef = getRef;
    this.enhanceEvent = enhanceEvent;
  }

  transfer = async <E extends Event>(event: E): Promise<Event & IdentifiableEvent> => {
    const col = collection(this.firestore, this.getRef(event));
    const docRef = await addDoc(col, event);
    const finalEvent = this.enhanceEvent(event);

    finalEvent.id = docRef.id;

    return finalEvent;
  };

  setEnhancer(enhancer: EnhanceEvent<Event, Event & IdentifiableEvent>): void {
    this.enhanceEvent = enhancer;
  }

  setGetRef(fn: GetRefFn<Event>) {
    this.getRef = fn;
  }
}
