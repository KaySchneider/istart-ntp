/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
(function($) {
    var dragging, placeholders = $();
    $.fn.sortable = function(options) {
        var method = String(options);
        options = $.extend({
            connectWith: false
        }, options);
        return this.each(function() {
            if (/^enable|disable|destroy$/.test(method)) {
                var items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
                if (method == 'destroy') {
                    items.add(this).removeData('connectWith items')
                    .off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
                }
                return;
            }
            var isHandle, index, items = $(this).children(options.items);
            var addOnClasses = this.getAttribute('class');

            var placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');

            items.find(options.handle).mousedown(function() {
                isHandle = true;
            }).mouseup(function() {
                isHandle = false;
            });
            $(this).data('items', options.items);
            placeholders = placeholders.add(placeholder);
            if (options.connectWith) {
                $(options.connectWith).add(this).data('connectWith', options.connectWith);
            }
            items.attr('draggable', 'true').on('dragstart.h5s', function(e) {
              
                
                if (options.handle && !isHandle) {
                    return false;
                }

                var classListname =  ' ';
                var max =  this.classList.length;
                for(var i=0; i <= max;i++) {
                    var name = this.classList.item(i);
                    classListname += ' ' + name;
                }
                $(placeholder).removeClass();
                $(placeholder).addClass(classListname + ' sortable-placeholder');
                isHandle = false;
                var dt = e.originalEvent.dataTransfer;
                dt.effectAllowed = 'move';
                dt.setData('Text', 'dummy');
                var isHelper = $(this).attr('masterid');
                if(isHelper != undefined) {
                    dt.setData('Text', isHelper);
                }
                
                index = (dragging = $(this)).addClass('sortable-dragging').index();
             
            }).on('dragend.h5s', function(e,ev) {
                $(this).show();
                if (!dragging) {
           
                    return;
                }
              
                placeholders.detach();
                try {
                    var master = ev.originalEvent.dataTransfer.getData('Text');
                } catch(e) {
                    var master =  'dummy';
                }
                if (index != dragging.index()) {
                    dragging.parent().trigger('sortupdate', {
                        item: dragging,
                        masterid:  master
                    });
                }
                dragging = null;
          
            }).not('a[href], img').on('selectstart.h5s', function() {
                this.dragDrop && this.dragDrop();
                return false;
            }).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
                if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
                    return true;
                }
                //console.log(e.type, placeholder.index() < $(this).index());

                if (e.type == 'drop') {
                    //check if the element was an subelement
                    if($(this).attr('masterid') != undefined || $(this).hasClass('metrohelper') || $(this).parent().hasClass('metrohelper')) {
                        return false;
                    }
                    e.stopPropagation();
                    placeholders.filter(':visible').after(dragging);
                    dragging.trigger('dragend.h5s',[e]);
                    return false;
                }
                e.preventDefault();
                e.originalEvent.dataTransfer.dropEffect = 'move';
                if (items.is(this)) {
                    if (options.forcePlaceholderSize) {
                        placeholder.height(dragging.outerHeight());
                    }
                    dragging.hide();
                    var position = -1;
                    var posCol = -1;

                    for(item in document.getElementsByClassName('sortable-placeholder')) {

                        if( typeof (document.getElementsByClassName('sortable-placeholder')[item]) == 'object') {
                            //we have found an node Element now we transform this element this is the parent Element show it!
                            ////console.log(document.getElementsByClassName('sortable-placeholder')[item] );
                            ////console.log(document.getElementsByClassName('sortable-placeholder')[item].parentNode.childNodes);
                            var nodeLists = document.getElementsByClassName('sortable-placeholder')[item].parentNode.childNodes;
                            //search my own node
                            for(var sub in nodeLists) {
                                if(nodeLists[sub] === document.getElementsByClassName('sortable-placeholder')[item]) {
                                 //   //console.log("FOUND MYSELF on Position: " + sub, $(this).index());
                                    position = sub;
                                    position++;
                                } else if(nodeLists[sub] === this) {
                                 //   //console.log("FOUND THE COLLISIONS ELEMENT at POSITION :" + sub);
                                    posCol = sub;
                                    posCol++;
                                }
                            }
                            //now we count
                        }
                        ////console.log(document.getElementsByClassName('sortable-placeholder')[item],item, typeof (document.getElementsByClassName('sortable-placeholder')[item]) );
                    }
                    if(position === -1) {
                        position = placeholder.index();
                    }
                    if(posCol === -1) {
                        posCol = $(this).index();
                    }
                    ////console.log(document.getElementsByClassName('sortable-placeholder').parentElement);
                    ////console.log(document.getElementsByClassName('sortable-placeholder'));
                    ////console.log(this );
                    ////console.log("MY:" + position + "  COMPARE WITH COLLIDE: " + posCol,position < posCol,this);
                    ////console.log(e.timeStamp);
                    if(position < posCol) {
                        placeholders.detach();
                        $(this).before(placeholder);
                        ////console.log("AFTER");
                    } else {
                        var doLi =document.createElement('li').classList.add('tile');
                        placeholders.detach();
                        $(this).after(placeholder);
                        ////console.log("BEFORE");

                    }
                    //$(this)[position >  posCol ? 'after' : 'before'](placeholder);

                } else if  (!placeholders.is(this) && !$(this).children(options.items).length) {
                  //  //console.log("APPEND PLACEHOLDER!!!  APPEND APPEND ");
                    $(this).append(placeholder);
                }
                return false;
            });
        });
    };
})(jQuery);