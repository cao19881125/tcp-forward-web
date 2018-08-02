function send_request(url,type,data,success_call_back,error_call_back) {
    $.ajax({
        //url: 'http://192.168.184.128:8080/port_mapper',
        url: url,
        type: type, /* or type:"GET" or type:"PUT" */
        data:data,
        success: function (data, textStatus, response) {
            //console.log(data)
            success_call_back(data,textStatus, response)

        },
        error: function (result) {
            console.log(result);
            if(result.status == 401){
                go_to_login()
            }
            error_call_back(result)


        }
    });
}

function go_to_login() {
    $.cookie('go-back',true,{path:'/tcp-forward-web'})
    window.location.href = 'login.html'
}


/*  端口状态列表初始化
------------*/
function set_port_table(data) {

    var head_title = ['端口号','连接数量','WORKING状态数量','其他状态数量'];

    // var data = [
    //     {
    //         port:8000,
    //         con_num:10,
    //         working_num:8,
    //         other_num:2
    //     },
    //     {
    //         port:122,
    //         con_num:50,
    //         working_num:40,
    //         other_num:10
    //     },
    //     {
    //         port:8081,
    //         con_num:15,
    //         working_num:15,
    //         other_num:0
    //     }
    // ];

    port_thead = document.getElementById('port-thead')
    port_tr = document.createElement('tr')

    for(var i = 0;i<head_title.length;i++){
        tmp_th = document.createElement('th')
        tmp_th.appendChild(document.createTextNode(head_title[i]))
        port_tr.appendChild(tmp_th)
    }
    port_thead.appendChild(port_tr)


    len = data.length;
    tb = document.getElementById("port-tbody")
    for(var i=0;i<len;i++){
        var new_tr = document.createElement("tr")
        var port_td = document.createElement("td")
        //port_td.appendChild(document.createTextNode(data[i].port))
        port_td.innerHTML="<span class=\"text-primary\">"+data[i].port +"</span>"

        var con_td = document.createElement("td")
        con_td.appendChild(document.createTextNode(data[i].con_num))

        var working_td = document.createElement("td")
        var working_span = document.createElement("span")
        working_span.className = "badge badge-success"
        working_span.appendChild(document.createTextNode(data[i].working_num))
        working_td.appendChild(working_span)

        var other_td = document.createElement("td")
        //other_td.appendChild(document.createTextNode(data[i].other_num))
        other_td.innerHTML="<span class=\"badge badge-warning\">"+data[i].other_num+"</span>"

        new_tr.appendChild(port_td)
        new_tr.appendChild(con_td)
        new_tr.appendChild(working_td)
        new_tr.appendChild(other_td)


        tb.appendChild(new_tr)

    }
};


$(document).ready(function() {

    function handle_port_response(data) {
        
        var result_array = new Array()
        for(var key in data){
            var port = key
            var working_num = 0
            var other_num = 0
            var port_array = data[key]

            $(port_array).each(function (index,element) {
                if(element.state == 'WORKING'){
                    working_num += 1
                }else {
                    other_num += 1
                }

            })
            var port_info = {
                port:port,
                con_num:working_num + other_num,
                working_num:working_num,
                other_num:other_num
            }
            result_array.push(port_info)
        }
        set_port_table(result_array)
    }
    
    function handle_client_response(data) {
        var result_array = new Array()

        for(var key in data){
            var client_info = {
                id:key,
                tag:data[key].tag,
                ip:data[key].ip,
                state:data[key].state
            }
            result_array.push(client_info)
        }
        set_client_table(result_array)
    }
    
    function error_handle() {
        toastr.error('获取数据失败')
    }
    
    $(function () {

        send_request('forward_server/channel',"GET",null,handle_port_response,error_handle)
        send_request('forward_server/client_connection',"GET",null,handle_client_response,error_handle)


    });



});



/*  客户端状态列表初始化
------------*/
function set_client_table(data) {

    var head_title = ['ID','Tag','IP','状态'];

    // var data = [
    //     {
    //         id:101,
    //         tag:'client-one',
    //         ip:'221.34.23.45',
    //         state:'WORKING'
    //     },
    //     {
    //         id:110,
    //         tag:'client-two',
    //         ip:'167.34.23.45',
    //         state:'WORKING'
    //     }
    // ];

    port_thead = document.getElementById('client-thead')
    port_tr = document.createElement('tr')

    for(var i = 0;i<head_title.length;i++){
        tmp_th = document.createElement('th')
        tmp_th.appendChild(document.createTextNode(head_title[i]))
        port_tr.appendChild(tmp_th)
    }
    port_thead.appendChild(port_tr)


    len = data.length;
    tb = document.getElementById("client-tbody")
    for(var i=0;i<len;i++){
        var new_tr = document.createElement("tr")
        var port_td = document.createElement("td")
        port_td.innerHTML="<span class=\"text-primary\">"+data[i].id +"</span>"

        var con_td = document.createElement("td")
        con_td.appendChild(document.createTextNode(data[i].tag))

        var working_td = document.createElement("td")
        var working_span = document.createElement("span")
        working_span.appendChild(document.createTextNode(data[i].ip))
        working_td.appendChild(working_span)

        var other_td = document.createElement("td")
        //other_td.appendChild(document.createTextNode(data[i].other_num))
        other_td.innerHTML="<span class=\"badge badge-success\">"+data[i].state+"</span>"

        new_tr.appendChild(port_td)
        new_tr.appendChild(con_td)
        new_tr.appendChild(working_td)
        new_tr.appendChild(other_td)


        tb.appendChild(new_tr)

    }
}


/* 通道饼图

------------*/

$( function () {

    var data = [
        {
            label: "INIT",
            data: 1,
            color: "#8fc9fb"
        },
        {
            label: "CONNECTING",
            data: 2,
            color: "#ffca49"
        },
        {
            label: "WORKING",
            data: 9,
            color: "#58d54f"
        },
        {
            label: "CLOSED",
            data: 1,
            color: "#DC3545"
        },
        {
            label: "DONE",
            data: 0,
            color: "#000000"
        }
    ];

    var plotObj = $.plot( $( "#flot-pie" ), data, {
        series: {
            pie: {
                show: true,
                radius: 1,
                innerRadius: 0.5,
                label: {
                    show: false,

                }
            }
        },
        grid: {
            hoverable: true
        },
        legend: {
            show: true
        },
        tooltip: {
            show: true,
            content: "%p.0%, %s, n=%n", // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false
        }
    } );

} );

console.log('***********')
console.log($.cookie('author_token'))

