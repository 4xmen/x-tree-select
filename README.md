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
## Options
The tree select options you can customize your plugine usagae

| Option | Default | Description |
| ------ | ------ | ------ | 
| `direction`| ltr | you can use rtl too for your project|
| `datatree`| []| The data need navigate in tree select watch abow example to how bind this value|
|`mainTitle`| "Main category"| The title of back button to main category list |
|`json`| `{title: 'title',value: 'value',child: 'child'}`| The json for your data tree key names you can change keys|

##events
The event you can use for tree select

### onOpen
 Triggered when opening select input
 sample:
 ```
 $("#tree-select").treeSelect({
     onOpen: function(){
         alert('opened');
     }
 });
```  
### onClose
 Triggered when closing select input
 sample:
 ```
 $("#tree-select").treeSelect({
     onClose: function(){
         alert('closed');
     }
 });
```  
          
### onSelect
 Triggered when selecting select input
 sample:
 ```
 $("#tree-select").treeSelect({
     onSelect: function(selected){
         console.log(selected);
     }
 });
```  

### onChange
 Triggered when change select input value
 sample:
 ```
 $("#tree-select").treeSelect({
     onSelect: function(oldVal,newVal){
         console.log(oldVal,newVal);
     }
 });
```  
          
## Browser compatibility
- ![ie](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/archive/internet-explorer_9-11/internet-explorer_9-11_16x16.png) IE >= 9
- ![edge](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/edge/edge_16x16.png) Edge all version
- ![firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/firefox/firefox_16x16.png) Firefox >= 16
- ![safari](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/archive/safari_1-7/safari_1-7_16x16.png) Safari >=11
- ![chrom](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/chrome/chrome_16x16.png)/![chromium](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/chromium/chromium_16x16.png) chrome / chromium >= 26 
- ![opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/opera/opera_16x16.png) Opera >=15
- ![android](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/archive/android/android_16x16.png) Android browser >= 4.4
- Blackberry Browser >=  10
- ![ios safari](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/46.1.0/archive/safari-ios_1-6/safari-ios_1-6_16x16.png) iOS Safari >= 7

## Support
If you found a bug or have a feature suggestion, please submit it in the Issues tracker.

## Demo
See `demo/index.html` for demo.