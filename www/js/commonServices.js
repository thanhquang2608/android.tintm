app.service('commonServices', ['$http', function ($http) {
    //var serviceBase = 'http://localhost:1337/';
    //var serviceBase = 'http://sm.smartapp.tech/';
    var serviceBase = 'http://www.tintm.com/';
    var commonServices = {};

    function getHotNewIds () {
        return $http.get(serviceBase + 'm/hotnews').then(function (response) {
            return response.data;
        });
    }

    function getCategories () {
        return $http.get(serviceBase + 'm/category').then(function (response) {
            return response.data;
        });
    }

    function getRelativeById (id) {
        return $http.get(serviceBase + 'articles/relative?id=' + id).then(function (response) {
            return response.data;
        });
    }

    function getArticle (newsId) {
        return $http.get(serviceBase + 'article?id=' + newsId).then(function (response) {
            return response.data;
        });
 
    }

    function getArticlesRelate (limit, id) {    
        return $http.get(serviceBase + 'articles/relative?limit=' + limit + '&id=' + id).then(function (response) {
            return response.data;
        });
    }

    function getArticles(ids) { 
        return $http.get(serviceBase + 'articles?id=' + ids).then(function (response) {
            return response.data;
        });
    }

    function getTrendingList() {
        return $http.get(serviceBase + 'm/topic/trends').then(function (response) {
            return response.data;
        });
    }

    function getTrendingNewsBytrendingId (trendingId) {
        return $http.get(serviceBase + 'm/news/topic?id=' + trendingId).then(function (response) {
            return response.data;
        });
    }

    commonServices = {
        getHotNewIds: getHotNewIds,
        getCategories: getCategories,
        getRelativeById: getRelativeById,
        getArticle: getArticle,
        getArticlesRelate: getArticlesRelate,
        getArticles: getArticles,
        getTrendingList: getTrendingList,
        getTrendingNewsBytrendingId: getTrendingNewsBytrendingId
    };

    return commonServices;
}]);