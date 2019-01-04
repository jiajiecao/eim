(function (eim) {

    eim.service = {
        login: function (userName, password) {

            var dfd = $.Deferred();
            var getUserInfo = function (accessToken) {
                var url = eim.config.oAuth2Url + "userinfo";
                var settings = {
                    dataType: "json",
                    url: url,
                    crossDomain: true,
                    headers: {
                        "Authorization": "Bearer " + accessToken
                    }
                };

                settings.url = url;
                settings.type = "GET";
                settings.data = {
                    "schema": "openid"
                };

                return $.ajax(settings);
            };
            var requestOAuth2 = function (userName, password) {
                var token = eim.util.getAuthToken(eim.config.oAuth2Keys[0], eim.config.oAuth2Keys[1]);
                var url = eim.config.oAuth2Url + "token";
                var settings = {
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: url,
                    crossDomain: true,
                    headers: {
                        "Authorization": token,
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    }
                };

                settings.url = url;
                settings.type = "POST";
                settings.data = {
                    "grant_type": "password",
                    "username": userName,
                    "password": password,
                    "scope": "openid email"
                };

                return $.ajax(settings);
            };
            eim.service.loginError = false;
            sessionStorage.removeItem("Bearer");
            sessionStorage.removeItem("bpms_user");
            sessionStorage.removeItem("bpms_token");
            var token = eim.util.getAuthToken(userName, password);
            requestOAuth2(userName, password).then(
                function (response) {
                    if (response && response.access_token)
                        sessionStorage.setItem("Bearer", JSON.stringify(response));
                    return getUserInfo(response.access_token);

                },
                function (response) {
                    if (response && response.responseText &&
                        (response.responseText.indexOf("Authentication failed") >= 0 ||
                            response.responseText.indexOf("Missing parameters") >= 0)) {
                        eim.service.loginError = true;
                    }
                    sessionStorage.removeItem("Bearer");
                    sessionStorage.removeItem("bpms_user");
                }
            ).then(function (user) {
                user.lastLogin = +moment();
                var userNameType = eim.config.userNameType || 1;
                if (userNameType === 2) {
                    userName = userName.toLowerCase();
                } else if (userNameType === 3) {
                    userName = userName.toUpperCase();
                }
                user.userId = userName;
                if (user.Roles) {
                    var roles = user.Roles.split(",").map(function (role) {
                        return role.replace(/(.*)\//, "");
                    });
                    user.Roles = roles.join(",");
                }
                sessionStorage.setItem("bpms_user", JSON.stringify(user));
                return eim.util.request("history/historic-activity-instances", {}, {
                    "token": token
                });
            }).then(function () {
                sessionStorage.setItem("bpms_token", token);
                dfd.resolve();
            }, function () {
                dfd.reject();
            });

            return dfd.promise();
        },
        getSuggestion: function (type, text) {
            return eim.util.requestWithBearer(eim.config.hrUrl + type + "/autoComplete/" + text);
        },
        getMasterDataList: function (type, param) {
            var url = eim.config.hrUrl + type;
            return eim.util.requestWithBearer(url, param);
        },
        getMasterDataDetail: function (type, id) {
            var url = eim.config.hrUrl + type + "/id/" + id;
            return eim.util.requestWithBearer(url);
        },
        postMasterDataDetail: function (type, o) {
            var url = eim.config.hrUrl + type;
            return eim.util.requestWithBearer(url, o, { type: "POST" });
        },
        putMasterDataDetail: function (type, o) {
            var url = eim.config.hrUrl + type;
            return eim.util.requestWithBearer(url, o, { type: "PUT" });
        },
        deleteMasterDataDetail: function (type, id) {
            var url = eim.config.hrUrl + type + "/delete" + type.substring(0, 1).toUpperCase() + type.substring(1) + "/" + id;
            return eim.util.requestWithBearer(url, {}, { type: "DELETE" });
        },


    };

})(window.eim = window.eim || {});

