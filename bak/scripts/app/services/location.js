window.IMS = window.IMS || {};
IMS.datacontext = IMS.datacontext || {};
IMS.datacontext.location = (function ($, amplify) {
    var serverUrl = 'http://211.144.85.15:8080/blade/rest';
    var init = function () {
        //get the latest position for all the cars
        amplify.request.define('getLastLocGeoAll', 'ajax', {
            url: serverUrl + '/location/getLastLocGeoAllS.jsonp?status=8',
            dataType: 'jsonp',
            type: 'GET'
        });

        //get the latest position for all the cars
        amplify.request.define('getLastLocGeoAllForBoard', 'ajax', {
            url: serverUrl + '/location/getLastLocGeoAllS.jsonp?status=1',
            dataType: 'jsonp',
            type: 'GET'
        });

        //get the latest position for the query item
        amplify.request.define('getLastLocGeo', 'ajax', {
            url: serverUrl + '/location/getLastLocGeo.jsonp?appId={appId}',
            dataType: 'jsonp',
            type: 'GET'
        });
        //get the path point array
        amplify.request.define('getLocGeoAll', 'ajax', {
            url: serverUrl + '/location/getLocGeoAll.jsonp?mobile={mobile}&appId={appId}&startTS={startTS}&endTS={endTS}',
            dataType: 'jsonp',
            type: 'GET'
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

    getLastLocGeoAll = function (option) {
        return defferedRequest('getLastLocGeoAll', option)
    };

    getLastLocGeoAllForBoard = function (option) {
        return defferedRequest('getLastLocGeoAllForBoard', option)
    };

    getLastLocGeo = function (option) {
        return defferedRequest('getLastLocGeo', option)
    };

    getLocGeoAll = function (option) {
        return defferedRequest('getLocGeoAll', option)
    };

    init();

    return {
        getLastLocGeoAll: getLastLocGeoAll,
        getLastLocGeo: getLastLocGeo,
        getLocGeoAll: getLocGeoAll,
        getLastLocGeoAllForBoard: getLastLocGeoAllForBoard
    }
}(jQuery, amplify));


