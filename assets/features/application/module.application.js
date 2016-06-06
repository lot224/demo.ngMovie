/**
 * @ngdoc module
 * @name applicationModule
 * @description the angular module for the application
 */
angular.module("applicationModule", [])
  .controller("applicationController", applicationController)
  .directive("img", imgDirective)
  .directive("pager", pagerDirective)
  .factory("iTunesFactory", iTunesFactory)
  .factory("favoritesFactory", favoritesFactory)
  .service("datasetService", datasetService)
  .service("localStorageService", localStorageService)
  .service("helperService", helperService)
  .config(applicationConfig)