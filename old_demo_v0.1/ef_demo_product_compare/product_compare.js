// JavaScript Document
jQuery(function(){
	
//accordion_v2  echo update 20121105
jQuery.fn.extend({
		accordion_v2:function(active_class){
			var $root = jQuery(this);
			var $ac_items = $root.find('.js_ac_item');
			var animate_speed = 400;
			
			$ac_items.each(function(){
				var $this_item = jQuery(this);
				var $hd = $this_item.find('.js_ac_hd');
				var $bd = $this_item.find('.js_ac_bd');
				
				$hd.click(function(){
					if(!($bd.is(':animated'))){
						if($bd.is(':visible')){
						   $bd.slideUp(animate_speed);
							 $this_item.removeClass(active_class);
						}else{
							 $bd.slideDown(animate_speed);
							 $this_item.addClass(active_class);
						};//end if else
					};//end if
				});//end reg $hd.click
			});//end $ac_items.each()
			
			//init
			$ac_items.addClass('ac_item_active');				
		}		
});//END accordion_v2


   /* START product compare */
	jQuery('.mod_product_compare_wrap').each(function(){
				
	  var $window = jQuery(window);
		var $root = jQuery(this);
		var $btn_copy = $root.find('.mod_copy_link_box .js_copy');//按钮:页面底部复制链接的按钮
		var $btn_other_ccb_hook = $root.find('.other_compare_list_hook'); //按钮: 其他用户还加入以下产品进行对比 
		var $other_cc_box = $root.find('.mod_other_customer_compare_list_box');//容器: 其他用户还加入以下产品进行对比 
		var $btn_close_other_cc_box = $other_cc_box.find('.i14_close'); //按钮 ： 关闭'其他用户还加入以下产品进行对比'
		var $compare_holder_box = $root.find('.mod_compare_holder_box');//比较容器: 您最多可以比较4款产品 
		var $compare_items = $compare_holder_box.find('.diy_compare_list .compare_item'); //比较容器中的比较单元
		
		var $pro_sele_box = jQuery('body').find('.mod_product_selector');//容器：产品添加层		
		var $proSeleBoxCopy = $pro_sele_box.clone(true);//产品添加层副本
		$pro_sele_box.remove();
		$proSeleBoxCopy.appendTo(jQuery('body'));
		

		//如果初始化请求用户比较的产品数据出错，将出现报错弹出层。
		var $pop_error_box = $root.find('.pop_load_error');
		var $popErrorBoxCopy = $pop_error_box.clone();
		$pop_error_box.remove();
		$popErrorBoxCopy.appendTo(jQuery('body'));
		$popErrorBoxCopy.find('.js_close').click(function(){
			$popErrorBoxCopy.hide();
		});
		
		function show_error_box(){
					$popErrorBoxCopy.css({'top':((jQuery(window).innerHeight()/2)+(jQuery(window).scrollTop())),'margin-top':-($popErrorBoxCopy.outerHeight(true))/2,'z-index':'9999'});
					$popErrorBoxCopy.show();
		}
		
		//
		jQuery(window).bind('scroll resize',function(e){
			if($popErrorBoxCopy.is(':visible')){
				 show_error_box();
			}
		});
		
		

		var $btn_reset = $compare_holder_box.find('.js_reset_cp_list'); //按钮： 清空比较序列
		var $cp_parameter_table_area = $root.find('.mod_cp_parameter_data'); //容器: 比较数据的填充与显示区域
		
		var $mod_pbtn_warp = $root.find('.mod_pbtn_warp');//容器 ：页面底部产品数据的最后一行：包括 立即购买 , 加入收藏
		
		var $simpleCompareHolder =  $root.find('.mod_simple_compare_holder');	 //容器：页面scroll时，固定在页面顶部的简化版的比较容器
		var $simpleCompareHolder_copy= $simpleCompareHolder.clone(true);		
		$simpleCompareHolder.remove();
		$simpleCompareHolder_copy.appendTo(jQuery('body'));
		var $simple_compare_items = $simpleCompareHolder_copy.find('.diy_compare_list .compare_item');
		var $btn_highlight = jQuery('body').find('.js_highlight_different_tr'); //按钮: 高亮显示不同项
		var $btn_hide_same = jQuery('body').find('.js_hide_same_tr');//按钮： 隐藏相同项
		
		var $side_hook_original = $root.find('.mod_side_hook'); //侧边容器
		var $side_hook = $side_hook_original.clone(true);
		$side_hook_original.remove();
		$side_hook.appendTo(jQuery('body'));	
		var $side_ul = $side_hook.find('ul');
		var side_holder_ul_height =0;
		
		var max_compNum = 4;
		//var other_cc_box_max_height = parseInt($root.find('.mod_other_customer_compare_list_box').css('max-height'));ie6 不支持 max-height
		var other_cc_box_max_height =340;
		var animate_speed = 400;
		
    var count_init_pro_from_user = 0;
		
		var doing_ajax_add2Compare = false;//在产品添加层进行，点击“加入比较”的时候,如果需要ajax请求，上一个ajax请求的数据还没传回的时候，将不会请求下一个数据。
		var $doing_ajax_tip = $proSeleBoxCopy.find('.doing_ajax_tip');
		var $select_tip =  $proSeleBoxCopy.find('.select_tip');
		
		var flag_doing_internal_working = false;//在浏览器的js执行效率较低时，阻止用户多次点击产生错误。
		
		

		//其他..			
		var initJSONdata_obj = {};//保存从ajax_data/nf_product_compare_data.json读取的json文件数据
		var tooltip_html ={};//此次比较的参数中，需要用到的tooltip html
		var flag_get_tooltip_result = false;
    var subcat_array =[];//大类下的所有子类，以及子类下的所有型号，以及型号对应的产品唯一的productID 对象数组
		var curParametersAll_array = [];//当前的产品分类下，用于比较的有哪些参数,以及那些参数带有tooltip,以及tooltip类型
		
		var pObj_array_otherCustomerCompare = [];//其他用户比较最多的5个产品
		var pid_array_otherCustomerCompare =[];//其他用户比较最多的5个产品 ID数组 echo update 20121128
		
		var curCompareList=[];//这里存放当前正在比较的产品的产品ID; 用户的每次添加如比较或者删除比较，会影响 该数组的长度；用户的左移右移操作，会影响该数组的元素的排列顺序。每次重绘比较区域，都将依据该数组中的元素顺序。
		var cur_compare_pObj_arry = [];//当前正在比较的产品，初始化为后台传来的用户选择的比较产品	
			
		var _nf_product_form_user_pid_array =_TRS_compare_products_from_user_pid_array;//读取后台程序写在html中的，由网页浏览用户选中，的用于比较的产品id数组。echo update 20121128
		//curCompareList = _nf_product_form_user_pid_array;// 读取后台程序写在html页面中的全局变量 当前网页浏览用户选择的用于比较的产品的产品ID 数组 echo update 20121128
		
	  var pid_not_in_local_josn = [];
		
		/*
		 从json文件获取页面初始化所需的数据:
			1. 后台自动生成的被比较次数最多的5个产品
			2. 大类下的所有子类，以及子类下的所有型号，以及型号对应的产品唯一的productID 对象数组
			3. 每种tooltip对应的html字符串
		*/
		
	
		//START 目前没有tooltip的数据，先注释掉这部分功能 echo update 20130115 part1
		jQuery.ajax({
			url:'ajax_data/product_compare_tooltip.html',
			type:'GET',
		  	dataType:'html',
			success:function(data){
				 	flag_get_tooltip_result =true;//
         			jQuery(data).each(function(){
						var _TTipType = jQuery(this).attr('data-tooltip-type');
						var _html = jQuery(this).html();
						tooltip_html[_TTipType] = _html;
					});
			},//end success function
			error:function(){
				flag_get_tooltip_result =false;//				
			},//end error function
			complete:function(){
				//END 目前没有tooltip的数据，先注释掉这部分功能 echo update 20130115 part1
			
				jQuery.getJSON(product_compare_dataURL,function(json){			
					initJSONdata_obj                = json;		
					subcat_array                    = initJSONdata_obj.haierCategoryCompareSub_forCurMainCategory;//大类下的所有子类，以及子类下的所有型号，以及型号对应的产品唯一的productID 对象数组
					curParametersAll_array          = initJSONdata_obj.curCategoryComparing_CustomizedParameters;//当前的产品分类下，用于比较的有哪些参数,以及那些参数带有tooltip,以及tooltip类型
					pObj_array_otherCustomerCompare = initJSONdata_obj.productOtherCustomerCompare;//其他用户比较最多的5个产品
					
					for(var i=0;i<pObj_array_otherCustomerCompare.length;i++){
						pid_array_otherCustomerCompare.push(pObj_array_otherCustomerCompare[i].productID);
					};//end for


					 					
				 //START 公用方法定义
				 
				 //tooltip icon 在 ie6 and ie7 下的错位bug 修复 				 
				function fix_ie67_ttip_bug(){
								 function is_IE67(){
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
										
										if(MzBrowser.ie&&((MzBrowser.version==6)||(MzBrowser.version==7))){
											return true;
										}else{
											return false;							
										};	
															
								 }
					      
								if(is_IE67()){
									$cp_parameter_table_area.find('.js_cptr').each(function(idx){
										var $this_tr = jQuery(this);
										if($this_tr.is(':hidden')){
											$this_tr.find('.js_parametr_title .js_content_tooltip').hide();
										}else{
											$this_tr.find('.js_parametr_title .js_content_tooltip').removeAttr('style');
										};
									});//end tr each								
								};//end if 
				}
				
				
				//将产品添加层始终定位在窗口的正中
				function pos_proSeleBox(){
					$proSeleBoxCopy.css({'top':((jQuery(window).innerHeight()/2)+(jQuery(window).scrollTop())),'margin-top':-($proSeleBoxCopy.outerHeight(true))/2,'z-index':'9999'});
					$proSeleBoxCopy.show();
				}
				
				//
				jQuery(window).bind('scroll resize',function(e){
					if($proSeleBoxCopy.is(':visible')){
					   pos_proSeleBox();
					}
				});
				
				 
				//判断选中的产品是否是页面原始数据中,即页面初始化时，传来的'其他用户比较最多的5个产品'， 以及页面初始化时，传来的用户的比较产品比较list
				function inListA(pid,search_target_pid_array){
					var flag = 'notMatch';
					var a_idx =0;
					
					for(var i=0;i<search_target_pid_array.length;i++){
						if(pid==search_target_pid_array[i]){
							flag=true;
							a_idx=i;
							break;
						};//end if
					};//end for
					
					if(flag==true){
						return a_idx;
					}else{
						return flag;
					};//end if else		
								
				}
				 
				 
				 //产品添加层 显示产品简要信息的方法
				 function show_pBaseInfo($pBaseInfo_obj,idx_subcat,idx_mold){
					 var p_mold = $pBaseInfo_obj[idx_subcat].moldforSubCategory[idx_mold].mold;//产品型号
					 var p_imgSrc = $pBaseInfo_obj[idx_subcat].moldforSubCategory[idx_mold].imgSrc;//产品小图地址
					 var p_briefIntro = $pBaseInfo_obj[idx_subcat].moldforSubCategory[idx_mold].briefIntro;//产品添加层中的简要描述;
					 var p_briefIntro_array =  p_briefIntro.split('|');					 
					 var html_p_briefIntro = '';
					 
					 for(var i=0;i<p_briefIntro_array.length;i++){
						 if(!!p_briefIntro_array[i]){
								html_p_briefIntro = html_p_briefIntro + '<li>'+p_briefIntro_array[i]+'</li>'
						 };//end if
					 };	//end for 							 
					 $proSeleBoxCopy.find('.product_area .pic img').attr('src',p_imgSrc);
					 $proSeleBoxCopy.find('.product_area .des h3').html(p_mold);
					 $proSeleBoxCopy.find('.product_area .des ul').empty().append(html_p_briefIntro);	
					 $proSeleBoxCopy.find('.product_area').show(); 
				 }
				 
				 
				 //将产品加入比较的方法，在用户点击"比较"或者'加入比较'这两种按钮时，经过判断后判定是否执行
				 function add2Compare(order_index,product_Obj){
									 var $draw_area = $compare_holder_box.find('.diy_compare_list .compare_item').eq(order_index);
									 var $simple_draw_area = $simple_compare_items.eq(order_index);
									 var $trs = $cp_parameter_table_area.find('tr.js_cptr');
									 var productID =  product_Obj.productID;//产品ID
									 var p_mainCategoryName = product_Obj.mainCategoryName;
									 var p_subCategoryName = product_Obj.subCategoryName;
									 var p_mold = product_Obj.mold;//产品型号
									 var p_title = product_Obj.title;
									 var p_link = product_Obj.linkUrl;
									 var p_imgSrc = product_Obj.imgSrc;//产品小图地址
									 var p_starLevel = product_Obj.starLevel.toString();
									 var p_curCommentsNum = product_Obj.curCommentsNum;
									 var p_price = product_Obj.price;               
									 var CustomizedParameters_val_array=[];//[{'key':'','val':''},{}]
									 
									 for(var i=0;i<product_Obj.CustomizedParameters.length;i++){
										 var parameter_val = '';
										 for(var j=0;j<product_Obj.CustomizedParameters[i].parameterList.length;j++){
											 if(product_Obj.CustomizedParameters[i].parameterList[j][2].hasContentIcon==true){
												 parameter_val = product_Obj.CustomizedParameters[i].parameterList[j][1]+'<img src="' + product_Obj.CustomizedParameters[i].parameterList[j][2].ContentIconSrc + '" alt="" />';
											 }else{
												 parameter_val = product_Obj.CustomizedParameters[i].parameterList[j][1];
											 };//end if else	
											 CustomizedParameters_val_array.push({'key':product_Obj.CustomizedParameters[i].parameterList[j][0],'val':parameter_val});
										 };//end for
										};//end for
										
										$draw_area.attr('data-pid',productID);
										$draw_area.find('.cpitem_cont_box .pic a,.cpitem_cont_box .name a').attr('href',p_link);
										$draw_area.find('.cpitem_cont_box .pic a img').attr('src',p_imgSrc);
										$draw_area.find('.cpitem_cont_box .name a').html(p_title);
										$draw_area.find('.cpitem_cont_box .type').html(p_mold);
										$draw_area.find('.cpitem_cont_box .comments .i18_star').addClass('i18_star'+p_starLevel);								
										$draw_area.find('.cpitem_cont_box .comments .text a').attr('href',(p_link+'#.tc_comments')).html(p_curCommentsNum);
										$draw_area.find('.cpitem_cont_box .price span').html(p_price);
										$draw_area.addClass('compare_item_added');
										
										$simple_draw_area.attr('data-pid',productID);
										$simple_draw_area.find('.cpitem_cont_box .name a').attr('href',p_link);
										$simple_draw_area.find('.cpitem_cont_box .name a').html(p_title);
										$simple_draw_area.addClass('compare_item_added');
										$simple_draw_area.show();
										
										
										for(var m=0;m<CustomizedParameters_val_array.length;m++){		
										  var _key = CustomizedParameters_val_array[m]['key'];
											var _val = 	CustomizedParameters_val_array[m]['val'];	
											   
											if(_val==''){
												$trs.filter('[data-rel="'+_key+'"]').find('td.js_cptd').eq(order_index).html('&nbsp;');
											}else{
												$trs.filter('[data-rel="'+_key+'"]').find('td.js_cptd').eq(order_index).html(_val);
											};//end if else		
																	
										};//end for
										
									 
									 $mod_pbtn_warp.find('td').eq(order_index).find('.abtn_pink_h36').attr('href',p_link);
									 $mod_pbtn_warp.find('td').eq(order_index).find('p').show();
																
				 }//end function add2Compare(order_index,$pObj)
				 
					function del_ElementOfArray(idx,array_obj){
						 for(var i=idx;i<(array_obj.length-1);i++){
							 array_obj[i]=array_obj[i+1];
						 };
						 array_obj.pop();
					}
				 
				 //对记录当前参与比较的产品的两个数组，进行数据更新
				 function curComparingArray_del_element(idx){
					 del_ElementOfArray(idx,cur_compare_pObj_arry);
					 del_ElementOfArray(idx,curCompareList);
				 }
				 
				 
					function resort_ElementOfArray(idx,array_obj,direction){
						if(array_obj.length>1){
							if(direction=='left'){
								if(idx>0){
									var prev_item_copy = array_obj[idx-1];
									array_obj[idx-1] = array_obj[idx];
									array_obj[idx] = prev_item_copy;	
								};//end if
							}else if(direction=='right'){
								if(idx<(array_obj.length-1)){
									var next_item_copy = array_obj[idx+1];
									array_obj[idx+1] = array_obj[idx];
									array_obj[idx] = next_item_copy;	
								};//end if
							};//end if else		
						};//end if
					}
					
					
				 function curComparingArray_resort_element(idx,direction){//idx指在比较列表中，进行移位的那个元素的索引值,direction的取值为'left|right'
					 resort_ElementOfArray(idx,curCompareList,direction);
					 resort_ElementOfArray(idx,cur_compare_pObj_arry,direction);
				 }
				 
				 
				 function canBeAdd2Comp(pid){
					 for(var i=0;i<curCompareList.length;i++){
						 if(pid==curCompareList[i]){
							 return false;
						 };//end if else
					 };//end for
					 
					 if(curCompareList.length<max_compNum){
						 return true;
					 }else if(curCompareList.length==max_compNum){
						 return false;
					 };//end if
				 }
				 
				 
					function clearItem(){
								var $draw_area = $compare_items;
								var $simple_draw_area = jQuery('body').find('.mod_simple_compare_holder .diy_compare_list .compare_item');
								
								$draw_area.attr('data-pid','');
								$draw_area.find('.cpitem_cont_box .pic a,.cpitem_cont_box .name a').attr('href','#');
								$draw_area.find('.cpitem_cont_box .pic a img').attr('src','');
								$draw_area.find('.cpitem_cont_box .name a').html('');
								$draw_area.find('.cpitem_cont_box .type').html('');
								$draw_area.find('.cpitem_cont_box .comments .i18_star').attr('class','').addClass('i18_star');						
								$draw_area.find('.cpitem_cont_box .comments .text a').attr('href','#').html('');
								$draw_area.find('.cpitem_cont_box .price span').html('');
								$draw_area.removeClass('compare_item_added');								
								$cp_parameter_table_area.find('.js_cptr').find('td.js_cptd').html('&nbsp;');
								
								
								
								$simple_draw_area.attr('data-pid','');
								$simple_draw_area.find('.cpitem_cont_box .name a').attr('href','#');
								$simple_draw_area.find('.cpitem_cont_box .name a').html('');
								$draw_area.removeClass('compare_item_added');		
								$simple_draw_area.hide();						
								
								
								$mod_pbtn_warp.find('td').find('p').hide();	
								$mod_pbtn_warp.find('td').find('.abtn_pink_h36').attr('href','#');
					}	
				 
				 //START function reDrawCompArea()
				 function reDrawCompArea(){//重绘产品比较区域	
							var product_obj = {};		
									 
							clearItem();		 
							for(var i=0;i<cur_compare_pObj_arry.length;i++){
								 add2Compare(i,cur_compare_pObj_arry[i]);
							};//end for 
							
							if($btn_highlight.hasClass('selected')){
									if(curCompareList.length>1){
										reset_table_highlight_bg();
									}else if(curCompareList.length==1){
										$cp_parameter_table_area.find('.js_cptr').removeClass('trtd_highlight_bg');
										$btn_highlight.removeClass('selected');
									};//end if else
							};//end if
							
							if($btn_hide_same.hasClass('selected')){
								if(curCompareList.length>1){
									hide_table_same_tr();
								}else if(curCompareList.length==1){
									$cp_parameter_table_area.find('.js_cptr:hidden').show();
									$btn_hide_same.removeClass('selected');
								};//end if else						
							};//end if
							
				 }//end function reDrawCompArea
				 
				 
				function hide_other_ccb_box(){
					$other_cc_box.animate({'height':0},animate_speed,function(){
						$other_cc_box.css({'display':'none'});
					});
				}
				
				function find_same_trs(){//将返回1个数组 same[]
					var len = curCompareList.length;
					var same=[];
					
					function checkTrSame($this_tr){
						var flag = true;
						var val = $this_tr.find('.js_cptd').eq(0).html();
						for(var i=1;i<len;i++){
							var val_cur = $this_tr.find('.js_cptd').eq(i).html();
							if(!(val_cur==val)){
								flag = false;
								break;
							};//end if
						};//end for
						return flag;
					}
					$cp_parameter_table_area.find('.js_cptr').each(function(idx){
							same[idx] = checkTrSame(jQuery(this));	
					});//end each
					return same;
				}
				
								
				function reset_table_highlight_bg(){
					if(curCompareList.length>1){
						$cp_parameter_table_area.find('.js_cptr').removeClass('trtd_highlight_bg');
						var same_tr_idx_array = find_same_trs();
						$cp_parameter_table_area.find('.js_cptr').each(function(index){							
							 var $this_tr = jQuery(this);							 
							 if((same_tr_idx_array[index])==false){
								 $this_tr.addClass('trtd_highlight_bg');
							 };//end if							 
						});//end $cp_parameter_table_area.find('.js_cptr').each	
					};//end if
				}
				
				function hide_table_same_tr(){
					if(curCompareList.length>1){
						$cp_parameter_table_area.find('.js_cptr:hidden').show();
						var same_tr_idx_array = find_same_trs();
						$cp_parameter_table_area.find('.js_cptr').each(function(index){							
							 var $this_tr = jQuery(this);							 
							 if((same_tr_idx_array[index])==true){
								 $this_tr.hide();
							 };//end if							 
						});//end $cp_parameter_table_area.find('.js_cptr').each				
					};//end if
				}
								
				function _reg_btn_clr($obj,idx){					
					var $btn_close = $obj.find('.i14_close');
					var $btn_left = $obj.find('.go2left a');
					var $btn_right = $obj.find('.go2right a');
					
					$btn_close.click(function(){
						var pid = $obj.attr('data-pid');						
						for(var i=0;i<5;i++){
							var idx_in_other_cc_box = $other_cc_box.find('.product_item').eq(i).attr('data-pid');														
							if(pid==idx_in_other_cc_box){								
								$other_cc_box.find('.product_item').eq(i).removeClass('product_item_selected');
								break;
							};//end if							
						};//end for
						
						
						
						curComparingArray_del_element(idx);
						reDrawCompArea();      
					});//end reg $btn_close click
					
					$btn_left.click(function(){
						curComparingArray_resort_element(idx,'left');
						reDrawCompArea();	
					});//end $btn_left.click
					
					$btn_right.click(function(){
						curComparingArray_resort_element(idx,'right');
						reDrawCompArea();	
					});//end $btn_right.click		
				}
				
				 //END 公用方法定义
				 
					
				//START 初始化表格区域,将参数名称写入表格th
				(function(){
					var parameter_group_size;
					if(curParametersAll_array[curParametersAll_array.length-1].parameterCategoryName==""){
						parameter_group_size = curParametersAll_array.length-1;
					}else{
					parameter_group_size	= curParametersAll_array.length;
					};
					 
					var $original_tpl= $cp_parameter_table_area.find('.ac_item');
					
					$cp_parameter_table_area.find('.ac_item').remove();
					
					for(var i=0;i<parameter_group_size;i++){
						if(!!curParametersAll_array[i].parameterCategoryName){
							var $copy = $original_tpl.clone(true);
							var parameterList_in_this_group = curParametersAll_array[i].parameterList;//第i组的参数	
							var cur_group_para_num =parameterList_in_this_group.length;
							var html_side_holder_li = '';
							var html_tr = '';
							var html_tr_part0 = '<tr class="js_cptr"><th class="js_parametr_title">';
							var html_tr_part1 = '';
							var html_tr_part2 = '</th><td class="js_cptd">&nbsp;</td><td class="js_cptd">&nbsp;</td><td class="js_cptd">&nbsp;</td><td class="js_cptd">&nbsp;</td></tr>';
							
							$copy.find('h3.ac_hd').html(curParametersAll_array[i].parameterCategoryName);
							$copy.find('h3.ac_hd').attr('data-rel',('parameter_group_'+i));
							
							//START 初始化侧边栏的参数分组名称
							if(i==(parameter_group_size-1)){
								html_side_holder_li = '<li class="last"><a href="javascript:;" data-rel="parameter_group_'+i+'">'+curParametersAll_array[i].parameterCategoryName+'</a></li>';
							}else{
								html_side_holder_li = '<li><a href="javascript:;" data-rel="parameter_group_'+i+'">'+curParametersAll_array[i].parameterCategoryName+'</a></li>';
							};//end if else
							//END 初始化侧边栏的参数分组名称
							
							//START 初始化参数表格区域，写入参数名称				
							for(var j=0;j<cur_group_para_num;j++){
								if(!!parameterList_in_this_group[j][0]){
									var TTipContentType = parameterList_in_this_group[j][1].TTipContentType;
									if(parameterList_in_this_group[j][1].hasTTip&&flag_get_tooltip_result&&(!!(tooltip_html[TTipContentType]))){
											html_tr_part1 = parameterList_in_this_group[j][0]+tooltip_html[TTipContentType];
									}else{
											html_tr_part1 =  parameterList_in_this_group[j][0];
									};//end if else		
									html_tr_part0 = '<tr class="js_cptr" data-rel="'+parameterList_in_this_group[j][0]+'"><th class="js_parametr_title">';
									html_tr = html_tr + html_tr_part0 + html_tr_part1 + html_tr_part2;
								};
							};//end for	
							
							jQuery(html_side_holder_li).appendTo($side_ul);		
							
							jQuery(html_tr).appendTo($copy.find('.ac_bd table'));
							$copy.appendTo($cp_parameter_table_area);
							
						};//end if
					};//end for
					
					side_holder_ul_height = $side_ul.height();
					$side_ul.parent('.side_hook_inner').addClass('active');
					
					$cp_parameter_table_area.accordion_v2('ac_item_active');
					
					$cp_parameter_table_area.find('.js_content_tooltip').mouseover(function(){
						jQuery(this).find('.tt_454').show();
					}).mouseleave(function(){
						jQuery(this).find('.tt_454').hide();
					});
					
				})();//end 初始化表格区域
				


				//START INIT产品添加层初始化
				(function(){
						var subcat_len = subcat_array.length; 
						var html_subcat ='';
						var subCatMold_array =[];
						var $btn_add2Compare = $proSeleBoxCopy.find('.js_btn_add');
		
						for(var i=0;i<subcat_len;i++){
							 var subcat  =  subcat_array[i].subCategoryName;
							 html_subcat  = html_subcat+'<li>'+subcat+'</li>';
							 
							 mold_for_this_subcat = subcat_array[i].moldforSubCategory;	//
							 
								 var html_moldforsubcat = '';
								 for(var j=0;j<mold_for_this_subcat.length;j++){
									 var mold = mold_for_this_subcat[j].mold;
									 var productID =mold_for_this_subcat[j].productID;
									 var json_url =mold_for_this_subcat[j].productJsonUrl;
									 
									 html_moldforsubcat = html_moldforsubcat +'<li data-pid="'+productID+'" data-json-url="'+json_url+'">'+ mold +'</li>';
								 };//end for				 
								 html_moldforsubcat = '<ul>'+html_moldforsubcat+'</ul>';
								 jQuery(html_moldforsubcat).appendTo($proSeleBoxCopy.find('.cat2_box .list_container'));	
						};//end for
								 
						html_subcat = '<ul>'+html_subcat+'</ul>';
						$proSeleBoxCopy.find('.cat1_box .list_container').append(html_subcat);			
						
						var $subCatUL = $proSeleBoxCopy.find('.cat1_box .list_container ul');
						var $moldForSubCatUL = $proSeleBoxCopy.find('.cat2_box .list_container ul');
						$moldForSubCatUL.hide();
						$proSeleBoxCopy.find('.product_area').hide();
						
						$moldForSubCatUL.each(function(idx_ul){
							 var 	$this_ul = jQuery(this);			 
							 $this_ul.find('li').each(function(idx_li){
								 var $this_li = jQuery(this);
								 $this_li.click(function(){
											$this_li.siblings('li').removeClass('active').end().addClass('active');		
											show_pBaseInfo(subcat_array,idx_ul,idx_li);
											$select_tip.hide();
								 });//end reg li click
							 });//end li each 
						});//end $moldForSubCatUL.each 
					
						$subCatUL.find('li').each(function(idx){
							 var 	$this_li = jQuery(this);
							 $this_li.click(function(){
										$this_li.siblings('li').removeClass('active').end().addClass('active');
										$moldForSubCatUL.hide().eq(idx).show();
										$moldForSubCatUL.eq(idx).find('li').eq(0).trigger('click');
							 });
						});
						
						$proSeleBoxCopy.find('.i14_close').click(function(){
							$proSeleBoxCopy.hide();
							$select_tip.hide();
						});
						
						$btn_add2Compare.click(function(){
									var pid = $moldForSubCatUL.filter(':visible').find('li.active').attr('data-pid');
									var json_url = $moldForSubCatUL.filter(':visible').find('li.active').attr('data-json-url');
									
									$select_tip.html('').hide();
									
									if(curCompareList.length==4){//如果当前比较列表已满
									
										 $select_tip.html($select_tip.attr('data-tit').split('|')[1]).show();
										 
									}else{//如果当前比较列表未满
																		
											if(canBeAdd2Comp(pid)){//如果比较列表未满，选中的产品又未在当前比较列表中
												var a_idx= inListA(pid,pid_array_otherCustomerCompare);
												if(a_idx=='notMatch'){//如果在 不在页面初始化时，传来的'其他用户比较最多的5个产品'之中，将进行ajax请求，获取产品参数数据
													 if(!doing_ajax_add2Compare){//如果上次ajax请求的数据已传回，完成重绘，则允许进行下一次ajax数据请求。
															 doing_ajax_add2Compare = true;
															 jQuery.ajax({
																 type:'GET',
																 url:json_url,//这个是假的接口，请后台程序员替换成真实的接口地址。该接口接受产品id值，返回一个json格式的数据。
																 dataType: 'json',
																 success:function(json){
																	 var p_obj = json;
																	 
																	 if(pid==p_obj.productID){														 
																		 curCompareList[curCompareList.length]=pid;
																		 cur_compare_pObj_arry[cur_compare_pObj_arry.length]=p_obj;
																		 reDrawCompArea(); 
																		 doing_ajax_add2Compare = false;//此次ajax请求的数据完成，如果用户继续点击"加入比较"，允许进行下一次ajax请求。
																		 $doing_ajax_tip.hide();		
																	 };//end if 		
																 },//end success function
																 error:function(){
																	 $select_tip.html($select_tip.attr('data-tit').split('|')[2]).show();
																	 doing_ajax_add2Compare = false;//此次ajax请求的数据完成，如果用户继续点击"加入比较"，允许进行下一次ajax请求。
																	 $doing_ajax_tip.hide();		
																 }
															 });//end ajax 
													 }else{//如果上次ajax请求的数据未传回
														 $doing_ajax_tip.show();											 
													};//end if else																			 
												}else{//如果在 页面初始化时传来的比较最多的5个产品之中					
													curCompareList[curCompareList.length]=pid;	
													cur_compare_pObj_arry[cur_compare_pObj_arry.length]=pObj_array_otherCustomerCompare[a_idx];
													reDrawCompArea();		
													$other_cc_box.find('.product_list_c5 .product_item').eq(a_idx).addClass('product_item_selected'); 		
												};//end if else
											}else{//比较列表未满，但是选中的产品在比较列表中
													 $select_tip.html($select_tip.attr('data-tit').split('|')[0]).show();
											};//end if else
										
									};//end if else
									
						});//end reg click
				
				})();	//end INIT初始化产品添加层
				
				
				
				//START 各类事件注册
				(function(){
						
						$side_hook.find('.tit').click(function(){
							var $parent = jQuery(this).parent('.side_hook_inner');
						
							if(  !($parent.hasClass('active'))&&(!$side_ul.is(':animated'))   ){
								$side_ul.animate({'height':side_holder_ul_height},200);
								$parent.addClass('active');
							}else if($parent.addClass('active')){
								$side_ul.animate({'height':0},200,function(){
									$parent.removeClass('active');
								});
							};//end if else
						});//end  reg $root.find('.mod_side_hook .tit').click
						
						
						//侧边容器每项分类，点击页面滚动到相应参数分组的位置。
						$side_ul.find('li').each(function(idx){
							var $this_li = jQuery(this);
							var $a = $this_li.find('a');
							
							$a.click(function(){
								var rel = $a.attr('data-rel');
								var target_offset_top =$cp_parameter_table_area.find('h3[data-rel="'+rel+'"]').offset().top;
								var box_height = $simpleCompareHolder_copy.outerHeight(true);
								window.scroll(0,(target_offset_top-box_height));
							});//end $a reg click
						});//end $side_ul.find('li').each
						
						
						
						
						$btn_other_ccb_hook.click(function(){						
							if( (!($other_cc_box.is(':animated')))&&($other_cc_box.is(':hidden')) ){
								$other_cc_box.css({'display':'block'}).animate({'height':other_cc_box_max_height},animate_speed);
							}else if( (!($other_cc_box.is(':animated')))&&($other_cc_box.is(':visible')) ){
								hide_other_ccb_box();
							};//end if
						});//end reg $other_ccb_hook.click		
						
						$btn_close_other_cc_box.click(function(){
							hide_other_ccb_box();
						});//end reg $btn_close_other_cc_box.click	
						
						$other_cc_box.find('.product_list_c5 .product_item').each(function(index){
							var $this = jQuery(this);
							var pid = $this.attr('data-pid');
							
							function toggle_selected(){
								flag_doing_internal_working = true;
								if($this.hasClass('product_item_selected')){
									
									var idx_in_compareList ='';	
									for(var i=0;i<4;i++){
										if(pid==$compare_items.eq(i).attr('data-pid')){
												idx_in_compareList=i;
												break;
										};//end if								
									};//end for	
									curComparingArray_del_element(idx_in_compareList);
									reDrawCompArea(); 					
									$this.removeClass('product_item_selected');	
									
								}else{									
									if(canBeAdd2Comp(pid)){
										curCompareList[curCompareList.length]=pid;
										cur_compare_pObj_arry[cur_compare_pObj_arry.length]=pObj_array_otherCustomerCompare[index];
										reDrawCompArea();
										$this.addClass('product_item_selected');
									};//end if
								};//end if else
							}//end function toggle_selected()
		
							$this.find('.compare .i18_cb,.compare .text').click(function(){
								if(!flag_doing_internal_working){
									toggle_selected();
									flag_doing_internal_working = false;
								};//end if
								
							});					
						})
						
						
						
						/* START $compare_holder_box  */
						$btn_reset.click(function(){
							if(curCompareList.length>0){					
								clearItem();		
								curCompareList=[];
								cur_compare_pObj_arry=[];	
								$other_cc_box.find('.product_item_selected').removeClass('product_item_selected');
							};
						});//end reg reset click		
						
						
						$btn_highlight.click(function(){					
							if(jQuery(this).hasClass('selected')){
								$cp_parameter_table_area.find('.js_cptr').removeClass('trtd_highlight_bg');
								$btn_highlight.removeClass('selected');
							}else{
								if(curCompareList.length>1){
									reset_table_highlight_bg();
									$btn_highlight.addClass('selected');	
								};//end if
							};//end if else					
						});//end $btn_highlight.click
						
						$btn_hide_same.click(function(){					
							if(jQuery(this).hasClass('selected')){
								$cp_parameter_table_area.find('.js_cptr:hidden').show();
								$btn_hide_same.removeClass('selected');
								
                fix_ie67_ttip_bug();
								
							}else{
								if(curCompareList.length>1){
									hide_table_same_tr();
									$btn_hide_same.addClass('selected');	
                  
									fix_ie67_ttip_bug();

									
								};//end if 
							};//end if else	
						});//end reg $btn_hide_same click
						
						
						$compare_items.each(function(idx){
							var $this_compare_item = jQuery(this);		
							var $btn_close = $this_compare_item.find('.i14_close');
							var $btn_left = $this_compare_item.find('.go2left a');
							var $btn_right = $this_compare_item.find('.go2right a');
		
							$this_compare_item.find('.js_add_comp_pro').click(function(){
								pos_proSeleBox();
							});//end reg $btn_add_comp_pro.click
							
							_reg_btn_clr($this_compare_item,idx);
						});	//end $compare_items.each	
						
						$simple_compare_items.each(function(idx){
							var $this_compare_item = jQuery(this);
							_reg_btn_clr($this_compare_item,idx);	
						});
						
						
						
						//tabke区域 鼠标hover 变颜色 
						$cp_parameter_table_area.find('.js_cptr').each(function(){
							
							jQuery(this).mouseover(function(){
								jQuery(this).find('.js_parametr_title,.js_cptd').css({'background-color':'#f9fafc'});
							}).mouseleave(function(){
								jQuery(this).find('.js_parametr_title,.js_cptd').removeAttr('style');				
							});			
							
						});
					
					 
					 
					 //加入收藏 
					 $mod_pbtn_warp.find('.js_add_collection').each(function(){
							var $this_a = jQuery(this);
							$this_a.click(function(){
								//在add2compare()函数中定义，每次需要写入到js_add_collection的参数值， 
								
							});
							 
					 })
					
					 //Scroll 浮动层出现
					 jQuery(window).bind('scroll resize',function(e){
							 var H =  $cp_parameter_table_area.offset().top;					 
							 var top_side_hook_original =300;
							 var h = $window.scrollTop();	
							 
							 
							 $simpleCompareHolder_copy.css({'top':h});
							 
							 $side_hook.css({'top':(h+top_side_hook_original)});
							 
								if(h>=(H-128)){
									if(curCompareList.length>0){
										$simpleCompareHolder_copy.fadeIn(400);
									};//end if							
								}else if(h<H){
									$simpleCompareHolder_copy.fadeOut(400);
								};//end if 
					 });
		
		
					 
					 $btn_copy.click(function(){
						  var str = jQuery(this).prev('input').attr('value');						 
							var $tip = jQuery(this).parent().find('.js_browser_support_tip');
							var $suc_tip = jQuery(this).parent().find('.js_suc_tip');
							
							jQuery(this).prev('input')[0].select();
							 	
							if (window.clipboardData){ 
									$tip.hide();
									window.clipboardData.setData("Text", str)
									$suc_tip.show();
						  }else{
								  $suc_tip.hide();  
									$tip.show();
							};//end if else
					 });
					 
				})();
				//end 各类事件注册
				
				 //START 检测用户选中的用于比较的产品是否在初始化数据中，若不在，将进行ajax请求,完成 cur_compare_pObj_arry 数据初始化
				//console.log(_TRS_compare_products_from_user_pid_array.length)
				 
				 
				 if(!!_nf_product_form_user_pid_array){//如果参数存在的话
				 
					 if(_nf_product_form_user_pid_array.length>4){
						 _nf_product_form_user_pid_array = _nf_product_form_user_pid_array.slice(0,4);
					 };//end if 					 
					 
						//优先显示本地初始化数据中的产品
						 for(var i=0;i<_nf_product_form_user_pid_array.length;i++){
							 var a_idx = inListA(_nf_product_form_user_pid_array[i],pid_array_otherCustomerCompare);
							 
							 if(!(a_idx=='notMatch')){//如果在初始化的5个产品中
								 curCompareList.push(_nf_product_form_user_pid_array[i]);
								 cur_compare_pObj_arry.push(pObj_array_otherCustomerCompare[a_idx]);	
									$other_cc_box.find('.product_item').eq(a_idx).addClass('product_item_selected');
									
							 }else{
								 pid_not_in_local_josn.push(_nf_product_form_user_pid_array[i]);
							 };
						 };
						
						 reDrawCompArea(cur_compare_pObj_arry);
						 
						 window._load_INIT_pro_data_from_server = function(){
								 if(pid_not_in_local_josn.length>0){
									   var len_li = $proSeleBoxCopy.find('.cat2_box .list_container ul li').length;
										 var json_url = '';
										 
									   for(var i=0;i<len_li;i++){
                        if($proSeleBoxCopy.find('.cat2_box .list_container ul li').eq(i).attr('data-pid')==pid_not_in_local_josn[0]){
													json_url = $proSeleBoxCopy.find('.cat2_box .list_container ul li').eq(i).attr('data-json-url');
													break;
												};//end if
											};//end for
									   
										 
										 jQuery.ajax({
												 type:'GET',
												 url:json_url,//这个是假的接口，请后台程序员替换成真实的接口地址。该接口接受产品id值，返回一个json格式的数据。
												 dataType: 'json',
												 'timeout':60*1000,
												 success:function(json){									 
														 var p_obj = json;
														 
														 if(pid_not_in_local_josn[0]==p_obj.productID){			
																curCompareList.push(pid_not_in_local_josn[0]);								 
																cur_compare_pObj_arry.push(p_obj);											 
														 };//end if 		
															pid_not_in_local_josn.shift();		
															_load_INIT_pro_data_from_server();	
												 },//end success function
												 error:function(){
													 //$popErrorBoxCopy.find('.pid').html(pid_not_in_local_josn[0]);
														show_error_box();
														pid_not_in_local_josn.shift();
														_load_INIT_pro_data_from_server();			
												 },
												 complete:function(){												
														// START 初始化：将用户选定的比较产品的数据写入页面
														reDrawCompArea(cur_compare_pObj_arry);		
														//END 初始化：将用户选定的比较产品的数据写入页面
												 }
										 }); 
								 };
						 }
						 
						_load_INIT_pro_data_from_server();	

					 
				 };//end if		 

				 //END 检测用户选中的用于比较的产品是否在初始化数据中，若不在，将进行ajax请求，完成 cur_compare_pObj_arry 数据初始化
				 
				 
					
				});	//end jQuery.getJSON('ajax_data/nf_product_compare_data.json'

//START 目前没有tooltip的数据，先注释掉这部分功能 echo update 20130115 part2
			}//end 	jQuery.ajax GET nf_product_compare_tooltip.html complete function
			
		});//end jQuery.ajax GET nf_product_compare_tooltip.html
//END 目前没有tooltip的数据，先注释掉这部分功能 echo update 20130115 part2
		
				
	});/* END product compare */
	
})