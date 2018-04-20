var express = require('express');
var router = express.Router();
var app=express();
var bodyParser = require('body-parser');
var db = require("./db.js");
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ccap=require("ccap")();
/* GET home page. */
// router.post('/enter', function (req, res) {
//     var name = req.body.name;
//     var age = req.body.age;
//     db.query("insert into userinfo(name,age) values('"+name+"','"+age+"')", function (err, rows) {
//         if (!req.body) return res.sendStatus(400);
//         res.send('welcome, ' + req.body.name)
//     })
// });


router.post('/',function(req,res){
    res.end(req.session.userName+"");
});
router.post('/userId',function(req,res){
    res.end(req.session.userId+"");
});
//根据商品类别
router.post('/getGoodsByCategory', function (req, res) {
    //把从前台传过来的的中文类型改成utf-8
    req.setEncoding('utf8');
    var strcondition=req.body.condition;
    //res.end(strcondition);
    //查询出类别为白酒的商品
    db.query("Select * from(select G.id,G.name AS GOODSNAME,G.price,G.stock,G.createTime,G.suggestNum,G.imgUrl,G.shopName,G.goodsTypeid,T.NAME AS goodstypename FROM t_goods G inner join t_goodstype T ON G.GOODSTYPEID=T.ID)T1 "+strcondition+"",function (err, rows) {
        //  if (!req.body) return res.sendStatus(400);
        if (err) {
            res.end('查询失败：' + err);

        } else {
            //req.session.userName="1";
            //将数据已json的格式展示出来
            res.json(rows);
        }
    })
});
router.post('/getGoodsById',function(req,res){
    var GoodsId=req.body.id;
    db.query("Select * from (select G.id,G.name AS GOODSNAME,G.price,G.stock,G.createTime,G.suggestNum,G.imgUrl,G.shopName,G.goodsTypeid,T.filename AS goodsImgList FROM t_goods G left join T_IMG T ON G.id=T.goodsid)T1 where t1.id='"+GoodsId+"';",function(err,rows){
        if (err) {
            res.end('查询失败：' + err);
        } else {
            //req.session.userName="1";
            //将数据已json的格式展示出来
            res.json(rows);
        }
    })
});
router.post('/register', function (req, res) {
    var email = req.body.email;
    var nickName = req.body.nickName;
    var pwd = req.body.pwd;
    var realName = req.body.realName;
    //用户注册
    db.query("insert into t_user(email,nickName,pwd,realName) values('"+email+"','"+nickName+"','"+pwd+"','"+realName+"')", function (err, rows) {
        //  if (!req.body) return res.sendStatus(400);
        if (err) {
            res.end('新增失败：' + err);
        } else {
            res.end('true');
        }
    })
});
//跳转到注册页面
router.get('/register',function(req,res){
    res.render('register');
});
//注册成功以后的跳转
router.get('/login',function(req,res){
    res.render('login');
});
//获取验证码
router.get('/getCertPic',function(req,res){
    var ary = ccap.get();
    txt = ary[0];
    var buf = ary[1];
    res.end(buf);
    //写入session
    // req.session.certPic="34";
});
// router.get('/',function(req,res){
//     res.render('index',{userName:req.session.userName})
// });
//登陆页面
router.post('/login1',function(req,res){
    var email = req.body.email;
    var code = req.body.code;
    var pwd = req.body.pwd;
    // 验证传入的参数是否符合要求
    if(txt==code){
        //用户登陆
        db.query("SELECT * FROM T_USER WHERE EMAIL='"+email+"' AND PWD='"+pwd+"'",function(err,rows){
            if(rows.length==0){
                res.end("邮箱或者密码不对");
            } else if(rows[0].EMAIL=="1015095073@qq.com"){
                res.end("true1")
            }
            else{
                req.session.userName=rows[0].NICKNAME;
                req.session.userId=rows[0].ID;
                res.end("true")

            }
        })
        //SELECT ID,EMAIL,NAME,PWD  FROM T_USER WHERE EMAIL = #{email}

    }else{
        res.end("验证码不正确")
    }
    // };//从session中读取
});
//登陆成功以后的跳转
// router.get('/',function(req,res){
//     res.render('/');
// });
router.get('/frame',function(req,res){
    res.render('frame');
});
router.get('/Tab',function(req,res){
    res.render('Tab');
});
router.get('/buyShopResult',function(req,res){
    res.render('buyShopResult');
});
router.get('/shopCar',function(req,res){
    res.render('shopCar');
});

router.post('/getRateByPage',function(req,res){
    //把从前台传过来的的中文类型改成utf-8
    req.setEncoding('utf8');
    var GoodsId=req.body.goodsid;
    var pageNum=parseInt(req.body.pageNum);
    var pageSize=parseInt(req.body.pageSize);
    var page1=(pageNum-1)*pageSize;
    var page2=pageNum*pageSize;
    db.query("Select t2.* from(select t1.*,i.filename as rateImg from(Select R.id, R.content,R.createtime,R.goodsid,R.userid,u.nickname,u.Userpt from t_rate R inner join t_user U on R.userid=u.id)t1 left join t_rateimg I on t1.id=i.RATESID)t2 where t2.goodsid='"+GoodsId+"'limit "+page1+","+page2+"",function(err,rows){
        if (err) {
            res.end('查询失败：' + err);
        } else {
            // //req.session.userName="1";
            // //将数据已json的格式展示出来
             res.json(rows);
        }
    })
});
router.post('/getRateTotal',function(req,res){
    //把从前台传过来的的中文类型改成utf-8
    req.setEncoding('utf8');
    var GoodsId=req.body.goodsid;
    //var pageNum=parseInt(req.body.pageNum);
    //var pageSize=parseInt(req.body.pageSize);
   // var page1=(pageNum-1)*pageSize;
   // var page2=pageNum*pageSize;
    db.query("Select t2.* from(select t1.*,i.filename as rateImg from(Select R.id, R.content,R.createtime,R.goodsid,R.userid,u.nickname,u.Userpt from t_rate R inner join t_user U on R.userid=u.id)t1 left join t_rateimg I on t1.id=i.RATESID)t2 where t2.goodsid='"+GoodsId+"'",function(err,rows){
        if (err) {
            res.end('查询失败：' + err);
        } else {
            // //req.session.userName="1";
            // //将数据已json的格式展示出来
            res.json(rows);
        }
    })
});
router.post('/innerShop',function (req, res) {
     var name = req.body.name;
    var price = req.body.price;
    var imgUrl = req.body.imgUrl;
    var goodsId = req.body.goodsId;
   var userId = req.body.userId;
   if(userId==""){
       userId=8;
   }
   var amount=req.body.amount;
     db.query("insert into t_shopResult(NAME,PRICE,IMGURL,GOODSID,USERID,amount) values('"+name+"','"+price+"','"+imgUrl+"','"+goodsId+"','"+userId+"','"+amount+"')",function (err, rows){
         if (err) {
             res.end('新增失败：' + err);
         } else {
            res.end('true');
         }
     })
   // res.end('true');
});
router.post('/getGoodsById',function(req,res){
    //把从前台传过来的的中文类型改成utf-8
    //req.setEncoding('utf8');
    var GoodsId=req.body.id;
    db.query("select * from t_goods where id="+GoodsId+"",function(err,rows){
        if (err) {
            res.end('查询失败：' + err);
        } else {
            // //req.session.userName="1";
            // //将数据已json的格式展示出来
            res.json(rows);
        }
    })
});
router.post('/getGoodsByPage',function(req,res){
    //把从前台传过来的的中文类型改成utf-8
    //req.setEncoding('utf8');

    db.query("select * from t_goods where stock>120  ORDER BY stock DESC",function(err,rows){
        if (err) {
            res.end('查询失败：' + err);
        } else {
            // //req.session.userName="1";
            // //将数据已json的格式展示出来
            res.json(rows);
        }
    })
});
router.post('/getShopByPage',function(req,res){
    //把从前台传过来的的中文类型改成utf-8
    req.setEncoding('utf8');
    var condition=req.body.condition;
    var pageNum=parseInt(req.body.pageNum);
    var pageSize=parseInt(req.body.pageSize);
    var page1=(pageNum-1)*pageSize;
    var page2=pageNum*pageSize;
    db.query("select * from t_shopResult "+condition+" limit "+page1+","+page2+"",function(err,rows){
        if (err) {
            res.end('查询失败：' + err);
        } else {
            // //req.session.userName="1";
            // //将数据已json的格式展示出来
            res.json(rows);
        }
    })
});
router.post('/getShopTotal',function(req,res){
    //把从前台传过来的的中文类型改成utf-8
    req.setEncoding('utf8');
    var condition=req.body.condition;
    // var pageNum=parseInt(req.body.pageNum);
    // var pageSize=parseInt(req.body.pageSize);
    // var page1=(pageNum-1)*pageSize;
    // var page2=pageNum*pageSize;
    db.query("select * from t_shopResult "+condition+" ",function(err,rows){
        if (err) {
            res.end('查询失败：' + err);
        } else {
            // //req.session.userName="1";
            // //将数据已json的格式展示出来
            res.json(rows);
        }
    })
});
router.post('/delShopCar',function(req,res){
    //把从前台传过来的的中文类型改成utf-8
   // req.setEncoding('utf8');
    var condition=req.body.id;
    db.query("delete from t_shopresult WHERE id="+condition+"",function(err,rows){
        if (err) {
            res.end('删除失败：' + err);
        } else {
            // //req.session.userName="1";
            // //将数据已json的格式展示出来
            res.end("true");
        }
    })
});
router.post('/getShopCarTotal',function(req,res){
    //把从前台传过来的的中文类型改成utf-8
    req.setEncoding('utf8');
    var condition=req.body.userId;
    // var pageNum=parseInt(req.body.pageNum);
    // var pageSize=parseInt(req.body.pageSize);
    // var page1=(pageNum-1)*pageSize;
    // var page2=pageNum*pageSize;
    db.query("select * from t_shopResult where userid= "+condition+" ",function(err,rows){
        if (err) {
            res.end('查询失败：' + err);
        } else {
            // //req.session.userName="1";
            // //将数据已json的格式展示出来
            res.json(rows);
        }
    })
});
//getShopCarTotal
module.exports = router;

