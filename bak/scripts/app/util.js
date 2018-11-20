window.IMS = window.IMS || {};
IMS.util = (function () {

    var getUserInfo = function () {
        var userInfo = sessionStorage.getItem('userInfo');
        if (userInfo != null)
            return JSON.parse(userInfo);
        else return "NO_DATA"
    }

    return {
        getUserInfo: getUserInfo
    };
})();