;
(function ($) {

    $.fn.wizcombobox = function (options) {

        $.wizcombobox = this;

        var settings = $.extend({

        }, options);



        this.each(function () {
            $(this).hide();
            var placeholder = 'Please select';
            if ($(this).attr('placeholder') != undefined){
                placeholder = $(this).attr('placeholder') ;
            }
            $(this).parent().append('<div class="wzcmb">'+placeholder+'</div>');
        });



        return this;

    };

}(jQuery));