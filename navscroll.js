function NavScroll(options){
    // merge any options passed into contructor into `this`
    mergeOptionsIntoContext(this, options || {});
    this.initScrollerButtons();

    return this
}

NavScroll.prototype = {
    scrollBarWidths : 40
    , containerID : '#tabNav'
    , hiddenLeft : []
    , isWrapped : function(){
      var tab = $(this.containerID + ' li.tab').first();
      return tab.parent().height() > tab.height() + tab.height() - 5
    }
    , getTabs : function(){
      return $(this.containerID + ' li.tab').filter(function(){ return $(this).data('anchor')>1 })
    }
    , tabsHiddenRight : function(tf){
      var tabs = this.getTabs()
      , leftmax = 0 
      , maxIndex = -1

      , hiddentabs = tabs.filter(function(index){ 
        var hidden
        , left = $(this).position().left
        ;

        if(index > maxIndex && left >= leftmax){
          leftmax = left;
          maxIndex = index;
        }else
         hidden = true;  
      
        return hidden 
      })

      return this.isWrapped() && ( tf ? hiddentabs.length > 0 : hiddentabs )
    }

    , tabsHiddenLeft : function(tf){
      var hidden = this.getTabs().filter(function(a){ return $(this).hasClass('no-width') })
      return tf ? hidden.length > 0 : hidden 
    }
    , areTabsHidden : function (){
        return this.tabsHiddenLeft(true) || this.tabsHiddenRight(true)
    }

    , navWidth : function (selector){
      return $(this.containerID).width()
    }

    , checkScrollButtons : function(timeout){
      var self = this;
      return setTimeout(function(){
          if(self.tabsHiddenLeft(true))
            $('.scroller-left').addClass('visible')
          else
            $('.scroller-left').removeClass('visible')
          
          if(self.tabsHiddenRight(true))
            $('.scroller-right').addClass('visible')
          else
            $('.scroller-right').removeClass('visible')
      }, timeout || 0)
    }

    , scrollRight : function() {
      var hide = this.getTabs()
        .filter(function(a){ return !$(this).hasClass('no-width') })
        .first()
      , width = hide.data('width') || hide.width() + 5
      ;

      if(hide.length===0)
        return console.log('nothing to hide')

      hide
        .data('width', width )
        .css('width', width )
        .addClass('no-width')

      this.hiddenLeft.push(hide);
   
      this.checkScrollButtons(350);
    }

    , scrollLeft : function() {
      var show = this.hiddenLeft.pop();

      if(show){
        show.removeClass('no-width');
      }

      this.checkScrollButtons(350);
    }

    , initScrollerButtons : function(){
        $('.scroller-right').on('click', this.scrollRight.bind(this));
        $('.scroller-left').on('click', this.scrollLeft.bind(this));
    }

    , displayRightArrow : function() {
      var innerWidth = $('.panel-body').innerWidth()
      , tabsWidth = 0
      ;
      $('.tab').each(function(n, tab){ tabsWidth += $(tab).width() });

      if ( innerWidth < tabsWidth )
        $('.scroller-right').addClass('visible');
    }
}