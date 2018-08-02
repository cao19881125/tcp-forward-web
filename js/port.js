



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

/* 初始化port列表

------------*/

var checkitem = "<input type=\"checkbox\" name=\"checkItem\" class='mycheckbox'/>"
var dataSet = [
    [checkitem,"8081","192.168.10.10","8080","client-one"],
    [checkitem,"80","192.168.40.10","80","client-tow"],
    [checkitem,"2345","192.168.10.10","4321","client-one"],
    [checkitem,"1212","192.168.10.10","3321","client-one"]

];

var table_data = []
for(var i=0;i<10;i++){
    for(var j=0;j<dataSet.length;j++){
        table_data.push(dataSet[j])
    }
}

function table_change() {
    //alert('next');
    var $tt = $('#checkAll')
    $tt.prop('checked',false)

    //var $thr = $('table thead tr')
    //var $checkAll = $thr.find('input');
    //$checkAll.prop('checked',false)

    var $tbr = $('table tbody tr');
    $tbr.find('input').prop('checked',false)

}

function go_to_login() {
    $.cookie('go-back',true,{path:'/tcp-forward-web'})
    window.location.href = 'login.html'
}


$(document).ready(function() {

    // $('#myTable').DataTable( {
    //     data:table_data,
    //     drawCallback: function(){
    //         $('.paginate_button', this.api().table().container())
    //             .on('click', table_change());
    //     }
    // } );




    $('#close_btn').click(function(){
        $(".modal-backdrop").hide();
        $('#myModal').hide()
    });

    $('#add_port_btn').click(function () {
        $('#val-port').val('')
        $('#val-innerip').val('')
        $('#val-innerport').val('')
        $('#val-tag').val('')
        $(".modal-backdrop").show();
        $('#myModal').show()
    })

    $('#ok_btn').click(function () {
        var port = document.getElementById('val-port').value
        var innerip = document.getElementById('val-innerip').value
        var innerport = document.getElementById('val-innerport').value
        var tag = document.getElementById('val-tag').value

        console.log(port)
        console.log(innerip)
        console.log(innerport)
        console.log(tag)

        var params = {port:port,mapper_ip:innerip,mapper_port:innerport,mapper_tag:tag}
        //console.log(params)

        // $.ajax({
        //     url: 'forward_server/port_mapper',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     type: "POST", /* or type:"GET" or type:"PUT" */
        //     dataType:"json",
        //     data: params,
        //     success: function (data, textStatus, response) {
        //         console.log(data)
        //         refresh_table()
        //         toastr.success('添加端口成功')
        //     },
        //     error: function (result) {
        //         console.log(result);
        //         toastr.error('添加端口失败')
        //     }
        // });

        send_request('forward_server/port_mapper',"POST",params,function () {

            refresh_table()
            toastr.success('添加端口成功')
        },function () {
            console.log(result);
            toastr.error('添加端口失败')
        });

        $(".modal-backdrop").hide();
        $('#myModal').hide();
    });

    $('#del-btn').click(function () {




        var table = $('#myTable').DataTable();
        var to_del = new Array()
        var trs = $('table tbody tr').each(function(index,element){


            if($(this).find('input').prop('checked')){
                // table
                //     .row( $(this) )
                //     .remove()
                //     .draw();
                $(this).each(function (index,element) {
                    var port = $($(element).find('td')[1]).text()
                    to_del.push(parseInt(port))

                })
            }

        });

        console.log(JSON.stringify(to_del))
        send_del_request(JSON.stringify(to_del))



        //refresh_table()
        //$('#myTable').DataTable({data:dataSet}).draw()

        //$tt.prop('checked',true)

        //for(var i=0;i<$tbr.length;i++){
        //    console.log($tbr[i])
        //}


    });

    function send_del_request(ports) {
        var params = {ports:ports,_method:"DELETE"}
        // $.ajax({
        //     url: 'forward_server/port_mapper',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     type: "POST", /* or type:"GET" or type:"PUT" */
        //     dataType:"json",
        //     data: params,
        //     success: function (data, textStatus, response) {
        //         console.log(data)
        //         toastr.success('删除端口' + port + '成功')
        //     },
        //     error: function (result) {
        //         console.log(result);
        //         toastr.error('删除端口' + port + '失败')
        //     }
        // });
        send_request('forward_server/port_mapper',"POST",params,function () {
            toastr.success('删除端口' + ports + '成功')
            refresh_table()
        },function () {
            toastr.error('删除端口' + ports + '失败')
        })
    }
    
    function handle_response_data(data) {
        var result_array = new Array()
        for(var key in data){
            var per_data_array = new Array()
            per_data_array.push(checkitem)
            per_data_array.push(key.toString())
            per_data_array.push(data[key].ip)
            per_data_array.push(data[key].port)
            per_data_array.push(data[key].tag)
            result_array.push(per_data_array)
        }
        console.log(result_array)
        mytable = $('#myTable').DataTable( {
            data:result_array,
            drawCallback: function(){
                $('.paginate_button', this.api().table().container())
                    .on('click', table_change());
            }
        } );
    }





    function refresh_data() {
        // $.ajax({
        //     //url: 'http://192.168.184.128:8080/port_mapper',
        //     url: 'forward_server/port_mapper',
        //     type: "GET", /* or type:"GET" or type:"PUT" */
        //     data:null,
        //     success: function (data, textStatus, response) {
        //         //console.log(data)
        //         handle_response_data(data)
        //     },
        //     error: function (result) {
        //         console.log(result);
        //         if(result.status == 401){
        //             go_to_login()
        //         }
        //
        //     }
        // });
        send_request('forward_server/port_mapper',"GET",null,handle_response_data)


    }

    function refresh_table() {

        mytable.clear()
        mytable.destroy()
        refresh_data()
    }

    $(function () {
        refresh_data()

    });

    $('#test-btn').click(function () {

        toastr.success("success");
        toastr.error("error");
        toastr.warning('warning');
        toastr.info('info');

    });

    $('.close').click(function () {

    })




} );



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

$('#myModal').on('show.bs.modal', function (event) {

});

$('#myModal').on('shown.bs.modal', function (event) {
    alert('shown.bs.modal')
});

$('#myModal').on('hide.bs.modal', function (event) {
    console.log('***********')
    alert('hide.bs.modal')
})
