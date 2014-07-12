function debug(info) {
    console.log(info);
}


var mail = {

}

$(document).ready(function() {

    $('.j-share').each(function(i, cont) {
        $(this).find('.j-add').on('click', function() {
            var tag = $(cont).find('.j-item').last();
            tag.after(tag.clone(true));
            var index = $(this).index();
        });
        $(this).find('.j-remove').on('click', function() {
            var tag = $(cont).find('.j-item');
            if (tag.length <= 1) {
                $('.j-share').eq(i).remove();
                return false;
            }
            tag.last().remove();
        });
        $(this).find('.j-name').on('click', function() {
            name = $(this).text();
        });
        $(this).find('.j-name').on('blur', function() {
            var txt = $(this).text();
            if (txt == '' || txt == undefined) {
                $(this).text(name);
                return;
            }
            var src = 'http://qzonestyle.gtimg.cn/qz-act/public/img/mail-avatar/' + txt + '.jpg';
            $(this).parent().parent().parent().find('.j-head').attr('src', src);
        });
    });

    $('[contenteditable]').on('focus', function() {
        $(this).select();
    });

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

    $('.j-read').on('click', function() {
        $('.j-add').toggle();
        $('.j-copy').toggle();
        $('.j-remove').toggle(function() {
            if (!$(this).is(':visible')) {
                $('.j-read').text('编辑');
            } else {
                $('.j-read').text('预览');
            }
        });
        $('#j-url').removeAttr('contenteditable');
    });

    $('#j-url').on('blur', function() {
        $(this).attr('href', $(this).text());
    });

    copy($('.j-copy'), $('#bodyTable'));
});


function copy($btn, $target) {
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
