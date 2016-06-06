var imgDirective = [function () {
  return {
    restrict: "E",
    priority: 1,
    scope: { url: '=' },
    link: function (scope, element, attrs) {
      element.bind('error', function () {
        element[0].src = "/noImage.png";
      });
    },
    controller: ['$scope', '$element', function ($scope, $element) {
      $scope.$watch('url', function (newValue, oldValue) {
        if (newValue && newValue.length > 0)
          $element[0].setAttribute('src', newValue);
      });
    }]
  };
}];