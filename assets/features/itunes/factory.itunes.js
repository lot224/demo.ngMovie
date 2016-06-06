
/**
 * @ngdoc factory
 * @name iTunesFactory
 * @depends $q
 * @depends $http
 * @description Gets a collection of the top 50 movies from iTunes
 */
var iTunesFactory = ['$q', '$http', function ($q, $http) {

  var iTunesUrl = 'https://itunes.apple.com/us/rss/topmovies/limit=50/json'

  var movies = null;

  var factory = {};

  /**
   * @name iTunesFactory.movies
   * @kind function
   * @returns {promise}
   * @description retreives the top 50 movies from apple.com's iTunes server.
   */
  factory.movies = function () {

    var d = $q.defer();

    if (movies === null) {
      $http.get(iTunesUrl)
        .success(function (data) {
          movies = data.feed.entry;
          d.resolve(movies);
        }).error(function (err) {
          d.reject(err);
        });
    } else {
      d.resolve(movies);
    }
    return d.promise;
  }

  return factory;
}];