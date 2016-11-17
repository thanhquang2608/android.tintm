app.controller('TrendingDetailCtrl', ['$scope', '$ionicHistory', '$window', 'ids', '$state', '$stateParams', 'dataService',
    function ($scope, $ionicHistory, $window, ids, $state, $stateParams, dataService) {

    // Khởi tạo biến
    $scope.articles = [];  // Danh sách tin dùng chung cho tất cả chủ đề
    $scope.articlesRelative = [];  // Danh sách tin dùng chung cho tất cả chủ đề
    $scope.specialArticles = []; // Special articles. i.e trending
    $scope.loadingRelative = [];  // Danh sách tin dùng chung cho tất cả chủ đề
    $scope.loading = false; // Trạng thái loading của từng chủ đề
    $scope.pages; // Trạng thái trang hiện tại của từng chủ đề
    $scope.ids = ids;
    $scope.title = $stateParams.trendingTitle;
    $scope.topShareArticles = [];
    $scope.topShareLoading = {};
    $scope.isLargeWidth = dataService.isLargeWidth();

    // Tải danh sách tin cho 1 chủ đề
    //
    $scope.loadTrendingArticles = function () {
        if ($scope.loading) return;

        $scope.loading = true;

        // Lấy danh sách Id
        $scope.pages = $scope.pages || 1;
        var page = $scope.pages;
        var temp = $scope.ids;
        var begin = (page - 1) * 5;
        var end = page * 5

        if (!temp || temp.length < begin) {
            $scope.loading = false;
            return;
        }

        var listIds = temp.slice(begin, end).join();
        $scope.loadArticles(listIds, function (articles) {
            //articles.map(function (item) {
            //    $scope.generateUrl(item);
            //    item.FacebookShare = $scope.getUrlShareFacebook(item.Path);
            //    return item;
            //});
            if (articles.length > 0) {
                articles[0].isBig = true;
            }
            $scope.articles = $scope.articles || [];
            $scope.articles.push.apply($scope.articles, articles);

            $scope.pages++;
            $scope.loading = false;
        });
    }

    $scope.articleDetail = function (params) {
        $state.go('detail', params);
    }

    $scope.loadTopShareArticles = function (catId, ignoreCheckCat) {
        if (!$scope.isLargeWidth || $scope.topShareLoading[catId] || catId === 12 || ($scope.topShareArticles && $scope.topShareArticles.length > 0)) return;

        if (dataService.getTopShare()[catId] && dataService.getTopShare()[catId].length > 0) {
            $scope.topShareArticles[catId] = dataService.getTopShare()[catId];
        }
        else {
            $scope.topShareLoading[catId] = true;

            // Lấy danh sách Id
            var temp = dataService.getIds()[catId.toString()];

            var ids = temp.slice(0, 10).join();
            $scope.loadArticles(ids, function (articles) {
                dataService.getTopShare()[catId] = articles;
                $scope.topShareArticles[catId] = articles;
                $scope.topShareLoading[catId] = false;
            });
        }
    }

    $scope.goBack = function () {
        debug.log($ionicHistory.viewHistory());
        $scope.isLeft = true;

        if ($ionicHistory.viewHistory().backView) {
            var backView = $ionicHistory.backView();
            debug.log("go back");

            $ionicHistory.goBack();
            //$window.history.back();

            // var state = {
            //     title : backView.title,
            //     url : backView.url
            // }
            // debug.log(state);
            // $scope.trackPageViewUrlGA(state.url);
            // $scope.replaceState(state);

        } else {
            debug.log("go category");
            $state.go('category', { catSlug: 'xu-huong' });
        }

    }
}]);