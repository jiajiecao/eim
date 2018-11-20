// note: this does not rely on knockout's number binding
ko.bindingHandlers[getBindingName("tel")] = (function() {


    return {
        after: ["attr", "value"],

        init: function(element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var $element = $(element);
            var handler = function(e) {
                var text = $(e.target).val();
                var formattedText = "";
                for (var i in text) {
                    if ("1234567890".indexOf(text[i]) >= 0)
                        formattedText += text[i];
                }

                $element.val(formattedText);
                modelValue(formattedText);
            };

            $element.on("change", handler);
        },

        update: function(element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);
            if (value == null || typeof(value) == "undefined")
                value = "";
            $element.val(value);
        }
    };
})();