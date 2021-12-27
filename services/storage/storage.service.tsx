import { STORAGE_ENGINES } from '../../utilities/constants';

export default class StorageService {
  engine = '';
  engines = STORAGE_ENGINES;
  errors = new Error();
  storage = window.sessionStorage;
  constructor(engine) {
    this.engine = engine;
    this.engines = STORAGE_ENGINES;
    this.errors = new Error();
    switch (this.engine) {
      case this.engines.SESSION:
        this.storage = window.sessionStorage;
        break;
      case this.engines.LOCAL:
        this.storage = window.localStorage;
        break;
      default:
        this.errors.message = '';
        throw this.errors;
    }
  }
  get(key) {
    if (key) {
      const result: any = this.storage.getItem(key) || null;
      return JSON.parse(result);
    }
  }
  set(key, value) {
    if (key && value) {
      this.storage.setItem(key, JSON.stringify(value));
      this.get(key);
    }
  }
  remove(key) {
    this.storage.removeItem(key);
  }
  removeAll() {
    this.storage.clear();
  }
}
