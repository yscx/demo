// JavaScript Document
	//jiathis

	
	jQuery(function(){	
	

	
	//START 返回顶部
	echoLabJS.go2top();
	
	//页面高度最小为视口的高度，保证footer在最下方
	(function(){
	  if(jQuery('.page_wrap')){
		echoLabJS.fullHeight(jQuery('.page_wrap'));
	  };
	  
	  if(jQuery('.hp_wrap')){
		echoLabJS.fullHeight(jQuery('.page_wrap'));
	  };
	})();

	//cufon
	if(jQuery('.mod_blackboard h2.cufon_text')){
		 Cufon.replace('.mod_blackboard h2.cufon_text');
	};//end cufon
	
	//js_label_input
	jQuery('.js_label_input').each(function(){
		jQuery(this).label_input();
	});//end label_input()
	
	//simpleSubmit_parentForm
	jQuery('.js_simple_submit').each(function(){
		jQuery(this).simpleSubmit_parentForm();			
	});//end simpleSubmit_parentForm()
	
	//START js_tab
	jQuery('.js_tab').each(function(){
     jQuery(this).tab('click');
	});//END js_tab
	
	//START js_tab_hover
	jQuery('.js_tab_hover').each(function(){
     jQuery(this).tab('mouseover');
	});
	
	//水平slide gallery ,用在首页School News 模块
	jQuery('.js_slide_h').each(function(){
		jQuery(this).slide_h();
	});
	
	
	//js模拟下拉菜单
	jQuery('.js_select').each(function(){
		jQuery(this).select_simulator();
	});
	
	//简单fancybox弹出层
	jQuery('.js_popup_trigger').each(function(){
		reg_fancybox(jQuery(this));
	});
	
	//学校搜索结果页 tooltip提示
	jQuery('.js_ttip_box').each(function(){    
     jQuery(this).js_ttip();		 
	});	
	
	//START js_accordion 
	jQuery('.js_accordion').each(function(){
     jQuery(this).js_accordion();		
	});
	
	
	//js_print
	jQuery('.js_print').click(function(){
	   window.print();	
	});
	

    //START 学校搜索结果页 popup google map 只显示一个坐标
	jQuery('.js_pop_gmap').each(function(){
     jQuery(this).show_in_popGmap();		
	});//END 学校搜索结果页 popup google map 只显示一个坐标
	
	

	//START 学校搜索结果页排序	
  jQuery('.mod_se_result_school_list').each(function(){
		var $root = jQuery(this);		
		var $filter_options =  $root.find('.js_filter');
		var $trs = $root.find('tr.js_tr');
		var len_tr = $trs.length;
		
		var active_col_idx ={//参数‘simple_rule’：存储按照simple_rule规则简单显示/隐藏，当前激活的的列索引值；参数'order'存储：存储按照unicode_order编码大小重排行序,当前激活的的列索引值
		'simple_rule':[],
		'order':[]
		};
		
		//START function get_active_col_idx()
		function get_active_col_idx(){
			active_col_idx['simple_rule']=[];
			active_col_idx['order']=[];
			$root.find('.ts2_hd .col').each(function(idx){
				if(jQuery(this).hasClass('active_filter_div')){
					if(jQuery(this).attr('data-rule')=='simple_hide_show'){
						active_col_idx['simple_rule'].push(idx);
					}else if(jQuery(this).attr('data-rule')=='order'){
						active_col_idx['order'].push(idx);
					};//end if else					
				};//end if
			});//end each
		}
		//end function get_active_col_idx()
		
		//START function _filter(col_rel_val,rule)
		function _filter(rule){	
				var hidden_row_idx = [];//
				var show_row_idx =[];
				
				if(rule=='simple_hide_show'){//简单显示隐藏			
				   $trs.show();	
					 get_active_col_idx();
				   for(var j=0;j<active_col_idx['simple_rule'].length;j++){
							for(var k=0;k<len_tr;k++){
								var col_val = $trs.eq(k).find('td.js_td').eq(active_col_idx['simple_rule'][j]).find('.js_col_val').attr('data-val');//遍历第所有行的第idx列
								if(col_val=='0'){
									$trs.eq(k).hide();
									//$trs.eq(k).hide();								
								};//end if
							};//end for 
					 };//end for						
				}else{//按unicode编码顺序重排行的顺序
					
				};//end if else		
		}
		//end function _filter(rule)
		
		
		
		$filter_options.each(function(idx){//
			var $this = jQuery(this);			
			
			$this.click(function(){
				var rule = $this.attr('data-rule');
				
				if($this.hasClass('active_filter_div')){
					$this.removeClass('active_filter_div');
				}else{					
					$this.addClass('active_filter_div');						
				};//end if else
				
				_filter(rule);
				
			});//end $this reg click
			
		});//end $filter_options.each
		
	});//end 学校搜索结果页排序	
	
	
	
	//START house 搜索结果页 pop google map around： 
	jQuery('.js_pop_gmap_around').each(function(){
		var $this = jQuery(this);
		var locator_id = $this.attr('data-center-id');
		var center_type = $this.attr('data-center-type');
		var ajax_url = '';
		var zoom_size = 13;
		
		if(center_type=='house'){
			ajax_url = 'map_interface.html';
		}else if(center_type=='school'){
			ajax_url = 'school_map_interface.html';
		};
		
		function initialize(obj){
				var center_point = obj['center_corrdinate'];
				var centerLatLng = new google.maps.LatLng(center_point.split(',')[0], center_point.split(',')[1]);
				var locator_around_all_array =obj['around_list'];
				var len = locator_around_all_array.length;
				
				var markers = new Array();
				var region = "gb";
				var infowindowObj;
				var infowindow = new google.maps.InfoWindow();
				var map = new google.maps.Map(document.getElementById("map_canvas"), {
						center: centerLatLng,
						zoom:zoom_size,
						mapTypeId: google.maps.MapTypeId.ROADMAP
				});
				
				// 标志地址信息
				function addOverlay(map, marker,content) {					
					var infowindow = new google.maps.InfoWindow({
						content: content
					});
					google.maps.event.addListener(marker, 'mouseover', function () {
						if (infowindowObj) {
							infowindowObj.close();
						}
						infowindow.open(map, marker);
						infowindowObj = infowindow;
					});
				}
				
				//add center point
				(function(){
					var marker_center = new google.maps.Marker({
						  map: map,								  
						  position: centerLatLng,
						  icon: obj['center_icon_url'],
						  shadow:'./images/en/map_location_icon_shadow.png'									
					});
					var cont_center_html = '';
					switch(center_type){
						case 'house':
						cont_center_html = '<div class="gmap_ttip"><h4>'+obj["center_name"]+'</h4>'+'<span class="locator_addr">'+obj["center_address"]+'</span><div>';
						break;
						case 'school':
						cont_center_html = '<div class="gmap_ttip"><h4>' + obj['center_name'] + '</h4><div>';
						break;
					};
					 
					marker_center.setZIndex(9999);
					marker_center.setMap(map);
					addOverlay(map, marker_center, cont_center_html);
				})();

				/* get bounds object */
				function getBounds() {
						var bounds = new google.maps.LatLngBounds();
						var aroundPoint_Array = [];

						for (var i = 0; i < len; i++) {
							var lat = locator_around_all_array[i]['corrdinate'].split(',')[0];
							var lng = locator_around_all_array[i]['corrdinate'].split(',')[1];
							
							if ((lat != "") && (lng != "")) {
									var point = new google.maps.LatLng(lat, lng);										
									aroundPoint_Array.push(point);
							};//end if
						};//end for
						
						if (aroundPoint_Array.length > 0) {
							for (var j = 0; j < aroundPoint_Array.length; j++) {
									bounds.extend(aroundPoint_Array[j]);
							};//end for
						};//end if		
										
						return bounds;
				}
				
				
				// 标记地址
				function codeAddress() {
						var bounds = getBounds();
						if (!bounds.isEmpty()) {
								//map.fitBounds(bounds);								
						};//end if
						
						for (var i = 0; i < locator_around_all_array.length; i++) {
							var myLatLng = new google.maps.LatLng(locator_around_all_array[i]['corrdinate'].split(',')[0], locator_around_all_array[i]['corrdinate'].split(',')[1]);
							var marker = new google.maps.Marker({
								  map: map,
								  position: myLatLng,								 
								  icon: locator_around_all_array[i]['icon_url'],
								  shadow:'./images/en/map_location_icon_shadow.png'
							});
							
							var cont_html = '';
							switch(center_type){
								case 'house':
								cont_html = '<div class="gmap_ttip"><h4><a href="'+locator_around_all_array[i]['link']+'" target="_blank">' + locator_around_all_array[i]['name'] + '</a></h4><div>';
								break;
								case 'school':
								cont_html = '<div class="gmap_ttip"><h4>' + locator_around_all_array[i]['name'] + '</h4><span class="locator_addr">'+locator_around_all_array[i]["address"]+'</span><div>';
								break;

							};
							addOverlay(map, marker,cont_html);
							marker.setMap(map);
							marker.setZIndex(10);
						};//end for
				}//end fucntion codeAddress();

				// 初始化
				codeAddress();	
		};
		
		//reg click
		$this.click(function(){
			jQuery.ajax({
			   type:'POST',
			   url:ajax_url,
			   data:"id="+locator_id,
			   success:function(json){
				 var json_obj = jQuery.parseJSON(json);				 
				 var html = '<a href="pop_google_map_around.html"></a>';
				 var $temp = jQuery(html).css({'width':0,'height':0});
				 
				 $temp.appendTo(jQuery('body')).fancybox({
					  'padding':10,
					  'scrolling':'no',
					  'titleShow':false,					  
					  'onComplete':function(){
						  initialize(json_obj);							 	
					  },
					  'onClosed':function(){
						  $temp.remove();  
					  } 
				 });
				 
				 $temp.trigger('click');
				  		 
 
			   }
			});//end ajax
		});//end $this.click
	
	});//end house 搜索结果页  pop google map around: 显示一个中心坐标和多个周边坐标
	
	
	
	//START school detail page school branch number drop down effect
	jQuery('.js_tooltip').each(function(){
		var $root= jQuery(this);
		var $cont = $root.find('.js_tooltip_cont');
		var $key = $root.find('.js_tooltip_key');
		$cont.hide().slideUp();
		$key.click(function(){
			if($key.find('span').hasClass('active')){
				$key.find('span').removeClass('active');
				$cont.slideUp(300);
			}else{
				$key.find('span').addClass('active');
				$cont.slideDown(300);
			};
		});
	});//END school detail page school branch number drop down effect
	
	
	//main_nav
	jQuery('.main_nav li.lev_1').hover(function(){
				jQuery(this).siblings('li').removeClass('hover').end().addClass('hover');
		},function(){
		    jQuery(this).removeClass('hover');		
	});//end main_nav
	
	//main_nav
	jQuery('.js_nav li.lev_1').hover(function(){
			jQuery(this).siblings('li').removeClass('hover').end().addClass('hover');
		},function(){
		    jQuery(this).removeClass('hover');		
	});//end main_nav
		

	
	//table.ts1
	jQuery('.ts1').each(function(){
	  var $root = jQuery(this); 
	  $root.find('tbody tr:odd').each(function(){		  
		  jQuery(this).find('td,th').css({'background-color':'#faf8f9'});		  
	  });
	  $root.find('tbody tr:even').each(function(){
		  jQuery(this).find('td,th').css({'background-color':'#ffffff'});
	  });
	  $root.find('tbody tr:last').find('td,th').each(function(){
		  jQuery(this).css({'border-bottom':'none'});	
	  })
		$root.find('tr').each(function(){
		  jQuery(this).find('td:last,th:last').css({'border-right':'none'});	
	  })
	});//end jQuery('.ts1');
		
		
	//news_letter
	jQuery('.mod_newsletter').each(function(){
		var $root = jQuery(this);
		var $btn_submit = $root.find('.js_submit');
		var $form = $root.find('.jsv_form');
		$btn_submit.click(function(){
			if($form.validate_form()){
				$form.submit();
			}
		});
	});//end news_letter
	
	

	
	
	jQuery('#advanced_search_school_location_toggle_wrap').each(function(){
		var $root = jQuery(this);
		var $city_area_list = $root.next('.city_area_list');
		var $radios = $root.find('input:radio');
		
		function check(){
			var s = $radios.filter(':checked').attr('data-show');
			if(s=='yes'){
				$city_area_list.show();
			}else if(s=='no'){
				$city_area_list.hide();
			};//end if else
		}//end function show()
		
		check();
		$radios.change(function(){
		  check();	
		});	
		
	});//end jQuery('#advanced_search_school_location_toggle_wrap').each
	
	//backend form validation 验证表单提交按钮
	jQuery('.js_mm_backend_validation').each(function(){
		var $form = jQuery(this);	
		var $btn_submit = $form.find('.js_mmjs_jsv_submit');
		
		$form.MMJS_validation();
		
		$btn_submit.click(function(){		
			  if ( !$form.MMJS_validate() ){
				  return false;
			  }else{
				  $form.submit();
				  return true;
			  };
		});
		
	});//end backend form validation
	
	//backend form without validation 不需验证表单的提交按钮
	jQuery('.js_mm_backend_form').each(function(){
		var $form = jQuery(this);	
		var $btn_submit = $form.find('.js_mmjs_js_submit');
		
		$btn_submit.click(function(){	
			  $form.submit();
			  return false;
		});
		
	});//end backend form without validation	
	
	
})