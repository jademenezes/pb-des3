import { Store } from '../stores.schema';

export interface StoreOutput extends Store {
  name: string;
  distance: string;
}
