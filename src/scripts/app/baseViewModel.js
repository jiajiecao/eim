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
        this.cancelPop = function () {
            var that = this;
            that.dialogCallback = null;
            that.closePop();
        };
        this.closePop = function () {
            var that = this;
            var result = that.dialogCallback && that.dialogCallback();
            if (result && result.then) {
                result.then(function () {
                    that.dialogCallback = null;
                    that.popTitle("");
                    that.popDescription("");
                    that.popDetail("");
                    that.popCode("");
                    var curr = that.currentPop;
                    curr.popup("close");
                    //curr.remove();
                });
            } else {
                if ($.mobile.popup && $.mobile.popup.active) {
                    $.mobile.popup.active.close();
                }
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
            sessionStorage.removeItem("bpms_user");
            location.href = "login.html";
        };
        this.loading = function (isLoading) {
            if (isLoading === false) {
                loader.hide();
            } else {
                loader.show();
            }
        };

        this.ensureLogin = function () {
            var that = this;
            that._dfd = $.Deferred();
            var valid = false;
            this.user = eim.util.getUser();
            that.origionalUser = this.user && this.user.userId;
            if (this.user && this.user.lastLogin) {
                var duration = +moment() - this.user.lastLogin;
                var activeDuration = eim.config.activeTime * 1000 * 60;
                if (duration < activeDuration) {
                    valid = true;
                }
            }
            if (valid) {
                //that.updateLastLogin();
                that._dfd.resolve();
            } else {
                that.timeoutKey = setTimeout(function () {
                    if (that.timeoutKey) {
                        clearTimeout(that.timeoutKey);
                    }
                    that.switchUserName(that.user.userId);
                    that.popLogin({});
                }, 0);
            }
            return that._dfd.promise();
        };

        this.updateLastLogin = function () {
            var user = eim.util.getUser();
            if (user) {
                user.lastLogin = +moment();
                sessionStorage.setItem("bpms_user", JSON.stringify(user));
            }
        };

        var dialogs = {
            "error": "<div data-role=\"popup\" data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:300px; max-width:300px; background-image:url(images/tweets-bg.jpg)\">" +
                "<div data-role=\"content\" style=\"padding: 4px 4px;\">" +
                "<p align=\"center\" style=\"margin:8px 8px;\"><font color=\"#C62828\"><i class=\"fas fa-2x fa-times\"></i></font></p>" +
                "<hr style=\"border-color: #C62828; margin-bottom: 0px; margin-top:11px;\">" +
                "<p align=\"left\" data-bind=\"visible:!!popTitle()\" style=\"padding: 0px 3px; margin-bottom: 3px;\">" +
                "<b data-bind=\"text:popTitle\"></b></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popDescription()\" style=\"padding: 0px 3px; margin-bottom: 24px;\">" +
                "<font color=\"#424242\" size=\"-1\" data-bind=\"text:popDescription\"></font></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popDetail()\" style=\"padding: 0px 3px; margin-bottom: 0px;\">" +
                "<font color=\"#9e9e9e\" size=\"-2\" data-bind=\"text:popDetail\"></font></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popCode()\" style=\"padding: 0px 3px; margin-bottom: 32px;\">" +
                "<font color=\"#9e9e9e\" size=\"-2\" data-bind=\"text:popCode\"></font></p>" +
                "<p style=\"padding: 0px 0px;\"> <a href=\"javascript:void(0);\" data-bind=\"click:closePop\" class=\"ui-btn  ui-corner-all ui-btn-b\" style=\"background-color: #424242; color:#fff; text-shadow: 0 1px 0 #111; margin: 0px 0px\">确认</a> </p>" +
                "</div>" +
                "</div>",
            "success": "<div data-role=\"popup\" data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:300px; max-width:300px; background-image:url(images/tweets-bg.jpg)\">" +
                "<div data-role=\"content\" style=\"padding: 4px 4px;\">" +
                "<p align=\"center\" style=\"margin:8px 8px;\"><font color=\"#4CAF50\"><i class=\"fas fa-2x fa-check\"></i></font></p>" +
                "<hr style=\"border-color: #4CAF50; margin-bottom: 0px; margin-top:11px;\">" +
                "<p align=\"left\"  data-bind=\"visible:!!popTitle()\"  style=\"padding: 0px 3px; margin-bottom: 0px;\">" +
                "<b data-bind=\"text:popTitle\"></b></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popDescription()\" style=\"padding: 0px 3px; margin-bottom: 24px;\">" +
                "<font color=\"#424242\" size=\"-1\" data-bind=\"text:popDescription\"></font></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popDetail()\" style=\"padding: 0px 3px; margin-bottom: 32px;\">" +
                "<font color=\"#757575\" size=\"-1\" data-bind=\"text:popDetail\"></font>" +
                "</p>" +
                "<p style=\"padding: 0px 0px;\"> <a  href=\"javascript:void(0);\" data-bind=\"click:closePop\"  class=\"ui-btn  ui-corner-all ui-btn-b\" style=\"background-color: #424242; color:#fff; text-shadow: 0 1px 0 #111; margin: 0px 0px\">确认</a> </p>" +
                "</div>" +
                "</div>",
            "login": "<div data-role=\"popup\" data-history=\"false\"   data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:300px; max-width:300px; background-image:url(../../images/tweets-bg.jpg)\"><a href=\"javascript:void(0)\" data-rel=\"back\" class=\"ui-btn ui-nodisc-icon ui-alt-icon ui-corner-all ui-shadow ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right\" data-bind=\"click:closePop\">Close</a>" +
                "<div data-role=\"content\" style=\"padding: 4px 4px;\">" +
                "<p align=\"center\" style=\"margin:8px 8px;\"><font color=\"#EC407A\"><i class=\"fas fa-3x fa-sign-in-alt\"></i></font><br>" +
                "<font size=\"-1\" color=\"gray\">身份验证</font></p>" +
                "<p align=\"center\" style=\"padding: 8px 8px; padding-bottom:0px;\">" +
                "<input type=\"text\" id=\"switchUserName\" name=\"switchUserName\" data-theme=\"b\" data-clear-btn=\"false\" data-bind=\"disable:true,value:switchUserName\"  placeholder=\"用户名\" >" +
                "<input type=\"password\"  id=\"switchPassword\" name=\"switchPassword\" data-theme=\"b\" data-clear-btn=\"true\"  data-bind=\"value:switchPassword,event:{keydown:keydownLogin}\"  placeholder=\"密码\">" +
                "</p>" +
                "<p align=\"center\" style=\"padding: 8px 8px; padding-bottom:0px;\">" +
                "<button type=\"submit\" id=\"btnReLogin\" data-bind=\"click:reLogin\"  class=\"ui-btn ui-corner-all ui-btn-b\" style=\"background-color:#424242; color:#fff; text-shadow: 0 1px 0 #111\">登录</button>" +
                "</p>" +
                "</div>" +
                "</div>",
            "confirm": "<div data-role=\"popup\" data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:300px; max-width:300px; background-image:url(../../images/tweets-bg.jpg)\">" +
                "<div data-role=\"content\" style=\"padding: 4px 4px;\">" +
                "<p align=\"center\" style=\"margin:8px 8px;\"><font color=\"#607D8B\"><i class=\"fa fa-2x fa-info-circle\"></i></font></p>" +
                "<hr style=\"border-color: #607D8B; margin-bottom: 0px; margin-top:11px;\">" +
                "<p align=\"left\" style=\"padding: 0px 3px; margin-bottom: 24px;\"> <b><font color=\"#9e9e9e\" data-bind=\"text:popTitle\"></font></b> </p>" +
                "<p data-bind=\"visible:!!popCode()\" align=\"left\" style=\"padding: 0px 3px; margin-bottom: 6px;\"> <span data-bind=\"text:popCode\"></span></p>" +
                "<p data-bind=\"visible:!!popDetail()\" align=\"left\" style=\"padding: 0px 3px; margin-bottom: 6px;\"> <span data-bind=\"html:popDetail\"></span></p>" +
                "<p data-bind=\"visible:!!popDescription()\" align=\"left\" style=\"padding: 0px 3px; margin-bottom: 16px;\"> <span  data-bind=\"text:popDescription\"></span></p>" +
                "<div class=\"ui-grid-a\">" +
                "<div class=\"ui-block-a\"><a href=\"javascript:void(0);\" data-bind=\"click:closePop\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b ui-btn-icon-left ui-icon-check\"  style=\"background-color: #4caf50; color:#fff; text-shadow: 0 1px 0 #616161; margin-left:2px\">确认</a></div>" +
                "<div class=\"ui-block-b\"><a href=\"javascript:void(0);\" data-bind=\"click:cancelPop\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b ui-btn-icon-left ui-icon-delete\"  style=\"margin-right:2px;\">取消</a></div>" +
                "</div>" +
                "</div>" +
                "</div>",
        };
        this.popTitle = ko.observable("");
        this.popDescription = ko.observable("");
        this.popDetail = ko.observable("");
        this.popCode = ko.observable("");
        this.switchUserName = ko.observable("");
        this.switchPassword = ko.observable("");
        this.switchUserNameInvalid = ko.observable(false);
        this.switchPasswordInvalid = ko.observable(false);
        this.popLogin = function (options) {
            var that = this;
            var type = "login";
            options = options || {};

            that.popType = type;
            var html = dialogs[type];
            that.currentPop = $(html);
            that.timeoutKey = setTimeout(function () {
                that.currentPop.popup();
                that.currentPop.popup("open");
                $("#switchUserName").textinput().textinput("refresh");
                $("#switchPassword").textinput().textinput("refresh");
                if (that.timeoutKey) {
                    clearTimeout(that.timeoutKey);
                }
                ko.applyBindings(that, that.currentPop[0]);
                that.currentPop.on("popupafterclose", function () {
                    if (typeof (that.loginCode) !== "undefined") {
                        if (that.currentPop) {
                            that.currentPop.remove();
                            that.currentPop = null;
                        }
                        that.pop("error", {
                            "title": "登陆失败",
                            "description": (eim.service.loginError ? "您输入的登陆信息不正确" : "网络异常"),
                            "detail": "请至登陆界面重新登陆",
                            "code": that.loginCode,
                            "callback": that.logout
                        });
                        //that.loginCode = undefined;
                    }

                });


            }, 0);

        };
        this.pop = function (type, options) {
            var that = this;
            options = options || {};

            that.popType = type;
            var html = dialogs[type];
            that.currentPop = $(html);
            var popParams = (options && options.positionTo ? {
                positionTo: options.positionTo
            } : null);

            that.currentPop.popup(popParams);
            that.dialogCallback = options.callback;

            var title = options && options.title || "";
            that.popTitle(title);
            var desc = options && options.description || "";
            that.popDescription(desc);
            var detail = options && options.detail || "";
            that.popDetail(detail);
            var code = options && options.code || "";
            that.popCode(code);
            ko.applyBindings(that, that.currentPop[0]);
            that.currentPop.popup("open");

        };

        this.delayPop = function (type, options) {
            var that = this;
            var targetPop = $("#pop" + type);
            if (targetPop.length) {
                if (options) {
                    targetPop = targetPop.popup(options);
                }
                targetPop.popup("open");
            } else {
                that.pop(type, options);
                targetPop = that.currentPop;
            }

            targetPop.on("popupafterclose", function () {
                setTimeout(function () {
                    if (that.delayObject && typeof (that.delayObject) === "object") {
                        that.pop(that.delayObject.type, that.delayObject);
                        that.delayObject = "";
                        return;
                    }
                    else if (that.delayObject && typeof (that.delayObject) === "string") {
                        $("#pop" + that.delayObject).popup("open");
                        that.delayObject = "";
                    }
                }, 500);
            });
        };
        this.triggerDelay = function (obj) {
            var that = this;
            that.delayObject = obj;
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
        };
        this.keydownLogin = function (viewModel, event) {
            var element = $(document.activeElement);
            if (event.keyCode === 13 && element.attr("id") === "switchPassword") {
                viewModel.switchUserName($("#switchUserName").val());
                viewModel.switchPassword($("#switchPassword").val());
                element.closest("div[data-role='content']").find("button[type='submit']").first().click();
                return false;
            }
            return true;
        };
        this.reLogin = function () {
            var that = this;
            var invalid = false;
            ["switchUserName", "switchPassword"].forEach(function (fieldName) {
                var fieldInvalid = !that[fieldName]();
                that[fieldName + "Invalid"](fieldInvalid);
                var tag = $("#" + fieldName).parent();
                if (fieldInvalid) {
                    invalid = true;
                    tag.addClass("ui-invalid");
                } else {
                    tag.removeClass("ui-invalid");
                }
            });
            if (invalid) {
                return;
            }
            that.loginCode = undefined;
            that.loading(true);
            var userName = that.switchUserName();
            var password = that.switchPassword();
            var userNameType = eim.config.userNameType || 1;
            if (userNameType == 2) {
                userName = userName.toLowerCase();
            } else if (userNameType == 3) {
                userName = userName.toUpperCase();
            }
            eim.service.login(userName, password)
                .then(function (data) {
                    that.currentPop.popup("close");
                    that.loading(false);
                    var user = eim.util.getUser();
                    var currentUser = user.userId;
                    if (that.origionalUser && that.origionalUser == currentUser) {
                        if (that._dfd) {
                            that._dfd.resolve();
                        }
                    } else {
                        window.location.href = "index.html";
                    }
                }, function (err) {
                    that.loading(false);
                    if (typeof (that.loginCode) !== "undefined") return;
                    if (that._dfd) {
                        that._dfd.reject();
                    }
                    var code = "";
                    if (err && err.status && err.statusText)
                        code = "错误代码：" + err.status + " " + err.statusText;
                    that.loginCode = code;
                    that.currentPop.popup("close");
                    //that.currentPop.remove();
                    //that.currentPop = null;
                });
        };

        // var user = sessionStorage.getItem("bpms_user");
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