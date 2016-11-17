app.controller("DetailCtrl", ['$rootScope', "$scope", "$sce", "$stateParams", "$q", "$location", "$window", '$timeout', 'ionicMaterialMotion', 'ionicMaterialInk', '$http', '$ionicHistory', '$ionicConfig', '$state', 'dataService', 'commonServices',
    function ($rootScope, $scope, $sce, $stateParams, $q, $location, $window, $timeout, ionicMaterialMotion, ionicMaterialInk, $http, $ionicHistory, $ionicConfig, $state, dataService, commonServices) {

        $timeout(function(){
            ionicMaterialInk.displayEffect();
            // ionicMaterialMotion.ripple();
        },0);

        ////////////////////////////
        //  Functions
        
        // Hàm khỏi tạo
        function init() {
           debug.log('Init detail controller');
           $scope.CatSlug = $stateParams.catSlug;
           $scope.Slug = $stateParams.slug;
           $scope.CatId = $stateParams.viewCatId;

           $scope.$state = $state;
        //    $scope.stateName = $state.current
           
           // Chi tiết tin 
           if ($window.article != null && $window.article != undefined) {
               $scope.article = $window.article;
               $scope.generateUrl($scope.article);
               debug.log($scope.article);
               $scope.article.FacebookShare = getUrlShareFacebook($scope.article.Path);
               if (!$scope.article.Related) $scope.article.Related = $scope.article.numRelative;

               debug.log($scope.article.FacebookShare);
               $scope.loading = false;

               if ($scope.article.Related) {
                   $scope.loadArticlesRelative($scope.article.NewsId, function done(articles) {
                       $scope.articlesRelative.push.apply($scope.articlesRelative, articles);
                   })
               }
           } else {
               var newsId = getNewsIdFromSlug($scope.Slug);
               debug.log(newsId);
               loadArticle(newsId, function(article) {
                   $scope.article = article;
                   debug.log(article);
                   $scope.loading = false; 
                   $scope.articles[0] = article;

                   //setTimeout(function() {
                   // //    $scope.updateTitle(article.Title);
                   // // Init state
                   // changeState(article, true);
                   //}, 0);

                   if ($scope.article.Related) {
                        $scope.loadArticlesRelative($scope.article.NewsId, function done(articles) {
                            $scope.articlesRelative.push.apply($scope.articlesRelative, articles);
                        })
                    }
               });
               
               $scope.NewsId = newsId;
           }
           
           // Tìm Category hiện tại
           if (!$scope.CatId) {
               $scope.Category = $scope.findCategoryBySlug($scope.CatSlug);
               $scope.TopIds = dataService.getIds()[$scope.Category.Id];
               debug.log($scope.TopIds);
               for(var i = 0, len = $scope.TopIds.length; i < len; i++) {
                   var topid = $scope.TopIds[i];
                   if (topid == $scope.NewsId) {
                       $scope.TopIds = $scope.TopIds.slice(0);
                       $scope.TopIds.splice(i, 1);
                       $scope.TopIds.push(0, 0, $scope.NewsId);
                       break;
                   }
               }
           } else {
               $scope.Category = $scope.findCategoryById($scope.CatId);
               $scope.TopIds = dataService.getIds()[$scope.Category.Id];

               var begin = $scope.TopIds.indexOf($scope.NewsId);
               if (begin < 0) {
                   $scope.TopIds = [$scope.NewsId];
               } else {
                   var length = Math.min($scope.MAX_SLIDE, $scope.TopIds.length - (begin + 1));
                   $scope.TopIds = $scope.TopIds.slice(begin, begin + length + 1); 
               }
           }

           $scope.pager.total = Math.min($scope.MAX_SLIDE, $scope.TopIds.length);
           $scope.arr = $scope.ARRAY.slice(0, $scope.pager.total - 1);

           // Load Article Hightlight
           loadArticlesHighlight()
        }
        
        // Tải nội dung tin
        function loadArticle(newsId, callback) {
            commonServices.getArticle(newsId).then(function (response) {
                $scope.generateUrl(response);
                response.FacebookShare = getUrlShareFacebook(response.Path);
                if (callback) callback(response);
            }, function (err) {
                if (callback) callback({});
            });
        }
        
        // Parse NewsId from slug
        function getNewsIdFromSlug(slug) {
            var beginId = slug.lastIndexOf("-") + 1;
            var endId = slug.indexOf(".");
            var newsId = parseInt(slug.substring(beginId, endId), 10);
            
            return newsId;
        }
        
        // Change State Article
        function changeState(article, dontTrack) {
            var state = {
                title : article.Title,
                url : article.Path
            }
            $scope.trackPageViewUrlGA(state.url);
            $scope.replaceState(state, dontTrack);
        }

        function getUrlShareFacebook(url) {
            var host = "http://www.tintm.com";
            url = host + url;
            var baseUrl = "https://www.facebook.com/plugins/like.php?locale=vi_VN&href={url}&width=60&layout=button_count&action=like&show_faces=false&data-share=true&share=false";
            return $sce.trustAsResourceUrl(baseUrl.replace("{url}", url));
        }

        function loadArticlesHighlight() {
             // Lấy danh sách Id
            var temp = dataService.getIds()["11"];
            if (temp.length < 0) {
                return;
            }
            
            $scope.loadingHighlight = true;

            var ids = temp.slice(0, 5).join();
            $scope.loadArticles(ids, function (articles) {
                if (articles.length > 0) {
                    articles[0].isBig = true;
                }
                $scope.articlesHighlight = $scope.articlesHighlight || [];
                $scope.articlesHighlight.push.apply($scope.articlesHighlight, articles);
                
                $scope.loadingHighlight = false;
            });
        }
        
        ////////////////////////////
        // Scope Functions
        $scope.goBack = function (backToPrevious) {
            //console.time('state_transition');
            debug.log($ionicHistory.viewHistory());
            $scope.isLeft = true;
            
            if ($ionicHistory.viewHistory().backView && $stateParams.backToPrevious) {
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
                $state.go('category', {catSlug : $scope.CatSlug});
            }
            
        }
        
        $scope.slideDetailHasChanged = function(index) {
            
            if ($scope.isLeft) return;

            $scope.pager.current = index;
            
            if (!$scope.articles[index] && !$scope.loading[index]) {
                var pId = ++$scope.pId;
                var id = $scope.TopIds[index];
                debug.log(index, $scope.TopIds, id);
                $scope.loadings[index] = true;
                loadArticle(id, function(article) {
                    // $scope.generateUrl(article);
                    $scope.articles[index] = article;
                    $scope.loadings[index] = false;
                    
                    if (pId == $scope.pId) {
                        // Change state
                        debug.log('change state');
                        //setTimeout(function(params) {
                        //    changeState($scope.articles[index]);    
                        //}, 100)
                        
                    }
                });
            } else {
                //changeState($scope.articles[index]);
            }
        }

        // Tải danh sách tin liên quan
        // id : id cua tin
        // Mặc định limit 3 tin
        // callback : trả về danh sách tin
        $scope.loadArticlesRelative = function(id, callback) {
            debug.log("Load Relative: ", id);
            var limit = 5;
            $scope.loadingRelative = true;
            commonServices.getArticlesRelate(limit, id).then(function (response) {
                $scope.loadingRelative = false;
                $scope.addArticleLink(response);
                if (callback) callback(response)
            }, function (err) {
                $scope.loadingRelative = false;
                if (callback) callback([]);
            });
        }
        
        $scope.gotoDetail = function (params) {
            if ($state.includes('detail')) {
                $state.go('detail1', params);
            }
            else if ($state.includes('detail1')) {
                $state.go('detail', params);
            }
        }

        $scope.goOtherArticle = function (catSlug, slug) {
            debug.log('Go other article');

            reInitVariables();

            $scope.CatSlug = catSlug;
            $scope.Slug = slug;

            //debug.log(catSlug, slug, catId);

            var newsId = getNewsIdFromSlug($scope.Slug);
            debug.log(newsId);
            loadArticle(newsId, function (article) {
                $scope.article = article;
                debug.log(article);
                $scope.loading = false;
                $scope.articles[0] = article;

                //setTimeout(function () {
                //    // Init state
                //    changeState(article);
                //}, 0);

                // if ($scope.article.Related) {
                $scope.loadArticlesRelative($scope.article.NewsId, $scope.article.Related,
                  function done(articles) {
                      $scope.articlesRelative.push.apply($scope.articlesRelative, articles);
                  },
                  function fill(articles) {
                      $scope.articlesRelative.push.apply($scope.articlesRelative, articles);
                  });
                // }
            });

            $scope.NewsId = newsId;

            $scope.pager.total = Math.min($scope.MAX_SLIDE, $scope.TopIds.length);
            $scope.arr = $scope.ARRAY.slice(0, $scope.pager.total - 1);

            // Load Article Hightlight
            loadArticlesHighlight()
        }

        function reInitVariables() {
            $scope.article = undefined;  // Tin chi tiết
            $scope.articlesRelative = [];  // Tin lien quan
            $scope.articlesHighlight = [];  // Tin lien quan
            $scope.loading = true; // Trạng thái loading
            $scope.loadingRelative = false;
            $scope.loadingHighlight = false;
        }

        //$scope.$on('$ionicView.afterLeave', function () {
        //    // Anything you can think of
        //    console.timeEnd('afterEnter');
        //});
        
        $scope.loadTopShareArticles = function (catId, ignoreCheckCat) {
            if (!$scope.isLargeWidth || $scope.topShareLoading[catId] || catId === 12 || ($scope.articles && $scope.articles.length > 0)) return;

            if (dataService.getTopShare()[catId] && dataService.getTopShare()[catId].length > 0) {
                $scope.articles[catId] = dataService.getTopShare()[catId];
            }
            else {
                $scope.topShareLoading[catId] = true;

                // Lấy danh sách Id
                var temp = dataService.getIds()[catId.toString()];

                var ids = temp.slice(0, 10).join();
                $scope.loadArticles(ids, function (articles) {
                    dataService.getTopShare()[catId] = articles;
                    $scope.articles[catId] = articles;
                    $scope.topShareLoading[catId] = false;
                });
            }
        }
        ////////// BOOTSTRAP \\\\\\\\\\\

        // Khởi tạo biến
        $scope.pId = 0;
        $scope.isLeft = false;
        $scope.article = undefined;  // Tin chi tiết
        $scope.articlesRelative = [];  // Tin lien quan
        $scope.articlesHighlight = [];  // Tin lien quan
        $scope.loading = true; // Trạng thái loading
        $scope.loadings = []; // Trạng thái loading
        $scope.topShareLoading = {}; // Trạng thái loading
        $scope.loadingRelative = false;
        $scope.loadingHighlight = false;
        $scope.articles = [];
        $scope.MAX_SLIDE = 10;
        $scope.ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.isLargeWidth = dataService.isLargeWidth();
        
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
            
            // if ($scope.Category) {
            //     $ionicConfig.backButton.text($scope.Category.Title);
            // } else {
            //     $ionicConfig.backButton.text("");
            // }
            
        });
        
        ////////// BOOTSTRAP \\\\\\\\\\\
        $scope.pager = {
            total: 10,
            current: 0
        }
        
        $scope.getCount = function(num) {
            return new Array(num);
        };

        // Khởi tạo
        init();

        // Thêm code ở đây...
        $scope.like = function (url) {
            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object: url,
                })
            }, function (response) { });
        }
        // END
    }
]);

app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });