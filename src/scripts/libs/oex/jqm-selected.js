// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("selected")] = (function () {
    return {
        //after: ["attr", "value"],
        //https://github.com/jquery/jquery-mobile/issues/2458
        init: function (element, valueAccessor, allBindings) {

            var isMultiple = !!$(element).attr("multiple");
            var isFilterable = $(element).attr("controlType") === "sbft";
            var elementId = $(element).attr("id");
            var show = function (event, data) {
                var listview, form,
                    id = data.toPage && data.toPage.attr("id");
                if (id !== elementId + "-dialog") {
                    return;
                }
                listview = data.toPage.find("ul");
                form = listview.jqmData("filter-form");
                // Attach a reference to the listview as a data item to the dialog, because during the
                // pagecontainerhide handler below the selectmenu widget will already have returned the
                // listview to the popup, so we won't be able to find it inside the dialog with a selector.
                data.toPage.jqmData("listview", listview);
                // Place the form before the listview in the dialog.
                listview.before(form);
            };
            var hide = function (event, data) {
                var id = data.toPage && data.toPage.attr("id");
                if (id !== elementId + "-dialog") {
                    return;
                }
                var listview = data.toPage.jqmData("listview");
                var form = listview.jqmData("filter-form");
                // Put the form back in the popup. It goes ahead of the listview.
                listview.before(form);
            };
            if (isFilterable && !$(element).prop("filterAdded")) {

                var input;
                var list = $("#" + $(element).attr("id") + "-menu");

                var form = list.jqmData("filter-form");
                // We store the generated form in a variable attached to the popup so we avoid creating a
                // second form/input field when the listview is destroyed/rebuilt during a refresh.
                if (!form) {
                    input = $("<input data-type='search'></input>");
                    form = $("<form></form>").append(input);
                    input.textinput();
                    list
                        .before(form)
                        .jqmData("filter-form", form);
                    form.jqmData("listview", list);
                }
                // Instantiate a filterable widget on the newly created listview and indicate that the
                // generated input form element is to be used for the filtering.
                list.filterable({
                    input: input,
                    children: "> li:not(:jqmData(placeholder='true'))"
                });
                $(element).prop("filterAdded", true);
                $.mobile.document.on("pagecontainerbeforeshow", show)
                    .on("pagecontainerhide", hide);

            }
            var modelValue = valueAccessor();
            var handler = function (e) {
                var newValue = $(element).val();
                if (isMultiple && newValue && newValue.length)
                    newValue = newValue.join(",");
                if (!isMultiple && (newValue === null || newValue.toString().trim() === "" || newValue.toString().trim() === "...")) {
                    newValue = null;
                }

                modelValue(newValue);
            };
            var $element = $(element).on("change", handler);
            var isRequired = $(element).prop("required");
            if (isRequired) {
                var defaultValue = $element.find("option").first().val();
                modelValue(defaultValue);
            }
        },
        update: function (element, valueAccessor, allBindings) {
            var isRequired = $(element).prop("required");
            var isMultiple = !!$(element).attr("multiple");
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);
            var elementValue = $element.val();

            if (isMultiple) {
                var values = value ? value.split(",") : [];
                $element.find("option").each(function (i2, opt) {
                    var match = values && values.length && values.indexOf($(opt).val()) >= 0;
                    $(opt).prop("selected", match);
                });
            } else {
                if (elementValue != value)
                    $element.val(value);
            }

            //   var values="Test,Prof,Off";
            //  $.each(values.split(","), function(i,e){
            //      $("#strings option[value='" + e + "']").prop("selected", true);
            //  });
            $element.selectmenu("refresh");
        }
    };
})();