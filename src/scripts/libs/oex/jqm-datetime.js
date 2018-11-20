// note: this does not rely on knockout's datetime binding
ko.bindingHandlers[getBindingName("datetime")] = (function () {


    return {
        after: ["attr", "value"],

        init: function (element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var $element = $(element);
            var fnInvalid = allBindings() && allBindings().invalid;
            var controlType = $element.attr("control-type");
            var handler = function (current) {
                if (current.date) {
                    var date = current.date;
                    if (controlType === "t3")
                    {
                        date = moment(date.format( "YYYY-MM-DD"));
                    }
                    else if (controlType === "t4")
                    {
                        //format = "HH:mm";
                    }
                    else
                    {
                        date = moment(date.format("YYYY-MM-DD HH:mm"));
                    }
                    var stamp = date.format("x");
                    modelValue(stamp);
                    if (fnInvalid)
                        fnInvalid(false);
                }
                else {
                    modelValue(null);
                    if (fnInvalid)
                        fnInvalid(true);
                }
                if(allBindings().validator)
                    allBindings().validator.validate();
                return true;
            };

            $element.on("dp.change", handler);
        },

        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);
            var fnInvalid = allBindings() && allBindings().invalid;


            if (!value) {
                $element.val("");
                if (fnInvalid)
                    fnInvalid(true);
                if(allBindings().validator)
                    allBindings().validator.validate();
                return;
            }
            var controlType = $element.attr("control-type");
            var format;
            if (controlType === "t3")
                format = "YYYY-MM-DD";
            else if (controlType === "t4")
                format = "HH:mm";
            else
                format = "YYYY-MM-DD HH:mm";
            var formattedValue = moment(Number(value)).format(format);
            $element.val(formattedValue);
            if (fnInvalid)
                fnInvalid(false);
            if(allBindings().validator)
                allBindings().validator.validate();
        }
    };
})();