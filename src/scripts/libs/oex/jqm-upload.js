// note: this does not rely on knockout's upload binding
ko.bindingHandlers[getBindingName("upload")] = (function () {


    return {
        //after: ["attr", "value"],
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $root = bindingContext.$root;
            var modelValue = valueAccessor();
            var $element = $(element);
            var fnInvalid = allBindings() && allBindings().invalid;
            if (modelValue() === null) {
                modelValue("[]");
            }
            var controlType = $element.attr("control-type");
            var $form = $element.closest("form");
            $form.attr("action", BPMS.config.attachmentUrl + "upload");
            $form.attr("enctype", "multipart/form-data");
            $form.attr("method", "post");
            if (!$("#uploadItemTemplate").length) {
                var template = "<script type=\"text/html\" id=\"uploadItemTemplate\">" +
                    "<li data-icon=\"delete\">" +
                    "<a href=\"javascript:void(0);\" data-bind=\"click:$parent.removeAttachment\">" +
                    "<i class=\"fa fa-file-pdf-o\"></i><span data-bind=\"text:('&nbsp;'+name)\"></span>" +
                    "<p style=\"margin-bottom:0px;\"><font color=\"gray\" data-bind=\"text:size\"></font></p>" +
                    "</a>" +
                    "</li>" +
                    "</script>";
                $("body").append(template);

            }
            viewModel.selectFile = function () {
                var value = $($element).val();
                this.canAddAttachment(!!value);
            };
            viewModel.removeAttachment = function ($data) {
                viewModel.attachments.remove($data);
                var value = JSON.stringify(viewModel.attachments());
                modelValue(value);
            };
            viewModel.addAttachment = function () {

                if (!this.canAddAttachment()) {
                    return false;
                }
                $root.loading(true);
                $form.ajaxSubmit({
                    "success": function (data) {
                        $root.loading(false);
                        viewModel.attachments.push(data);
                        viewModel.canAddAttachment(false);
                        $element.val("");

                        var value = JSON.stringify(viewModel.attachments());
                        modelValue(value);
                    },
                    "error": function (err) {
                        var code = "";
                        if (err && err.status && err.statusText)
                            code = "错误代码：" + err.status + " " + err.statusText;
                        $root.pop("error", {
                            "title": "上传附件失败",
                            "description": "",
                            "detail": "该请求无法成功处理，请稍后重试。",
                            "code": code
                        });
                        $root.loading(false);
                    }
                });
            };
            viewModel.canAddAttachment = ko.observable(false);
            viewModel.attachments = ko.observableArray([]);
            ko.applyBindingsToNode(element, { event: { change: viewModel.selectFile } }, bindingContext);



        },

        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);
            var fnInvalid = allBindings() && allBindings().invalid;


        }
    };
})();