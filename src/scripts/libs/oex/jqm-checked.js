// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("checked")] = (function () {

    return {
        init: function (element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var $element = $(element);
            var isRequired = $element.prop("required");
            var isRadio = $element.find("input[type='radio']").length;
            var isCheckbox = $element.find("input[type='checkbox']").length;
            var fnInvalid = allBindings() && allBindings().invalid;

            if (ko.isWriteableObservable(modelValue)) {
                var handler = function (e) {
                    if (isRadio) {
                        var newValue = $(e.target).val();
                        if (!isRequired && modelValue() == newValue)
                            newValue = null;

                        modelValue(newValue);
                        if (fnInvalid) {
                            fnInvalid(!newValue);
                        }
                    }
                    if (isCheckbox) {
                        var values = [];
                        var inputs = $element.find("input");

                        inputs.each(function (index, input) {
                            var include = $(input).prop("checked");
                            //if (e.target == input) include = !include;
                            if (include)
                                values.push($(input).val());
                        });

                        var fieldValue = values.length ? values.join(",") : null;
                        modelValue(fieldValue);
                    }
                };
                $element.on("change", handler);

                if(isRadio && isRequired){
                    $element.find("input").first().click();
                }
            }
        },

        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);
            var isRadio = $element.find("input[type='radio']").length;
            var isCheckbox = $element.find("input[type='checkbox']").length;
            var fnInvalid = allBindings() && allBindings().invalid;

            if (isRadio) {
                var invalid = true;
                $element.find("input").each(function (index, input) {
                    var checked = $(input).val() == value;
                    if (checked)
                        invalid = false;
                    if (fnInvalid)
                        fnInvalid(invalid);
                    $(input).prop("checked", checked).checkboxradio('refresh');
                });
            }
            if (isCheckbox) {
                var values = [];
                if (value != null && typeof(value) != "undefined" && value)
                    values = value.split(",");
                $element.find("input").each(function (index, input) {
                    var checked = values.indexOf($(input).val()) >= 0;
                    $(input).prop("checked", checked);
                    refreshElement($(input));
                });
            }
        }
    };
})();