// note: this does not rely on knockout's number binding
ko.bindingHandlers[getBindingName("number")] = (function() {


    return {
        after: ["attr", "value"],

        init: function(element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var $element = $(element);

            var controlType = $element.attr("control-type");
            var handler = function(e) {
                var text = $(e.target).val().trim();
                var number = Number(text);
                var isValid = !isNaN(number)&&text!="";
                var value = isValid ? number.toString() : null;
                text = isValid ? number : "";
                $element.val(text);
                modelValue(value);
            };

            $element.on("change", handler);
        },

        update: function(element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);

            if (value == null || typeof(value) == "undefined"
                || typeof(value) == "string" && value.trim() == "") {
                $element.val("");
                return;
            }

            $element.val(value);
        }
    };
})();