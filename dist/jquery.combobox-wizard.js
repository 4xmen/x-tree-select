;(function ($) {

    $.fn.wizcombobox = function (options) {

        // make app var for use in plugin
        $.wcb = this;

        // change plugin info
        var settings = $.extend({
            datatree: [],
            mainTitle: 'Main category'
        }, options);

        // store navigation for trace where are we?
        var navigatex = [];

        // store last navigtion fot buffer use
        var lastx = {
            title: settings.mainTitle,
            id: ''
        };
        // use for seleect update
        this.target = null ;
        this.text = null ;

        /**
         * initial element
         * @param self
         */
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
            // init element for click for choose
            $(self).parent().append('<div class="wzcmb">' + placeholder + '</div>');
            // find select text position
            $.wcb.text = $(self).parent().find('.wzcmb') ;
            // initial idx for use in naviagion
            settings.datatree = $.wcb.makeId('1', settings.datatree);
            // on click combowizard
            $(self).parent().find('.wzcmb').bind('click.open', function (e) {
                // check is open list
                if (!$(this).hasClass('active')) {
                    //if now list show list and countiniu
                    $(this).append('<ul id="wzcmb-list"></ul>');
                    // find target for last value
                    $.wcb.target = $(this).parent().find('input') ;
                    // show first list main cat in list
                    $.wcb.showTree(settings.datatree);
                    // slide down list
                    $("#wzcmb-list").slideDown();
                    // add active class for check  is open
                    $(this).addClass('active');
                } else {
                    // if click not in main element
                    if (e.target !== this)
                        return;
                    // hide and remove list
                    $(this).removeClass('active');
                    $("#wzcmb-list").slideUp(100, function () {
                        $(this).remove();
                    })
                }
            });
            // on click items
            $(document).on('click', '#wzcmb-list li', function () {
                // hast child
                if ($(this).hasClass('wzcmb-childer')) {
                    // make navigation
                    let tmp = {
                        title: lastx.title,
                        id: lastx.id
                    };
                    navigatex.push(tmp);
                    lastx.title = $(this).text();
                    lastx.id = $(this).data('id');
                    // show child items
                    $.wcb.showTree($.wcb.findTree(settings.datatree, $(this).data('id')));
                } else if ($(this).hasClass('wzcmb-back')) { // if click on back
                    if (navigatex[navigatex.length -1] != undefined){
                        // roll back navigtaion to last
                        lastx.title = navigatex[navigatex.length -1].title;
                        lastx.id = navigatex[navigatex.length -1].id;
                    } else{
                        // check is navigation emoppty set def
                        lastx.title = settings.mainTitle ;
                        lastx.id = '' ;
                    }
                    // pop last navigation item
                    navigatex.pop();
                    // get parent list
                    var lst = $.wcb.findTree(settings.datatree, $(this).data('id'));
                    // if has not parent show main cat
                    if (lst.length == 0) {
                        $.wcb.showTree(settings.datatree);
                    } else {
                        // then show parent list
                        $.wcb.showTree(lst);
                    }


                } else { // choose value
                    // set main input value
                    $( $.wcb.target).val($(this).data('value'));
                    // set choosed test
                    $($.wcb.text).text($(this).text());
                    // remove active class and hide list
                    $($.wcb.text).removeClass('active');
                    $("#wzcmb-list").slideUp(100, function () {
                        $(this).remove();
                    })
                }
            });
        }

        /**
         * make idx for navigatopm
         * @param base base prefix for id
         * @param lst list of json
         * @returns {Array}
         */
        this.makeId = function (base, lst) {
            var all = [];
            // each item of list
            for (const ix in lst) {
                let itm = lst[ix];
                // add prefix + - + counter
                let prefix = base + '-' + (parseInt(ix) + 1);
                itm.idx = prefix;
                // if has child
                if (itm.child.length != 0) {
                    // recall this function for children
                    itm.child = $.wcb.makeId(prefix, itm.child);
                }
                all.push(itm);
            }
            return all;
        };

        /**
         * show list into selector
         * @param list
         */
        this.showTree = function (list) {
            // clear li list
            $("#wzcmb-list li").remove();
            // back button handle
            // has parent need back button
            if (navigatex.length !== 0) {
                // if navigation is empity not need back button
                let back = navigatex[navigatex.length - 1];
                $("#wzcmb-list").append('<li class="wzcmb-back" data-id="' + back.id + '"> &nbsp;' + back.title + '</li>')
            }
            // show list passed to function
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

        /**
         * find idx in tree
         * @param list
         * @param idx
         * @returns {*}
         */
        this.findTree = function (list, idx) {
            // make return by def
            var back = [];
            // each first level of list
            for (const ix in list) {
                let item = list[ix];
                if (item.idx == idx) {
                    return item.child;
                }
            }
            // if not fond in first level each the childs
            for (const ix in list) {
                let item = list[ix];
                if (item.child.length !== 0) {
                    var tmp = $.wcb.findTree(item.child, idx);
                    // if found idx retrur
                    if (tmp.length !== 0) {
                        return tmp;
                    }
                }

            }
            // then retrun defualt ret var
            return back;
        };


        this.each(function () {
            $.wcb.init(this);
        });


        return this;

    };

}(jQuery));