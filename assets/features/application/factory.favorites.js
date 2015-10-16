var favoritesFactory = ['localStorageService','functionsService', function (storage, functions) {

  var factory = {}

  var _items = null;

  factory.items = function () {
    if (_items === null)
      _items = storage.get('favorites') || [];
    return _items;
  };

  factory.item = function (item) {
    var items = factory.items();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id.attributes['im:id'] === item.id.attributes['im:id'])
        return item;
    }
    return null;
  }

  factory.add = function (item) {
    var nResult = factory.item(item);
    if (nResult === null) {
      _items.push(item);
      storage.set('favorites', _items);
    }
    return item;
  };

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

  factory.clear = function () {
    _items = [];
    storage.set('favorites', _items);
  }

  return factory;
}]