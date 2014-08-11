var datenavbar = $.widget("ui.datenavbar", {
    version: "1.0.0",
    options: {
        prevDayText: "<i class='glyphicon glyphicon-chevron-left'></i> D-1",
        nextDayText: "D+1 <i class='glyphicon glyphicon-chevron-right'></i>",
        prevWeekText: "<i class='glyphicon glyphicon-backward'></i> D-7",
        nextWeekText: "D+7 <i class='glyphicon glyphicon-forward'></i>",
        dateFormat: "yy-mm-dd",
        date: null,
        minDate: null,
        maxDate: null,
        change: null,
    },

    _create: function () {
        $(this.element)
             .addClass("input-group")
             .html(
                  "<span class='input-group-btn'>" +
                  "  <button data-value='-7' class='btn btn-default datenavbar-button'>" + this.options.prevWeekText + "</button>" +
                  "  <button data-value='-1' class='btn btn-default datenavbar-button'>" + this.options.prevDayText + "</button>" +
                  "</span>" +
                  "<input type='text' class='form-control datenavbar-picker' style='text-align: center'>" +
                  "<span class='input-group-btn'>" +
                  "  <button data-value='1' class='btn btn-default datenavbar-button'>" + this.options.nextDayText + "</button>" +
                  "  <button data-value='7' class='btn btn-default datenavbar-button'>" + this.options.nextWeekText + "</button>" +
                  "</span>"
             );

        var This = this;
        var picker = this.picker = $(this.element).find(".datenavbar-picker").datepicker({
            dateFormat: this.options.dateFormat,
            minDate: this.options.minDate,
            maxDate: this.options.maxDate,
            showButtonPanel: true,
            onSelect: function () {
                var newDate = $(picker).datepicker("getDate");
                if (newDate != This.options.date) {
                    This.date($(picker).datepicker("getDate"));
                }
            }
        }).get(0);
        if (this.options.date) {
            This.date(this.options.date);
        }

        $(this.element).find(".datenavbar-button").on("click", function () {
            var cur = This.options.date;
            if (cur) {
                var value = $(this).data("value");
                var date = new Date(cur.getTime() + $(this).data("value") * 86400000);
                This.date(date);
            }
        });
    },

    _destroy: function () {
        $(this.element).removeClass("input-group");
        $(this.element).html("");
    },

    date: function (newDate) {
        if (newDate === undefined) {
            return this.options.date;
        }
        this.options.date = newDate;
        $(this.picker).datepicker("setDate", newDate);
        this._refreshButtons();
        this._trigger("change");
    },

    _refreshButtons: function () {
        var inst = $.datepicker._getInst(this.picker);
        var minDate = $.datepicker._getMinMaxDate(inst, "min");
        var maxDate = $.datepicker._getMinMaxDate(inst, "max");
        var This = this;
        $.each($(this.element).find(".datenavbar-button"), function (index, obj) {
            var cur = This.options.date;
            if (cur) {
                var value = $(this).data("value");
                var date = new Date(cur.getTime() + $(this).data("value") * 86400000);
                obj.disabled = (minDate != null && date < minDate) || 
                               (maxDate != null && date > maxDate);
            }
        });
    },

    _setOptions: function () {
        this._superApply(arguments);
    },

    _setOption: function (key, value) {
        this._super(key, value);

        if (key === "dateFormat") {
            $(this.picker).datepicker("option", "dateFormat", value);
        }

        if (key === "minDate") {
            $(this.picker).datepicker("option", "minDate", value);
            this._refreshButtons();
        }

        if (key === "maxDate") {
            $(this.picker).datepicker("option", "maxDate", value);
            this._refreshButtons();
        }
    },
});
