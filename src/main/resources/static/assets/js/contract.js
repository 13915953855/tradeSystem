var queryType;
$(function () {
    queryType = getParam("type");
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();

    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: true,
        minView: 2,
        maxView: 4,
        todayHighlight: true,
        language: 'zh-CN'
    });
    $("#level").select2({
        tags: true
    });
    $("select").on("change",function(){
        $("#btn_query").click();
    });
    $("#cargoType").change(function(){
        $("#cargoName").empty();
        $("#cargoName").append("<option>全部</option>");
        initCargoList();
        $("#externalCompany").empty();
        $("#externalCompany").append("<option>全部</option>");
        initExternalCompany();
    });
    initLevel();
    initDestinationPort();
    initBusinessMode();
    initCaiyangcangku();
    initExternalCompany();
    initCargoList();
    initAgent();
    initOriginCountry();
    initOwnerCompanyList();
    if(queryType == "" || queryType == null || queryType == undefined){
        $("#totalInfoDiv").show();
        $("#btn_excel").show();
        getTotalInfo();
    }else{
        $("#totalInfoDiv").hide();
        $("#btn_excel").hide();
    }
});
var toFloat = function (value) {
    value = Math.round(parseFloat(value) * 100) / 100;
    if (value.toString().indexOf(".") < 0) {
        value = value.toString() + ".00";
    }
    return value;
}
var toFloat4 = function (value) {
    value = Math.round(parseFloat(value) * 10000) / 10000;
    if (value.toString().indexOf(".") < 0) {
        value = value.toString() + ".0000";
    }
    return value;
}
function getTotalInfo(){
        var externalCompanyArr = $("#externalCompany").val();
        var externalCompany = "";
        if(externalCompanyArr != null){
            for(var i=0;i<externalCompanyArr.length;i++){
                if(externalCompanyArr[i] != '全部'){
                    externalCompany += "'"+externalCompanyArr[i] + "',";
                }else{
                    externalCompany = "";break;
                }
            }
        }
        if(externalCompany.length > 1){
            externalCompany = externalCompany.substring(0,externalCompany.length-1);
        }
        var originCountryArr = $("#originCountry").val();
                var originCountry = "";
                if(originCountryArr != null){
                    for(var i=0;i<originCountryArr.length;i++){
                        if(originCountryArr[i] != '全部'){
                            originCountry += "'"+originCountryArr[i] + "',";
                        }else{
                            originCountry = "";break;
                        }
                    }
                }
                if(originCountry.length > 1){
                    originCountry = originCountry.substring(0,originCountry.length-1);
                }

    var level = $("#level").val() == "全部" ? "" : $("#level").val();

        var cargoName = $("#cargoName").val() == "全部" ? "":$("#cargoName").val();
        var businessModeArr = $("#businessMode").val();
        var businessMode = "";
        if(businessModeArr != null){
            for(var i=0;i<businessModeArr.length;i++){
                if(businessModeArr[i] != '全部'){
                    businessMode += "'"+businessModeArr[i] + "',";
                }else{
                    businessMode = "";break;
                }
            }
        }
        if(businessMode.length > 1){
            businessMode = businessMode.substring(0,businessMode.length-1);
        }
        var agentArr = $("#agent").val();
        var agent = "";
        if(agentArr != null){
            for(var i=0;i<agentArr.length;i++){
                if(agentArr[i] != '全部'){
                    agent += "'"+agentArr[i] + "',";
                }else{
                    agent = "";break;
                }
            }
        }
        if(agent.length > 1){
            agent = agent.substring(0,agent.length-1);
        }
        var destinationPortArr = $("#destinationPort").val();
        var destinationPort = "";
        if(destinationPortArr != null){
            for(var i=0;i<destinationPortArr.length;i++){
                if(destinationPortArr[i] != '全部'){
                    destinationPort += "'"+destinationPortArr[i] + "',";
                }else{
                    destinationPort = "";break;
                }
            }
        }
        if(destinationPort.length > 1){
            destinationPort = destinationPort.substring(0,destinationPort.length-1);
        }
        var statusArr = $("#status").val();
        var status = "";
        if(statusArr != null){
            for(var i=0;i<statusArr.length;i++){
                if(statusArr[i] != '全部'){
                    status += "'"+statusArr[i] + "',";
                }else{
                    status = "";break;
                }
            }
        }
        if(status.length > 1){
            status = status.substring(0,status.length-1);
        }
    var queryParams = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        storageCondition: $("#storageCondition").val() == "全部"?"":$("#storageCondition").val(),
        externalContract: $("#externalContract").val(),
        insideContract: $("#insideContract").val(),
        contractStartDate: $("#contractStartDate").val(),
        contractEndDate: $("#contractEndDate").val(),
        storeStartDate: $("#storeStartDate").val(),
        storeEndDate: $("#storeEndDate").val(),
        taxPayDateStart: $("#taxPayDateStart").val(),
        taxPayDateEnd: $("#taxPayDateEnd").val(),
        etaStartDate: $("#etaStartDate").val(),
        etaEndDate: $("#etaEndDate").val(),
        etdStartDate: $("#etdStartDate").val(),
        etdEndDate: $("#etdEndDate").val(),
        caiyangcangku: $("#caiyangcangku").val(),
        caiyangdateStart: $("#caiyangdateStart").val(),
        caiyangdateEnd: $("#caiyangdateEnd").val(),
        cargoName: cargoName,
        cargoNo: $("#cargoNo").val(),
        cargoType: $("#cargoType").val(),
        tariffNo: $("#tariffNo").val(),
        level: level,
        agent: agent,
        containerNo: $("#containerNo").val(),
        companyNo: $("#companyNo").val(),
        ladingbillNo: $("#ladingbillNo").val(),
        cmpRel: $("#cmpRel").val(),
        destinationPort: destinationPort,
        businessMode: businessMode,
        externalCompany: externalCompany,
        status: status,
        type:queryType,
        originCountry:originCountry,
        ownerCompany:$("#ownerCompany").val() == "全部"?"":$("#ownerCompany").val()
    };

    $.ajax({
        url:"/trade/contract/getTotalInfo",
        type:"POST",
        dataType:"json",
        data:queryParams,
        success:function(res){
            if(res.status == "1"){
                $("#totalCNYContractMoney").html(toFloat(res.totalCNYContractMoney));
                $("#totalCNYInvoiceMoney").html(toFloat(res.totalCNYInvoiceMoney));
                $("#totalUSDContractMoney").html(toFloat(res.totalUSDContractMoney));
                $("#totalUSDInvoiceMoney").html(toFloat(res.totalUSDInvoiceMoney));
                $("#totalAUDContractMoney").html(toFloat(res.totalAUDContractMoney));
                $("#totalAUDInvoiceMoney").html(toFloat(res.totalAUDInvoiceMoney));
                $("#totalContractAmount").html(toFloat4(res.totalContractAmount));
                $("#totalInvoiceAmount").html(toFloat4(res.totalInvoiceAmount));
            }
        }
    });
}

var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_contract').bootstrapTable({
            url: '/trade/list',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: true,                     //是否启用排序
            sortName: "contractDate",                     //排序字段名
            sortOrder: "desc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: false,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            onDblClickRow:function(row){
                window.location.href = "/trade/contract/view?id="+row.id;
            },
            columns: [{
                checkbox: true
            }, {
                field: 'externalContract',
                title: '外合同编号'
            }, {
                field: 'insideContract',
                title: '内合同编号'
            }, {
                field: 'externalCompany',
                title: '外商'
            }, {
                field: 'contractDate',
                title: '合同日期',
                sortable:true
            }, {
                field: 'expectSailingDate',
                title: '预计船期'
            }, {
                field: 'etd',
                title: 'ETD',
                                            formatter: function(value,row,index){
                                                if(value > getDay(-7)) return "<font color='blue'>"+value+"</font>";
                                                else return value;
                                            }
            }, {
                field: 'eta',
                title: 'ETA',
                                            formatter: function(value,row,index){
                                                if(value > getDay(-7)) return "<font color='blue'>"+value+"</font>";
                                                else return value;
                                            }
            }, {
                field: 'totalBoxes',
                title: '库存总箱数',
              formatter: function(value, row, index){//0-作废，1-已下单，2-已装船，3-已到港，4-已入库,5-已售完
                  if(row.status == "4"){
                      return value;
                  }else {
                      return 0;
                  }
              }
            }, {
                field: 'status',
                title: '状态',
                formatter: function(value, row, index){//0-作废，1-已下单，2-已装船，3-已到港，4-已入库,5-已售完
                    if(value == "1"){
                        return "已下单";
                    }else if(value == "2"){
                        return "已装船";
                    }else if(value == "3"){
                        return "已到港";
                    }else if(value == "4"){
                        return "已入库";
                    }else if(value == "5"){
                         return "已售完";
                     }else{
                        return "-";
                    }
                }
            }, {
                 field: 'id',
                 title: '操作',
                 formatter: function(value, row, index){
                    var s = '<a href="/trade/contract/view?id='+value+'">查看 </a>';
                    s += '\t\t<a href="/trade/contract/hesuan?id='+value+'">| 核算</a>';
                    return s;
                 }
             }  ]
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var externalCompanyArr = $("#externalCompany").val();
        var externalCompany = "";
        if(externalCompanyArr != null){
            for(var i=0;i<externalCompanyArr.length;i++){
                if(externalCompanyArr[i] != '全部'){
                    externalCompany += "'"+externalCompanyArr[i] + "',";
                }else{
                    externalCompany = "";break;
                }
            }
        }
        if(externalCompany.length > 1){
            externalCompany = externalCompany.substring(0,externalCompany.length-1);
        }
       var originCountryArr = $("#originCountry").val();
                        var originCountry = "";
                        if(originCountryArr != null){
                            for(var i=0;i<originCountryArr.length;i++){
                                if(originCountryArr[i] != '全部'){
                                    originCountry += "'"+originCountryArr[i] + "',";
                                }else{
                                    originCountry = "";break;
                                }
                            }
                        }
                        if(originCountry.length > 1){
                            originCountry = originCountry.substring(0,originCountry.length-1);
                        }
        var level = $("#level").val() == "全部" ? "" : $("#level").val();

        var cargoName = $("#cargoName").val() == "全部" ? "":$("#cargoName").val();
        var businessModeArr = $("#businessMode").val();
        var businessMode = "";
        if(businessModeArr != null){
            for(var i=0;i<businessModeArr.length;i++){
                if(businessModeArr[i] != '全部'){
                    businessMode += "'"+businessModeArr[i] + "',";
                }else{
                    businessMode = "";break;
                }
            }
        }
        if(businessMode.length > 1){
            businessMode = businessMode.substring(0,businessMode.length-1);
        }
        var agentArr = $("#agent").val();
        var agent = "";
        if(agentArr != null){
            for(var i=0;i<agentArr.length;i++){
                if(agentArr[i] != '全部'){
                    agent += "'"+agentArr[i] + "',";
                }else{
                    agent = "";break;
                }
            }
        }
        if(agent.length > 1){
            agent = agent.substring(0,agent.length-1);
        }
        var destinationPortArr = $("#destinationPort").val();
        var destinationPort = "";
        if(destinationPortArr != null){
            for(var i=0;i<destinationPortArr.length;i++){
                if(destinationPortArr[i] != '全部'){
                    destinationPort += "'"+destinationPortArr[i] + "',";
                }else{
                    destinationPort = "";break;
                }
            }
        }
        if(destinationPort.length > 1){
            destinationPort = destinationPort.substring(0,destinationPort.length-1);
        }
        var statusArr = $("#status").val();
        var status = "";
        if(statusArr != null){
            for(var i=0;i<statusArr.length;i++){
                if(statusArr[i] != '全部'){
                    status += "'"+statusArr[i] + "',";
                }else{
                    status = "";break;
                }
            }
        }
        if(status.length > 1){
            status = status.substring(0,status.length-1);
        }

        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
            externalContract: $("#externalContract").val(),
            storageCondition: $("#storageCondition").val() == "全部"?"":$("#storageCondition").val(),
            insideContract: $("#insideContract").val(),
            contractStartDate: $("#contractStartDate").val(),
            contractEndDate: $("#contractEndDate").val(),
            storeStartDate: $("#storeStartDate").val(),
            storeEndDate: $("#storeEndDate").val(),
            taxPayDateStart: $("#taxPayDateStart").val(),
            taxPayDateEnd: $("#taxPayDateEnd").val(),
            etaStartDate: $("#etaStartDate").val(),
            caiyangcangku: $("#caiyangcangku").val(),
            cmpRel: $("#cmpRel").val(),
                    caiyangdateStart: $("#caiyangdateStart").val(),
                    caiyangdateEnd: $("#caiyangdateEnd").val(),
            etaEndDate: $("#etaEndDate").val(),
            etdStartDate: $("#etdStartDate").val(),
            etdEndDate: $("#etdEndDate").val(),
            cargoName: cargoName,
            cargoNo: $("#cargoNo").val(),
            cargoType: $("#cargoType").val(),
            tariffNo: $("#tariffNo").val(),
            level: level,
            agent: agent,
            containerNo: $("#containerNo").val(),
            companyNo: $("#companyNo").val(),
            ladingbillNo: $("#ladingbillNo").val(),
            destinationPort: destinationPort,
            businessMode: businessMode,
            externalCompany: externalCompany,
            status: status,
            type:queryType,
            originCountry:originCountry,
            ownerCompany:$("#ownerCompany").val() == "全部"?"":$("#ownerCompany").val(),
            sortName:this.sortName,
            sortOrder:this.sortOrder,
        };
        return temp;
    };
    return oTableInit;
};


var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function () {
        //初始化页面上面的按钮事件
        $("#htBtn").click(function(){
             if (this.checked){
                 $("#htDiv input[name='excelChk']:checkbox").prop("checked", true);
             } else {
                 $("#htDiv input[name='excelChk']:checkbox").prop("checked", false);
             }
         });

         $("#spBtn").click(function(){
             if (this.checked){
                 $("#spDiv input[name='excelChk']:checkbox").prop("checked", true);
             } else {
                 $("#spDiv input[name='excelChk']:checkbox").prop("checked", false);
             }
         });
         $("#jxBtn").click(function(){
             if (this.checked){
                 $("#jxDiv input[name='excelChk']:checkbox").prop("checked", true);
             } else {
                 $("#jxDiv input[name='excelChk']:checkbox").prop("checked", false);
             }
         });
        $("#btn_query").click(function(){
            queryType = "";
            $('#tb_contract').bootstrapTable("refresh",{pageNumber:1});
            if(queryType == ""){
                $("#totalInfoDiv").show();
                $("#btn_excel").show();
                getTotalInfo();
            }else{
                $("#totalInfoDiv").hide();
                $("#btn_excel").hide();
            }
        });
        $("#btn_reset").click(function(){
            queryType = "";
            resetQuery();
        });
        $("#btn_add").click(function(){
            window.location.href="/trade/contract/add";
        });
        $("#btn_copy").click(function(){
            swal({
              title: '复制合同',
              text: '确定复制吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(function(){
              var a = $('#tb_contract').bootstrapTable('getSelections');
              if(a.length == 1){
                   var id = a[0].id;
                   $.ajax({
                     url:"/trade/contract/copy",
                     type:"POST",
                     dataType:"json",
                     data:{"id":id},
                     success:function(res){
                         if(res.status == "1"){
                             swal('复制成功！','','success');
                         }else{
                             swal('复制失败！','','error');
                         }
                         $("#tb_contract").bootstrapTable("refresh",{pageNumber:1});
                     }
                 });
              }else if(a.length > 1){
                  swal('仅支持编辑一行！','','warning');
              }else{
                  swal('请选中一行！','','warning');
              }
            });
        });
        $("#btn_edit").click(function(){
            var a = $('#tb_contract').bootstrapTable('getSelections');
            if(a.length == 1){
                 var id = a[0].id;
                 window.location.href="/trade/contract/update?id="+id;
            }else if(a.length > 1){
                swal('仅支持编辑一行！','','warning');
            }else{
                swal('请选中一行！','','warning');
            }
        });
        $("#btn_delete").click(function(){
            swal({
              title: '确定删除吗？',
              text: '你将无法恢复它！',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(function(){
              var a = $('#tb_contract').bootstrapTable('getSelections');
              var ids = "";
              for(var i=0;i<a.length;i++) {
                  ids += a[i].id+",";
              }
              if(ids != ""){
                  $.ajax({
                      url:"/trade/contract/delete",
                      type:"POST",
                      dataType:"json",
                      data:{"ids":ids},
                      success:function(res){
                          if(res.status == "1"){
                              swal('删除成功！','','success');
                          }else{
                              swal('删除失败！','','error');
                          }
                          $("#tb_contract").bootstrapTable("refresh",{pageNumber:1});
                      }
                  });
              }
            });
        });
        $("#btn_output").click(function(){
            var externalCompanyArr = $("#externalCompany").val();
            var externalCompany = "";
            if(externalCompanyArr != null){
                for(var i=0;i<externalCompanyArr.length;i++){
                    if(externalCompanyArr[i] != '全部'){
                        externalCompany += "'"+externalCompanyArr[i] + "',";
                    }else{
                        externalCompany = "";break;
                    }
                }
            }
            if(externalCompany.length > 1){
                externalCompany = externalCompany.substring(0,externalCompany.length-1);
            }
            var originCountryArr = $("#originCountry").val();
                            var originCountry = "";
                            if(originCountryArr != null){
                                for(var i=0;i<originCountryArr.length;i++){
                                    if(originCountryArr[i] != '全部'){
                                        originCountry += "'"+originCountryArr[i] + "',";
                                    }else{
                                        originCountry = "";break;
                                    }
                                }
                            }
                            if(originCountry.length > 1){
                                originCountry = originCountry.substring(0,originCountry.length-1);
                            }
            var level = $("#level").val() == "全部" ? "" : $("#level").val();

            var cargoName = $("#cargoName").val() == "全部" ? "":$("#cargoName").val();
            var businessModeArr = $("#businessMode").val();
            var businessMode = "";
            if(businessModeArr != null){
                for(var i=0;i<businessModeArr.length;i++){
                    if(businessModeArr[i] != '全部'){
                        businessMode += "'"+businessModeArr[i] + "',";
                    }else{
                        businessMode = "";break;
                    }
                }
            }
            if(businessMode.length > 1){
                businessMode = businessMode.substring(0,businessMode.length-1);
            }
            var agentArr = $("#agent").val();
            var agent = "";
            if(agentArr != null){
                for(var i=0;i<agentArr.length;i++){
                    if(agentArr[i] != '全部'){
                        agent += "'"+agentArr[i] + "',";
                    }else{
                        agent = "";break;
                    }
                }
            }
            if(agent.length > 1){
                agent = agent.substring(0,agent.length-1);
            }
            var destinationPortArr = $("#destinationPort").val();
            var destinationPort = "";
            if(destinationPortArr != null){
                for(var i=0;i<destinationPortArr.length;i++){
                    if(destinationPortArr[i] != '全部'){
                        destinationPort += "'"+destinationPortArr[i] + "',";
                    }else{
                        destinationPort = "";break;
                    }
                }
            }
            if(destinationPort.length > 1){
                destinationPort = destinationPort.substring(0,destinationPort.length-1);
            }
            var statusArr = $("#status").val();
            var status = "";
            if(statusArr != null){
                for(var i=0;i<statusArr.length;i++){
                    if(statusArr[i] != '全部'){
                        status += "'"+statusArr[i] + "',";
                    }else{
                        status = "";break;
                    }
                }
            }
            if(status.length > 1){
                status = status.substring(0,status.length-1);
            }
            var externalContract = $("#externalContract").val();
            var insideContract=$("#insideContract").val();
            var contractStartDate= $("#contractStartDate").val();
            var contractEndDate= $("#contractEndDate").val();
            var storeStartDate = $("#storeStartDate").val();
            var storeEndDate = $("#storeEndDate").val();
            var taxPayDateStart = $("#taxPayDateStart").val();
            var taxPayDateEnd = $("#taxPayDateEnd").val();
            var etaStartDate= $("#etaStartDate").val();
            var etaEndDate= $("#etaEndDate").val();
            var etdStartDate= $("#etdStartDate").val();
            var etdEndDate= $("#etdEndDate").val();
            var containerNo=$("#containerNo").val();
            var cargoNo=$("#cargoNo").val();
            var cmpRel=$("#cmpRel").val();
            var companyNo= $("#companyNo").val();
            var cargoType= $("#cargoType").val();
            var ladingbillNo= $("#ladingbillNo").val();
            var caiyangcangku= $("#caiyangcangku").val();
            var caiyangdateStart= $("#caiyangdateStart").val();
            var caiyangdateEnd= $("#caiyangdateEnd").val();

            var chk = new Array();
            $("input[name='excelChk']:checkbox").each(function(i){
                if (true == $(this).is(':checked')) {
                    chk[i] = "1";
                }else{
                    chk[i] = "0";
                }
            });

            var params = "?externalContract="+externalContract;
            var storageCondition = $("#storageCondition").val()=="全部"?"":$("#storageCondition").val();
            params += "&storageCondition="+storageCondition;
            params += "&insideContract="+insideContract;
            params += "&contractStartDate="+contractStartDate;
            params += "&contractEndDate="+contractEndDate;
            params += "&caiyangcangku="+caiyangcangku;
            params += "&cmpRel="+cmpRel;
            params += "&caiyangdateStart="+caiyangdateStart;
            params += "&caiyangdateEnd="+caiyangdateEnd;
            params += "&storeStartDate="+storeStartDate;
            params += "&storeEndDate="+storeEndDate;
            params += "&taxPayDateStart="+taxPayDateStart;
            params += "&taxPayDateEnd="+taxPayDateEnd;
            params += "&etaStartDate="+etaStartDate;
            params += "&etaEndDate="+etaEndDate;
            params += "&etdStartDate="+etdStartDate;
            params += "&etdEndDate="+etdEndDate;
            params += "&cargoName="+cargoName;
            params += "&level="+level;
            params += "&agent="+agent;
            params += "&containerNo="+containerNo;
            params += "&cargoType="+cargoType;
            params += "&cargoNo="+cargoNo;
            params += "&companyNo="+companyNo;
            params += "&ladingbillNo="+ladingbillNo;
            params += "&destinationPort="+destinationPort;
            params += "&businessMode="+businessMode;
            params += "&externalCompany="+externalCompany;
            params += "&status="+status;
            params += "&originCountry="+originCountry;
            var ownerCompany = $("#ownerCompany").val() == "全部"?"":$("#ownerCompany").val();
            params += "&ownerCompany="+ownerCompany;
            params += "&chk="+chk;
            params += "&type="+queryType;
        	var url = "/trade/contract/output"+params;
        	window.open(url);
        });
    };

    return oInit;
};

function resetQuery(){
    $("#externalContract").val("");
    $("#insideContract").val("");
    $("#contractStartDate").val("");
    $("#contractEndDate").val("");
    $("#containerNo").val("");
    $("#ladingbillNo").val("");
    $("#storageCondition").val("全部").trigger("change");
    $("#agent").val("全部").trigger("change");
    $("#cmpRel").val("1").trigger("change");
    $("#companyNo").val("");
    $("#destinationPort").val("全部").trigger("change");
    $("#businessMode").val("全部").trigger("change");
    $("#status").val("全部").trigger("change");
    $("#externalCompany").val("全部").trigger("change");
    $("#level").val("全部").trigger("change");
    $("#cargoName").val("全部").trigger("change");
    $("#originCountry").val("全部").trigger("change");
    $("#ownerCompany").val("全部").trigger("change");
    $("#etaStartDate").val("");
    $("#etaEndDate").val("");
    $("#etdStartDate").val("");
    $("#etdEndDate").val("");
    $("#cargoNo").val("");
}