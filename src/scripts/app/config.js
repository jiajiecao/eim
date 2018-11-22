(function (eim) {
    eim.config = {
        oAuth2Keys: [
            "rssmvGW23R7vFsmASOgXRJQMk3Ea",//user name for base64 encoding
            "QWWRNdHNo3uK1ABWRQ_w9sXcBg0a"//password for base64 encoding
        ],
        oAuth2Url: "https://is.eorionsolution.com/oauth2/",
        serviceUrl: "https://bpmswx.eorionsolution.com/bpms-rest/service/",
        hrUrl: "https://bpmswx.eorionsolution.com/hr-dp-api/v1/",
        pageSize: 15,
        //登陆有效期，默认30分钟
        activeTime: 30,
    };
})(window.eim = window.eim || {});