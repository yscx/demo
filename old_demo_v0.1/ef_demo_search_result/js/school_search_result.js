// JavaScript Document

/*
//START 性能检测 
window.time_marker = [];

var add_marker = function( key ){
	window.time_marker.push( {
		'key':key,
		'now':Date.now()
	} );
}

var caculate_marker = function(){
	var last_time = 0;
	for( var i=0;i<window.time_marker.length;i++ ){
		//console.log(window.time_marker[i].key + ' dur:' + ( parseInt(window.time_marker[i].now) - parseInt(last_time) ) );
		last_time = window.time_marker[i].now;
	}
	window.time_marker = [];
}

//END 性能检测 
*/

//generate random INT
echoLabJS.fRandomBy = function(under, over){
		switch(arguments.length){
				case 1: return parseInt(Math.random()*under+1);
				case 2: return parseInt(Math.random()*(over-under+1) + under);
				default: return 0;
		}
} 

jQuery(function () {
  jQuery('.js_school_re_result_tpl').each(function () {
		
    var $root = jQuery(this);
    var $view_mode_items = $root.find('.js_view_mode_item');
    var $view_panels = $root.find('.js_view_mode_panel');
    var $filter_options = $root.find('.js_filter_option');
    var $total_result_num = $root.find('.js_total_result_num');

    var animate_speed = 400;
    var animate_style = '';
    var gmap_icon_type = 'school';
    var gmap_icon_url = './images/en/map_location_icon_school.png';
    var zoom_size = 12;


    //列表模式部分的元素
    var $vl_tr_tpl = $root.find('.js_view_list_tr_tpl');
    var $vl_tr_tpl_copy = $vl_tr_tpl.clone();
    var $vl_tbd = $root.find('.js_tbd_info_table tbody');


    //地图模式部分的元素
    var $vm_list_wrap = $root.find('.js_locator_list_wrap');
    var $vm_list = $root.find('.js_locator_list');
    var $vm_list_switch = $root.find('.js_locator_list_switch');
    var $vm_map_area_wrap = $root.find('.js_map_area_wrap');
    var $vm_map_area = $root.find('.js_map_area');
		
		
		
		//loading
		$list_loading = jQuery('.js_list_loading');
		$result_empty = jQuery('.js_result_empty');
		
		
		var ajax_start = function(){
			$list_loading.show();
		}
		
		var ajax_end = function(){
			$list_loading.hide();
		}
		
		
		
		//js_scroll_area
		var $scroll_area = jQuery('.js_scroll_area');
		$scroll_area.jScrollPane({
			mouseWheelSpeed:50
		});
		var scroll_api = $scroll_area.data('jsp');
		
		
		//global var
		window.school_list = [];
		
		// map
		window.map_markers_da = [];
		window.gmap_map_view = {};
		map_inited = false;
		var infowindow = null;
		
		var remove_all_map_markers = function(){
			for( var i=0;i<map_markers_da.length;i++ ){
				map_markers_da[i].setMap(null);
				map_markers_da[i] = null;
			}
			map_markers_da = [];
		}//end function remove_all_map_markers()		
	
		var add_map_marker = function( data ){			
			var marker = new google.maps.Marker(data);			
			google.maps.event.addListener(marker, 'click', function( arg1,arg2  ) {				
				if (infowindow) {
					infowindow.close();
				};
				infowindow = new google.maps.InfoWindow({
					content: '<a href="'+marker.url+'">' + marker.title + '</a>'
				});				
				infowindow.open(gmap_map_view,marker);				
				$vm_list.find('.js_locator_item').eq(marker.index - 1).addClass('active').siblings().removeClass('active');				
			});
			marker.setMap(gmap_map_view);
			map_markers_da.push(marker);
			return marker;
		}//end function add_map_marker()
		
		function init_map( latlng,zoom ){
			var map_options = {
				zoom: zoom,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			window.gmap_map_view = new google.maps.Map(document.getElementById("map_view_map"),map_options);
			map_inited = true;
		}//end function init_map()
				

        //START function rewrite_map()
		function rewrite_map(){			
			$vm_list.empty();
			remove_all_map_markers();			
			google.maps.event.trigger(gmap_map_view, "resize");
			
			var da = window.school_list;			
			var html_all_da = [];
			var coords = [];			
			var bounds = new google.maps.LatLngBounds();
			
			for( var i=0;i<da.length;i++ ){
				var html = '<div data-coordinate="'+da[i].coordinate+'" class="locator_item js_locator_item" data-sid="'+da[i].sid+'" data-index="'+(i+1)+'">'+
					'<div class="item_inner"> <span class="num">'+(i+1)+'</span>'+
						'<div class="des">'+
							'<a class="tit" href="javascript:;">'+da[i].school_name+'</a>'+
						'</div>'+
					'</div>'+
				'</div>';
				
				html_all_da.push(html);
				
				var dx = parseFloat(da[i].coordinate.split(',')[0]);
				var dy = parseFloat(da[i].coordinate.split(',')[1]);
				var coord = new google.maps.LatLng( dx,dy );
				
				coords.push({
					'lat':dx,
					'lng':dy,
					'coord':coord,
					'title':da[i].school_name,
					'url':da[i].school_link,
					'icon':gmap_icon_url
				});
				
				bounds.extend(coord);				
			};
			
			
			if ( coords.length == 1 ){
				var padding = 0.005;
				bounds.extend( new google.maps.LatLng( coords[0].lat-padding,coords[0].lng-padding ) );
				bounds.extend( new google.maps.LatLng( coords[0].lat+padding,coords[0].lng+padding ) );
			};
			
			jQuery(html_all_da.join('')).appendTo($vm_list);
			
			$vm_list.find('.js_locator_item').click(function(){
				var $_this = jQuery(this);
				var coordinate = $_this.data('coordinate');
				var idx = $_this.data('index');
				var marker = map_markers_da[idx-1];
				var dx = parseFloat(coordinate.split(',')[0]);
				var dy = parseFloat(coordinate.split(',')[1]);
				var coord = new google.maps.LatLng( dx,dy );
				var padding = 0.005;
				var bounds = new google.maps.LatLngBounds( new google.maps.LatLng( dx-padding,dy-padding ),new google.maps.LatLng( dx+padding,dy+padding ) );
				gmap_map_view.fitBounds(bounds);
				google.maps.event.trigger( marker,'click' );
			});
			
			// init map
			//marker
			var center = bounds.getCenter();
			if ( !map_inited ){
				init_map(center,10);
			};
			gmap_map_view.fitBounds(bounds);
			
			for( var i=0;i<coords.length;i++ ){
				var marker = add_map_marker({
					position: coords[i].coord,
					icon: gmap_icon_url,
					url: coords[i].url,
					title: coords[i].title,
					index:i+1
				});
			};
			
			//update scroll_api
			scroll_api.reinitialise();			
			
		}//end function rewrite_map
		
		
		
    function rewriteInfo(info_obj) {
			
			var s_list_array = info_obj['school_query'];
			
            window.school_list = s_list_array;
			$vl_tbd.empty();
			
			if ( info_obj.total_result_num == 0 ){
				$result_empty.show();
				return;
			}else{
				$result_empty.hide();
			};
			
			//add_marker( 'rewriteInfo start' );

			//add_marker( 'empty end' );
			
			//$total_result_num.html(info_obj.total_result_num);
			
			//add_marker( 'total_result_num end' );
			
			//add_marker( 's_list_array end' );
			
			var len_s_list = s_list_array.length;
      
			//add_marker( 'len_s_list end' );
			
			var html_tr = '';
            var html_locator_item = '';
			var html_full_da = [];
			
			
			//add_marker( 'list loop start' );
			
      for (var i = 0; i < len_s_list; i++) {
        var this_item = s_list_array[i];
        var sid = this_item['sid'];
        var school_name = this_item['school_name'];
		var school_campus = !!(this_item['school_campus']) ? (' ('+this_item['school_campus']+')'):('');
        var school_link = this_item['school_link'];
        var school_addr = this_item['school_addr'];
        var coordinate = this_item['coordinate'];
		

        var s_district_tit = this_item['s_district_tit'];
        var programme_array = this_item['programme'];
        var len_programme = programme_array.length;
        var html_programme = '';
				
				
		//add_marker( 'programme loop start' );
				
        for (var j = 0; j < len_programme; j++) {
          var _this_ = programme_array[j];
          var p_tit = _this_['title'];
          var p_fee = _this_['fee'];
          var has_p = _this_['has_p'];

          if (!has_p) { //如果没有该课程
            html_programme = html_programme + '<td class="pcell js_td" data-rel="' + p_tit + '" data-fee="-2"><div class="pcell_inner">' + '<span class="i14_x">&nbsp;</span></div></td>';
          } else { //如果该课程存在
            if ( !! p_fee) { //如果填写了fee值
              html_programme = html_programme + '<td class="pcell js_td" data-rel="' + p_tit + '" data-fee="' + p_fee + '"><div class="pcell_inner">' + '<span class="s_price">¥<em>' + p_fee + '</em></span></div></td>';
            } else { //如果fee值没有填写
              html_programme = html_programme + '<td class="pcell js_td" data-rel="' + p_tit + '" data-fee="-1"><div class="pcell_inner">' + '<span class="s_price_blank">No price information</span></div></td>';
            }; //end if else						
          }; //end if else
        }; //end for 
				
        html_programme = html_programme + '</tr>';
        
				
				//add_marker( 'programme loop end' );
				
				html_tr = '<tr class="js_tr" data-sid="' + sid + '"><td class="first pcell js_td" data-rel="name"><div class="pcell_inner"><div class="s_tit"><a class="js_school_tit_link" href="' + school_link + '">' + school_name  + school_campus + '</a></div><div class="js_school_locator_pop_link"><a class="js_pop_gmap" href="pop_google_map.html" title="' + s_district_tit + '" data-gmap-tit="' + school_name + '" data-coordinate="' + coordinate + '" data-gmap-icon-url="' + gmap_icon_url + '"><span class="icon_location_l">' + s_district_tit + '</span></a></div></div></td>';

                //一行完整的tr html        
                html_tr = html_tr + html_programme;
				html_full_da.push(html_tr);
      }; //end for		
      
			//add_marker( 'list loop end' );		
			
			
			jQuery(html_full_da.join('')).appendTo($vl_tbd);
			//add_marker( 'html to obj end' );
			
			$vl_tbd.find('tr').find('td:last').addClass('last');
			//add_marker( 'add last class end' );
			
			$vl_tbd.find('.js_pop_gmap').show_in_popGmap();
			//add_marker( 'js_pop_gmap end' );
			

			//重绘地图
			rewrite_map();
			
			
      //setMarkerToMap($vm_map_area[0],marker_array,zoom_size,marker_click_callback,callback_params);			
    } //end function rewriteInfo()


    $vm_list_switch.click(function () {
      if (jQuery(this).hasClass('active')) {
        jQuery(this).removeClass('active');
        $vm_list_wrap.css({
          'left': -232
        });
        $vm_map_area_wrap.css({
          'width': 658
        });
      } else {
        jQuery(this).addClass('active');
        $vm_list_wrap.css({
          'left': 0
        });
        $vm_map_area_wrap.css({
          'width': 435
        });
      }; //end if else
			
	  google.maps.event.trigger(gmap_map_view, "resize");
			
    });


    //两种 view_mode 切换
    $view_mode_items.each(function () {
      var $this = jQuery(this);

      $this.click(function (idx) {
        if (!$this.hasClass('active')) {
          var view_mode = $this.attr('data-view-mode');
          $view_mode_items.removeClass('active');
          $this.addClass('active');
          $view_panels.hide().filter('[data-view-mode="' + view_mode + '"]').show();
          if (view_mode == 'map') {
			  rewrite_map();						
          }; //end if
        }; //end if
      }); //end reg click
    }); //end $view_mode_items.each
    
	jQuery('input[name=area]').change(function () {
      update_list();
    });

    jQuery('input[name=type]').change(function () {
      update_list();
    });

    //update_list

    function update_list() {
			
      var sql = jQuery('input[name=sql]').val();
      var academic = jQuery('input[name=academic]').val();
	  var district = jQuery('input[name=district]').val();
	  var area2 = jQuery('input[name=area2]').val();
			
			
			
      var area = [];
      jQuery('input[name=area]:checked').each(function () {
        area.push(jQuery(this).val());
      });
      area = area.join(',');

      var type = [];
      jQuery('input[name=type]:checked').each(function () {
        type.push(jQuery(this).val());
      });
      type = type.join(',');
			
			
      var data = {
        'sql': sql,
        'area': area,
        'type': type,
        'academic': academic,
		'district':district,
		'area2':area2
      };
			
			//add_marker( 'ajax start' );

			
			ajax_start();
			$vm_list.empty();
			remove_all_map_markers();
			$vl_tbd.empty();
			$result_empty.hide();
			
			
      jQuery.ajax({
        'type': 'POST',
        'data': 'filename='+echoLabJS.fRandomBy(1,3).toString(),
        'url': 'school_search_result.php',
        'success': function (data, textStatus, jqXHR) {
					
					ajax_end();
					//add_marker( 'ajax end' );
					
         // if (textStatus == "success") {
		if(1){
            if (data && typeof data == "string" && data != "") {
              var json_data = jQuery.parseJSON(data);
              
							
							//add_marker( 'rewriteInfo start' );
							rewriteInfo(json_data);
            	//add_marker( 'rewriteInfo end' );
						
							//caculate_marker();
							
						} else {


            }
          }

        }
      });


    }//end function update_list()

		
		
		function sort_list( key , order ){
			//console.log( key + ' ' + order );
			
			var order_da = [];
			
			$vl_tbd.find('tr').each(function(index){
				order_da.push({
					'index':index,
					'obj':jQuery(this),
					'value':parseInt(jQuery(this).find('[data-rel='+key+']').data('fee'))
				});
			});
			
			var sort_func_desc = function( a,b ){//降序 decrease order
				var av = a.value;
				var bv = b.value;
				return bv - av;
			};
			
			var sort_func_asc = function( a,b ){//升序 ascending order
				var av = a.value;
				var bv = b.value;
				
				if( av>0 && bv>0 ){
					return av-bv;
				}else if( av<0 && bv<0 ){
					return bv-av;
				}else if( av<0 && bv>0 ){
					return 1;	
				}else if( av>0 && bv<0 ){
					return -1;
				};
				
			};
			
			if ( order == 'desc' ){
				order_da.sort(sort_func_desc);
			}else{
				order_da.sort(sort_func_asc);
			};
			//console.log(order_da);
			
			for( var i=0;i<order_da.length;i++ ){
				order_da[i].obj.appendTo($vl_tbd);
			};
			
		} //end function sort_list()
		
		
		jQuery('.js_sort_btn').click(function(){
			var $_this = jQuery(this);
			var key = $_this.data('rel');
			var order = $_this.data('order');
			
			if ( typeof order == 'undefined' ){
				order = 'desc';
			}else if( order == 'desc' ){
				order = 'asc';
			}else if ( order == 'asc' ){
				order = 'desc';
			};
			
			$_this.data('order',order);
			
			if ( order=='desc' ){
				$_this.find('span').removeClass().addClass('i10_sort_arrow_brown_down');
			}else{
				$_this.find('span').removeClass().addClass('i10_sort_arrow_brown_up');
			};
			
			$_this.siblings('.js_sort_btn').find('span').removeClass().addClass('i10_sort_arrow_brown_none');
			
			sort_list( key , order );
			
			return false;
		});
		
		

    //初始化		
    $view_mode_items.eq(0).trigger('click');
    
		//add_marker( 'update_list start' );
		
		update_list();
		
		
		jQuery('.js_blue_bubble').each(function(){
			var $bubble = jQuery(this);
			var $btn_close = $bubble.find('.js_close_blue_bubble');
			$btn_close.click(function(){
				$bubble.fadeOut();
			});
		});

  });
})