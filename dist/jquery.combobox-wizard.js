;(function ($) {

    $.fn.wizcombobox = function (options) {

        $.wcb = this;

        var settings = $.extend({
            datatree: []
        }, options);


        this.init = function (self) {

            // hide element
            $(self).hide();
            // set placehodler
            var placeholder = 'Please select';
            // check place holder
            if ($(self).attr('placeholder') != undefined) {
                placeholder = $(self).attr('placeholder');
            }
            $(self).parent().append('<div class="wzcmb">' + placeholder + '</div>');

            $(self).parent().find('.wzcmb').bind('click.open',function () {
                console.log('x1');
                if (!$(this).hasClass('active')){
                    $(this).append('<ul id="wzcmb-list"><li>123</li><li>123</li></ul>');
                    $("#wzcmb-list").slideDown();
                    $(this).addClass('active');
                }else{
                    $(this).removeClass('active');
                    $("#wzcmb-list").slideUp(100,function () {
                      $(this).remove();
                    })
                }
            });

        }

        this.each(function () {

            $.wcb.init(this);
        });


        return this;

    };

}(jQuery));