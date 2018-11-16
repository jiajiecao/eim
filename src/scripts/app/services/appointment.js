window.IMS = window.IMS || {};
IMS.datacontext = IMS.datacontext || {};
IMS.datacontext.appointment = (function ($, amplify) {
    var serverUrl = 'http://211.144.85.15:8080/blade/rest';
    var init = function () {
        amplify.request.define('getAppointmentByMobile', 'ajax', {
            url: serverUrl + '/application/getAppBriefListM.jsonp?mobile={mobile}&status={status}',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getAllShortParkingAppointments by getAppBriefListS
        amplify.request.define('getAllShortParkingAppointments', 'ajax', {
            url: serverUrl + '/application/getAppBriefListS.jsonp?status=8',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getAllShortParkingAppointmentsForBoard by getAppBriefListS
        amplify.request.define('getAllShortParkingAppointmentsForBoard', 'ajax', {
            url: serverUrl + '/application/getAppBriefListS.jsonp?status=1',
            dataType: 'jsonp',
            type: 'GET'
        });


        //getAllAppointments by getAppBriefListSA
        amplify.request.define('getAllAppointments', 'ajax', {
            url: serverUrl + '/application/getAppBriefListSA.jsonp?status[]=0,1,2,3,4',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getNotStartedAppointments by getAppBriefListS
        amplify.request.define('getNotStartedAppointments', 'ajax', {
            url: serverUrl + '/application/getAppBriefListS.jsonp?status=0',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getOnWayAppointments by getAppBriefListS
        amplify.request.define('getOnWayAppointments', 'ajax', {
            url: serverUrl + '/application/getAppBriefListS.jsonp?status=1',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getAlreadyArrivedAppointments by getAppBriefListS
        amplify.request.define('getAlreadyArrivedAppointments', 'ajax', {
            url: serverUrl + '/application/getAppBriefListS.jsonp?status=2',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getAlreadyEntryAppointments by getAppBriefListS
        amplify.request.define('getAlreadyEntryAppointments', 'ajax', {
            url: serverUrl + '/application/getAppBriefListS.jsonp?status=3',
            dataType: 'jsonp',
            type: 'GET'
        });


        //getWorkingAppointments by getAppBriefListS
        amplify.request.define('getWorkingAppointments', 'ajax', {
            url: serverUrl + '/application/getAppBriefListS.jsonp?status=4',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getAppHead
        amplify.request.define('getAppHead', 'ajax', {
            url: serverUrl + '/application/getAppHead.jsonp?key={key}&appId={appId}',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getAppItemList
        amplify.request.define('getAppItemList', 'ajax', {
            url: serverUrl + '/application/getAppItemList.jsonp?key={key}&appId={appId}',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getAppHeadAdm
        amplify.request.define('getAppHeadAdm', 'ajax', {
            url: serverUrl + '/application/getAppHeadAdm.jsonp?appId={appId}',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getAppItemListAdm
        amplify.request.define('getAppItemListAdm', 'ajax', {
            url: serverUrl + '/application/getAppItemListAdm.jsonp?appId={appId}',
            dataType: 'jsonp',
            type: 'GET'
        });

        //getAppTimeline
        amplify.request.define('getAppTimeline', 'ajax', {
            url: serverUrl + '/location/getAppTimeline.jsonp?appId={appId}',
            dataType: 'jsonp',
            type: 'GET'
        });

        //execApp
        amplify.request.define('execApp', 'ajax', {
            url: serverUrl + '/application/execApp',
            type: 'POST',
            crossDomain: true
        });

        //newApp
        amplify.request.define('newApp', 'ajax', {
            type: 'POST',
            url: serverUrl + '/application/newApp',
            crossDomain: true
        });

        //addAppTimeline
        amplify.request.define('addAppTimeline', 'ajax', {
            type: 'POST',
            url: serverUrl + '/location/addAppTimeline',
            crossDomain: true
        });

        //sendLocation
        amplify.request.define('sendLocation', 'ajax', {
            type: 'POST',
            url: serverUrl + '/location/sender',
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

    getAllAppointments = function (option) {
        return defferedRequest('getAllAppointments', option)
    };

    getAppointmentByMobile = function (option) {
        return defferedRequest('getAppointmentByMobile', option)
    };

    getAllShortParkingAppointments = function (option) {
        return defferedRequest('getAllShortParkingAppointments', option)
    };

    getAllShortParkingAppointmentsForBoard = function (option) {
        return defferedRequest('getAllShortParkingAppointmentsForBoard', option)
    };

    getNotStartedAppointments = function (option) {
        return defferedRequest('getNotStartedAppointments', option)
    };

    getOnWayAppointments = function (option) {
        return defferedRequest('getOnWayAppointments', option)
    };

    getAlreadyArrivedAppointments = function (option) {
        return defferedRequest('getAlreadyArrivedAppointments', option)
    };

    getAlreadyEntryAppointments = function (option) {
        return defferedRequest('getAlreadyEntryAppointments', option)
    };

    getWorkingAppointments = function (option) {
        return defferedRequest('getWorkingAppointments', option)
    };

    getAppointmentHead = function (option) {
        return defferedRequest('getAppHead', option)
    };

    getAppointmentDeliveryItems = function (option) {
        return defferedRequest('getAppItemList', option)
    };

    getAppointmentHeadForAdmin = function (option) {
        return defferedRequest('getAppHeadAdm', option)
    };

    getAppTimeline = function (option) {
        return defferedRequest('getAppTimeline', option)
    };

    getAppointmentDeliveryItemsForAdmin = function (option) {
        return defferedRequest('getAppItemListAdm', option)
    };

    excuteAppointment = function (option) {
        return defferedRequest('execApp', option)
    };

    createNewAppointment = function (option) {
        return defferedRequest('newApp', option)
    };

    addAppTimeline = function (option) {
        return defferedRequest('addAppTimeline', option)
    };

    sendLocation = function (option) {
        return defferedRequest('sendLocation', option)
    };
    init();

    //public methods
    return {
        getAllAppointments: getAllAppointments,
        getAppointmentByMobile: getAppointmentByMobile,
        getAllShortParkingAppointments: getAllShortParkingAppointments,
        getAllShortParkingAppointmentsForBoard: getAllShortParkingAppointmentsForBoard,
        getNotStartedAppointments: getNotStartedAppointments,
        getOnWayAppointments: getOnWayAppointments,
        getAlreadyArrivedAppointments: getAlreadyArrivedAppointments,
        getAlreadyEntryAppointments: getAlreadyEntryAppointments,
        getWorkingAppointments: getWorkingAppointments,
        getAppointmentHead: getAppointmentHead,
        getAppointmentDeliveryItems: getAppointmentDeliveryItems,
        getAppointmentHeadForAdmin: getAppointmentHeadForAdmin,
        getAppointmentDeliveryItemsForAdmin: getAppointmentDeliveryItemsForAdmin,
        excuteAppointment: excuteAppointment,
        createNewAppointment: createNewAppointment,
        addAppTimeline: addAppTimeline,
        getAppTimeline: getAppTimeline,
        sendLocation:sendLocation
    }
}(jQuery, amplify));


