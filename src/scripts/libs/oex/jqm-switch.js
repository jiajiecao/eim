// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("switch")] = (function() {
    return {
        init: function(element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var handler = function(e) {
                var newValue = $(element).val();
                //newValue = newValue == true.toString();
                modelValue(newValue);
            };
            var $element = $(element).on("change", handler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $element.off("change", handler);
            });
        },
        update: function(element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);
            if (typeof(value) == "undefined" || value == null||value=="") {
                value = $($element.children()[0]).val();
                valueAccessor()(value);
            }
            value = value.toString();

            var elementValue = $element.val();

            if (elementValue != value) {
                $element.val(value).flipswitch("refresh");
            }
            //refreshElement($element);
        }
    };
})();