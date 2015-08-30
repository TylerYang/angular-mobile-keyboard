(function(global) {
    var keyboardApp = angular.module("ngMobileKeyboard", []);
    var config = {
        kbId: "virtualKb",
        dev: true
    };
    var activeEvent = "ontouchstart" in window ? "touchstart" : "click";
    function isContains(p, c) {
        while(p != c && c != null) {
            c = c.parentElement;
        }
        return c != null;
    }


    keyboardApp.directive("ngKeyboard", ["$rootScope", "$document", function($rootScope, $document) {
        return {
            restrict: "A",
            link: function(scope, ele, attrs) {
                var kbStr = attrs.ngKeyboard;                    
                var trimPattern = /^\s+|\s+&/;
                var kbTypes = [];
                var targetEle = ele[0];
                ele.attr("readonly", true);


                angular.forEach(kbStr.split(" "), function(kb) {
                    var str = kb.toUpperCase();
                    if(str.length > 0) kbTypes.push(str); });
                if(kbTypes.length == 0) {
                    throw new Error("Invalid ng-keyboard value." );
                }

                ele.bind("focus", function() {
                    ele.addClass("kb-input-highlight");
                    $rootScope.$broadcast("showKeyboard", {
                        target: targetEle,
                        keyboardTypes: kbTypes 
                    });
                });
                
                if(config.dev) {
                    setTimeout(function() {
                        ele[0].focus();
                        window.ele = ele[0];
                    }, 0);
                }
            }
        }
    }]);
    keyboardApp.directive("ngKeyboardBody", ["$document", function($document) {
        return {
            restrict: "E",
            templateUrl: "template/ngKeyboard.html",
            link: function(scope, ele, attrs) {
                var targetEle = null;
                var bufferValue = "";
                var updateTimer = null;

                scope.kbTypes = [];
                scope.active = false;
                scope.kbIdx = -1;
                scope.isCap = false;

                initialKeyboardEvents(); 

                scope.$on("showKeyboard", function(evt, data) {
                    scope.kbTypes = data.keyboardTypes;
                    targetEle = data.target;

                    addAutoHideEvent();
                    preventDocumentMove();
                    
                    showKeyboard();
                    if(!scope.$$phase) {
                        scope.$apply();
                    }
                });

                scope.$on("hideKeyboard", hideKeyboard);

                scope.showCurrKb = function(str) {
                    return str == scope.kbTypes[scope.kbIdx];    
                };

                scope.switchKb = function() {
                    scope.kbIdx = (++scope.kbIdx) % $scope.kbTypes.length;
                };

                scope.showKeyboard = function() {
                    return scope.kbIdx != -1;
                };
                
                scope.getNextKbName = function() {
                    return scope.kbTypes[(scope.kbIdx + 1) % scope.kbTypes.length];
                };
                scope.getSwitchCharText = function() {
                    return scope.isNum ? "#+=": "123";   
                };

                function showKeyboard() {
                    scope.kbIdx = 0;
                }

                function hideKeyboard() {
                    removeAutoHideEvent();
                    removeDocumentMoveHandler();

                    scope.kbIdx = -1;
                    if(!scope.$$phase) {
                        scope.$apply();
                    }
                }
                function preventDocumentMove() {
                    $document.bind("touchmove");
                }
                function removeDocumentMoveHandler() {
                    $document.unbind("touchmove", moveHandler);
                }
                function moveHandler(e) {
                    e.preventDefault();
                }
                function addAutoHideEvent() {
                    $document.bind(activeEvent, documentHandler);
                }
                function removeAutoHideEvent() {
                    $document.unbind(activeEvent, documentHandler);
                }
                function documentHandler(evt) {
                    if(evt.target == targetEle || isContains(ele[0], evt.target)) {
                        return;
                    }
                    hideKeyboard();
                }

                function initialKeyboardEvents() {
                    var kbCtner = angular.element(document.getElementById(config.kbId));
                    var buttons = kbCtner.find("button");
                    buttons.bind(activeEvent, function(event) {
                        if(isNormalButton(this)) {
                            var newVal = getNextValue.apply(this);
                            updateTargetEleValue(newVal);
                        } else {
                            funcs[this.getAttribute("data-func")]();
                        }
                        if(!scope.$$phase) scope.$apply();
                    });
                    //disable right click 
                    return;
                    if(config.dev == true) return;
                    document.getElementById(config.kbId).oncontextmenu = function() {
                        return false;
                    };
                }

                function getNextValue() {
                    var newVal = null;
                    var c = this.getAttribute("data-value") || this.innerHTML;
                    if(scope.isCap == false) {
                        c = c.toLowerCase();
                    }
                    if(!bufferValue) {
                        newVal = c;
                    } else {
                        newVal = bufferValue + c;
                    }
                    return newVal;
                }

                function updateTargetEleValue(value) {
                    bufferValue = value; 
                    if(updateTimer) {
                        clearTimeout(updateTimer);
                        updateTimer == null
                    }
                    updateTimer = setTimeout(function() {
                        targetEle.value = bufferValue; 
                        updateTimer = null;
                    }, 10);
                }
                function isNormalButton(button) {
                    return !button.getAttribute("data-func");
                }

                var funcs = {
                    backspace: function() {
                        if(!bufferValue) return;
                        newValue = bufferValue.substring(0, bufferValue.length - 1);
                        updateTargetEleValue(newValue); 
                    },
                    caps: function() {
                        scope.isCap = !scope.isCap; 
                    },
                    enter: function() {

                    },
                    switch: function() {
                        scope.isNum = true;
                        return scope.kbIdx = (scope.kbIdx + 1) % scope.kbTypes.length;
                    },
                    switchChar: function() {
                        scope.isNum = !scope.isNum; 
                    }
                }

            }
        };
    }]);

    //no need to compile it manually
    //var injector = angular.element(document.body).injector();
    //var $compile = injector.get("$compile");
    if(!(document.getElementById(config.kbId))) {
        var ele = document.createElement("div");
        ele.innerHTML = "<ng-keyboard-body></ng-keyboard-body>";
        document.body.appendChild(ele.childNodes[0]);
    }
})(window);

angular.module("ngMobileKeyboard").run(["$templateCache", function($templateCache) {$templateCache.put("template/ngKeyboard.html","<div id=\"virtualKb\" class=\"kb-ctner\" ng-class=\"{\'active\': showKeyboard}\">\n    <ul ng-show=\"showCurrKb(\'ABC\')\">\n        <li>\n            <button>Q</button>\n            <button>W</button>\n            <button>E</button>\n            <button>R</button>\n            <button>T</button>\n            <button>Y</button>\n            <button>U</button>\n            <button>I</button>\n            <button>O</button>\n            <button>P</button>\n        </li>\n        <li>\n            <button>A</button>\n            <button>S</button>\n            <button>D</button>\n            <button>F</button>\n            <button>G</button>\n            <button>H</button>\n            <button>J</button>\n            <button>K</button>\n            <button>L</button>\n        </li>\n        <li>\n            <button class=\"func button-caps pull-left\" ng-class=\"{\'active\': isCap}\" data-func=\"caps\">Caps</button>\n            <button>Z</button>\n            <button>X</button>\n            <button>C</button>\n            <button>V</button>\n            <button>B</button>\n            <button>N</button>\n            <button>M</button>\n            <button class=\"func button-del pull-right\" data-func=\"backspace\">DEL</button>\n        </li>\n        <li>\n            <button class=\"func switch switch-num\" ng-disabled=\"getNextKbName() == kbTypes[kbIdx]\" data-func=\"switch\" ng-bind=\"getNextKbName()\"></button>\n            <button class=\"space\" data-value=\" \">space</button>\n            <button>.</button>\n            <button class=\"func enter\" data-func=\"enter\">Go</button>\n        </li>\n    </ul>\n    <ul ng-show=\"showCurrKb(\'123\')\">\n        <li ng-show=\"isNum\">\n            <button>1</button>\n            <button>2</button>\n            <button>3</button>\n            <button>4</button>\n            <button>5</button>\n            <button>6</button>\n            <button>7</button>\n            <button>8</button>\n            <button>9</button>\n            <button>0</button>\n        </li>\n        <li ng-show=\"isNum\">\n            <button>-</button>\n            <button>/</button>\n            <button>:</button>\n            <button>;</button>\n            <button>(</button>\n            <button>)</button>\n            <button>$</button>\n            <button>&</button>\n            <button>@</button>\n            <button>\"</button>\n        </li>\n\n        <li ng-show=\"!isNum\">\n            <button>[</button>\n            <button>]</button>\n            <button>{</button>\n            <button>}</button>\n            <button>#</button>\n            <button>%</button>\n            <button>^</button>\n            <button>*</button>\n            <button>+</button>\n            <button>=</button>\n        </li>\n        <li ng-show=\"!isNum\">\n            <button>_</button>\n            <button>\\</button>\n            <button>|</button>\n            <button>~</button>\n            <button data-value=\"<\"><</button>\n            <button data-value=\">\">></button>\n            <button>€</button>\n            <button>£</button>\n            <button>¥</button>\n            <button>•</button>\n        </li>\n        <li>\n            <button class=\"func pull-left switch\" data-func=\"switchChar\" ng-bind=\"getSwitchCharText()\"></button>\n            <button class=\"lg\">.</button>\n            <button class=\"lg\">,</button>\n            <button class=\"lg\">?</button>\n            <button class=\"lg\">!</button>\n            <button class=\"lg\">\'</button>\n            <button class=\"func button-del pull-right\" data-func=\"backspace\">DEL</button>\n        </li>\n        <li>\n            <button class=\"func switch switch-num\" data-func=\"switch\" ng-bind=\"getNextKbName()\"></button>\n            <button class=\"space\" data-value=\" \">space</button>\n            <button>.</button>\n            <button class=\"func enter\" data-func=\"enter\">Go</button>\n        </li>\n    </ul>\n</div>\n");}]);