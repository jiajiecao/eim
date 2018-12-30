// note: this does not rely on knockout's number binding
ko.bindingHandlers[getBindingName("percent")] = (function () {


    return {
        after: ["attr", "value"],

        init: function (element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var $element = $(element);

            var controlType = $element.attr("control-type");
            var handler = function (e) {
                var text = $(e.target).val().trim();
                var number = Number(text);
                var isValid = !isNaN(number) && text != "" && number > 0 && number <= 100;

                text = isValid ? number.toString() : "";
                $element.val(text);

                var value = isValid ? (number / 100).toString() : null;
                modelValue(value);
            };

            $element.on("change", handler);
        },

        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);

            if (value == null || typeof (value) == "undefined"
                || typeof (value) == "string" && value.trim() == "") {
                $element.val("");
                return;
            }

            $element.val(Number(value) * 100);
        }
    };
})();