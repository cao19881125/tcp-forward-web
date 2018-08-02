
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

/* 初始化client列表

------------*/

var checkitem = "<input type=\"checkbox\" name=\"checkItem\" class='mycheckbox'/>"
var dataSet = [
    [checkitem,"15","8081","210.2.40.3","234","WORKING","600","103","1205"],
    [checkitem,"143","8010","213.45.40.3","11345","WORKING","10","2312","11114"],
    [checkitem,"55","122","145.2.41.3","2367","WORKING","1800","33","123"],
    [checkitem,"1313","156","155.2.40.3","9986","CLOSED","143","45","156"],


];


function table_change() {
    //alert('next');
    var $tt = $('#checkAll')
    $tt.prop('checked',false)


    var $tbr = $('table tbody tr');
    $tbr.find('input').prop('checked',false)

}

function go_to_login() {
    $.cookie('go-back',true,{path:'/tcp-forward-web'})
    window.location.href = 'login.html'
}

$(document).ready(function() {
    // $('#myTable').DataTable( {
    //     data:dataSet,
    //     drawCallback: function(){
    //         $('.paginate_button', this.api().table().container())
    //             .on('click', table_change());
    //     }
    // } );

    function handle_response_data(data) {
        var result_array = new Array()
        for(var key in data){

            var port_array = data[key]

            $(port_array).each(function (index,element) {
                console.log(element)
                var per_data_array = new Array()
                per_data_array.push(checkitem)
                per_data_array.push(element.id)
                per_data_array.push(key.toString())
                per_data_array.push(element.ip)
                per_data_array.push(element.port)
                per_data_array.push(element.state)
                per_data_array.push(element.duration_time)
                per_data_array.push(parseInt(element.recv_flow_statistics).toString())
                per_data_array.push(parseInt(element.send_flow_statistics).toString())
                result_array.push(per_data_array)
            })

        }
        // console.log(result_array)
        mytable = $('#myTable').DataTable( {
            data:result_array,
            drawCallback: function(){
                $('.paginate_button', this.api().table().container())
                    .on('click', table_change());
            }
        } );
    }

    function refresh_data() {
        send_request('forward_server/channel',"GET",null,handle_response_data)
    }

    function refresh_table() {

        mytable.clear()
        mytable.destroy()
        refresh_data()
    }

    $(function () {
        refresh_data()

    });

    function send_close_request(channel_ids) {
        var params = {channel_ids:channel_ids,_method:"DELETE"}
        send_request('forward_server/channel',"POST",params,function () {
            toastr.success('关闭客户端' + channel_ids + '成功')
            window.setTimeout(function () {
                refresh_table()
            },3000)

        },function () {
            toastr.error('关闭客户端' + channel_ids + '失败')
        })
    }

    $('#close-btn').click(function () {
        var table = $('#myTable').DataTable();
        var to_del = new Array()
        var trs = $('table tbody tr').each(function(index,element){


            if($(this).find('input').prop('checked')){

                $(this).each(function (index,element) {
                    var channel_id = $($(element).find('td')[1]).text()
                    to_del.push(parseInt(channel_id))

                })
            }




            //refresh_table()
        });

        send_close_request(JSON.stringify(to_del))
    });
});

$(function () {
    function initTableCheckbox(){
        var $thr = $('table thead tr')

        var $checkAll = $thr.find('input');
        $checkAll.click(function(event){
            var $tbr = $('table tbody tr');
            $tbr.find('input').prop('checked',$(this).prop('checked'));
            event.stopPropagation();

        });


    }

    initTableCheckbox()
});