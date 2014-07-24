(function(){
var Mail = {
	itemNum: 1,
	init:function(){
		var self = this;

		self.initOperate();
		
		self.bindEvent();
	},

	initOperate:function(){
		$shareWrap = $('.j-share');
		var op = ['<tr>',
					'<td>',
						'<i class="add j-add"><a href="javascript:void(0)">Add</a></i>',
						'<i class="remove j-remove" style="margin-left:15px;"><a href="javascript:void(0)">Remove</a></i>',
					'</td>',
				'</tr>'
		].join('');

		var btnPreview = ['<button class="j-read" style="position:fixed;top:0;right:100px;padding: 13px 35px 17px;background-color: #428bca;border: #357ebd 1px solid;color:#fff;border-radius:10px;cursor:pointer">预览</button>',
						'<button class="j-copy" style="position:fixed;top:55px;right:100px;padding: 13px 35px 17px;background-color: #428bca;border: #357ebd 1px solid;color:#fff;border-radius:10px;display:none;cursor:pointer">复制</button>'
		].join('');
		
		$shareWrap.append(op);
		$('body').append(btnPreview);
	},

	bindEvent:function(){
		var self = this;

		//选中文本
		self.selectText();

		//监听enter/tab切换选中编辑
		self.switchText();

		//增删item条目
		self.opShareItem();

		self.changeImgurl();

		//预览
		self.doPreview();

		//copy
		self.copy($('.j-copy'), $('#bodyTable'));
	},

	opShareItem:function(){
		var self =this;

		var $shareWrap = $('.j-share'),
			$shareContWrap = $('.j-share-cont'),
			$add = $('.j-add'),
			$remove = $('.j-remove'),
			$itemCont = $('.j-share-cont .j-item').last();

		//添加item
		$shareWrap.on('click','.j-add',function(e){
			var $ele = $(this),
				$item = $ele.closest('.j-share').find('.j-item').last();		//冒泡找分享标题

			self.itemNum++;
			var itemType= 'j-item-' + self.itemNum;
			$item.after($item.clone().attr({'dataid':itemType}));					//插入 标题模块

			$itemCont.after($itemCont.clone().attr({'dataid':itemType}));			//插入 对应的内容模块

		});

		//删除item
		$shareWrap.on('click','.j-remove',function(e){
			var $ele = $(this),
				$wrap = $ele.closest('.j-share'),
				$items = $wrap.find('.j-item'),
				$item = $items.last();					//需要删除的主题

			var itemType = $item.attr('dataid'),
				$removeItem = $('[dataid=' + itemType + ']');

			$removeItem.remove();

			//todo 判断是否删除此类目
			if($items.length <= 1){
				$wrap.closest('tr').remove();
			}
		});

		//编辑 姓名
		$('#bodyTable').on('blur','.j-name',function(){
			var txt = $(this).text(),
				src = 'http://qzonestyle.gtimg.cn/qz-act/public/img/mail-avatar/' + txt + '.jpg';

			var dataId = $(this).closest('.j-item').attr('dataid'),				//当前编辑的分享 id
				$editItem = $('[dataid=' + dataId + ']'),
				$head = $editItem.find('.j-head');

			$editItem.find('.j-name').text(txt);
			$head.attr({'src':src});
		});

		//编辑 遍体
		$('#bodyTable').on('blur','.j-title',function(){
			var txt = $(this).text();

			var dataId = $(this).closest('.j-item').attr('dataid'),				//当前编辑的分享 id
				$editItem = $('[dataid=' + dataId + ']');

			$editItem.find('.j-title').text(txt);
		});

		//编辑目录地址
		$('#j-url').on('blur', function() {
			$(this).attr('href', $(this).text());
		});
	},



	//选中可编辑文本
	selectText:function(){
		var self = this;

		$('#bodyTable').on('click',function(e){
			var $ele = $(e.target);
			//点击可编辑的文本的时候
			if($ele.attr('contenteditable') == 'true'){
				var ele = $ele[0],
					text = ele.firstChild;
				var sel, range;

				if (window.getSelection && document.createRange) {
					range = document.createRange();

					//选中的是底部的文件存放地址url
					if(ele.id == 'j-url'){
						range.setStart(text, text.length - 8);
						range.setEnd(text, text.length);
					}else{
						range.setStart(text, 0);
						range.setEnd(text, text.length);
					}
					sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (document.body.createTextRange) {
					range = document.body.createTextRange();
					range.moveToElementText(ele);
					range.select();
				}
			}else{
				//非可编辑，需要清理默认记住的选中区域
				window.getSelection().removeAllRanges();
			}
		});
	},

	switchText:function(){
		//监听enter/tab,进行切换
		$('#bodyTable').on('keydown','[contenteditable=true]',function(e){
			var $ele = $(this);
			if(e.keyCode == 13 || e.keyCode == 9){
				e.preventDefault();
				var $editList = $('[contenteditable=true]'),
					i = $editList.index($ele),
					$next;

				if(i == $editList.length - 1){
					$next = $editList[0];
				}else{
					$next = $($editList[i + 1]);
				}
				$next.click();
			}
		});
	},


	doPreview:function(){
		var $preview = $('.j-read'),			//预览按钮
			$copy = $('.j-copy');
		$preview.on('click', function(){
			// $('.j-add, .j-copy').toggle();	//隐藏添加、复制
			$('.j-add').closest('tr').remove();
			$copy.toggle(0,function(){
				if($copy.is(':visible')){
					$preview.text('编辑');
					$('[contenteditable=true]').removeAttr('contenteditable').addClass('editable');
				}else{
					$preview.text('预览');
					$('.editable').attr({'contenteditable':true});
				}
			});
		});
	},

	changeImgurl:function(){
		var $imgUrl = $('.j-imgUrl'),
			$block = $('.j-block');		

		$('#bodyTable').on('click','.j-img',function(){
			var dataId = $(this).closest('.j-item').attr('dataid');
			$block.attr({'dataid':dataId}).fadeIn(300);
		});

		$block.on('click','.j-cancel',function(){
			$block.fadeOut(300);
		});

		$block.on('click','.j-save',function(){
			$block.fadeOut(300);
			var imgSrc = $imgUrl.val();
			if (!!imgSrc) {
				var dataId = $('.j-save').closest('.j-block').attr('dataid'),
					$item = $('[dataid='+dataId+']');
				$item.find('.j-img').attr('src', imgSrc);
			}
		});    
	},


	/**
	 * @param Integer $btn 触发页面复制的代码
	 * @param Dom $target 需要内容复制的DIV
	 */
	copy:function($btn, $target) {
		var client = new ZeroClipboard($btn);
		client.on('ready', function(event) {
			client.on('copy', function(event) {
				event.clipboardData.setData('text/html', $target.html());
			});
			client.on('aftercopy', function(event) {
				alert('复制成功！');
			});
		});

		client.on('error', function(event) {
			ZeroClipboard.destroy();
		});
	}

};//end of Mail Object

Mail.init();

})()


