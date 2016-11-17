app.controller("HomeCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', 'ionicMaterialMotion', 'ionicMaterialInk', '$state', '$http', '$ionicSlideBoxDelegate', 'ids', 'categories', 'dataService', 'commonServices',
    function ($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, $http, $ionicSlideBoxDelegate, ids, categories, dataService, commonServices) {
       
        dataService.setIds(ids);
        dataService.setCategories(categories);
    $timeout(function(){
        ionicMaterialInk.displayEffect();
        // ionicMaterialMotion.ripple();
    },0);

    //$scope.Categories = [{ "NewsCatId": 11, "Title": "Tin nổi bật", "Slug": "tin-noi-bat", "Interest": 5 }, { "NewsCatId": 1, "Title": "Việt Nam", "Slug": "viet-nam", "Interest": 5 }, { "NewsCatId": 2, "Title": "Thế giới", "Slug": "the-gioi", "Interest": 5 }, { "NewsCatId": 3, "Title": "Kinh doanh", "Slug": "kinh-doanh", "Interest": 5 }, { "NewsCatId": 4, "Title": "Khoa học - Công nghệ", "Slug": "khoa-hoc-cong-nghe", "Interest": 5 }, { "NewsCatId": 5, "Title": "Giáo dục", "Slug": "giao-duc", "Interest": 5 }, { "NewsCatId": 6, "Title": "Y tế - Sức khỏe", "Slug": "y-te", "Interest": 5 }, { "NewsCatId": 7, "Title": "Giải trí", "Slug": "giai-tri", "Interest": 5 }, { "NewsCatId": 8, "Title": "Thể thao", "Slug": "the-thao", "Interest": 5 }, { "NewsCatId": 9, "Title": "Đời sống", "Slug": "doi-song", "Interest": 5 }, { "NewsCatId": 10, "Title": "Khác", "Slug": "khac", "Interest": 5 }];
    ////////////////////////////
    //  Functions
    
    // Hàm khỏi tạo
    function init() {
        debug.log('init home controller');
        
        // Chủ đề hiện tại
        if ($window.catId != null && $window.catId != undefined) {
            $scope.currentCatId = $window.catId;
        }
        
        if (!$scope.currentCatId) {
            $scope.currentCatId = 11; // Mặc định là chủ đề "Tin nổi bật"        
        }
        var cat = $scope.findCategoryBySlug("tin-noi-bat");
        if (cat) {
            $scope.currentCatId = cat.Id;
        }

        if ($stateParams.catSlug) {
            var cat = $scope.findCategoryBySlug($stateParams.catSlug);
            if (cat) {
                $scope.currentCatId = cat.Id;
            }
        }

        // Tin chi tiết
        if ($window.news != null && $window.news != undefined) {
            $scope.currentNews = {
                NewsId : $window.news,
                NumRelative : $window.numRelative,
                Id : $window.category
            };
        }

        // Loại hiển thị
        if ($window.viewType != null && $window.viewType != undefined) {
            $scope.ViewType = $window.viewType;
        } else {
            $scope.ViewType = 1;
        }
        
        // Nếu là hiển thị tin theo chủ đề
        // if ($scope.ViewType == 1) {
        //     $scope.loadArticlesForCat(11);
        // } 
        var index = findIndexCategory($scope.currentCatId); 
        $scope.initTabIndex = index;

        // Init state
        var state = {
            title : cat.Title,
            url : cat.Slug
        }
        $scope.replaceState(state, true);
    }
    
    function findIndexCategory (catId) {
        for (var i = 0, len = dataService.getCategories().length; i < len; i++) {
            var cat = dataService.getCategories()[i];
            if (cat.Id == catId) {
                return i;
            }
        }

        return -1;
    }


    ///////////////////////////
    //  Scope Functions
    
    // Event khi swipe slide
    // 
    $scope.onSlideMove = function(data) {
        if (!data || data.index == undefined) return;

        //debug.log("onSlideMove: ", data);
        
        var cat = dataService.getCategories()[data.index];
        var catId = cat.Id;
        $scope.pages[catId] = $scope.pages[catId] || 1;

        $scope.currentCatId = catId;
        
        if (!$scope.articles[catId] && !$scope.specialArticles[catId]) {
            // if move to trending menu
            if (catId === 12) {
                $scope.loadSpecialArticles(catId);
            }
            else {
                $scope.loadArticlesForCat(catId);
            }
        }
        
        // Change State
        var state = {
            title : cat.Title,
            url : "/chu-de/" + cat.Alias
        }
        //$scope.replaceState(state);
        //$state.go('category', {catSlug : cat.Alias}, {notify: true});
    };
    
    $scope.loadSpecialArticles = function (catId) {
        $scope.loading[catId] = true;
        commonServices.getTrendingList().then(function (data) {
            data.map(function (item, idx) {
                //$scope.generateSpecialUrl(item);
                //item.FacebookShare = $scope.getUrlShareFacebook(item.Path);
                if (idx % 5 == 0) {
                    item.isBig = true;
                }
                return item;
            });
            $scope.specialArticles[catId] = data;
            $scope.loading[catId] = false;
        });
    }

    // Tải danh sách tin cho 1 chủ đề
    //
    $scope.loadArticlesForCat = function (catId, ignoreCheckCat) {
        if ($scope.currentCatId != catId || $scope.loading[catId] || catId === 12) return;
        
        $scope.loading[catId] = true;
        
        // Lấy danh sách Id
        $scope.pages[catId] = $scope.pages[catId] || 1;
        var page = $scope.pages[catId];
        var temp = dataService.getIds()[catId.toString()];
        var begin = (page - 1) * 5;
        var end   = page * 5
        
        if (!temp || temp.length < begin) {
            $scope.loading[catId] = false;
            return;
        }
        
        var ids = temp.slice(begin, end).join();
        $scope.loadArticles(ids, function (articles) {
            //articles.map(function (item) {
            //    $scope.generateUrl(item);
            //    item.FacebookShare = $scope.getUrlShareFacebook(item.Path);
            //    return item;
            //});
            if (articles.length > 0) {
                articles[0].isBig = true;
            }
            $scope.articles[catId] = $scope.articles[catId] || [];
            $scope.articles[catId].push.apply($scope.articles[catId], articles);
            
            $scope.pages[catId]++;
            $scope.loading[catId] = false;
        });
    }

    $scope.loadTopShareArticles = function (catId, ignoreCheckCat) {
        if (!$scope.isLargeWidth || $scope.loading[catId] || catId === 12 || ($scope.articles && $scope.articles.length > 0)) return;
 
        if (dataService.getTopShare()[catId] && dataService.getTopShare()[catId].length > 0) {
            $scope.articles[catId] = dataService.getTopShare()[catId]; 
        }
        else {
            $scope.loading[catId] = true;
            // Lấy danh sách Id
            var temp = dataService.getIds()[catId.toString()];
            var ids = temp.slice(0, 10).join();
            $scope.loadArticles(ids, function (articles) {
                dataService.getTopShare()[catId] = articles;
                $scope.articles[catId] = articles;
                $scope.loading[catId] = false;
            });
        }
    }
    //$scope.loadArticlesForCat = function (catId, ignoreCheckCat, callback) {
    //    if ((!ignoreCheckCat && $scope.currentCatId != catId) || $scope.loading[catId] || catId === 12) return;

    //    $scope.loading[catId] = true;

    //    if ($scope.tmps[catId] && $scope.tmps[catId].length > 0) {
    //        var articles = $scope.tmps[catId].splice(0, 5);

    //        $scope.articles[catId] = $scope.articles[catId] || [];
    //        $scope.articles[catId].push.apply($scope.articles[catId], articles);

    //        $scope.pages[catId]++;
    //        $scope.loading[catId] = false;

    //        return;
    //    }

    //    // Lấy danh sách Id
    //    $scope.pages[catId] = $scope.pages[catId] || 1;
    //    var page = $scope.pages[catId];
    //    var temp = dataService.getIds()[catId.toString()];
    //    var begin = (page - 1) * 5;
    //    var end = page * 5;

    //    if (temp.length < begin) {
    //        $scope.loading[catId] = false;
    //        return;
    //    }

    //    var ids = temp.slice(begin, end).join();

    //    if (!ids) {
    //        $scope.loading[catId] = false;
    //        return;
    //    }

    //    $scope.loadArticles(ids, function (articles) {

    //        if (articles instanceof Array) {
    //            articles.map(function (item, index) {
    //                // $scope.generateUrl(item);
    //                // item.FacebookShare = $scope.getUrlShareFacebook(item.Path);
    //                item.isSmall = index % 5 != 0;
    //                item.Thumb = item.Thumbnail || item.Images;
    //                item.Image = item.Images || item.Thumbnail;
    //                item.haveImage = item.Image && item.Image.length > 0;
    //                return item;
    //            });

    //            $scope.articles[catId] = $scope.articles[catId] || [];
    //            $scope.articles[catId].push.apply($scope.articles[catId], articles);
    //        }

    //        $scope.pages[catId]++;
    //        $scope.loading[catId] = false;

    //        if (callback) {
    //            callback();
    //        }
    //    });
    //}

    $scope.showArticleRelative = function (id) {
        console.log("Show Relative: ", id);
        if (!$scope.articlesRelative[id] && !$scope.loadingRelative[id]) {
            $scope.loadArticlesRelative(id, function done(articles) {
                $scope.articlesRelative[id] = articles;
            })
        }
    }

    // Tải danh sách tin liên quan
    // id : id cua tin
    // Mặc định limit 3 tin
    // callback : trả về danh sách tin
    $scope.loadArticlesRelative = function (id, callback) {
        console.log("Load Relative: ", id);
        $scope.loadingRelative[id] = true;
        commonServices.getRelativeById(id).then(function (response) {
            $scope.loadingRelative[id] = false;
            $scope.addArticleLink(response);
            if (callback) callback(response);
        }, function () {
            $scope.loadingRelative[id] = false;
            if (callback) callback([]);
        });
    }
    
    $scope.loadMore = function() {
    }
    
    var isLocking = false;
    $scope.expandedRelative = function (article) {
        if (isLocking) {
            return;
        }
        isLocking = true;
        console.log('Toggle relative', article.isExpandedRelative);
        article.isExpandedRelative = !article.isExpandedRelative;
        if (article.isExpandedRelative) {
            $scope.showArticleRelative(article.NewsId);
        }
        setTimeout(function () {
            isLocking = false;
        }, 800);
    }

    $scope.articleDetail = function (params) {
        if (isLocking) {
            return;
        }
        $state.go('detail', params);
    }

    $scope.trendingDetail = function (params) {
        $state.go('trendingDetail', params);
    }

    //$rootScope.$on('$stateChangeStart',
    //    function (event, toState, toParams, fromState, fromParams) {
    //        console.time('state_transition2');
    //    });

    //$rootScope.$on('$stateChangeSuccess',
    //function (event, toState, toParams, fromState, fromParams) {
    //    console.timeEnd('state_transition');
    //    console.timeEnd('state_transition2');
    //});

    //$scope.$on('$ionicView.loaded', function () {
    //    // Anything you can think of
    //    console.time('loaded');
    //});
    
    //$scope.$on('$ionicView.beforeEnter', function () {
    //    // Anything you can think of
    //    console.timeEnd('loaded');
    //    console.time('beforeEnter');
    //});

    //$scope.$on('$ionicView.enter', function () {
    //    // Anything you can think of
    //    console.timeEnd('beforeEnter');
    //    console.time('enter');
    //});

    //$scope.$on('$ionicView.afterEnter', function () {
    //    // Anything you can think of
    //    console.timeEnd('enter');
    //    console.time('afterEnter');
    //});

    ////////// BOOTSTRAP \\\\\\\\\\\

    // Khởi tạo biến
    $scope.articles = [];  // Danh sách tin dùng chung cho tất cả chủ đề
    $scope.tmps = [];  // Danh sách tin dùng chung cho tất cả chủ đề
    $scope.articlesRelative = [];  // Danh sách tin dùng chung cho tất cả chủ đề
    $scope.specialArticles = []; // Special articles. i.e trending
    $scope.loadingRelative = [];  // Danh sách tin dùng chung cho tất cả chủ đề
    $scope.loading = []; // Trạng thái loading của từng chủ đề
    $scope.pages = []; // Trạng thái trang hiện tại của từng chủ đề
    $scope.cats = [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.currentCatId = 11;
    $scope.isLargeWidth = dataService.isLargeWidth();

    // Khởi tạo
    //init();
    
    ////////// BOOTSTRAP \\\\\\\\\\\
    
    // Thêm code ở đây...
    // END
  }
]);

app.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
})
.directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target, content;
            
            attrs.expanded = false;
            
            element.bind('click', function() {
                if (!target) target = document.querySelector(attrs.slideToggle);
                if (!content) content = target.querySelector('.slideable_content');
                
                if(!attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    // var y = content.clientHeight;
                    content.style.border = 0;
                    
                    // if (y !== 0) {
                    //     target.style.height = y + 'px';
                    // } else {
                    //     target.style.height = '100%';
                    // }
                    
                    target.style.height = '100%';
                } else {
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    }
})

.directive('callClickOther', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target;
            
            element.bind('click', function() {
                if (!target) target = document.querySelector(attrs.callClickOther);

                if (target) target.click();
            });
        }
    }
})
.directive('arrow', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      var $lastMenu = element.find('#last-menu');
      var $firstMenu = element.find('#first-menu');
      var threshold = 5;
      //var minLeft = element.offset().left;
      //var maxLeft = element.parent().outerWidth(true) -  $lastMenu.outerWidth(true);

      scope.$watch(function() {
        return $lastMenu.offset().left > element.parent().outerWidth(true) -  $lastMenu.outerWidth(true) + threshold;
      }, function() {
        if ($lastMenu.offset().left > element.parent().outerWidth(true) -  $lastMenu.outerWidth(true) + threshold) {
          $('#more-right').fadeIn(100);
        }
        else {
          $('#more-right').fadeOut(100);
        }
      });

      scope.$watch(function() {
        return $firstMenu.offset().left < element.offset().left - threshold;
      }, function() {
        if ($firstMenu.offset().left < element.offset().left - threshold) {
          $('#more-left').fadeIn(100);
        }
        else {
          $('#more-left').fadeOut(100);
        }
      });
    }
  }
});

app.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

app.filter('endTo', function () {
    return function (input, end) {
        if (input) {
            end = +end; //parse to int
            return input.slice(0, end);
        }
        return [];
    }
});