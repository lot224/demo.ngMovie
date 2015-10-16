var datasetService = ['$rootScope', function ($rootScope) {

  return function (options) {
    var scope = $rootScope.$new(true);

    scope.view = [];
    scope.page = 1;
    scope.sorters = {};
    scope.pageSize = 5;
    scope.sortField = '';
    scope.sortOrder = 'ascending';

    angular.extend(scope, options);

    var _data = [];

    var reset = function () {
      _data = [];
      scope.page = 1;
      scope.view = [];
    }

    scope.load = function (data) {
      reset();
      _data = data;
      scope.render();
    }

    scope.sort = function (sortField, sortOrder) {
      if (typeof sortField === 'undefined' || sortField === null)
        return;

      var ascending = function (a, b) {
        var x, y, xx, yy;

        if (scope.sorters[sortField]) {
          xx = scope.sorters[sortField](a);
          yy = scope.sorters[sortField](b);

          x = xx ? xx.toLowerCase ? xx.toLowerCase() : xx : "";
          y = yy ? yy.toLowerCase ? yy.toLowerCase() : yy : "";
        } else {
          x = a[sortField] ? a[sortField].toLowerCase ? a[sortField].toLowerCase() : a[sortField] : "";
          y = b[sortField] ? b[sortField].toLowerCase ? b[sortField].toLowerCase() : b[sortField] : "";
        }

        return x < y ? -1 : x > y ? 1 : 0;
      }
      var descending = function (a, b) {
        return ascending(b, a);
      }

      scope.sortField = sortField;

      sortOrder = sortOrder ? sortOrder : scope.sortOrder == 'ascending' ? 'descending' : 'ascending';

      if (sortOrder == 'descending') {
        scope.sortOrder = 'descending';
        _data.sort(descending);
      } else {
        scope.sortOrder = 'ascending'
        _data.sort(ascending);
      }

      if (scope.page == 1)
        scope.render();
      else
        scope.page = 1;
    }

    scope.render = function () {

      var nResult = [];
      var pgNum = scope.page - 1; // zero base;
      var start = pgNum * scope.pageSize;

      if (start < _data.length) {
        for (var i = 0; i < scope.pageSize; i++) {
          var item = _data[i + start];

          if (item) {
            item.$$index = i + start;
            item.$$viewIndex = i;
            nResult.push(item);
          }
          else break;
        }
      }

      scope.view = nResult;
    }

    scope.records = function () {
      return _data.length;
    }

    scope.pageCount = function () {
      return Math.ceil(parseInt(scope.records()) / parseInt(scope.pageSize));
    }

    var pageSizeListener = null;
    var onPageSizeChange = function (n, o) {
      if (n === o) return; // No Change.

      if (isNaN(n) || n < 1) {
        pageSizeListener();
        scope.pageSize = o;
        pageSizeListener = scope.$watch('pageSize', onPageSizeChange);
        return;
      }

      if (scope.page == 1)
        scope.render();
      else
        scope.page = 1;
    }
    pageSizeListener = scope.$watch('pageSize', onPageSizeChange);

    var pageListener = null;
    var onPageChange = function (n, o) {

      if (n === o) return; // No Change.

      if (isNaN(n) || n < 1 || n > scope.pageCount()) {
        pageListener();
        scope.page = o;
        pageListener = scope.$watch('page', onPageChange);
        return;
      }

      scope.render();
    }
    pageListener = scope.$watch('page', onPageChange);

    return scope;

  }

}];