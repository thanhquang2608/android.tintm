app.controller('AppCtrl', function ($scope, $http, $ionicHistory, $timeout, $state, $window, timeAgo, dataService, commonServices, $sce) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    $scope.MODE = {DEVELOPMENT : 'development', PRODUCTION : 'production'}
    $scope.envMode = $scope.MODE.DEVELOPMENT;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
    //$scope.Categories = [{ "NewsCatId": 11, "Title": "Tin nổi bật", "Slug": "tin-noi-bat", "Interest": 5 }, { "NewsCatId": 1, "Title": "Việt Nam", "Slug": "viet-nam", "Interest": 5 }, { "NewsCatId": 2, "Title": "Thế giới", "Slug": "the-gioi", "Interest": 5 }, { "NewsCatId": 3, "Title": "Kinh doanh", "Slug": "kinh-doanh", "Interest": 5 }, { "NewsCatId": 4, "Title": "Khoa học - Công nghệ", "Slug": "khoa-hoc-cong-nghe", "Interest": 5 }, { "NewsCatId": 5, "Title": "Giáo dục", "Slug": "giao-duc", "Interest": 5 }, { "NewsCatId": 6, "Title": "Y tế - Sức khỏe", "Slug": "y-te", "Interest": 5 }, { "NewsCatId": 7, "Title": "Giải trí", "Slug": "giai-tri", "Interest": 5 }, { "NewsCatId": 8, "Title": "Thể thao", "Slug": "the-thao", "Interest": 5 }, { "NewsCatId": 9, "Title": "Đời sống", "Slug": "doi-song", "Interest": 5 }, { "NewsCatId": 10, "Title": "Khác", "Slug": "khac", "Interest": 5 }];

    //$scope.ids = {"1":[695384,695873,695584,695535,695477,695978,695914,695789,696226,695574,696219,694973,695875,694871,695045,696036,695310,695982,695939,696070,695054,694761,695626,695622,696065,695705,695568,695263,695534,694960,695828,695560,695504,695220,694742,695038,695832,695258,695400,695172,694968,694992,696304,694775,694716,695862,696210,696373,696275,694755],"2":[696066,696168,696345,694993,694975,694963,694908,695426,694988,695449,695292,695583,695064,694970,694969,695359,694732,695048,695097,696126,696248,695850,695714,694948,695280,695719,695410,695732,695076,695056,695408,694639,694957,694915,694804,696301,696392,696380,696348,696284,694762,696355,696236,696182,696273,695888,696296,696249,695901,696199,695970,696144,696154],"3":[696203,695339,695122,695381,694934,696021,696097,696216,695796,696246,694862,695661,695655,695411,695513,695541,695645,695269,695148,696012,694930,696371,696189,696238,696375,696368,696384,696232,696328,696294,696252,696245,696118,696320,696174,696243,696229,696228,695931,696374,696191,696058,696165,696020,696061,695921,695986,695895,695646,695894,696090],"4":[695487,696262,695239,695050,695254,694752,695547,695466,695354,695098,694801,696393,696342,696394,695835,696376,696332,695972,695955,696075,695649,695672,695532,695594,695213,696163,695582,695278,695170,695000,695071,695167,694837,694821,694791,695900,695899,695883,694655],"5":[695139,695345,695173,695040,696305,696222,694757,696141,695932,696233,696035,696121,695994,695772,695618,695578,695577,695680,695302,695507,695497,695344,695235,695111,695121,695104,694884,694885,695201,694868],"6":[695358,695196,694790,694813,694793,696178,696269,696000,696166,696130,695935,696366,696173,695913,695651,696149,695768,695903,695711,695483,695710,695595,695530,695494,695362,695881,695273,695376,695215,695388,695490,695366,696335,695349,695332,694955,695270,694898,695794,694881,695055,694914,694864,694849,694840,694834,694830,694825,694817,694810],"7":[695176,694987,696128,695634,695648,695619,695748,695754,695272,695026,696068,694903,695118,695590,695330,695194,695083,695145,694902,694812,694708,696343,696386,696272,696176,696387,694730,696129,696274,696268,696003,694824,696127,696112,696089,696316,695886,696347,695992,695949,695993,695983,695961,696164,696206,696080,695880,696039,695990,696381],"8":[696287,695551,695009,694962,695372,695281,695008,695146,695113,695738,695799,694789,696029,695129,694911,695489,694933,694734,695999,694893,694920,695247,694887,696400,696388,696327,694943,694888,696408,696297,696111,694782,696033,696331,696397,696204,696338,696156,696074,695941,695940,696050,695948,695947,696351,695681,695621,695579,695995,695524,695523],"9":[694983,694731,695378,696014,694899,695753,695613,695004,696031,694728,694758,694756,695246,695877,695778,696185,695508,695667,695424,695197,695192,695256,695564,695529,695032,695088,695136,694880,696404,696403,695439,695102,694918,695030,694961,696177,696279,696184,696406,696390,696281,696357,696282,696389,696396,696333,696330,696329,696362,696037],"10":[695586,695253,695445,695764,696047,695958,695976,696009,695788,695706,695703,695555,695521,695401,695385,695609,695429,695427,695488,695409,695444,695486,695874,695070,695110,695019,694929,695114,695100,695879,694760,695051,695608],"11":[696066,696168,696287,696203,696345,695384,695873,695584,695535,695477,694993,694975,694963,694908,695426,695339,695122,695381,694934,696021,695487,696262,695239,695050,695254,695139,695345,695173,695040,696305,695358,695196,694790,694813,694793,695176,694987,696128,695634,695648,695551,695009,694962,695372,695281,694983,694731,695378,696014,694899,695586,695253,695445,695764,696047]};

    //$scope.setCategories = function (data) {
    //    $scope.$apply(function () {
    //        $scope.Categories = data;
    //    });
    //}

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
    
    /////////////////////////////
    function init() {
        // Danh sách id tin
        if ($window.ids != null && $window.ids != undefined) {
            $scope.ids = $window.ids;
        }

        // Danh sách chủ đề
        if ($window.categories != null && $window.categories != undefined) {
            $scope.Categories = $window.categories;
        }
    }

    // function locationDecorator($location, $rootScope) {
    //     var skipping = false;

    //     $rootScope.$on('$locationChangeSuccess', function(event) {
    //         if (skipping) {
    //             event.preventDefault();
    //             skipping = false;
    //         }
    //     });

    //     $location.skipReload = function() {
    //         skipping = true;
    //         return this;
    //     };

    //     return $location;
    // }
    
    // Tim index của CatId
    $scope.findIndexCategory = function(catId) {
        for (var i = 0, len = dataService.getCategories().length; i < len; i++) {
            var cat = dataService.getCategories()[i];
            if (cat.Id == catId) {
                return i;
            }
        }

        return -1;
    }
    
    // Tim Category
    $scope.findCategoryBySlug = function(slug) {
        for (var i = 0, len = dataService.getCategories().length; i < len; i++) {
            var cat = dataService.getCategories()[i];
            if (cat.Slug == slug) {
                return cat;
            }
        }

        return null;
    }

    // Tim Category
    $scope.findCategoryById = function(catId) {
        for (var i = 0, len = dataService.getCategories().length; i < len; i++) {
            var cat = dataService.getCategories()[i];
            if (cat.Id == catId) {
                return cat;
            }
        }

        return null;
    }
    
    // Cập nhật title
    $scope.updateTitle = function(s) {
        //window.document.title = s;

        //document.getElementById('title').innerHTML = s;
        //// or, if you decided to optimize your code by putting the script tag after the body
        //// if (ttl) ttl.innerHTML = s;
        //// or ignore the id altogether
        //document.getElementsByTagName('title')[0].innerHTML = s;
        //// or if you're using HTML5
        //document.querySelector.apply(document,['title']).innerHTML = s;
        //// or
        //document.querySelectorAll.apply(document,['title'])[0].innerHTML = s;
    }
    
    // Replace current state
    $scope.replaceState = function(state, notTrack) {
        if (window.history && window.history.replaceState) {
            $scope.updateTitle(state.title);
            window.history.replaceState(state, state.title, state.url);

            if ($ionicHistory) {
                var currentView = $ionicHistory.currentView();
                currentView.title = state.title;
                currentView.url = state.url;
            }

            if (!notTrack) {
                $scope.trackPageViewUrlGA(state.url);
            }
        }
    }

    $scope.pushState = function(state, notTrack) {
        if (window.history && window.history.pushState) {
            $scope.updateTitle(state.title);
            window.history.pushState(state, state.title, state.url);

            if (!notTrack) {
                $scope.trackPageViewUrlGA(state.url);
            }
        }
    }
    
    // Tracking google analytic
    $scope.trackPageViewUrlGA = function(url) {
        if ($scope.envMode == $scope.MODE.PRODUCTION) {
            $window.ga('send', 'pageview', url);
        }
    }
    
    $scope.generateUrl = function(article) {
        var catAlias = article.realCatAlias || article.catAlias;
        article.Path = "/chu-de/"+ catAlias + "/" + article.Alias + "-" + article.NewsId + ".html";
        article.OriginPath = "/chu-de/goc/"+ catAlias + "/" + article.Alias + "-" + article.NewsId + ".html";

        // For params
        article.CatSlug = article.realCatAlias || article.catAlias;
        article.NewsSlug = article.Alias + "-" + article.NewsId + ".html";
    }

    $scope.generateSpecialUrl = function (article) {
        var catSlug = article.Slug;
        article.Path = "/" + catSlug + ".html";
        article.OriginPath = "/" + catSlug + ".html";
    }
    
    // Thêm link vào trang chi tiết của tin và link gốc
    $scope.addArticleLink = function (articles) {
        if (!articles) return;
        
        for (var i = 0, len = articles.length; i < len; i++) {
            var article = articles[i];
            $scope.generateUrl(article);
            // articles[i].Path = "/chu-de/"+ article.realCatAlias + "/" + article.Alias + "-" + article.NewsId + ".html";
            // articles[i].OriginPath = "/chu-de/goc/"+ article.realCatAlias + "/" + article.Alias + "-" + article.NewsId + ".html";
        };
        
        // debug.log(articles);
    }

    // Tải danh sách tin
    // ids : id của tin được join bởi dấu ","
    // callback : trả về danh sách tin
    $scope.loadArticles = function (ids, callback) {
        commonServices.getArticles(ids).then(function (response) {
            $scope.addArticleLink(response);
            if (callback) callback(response);
        }, function (err) {
            if (callback) callback([]);
        });
    }

    $scope.getUrlShareFacebook = function (url) {
        var host = "http://www.tintm.com";
        url = host + url;
        var baseUrl = "https://www.facebook.com/plugins/like.php?locale=vi_VN&href={url}&layout=button&action=like&size=small&show_faces=false&data-share=false&share=false";
        return $sce.trustAsResourceUrl(baseUrl.replace("{url}", url));
    }
    /////////////////////////////
    //init();
    

    // Config TimeAgo
    timeAgo.settings.strings.vi_VN = {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "trước",
        suffixFromNow: "vài giây trước",
        inPast: 'vài giây',
        seconds: "%d giây",
        minute: "1p",
        minutes: "%dp",
        hour: "1g",
        hours: "%dg",
        day: "1ng",
        days: "%dng",
        month: "1 tháng",
        months: "%d tháng",
        year: "1 năm",
        years: "%d năm",
        wordSeparator: " ",
        numbers: []
    };

    angular.element(document).ready(function () {
        var popped = ('state' in window.history);
        var initialURL = window.location.href;
        $window.onpopstate = function(event) {
            var initialPop = !popped && $window.location.href == initialURL;
            popped = true;
            if (initialPop) return;

            if (event.state) {
                var state = event.state;
                document.title = state.title; 
            } else {
                // location.reload();
            }
        };
    });

    $scope.log = function (msg) {
        console.log(msg);
    }
});

app.directive('hideImageIfNotExists', function($http) {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                element.hide();
            });
        }
   }
});

// app.run(['$rootScope', '$urlRouter', '$location', '$state', function ($rootScope, $urlRouter, $location, $state) {
//     $rootScope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl) {
//       // Prevent $urlRouter's default handler from firing
//       e.preventDefault();

//       /** 
//        * provide conditions on when to 
//        * sync change in $location.path() with state reload.
//        * I use $location and $state as examples, but
//        * You can do any logic
//        * before syncing OR stop syncing all together.
//        */
//       debug.log($state, $state.current.name, newUrl);
//     //   if ($state.current.name === 'home' && (newUrl === 'http://www.tintm.com/chu-de/viet-nam' || newUrl ==='https://www.tintm.com/chu-de/viet-nam')) {
//       if ($state.current.name === 'home' && (newUrl === 'http://localhost:1337/chu-de/viet-nam' || newUrl ==='http://localhost:1337/chu-de/tin-noi-bat')) {
//         // don't sync
//       } else {
//         // your stuff
//         $urlRouter.sync();
//       }
//     });
//     // Configures $urlRouter's listener *after* your custom listener
//     $urlRouter.listen();
//   }]);