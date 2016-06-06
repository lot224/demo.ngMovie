
/**
 * @typedef datasetService.new.options
 * @prop {int} page The active page of the dataset.
 * @prop {object<string,function>} sorters a named collection of functions that return the value of a column to be sorted by.
 * @prop {int} pageSize the amount of records per page.
 * @prop {string} sortField The column to sort by.
 * @prop {string} sortOrder The direction of the sort column. ('ascending','descending') defaults to 'ascending'.
 */

/**
 * @ngdoc service
 * @name datasetService
 * @description
 * ### An object used to manipulate a set of data for multiple control use.
 */
var datasetService = ['$rootScope', function ($rootScope) {

  /**
    * @name datasetService.new
    * @kind constructor
    * @arg {datasetService.new.options} options - The options used to initialize the dataset.
    */
  return function (options) {
    var scope = $rootScope.$new(true);

    /** Holds an array of records based on pageSize, sortField and sortOrder.
     * @name datasetService.view
     * @kind property
     * @type {array}
     */
    scope.view = [];

    /** Specifies the current page that the dataset has loaded into the view.
     * @name datasetService.page
     * @kind property
     * @type {int} datasetService.page 
     */
    scope.page = 1;

    /**
     * @name datasetService.sorters
     * @kind property
     * @type {Object<string, function>}
     */
    scope.sorters = {};

    /**
     * @name datasetService.pageSize
     * @kind property
     * @type {int}
     */
    scope.pageSize = 5;

    /**
     * @name datasetService.sortField
     * @kind property
     * @type {string}
     */
    scope.sortField = '';

    /**
     * @name datasetService.sortOrder
     * @kind property
     * @type {string}
     * @description Specify the direction of the {@link datasetService.sortField} ascending or decending. Defaults to ascending
     */
    scope.sortOrder = 'ascending';

    options.view = []; // overwrite the view object, this should only be populated by the dataset.
    angular.extend(scope, options);

    var _data = [];


    /**
     * @name datasetService.reset
     * @kind function
     * @private
     * @description resets the dataset and prepares it for a datasource
     */
    var reset = function () {
      _data = [];
      scope.page = 1;
      scope.view = [];
    }

    /**
     * @name datasetService.load
     * @kind function
     * @description loads an array of data into the dataset.
     * @arg {array} data The data array to apply to the dataset
     */
    scope.load = function (data) {
      reset();
      _data = data;
      scope.render();
    }

    /**
     * @name datasetService.sort
     * @kind function
     * @arg {array} data The data array to apply to the dataset
     * @description sorts the data by field and order, if order is not specified it will toggle the direction. if no order was initally specified it will default to ascending.
     * #### Using sorters
     * If you have certain data types that need to be sorted a certain way you can implement a sorter.  if no sorter matches the sortField passed in it will try sorting by lower casing the field and do a compare.
     */
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

    /**
     * @name datasetService.render
     * @kind method
     * @description based on the settings for the dataset, records are rendered into the view object.
     */
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

    /**
     * @name datasetService.records
     * @kind function
     * @returns {int}
     * @description returns the total count of all records.
     */
    scope.records = function () {
      return _data.length;
    }

    /**
     * @name datasetService.pageCount
     * @kind function
     * @returns {int}
     * @description returns the total pages for the dataset
     */
    scope.pageCount = function () {
      return Math.ceil(parseInt(scope.records()) / parseInt(scope.pageSize));
    }

    var pageSizeListener = null;

    /**
     * @name datasetService.onPageSizeChange
     * @kind event
     * @description fires when the pageSize property changes
     */
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

    /**
     * @name datasetService.onPageChange
     * @kind event
     * @description fires when the page property changes
     */
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