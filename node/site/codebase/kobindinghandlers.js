// use this for Busy dialog box message binding

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var shouldDisplay = typeof value == "boolean" ? value : ko.utils.unwrapObservable(value.condition);
        // Start visible/invisible according to initial value
        $(element).css("display", shouldDisplay ? "block" : "none").css("opacity", shouldDisplay ? 1 : 0);
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var shouldDisplay = typeof value == "boolean" ? value : ko.utils.unwrapObservable(value.condition);
        var speed = typeof value == "boolean" ? undefined : ko.utils.unwrapObservable(value.speed);
        // On update, fade in/out
        $(element).stop(true, false).css("display", "block").
                        animate(
                                    { opacity: shouldDisplay ? 1 : 0 },
                                    { duration: speed,
                                        complete: function () {
                                            $(element).css("display", shouldDisplay ? "block" : "none");
                                        }
                                    });
    }
};