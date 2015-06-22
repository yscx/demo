/*
echo update 20120712

html5 Document Type required
jQuery 1.6+   required

*/






var echoLabJS = {};

//获取浏览器版本
echoLabJS.get_browserInfo=function(){
		var MzBrowser = {};
		var ieVersion ;
		
		if(MzBrowser.platform) return;
		var ua = window.navigator.userAgent;
		MzBrowser.platform = window.navigator.platform;
	
		MzBrowser.firefox = ua.indexOf("Firefox")>0;
		MzBrowser.opera = typeof(window.opera)=="object";
		MzBrowser.ie = !MzBrowser.opera && ua.indexOf("MSIE")>0;
		MzBrowser.mozilla = window.navigator.product == "Gecko";
		MzBrowser.netscape= window.navigator.vendor=="Netscape";
		MzBrowser.safari= ua.indexOf("Safari")>-1;
		
		if(MzBrowser.firefox){
			var re = /Firefox(\s|\/)(\d+(\.\d+)?)/;
		}else if(MzBrowser.ie){
			var re = /MSIE( )(\d+(\.\d+)?)/;
		}else if(MzBrowser.opera){
			var re = /Opera(\s|\/)(\d+(\.\d+)?)/;
		}else if(MzBrowser.netscape){
			var re = /Netscape(\s|\/)(\d+(\.\d+)?)/;
		}else if(MzBrowser.safari){
			var re = /Version(\/)(\d+(\.\d+)?)/;
		}else if(MzBrowser.mozilla){
			var re = /rv(\:)(\d+(\.\d+)?)/;
		};
	
		if(typeof(re)&&re.test(ua)!='undefined'){
			MzBrowser.version = parseFloat(RegExp.$2);
		};
		//console.log(MzBrowser.firefox)
		return MzBrowser;
}

echoLabJS.browserInfo = echoLabJS.get_browserInfo();


		//页面高度最小为视口的高度，保证footer在最下方
		echoLabJS.fullHeight = function($obj){
		  $obj.css({'min-height':(jQuery(window).innerHeight()-35)});
		};
		
		//返回顶部
		echoLabJS.go2top = function(){
			   var go2top_html = '<div class="js_go2top go2top_wrap"><a href="javascript:;" class="go2top">Back to top</a></div>';
			   jQuery(go2top_html).bind('click',function(){
				   jQuery('html, body').animate({scrollTop: 0 },600,function(){
						 jQuery('.js_go2top').hide();
				   });		 
			   }).appendTo('body');
			   
			   var _offset_top = 100;
			   
			   //REG
			   jQuery(window).bind('scroll resize',function(e){
					 var $window = jQuery(window);
					   var h = $window.scrollTop();
					   var H = $window.innerHeight();
					   if(h>0){
						   //jQuery('.js_go2top').css({'top':(h+H/2+_offset_top)}).show();
						   jQuery('.js_go2top').show();
					   };			 
					   if(h==0){
						  jQuery('.js_go2top').hide();
					   };
			   });	
		}
		
	/*
		//START js_go2top
		var go2top = function(){
			
			var len = jQuery('body').find('.js_go2top').length;
			var animate_speed = 500;
			if(len){
					var $window = jQuery(window);
					var h = $window.scrollTop();	
					var $go2top_copy = jQuery('body').find('.js_go2top').eq(0).clone();
					jQuery('body').find('.js_go2top').remove();
	
					$go2top_copy.bind('click',function(){
						 jQuery('html, body').animate({scrollTop: 0 },animate_speed,function(){
									$go2top_copy.hide();
						 });		 
					}).appendTo('body');
			 
					 if(h>0){
						 $go2top_copy.show();
					 };	
					 
			 //REG
			 jQuery(window).bind('scroll resize',function(e){
					 if($window.scrollTop()>0){
						 $go2top_copy.show();
					 };			 
					 if($window.scrollTop()==0){
						 $go2top_copy.hide();
					 };
			 });//END REG
		
			};//END if
		};//END function go2top()
*/	


	 
		function jqfn_open_fancybox(url,fancybox_settings){		
			if(!!fancybox_settings){
				fancybox_settings = {'padding':0,'scrolling':'no'};
			}else{
				
			};//end if else
			
			var html = '<a href="'+url+'" class="js_fancybox_dy_hook"></a>';
			jQuery(html).appendTo(jQuery('body'));
			var $hook = jQuery('body').find('.js_fancybox_dy_hook');
			$hook.fancybox(fancybox_settings);
			$hook.trigger('click');
		}
	
		function reg_fancybox($obj){
			$obj.fancybox({
				'padding':0,
				'scrolling':'no'
			});
		}
	


/*
//START js_tab
HTML STRUCTRUE

<div class="js_tab">
	<div class="js_tab_holder">
		<ul>
			<li>tab1</li>
			<li>tab2</li>
		</ul>
	</div>
	<div class="js_tab_cont">
		<div class="js_tab_panel">tab1 content</div>
		<div class="js_tab_panel">tab2 content</div>
	</div>
</div>
*/

jQuery.fn.extend({
	tab:function(trigger_type_str){
		
			var $root = jQuery(this);
			var $li = $root.find('.js_tab_holder li');
			var $tab_panels = $root.find('.js_tab_cont_panel');
			
			//init
			$tab_panels.hide().eq(0).show();
		  $li.eq(0).addClass('active');		
			
			switch(trigger_type_str){
				case 'click':
				$li.each(function(idx){
					var $this_li = jQuery(this);
					$this_li.click(function(){
						$li.removeClass('active');
						$this_li.addClass('active');
						$tab_panels.hide().eq(idx).show();	
					});
				})//end $li.each()
				break;
				case 'mouseover':
				$li.each(function(idx){
					var $this_li = jQuery(this);
					$this_li.mouseover(function(){
						$li.removeClass('active');
						$this_li.addClass('active');
						$tab_panels.hide().eq(idx).show();	
					});
				})//end $li.each()
				break;
			};//END switch
	}
});//END js_tab

/*
js_slide_h

<div class="js_slide_h">
  <div class=" js_play_list">
    <div class="js_play_item"></div>
    <div class="js_play_item"></div>
    <div class="js_play_item"></div>
    <div class="js_play_item"></div>
    <div class="js_play_item"></div>
  </div>
  <div class="btn_prev"><a href="javascript:;" class="js_btn_prev">&nbsp;</a></div>
  <div class="btn_next"><a href="javascript:;" class="js_btn_next">&nbsp;</a></div>
</div>


*/

jQuery.fn.extend({
	slide_h:function(){
		var $root = jQuery(this);
		var $list= $root.find('.js_play_list');
		var $btn_prev = $root.find('.js_btn_prev');
		var $btn_next = $root.find('.js_btn_next');
		var $items = $list.find('.js_play_item');
		var len = $items.length;
		var animate_style= 'easeOutBack';
		var animate_speed = 400;
		var w = $items.width();
		var flag = true;
		
		var cur_idx = 0;
		
		$btn_prev.addClass('disabled');
		
		var go2 = function(idx){
			var marginLeft = -idx*w;
			$list.stop(true,false).animate({marginLeft:marginLeft},animate_speed,function(){
				cur_idx = idx;
				if(cur_idx==0){
					$btn_prev.addClass('disabled');
				}else if(cur_idx==(len-1)){
					$btn_next.addClass('disabled');
				}else if((cur_idx>0)&&(cur_idx<(len-1))){
					$btn_prev.removeClass('disabled');
					$btn_next.removeClass('disabled');
				};//end if else
			});//end animate
		}//end go2(idx)
		
		$btn_prev.click(function(){			
			if(!($list.is(':animated'))){
				--cur_idx;
        go2(cur_idx);
			};//end if
	  });//end reg click
		
		$btn_next.click(function(){			
			if(!($list.is(':animated'))){
				++cur_idx;
        go2(cur_idx);
			};//end if
	  });//end reg click
		
		
	}
});


//START slide_v
jQuery.fn.extend({
   slide_v:function(){
		var $root = jQuery(this);
		var $stage = $root.find('.js_stage');
		var $list= $root.find('.js_list');
		var $btn_prev_group = $root.find('.js_btn_prev_group');
		var $btn_next_group = $root.find('.js_btn_next_group');
		var $items = $list.find('li');
		var $item_des = $root.find('.js_item_des');
		var len = $items.length;
		var animate_style= 'easeOutBack';
		var animate_speed = 400;
		var fade_speed = 1000;
		var h = $items.outerHeight(true);
		var flag = true;
		var big_src = [];
		var pic_des = [];
		var step_size = 4;
		var interval_time = 5000;
	  var step_distance = h*step_size;
		var max_group_idx = Math.floor((len-1)/step_size);
		var cur_idx = 0;	
		var $last_img = null;
		
		for(var i=0;i<len;i++){
			big_src[i]=$items[i].getElementsByTagName('img')[0].getAttribute('data-big-src');
			pic_des[i] = $items[i].getElementsByTagName('img')[0].getAttribute('alt');
		};//end for
		
		function addimg(i){
			if($last_img){
				$last_img.animate({'opacity':0},fade_speed,function(){
					jQuery(this).remove();
				});
			};//end if	
					
			$last_img = jQuery('<img src="'+big_src[i]+'" alt="'+pic_des[i]+'" />').css({
				'position':'absolute',
				'top':0,
				'left':0,
				'opacity':0
			}).appendTo($stage).animate({'opacity':1},fade_speed);
		}//end function addimg(i)
		
		function go2group(group_idx){
			$list.stop(true,false).animate({'top':-group_idx*step_distance},animate_speed,animate_style,function(){
				if(group_idx==max_group_idx){
					$btn_next_group.addClass('disabled');
					$btn_prev_group.removeClass('disabled');
				}else if(group_idx==0){
					$btn_prev_group.addClass('disabled');
					$btn_next_group.removeClass('disabled');
				}else if((group_idx>0)&&(group_idx<max_group_idx)){
					$btn_prev_group.removeClass('disabled');
					$btn_next_group.removeClass('disabled');
				};//end if else
			});//end $list.animate			
		}//end function go2group(idx)
		
		$btn_prev_group.click(function(){
			if((!$btn_prev_group.hasClass('disabled'))&&(!($list.is(':animated')))){
				var	prev_group_idx = Math.floor(cur_idx/step_size)-1;				
				go2group(prev_group_idx);
				$items.eq(prev_group_idx*step_size).trigger('click');
			};//end if
		});//end reg $btn_prev_group.click
		
		$btn_next_group.click(function(){
			if((!$btn_next_group.hasClass('disabled'))&&(!($list.is(':animated')))){
				var	next_group_idx = Math.floor(cur_idx/step_size)+1;				
				go2group(next_group_idx);
				$items.eq(next_group_idx*step_size).trigger('click');
			};//end if
		});//end reg $btn_next_group.click
		
		
		$items.each(function(i){
			jQuery(this).click(function(){
				addimg(i);
				$items.removeClass('active').eq(i).addClass('active');
				$item_des.empty().append(pic_des[i]);
				cur_idx = i;
				n = i;
			});//end reg click
		});//end $items.each
		
		//init
		(function(){
			if(len<=step_size){
				$btn_prev_group.hide();
				$btn_next_group.hide();
			};			
			$btn_prev_group.addClass('disabled');
			$items.eq(0).trigger('click'); 
		})();
		
		//$stage.hover(function(){flag = true;},function(){flag = false;})
		
		var n=0;
		var Timer = window.setInterval(function(){
			if(flag){
				n++;
				if(n>=len){
					n=0;
				};
				$items.eq(n).trigger('click');
				go2group(Math.floor(n/step_size));				
			};//end if
		},interval_time);//end setInterval
		
		

	 }	
});//end slide_v

//START select_simulator
jQuery.fn.extend({
	select_simulator:function(){
		var $root = jQuery(this);
		var $selected_option = $root.find('.selected_option');
		var $tpl = $root.find('.dropdown_list');	
		var $copy = $tpl.clone();
		var target_pos = $selected_option.position();	
		$root.find('.dropdown_list').hide();
		
		var $form = $root.find('form.js_choose_category');
		
		$copy.css({'left':target_pos.left,'top':target_pos.top,'display':'none','z-index':'10'}).mouseleave(function(){
				jQuery(this).hide();
		}).appendTo($root.offsetParent());//添加到$root定义了position的最近一级的祖先元素 (this is important)
		
		$copy.find('li a').each(function(){
			jQuery(this).click(function(){
				$form.find('.js_selected_val').attr('value',jQuery(this).attr('rel'));
				$form.submit();
				return false;
			});
		});
				
	  $selected_option.mouseover(function(){
		  $copy.css({'display':'block'}).show();
	  });	
	}
});//end select_simulator


//START ini_astv2_datepicker
jQuery.fn.extend({
	ini_astv2_datepicker:function(cur_lang,begin_minDate_dateObj){
		     var $root = jQuery(this);
			 var $date_begin=$root.find('.js_date_begin');
			 var $date_end=$root.find('.js_date_end');
			 
			 //$date_begin.attr('value','');
			 //$date_end.attr('value','');
			 
			function parseDate( str ){
				var ra = /([\d]{2,4})-([\d]{1,2})-([\d]{1,2})/.exec(str);
				return Date.parse(ra[2] + '/' + ra[3] + '/' + ra[1]);
			}			
				
			 switch(cur_lang){
				 case 'en':
							datepicker_settings = {
							dateFormat : 'yy-mm-dd',
							monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
							monthNamesShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
							prevText : 'Earlier',
							nextText : 'Later',
							dayNames : ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
							dayNamesMin : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
							dayNamesShort :['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
							yearSuffix : '',
							'showMonthAfterYear':false
						};
				 break;
				 case 'zh':
							datepicker_settings = {
							monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
							monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
							prevText : '上一月',
							nextText : '下一月',
							dayNames : ['日','一','二','三','四','五','六'],
							dayNamesMin : ['日','一','二','三','四','五','六'],
							dayNamesShort :  ['日','一','二','三','四','五','六'],
							dateFormat : 'yy-mm-dd',
							yearSuffix : '年',
							'showMonthAfterYear':true
						};
				 break;
			 };//END switch()			 

				if( $date_begin.length && $date_end.length ){				
					$date_begin.datepicker(datepicker_settings);
					$date_end.datepicker(datepicker_settings);
					
					$date_begin.datepicker('option',{
						'minDate' : begin_minDate_dateObj,/*new Date('<?php echo date( "Y/m/d" , time() ) ?>') php在html文件中写入的服务器当前日期值，传给函数作为参数，date对象*/
						'maxDate':'+1y'
					});
					
					var date_begin_str = begin_minDate_dateObj.getFullYear() + '-' + (begin_minDate_dateObj.getMonth()+1) + '-' + begin_minDate_dateObj.getDate();
					
					$date_end.datepicker('option',{
						'minDate':begin_minDate_dateObj,//(new Date( parseDate(date_begin_str)+24*3600*1000 ) ),
						'maxDate':(new Date( parseDate(date_begin_str)+366*24*3600*1000 ) )	
					});
					
					//REG $date_begin events
					$date_begin.datepicker( 'option', {
						'onSelect':function(dateText, inst) {
							$date_end.datepicker( 'option', {'minDate':(new Date( parseDate(dateText) ) ),'maxDate':(new Date( parseDate(dateText)+366*24*3600*1000 ) )} );
						}//end 'onSelect':function(dateText, inst) {}
					});// end REG $date_begin events
					
				};//end if
	}

});
//END ini_astv2_datepicker



//START js_accordion
jQuery.fn.extend({
   js_accordion:function(){     
		var $root = jQuery(this);
		var $ac_items = $root.find('.js_ac_item');
		var $ac_hd =$root.find('.js_ac_hd');
		var $ac_bd =$root.find('.js_ac_bd');
		var animate_speed = 300;
		
		$ac_items.addClass('active');

		
		$ac_items.each(function(){
			var $this_item= jQuery(this);
			var $hd = $this_item.find('.js_ac_hd');
			var $bd = $this_item.find('.js_ac_bd');
			
			$hd.click(function(){
			   if($this_item.hasClass('active')){
					    $bd.slideUp(animate_speed);
							$this_item.removeClass('active');
				 }else{
					    //$ac_items.removeClass('active');
							$this_item.addClass('active');
							$this_item.find('.js_ac_bd').slideDown(animate_speed);
							//$this_item.siblings('.js_ac_item').find('.js_ac_bd').slideUp(animate_speed); 
				 };//end if else		
			});//end click
		});//end $ac_items.each
		
		$ac_items.find('.js_ac_hd').trigger('click');
		
	 }
});
//END js_accordion







//START js_ttip
jQuery.fn.extend({
   js_ttip:function(){
		 var $root = jQuery(this);		 
		 var content_text = $root.attr('data-ttbox-cont');	 
		 var box_size = $root.attr('data-ttbox-width');	 
		 var container_html ='<div class="ttbox_'+box_size+'"><div class="ttbox_top"></div><div class="ttbox_mid"><div class="ttbox_mid_inner">'+content_text+'</div></div><div class="ttbox_bottom"></div></div>'
		 var offset_x = '-121px';
		 var offset_y = '14px';
		 if(box_size=='s'){
			 offset_x = '-62px';
		 };

			$root.css({
				'position':'relative',
				'overflow':'visible'	
			});
			
			jQuery(container_html).css({
				'position':'absolute',
				'bottom':offset_y,
				'left':'50%',
				'margin-left':offset_x,
				'display':'none'
			}).appendTo($root);
			
					
      var $tip = $root.find('.ttbox_'+box_size);		
						
			 $root.mouseover(function(){
					$tip.show();
			 }).mouseleave(function(){
					$tip.hide();
			 }); 	  
	 }
});
//END js_ttip


//START js_scroll
/*
<div class="scroll_wrap js_scroll">
  <!--START滚动区域 --> 
	<div class="js_scroll_area">
		<div class="js_scroll_cont"></div>
	</div>
	<!--END滚动区域 --> 
	<!--START滚动条 -->
	<div class="scroll_handler">
		<div class="scroll_bar js_scroll_bar"></div>
	</div>
	<!--END滚动条 -->

</div>
*/
jQuery.fn.extend({
js_scroll:function(){
		 var $root = jQuery(this);
		 var $scroll_area = $root.find('.js_scroll_area');
		 var $scroll_cont = $root.find('.js_scroll_content');
		  $scroll_cont.css({'position':'absolute'});
		 var $scroll_bar = $root.find('.js_scroll_bar');
		 var DH = $scroll_cont.outerHeight(true)-$scroll_area.height()+20;
		 var browserInfo =echoLabJS.get_browserInfo();
		 var ui_val_cur = 100;
		 var ui_val_min = 0;
		 var ui_val_max = 100;
		 var ui_val_total = 100;
		 var  mousewheel = browserInfo.firefox ? "DOMMouseScroll" : "mousewheel";
		 

		 
		 if(DH<=0){$scroll_bar.hide();}else{
			 $scroll_bar.show();
		};//end if
		 
			var addEvent = (function(){
						if (window.addEventListener) {
								return function(el, sType, fn, capture) {
										el.addEventListener(sType, fn, (capture));
								};
						} else if (window.attachEvent) {
								return function(el, sType, fn, capture) {
										el.attachEvent("on" + sType, fn);
								};
						} else {
								return function(){};
						}
			})();
		
			var stopEvent = function(event) {
					if (event.stopPropagation) {
							event.stopPropagation();
					} else {
							event.cancelBubble = true;
					};//end if else
	
					if (event.preventDefault) {
							event.preventDefault();
					} else {
							event.returnValue = false;
					};//end if else
			};
				
		
	    //为整个滚动区的滚轮事件绑定对应函数	
		if($scroll_bar.is(':visible')){
			addEvent($scroll_cont.children()[0], mousewheel, function(event){
					var delta = 0;
					event = window.event || event;
					stopEvent(event);
					delta = event.wheelDelta ? (event.wheelDelta / 120) : (- event.detail / 3);
					
					function up_(){						
						
						if(ui_val_cur<ui_val_max){
							++ui_val_cur;
							$scroll_bar.find('a').css({'bottom':(((ui_val_cur/ui_val_total)*100).toString()+'%')});
							$scroll_cont.css({'top':-((DH/(ui_val_max-ui_val_min))*(ui_val_total-ui_val_cur))});
						};//end if
					}
					
					function down_(){						
						
						if(ui_val_cur>ui_val_min){
							--ui_val_cur;
							$scroll_bar.find('a').css({'bottom':(((ui_val_cur/ui_val_total)*100).toString()+'%')});
							$scroll_cont.css({'top':-((DH/(ui_val_max-ui_val_min))*(ui_val_total-ui_val_cur))});
						};//end if
					}
			
					delta > 0 ? up_(): down_();
			} , false);
		};//end if
		

		  $scroll_bar.slider({
				orientation: 'vertical',
				min: ui_val_min,//0
				max: ui_val_max,//100
				value: ui_val_total,//100
				slide: function( event, ui ) {
					$scroll_cont.css({'top':-((DH/(ui_val_max-ui_val_min))*(ui_val_total-ui.value))});
					ui_val_cur = ui.value;
					
				}
		 });//end $scroll_bar.slider()
		 
		 
		 
}		
});//END js_scroll

//将一个坐标显示在弹出层的google map 中
jQuery.fn.extend({
  show_in_popGmap: function () {
    return this.each(function () {

      var $a = jQuery(this);
      var coordinate = $a.attr('data-coordinate');
      var dx = coordinate.split(',')[0];
      var dy = coordinate.split(',')[1];


      var tit = $a.attr('data-gmap-tit');
      var icon_url = $a.attr('data-gmap-icon-url');

      function initialize(dx, dy) {


        var myLatlng = new google.maps.LatLng(dx, dy);
        var myOptions = {
          //zoom: 16,
          zoom: 12,
          center: myLatlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var o_map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        var o_marker = new google.maps.Marker({
          position: myLatlng,
          title: tit,
          icon: icon_url,
          shadow: './images/en/map_location_icon_shadow.png'
        });
        // To add the marker to the map, call setMap();
        //marker.setIcon(icon_url);
        o_marker.setMap(o_map);
      }

      $a.fancybox({
        'padding': 0,
        'scrolling': 'no',
        'titleShow': true,
        'titlePosition': 'outside',
        'onComplete': function () {
          initialize(dx, dy);
        }
      });


    });


  }
});



