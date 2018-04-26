let open_card=[];//创建打开的卡牌列表
let cards=[];// 创建卡牌列表
let moves=0;// 洗牌方法
function shuffle(cards) {
    var currentIndex = cards.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
    return cards;
}
$(document).ready(function(){// 加载事件
    let time_now = Date.now();// 事件一开始就开始计时赋值变量time_now
    function rating(time_dow){// 把评分的部分用一个名为 `rating` 的函数包含起来，看起来会结构更清晰一点
        if( moves === 60 || time_dow === '80'){// 利用步数和时间数进行判断
            // 索引到星星所在位置removeclass
            $(".stars li i:eq(0)").removeClass()}
        else if(moves === 90 || time_dow === '90'){
            $(".stars li i:eq(1)").removeClass()}
        else if(moves === 200 || time_dow === '120'){
            $(".stars li i:eq(2)").removeClass()}
    }
    let set_time = null; // 在函数 time() 外部声明 set_time
    function time() {
        set_time = setInterval(function(){  //将 setInterval 返回值保存起来
            let time_dow = ((Date.now() - time_now) * 0.001).toFixed();
            rating(time_dow); // 调用评分函数
            $('.timer').text(time_dow);// 添加html里时间每秒执行一次
        },1000);
    }
    time(); // 启动计时器
    $(".card>.fa").each(function () {//用each遍历把卡牌列表填满执行一次
        cards.push(this.className)
    });
    clear();// 页面加载结束先调用一次clear用于初始化
    function clear() { // 创建clear方法
        $(" section").removeClass().addClass('score-panel');// 由于成功后会改变class这里重新初始化class
        $(" section ul").removeClass().addClass('stars');
        $(" section ul li i").each(function () {// 这里使用遍历来初始化class
            $(this).removeClass().addClass('fa fa-star');
        });
        $(" section div").removeClass().addClass('restart');
        $(".moves").text(moves=0);// 计步器初始化为0
        open_card.splice(0, open_card.length);// 清空打开的卡牌list
        cards = shuffle(cards); //调用洗牌函数，并且重新复制给card
        $(".card>.fa").each(function (index, element) {// 更新洗牌后的牌库：
            $(this).removeClass().addClass(cards[index]);
            $(this).parent().removeClass().addClass('card')
        });
    }
    $(".restart").click(function () {// 点击刷新卡牌刷新函数里调用clear函数
        clear();
        time_now = Date.now();
        $('.timer').text('0');  // 重置网页上的数值
        clearInterval(set_time);  // 先清除之前的计时器，否则重复点击 restart 按钮，计时器会乱
        time(); // 再次启动计时器
    });
    $(".card").click(// 设置点击事件class=card时触发
        function () {// 在这里我设置只能点击为空卡牌也就是说：点击后只要当前卡牌有颜色则不能触发一系列函数而是返回。
            if ($(this).hasClass('card match')||$(this).hasClass('open show'))return;
            $(this).addClass('open show');// 当前this的class添加open show使之变亮
            open_card.push($(this).index());// 同时向open_card列表添加此li在同类中的索引值
            if(open_card.length < 2 )return;// 如果卡牌点击数小于两个则return事件结束，否之向下继续执行
            $(".moves").text(moves+=1);// 计步器写在这里是为了两次点击为一步
            let first_turn = $(".deck .card:eq("+open_card.shift()+")");// 利用open_card里记录的上面两个索引值来找到两次翻牌的卡牌并赋值变量
            let Second_turn = $(".deck .card:eq("+open_card.shift()+")");
            setTimeout(function() {// 创建计时器使之卡牌翻和合上的速度不至于太快
                if (first_turn.find("i").attr('class') === Second_turn.find("i").attr('class')) {// 如果上两次点击里查找i元素里面的class是否为同一个符号
                    // 如果是用一符号则点亮class为绿色，添加animate手动实现果冻效果整个页面也随之震动
                    Second_turn.removeClass().addClass('card match').animate({"width":"120","height":"130"},100)// 如果是用一符号则点亮class为绿色，添加animate手动实现果冻效果整个页面也随之震动
                        .animate({"width":"130","height":"120"},100).animate({"width":"125","height":"125"},100);
                    first_turn.removeClass().addClass('card match').animate({"width":"120","height":"130"},100)
                        .animate({"width":"130","height":"120"},100).animate({"width":"125","height":"125"},100);
                }else {
                    Second_turn.removeClass().addClass('card').animate({opacity:'0.7'},"show")// 如果不是则不点亮恢复原有card属性，因为之前点亮是是有show属性的这里清掉，
                        .animate({opacity:'1'},"show");// 手动实现简单的熄灭隐藏效果
                    first_turn.removeClass().addClass('card').animate({opacity:'0.7'},"show")
                        .animate({opacity:'1'},"show");
                }// 如果带有绿色class的卡牌数量为16则执行
                if($(".deck .match").length === 16){
                    clearInterval(set_time);// 清除计时器
                    $(".score-panel").addClass('win'); // 让.score-panel的类里加上win类来实现结束后效果名继承他原有属性
                }
            }, 400);//卡牌翻开合上速度为400ms
        })
});
