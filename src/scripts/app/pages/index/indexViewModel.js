(function (eim, $, ko) {
    eim.ViewModels = eim.ViewModels || {};
    eim.ViewModels.IndexViewModel = function () {
        var self = this;
        self.init = function () {
			if(Array.isArray(self.user.salaryEntities) && self.user.salaryEntities.length === 0){
				$("#salarydiv").remove();
			}

        };
    };

    eim.ViewModels.IndexViewModel.extend(eim.ViewModels.BaseViewModel);
})(window.eim = window.eim || {}, jQuery, ko);