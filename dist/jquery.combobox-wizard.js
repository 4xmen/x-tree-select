;(function ($) {

    $.fn.wizcombobox = function (options) {

        $.wcb = this;

        var settings = $.extend({
            datatree: [],
            mainTitle: 'Main category'
        }, options);

        var navigatex = [];
        
        var lastx = {
            title: settings.mainTitle,
            id: ''
        };
        
        this.target = null ;
        this.text = null ;

        this.init = function (self) {

            console.log(settings.mainTitle );
            lastx.title = settings.mainTitle ;
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
            $.wcb.text = $(self).parent().find('.wzcmb') ;
            settings.datatree = $.wcb.makeId('1', settings.datatree);
            // console.log(settings.datatree);
            // on click combowizard
            $(self).parent().find('.wzcmb').bind('click.open', function (e) {
                if (!$(this).hasClass('active')) {
                    //if now list show list and countiniu
                    $(this).append('<ul id="wzcmb-list"></ul>');
                    $.wcb.target = $(this).parent().find('input') ;

                    $.wcb.showTree(settings.datatree);
                    // show list
                    $("#wzcmb-list").slideDown();
                    $(this).addClass('active');
                } else {
                    if (e.target !== this)
                        return;
                    // hide and remove list
                    $(this).removeClass('active');
                    $("#wzcmb-list").slideUp(100, function () {
                        $(this).remove();
                    })
                }
            });

            $(document).on('click', '#wzcmb-list li', function () {
                if ($(this).hasClass('wzcmb-childer')) {
                    let tmp = {
                        title: lastx.title,
                        id: lastx.id
                    };
                    navigatex.push(tmp);
                    lastx.title = $(this).text();
                    lastx.id = $(this).data('id');

                    $.wcb.showTree($.wcb.findTree(settings.datatree, $(this).data('id')));
                } else if ($(this).hasClass('wzcmb-back')) {

                    if (navigatex[navigatex.length -1] != undefined){
                        lastx.title = navigatex[navigatex.length -1].title;
                        lastx.id = navigatex[navigatex.length -1].id;
                    } else{
                        lastx.title = settings.mainTitle ;
                        lastx.id = '' ;
                    }
                    navigatex.pop();
                    var lst = $.wcb.findTree(settings.datatree, $(this).data('id'));
                    if (lst.length == 0) {
                        $.wcb.showTree(settings.datatree);
                    } else {
                        $.wcb.showTree(lst);
                    }


                } else {
                    // console.log($.wcb.target);
                    $( $.wcb.target).val($(this).data('value'));
                    $($.wcb.text).text($(this).text());
                    $($.wcb.text).removeClass('active');
                    $("#wzcmb-list").slideUp(100, function () {
                        $(this).remove();
                    })
                }
                // console.log(navigatex,lastx);
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


        this.showTree = function (list) {
            $("#wzcmb-list li").remove();
            if (navigatex.length !== 0) {
                let back = navigatex[navigatex.length - 1];
                $("#wzcmb-list").append('<li class="wzcmb-back" data-id="' + back.id + '"> &nbsp;' + back.title + '</li>')
            }
            for (const ix in list) {
                let item = list[ix];
                // ad childs
                // check has child
                if (item.child.length == 0) {
                    var clsx = '';
                } else {
                    var clsx = ' class="wzcmb-childer"';
                }
                // li to list
                $("#wzcmb-list").append('<li' + clsx + ' data-id="' + item.idx + '"  data-value="'+item.value +'">' + item.title + '</li>');
            }
        };

        this.findTree = function (list, idx) {
            // console.log(list);
            var back = [];
            for (const ix in list) {
                let item = list[ix];
                if (item.idx == idx) {
                    return item.child;
                }
            }
            for (const ix in list) {
                let item = list[ix];
                if (item.child.length !== 0) {
                    var tmp = $.wcb.findTree(item.child, idx);
                    if (tmp.length !== 0) {
                        return tmp;
                    }
                }

            }
            return back;
        };

        this.each(function () {
            $.wcb.init(this);
        });

        return this;

    };

}(jQuery));