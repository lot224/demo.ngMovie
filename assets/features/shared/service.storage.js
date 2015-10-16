var storageManager = function ($rootScope, storageType, storage) { // jshint ignore:line

  console.log("storageManager", storageType, storage, window);

  var dictionary = [];

  var service = {};

  service.get = function (id) {
    if (!id) return service.getAll();

    

    var value = storage ? storage.getItem(id) : dictionary[id];


    if (value === null)
      return undefined;
    try { return JSON.parse(value); }
    catch (e) { return value || undefined; }
  };

  service.getAll = function () {
    var nResult = {};
    var keys = Object.keys(storage || dictionary);

    for (var i = 0; i < keys.length; i++) {
      nResult[keys[i]] = service.get(keys[i]);
    }
    return nResult;
  };

  service.set = function (key, value) {
    if (typeof value === undefined) {
      if (storage) {
        console.log("using storage: undefined");
        storage.setItem(key, undefined);
      } else {
        console.log("using dictionary: undefined");
        dictionary[key] = undefined;
      }
    } else {
      var obj = JSON.stringify(value);
      if (storage) {
        console.log("using storage: value");
        storage.setItem(key, obj);
      } else {
        console.log("using dictionary: value");
        dictionary[key] = obj;
      }
    }
    $rootScope.$broadcast('io.' + storageType + '.storage', 'set', {}[key] = value);
  };

  service.remove = function (key) {
    if (storage) { storage.removeItem(key); } else { delete dictionary[key]; }
    $rootScope.$broadcast('io.' + storageType + '.storage', 'remove', key);
  };

  service.clear = function () {
    if (storage) { storage.clear(); } else { dictionary = []; }
    $rootScope.$broadcast('io.' + storageType + '.storage', 'clear');
  };

  return service;
};

var sessionStorageService = ['$rootScope', function ($rootScope) { // jshint ignore:line
  return new storageManager($rootScope, 'session', window.sessionStorage); // jshint ignore:line
}];

var localStorageService = ['$rootScope', function ($rootScope) { // jshint ignore:line
  return new storageManager($rootScope, 'local', window.localStorage); // jshint ignore:line
}];