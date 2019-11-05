;(function ($) {
    "use strict";
    $.fn.treeSelect = function (options) {
        $.treeselect_animation = {
            'none': '',
            'x-flip': 'anim xout',
            'fade': 'xfade',
            'slide': 'xslide'
        };

        // set default store for setting
        if ($.xtsStore === undefined) {
            $.scbCounter = -1;
            $.xtsStore = [];
            $.currentCounter = 0;
        }

        // make app var for use in plugin
        $.xts = this;

        // change plugin info
        var settings = $.extend({
            datatree: [],
            transition: 'fade',
            direction: 'ltr',
            onOpen: function () {
            },
            onSelect: function (selected) {
            },
            onChange: function (oldVal, newVal) {
            },
            onClose: function () {
            },
            selectablePrernt: false,
            mainTitle: 'Main category',
            json: {
                title: 'title',
                value: 'value',
                child: 'child'
            },
            searchable: false,
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
        $.xtsStore[$.scbCounter] = settings;

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

            var elCls = '';
            // set rtl class if is rtl
            if ($.xtsStore[$.scbCounter].direction === 'rtl') {
                elCls = 'xts-rtl';
            }

            // init element for click for choose
            $(self).parent().append('<div class="xtsel ' + elCls + '" data-trcounter="' +
                $.scbCounter + '" >' + placeholder + '</div>');


            // initial idx for use in naviagion
            settings.datatree = $.xts.makeId('1', settings.datatree);
            // on click combowizard
            $(self).parent().find('.xtsel').bind('click.open', function (e) {
                if (e.target !== this) {
                    return;
                }

                var xtsel = $(this);

                if (xtsel.hasClass("loading")) {
                    return;
                }

                xtsel.addClass("loading");
                setTimeout(function () {
                    xtsel.removeClass("loading");
                }, 600);

                $.currentCounter = $(this).data('trcounter');
                $.lastx.title = $.xtsStore[$.currentCounter].mainTitle;
                // check is open list
                if (!$(this).hasClass('active')) {

                    $.xtsStore[$.currentCounter].onOpen();

                    if ($.xtsStore[$.currentCounter].searchable) {
                        var listCls = ' class="xts-searcable" ' ;
                        // create search event
                        $(document).on('keyup', "#xtsel-list .srch", function () {
                            // console.log();
                            var c = $(this).closest('.xtsel').data('trcounter');
                            var q = $(this).val();
                            if (q.length == 0) {
                                $.xts.showTree($.xtsStore[c].datatree);
                                $("#xtsel-list .srch").focus();
                                return false;
                            }
                            var b = $.xts.searchShow(c, q, $.xtsStore[c].datatree);
                            $("#xtsel-list .xli").remove();
                            $("#xtsel-list").append(b);
                        });
                    } else {
                        var listCls = '' ;
                    }

                    // find target for last value
                    $.xts.target = $(this).parent().find('input');
                    // find select text position
                    $.xts.text = $(self).parent().find('.xtsel');
                    //if now list show list and countiniu
                    $(this).append('<ul'+listCls+' id="xtsel-list"></ul>');
                    if ($.xtsStore[$.currentCounter].navx === undefined) {
                        // show first list main cat in list
                        $.xts.showTree($.xtsStore[$.currentCounter].datatree);
                    } else {
                        $.lastx = $.xtsStore[$.currentCounter].lastx;
                        $.navigatex = $.xtsStore[$.currentCounter].navx;
                        $.xts.showTree($.xts.findTree($.xtsStore[$.currentCounter].datatree, $.xtsStore[$.currentCounter].lastx.id));
                    }
                    // slide down list
                    $("#xtsel-list").slideDown(function () {
                        $(document).bind('click.handvarrsl', function (e) {
                            if (!$(e.target).is(".xtsel-childer, .xtsel-back, .search, .srch")) {
                                $.xts.resetClose();
                                $("#xtsel-list").slideUp(200, function () {
                                    $(this).remove();
                                });
                                $($.xts.text).removeClass('active');
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
                    $("#xtsel-list").slideUp(100, function () {
                        // $.xts.resetClose();
                        $(this).remove();
                    });
                }
            });

            //reset
            $(document).off('click', '#xtsel-list li');
            // on click items
            $(document).on('click', '#xtsel-list li', function (e) {
                // has child & no parent selecatble
                if ($(this).hasClass('xtsel-childer') && !$(e.target).hasClass('xtsel-selectable')) {
          
                    // Prevent pushing "tmp" to the navigatex if clicked repeatedly while in transition which messes up the history
                    if ($("#xtsel-list").addClass($.treeselect_animation[$.xtsStore[$.currentCounter].transition])) {
                        return;
                    }
                  
                    // make navigation
                    var tmp = {
                        title: $.lastx.title,
                        id: $.lastx.id
                    };
                    $.navigatex.push(tmp);
                    $.lastx.title = $(this).text();
                    $.lastx.id = $(this).data('id');


                    // transtion ;
                    $("#xtsel-list").addClass($.treeselect_animation[$.xtsStore[$.currentCounter].transition]);


                    var xself = this;
                    var ax = setTimeout(function () {
                        // show child items
                        $.xts.showTree($.xts.findTree($.xtsStore[$.currentCounter].datatree, $(xself).data('id')));
                        // remove effect
                        $("#xtsel-list").removeClass($.treeselect_animation[$.xtsStore[$.currentCounter].transition]);
                    }, 600);

                } else if ($(this).hasClass('xtsel-back')) { // if click on back
                  
                    // Prevent issue when repeatedly clicking back
                    if ($("#xtsel-list").addClass($.treeselect_animation[$.xtsStore[$.currentCounter].transition])) {
                        return;
                    }
                  
                    if ($.navigatex[$.navigatex.length - 1] !== undefined) {
                        // roll back navigtaion to last
                        $.lastx.title = $.navigatex[$.navigatex.length - 1].title;
                        $.lastx.id = $.navigatex[$.navigatex.length - 1].id;
                    } else {
                        // check is navigation emoppty set def
                        $.lastx.title = $.xtsStore[$.currentCounter].mainTitle;
                        $.lastx.id = '';
                    }
                    // pop last navigation item
                    $.navigatex.pop();
                    // get parent list
                    var lst = $.xts.findTree($.xtsStore[$.currentCounter].datatree, $(this).data('id'));
                    // if has not parent show main cat
                    $("#xtsel-list").addClass($.treeselect_animation[$.xtsStore[$.currentCounter].transition]);

                    var ax = setTimeout(function () {
                        if (lst.length === 0) {
                            $.xts.showTree($.xtsStore[$.currentCounter].datatree);
                        } else {
                            // then show parent list
                            $.xts.showTree(lst);
                        }
                        $("#xtsel-list").removeClass($.treeselect_animation[$.xtsStore[$.currentCounter].transition]);
                    }, 600);
                } else if ($(e.target).hasClass('search') || $(e.target).hasClass('srch')) {
                    // console.log('x');
                } else { // choose|select value

                    // onChange event
                    $.xtsStore[$.currentCounter].onChange({
                        value: $($.xts.target).val(),
                        text: $($.xts.text).clone()    //clone the element
                            .children() //select all the children
                            .remove()   //remove all the children
                            .end()  //again go back to selected element
                            .text()
                    }, {
                        value: $(this).data('value'),
                        text: $(this).text()
                    });
                    // set main input value
                    $($.xts.target).val($(this).data('value'));
                    // set choosed test
                    $($.xts.text).text($(this).text());
                    // if selected is not first level store level & last titles
                    if ($.navigatex.length > 0) {
                        $.xtsStore[$.currentCounter].navx = $.navigatex;
                        $.xtsStore[$.currentCounter].lastx = $.lastx;
                    } else {
                        delete $.xtsStore[$.currentCounter].navx;
                        delete $.xtsStore[$.currentCounter].lastx;
                    }
                    // remove active class and hide list
                    $($.xts.text).removeClass('active');
                    // onChange
                    $.xtsStore[$.currentCounter].onSelect({
                        value: $(this).data('value'),
                        text: $(this).text(),
                        id: $(this).data('id'),
                        parent: $.lastx,
                        ancestors: $.navigatex
                    });
                    $("#xtsel-list").slideUp(100, function () {
                        $(this).remove();
                    });
                }
            });

            if ($(self).attr('value') != undefined && $(self).val() != '' && $(self).val() != null) {
                this.setDefault($.scbCounter, $(self).val());
            }
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
                if (itm[$.xtsStore[$.scbCounter].json.child] === undefined) {
                    itm[$.xtsStore[$.scbCounter].json.child] = [];
                }
                // if has child
                if (itm[$.xtsStore[$.scbCounter].json.child].length !== 0) {
                    // recall this function for children
                    itm[$.xtsStore[$.scbCounter].json.child] = $.xts.makeId(prefix, itm[$.xtsStore[$.scbCounter].json.child]);
                }
                all.push(itm);
            }
            return all;
        };

        /**
         * show list into selector
         * @param list
         * @param cb callback
         */
        this.showTree = function (list, cb) {
            var content = '';
            // clear li list
            $("#xtsel-list li").remove();

            // back button handle
            // has parent need back button
            if ($.navigatex.length !== 0) {
                // if navigation is empity not need back button
                var back = $.navigatex[$.navigatex.length - 1];
                content += '<li class="xtsel-back" data-id="' + back.id + '"> &nbsp;' + back.title + '</li>';
            } else {
                // if has no parent
                // search element
                content += '<li class="search"> <input type="search" class="srch" placeholder="search..." value=""> </li>'

            }
            // show list passed to function
            for (var ix in list) {
                var item = list[ix];
                // ad childs
                // check has child
                var clsx = ' class="xli xtsel-childer"';
                var select = '';
                if (item[$.xtsStore[$.currentCounter].json.child].length === 0) {
                    clsx = ' class="xli"';
                } else {
                    if ($.xtsStore[$.currentCounter].selectablePrernt) {
                        select = '<span class="xtsel-selectable"></span>';
                    }
                }

                // li to list
                content += '<li' + clsx + ' data-id="' + item.idx + '"  data-value="' + item[$.xtsStore[$.currentCounter].json.value] + '">' + select + item[$.xtsStore[$.currentCounter].json.title] + '</li>';
            }
            $("#xtsel-list").html(content);
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
                    return item[$.xtsStore[$.currentCounter].json.child];
                }
            }
            // if not fond in first level each the childs
            for (var ix in list) {
                var item = list[ix];
                if (item[$.xtsStore[$.currentCounter].json.child].length !== 0) {
                    var tmp = $.xts.findTree(item[$.xtsStore[$.currentCounter].json.child], idx);
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
         * find item for default
         * @param list of function
         * @param val value must be match
         * @param c counter of tree select
         * @param parent the parent value
         * @returns {jQuery|*|boolean|boolean|*}
         */
        this.findItem = function (list, val, c, parent) {
            parent = parent || null;
            // add navigate
            if (parent != null) {
                $.navigatex.push({
                    id: parent.idx,
                    title: parent[$.xtsStore[c].json.title]
                });
            } else {
                $.navigatex.push({
                    id: "",
                    title: $.xtsStore[c].mainTitle
                });
                $.lastx.title = $.xtsStore[c].mainTitle;
                $.lastx.id = '';
            }
            // each all
            for (var ix in list) {
                var item = list[ix];
                if (item[$.xtsStore[c].json.value] == val) {
                    return item;
                }
                // if has child
                if (item[$.xtsStore[c].json.child] != undefined && item[$.xtsStore[c].json.child].length > 0) {
                    // add last
                    $.lastx = {
                        id: item.idx,
                        title: item[$.xtsStore[c].json.title]
                    };
                    var back = this.findItem(item[$.xtsStore[c].json.child], val, c, item);
                    if (back != false) {
                        return back;
                    }
                }
            }

            $.navigatex.pop();
            return false;

        }


        this.searchShow = function (c, q, items) {
            var content = '';
            var select = '';
            if ($.xtsStore[c].selectablePrernt) {
                select = '<span class="xtsel-selectable"></span>';
            }
            for (var ix in items) {
                var clsx = ' class="xli" ';
                var itm = items[ix];
                if (itm[$.xtsStore[c].json.title].toString().indexOf(q) !== -1 || itm[$.xtsStore[c].json.value].toString().indexOf(q) !== -1) {
                    if (itm[$.xtsStore[c].json.child] != undefined && itm[$.xtsStore[c].json.child].length > 0) {
                        clsx = ' class="xli xtsel-childer" ';
                        content += '<li' + clsx + ' data-id="' + itm.idx + '"  data-value="' + itm[$.xtsStore[c].json.value] + '">' + select + itm[$.xtsStore[c].json.title] + '</li>';
                        content += $.xts.searchShow(c, q, itm[$.xtsStore[c].json.child]);
                    } else {
                        content += '<li' + clsx + ' data-id="' + itm.idx + '"  data-value="' + itm[$.xtsStore[c].json.value] + '">' + itm[$.xtsStore[c].json.title] + '</li>';
                    }
                } else {
                    if (itm[$.xtsStore[c].json.child] != undefined && itm[$.xtsStore[c].json.child].length > 0) {
                        content += $.xts.searchShow(c, q, itm[$.xtsStore[c].json.child]);
                    }
                }
            }
            return content;

        }

        /**
         * set def value initial
         * @param c counter
         * @param val value of input
         */
        this.setDefault = function (c, val) {
            // find value
            var back = $.xts.findItem($.xtsStore[c].datatree, val, c);
            // if is exits val
            if (back != false) {
                $.xtsStore[c].lastx = $.lastx;
                $.navigatex.pop();
                $.xtsStore[c].navx = $.navigatex;
                $("[data-trcounter='" + c + "']").text(back[$.xtsStore[c].json.title]);
            }
        };

        /**
         * reset values on close
         */
        this.resetClose = function () {
            $.xtsStore[$.currentCounter].onClose();
            // reset navagtion value
            $.navigatex = [];
            $.lastx = {
                title: $.xtsStore[$.currentCounter].mainTitle,
                id: ''
            };
            // reset docuemnt bind
            $(document).unbind('click.handvarrsl');
            $(document).off('keyup', "#xtsel-list .srch");
        };
        this.setValue = function (newValue) {
            var currentInnerText = this.html();
            this.html(currentInnerText + " " + newValue)
        };
        this.each(function () {
            $.xts.init(this);
        });
        return this;

    };

}(jQuery));