
(function (eim) {
    eim.config = {
        oAuth2Keys: [
            "EJ3JRSfhv2O373fSs_hia8yHUCoa",
            "lKkgtz8DrwBxb33Sei32rjGd_NEa"
        ],
        oAuth2Url: "https://is.eorionsolution.com/oauth2/",
        serviceUrl: "https://bpms.eorionsolution.com/bpms-rest/service/",
        hrUrl: "https://commonservices.eorionsolution.com/neo-hr-api/",
        pageSize: 15,
        //登陆有效期，默认30分钟
        activeTime: 15,
        loginUsers: [{
            userId: "100000",
            entities: ["DB003", "DB004","EORION"],
			salaryEntities:[]
        }, {
            userId: "100010",
            entities:["EORION","CRS01","CRS02","DB001","DB002","DB003","DB004","DB005","DB006","DB007","DB008","DB009","DB010","DB012","DB013","DB014","DB016","ER001","ER002","ER003","ER004","ER005","ER006","ER008","ER009","ER010","ER011","ER014","ER015","ER016","FR001","ST001","TZ001","TZ00101","TZ00102","TZ002","TZ00201","TZ00202","TZ00203","TZ003","TZ004","TZ005","TZ006","W001","DB0031"],
			salaryEntities:["EORION","CRS01","CRS02","DB001","DB002","DB003","DB004","DB005","DB006","DB007","DB008","DB009","DB010","DB012","DB013","DB014","DB016","ER001","ER002","ER003","ER004","ER005","ER006","ER008","ER009","ER010","ER011","ER014","ER015","ER016","FR001","ST001","TZ001","TZ00101","TZ00102","TZ002","TZ00201","TZ00202","TZ00203","TZ003","TZ004","TZ005","TZ006","W001","DB0031"]
	    },{
            userId: "100011",
            entities: ["DB003", "DB004","ER002","ER003","EORION","ER010","ER011"],
			salaryEntities:[]
        },{
			userId:"dptest1",
			entities:["CRS01","CRS02","DB001","DB002","DB003","DB004","DB005","DB006","DB007","DB008","DB009","DB010","DB012","DB013","DB014","DB016","ER001","ER002","ER003","ER004","ER005","ER006","ER008","ER009","ER010","ER011","ER014","ER015","ER016","FR001","ST001","TZ001","TZ00101","TZ00102","TZ002","TZ00201","TZ00202","TZ00203","TZ003","TZ004","TZ005","TZ006","W001","DB0031"],
			salaryEntities:[]
		}
	],
        autoDataSource: {
            project: "project",
            corpSn: "department",
            depSn: "department",
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
        metabaseKey: "8322aa8500b6ae07df7590b25d1bff56cb5e631dc829704c15cb66e80fed9f50",
		changeCorpHiQuestionId: 39,//流程历史变更流程
		salaryExportQuestionId: 50,//薪资基本信息导出
		salaryEnquiryQuestionId: 51,//个人薪资查询
		salaryAllocationQuestionId: 47,//薪资分摊查询
		salarySummaryQuestionId: 48,//薪资汇总查询
    };
})(window.eim = window.eim || {});
