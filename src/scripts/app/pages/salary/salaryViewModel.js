(function (eim, $, ko, moment) {
    eim.ViewModels = eim.ViewModels || {};
    //登录页面viewmodel
    eim.ViewModels.SalaryViewModel = function () {
		var self = this;
		window.detail = this;
		self.salaryExportUrl = ko.observable();
	    self.salaryEnquiryUrl = ko.observable();
		self.salaryAllocationUrl = ko.observable();
		self.salarySummaryUrl = ko.observable();
	
		function base64url(source) {
		  // Encode in classical base64
		  encodedSource = CryptoJS.enc.Base64.stringify(source);
		  
		  // Remove padding equal characters
		  encodedSource = encodedSource.replace(/=+$/, '');
		  
		  // Replace characters according to base64url specifications
		  encodedSource = encodedSource.replace(/\+/g, '-');
		  encodedSource = encodedSource.replace(/\//g, '_');
		  
		  return encodedSource;
		}
			
		var header = {
		  "alg": "HS256",
		  "typ": "JWT"
		};
		var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
		var encodedHeader = base64url(stringifiedHeader);
		var METABASE_SITE_URL = eim.config.metabaseSite;
		var secret = eim.config.metabaseKey;

		//薪资基础信息导出
		var exportBody = {resource: { question: eim.config.salaryExportQuestionId },params: {"requireEntity": self.user.salaryEntities.toString()}};
		var exportEncodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(exportBody)));
		var exportJwt = encodedHeader + "." + exportEncodedData + "." + base64url(CryptoJS.HmacSHA256((encodedHeader + "." + exportEncodedData) , secret))
		var exportIframeUrl = METABASE_SITE_URL + "embed/question/" + exportJwt + "#bordered=true&titled=true";
		self.salaryExportUrl(exportIframeUrl);
		
		//个人薪资查询
		var enquiryBody = {resource: { question: eim.config.salaryEnquiryQuestionId },params: {"requireEntity": self.user.salaryEntities.toString()}};
		var enquiryEncodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(enquiryBody)));
		var enquiryJwt = encodedHeader + "." + enquiryEncodedData + "." + base64url(CryptoJS.HmacSHA256((encodedHeader + "." + enquiryEncodedData) , secret))
		var enquiryIframeUrl = METABASE_SITE_URL + "embed/question/" + enquiryJwt + "#bordered=true&titled=true";
		self.salaryEnquiryUrl(enquiryIframeUrl);
		
		//薪资分摊查询
		var allocationBody = {resource: { question: eim.config.salaryAllocationQuestionId },params: {"requireEntity": self.user.salaryEntities.toString()}};
		var allocationEncodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(allocationBody)));
		var allocationJwt = encodedHeader + "." + allocationEncodedData + "." + base64url(CryptoJS.HmacSHA256((encodedHeader + "." + allocationEncodedData) , secret))
		var allocationIframeUrl = METABASE_SITE_URL + "embed/question/" + allocationJwt + "#bordered=true&titled=true";
		self.salaryAllocationUrl(allocationIframeUrl);

		//薪资汇总查询
		var summaryBody = {resource: { question: eim.config.salarySummaryQuestionId },params: {"requireEntity": self.user.salaryEntities.toString()}};
		var summaryEncodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(summaryBody)));
		var summaryJwt = encodedHeader + "." + summaryEncodedData + "." + base64url(CryptoJS.HmacSHA256((encodedHeader + "." + summaryEncodedData) , secret))
		var summaryIframeUrl = METABASE_SITE_URL + "embed/question/" + summaryJwt + "#bordered=true&titled=true";
		self.salarySummaryUrl(summaryIframeUrl);


		
		this.save = function(){
			
			var formData = new FormData();
			var files = $("#fileUpload").get(0).files;
			formData.append("file", files[0]);
			
			var showError = function (result) {
                self.pop("error", {
                    "title": "薪资",
                    "detail": "失败" + " " + (result && result.errorMessage || ""),
                    "code": "错误代码：" + result.status + " " + result.responseText 
                });
                self.loading(false);
console.log(result)
            }

            var showSuccess = function (result) {
                var obj = {
                    "title": "薪资",
                    "detail": "薪资上传成功",
                };
                obj.callback = function () {
                    location.href = "salary.html";
                }
                self.pop("success", obj);


                self.loading(false);
            }

			eim.util.uploadWithBearer(eim.config.hrUrl + "v1/excel/salary", formData).then(function (result) {
				showSuccess(result);
			}, showError);

		
		}
		

    };

    eim.ViewModels.SalaryViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {}, jQuery, ko, moment);