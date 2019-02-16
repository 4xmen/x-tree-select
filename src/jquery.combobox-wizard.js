;(function ($) {
    "use strict";
    $.fn.wizcombobox = function (options) {

        // set default store for setting
        if ($.wcbStore == undefined) {
            $.scbCounter = -1;
            $.wcbStore = [];
            $.currentCounter = 0 ;
        }

        // make app var for use in plugin
        $.wcb = this;

        // change plugin info
        var settings = $.extend({
            datatree: [],
            onOpen:function () {},
            OnSelect:function (selected) {},
            OnChange:function (oldVal,newVal) {},
            onClose:function () {},
            mainTitle: 'Main category'
        }, options);

        // store navigation for trace where are we?
       $.navigatex = [];

        // store last navigtion fot buffer use
         $.lastx = {
            title: '',
            id: ''
        };

        // use for seleect update
        this.target = null;
        this.text = null;

        // store setting for use
        $.scbCounter++;
        $.wcbStore[$.scbCounter] = settings;

        // console.log($.wcbStore);

        /**
         * initial element
         * @param self
         */
        this.init = function (self) {
            $.lastx.title = settings.mainTitle;
            // hide element
            $(self).hide();
            // set placehodler
            var placeholder = 'Please select';
            // check place holder
            if ($(self).attr('placeholder') != undefined) {
                placeholder = $(self).attr('placeholder');
            }

            // init element for click for choose
            $(self).parent().append('<div class="wzcmb" data-wcounter="' +
                $.scbCounter + '" >' + placeholder + '</div>');

            // initial idx for use in naviagion
            settings.datatree = $.wcb.makeId('1', settings.datatree);
            // on click combowizard
            $(self).parent().find('.wzcmb').bind('click.open', function (e) {
                if (e.target !== this) {
                    return;
                }

                $.currentCounter = $(this).data('wcounter');
                $.lastx.title = $.wcbStore[$.currentCounter].mainTitle ;
                // check is open list
                if (!$(this).hasClass('active')) {

                    $.wcbStore[$.currentCounter].onOpen();
                    // find target for last value
                    $.wcb.target = $(this).parent().find('input');
                    // find select text position
                    $.wcb.text = $(self).parent().find('.wzcmb');
                    //if now list show list and countiniu
                    $(this).append('<ul id="wzcmb-list"></ul>');
                    // show first list main cat in list

                    $.wcb.showTree($.wcbStore[$.currentCounter].datatree);
                    // slide down list
                    $("#wzcmb-list").slideDown(function () {
                        $(document).bind('click.handlewsc', function (e) {
                            if (!$(event.target).is(".wzcmb-childer, .wzcmb-back")) {
                                $.wcb.resetClose();
                                $("#wzcmb-list").slideUp(200, function () {
                                    $(this).remove();
                                });
                                $($.wcb.text).removeClass('active');
                            }
                            e.preventDefault();
                            return false;
                        });
                    });
                    // add active class for check  is open
                    $(this).addClass('active');

                } else {
                    // if click not in main element
                    if (e.target !== this)
                        return;
                    // hide and remove list
                    $(this).removeClass('active');
                    $("#wzcmb-list").slideUp(100, function () {
                        // $.wcb.resetClose();
                        $(this).remove();
                    })
                }
            });

            //reset
            $(document).off('click', '#wzcmb-list li');
            // on click items
            $(document).on('click', '#wzcmb-list li', function () {
                // hast child
                if ($(this).hasClass('wzcmb-childer')) {
                    // make navigation
                    let tmp = {
                        title: $.lastx.title,
                        id: $.lastx.id
                    };
                    $.navigatex.push(tmp);
                    $.lastx.title = $(this).text();
                    $.lastx.id = $(this).data('id');
                    // show child items
                    $("#wzcmb-list").addClass('anim out');
                    $.wcb.showTree($.wcb.findTree($.wcbStore[$.currentCounter].datatree, $(this).data('id')));
                    var ax = setTimeout(function () {
                        $("#wzcmb-list").removeClass('anim out');
                    }, 500);

                } else if ($(this).hasClass('wzcmb-back')) { // if click on back
                    if ($.navigatex[$.navigatex.length - 1] != undefined) {
                        // roll back navigtaion to last
                        $.lastx.title = $.navigatex[$.navigatex.length - 1].title;
                        $.lastx.id = $.navigatex[$.navigatex.length - 1].id;
                    } else {
                        // check is navigation emoppty set def
                        $.lastx.title = $.wcbStore[$.currentCounter].mainTitle;
                        $.lastx.id = '';
                    }
                    // pop last navigation item
                    $.navigatex.pop();
                    // get parent list
                    var lst = $.wcb.findTree($.wcbStore[$.currentCounter].datatree, $(this).data('id'));
                    // if has not parent show main cat
                    $("#wzcmb-list").addClass('anim out');
                    if (lst.length == 0) {
                        $.wcb.showTree($.wcbStore[$.currentCounter].datatree);
                    } else {
                        // then show parent list
                        $.wcb.showTree(lst);
                    }
                    var ax = setTimeout(function () {
                        $("#wzcmb-list").removeClass('anim out');
                    }, 500);

                } else { // choose value
                    // set main input value
                    $($.wcb.target).val($(this).data('value'));
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
        this.showTree = function (list, cb) {
            var content = '';
            // clear li list
            $("#wzcmb-list li").remove();
            // back button handle
            // has parent need back button
            if ($.navigatex.length !== 0) {
                // if navigation is empity not need back button
                let back = $.navigatex[$.navigatex.length - 1];
                content += '<li class="wzcmb-back" data-id="' + back.id + '"> &nbsp;' + back.title + '</li>';
            }
            // show list passed to function
            for (const ix in list) {
                let item = list[ix];
                // ad childs
                // check has child
                if (item.child.length == 0) {
                    var clsx = ' class=""';
                } else {
                    var clsx = ' class="wzcmb-childer"';
                }
                // li to list
                content += '<li' + clsx + ' data-id="' + item.idx + '"  data-value="' + item.value + '">' + item.title + '</li>';
            }
            $("#wzcmb-list").html(content);
            if (cb !== undefined) {
                cb();
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

        /**
         * reset values on close
         */
        this.resetClose = function () {
            $.wcbStore[$.currentCounter].onClose();
            // reset navagtion value
            $.navigatex = [];
            $.lastx = {
                title: $.wcbStore[$.currentCounter].mainTitle,
                id: ''
            };

            // reset docuemnt bind
            $(document).unbind('click.handlewsc');
        };
        this.setValue = function (newValue) {
            var currentInnerText = this.html();
            this.html(currentInnerText + " " + newValue)
        };
        this.each(function () {
            $.wcb.init(this);
        });
        return this;

    };

}(jQuery));