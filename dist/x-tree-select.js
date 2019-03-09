/*
 *  x-tree-select - v1.2.1
 *  Tree select for jquery.
 *  
 *
 *  Made by 4xmen
 *  Under GPL-3.0 License
 */
;(function ($) {
    "use strict";
    $.fn.treeSelect = function (options) {


        $.treeselect_animation = {
            'none': '',
            'x-flip': 'anim xout',
            'fade': 'xfade',
            'slide': 'xslide'
        }

        // set default store for setting
        if ($.trsStore === undefined) {
            $.scbCounter = -1;
            $.trsStore = [];
            $.currentCounter = 0;
        }

        // make app var for use in plugin
        $.trs = this;

        // change plugin info
        var settings = $.extend({
            datatree: [],
            transition: 'fade',
            direction: 'ltr',
            onOpen: function () {
            },
            OnSelect: function (selected) {
            },
            OnChange: function (oldVal, newVal) {
            },
            onClose: function () {
            },
            mainTitle: 'Main category',
            json: {
                title: 'title',
                value: 'value',
                child: 'child'
            }
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
        $.trsStore[$.scbCounter] = settings;

        // console.log($.trsStore);

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
            if ($(self).attr('placeholder') !== undefined) {
                placeholder = $(self).attr('placeholder');
            }

            // set rtl class if is rtl
            var rtlClass = '';
            if ($.trsStore[$.scbCounter].direction === 'rtl') {
                rtlClass = 'trs-rtl';
            }

            // init element for click for choose
            $(self).parent().append('<div class="trsel ' + rtlClass + '" data-trcounter="' +
                $.scbCounter + '" >' + placeholder + '</div>');

            // initial idx for use in naviagion
            settings.datatree = $.trs.makeId('1', settings.datatree);
            // on click combowizard
            $(self).parent().find('.trsel').bind('click.open', function (e) {
                if (e.target !== this) {
                    return;
                }

                $.currentCounter = $(this).data('trcounter');
                $.lastx.title = $.trsStore[$.currentCounter].mainTitle;
                // check is open list
                if (!$(this).hasClass('active')) {

                    $.trsStore[$.currentCounter].onOpen();
                    // find target for last value
                    $.trs.target = $(this).parent().find('input');
                    // find select text position
                    $.trs.text = $(self).parent().find('.trsel');
                    //if now list show list and countiniu
                    $(this).append('<ul id="trsel-list"></ul>');
                    if ($.trsStore[$.currentCounter].navx === undefined) {
                        // show first list main cat in list
                        $.trs.showTree($.trsStore[$.currentCounter].datatree);
                    } else {
                        $.lastx = $.trsStore[$.currentCounter].lastx;
                        $.navigatex = $.trsStore[$.currentCounter].navx;
                        $.trs.showTree($.trs.findTree($.trsStore[$.currentCounter].datatree, $.trsStore[$.currentCounter].lastx.id));
                    }
                    // slide down list
                    $("#trsel-list").slideDown(function () {
                        $(document).bind('click.handvarrsl', function (e) {
                            if (!$(e.target).is(".trsel-childer, .trsel-back")) {
                                $.trs.resetClose();
                                $("#trsel-list").slideUp(200, function () {
                                    $(this).remove();
                                });
                                $($.trs.text).removeClass('active');
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
                    $("#trsel-list").slideUp(100, function () {
                        // $.trs.resetClose();
                        $(this).remove();
                    })
                }
            });

            //reset
            $(document).off('click', '#trsel-list li');
            // on click items
            $(document).on('click', '#trsel-list li', function () {
                // hast child
                if ($(this).hasClass('trsel-childer')) {
                    // make navigation
                    var tmp = {
                        title: $.lastx.title,
                        id: $.lastx.id
                    };
                    $.navigatex.push(tmp);
                    $.lastx.title = $(this).text();
                    $.lastx.id = $(this).data('id');


                    // transtion ;
                    $("#trsel-list").addClass($.treeselect_animation[$.trsStore[$.currentCounter].transition]);


                    var xself = this;
                    var ax = setTimeout(function () {
                        // show child items
                        $.trs.showTree($.trs.findTree($.trsStore[$.currentCounter].datatree, $(xself).data('id')));
                        // remove effect
                        $("#trsel-list").removeClass($.treeselect_animation[$.trsStore[$.currentCounter].transition]);
                    }, 600);

                } else if ($(this).hasClass('trsel-back')) { // if click on back
                    if ($.navigatex[$.navigatex.length - 1] !== undefined) {
                        // roll back navigtaion to last
                        $.lastx.title = $.navigatex[$.navigatex.length - 1].title;
                        $.lastx.id = $.navigatex[$.navigatex.length - 1].id;
                    } else {
                        // check is navigation emoppty set def
                        $.lastx.title = $.trsStore[$.currentCounter].mainTitle;
                        $.lastx.id = '';
                    }
                    // pop last navigation item
                    $.navigatex.pop();
                    // get parent list
                    var lst = $.trs.findTree($.trsStore[$.currentCounter].datatree, $(this).data('id'));
                    // if has not parent show main cat
                    $("#trsel-list").addClass($.treeselect_animation[$.trsStore[$.currentCounter].transition]);

                    var ax = setTimeout(function () {
                        if (lst.length === 0) {
                            $.trs.showTree($.trsStore[$.currentCounter].datatree);
                        } else {
                            // then show parent list
                            $.trs.showTree(lst);
                        }
                        $("#trsel-list").removeClass($.treeselect_animation[$.trsStore[$.currentCounter].transition]);
                    }, 600);

                } else { // choose|select value
                    // OnChange event
                    $.trsStore[$.currentCounter].OnChange({
                        value: $($.trs.target).val(),
                        text: $($.trs.text).clone()    //clone the element
                            .children() //select all the children
                            .remove()   //remove all the children
                            .end()  //again go back to selected element
                            .text()
                    }, {
                        value: $(this).data('value'),
                        text: $(this).text()
                    });
                    // set main input value
                    $($.trs.target).val($(this).data('value'));
                    // set choosed test
                    $($.trs.text).text($(this).text());
                    // if selected is not first level store level & last titles
                    if ($.navigatex.length > 0) {
                        $.trsStore[$.currentCounter].navx = $.navigatex;
                        $.trsStore[$.currentCounter].lastx = $.lastx;
                    } else {
                        delete $.trsStore[$.currentCounter].navx;
                        delete $.trsStore[$.currentCounter].lastx;
                    }
                    // remove active class and hide list
                    $($.trs.text).removeClass('active');
                    // OnChange
                    $.trsStore[$.currentCounter].OnSelect({
                        value: $(this).data('value'),
                        text: $(this).text()
                    });
                    $("#trsel-list").slideUp(100, function () {
                        $(this).remove();
                    })
                }
            });
        };

        /**
         * make idx for navigatopm
         * @param base base prefix for id
         * @param lst list of json
         * @returns {Array}
         */
        this.makeId = function (base, lst) {
            var all = [];
            // each item of list
            for (var ix in lst) {
                var itm = lst[ix];
                // add prefix + - + counter
                var prefix = base + '-' + (parseInt(ix) + 1);
                itm.idx = prefix;
                //if there is no child object, just create it
                if (itm[$.trsStore[$.scbCounter].json.child] === undefined) {
                    itm[$.trsStore[$.scbCounter].json.child] = [];
                }
                // if has child
                if (itm[$.trsStore[$.scbCounter].json.child].length !== 0) {
                    // recall this function for children
                    itm[$.trsStore[$.scbCounter].json.child] = $.trs.makeId(prefix, itm[$.trsStore[$.scbCounter].json.child]);
                }
                all.push(itm);
            }
            return all;
        };

        /**
         * show list into selector
         * @param list
         * @param cb
         */
        this.showTree = function (list, cb) {
            var content = '';
            // clear li list
            $("#trsel-list li").remove();
            // back button handle
            // has parent need back button
            if ($.navigatex.length !== 0) {
                // if navigation is empity not need back button
                var back = $.navigatex[$.navigatex.length - 1];
                content += '<li class="trsel-back" data-id="' + back.id + '"> &nbsp;' + back.title + '</li>';
            }
            // show list passed to function
            for (var ix in list) {
                var item = list[ix];
                // ad childs
                // check has child
                var clsx = ' class="trsel-childer"';
                if (item[$.trsStore[$.currentCounter].json.child].length === 0) {
                    clsx = ' class=""';
                }
                // li to list
                content += '<li' + clsx + ' data-id="' + item.idx + '"  data-value="' + item[$.trsStore[$.currentCounter].json.value] + '">' + item[$.trsStore[$.currentCounter].json.title] + '</li>';
            }
            $("#trsel-list").html(content);
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
            for (var ix in list) {
                var item = list[ix];
                if (item.idx === idx) {
                    return item[$.trsStore[$.currentCounter].json.child];
                }
            }
            // if not fond in first level each the childs
            for (var ix in list) {
                var item = list[ix];
                if (item[$.trsStore[$.currentCounter].json.child].length !== 0) {
                    var tmp = $.trs.findTree(item[$.trsStore[$.currentCounter].json.child], idx);
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
            $.trsStore[$.currentCounter].onClose();
            // reset navagtion value
            $.navigatex = [];
            $.lastx = {
                title: $.trsStore[$.currentCounter].mainTitle,
                id: ''
            };

            // reset docuemnt bind
            $(document).unbind('click.handvarrsl');
        };
        this.setValue = function (newValue) {
            var currentInnerText = this.html();
            this.html(currentInnerText + " " + newValue)
        };
        this.each(function () {
            $.trs.init(this);
        });
        return this;

    };

}(jQuery));