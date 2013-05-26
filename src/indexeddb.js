define(function(require) {

  var when = require('when');

  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

  /*
   * ObjectStore
   */

  function ObjectStore(idbTransaction, name) {
    this.idbObjectStore = idbTransaction.objectStore(name);
  };
  ObjectStore.prototype.add = function add(value, key) {
    var idbObjectStore = this.idbObjectStore;
    var deferred = when.defer();

    var request = idbObjectStore.add.call(idbObjectStore, value, key);
    request.onsuccess = function(event) {
      deferred.resolve(event);
    };
    request.onerror = function(event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };
  ObjectStore.prototype.clear = function clear() {
    var idbObjectStore = this.idbObjectStore;
    var deferred = when.defer();

    var request = idbObjectStore.clear();
    request.onsuccess = function(event) {
      deferred.resolve(event);
    };
    request.onerror = function(event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };
  ObjectStore.prototype.count = function count(key) {
    var idbObjectStore = this.idbObjectStore;
    var deferred = when.defer();

    var request = idbObjectStore.count(key);
    request.onsuccess = function(event) {
      deferred.resolve(event);
    };
    request.onerror = function(event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };
  ObjectStore.prototype.createIndex = function createIndex(name, keyPath, optionalParameters) {
    var idbObjectStore = this.idbObjectStore;
    return idbObjectStore.createIndex.call(idbObjectStore, name, keyPath, optionalParameters);
  };
  ObjectStore.prototype.delete = function delete(key) {
    var idbObjectStore = this.idbObjectStore;
    var deferred = when.defer();

    var request = idbObjectStore.delete(key);
    request.onsuccess = function(event) {
      deferred.resolve(event);
    };
    request.onerror = function(event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };
  ObjectStore.prototype.deleteIndex = function deleteIndex(name) {
    var idbObjectStore = this.idbObjectStore;
    return idbObjectStore.deleteIndex.call(idbObjectStore, name);
  };
  ObjectStore.prototype.get = function get(key) {
    var idbObjectStore = this.idbObjectStore;
    var deferred = when.defer();

    var request = idbObjectStore.get(key);
    request.onsuccess = function(event) {
      deferred.resolve(event);
    };
    request.onerror = function(event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };
  ObjectStore.prototype.index = function index(name) {
    var idbObjectStore = this.idbObjectStore;
    return idbObjectStore.index.call(idbObjectStore, name);
  };
  ObjectStore.prototype.openCursor = function openCursor(range, direction) {
    var idbObjectStore = this.idbObjectStore;
    var deferred = when.defer();

    var request = idbObjectStore.openCursor(range, direction);
    request.onsuccess = function(event) {
      deferred.resolve(event);
    };
    request.onerror = function(event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };
  ObjectStore.prototype.put = function put(value, key) {
    var idbObjectStore = this.idbObjectStore;
    var deferred = when.defer();

    var request = idbObjectStore.put(value, key);
    request.onsuccess = function(event) {
      deferred.resolve(event);
    };
    request.onerror = function(event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };

  /*
   * Transaction
   */

  function Transaction(idbDatabase, storeNames, mode) {
    this.idbTransaction = idbDatabase.transaction(storeNames, mode);
  };
  Transaction.prototype.objectStore = function objectStore(name) {
    var idbTransaction = this.idbTransaction;
    return new ObjectStore(idbTransaction, name);
  };
  Transaction.prototype.abort = function abort() {
    var idbTransaction = this.idbTransaction;
    return idbTransaction.abort();
  };

  /*
   * Database
   */

  function Database(idbDatabase) {
    this.idbDatabase = idbDatabase;
    this.name = idbDatabase.name;
    this.version = idbDatabase.version;
  };
  Database.prototype.createObjectStore = function createObjectStore(name, optionalParameters) {
    var idbDatabase = this.idbDatabase;
    return idbDatabase.createObjectStore(name, optionalParameters);
  };
  Database.prototype.deleteObjectStore = function deleteObjectStore(name) {
    var idbDatabase = this.idbDatabase;
    return idbDatabase.deleteObjectStore(name);
  };
  Database.prototype.transaction = function transaction(storeNames, mode) {
    var idbDatabase = this.idbDatabase;
    return new Transaction(idbDatabase, storeNames, mode);
  };
  Database.prototype.close = function close() {
    var idbDatabase = this.idbDatabase;
    return idbDatabase.close();
  };
  Database.prototype.objectStoreNames = function objectStoreNames() {
    var idbDatabase = this.idbDatabase;
    return idbDatabase.objectStoreNames;
  };

  /*
   * Factory
   */

  function open(name, version) {
    var deferred = when.defer();

    var request = indexedDB.open(name);
    request.onupgradeneeded = function(event) {
      var result = new Database(event.target.result);
      event.target._result = result;
      deferred.notify(event);
    };
    request.onsuccess = function(event) {
      var result = new Database(event.target.result);
      event.target._result = result;
      deferred.resolve(event);
    };
    request.onerror = function(event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };

  function deleteDatabase(name) {
    var deferred = when.defer();

    var request = indexedDB.deleteDatabase(name);
    request.onupgradeneeded = function(event) {
      deferred.notify(event);
    };
    request.onsuccess = function(event) {
      deferred.resolve(event);
    };
    request.onerror = function(event) {
      deferred.reject(event);
    };

    return deferred.promise;
  };

  return {
    open: open,
    deleteDatabase: deleteDatabase
  };

});