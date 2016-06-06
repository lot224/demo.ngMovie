
/**
 * @name storageManager
 * @memberof sessionStorageService
 * @memberof localStorageService
 * @type object
 * @description manages the browser storage collection for the window.sessionStorage and window.localStorage objects.
 */
var storageManager = function ($rootScope, storageType, storage) { // jshint ignore:line

  var dictionary = [];
  var service = {};

  /**
   * @name storageManager.get
   * @kind function
   * @param {string} key the name of the object to return.
   * @returns {object}
   * @description Returns an object based on the key passed in, if key is null or undefined return all
   */
  service.get = function (key) {
    if (!key) return service.getAll();

    var value = storage ? storage.getItem(key) : dictionary[key];

    if (value === null)
      return undefined;
    try { return JSON.parse(value); }
    catch (e) { return value || undefined; }
  };

  /**
   * @name storageManager.getAll
   * @kind function
   * @returns {object<string,object>}
   * @description Returns a collection object containing the keys and values of those keys.
   */
  service.getAll = function () {
    var nResult = {};
    var keys = Object.keys(storage || dictionary);

    for (var i = 0; i < keys.length; i++) {
      nResult[keys[i]] = service.get(keys[i]);
    }
    return nResult;
  };

  /**
   * @name storageManager.set
   * @kind method
   * @param {string} key the name of the object to be stored.
   * @param {object} value the object to be stored.
   * @description Stores an object into local or session storage with the given name
   */
  service.set = function (key, value) {
    var obj = value === null || value === undefined || typeof value !== 'object' ? value : JSON.stringify(value);

    if (storage) {
      storage.setItem(key, obj);
    } else {
      dictionary[key] = obj;
    }

    $rootScope.$broadcast('io.' + storageType + '.storage', 'set', {}[key] = value);
  };

  /**
   * @name storageManager.remove
   * @kind method
   * @param {string} key the name of the object to be removed.
   * @description Removes an object from local or session storage that matches the key param
   */
  service.remove = function (key) {
    if (storage) { storage.removeItem(key); } else { delete dictionary[key]; }
    $rootScope.$broadcast('io.' + storageType + '.storage', 'remove', key);
  };

  /**
 * @name storageManager.clear
 * @kind method
 * @description Removes all items from local or session storage
 */
  service.clear = function () {
    if (storage) { storage.clear(); } else { dictionary = []; }
    $rootScope.$broadcast('io.' + storageType + '.storage', 'clear');
  };

  return service;
};


/**
 * @ngdoc service
 * @name sessionStorageService
 * @description the angular module for the application
 * @returns a new instance of {@link storageManager} which manipulates the window.sessionStorage object.
 */
var sessionStorageService = ['$rootScope', function ($rootScope) { // jshint ignore:line
  return new storageManager($rootScope, 'session', window.sessionStorage); // jshint ignore:line
}];


/**
 * @ngdoc service
 * @name localStorageService
 * @description the angular module for the application
 * @returns a new instance of {@link storageManager} which manipulates the window.localStorage object.
 */
var localStorageService = ['$rootScope', function ($rootScope) { // jshint ignore:line
  return new storageManager($rootScope, 'local', window.localStorage); // jshint ignore:line
}];