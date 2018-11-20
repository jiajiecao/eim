// note: this does not rely on knockout's number binding
ko.bindingHandlers[getBindingName("money")] = (function () {



    return {
        after: ["attr", "value"],

        init: function (element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var $element = $(element);

            var controlType = $element.attr("control-type");
            var handler = function (e) {
                var text = $(e.target).val().trim();
                text = text.replace(/\,/g, "");
                var number = Number(text);
                var isValid = !isNaN(number) && text != "";

                text = isValid ?  BPMS.util.formatMoney(text) : "";
                var value = isValid ? (Number(text.trim().replace(/\,/g, ""))).toString() : null;
                $element.val(text);
                modelValue(value);
            };

            $element.on("change", handler);
        },

        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);

            if (value == null || typeof(value) == "undefined"
                || typeof(value) == "string" && value.trim() == "") {
                $element.val("");
                return;
            }

            value =  BPMS.util.formatMoney(value);
            $element.val(value);
        }
    };
})();