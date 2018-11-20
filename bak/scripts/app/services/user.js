window.IMS = window.IMS || {};
IMS.datacontext = IMS.datacontext || {};
IMS.datacontext.user = (function ($, amplify) {
    var serverUrl = 'http://211.144.85.15:8080/blade/rest';
    var init = function () {
        //get the latest position for all the cars
        amplify.request.define('login', 'ajax', {
            type: 'POST',
            url: serverUrl + '/user/login',
            crossDomain: true
        });
    },

    defferedRequest = function (resourceId, option) {
        return $.Deferred(function (dfd) {
            amplify.request({
                resourceId: resourceId,
                data: option,
                success: dfd.resolve,
                error: dfd.reject
            });
        }).promise()
    },


    login = function (option) {
        return defferedRequest('login', option)
    };

    init();

    return {
        login: login
    }
}(jQuery, amplify));


