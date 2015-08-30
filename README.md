### Angular Mobile Keyboard - Angular virtual keyboard directive

###  Quick Links
-  [Demo] (#demo)
-[Installation] (#installation)
	- [Bower](#install-with-bower)
	
	
# Demo

[Click here to show u how it works.](http://angular-mobile)

# Installation
#### Install with Bower
```sh
$ bower install angular-mobile-keyboard
```

#### Adding dependency to your project

First you need to add the basic scripts and stylesheets into your project.
```html
<link rel="stylesheet" type="text/css" href="/dist/css/keyboard.css" />
```
```html
<script type="text/javascript" src="/dist/js/angular-mobile-keyboard.js"></script>
```

Add `ngKeyboard` to your app module.
```js
angular.module("yourApp", ["ngKeyboard"]);
```

Add `ng-keyboard` tag into your input field. The value is the type of the keyboards. 
```html
//This way you will have two different keyboard so that you can click the `switch` button to change your button.
<input type="text" ng-model="name" ng-keyboard="ABC 123" />

//With this way you will have only number keyboard.
<input type="text" ng-model="phone" ng-keyboard="123" />

```





