# Jquery Tree Select

Tree select plugin for jquery

## installation

+ npm:
    + `npm i x-tree-select`
+ yarn:
    + `yarn add x-tree-select`

## Usage

+ Include css file:
    + ```html
        <link rel="stylesheet" href="../dist/x-tree-select.css">
      ```

+ Include js file:
    + ```html
        <script src="../dist/x-tree-select.js"></script>
      ```

+ Add to input:
```html
    <input type="text"
       name="test"
       id="test"
       placeholder="plz select"/>
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

## how use in webpack
+ import the module: 

``import xtreeselec from 'x-tree-select';``
+ add your element:

``<input type="text" name="test" class="treeSelect" placeholder="plz select"/>``

+ initialze the element with js:
```javascript
$(".treeSelect").treeSelect({
        datatree: [
            // your json here
        ]
      });
```

+ for example in webpack vuejs
```html
<template>
    <div>
        <input type="text" name="test" class="treeSelect" placeholder="plz select"/>
    </div>
</template>
<script>

  import xtreeselec from 'x-tree-select';
  export default {
    name: "mycompnent",
    data: function () {
      return {
         // ... 
      }
    },
    mounted: function () {
      
      $(".treeSelect").treeSelect({
        datatree: [
            // ...
        ]
      });

    }
  }
</script>

<style scoped>

</style>
```

## Options
The tree select options you can customize your plugine usagae

| Option | Default | Description |
| ------ | ------ | ------ | 
| `direction`| ltr | you can use rtl too for your project|
| `datatree`| []| The data need navigate in tree select watch abow example to how bind this value|
|`mainTitle`| "Main category"| The title of back button to main category list |
|`transition`| "fade"| The change page animation transition effect |
|`json`| `{title: 'title',value: 'value',child: 'child'}`| The json for your data tree key names you can change keys|
| `selectablePrernt`| false | Is the parent selectable |

## events
The event you can use for tree select

### onOpen
 Triggered when opening select input
 sample:
 ```javascript
 $("#tree-select").treeSelect({
     onOpen: function(){
         alert('opened');
     }
 });
```  
### onClose
 Triggered when closing select input
 sample:
 ```javascript
 $("#tree-select").treeSelect({
     onClose: function(){
         alert('closed');
     }
 });
```  
          
### onSelect
 Triggered when selecting select input
 sample:
 ```javascript
 $("#tree-select").treeSelect({
     onSelect: function(selected){
         console.log(selected);
     }
 });
```  

### onChange
 Triggered when change select input value
 sample:
 ```javascript
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

you can see online demo (example) here:

http://4xmen.ir/github_example/tree-select/demo/
