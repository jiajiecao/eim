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
        activeTime: 15,
        loginUsers: [{
            userId: "100000",
            entities: ["DB003", "DB004"]
        }, {
            userId: "100010",
            entities: ["DB003", "DB004"]
        }],
        autoDataSource: {
            costCenter: "costCenter",
            employee: "employee",
            manager: "employee",
            costCenterManager: "employee",
            departmentManager: "employee",
            department: "department",
            deleagatee: "employee",
            searchDepSn: "department",
            searchCorpSn: "department"
        },
        metabaseSite: "https://metabase.eorionsolution.com/",
        metabaseKey: "652af32880df5748cbf37bd6273d8bfe444e76e551012ca323afa69e1f1b41ab"
    };
})(window.eim = window.eim || {});