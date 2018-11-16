/// <reference path="../../lib/knockout.mapping-latest.debug.js" />
/// <reference path="../../lib/knockout-2.2.0.js" />
(function (IMS, $, ko, undefined) {
    IMS.AppointmentDetailViewModel = function () {
        var self = this;
        self.applicationId = ko.observable();

        self.crCode =
            /*function() {
             var qrcode = new QRCode(document.getElementById("qrcodearea"), {
             width : 320,
             height : 320
             });
             qrcode.makeCode(this.applicationId());
             };*/
            ko.computed(function () {
                //var codeLink = 'http://chart.apis.google.com/chart?cht=qr&chs=320x320&chl=' + this.applicationId() + '&choe=UTF-8&chld=L';
                //return codeLink;
                if (this.applicationId() && this.applicationId()!=null && this.applicationId()!= "")
                    $('#qrcodearea').qrcode({width: 320,height: 320 ,text: this.applicationId()});
                return "width:320px; height:320px; margin-top:15px;";
            }, self);

        self.applicationStatus = ko.observable();
        self.deliveryOrders = ko.observableArray();
        self.timelines = ko.observableArray();
        self.basicInformation = {
            driverName: ko.observable(),
            mobileNo: ko.observable(),
            vehicleLicenseNo: ko.observable(),
            vehicleType: ko.observable(),
            planedDevelieryDate: ko.observable(),
            planedEarliestDevelieryDate: ko.observable(),
            planedLatestDevelieryDate: ko.observable(),
        };


        var centerPosition = new google.maps.LatLng(30.8793497, 121.8126685),
         markerOrangeImage = {
             url: 'http://ditu.google.cn/mapfiles/marker_orange.png',
             // This marker is 20 pixels wide by 32 pixels tall.
             size: new google.maps.Size(20, 32),
             // The origin for this image is 0,0.
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
                                   '<p>最新位置: ' + lat + ',' + lng + '</p>' +
                                   '<p>时间: ' + timeStamp + '</p>' +
                                   '<p>速度: ' + speed + '; 方向: ' + bearing + '</p>' +
                                   '<p> 手机: ' + mobile + '</p>' +
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


        var defaultMarkersOfTopMap = [
             { latLng: new google.maps.LatLng(31.1388397, 121.7686836), contentString: '站点: 华飞工业园' },
             { latLng: new google.maps.LatLng(30.8793497, 121.8126685), contentString: '站点: 上海汽车5号门' },
             { latLng: new google.maps.LatLng(31.309008, 121.674382), contentString: '站点: 上海利道国际物流有限公司' },
             { latLng: new google.maps.LatLng(31.12853339999999, 121.6287952), contentString: '站点: 苗桥路460号' }
        ];
        var defaultMarkers = buildDefaultMarkers(defaultMarkersOfTopMap);

        self.selectedAppointmentMap = {
            center: ko.observable(centerPosition),
            markers: ko.observableArray(),
            zoom: ko.observable(8),
            polylinePoints: ko.observableArray()
        };

        self.init = function (orderItem) {
            //inital defatul markers
            ko.utils.arrayForEach(defaultMarkers, function (maker) {
                self.selectedAppointmentMap.markers.push(maker);
            });

            var option = { appId: orderItem.applicationId };

            //bind the appointment header
            IMS.datacontext.appointment.getAppointmentHeadForAdmin(option).then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    result.driverName = decodeURI(result.driverName);
                    result.vehicleType = decodeURI(result.vehicleType);
                    result.vehicleLicenseNo = decodeURI(result.vehicleLicenseNo);
                    ko.mapping.fromJS(result, {}, self.basicInformation);
                }

                self.applicationId(result.applicationId);
                self.applicationStatus(result.applicationStatus);
            });

            //bind the delivery items
            IMS.datacontext.appointment.getAppointmentDeliveryItemsForAdmin(option).then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    self.deliveryOrders(result);
                }
            });

            //bind the timelines
            IMS.datacontext.appointment.getAppTimeline(option).then(function (result) {
                if (result.errorMessage !== 'NO_DATA') {
                    self.timelines(result);
                }
            });

            IMS.datacontext.location.getLastLocGeo(option).then(function (record) {
                var oneMarker = buildMarker(record);
                self.selectedAppointmentMap.markers.removeAll();
                self.selectedAppointmentMap.markers.push(oneMarker);
                ko.utils.arrayForEach(defaultMarkers, function (maker) {
                    self.selectedAppointmentMap.markers.push(maker);
                });
            });

        };
    }
    return IMS.AppointmentDetailViewModel;
})(window.IMS = window.IMS || {}, jQuery, ko, undefined);