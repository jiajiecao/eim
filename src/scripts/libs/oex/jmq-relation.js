ko.bindingHandlers[getBindingName("relation")] = (function () {
    return {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var modelValue = valueAccessor();

            var root = ko.contextFor(element).$root;
            if (!$("#relationItem").length) {
                var template = "<script type=\"text/html\" id=\"relationItem\">" +
                    "<li data-icon=\"check\" class=\"ui-li-has-count\">" +
                    "<a href=\"javascript:void(0)\"  data-bind=\"click:$parent.select.bind($parent)\"  " +
                    "class=\"ui-btn ui-btn-icon-right ui-icon-check\">" +
                    "<span data-bind=\"text:$data[$parent.nameField]\"></span>" +
                    "<span class=\"ui-li-count ui-body-inherit\" data-bind=\"text:$data[$parent.keyField]\"></span>" +
                    "</a>" +
                    "</li>" +
                    "</script>";
                $("body").append(template);
            }


            var showList = function (items) {
                var template = "<div data-role=\"popup\" data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:340px; top:-150px; background-image:url(../../images/tweets-bg.jpg)\">" +
                    "<div data-role=\"content\" style=\"padding: 4px 4px;\">" +
                    "<p align=\"center\" style=\"margin:8px 8px;\"><font color=\"#0097a7\"><i class=\"far fa-2x fa-user\"></i></font></p>" +
                    "<div  style=\"max-height:360px; overflow: scroll; \" >" +
                    "<div id=\"popRelation\">" +
					"<form style=\"margin:16px 0;\" onsubmit=\"return false;\">"+
						"<div class=\"ui-input-text ui-body-b ui-corner-all ui-shadow-inset\">"+
							"<input data-type=\"search\" data-theme=\"b\" id=\"autocomplete-input\"  placeholder=\"快速过滤...\" style=\"font-weight:300; height:39px; font-size:medium;\">"+
						"</div>"+
					"</form>"+
					
                    "<ul data-role=\"listview\" data-theme=\"b\" data-filter=\"true\" data-input=\"#autocomplete-input\" " +
                    "data-bind=\"jqmTemplate: { name: 'relationItem', foreach:items}, jqmRefreshList:items\" " +
                    " style=\"margin: 2px 2px;\"> " +
                    "</ul> " +

                    "</div>" +
                    "</div>" +
                    "<div class=\"ui-grid-a\">" +
                    "<div class=\"ui-block-a\"><a href=\"javascript:void(0);\" data-bind=\"click:confirm\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b ui-btn-icon-left ui-icon-check\"  style=\"background-color: #0097a7; color:#fff; text-shadow: 0 1px 0 #616161; margin-left:2px\">确认</a></div>" +
                    "<div class=\"ui-block-b\"><a href=\"javascript:void(0);\" data-bind=\"click:close\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b ui-btn-icon-left ui-icon-delete\"  style=\"margin-right:2px;\">取消</a></div>" +
                    "</div>" +
                    "</div>" +
                    "</div>";

                var popElement = $(template);

                var binding = {
                    close: function () {
                        $.mobile.popup.active.close();
                        if (popElement) {
                            popElement.remove();
                        }
                    },
                    items: ko.observableArray(items),
                    selected: ko.observable(modelValue()),
                    select: function (item, oEvent) {
                        var sn = ko.unwrap(this.selected) && ko.unwrap(this.selected)[this.keyField];
                        var itemSn = item[this.keyField];
                        var row = $(oEvent.target).closest("a");
                        var value = sn === itemSn ? null : item;
                        this.selected(value);
                        setTimeout(function () {
                            row.closest("ul").find("a").removeClass("ui-btn-active");
                            if (value) {
                                row.addClass("ui-btn-active");
                            }
                        }, 0);
                        oEvent.preventDefault();
                        return false;
                    },
                    keyField: "sn",
                    nameField: "name",

                    confirm: function () {
                        modelValue(this.selected());
                        this.close();
                    }
                };
                root.loading(false);

                popElement.popup().popup("open");
                ko.applyBindings(binding, popElement[0]);

                var item = binding.items().filter(function (i) {
                    return binding.selected() && binding.selected()[binding.keyField] == i[binding.keyField];
                })[0];
                var index = binding.items.indexOf(item);
                if (index >= 0) {
                    popElement.find("ul").find("a").eq(index).addClass("ui-btn-active");
                }

            };
            var handler = function (e) {
                root.loading(true);
                BPMS.Services.getSuggestion(root.user.userId, BPMS.config.relationDataSource).then(showList, function (result) {
                    root.loading(false);
                    root.pop("error", {
                        "title": "获取数据失败",
                        "detail": "由于数据源无效，无法获取数据，请检查配置。",
                        "code": "错误代码：" + result.status + " " + result.statusText
                    });
                });


                // /modelValue(newValue);
            };
            $(element).on("click", handler);
        },
        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);
            if (value) {
                $element.val(value.name);
                $element.prev().html(value.name);

            } else {
                $element.prev().html("&nbsp;");
                $element.val("");
            }

        }
    };
})();