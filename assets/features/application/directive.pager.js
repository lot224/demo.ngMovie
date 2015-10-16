var pagerDirective = ['iTunesFactory', function (iTunes) {
  return {
    restrict: "E",
    templateUrl: "/template.pager.html",
    scope: {"dataset":"="},
    controller: ['$scope', function ($scope) {
      var ds = $scope.dataset;

      var fn = $scope.fn = {
        prevPage : function () {
          if (ds.page !== 1)
            fn.setPage(ds.page - 1);
        },
        nextPage : function () {
          if (ds.page !== ds.pageCount)
            fn.setPage(ds.page + 1);
        },
        setPage: function (pg) {
          ds.page = pg;
        },
        pages: function () {
          return new Array(ds.pageCount());
        }
      }
    }]
  }
}];