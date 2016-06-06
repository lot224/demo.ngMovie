/**
 * @ngdoc service
 * @name helperService
 * @description A misc service that contains methods for global use
 */
var helperService = [function () {

  var service = {};

  /**
   * @name helperService.guid
   * @kind function
   * @returns {string}
   * @description
   * Generates a random fabricated {guid} string.
   * ```js
   *   angular.module('foo', [])
   *     .service('helperService', helperService)
   *     .controller('bar', ['helperService', function (helper) {
   *       var nResult = helper.guid();
   *       console.log(nResult); 
   *     }]);
   * ```
   */
  service.guid = function () {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  };

  return service;
}]