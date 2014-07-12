(function(){

function debug(info) {
    console.log(info);
}

var Mail = {
    init:function(){
        var self = this;
        self.bindEvent();
        self.changeImgurl();
        self.doPreview();
        self.copy($('.j-copy'), $('#bodyTable'));
    },
    bindEvent:function(){
        var self = this;
        //绑定add remove 
        $('.j-share').each(function(i, cont) {
            self.handleShare(i, cont);
        });
        $('[contenteditable]').on('focus', function() {
            $(this).select();
        });
        $('#j-url').on('blur', function() {
            $(this).attr('href', $(this).text());
        });
    },
    doPreview:function(){
        $('.j-read').on('click', function() {
            $('.j-add').toggle();
            $('.j-copy').toggle();
            $('.j-remove').toggle(function() {
                if (!$(this).is(':visible')) {
                    $('.j-read').text('编辑');
                    $('#j-url').removeAttr('contenteditable');
                } else {
                    $('.j-read').text('预览');
                    $('#j-url').attr('contenteditable','true');
                }
            });
            
        });
    },
    changeImgurl:function(){
        $('.j-img').on('click', function() {
            $('.j-block').fadeIn(300);
        });

        $('.j-cancle').on('click', function() {
            $('.j-block').fadeOut(300);
        });

        $('.j-save').on('click', function() {
            $('.j-block').fadeOut(300);
            var imgSrc = $('.j-imgUrl').val();
            if (imgSrc != '' && imgSrc != undefined) {
                $('.j-img').attr('src', imgSrc);
            }
        });        
    },
    /**
     * @param Integer i 当前元素的索引值
     * @param Dom cont 当前元素的dom对象引用 
     */
    handleShare:function(i, cont){
        $(cont).find('.j-add').on('click', function() {
            var tag = $(cont).find('.j-item').last();
            tag.after(tag.clone(true));
            var index = $(this).index();
        });
        $(cont).find('.j-remove').on('click', function() {
            var tag = $(cont).find('.j-item');
            if (tag.length <= 1) {
                $('.j-share').eq(i).remove();
                return false;
            }
            tag.last().remove();
        });
        $(cont).find('.j-name').on('click', function() {
            name = $(this).text();
        });
        $(cont).find('.j-name').on('blur', function() {
            var txt = $(this).text();
            if (txt == '' || txt == undefined) {
                $(this).text(name);
                return;
            }
            var src = 'http://qzonestyle.gtimg.cn/qz-act/public/img/mail-avatar/' + txt + '.jpg';
            $(this).parent().parent().parent().find('.j-head').attr('src', src);
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


