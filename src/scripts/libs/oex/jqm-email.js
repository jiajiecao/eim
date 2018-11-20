// note: this does not rely on knockout's number binding
ko.bindingHandlers[getBindingName("email")] = (function() {
    return {
        init: function(element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var $element = $(element);
            var handler = function(e) {
                var text = $element.val().trim();
                var reg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
                var isValid = reg.test(text);
                console.log(isValid);
                $element.val(text);
                modelValue(text);
            };

            $element.on("change", handler);
        },

        update: function(element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);

            if (value == null || typeof(value) == "undefined" || typeof(value) == "string" && value.trim() == "") {
                value = "";
            }

            $element.val(value);
        }
    };
})();