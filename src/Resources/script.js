/**
 * Verone CRM | http://www.veronecrm.com
 *
 * @copyright  Copyright (C) 2015 Adam Banaszkiewicz
 * @license    GNU General Public License version 3; see license.txt
 */

(function() {
  var widgetEdited = null;
  var widgetStyles = ['widget-base', 'widget-primary', 'widget-success', 'widget-warning', 'widget-danger', 'widget-secondary', 'widget-info'];
  var widgetDefaults = { style: 'widget-base' };
  var widgetStyleSelected = 'widget-base';
  var widgetsPositions = [];

  var calculateWidth = function() {
    var width = $('.homepage-widgets').css('min-height', $(window).height() + 1000).width();

    $('.homepage-widgets').css('min-height', 0);

    return width;
  };

  var calculateWidgetBaseDimensions = function()
  {
    var result = [300, 300];
    var width  = calculateWidth();
    var breaks = [
      {
        from: 0,
        to: 599,
        max: 1
      },
      {
        from: 600,
        to: 767,
        max: 2
      },
      {
        from: 768,
        to: 995,
        max: 3
      },
      {
        from: 996,
        to: 1279,
        max: 4
      },
      {
        from: 1280,
        to: 1679,
        max: 5
      },
      {
        from: 1680,
        to: 1919,
        max: 6
      },
      {
        from: 1920,
        to: 2680,
        max: 7
      }
    ];

    for(var i in breaks)
    {
      if(breaks[i].from < width && breaks[i].to > width)
      {
        result = [(width / breaks[i].max) - 10, 300];
      }
    }

    return result;
  }

  var applyWidgetStyle = function(style) {
    for(var i in widgetStyles)
    {
      widgetEdited.removeClass(widgetStyles[i]);
    }

    widgetEdited.addClass(style);
  };

  $('.homepage-widgets .widget-options').click(function() {
    widgetEdited = $(this).closest('li');
    widgetDefaults.style = widgetEdited.attr('data-style');
    widgetStyleSelected  = widgetEdited.attr('data-style');
    $('#widget-edit').modal();
  });

  $('#widget-edit .widget-colors div').click(function() {
    $(this).parent().find('div').removeClass('active');
    applyWidgetStyle($(this).attr('class'));
    widgetStyleSelected = $(this).attr('class');
    $(this).addClass('active');
  });

  $('#widget-edit').bind('show.bs.modal', function() {
    $('#widget-edit .widget-colors div').removeClass('active');
    $('#widget-edit .widget-colors div.' + widgetDefaults.style).addClass('active');
  });
  $('#widget-edit .btn-cancel').click(function() {
    applyWidgetStyle(widgetDefaults.style);
  });
  $('#widget-edit .btn-save').click(function() {
    widgetDefaults.style = widgetStyleSelected;
    applyWidgetStyle(widgetDefaults.style);
    widgetEdited.attr('data-style', widgetDefaults.style);
    $('#widget-edit').modal('hide');
    gridsterSavePositions();
    return false;
  });

  var gridster = null;
  var gridsterSavePositions = function() {
    APP.AJAX.call({
      url : APP.createUrl('Home', 'Home', 'saveWidgetsPositions'),
      data     : {
        widgets : JSON.stringify(gridster.serialize()),
        width   : calculateWidth()
      }
    });
  };
  var gridsterCreate = function() {
    var width = calculateWidth();

    widgetsPositions = widgetsPositionsSource.options;

    for(var i in widgetsPositionsSource.sizes)
    {
      if(width == widgetsPositionsSource.sizes[i].width)
      {
        for(var j in widgetsPositions)
        {
          for(var k in widgetsPositionsSource.sizes[i].data)
          {
            if(widgetsPositionsSource.sizes[i].data[k].id == widgetsPositions[j].id)
            {
              widgetsPositions[j].col = widgetsPositionsSource.sizes[i].data[k].col;
              widgetsPositions[j].row = widgetsPositionsSource.sizes[i].data[k].row;
              widgetsPositions[j].x = widgetsPositionsSource.sizes[i].data[k].x;
              widgetsPositions[j].y = widgetsPositionsSource.sizes[i].data[k].y;
            }
          }
        }
      }
    }

    for(var i in widgetsPositions)
    {
      if(widgetsPositions[i].hasOwnProperty('col') == false)
        widgetsPositions[i].col = 1;
      if(widgetsPositions[i].hasOwnProperty('row') == false)
        widgetsPositions[i].row = 1;
      if(widgetsPositions[i].hasOwnProperty('x') == false)
        widgetsPositions[i].x = 1;
      if(widgetsPositions[i].hasOwnProperty('y') == false)
        widgetsPositions[i].y = 1;
    }

    $('.homepage-widgets li').each(function() {
      var details = {
        col: '1',
        row: '1',
        x: '1',
        y: '1',
        style: 'widget-base'
      };

      for(var i in widgetsPositions)
      {
        if(widgetsPositions[i].id == $(this).attr('id'))
        {
          details = widgetsPositions[i];
        }
      }

      $(this)
        .attr('data-row', details.row)
        .attr('data-col', details.col)
        .attr('data-sizex', details.x)
        .attr('data-sizey', details.y)
        .attr('data-style', details.style)
        .addClass(details.style);
    });

    gridster = $('.gridster ul').gridster({
      widget_margins: [5, 5],
      widget_base_dimensions: calculateWidgetBaseDimensions(),
      draggable: {
        handle: '.widget-head h2',
        stop: gridsterSavePositions
      },
      resize: {
        enabled: true,
        stop: gridsterSavePositions
      },
      serialize_params: function($w, wgd) {
        return {
          id: $w.attr('id'),
          col: wgd.col,
          row: wgd.row,
          x: wgd.size_x,
          y: wgd.size_y,
          style: $w.attr('data-style')
        };
      }
    }).data('gridster');

    setTimeout(function() {
      $('.homepage-widgets').css('opacity', 1);
    }, 150);
  };

  $(function() {
    gridsterCreate();
  });

  $(window).resize(function() {
    /**
     * @todo Reset all widgets to new width.
     */
    //gridsterCreate();
  });
})();
