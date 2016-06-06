
var applicationController = ['$scope', 'datasetService', 'iTunesFactory', 'favoritesFactory', function ($scope, dataset, iTunes, fav) {

  var berger = window.localStorage.getItem("berger");
  berger = new Date().getTime();
  window.localStorage.setItem("berger", berger);

  $scope.fav = fav;

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

  $scope.selectedItem = null;

  var fn = $scope.fn = {
    setSelectedItem: function (item) {
      $scope.selectedItem = item;
    },
    toggleFavorite: function (event, item) {
      var obj = fav.item(item);

      if (obj === null)
        fav.add(item);
      else
        fav.delete(item);

      event.stopPropagation();
    },
    isFavorite: function (item) {
      return fav.item(item) !== null;
    }
  };

  iTunes.movies()
    .then(function (data) {
      ds.load(data);
    });
}];