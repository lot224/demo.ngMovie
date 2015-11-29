/**
 * @ngdoc directive
 * @name pagerDirective
 * @depends iTunesFactory iTunes
 * @attribute {datasetService} dataset =
 * @description a control that allows page navigation against a datasetService object
 */
var pagerDirective = ['iTunesFactory', function (iTunes) {
  return {
    restrict: "E",
    templateUrl: "/template.pager.html",
    scope: {"dataset":"="},
    controller: ['$scope', function ($scope) {
      var ds = $scope.dataset;

      var fn = $scope.fn = {

        /**
         * @name pagerDirective.$scope.prevPage
         * @kind method
         * @description sets the current page to the previous page
         */
        prevPage : function () {
          if (ds.page !== 1)
            fn.setPage(ds.page - 1);
        },

        /**
         * @name pagerDirective.$scope.nextPage
         * @kind method
         * @description sets the current page to the next page
         */
        nextPage : function () {
          if (ds.page !== ds.pageCount)
            fn.setPage(ds.page + 1);
        },

        /**
         * @name pagerDirective.$scope.setPage
         * @kind method
         * @description sets the current page to the specified page
         */
        setPage: function (pg) {
          ds.page = pg;
        },

        /**
         * @name pagerDirective.$scope.pages
         * @kind function
         * @returns {int}
         * @description returns the total number of pages in the dataset
         */
        pages: function () {
          return new Array(ds.pageCount());
        }
      }
    }]
  }
}];