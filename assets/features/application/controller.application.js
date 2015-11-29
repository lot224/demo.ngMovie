/**
 * @ngdoc controller
 * @name applicationController
 * @depends $scope
 * @depends datasetService dataset
 * @depends iTunesFactory iTunes
 * @depends favoritesFactory fav
 * @description Main application controller
 */
var applicationController = ['$scope', 'datasetService', 'iTunesFactory', 'favoritesFactory', function ($scope, dataset, iTunes, fav) {

  /**
   * @name applicationController.$scope.fav
   * @kind property
   * @type {iTunesFactory}
   * @description a refrence to the favoritesFactory on the $scope object
   */
  $scope.fav = fav;

  /**
   * @name applicationController.ds
   * @alias applicationController.$scope.dataset
   * @kind property
   * @type {datasetService}
   * @description a refrence to the favoritesFactory on the $scope object
   */
  var ds = $scope.dataset = new dataset({
    pageSize: 5,
    sorters: {
      image: function (row) {
        var item = row['im:image']
        return item ? item[0].label : '';
      },
      title: function (row) {
        return row['im:name'].label
      },
      director: function (row) {
        return row['im:artist'].label;
      },
      price: function (row) {
        var item = row['im:price']
        return item ? item.label : 'n/a';
      },
      rent: function (row) {
        var item = row['im:rentalPrice']
        return item ? item.label : 'n/a';
      },
      release: function (row) {
        var item = row['im:releaseDate']
        return item ? item.attributes.label : 'n/a';
      }
    }
  });

  /**
   * @name applicationController.$scope.selectedItem
   * @kind property
   * @type {object}
   * @description An item from the apple json entry array.
   */
  $scope.selectedItem = null;


  /**
   * @name applicationController.fn
   * @alias applicationController.$scope.fn
   * @kind object
   * @description A collection of functions and methods on the $scope object and the controller
  */
  var fn = $scope.fn = {
    /**
     * @name applicationController.fn.setSelectedItem
     * @alias applicationController.$scope.fn.setSelectedItem
     * @kind method
     * @param {object} item - an item to be set as the selected item
     * @description sets the $scope.selectedItem to the item passed into the method
     */
    setSelectedItem: function (item) {
      $scope.selectedItem = item;
    },

    /**
     * @name applicationController.fn.toggleFavorite
     * @alias applicationController.$scope.fn.toggleFavorite
     * @kind method
     * @param {clickEvent} mouse click event object
     * @param {object} item - an item to be toggled as a favorite.
     * @description adds or removes an item from the favorites collection.
     */
    toggleFavorite: function (event, item) {
      var obj = fav.item(item);

      if (obj === null)
        fav.add(item);
      else
        fav.delete(item);

      event.stopPropagation();
    },

    /**
     * @name applicationController.fn.isFavorite
     * @alias applicationController.$scope.fn.isFavorite
     * @kind function
     * @param {object} item - the object to check if its a favorite or not
     * @returns {boolean}
     * @description determin if an item is in the favorites collection
     */
    isFavorite: function (item) {
      return fav.item(item) !== null;
    }
  }

  iTunes.movies()
    .then(function (data) {
      ds.load(data);
    });

}];