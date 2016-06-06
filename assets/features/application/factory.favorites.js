/**
 * @ngdoc factory
 * @name favoritesFactory
 * @description Keeps track of favorite movies. Stores them in local storage.
 * @depends localStorageService
 * @depends helperService
 */
var favoritesFactory = ['localStorageService', 'helperService', function (storage, helper) {

  var factory = {}

  var _items = null;

  /**
   @name favoritesFactory.items
   @returns {array}
   @kind function
   @description pulls a collection of movies from storage
   */
  factory.items = function () {
    if (_items === null)
      _items = storage.get('favorites') || [];
    return _items;
  };

  /**
   @name favoritesFactory.item
   @returns {array}
   @kind function
   @description pulls a collection of movies from storage
   */
  factory.item = function (item) {
    var items = factory.items();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id.attributes['im:id'] === item.id.attributes['im:id'])
        return item;
    }
    return null;
  }

  /**
   @name favoritesFactory.add
   @returns {object} The item passed into the function.
   @kind function
   @param {object} item - the object to be added to the collection
   @description adds an item to the favorites collection
   */
  factory.add = function (item) {
    var nResult = factory.item(item);
    if (nResult === null) {
      _items.push(item);
      storage.set('favorites', _items);
    }
    return item;
  };

  /**
   @name favoritesFactory.delete
   @returns {object} The item passed into the function.
   @kind function
   @param {object} item - the object to be removed to the collection
   @description removes an item from the collection
   */
  factory.delete = function (item) {
    var items = factory.items();
    var nResult = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].id.attributes['im:id'] !== item.id.attributes['im:id'])
        nResult.push(items[i]);
    }

    _items = nResult;
    storage.set('favorites', _items);
    return item;
  }

  /**
   @name favoritesFactory.clear
   @kind method
   @description removes all items from the collection.
   */
  factory.clear = function () {
    _items = [];
    storage.set('favorites', _items);
  }

  return factory;
}]