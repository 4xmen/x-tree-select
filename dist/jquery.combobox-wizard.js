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
            // init element
            $(self).parent().append('<div class="wzcmb">' + placeholder + '</div>');
            settings.datatree = $.wcb.makeId('1', settings.datatree);
            console.log(settings.datatree);
            // on click combowizard
            $(self).parent().find('.wzcmb').bind('click.open', function () {
                if (!$(this).hasClass('active')) {
                    //if now list show list and countiniu
                    $(this).append('<ul id="wzcmb-list"></ul>');
                    // ad childs
                    for (const i in settings.datatree) {
                        let item = settings.datatree[i];
                        // check has child
                        if (item.child.length == 0) {
                            var clsx = '';
                        } else {
                            var clsx = ' class="wzcmb-childer"';
                        }

                        // li to list
                        $("#wzcmb-list").append('<li' + clsx + '>' + item.title + '</li>')
                    }
                    // show list
                    $("#wzcmb-list").slideDown();
                    $(this).addClass('active');
                } else {
                    // hide and remove list
                    $(this).removeClass('active');
                    $("#wzcmb-list").slideUp(100, function () {
                        $(this).remove();
                    })
                }
            });
        }

        this.makeId = function (base, lst) {
            var all = [];
            for (const ix in lst) {
                let itm = lst[ix];
                let prefix = base + '-' + (parseInt(ix) + 1);
                itm.idx = prefix;
                if (itm.child.length != 0) {
                    itm.child = $.wcb.makeId(prefix, itm.child);
                }
                all.push(itm);
            }
            return all;
        };


        this.each(function () {
            $.wcb.init(this);
        });

        return this;

    };

}(jQuery));