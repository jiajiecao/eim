/// <reference path="../../lib/knockout.debug-3.0.0.js" />
(function (IMS, $, undefined) {
    IMS.TodaysBoardViewModel = function () {
        
        var self = this;
        var centerPosition = new google.maps.LatLng(30.8793497, 121.8126685),
        markerOrangeImage = {
            url: 'http://ditu.google.cn/mapfiles/marker_orange.png',
            // This marker is 20 pixels wide by 32 pixels tall.
            size: new google.maps.Size(20, 32),
            // The origin for this image is 0,0.-
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at 0,32.
            anchor: new google.maps.Point(0, 32)
        },
        buildInforWindowContent = function (lat, lng, mobile, bearing, speed, timeStamp) {
            if (mobile === undefined && bearing === undefined && speed === undefined && timeStamp === undefined) return null;
            var contentString = '<div id="content">' +
                                  '<div id="siteNotice">' +
                                  '</div>' +
                                  '<div id="bodyContent">' +
                                  '<p><i class="fa fa-qrcode"></i>最新位置: ' + lat + ',' + lng + '</p>' +
                                  '<p>时间: ' + timeStamp + '</p>' +
                                  '<p>速度: ' + speed + '; 方向: ' + bearing + '</p>' +
                                  '<p>手机: ' + mobile + '</p>' +
                                  '</div>' +
                                  '</div>';
            return contentString;
        },
        buildDefaultMarkers = function (records) {
            var markers = [];
            ko.utils.arrayForEach(records, function (item) {
                var marker = {};
                marker.latitude = item.latLng.lat();
                marker.longitude = item.latLng.lng();
                marker.infoWindowContent = item.contentString;
                marker.icon = markerOrangeImage;
                markers.push(marker);
            });
            return markers;
        },
         buildMarker = function (record) {
             var marker = {};
             marker.latitude = record.latG;
             marker.longitude = record.lngG;
             marker.infoWindowContent = buildInforWindowContent(record.latG, record.lngG, record.mobile, record.bearing, record.speed, record.timestamp);
             return marker;
         };

        self.allAppointmentMap = {
            center: ko.observable(centerPosition),
            markers: ko.observableArray(),
            zoom: ko.observable(9),
            polylinePoints: ko.observableArray()
        };

        self.allShortParkingAppointmentBriefItems = ko.observableArray();


        var date = new Date();
        var today = moment(date).format("YYYY-MM-DD");
        self.searchDate = ko.observable(today);
        self.startTime = ko.observable('08:00:00');
        self.endTime = ko.observable('20:00:00');
        self.selectedAppointmentMap = {
            center: ko.observable(centerPosition),
            markers: ko.observableArray(),
            zoom: ko.observable(9),
            polylinePoints: ko.observableArray()
        };
        var defaultMarkersOfTopMap = [
               { latLng: new google.maps.LatLng(31.1388397, 121.7686836), contentString: '站点: 华飞工业园' },
               { latLng: new google.maps.LatLng(30.8793497, 121.8126685), contentString: '站点: 上海汽车5号门' },
               { latLng: new google.maps.LatLng(31.309008, 121.674382), contentString: '站点: 上海利道国际物流有限公司' },
               { latLng: new google.maps.LatLng(31.12853339999999, 121.6287952), contentString: '站点: 苗桥路460号' }
        ];
        var defaultMarkers = buildDefaultMarkers(defaultMarkersOfTopMap);
        self.init = function () {
            //bind the default markers for top map


            ko.utils.arrayForEach(defaultMarkers, function (maker) {
                self.allAppointmentMap.markers.push(maker);
                self.selectedAppointmentMap.markers.push(maker);
            });

            //load markers for the top map 
            IMS.datacontext.location.getLastLocGeoAllForBoard().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (record) {
                        var oneMarker = buildMarker(record);
                        self.allAppointmentMap.markers.push(oneMarker);
                    })
                }
            });

            //bind the short parking appointment lists
            IMS.datacontext.appointment.getAllShortParkingAppointmentsForBoard().then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    ko.utils.arrayForEach(result, function (item) {
                        item.driverName = decodeURI(item.driverName);
                        item.vehicleType = decodeURI(item.vehicleType);
                        item.vehicleLicense = decodeURI(item.vehicleLicense);
                    })
                    self.allShortParkingAppointmentBriefItems(result)
                }
            });
        };

        self.itemClick = function (item) {
            var options = { appId: item.applicationId };
            IMS.datacontext.location.getLastLocGeo(options).then(function (record) {
                var oneMarker = buildMarker(record);
                self.selectedAppointmentMap.markers.removeAll();
                self.selectedAppointmentMap.markers.push(oneMarker);
                ko.utils.arrayForEach(defaultMarkers, function (maker) {
                    self.selectedAppointmentMap.markers.push(maker);
                });
            });

            //binding the polyline
            var startTimeStamp = self.searchDate() + " " + self.startTime() + ":00";
            var endTimeStamp = self.searchDate() + " " + self.endTime() + ":00";
            options = { appId: item.applicationId, mobile: item.mobile, startTS: startTimeStamp, endTS: endTimeStamp };
            IMS.datacontext.location.getLocGeoAll(options).then(function (result) {
                var points = [];
                ko.utils.arrayForEach(result, function (oneRecord) {
                    var point = new google.maps.LatLng(oneRecord.latG, oneRecord.lngG);
                    points.push(point);
                })
                self.selectedAppointmentMap.polylinePoints(points);
            });
			$("#popupmap").popup("open");
        };
    
    };
    return IMS.TodaysBoardViewModel;
})(window.IMS = window.IMS || {}, jQuery);
