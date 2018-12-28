// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("auto")] = (function () {

    return {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            console.log(viewModel);
            if (!$("#autoRow").length) {
                var template = "<script type=\"text/html\" id=\"autoRow\">" +
                    "<li data-icon=\"check\" class=\"ui-li-has-count ui-first-child ui-last-child\">" +
                    "<a href=\"javascript:void(0)\" " +
                    "class=\"ui-btn ui-btn-icon-right ui-icon-check\">" +
                    "<span data-bind=\"text:$data[$parent.nameField]\"></span>" +
                    "<span class=\"ui-li-count ui-body-inherit\" data-bind=\"text:$data[$parent.keyField]\"></span>" +
                    "</a>" +
                    "</li>" +
                    "</script>";
                $("body").append(template);
            }
            var root = ko.contextFor(element).$root;
            var modelValue = valueAccessor();
            var $element = $(element);
            console.log(element);
            var dataSource = null;
            for (var i in eim.config.autoDataSource) {
                if ($element.attr("id").toLowerCase().indexOf(i.toLowerCase()) >= 0) {
                    dataSource = eim.config.autoDataSource[i];
                }
            }
            viewModel.keyField = "id";
            viewModel.nameField = "name";

            var fnInvalid = allBindings() && allBindings().invalid;

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

            var items = ko.observableArray();
            var container = $element.closest("form");

            var ul = container.find("ul")[0];
            // $element.removeAttr("data-bind");

            var childBindingContext = bindingContext.createChildContext(
                bindingContext.$rawData,
                null, // Optionally, pass a string here as an alias for the data item in descendant contexts
                function (context) {
                    ko.utils.extend(context, valueAccessor());
                });
            var selectItem = function (model, $e) {
                console.log($);
                var tempItem = items()[$($e.target).index()];
                modelValue(tempItem);
                //item(tempItem && tempItem.name || "");
                items.removeAll();
            };
            ko.applyBindingsToNode(element,
                {
                    event: {
                        change: function () {
                            if (modelValue()) {
                                modelValue(null);
                            }
                        }
                    }
                }, childBindingContext);


            ko.applyBindingsToNode(ul, {
                click: selectItem,
                jqmTemplate: { name: 'autoRow', foreach: items }, jqmRefreshList: items
            }, childBindingContext);

            var _onKeyUp = function (event) {

                if (fnInvalid) {
                    fnInvalid(true);
                }

                modelValue(null);
                var text = $element.val().trim();
                //var me = eim.util.getUser().userId;
                if (text) {


                    eim.service.getSuggestion(dataSource, text).then(function (result) {
                        // items = result.filter(function(person) {
                        //     return person.sn !== me;
                        // });
                        items(result);
                    }, function (result) {

                        root.loading(false);

                        var message = "由于网络问题，无法获取数据，请稍后重试。";
                        if (result && result.responseJSON && result.responseJSON.cause) {
                            var cause = result.responseJSON.cause;
                            message = cause.substring(cause.indexOf(":") + 1).trim();
                        }
                        root.pop("error", {
                            "title": "获取列表失败",
                            "detail": message,
                            "code": "错误代码：" + result.status + " " + result.statusText
                        });
                    });
                } else {
                    items.removeAll();
                }
            };

            var _search = eim.util.debounce(_onKeyUp);

            $element.on("keydown", _onKeyDown)
                .on("keypress", _onKeyPress)
                .on("keyup", _search)
                //.on("change", _search)
                .on("input", _search);

            return {
                "controlsDescendantBindings": true
            };

        },

        update: function (element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var fnInvalid = allBindings() && allBindings().invalid;
            var newValue = modelValue() && modelValue().name || "";
            // allBindings().value(newValue);
            $(element).val(newValue);

            if (fnInvalid) {
                fnInvalid(!newValue);
            }


        }
    };
})();
