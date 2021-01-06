App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function(){
    return App.initWeb3();
  },

  initWeb3: function() {
    /*
     * Replace me...
     */
    if (typeof window.ethereum!== 'undefined') {
      
      App.web3Provider = window.ethereum;
      ethereum.request({ method: 'eth_requestAccounts' });
      web3 = new Web3(window.ethereum);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */
     $.getJSON("Sukien.json", function(sukien){
      App.contracts.Sukien = TruffleContract(sukien);
      App.contracts.Sukien.setProvider(App.web3Provider);
      App.eventtaove();
      return App.taikhoan();
     });
    
  },
  taikhoan:  function(){
    var account = web3.eth.accounts[0];
    
        if (account !== null) {
          $("#account").html("Tài khoản của bạn "+ account);
          App.account= account;
        }
      App.render();

  },
  render: function(){

    var veInstance;
    App.contracts.Sukien.deployed().then(function(instance){
      veInstance = instance;
      return veInstance.nextId();
    }).then(function(so){

      var tabledanhsach = $("#tabledanhsach");
      tabledanhsach.empty();
      for(var i = 1; i<= so; i++){
       veInstance.Ves(i).then(function(ketqua){
          var id= ketqua[0];
          var mssv = ketqua[1];
          var ho = ketqua[2];
          var ten = ketqua[3];
          var masukien = ketqua[4];
          var mave = ketqua[5];
          var show="<tr><th>"+id+"</th><td>"+mssv+"</td><td>"+ho+"</td><td>"+ten+"</td><td>"+masukien+"</td><td>"+mave+"</td></tr>";
          tabledanhsach.append(show);
        });
      };
    });
  },
  xacnhan: function(){
    var mssv = $("#masinhvien").val();
    var hoten = $("#hoten").val().toString();
    var ten = $("#ten").val().toString();
    var masukien = $("#masukien").val().toString();
    App.contracts.Sukien.deployed().then(function(instance){
    return instance.createVe(mssv,hoten,ten,masukien,{gas: 3000000, from: App.account}).then(function(result){
      var url= 'https://ptta-cnm.herokuapp.com/dangkyve/updatetrangthai/'+mssv+'/'+1+'';
          $.ajax({
            url: url,
            type: 'GET',
            dataType : 'json',
            async :false,
          });
      window.location='index.html';
    }).catch(function(error){

      Notiflix.Notify.Failure("Vé đã được đăng ký");
    });
    });
  },
  timkiem: function() {
    // body...
    var mssvtk = $("#timkiem").val().toString();
    App.contracts.Sukien.deployed().then(function(instance){
      return instance.search(mssvtk);
    }).then(function(result){
     Notiflix.Report.Info('Thông tin vé','MSSV: '+result[0]+' Họ Và Tên: '+result[1]+' Tên: '+result[2]+' Mã Sự Kiện: '+result[3]+' Mã Vé: '+result[4]+'','Ok');
    });
  },
  in: function(){
    var prtContent = $("#in");
    console.log(prtContent);
    var WinPrint = window.open();
    WinPrint.document.write('<title>Danh sách vé đã xác nhận</title>');
    WinPrint.document.write(prtContent.html());
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
  },
  eventtaove: function(){
    App.contracts.Sukien.deployed().then(function(instance){
    instance.taoVe({},{}).watch(function(error,result){
         if(!error){
          var mssv = result.args["_mssv"];
          Notiflix.Notify.Success('Xác nhận thành công vé cho '+mssv);
      }
      });
    });
  },
  login: function(){
    var username = $("#username").val().toString();
    var password =$("#password").val().toString();
    var passwordmd5 = $.md5(password);
    var url = "https://ptta-cnm.herokuapp.com/taikhoan/"+username;
    $.ajax({
      url: url,
      type: 'GET',
      success: function (result) {
        $.each(result, function(key, val){
         if (username == val.username && passwordmd5 == val.password && val.phanquyen == 1) {
            sessionStorage.setItem('username',val.username);
            sessionStorage.setItem('password',val.password);
            sessionStorage.setItem('phanquyen',val.phanquyen);
            sessionStorage.setItem('ten',val.ten);
            window.location="index.html";
         }else{
          Notiflix.Notify.Failure("Tài khoản không đúng");
         }
        })
      }
    });
  },
  dangxuat: function (){
    sessionStorage.clear();
    window.location='login.html';
  }
};
$("#metamask").on('click',function(){
  ethereum.request({ method: 'eth_requestAccounts' });

});

$(function() {
  $(window).on('load',function() {
    App.init();

  });
});