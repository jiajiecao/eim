ko.bindingHandlers.basicField = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        var controlHtml = {
            't1': '<input style="height:38px;"  control-type="t1" data-clear-btn="true" type="text"/>',
            't2': '<textarea rows="4" maxlength="200" style="overflow-y: scroll;" control-type="t2"></textarea>',
            't3': '<input style="height:38px;" control-type="t3" data-clear-btn="true" type="text"/>',
            //time
            't4': '<input style="height:38px;" control-type="t4" data-clear-btn="true" type="text"/>',
            //datetime
            't5': '<input style="height:38px;" control-type="t5" data-clear-btn="true" type="text"/>',
            //number
            't6': '<input style="height:38px;" control-type="t6" data-clear-btn="true" type="number"/>',
            //email
            't7': '<input style="height:38px;" control-type="t7" class="email" data-clear-btn="true" type="email"/>',
            //password
            't8': '<input style="height:38px;" control-type="t8" data-clear-btn="true" type="password"/>',
            //file
            't9': '<input style="height:38px;" control-type="t9" data-clear-btn="true" type="file"/>',
            't9i': '<input style="font-weight:600; height: 38px;  font-size:medium;" data-inline="true" control-type="t9i" data-clear-btn="true" type="file"/>' +
                '<input type="hidden" name="user" data-bind="value:$root.userId">' +
                '<input type="hidden" name="id" data-bind="value:$root.id">' +
                '<div class="ui-nodisc-icon ui-alt-icon" >' +
                '<p align="center"><a href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-inline" ' +
                ' data-bind="click:addAttachment,css: { \'ui-disabled\': !canAddAttachment()}"' +
                ' style="margin-right: 0px;">grid</a></p>' +
                '</div>' +
                '<ul data-role="listview" data-inset="true" style="margin-top:0px; padding: 3px 3px" ' +
                '  data-bind="jqmTemplate: { name: \'uploadItemTemplate\', foreach: attachments },jqmRefreshList: attachments" ' +
                ' class="ui-nodisc-icon ui-alt-icon">' +
                '</ul>',
            //tel
            't10': '<input style="height:38px;" control-type="t10" data-clear-btn="true" type="tel"/>',
            //money
            't11': '<input style="height:38px;" control-type="t11" data-clear-btn="true" type="text"/>',
            'cbv': '' +
                '<form>' +
                '<fieldset data-role="controlgroup">' +
                '</fieldset>' +
                '</form>',
            'cbh': '' +
                '<form>' +
                '<fieldset data-role="controlgroup" data-type="horizontal">' +
                '</fieldset>' +
                '</form>',
            'rbv': '' +
                '<form>' +
                '<fieldset data-role="controlgroup">' +
                '</fieldset>' +
                '</form>',
            'rbh': '' +
                '<form>' +
                '<fieldset data-role="controlgroup" data-type="horizontal">' +
                '</fieldset>' +
                '</form>',
            'sbs': '<select data-native-menu="false" data-overlay-theme="a"></select>',
            'sbm': '<select data-native-menu="false" data-overlay-theme="a" multiple="multiple" data-icon="grid" data-iconpos="left"></select>',
            'sbft': '<select data-native-menu="false" data-overlay-theme="a"></select>',
            'fs': '<fieldset>' +
                '<div data-role="fieldcontain">' +
                '<select data-role="flipswitch">' +
                '</select>' +
                '</div>' +
                '</fieldset>',
            "employee": '<form class="ui-filterable" autocomplete="off" onsubmit="function(){return false;}">' +
                '<input style="height:38px;" data-type="search">' +
                '</form>' +
                '<ul  data-role="listview" class="ui-nodisc-icon ui-alt-icon ui-listview ui-listview-inset ui-corner-all ui-shadow" ' +
                ' data-inset="true">' +
                '</ul>',
            "department": '<form class="ui-filterable" autocomplete="off" onsubmit="function(){return false;}">' +
                '<input style="height:38px;" data-type="search">' +
                '</form>' +
                '<ul  data-role="listview" class="ui-nodisc-icon ui-alt-icon ui-listview ui-listview-inset ui-corner-all ui-shadow" ' +
                ' data-inset="true">' +
                '</ul>',
            "costCenter": '<form class="ui-filterable" autocomplete="off" onsubmit="function(){return false;}">' +
                '<input style="height:38px;" data-type="search">' +
                '</form>' +
                '<ul  data-role="listview" class="ui-nodisc-icon ui-alt-icon ui-listview ui-listview-inset ui-corner-all ui-shadow" ' +
                ' data-inset="true">' +
                '</ul>'
        };
        //ui-li-has-count ui-screen-hidden
        //ui-li-has-count ui-first-child ui-last-child
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        var controlType = valueUnwrapped.controlType.toLocaleLowerCase();
        //if (controlType === "fs") valueUnwrapped.required = true;

        var tempHtml = controlHtml[controlType];
        var label = '<label><font size="-1" color="#9e9e9e"></font></label>';
        if (!valueUnwrapped.ignoreLabel) {
            if (controlType === "fs") {
                tempHtml = tempHtml.replace('<div data-role="fieldcontain">',
                    '<div data-role="fieldcontain">' + label);
            } else {
                tempHtml = label + tempHtml;
            }
        }
        var title = valueUnwrapped.name + (valueUnwrapped.required ? " <font size=\"-1\" color=\"#f44336\"><i class=\"fa fa-asterisk\"></i></font>" : "");

        $(element).append(tempHtml);
        //$(element).append(tempHtml);
        $($(element).children("label")[0]).attr("for", valueUnwrapped.name);
        $($(element).children("label").children("font")[0]).html(title);
        var tag;

        if (controlType === "fs") {
            tag = $($(element).find("select")[0]);
            $($(element).find("label").children("font")[0]).html(title);

            var key = valueUnwrapped.id.replace(/\$\$/g, "");
            $(element).find("label").attr("for", key);
            $(element).find("select").attr("name", key).attr("id", key);

            var options = (valueUnwrapped.type == "enum" &&
                valueUnwrapped.enumValues &&
                valueUnwrapped.enumValues.length) ? valueUnwrapped.enumValues : [
                    {
                        "id": "否",
                        "name": "否"
                    },
                    {
                        "id": "是",
                        "name": "是"
                    }
                ];

            $.each(options, function (index, item) {
                tag.append("<option value='" + item.id.trim() + "'>" + item.name.trim() + "</option>");
            });

        } else if (controlType === "employee" || controlType == "department" || controlType == "costCenter") {
            tag = $(element).find("input").first();
            if (valueUnwrapped.placeholder)
                tag.attr("placeholder", valueUnwrapped.placeholder);
            var key = valueUnwrapped.id.replace(/\$\$/g, "");
            //$(element).find("ul").data("input", "#" + key).attr("data-input", "#" + key);
            tag.attr("name", key).attr("id", key);
        } else if (controlType === "sbs" || controlType === "sbm" || controlType === "sbft") {
            //$.mobile.selectmenu.prototype.options.hidePlaceholderMenuItems = false;
            tag = $($(element).children("select")[0]);
            if ((controlType === "sbs" || controlType === "sbft") && !valueUnwrapped.required)
                tag.append("<option data-placeholder='false' value=' '>" + "&nbsp;" + "</option>");
            $.each(valueUnwrapped.enumValues, function (index, item) {
                tag.append("<option value='" + item.id + "'>" + item.name + "</option>");
            });
            var key = valueUnwrapped.id.replace(/\$\$/g, "");
            $(element).find("label").attr("for", key);
            $(element).find("select").attr("name", key).attr("id", key);
        } else if (controlType === "rbv" || controlType === "rbh") {
            tag = $($(element).find("fieldset")[0]);
            $.each(valueUnwrapped.enumValues, function (index, item) {
                var name = valueUnwrapped.id.replace(/\$/g, "") + "_group";
                var key = name + "_option" + index;
                var row = '<input type="radio" name="' + name + '" id="' + key + '" value="' + item.id + '">' +
                    '<label for="' + key + '">' + item.name + '</label>';
                tag.append(row);
            });
        } else if (controlType === "cbh" || controlType === "cbv") {
            tag = $($(element).find("fieldset")[0]);
            $.each(valueUnwrapped.enumValues, function (index, item) {
                var name = valueUnwrapped.id.replace(/\$/g, "") + "_group";
                var key = name + "_option" + index;
                var row = '<input type="checkbox" name="' + name + '" id="' + key + '" value="' + item.id + '">' +
                    '<label for="' + key + '">' + item.name + '</label>';
                tag.append(row);
            });
        } else if (controlType === "t2") {
            tag = $(element).find("textarea");
        } else if (controlType === "t3" || controlType === "t4" || controlType === "t5") {
            tag = $(element).find("input");

            var format;
            if (controlType === "t3")
                format = "YYYY-MM-DD";
            else if (controlType === "t4")
                format = "HH:mm";
            else
                format = "YYYY-MM-DD HH:mm";
            tag.datetimepicker({
                format: format
            });
            // format: 'MM/YYYY'
        } else {
            tag = $($(element).children("input")[0]);
        }

        if (!valueUnwrapped.writable)
            tag.prop("readonly", true);
        if (valueUnwrapped.required)
            tag.prop("required", true);
        tag.attr("controlType", controlType);


        var name = valueUnwrapped.id.replace(/\$/g, "");
        // if (controlType !== "t9i" && controlType !== "t9") {

        // }
        tag.attr("name", name);
        tag.attr("data-theme", "b");
        if (valueUnwrapped.required)
            tag.addClass("required");
        //var binding = "value:value";
        // if (controlType == "cbv" || controlType == "cbh" || controlType === "rbv" || controlType === "rbh")
        //     binding = "checked:value";
        // if (controlType == "sbs" || controlType == "sbm" || controlType == "sbft")
        //     binding = "selected:value";
        // if (controlType == "t3" || controlType == "t4" || controlType == "t5")
        //     binding = "datetime:value";
        // if (controlType == "t6")
        //     binding = "number:value";
        // if (controlType == "t7")
        //     binding = "email:value";
        // if (controlType == "t10")
        //     binding = "tel:value";
        // if (controlType === "fs")
        //     binding = "switch:value";
        // if (controlType === "psbi"||controlType === "psbm"||controlType === "psbn")
        //     binding = "auto:value";
        // if (valueUnwrapped.liveValidate)
        //     binding += ",invalid:invalid";
        // tag.attr("data-bind", binding);

        $(element).trigger('create');
        var binding = controlType === "t9i" ? {} : {
            "value": valueAccessor().value
        };

        if (controlType == "cbv" || controlType == "cbh" || controlType === "rbv" || controlType === "rbh")
            binding = {
                "checked": valueAccessor().value
            };
        if (controlType === "sbs" || controlType === "sbm" || controlType === "sbft")
            binding = {
                "selected": valueAccessor().value
            };
        if (controlType == "t3" || controlType == "t4" || controlType == "t5")
            binding = {
                "datetime": valueAccessor().value
            };
        if (controlType == "t6")
            binding = {
                "number": valueAccessor().value
            };
        if (controlType == "t7")
            binding = {
                "email": valueAccessor().value
            };
        if (controlType == "t9i")
            binding = {
                "upload": valueAccessor().value
            };
        if (controlType == "t10")
            binding = {
                "tel": valueAccessor().value
            };
        if (controlType == "t11")
            binding = {
                "money": valueAccessor().value
            };
        if (controlType === "fs")
            binding = {
                "switch": valueAccessor().value
            };
        if (controlType === "employee" || controlType === "department" || controlType === "costCenter")
            binding = {
                "auto": valueAccessor().value
            };
        if (controlType === "bpid")
            binding = {
                "id": valueAccessor().value
            };
        if (valueUnwrapped.liveValidate)
            binding.invalid = valueAccessor().invalid;

        if (allBindings().validator) {
            binding.validator = allBindings().validator;
        }
        ko.applyBindingsToNode(tag[0], binding, bindingContext);

    }
};

ko.virtualElements.allowedBindings.basicField = false;


ko.bindingHandlers.basicForm = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (!$("#basicField").length) {
            var template = "<script type=\"text/html\" id=\"basicField\">" +
                "<form class=\"col-lg-4 col-sm-6 col-xs-12 col-md-6\" style=\"padding:3px 3px;\"" +
                "data-bind=\"basicField: $data\">" +
                "<label><font color=\"#9e9e9e\" size=\"-1\"></font></label>" +
                "</form>" +
                "</script>";
            $("body").append(template);
        }
        $(element).removeAttr("data-bind");
        ko.applyBindingsToNode(element, {
            "template": {
                "name": 'basicField',
                "foreach": valueAccessor()
            }
        }, bindingContext);

        $(element).trigger('create');
        return {
            "controlsDescendantBindings": true
        };
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
};

ko.virtualElements.allowedBindings.basicForm = true;

ko.bindingHandlers.basicTable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var editable = valueAccessor().editable;
        var header = "<script type=\"text/html\" id=\"tableHeader\">" +
            "<th data-bind=\"text:  $data.name\"></th>" +
            "</script>";
        /*
         var cell = "<script type=\"text/html\" id=\"tableCell\">" +
         "<td>" +
         "<!-- ko if: getCellType($data)==='string' -->" +
         "<!-- ko text:$data -->" +
         "<!-- /ko -->" +
         "<!-- /ko -->" +

         "<!-- ko if: getCellType($data)==='multi-line' -->" +
         "<!-- ko text:formatCell($data) -->" +
         "<!-- /ko -->" +
         "<!-- /ko -->" +

         "<!-- ko if: getCellType($data)==='number' -->" +
         "<!-- ko html:formatCell($data,headers,$index) -->" +
         "<!-- /ko -->" +
         "<!-- /ko -->" +

         "</td>" +

         //"<td data-bind=\"html:formatSingleProperty($data,headers,$index)\"></td>" +
         "</script>";
         */
        var cell = "<script type=\"text/html\" id=\"tableCell\">" +
            "<td>" +
            "<!-- ko text: formatCell($data,headers,$index) -->" +
            "<!-- /ko -->" +
            "<!-- ko if: isMultiText($data) -->" +
            "<!-- ko template: { name: 'showText'} -->" +
            "<!-- /ko -->" +
            "<!-- /ko -->" +
            "</td>" +
            "</script>";
        var showText = "<script type=\"text/html\" id=\"showText\">" +
            "<a data-position-to=\"origin\" href=\"javascript:void(0);\" " +
            "data-bind=\"attr:{id:'popLink_'+Math.floor(Math.random()*1000)+'_'+$index()},click:showFullText\">" +
            "<font color=\"#03a9f4\"><i class=\"fa fa-file-text-o\">" +
            "</i></font></a>" +
            "</script>";

        var row = "<script type=\"text/html\" id=\"tableRow\">" +
            "<tr>" +
            "<th class=\"rowOrder\" data-bind=\"text: ($index()+1)\"></th>" +
            "<!-- ko template: { name: 'tableCell', foreach: $data } -->" +
            "<!-- /ko -->" +
            (editable ? "<td  style=\"text-align: center;\" data-bind=\"click: function () { $parent.removeRow($data) }\"><a href=\"javascript:void(0);\"><i class=\"fa fa-minus-circle\"></i></a></td>" : "") +
            "</tr>" +
            "</script>";

        var table = "<script type=\"text/html\" id=\"basicTable\">" +
            "<table data-role=\"table\" class=\"ui-body-d ui-shadow table-stripe ui-responsive movie-list table-stroke\" data-mode=\"reflow\" style=\"margin-bottom: 8px; margin-top: 8px\">" +
            "<thead>" +
            "<tr class=\"ui-bar-d\">" +

            "<th style=\"text-align: center;\">#</th>" +
            "<!-- ko template: { name: 'tableHeader', foreach:headers } -->" +
            "<!-- /ko -->" +
            (editable ? "<th  style=\"text-align: center;\">操作</th>" : "") +
            "</tr>" +
            "</thead>" +
            "<tbody data-bind=\"template: { name: 'tableRow', foreach:rows }\"></tbody>" +
            "</table>" +
            "</script>";
        if (!$("#tableHeader").length) {
            $("body").append(header);
        }

        if (!$("#showText").length) {
            $("body").append(showText);
        }

        if (!$("#tableCell").length) {
            $("body").append(cell);
        }

        if (!$("#tableRow").length) {
            $("body").append(row);
        }

        if (!$("#basicTable").length) {
            $("body").append(table);
        }

        $(element).removeAttr("data-bind");
        var childBindingContext = bindingContext.createChildContext(
            bindingContext.$rawData,
            null, // Optionally, pass a string here as an alias for the data item in descendant contexts
            function (context) {
                ko.utils.extend(context, valueAccessor());
            });
        ko.applyBindingsToNode(element, {
            "template": {
                "name": 'basicTable',
                "data": valueAccessor()
            }
        }, childBindingContext);
        var container = $(element);
        if (!container.prop("tagName")) {
            container = container.parent();
        }
        container.trigger('create');
        return {
            "controlsDescendantBindings": true
        };
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
};

ko.virtualElements.allowedBindings.basicTable = true;


ko.bindingHandlers.basicTables = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var collapsibleTable =
            "<script type=\"text/html\" id=\"collapsibleTable\">" +
            "<div class=\"row\">" +
            "<legend style=\"margin-bottom: 3px;\">" +
            "<font size=\"-1\" color=\"#0097a7\"><i class=\"fa fa-fw fa-table\"></i><b> 明细信息</b></font>" +
            "</legend>" +
            "<div data-role=\"collapsible\" data-collapsed=\"true\" data-collapsed-icon=\"carat-d\"" +
            "data-expanded-icon=\"carat-u\" style=\"margin-top:18px;\" data-iconpos=\"right\">" +
            "<h4><i class=\"fa fa-table\"></i>&nbsp;<span data-bind=\"text:$data.rows.length\"></span></h4>" +
            "<!-- ko  basicTable: $data -->" +
            "<!-- /ko -->" +
            "</div>" +
            "</div>" +
            "</script>";
        if (!$("#collapsibleTable").length) {
            $("body").append(collapsibleTable);
        }
        ko.applyBindingsToNode(element, {
            "template": {
                "name": 'collapsibleTable',
                "foreach": valueAccessor()
            }
        }, bindingContext);


    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
};

ko.virtualElements.allowedBindings.basicTables = true;


ko.virtualElements.allowedBindings.datatable = true;
ko.bindingHandlers.datatable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var datatable =
            "<script type=\"text/html\" id=\"datatable\">" +
            "<table class=\"table table-striped table-bordered\" cellspacing=\"0\" width=\"100%\">" +
            "<thead>" +
            "<tr>" +
            "<!-- ko foreach: headers -->" +
            "<th data-bind=\"text: $data\"></th>" +
            "<!-- /ko -->" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            "<!-- ko foreach: rows -->" +
            "<tr>" +
            "<!-- ko foreach: $data -->" +
            "<td data-bind=\"text:$data\"></td>" +
            "<!-- /ko -->" +
            "</tr>" +
            "<!-- /ko -->" +
            "</tbody>" +
            "</table>" +
            "</script>";
        if (!$("#datatable").length) {
            $("body").append(datatable);
        }
        ko.applyBindingsToNode(element, {
            "template": {
                "name": 'datatable',
                "data": valueAccessor()
            }
        }, bindingContext);
        return {
            "controlsDescendantBindings": true
        };
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var table = $(element).next();
        if (table.is("table.table")) {
            table.DataTable(BPMS.util.datatableOptions);
        }
    }
};

ko.bindingHandlers.dateTimeSpan = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var divClass = allBindings() && allBindings().styleClass || "col-lg-4 col-sm-6 col-xs-12 col-md-4"
        var dateTimeSpan =
            "<script type=\"text/html\" id=\"dateTimeSpan\">" +
            "<div class=\"" + divClass + "\"" +
            "data-bind=\"with:start,basicField: start,validator:$data\"" +
            "style=\"padding:3px 3px;\">" +
            "</div>" +
            "<div class=\"" + divClass + "\"" +
            "data-bind=\"with:end,basicField: end,validator:$data\"" +
            "style=\"padding:3px 3px;\">" +
            "</div>" +
            "</script>";
        if (!$("#dateTimeSpan").length) {
            $("body").append(dateTimeSpan);
        }
        var parent = valueAccessor();
        parent.validate = function () {
            var invalid = true;
            var value1 = parent.start.value();
            var value2 = parent.end.value();
            if (value1 && value2) {
                var allowEqual = (parent.start.controlType == "t3" && parent.end.controlType == "t3");
                if (allowEqual && value1 <= value2) {
                    invalid = false;
                } else if (value1 < value2 && value1 >= moment().format("x")) {
                    invalid = false;
                }
            } else {
                var startValid = !parent.start.required || !!value1;
                var endValid = !parent.end.required || !!value2;
                if (startValid && endValid) {
                    invalid = false;
                }
            }
            parent.start.invalid(invalid);
            parent.end.invalid(invalid);
        }
        ko.applyBindingsToNode(element, {
            "template": {
                "name": 'dateTimeSpan',
                "data": valueAccessor()
            }
        }, bindingContext);
        return {
            "controlsDescendantBindings": true
        };

    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
};

ko.virtualElements.allowedBindings.dateTimeSpan = true;


ko.bindingHandlers.attachmentGrop = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var attachmentList =
            "<script type=\"text/html\" id=\"attachmentList\">" +
            "<div class=\"row\">" +
            "<ul data-role=\"listview\"" +
            "	data-bind=\"jqmTemplate: { name: 'attachmentRead', foreach: items }, jqmRefreshList: items\"" +
            "	data-inset=\"true\" style=\"margin-top:0px;\">" +
            "</ul>" +
            "</div>" +
            "</script>";
        if (!$("#attachmentList").length) {
            $("body").append(attachmentList);
        }
        ko.applyBindingsToNode(element, {
            "template": {
                "name": 'attachmentList',
                "foreach": valueAccessor()
            }
        }, bindingContext);
        return {
            "controlsDescendantBindings": true
        };
    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
};

ko.virtualElements.allowedBindings.attachmentGrop = true;
