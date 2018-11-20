// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("id")] = (function () {

    return {
        init: function (element, valueAccessor, allBindings) {
            var index = 0;
            var modelValue = valueAccessor();
            var $element = $(element);
            var prevent = false;
            var fnInvalid = allBindings() && allBindings().invalid;
            var controlType = $element.attr("controlType");

            // Prevent form submission
            var _onKeyDown = function (event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    event.preventDefault();
                    this._preventKeyPress = true;
                }
            };

            // Prevent form submission
            var _onKeyPress = function (event) {
                if (this._preventKeyPress) {
                    event.preventDefault();
                    this._preventKeyPress = false;
                }
            };

            var items = [];
            var updateList = function () {
                var ul = $element.closest("form[data-bind]").find("ul");
                var lis = "";
                if (items.length) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var li = "<li data-icon=\"check\" class=\"ui-li-has-count ui-first-child ui-last-child\">" +
                            "<a href=\"javascript:void(0)\" " +
                            "class=\"ui-btn ui-btn-icon-right ui-icon-check\">" +
                            "<span>" + item.name + "</span>" +
                            "<span class=\"ui-li-count ui-body-inherit\">" + item.id + "</span>";
                        li += "</a></li>";
                        lis += li;
                    }
                    ul.html(lis);
                    ul.find("li").first().addClass("ui-first-child");
                    ul.find("li").last().addClass("ui-last-child");
                    ul.find("li").click(function (e) {
                        var li = $(e.target);
                        if (li[0].tagName.toLowerCase() !== "li") {
                            li = li.closest("li");
                        }
                        var name = li.find("span").eq(0).html();
                        var key = li.find("span").eq(1).html();
                        var selectedText = "";
                        var selectedValue = "";
                        selectedText = name;
                        selectedValue = key;
                        modelValue(selectedValue);
                        if (fnInvalid) {
                            fnInvalid(false);
                        }
                        $element.val(selectedText);
                        ul.html("");
                        ul.hide();
                    });
                    ul.show();
                } else {
                    ul.html("");
                    ul.hide();
                }
            };

            var _onKeyUp = function (event) {

                if (fnInvalid) {
                    fnInvalid(true);
                }

                modelValue(null);
                var text = $element.val().trim();

                if (text) {
                    var option = {
                        size: 5,
                        sort: "id",
                        order: "desc",
                        start: 0,
                        startableByUser: BPMS.util.getUser().userId,
                        suspended: false,
                        nameLike: "%" + text + "%"
                    };

                    BPMS.Services.getProcessDefinitions(option).then(function (result) {
                        items = result.data;
                        updateList();
                    }, function (result) {
                        if (!window.vm) {
                            return;
                        }

                        window.vm.loading(false);

                        var message = "由于网络问题，无法获取数据，请稍后重试。";
                        if (result && result.responseJSON && result.responseJSON.cause) {
                            var cause = result.responseJSON.cause;
                            message = cause.substring(cause.indexOf(":") + 1).trim();
                        }
                        window.vm.pop("error", {
                            "title": "获取列表失败",
                            "detail": message,
                            "code": "错误代码：" + result.status + " " + result.statusText
                        });
                    });
                } else {
                    items = [];
                    updateList();
                }
            };

            var _search = BPMS.util.debounce(_onKeyUp);

            $element.on("keydown", _onKeyDown)
                .on("keypress", _onKeyPress)
                .on("keyup", _search)
                //.on("change", _search)
                .on("input", _search);

        },
        update: function (element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var fnInvalid = allBindings() && allBindings().invalid;
            var newValue = modelValue();
            var $element = $(element);
            if (newValue) {
                $element.val(newValue);
                if (fnInvalid) {
                    fnInvalid(false);
                }
            }

        }
    };
})();