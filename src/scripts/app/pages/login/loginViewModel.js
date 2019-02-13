(function (eim, $, ko) {

    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.LoginViewModel = function () {
        var self = this;
        window.vm = self;
        self.userName = ko.observable();
        self.password = ko.observable();
        self.message = ko.observable("");
        self.errorCode = ko.observable("");

        self.keyDownHandler = function (e) {
            var ev = document.all ? window.event : e;
            var element = $(document.activeElement);
            if (ev.keyCode === 13 && element.attr("name") === "password") {
                // self.userName($("#userName").val());
                self.password(element.val());
                element.closest(".jqm-block-content").find("button[type='submit']").first().click();
            }
        };
        self.init=function(){
            self.userName(null);
            self.password(null);
        };
        self.login = function () {
            var userName = self.userName();
            var password = self.password();
            var stopLogin = false;
            ["userName", "password"].forEach(
                function (key) {
                    var text = self[key]();
                    var invalid = !text;
                    var $e = $("[name='" + key + "']").parent();
                    if (invalid) {
                        $e.addClass("ui-invalid");
                    }
                    else {
                        $e.removeClass("ui-invalid");
                    }
                    stopLogin = stopLogin || invalid;
                }
            );
            if (stopLogin) {
                self.message(self.uid ? "请输入有效的密码" : "请输入有效的用户名和密码");
                $("#popupInvalid").popup("open");
                return;
            }
            var loader = $.mobile.loading();
            loader.show();
            var userNameType = eim.config.userNameType || 1;
            if (userNameType === 2) {
                userName = userName.toLowerCase();
            } else if (userNameType === 3) {
                userName = userName.toUpperCase();
            }
            eim.service.login(userName, password)
                .then(function (data) {
                    loader.hide();
                    var target = eim.util.getUrlParam(window.location.href, "target") || "index.html";
                    window.location.replace(target);
                }, function (err) {

                    var message = eim.service.loginError ? "您输入的登陆信息不正确" : "网络异常";
                    self.message(message);
                    if (err && err.status && err.statusText) {
                        self.errorCode("错误代码：" + err.status + " " + err.statusText);
                    }
                    $("#popupMessage").popup("open");
                    loader.hide();

                });
        };
    };

})(window.eim = window.eim || {}, jQuery, ko);