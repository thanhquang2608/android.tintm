app.service('dataService', [function () {
    var dataService;
    var ids;
    var categories;
    var topShare = {};

    function setCategories (data) {
       categories = data;
    }

    function getCategories() {
        //categories = [{ "Id": 11, "Name": "Tin nổi bật", "Slug": "tin-noi-bat", "Interest": 5 },
        //    { "Id": 12, "Name": "Xu hướng", "Slug": "xu-huong", "Interest": 5 },
        //    { "Id": 13, "Name": "Top share", "Slug": "top-share", "Interest": 5 },
        //    { "Id": 1, "Name": "Việt Nam", "Slug": "viet-nam", "Interest": 5 },
        //    { "Id": 2, "Name": "Thế giới", "Slug": "the-gioi", "Interest": 5 },
        //    { "Id": 3, "Name": "Kinh doanh", "Slug": "kinh-doanh", "Interest": 5 },
        //    { "Id": 4, "Name": "Khoa học - Công nghệ", "Slug": "khoa-hoc-cong-nghe", "Interest": 5 },
        //    { "Id": 5, "Name": "Giáo dục", "Slug": "giao-duc", "Interest": 5 },
        //    { "Id": 6, "Name": "Y tế - Sức khỏe", "Slug": "y-te", "Interest": 5 },
        //    { "Id": 7, "Name": "Giải trí", "Slug": "giai-tri", "Interest": 5 },
        //    { "Id": 8, "Name": "Thể thao", "Slug": "the-thao", "Interest": 5 },
        //    { "Id": 9, "Name": "Đời sống", "Slug": "doi-song", "Interest": 5 },
        //    { "Id": 10, "Name": "Khác", "Slug": "khac", "Interest": 5 }];
        return categories;
    }

    function setIds(data) {
        ids = data;
    }

    function getIds() {
        return ids;
    }

    function isLargeWidth() {
        return window.outerWidth >= 640 && window.outerHeight >= 640;
        //return window.innerWidth >= 800 && window.innerHeight >= 800;
    }

    function getTopShare() {
        return topShare;
    }

    dataService = {
        getCategories: getCategories,
        setCategories: setCategories,
        getIds: getIds,
        setIds: setIds,
        isLargeWidth: isLargeWidth,
        getTopShare: getTopShare
    }

    return dataService;
}]);