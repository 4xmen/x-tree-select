# Jquery Tree Select

Tree select plugin for jquery

## installation

With npm:

`npm install tree-select`

## Usage

+ Include css file:

`<link rel="stylesheet" href="../dist/tree-select.css">`

+ Include js file:

`<script src="../dist/tree-select.js"></script>`

+ Add to input:
```html
<input type="text" name="test" id="test" placeholder="plz select"/>
<script>
        $("#test").treeSelect({
            mainTitle: 'x main cat',
            datatree: [{
                title: 'text1',
                value: 1,
                child: []
            }, {
                title: 'text2',
                value: 2,
                child: []
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
                            title: 'lv2 text5',
                            value: 5,
                            child: []
                        }
                    ]
                },
            ]
        });

</script>
```

## Demo

See `demo/index.html` for demo.