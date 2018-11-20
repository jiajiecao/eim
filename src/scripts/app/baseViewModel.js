(function (eim) {
    Function.prototype.extend = function (Base) {
        this.prototype = new Base();
        this.prototype.constructor = Base;
    };
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.BaseViewModel = function () {
        var loader = $.mobile.loading();
        this.user = eim.util.getUser();
        this.popupInfo = {
            title: ko.observable(""),
            subTitle: ko.observable(""),
            message: ko.observable(""),
            code: ko.observable("")
        };

        this.fullText = ko.observable("");
        this.closePop = function () {
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
        };
        this.tab = ko.observable("");
        this.tab.subscribe(function (newType) {
            if (!newType) {
                return;
            }
            var target = $("#" + newType + "-tab");
            if (target.closest("li").hasClass("active")) {
                return;
            }
            target.click();
        }, null, "change");
        this.switchTab = function (vm, e) {
            var a = $(e.target).closest("a");
            var tempType = a.attr("id").replace("-tab", "");
            vm.tab(tempType);
        };

        this.show = function (info, isSuccess) {
            this.popupInfo.title(info.title || "");
            this.popupInfo.subTitle(info.subTitle || "");
            this.popupInfo.message(info.message || "");
            this.popupInfo.code(info.code || "");
            var id = (isSuccess || info.isSuccess) ? "popupSuccess" : "popupError";
            $("#" + id).popup("open");
        };
        this.showSuccess = function (info) {
            this.show(info, true);
        }

        this.logout = function () {
            sessionStorage.removeItem("Bearer");
            sessionStorage.removeItem("srm_user");
            location.href = "login.html";
        };
        this.loading = function (isLoading) {
            if (isLoading === false) {
                loader.hide();
            } else {
                loader.show();
            }
        };
        this.go = function (url) {
            location.href = url;
        };

        // var user = sessionStorage.getItem("srm_user");
        // if (!user) {
        //     var isInWeChat = eim.util.isWeChat();
        //     var url = isInWeChat ? "login_bridge.html" : "login.html";
        //     url += "?target=" + encodeURIComponent(location.href);
        //     window.location.href = url;
        //     return;
        // }

        // this.user = JSON.parse(user);
    };
})(window.eim = window.eim || {});