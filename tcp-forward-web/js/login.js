

$(document).ready(function() {

    $('#sing-in-btn').click(function () {


        // $.post('http://192.168.184.128:8080/token',"{'user':'cyt','password':'123456'}",function (result,statue) {
        //     console.log(result)
        // })

        var user = $("#iuser").val()
        var pass = $("#ipassword").val()

        console.log(user)
        console.log(pass)

        var pass_data = {'user':user,'password':pass}
        console.log(JSON.stringify(pass_data))

        $.ajax({
            url: 'forward_server/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST", /* or type:"GET" or type:"PUT" */
            dataType:"json",
            data: JSON.stringify(pass_data),
            success: function (data, textStatus, response) {
                var tokenid = response.getResponseHeader("X-Auth-Token")
                console.log(tokenid)
                $.cookie('X-Auth-Token',tokenid,{path:'/tcp-forward-web'})


                if($.cookie('go-back') == undefined){
                    window.location.href="index.html"
                }else {
                    $.cookie('go-back','',{ expires: -1 })
                    history.back()
                }

            },
            error: function (result) {
                console.log(result);
                toastr.error('登录失败')
            }
        });


    });

});