var defJson = [
    {
    title: 'text1',
    value: 1,
    child: []
}, {
    title: 'text2',
    value: 2,
},
    {
        title: 'text3',
        value: 3,
        child: [
            {
                title: 'lv2 text3',
                value: 3,
                child: []
            },
            {
                title: 'lv2 text4',
                value: 4,
                child: [
                    {
                        title: 'lv3 text3',
                        value: 3,
                        child: []
                    },
                    {
                        title: 'lv3 text4',
                        value: 4,
                        child: []
                    },
                    {
                        title: 'lv3 text5',
                        value: 5,
                        child: []
                    },
                ]
            },
            {
                title: 'lv2 text5',
                value: 5,
                child: []
            }
        ]
    },
    {
        title: 'text4',
        value: 4,
        child: []
    },
    {
        title: 'text5',
        value: 5,
        child: []
    },
];

$(function () {

    $("h3").click(function () {
        $($(this).data('id')).slideToggle(500);
    });
    $("#test").treeSelect({
        datatree: defJson
    });


    $("#demo2").treeSelect({
        mainTitle: 'سرفصل های اصلی',
        direction: 'rtl',
        datatree: defJson
    });

    $("#demo3").treeSelect({
        transition: 'slide',
        selectablePrernt: true,
        datatree: defJson
    });

    $("#demo4").treeSelect({
        datatree: defJson,
        transition: 'none',
        onOpen: function () {
            console.log('onOpen event triggered');
        }, onClose: function () {
            console.log('onClose event triggered');
        }, OnSelect: function (sel) {
            console.log('onSelect event triggered secleted : ');
            console.log(sel);
        }, OnChange: function (oldv, newv) {
            console.log('OnChange event triggered old: ', oldv, 'new:', newv);
        }
    });

    $("#demo5").treeSelect({
        json: {
            title: 't',
            value: 'v',
            child: 'c'
        },
        datatree: [{
            t: '*** text1',
            v: 1,
            c: []
        }, {
            t: '*** text2',
            v: 2,
            c: []
        },
            {
                t: '*** text3',
                v: 3,
                c: [
                    {
                        t: '*** lv2 text3',
                        v: 3,
                        c: []
                    },
                    {
                        t: '*** lv2 text4',
                        v: 4,
                        c: [
                            {
                                t: '*** lv3 text3',
                                v: 3,
                                c: []
                            },
                            {
                                t: '*** lv3 text4',
                                v: 4,
                            },
                            {
                                t: '*** lv3 text5',
                                v: 5,
                                c: []
                            },
                        ]
                    },
                    {
                        t: '*** lv2 text5',
                        v: 5,
                        c: []
                    }
                ]
            },
            {
                t: '*** text4',
                v: 4,
                c: []
            },
            {
                t: '*** text5',
                v: 5,
                c: []
            },
        ]
    });
});