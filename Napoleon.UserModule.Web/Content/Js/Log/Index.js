﻿
define(function (require, exports, module) {

    var easyui = require("../PublicJs/Frame/Easyui.js");

    //加载权限
    exports.LoadOperate = function (selector) {
        var iframeid = window.parent.$('#tabs').tabs('getSelected').find('iframe').attr("id");
        easyui.LoadOperate(selector, iframeid);
    };

    //加载日志列表
    exports.LoadGrid = function () {
        var url, gridColumns, title;
        url = '/Log/LoadDataGrid';
        title = '日志列表';
        gridColumns = [
            /*{ field: 'UserName', title: '操作用户', halign: 'center', align: 'center', width: 80 },*/
            { field: 'IpAddress', title: 'IP地址', halign: 'center', align: 'center', width: 100 },
            { field: 'OperateTime', title: '日志时间', halign: 'center', align: 'center', width: 100 },
            { field: 'OperateContent', title: '日志内容', halign: 'center', align: 'left', width: 300 },
            { field: 'OperateUrl', title: '地址', halign: 'center', align: 'center', width: 100 },
            { field: 'OperateType', title: '日志类型', halign: 'center', align: 'center', width: 100 }
        ];
        var columns = [
            { field: 'IpAddress', title: 'IP地址',  width: 100 },
            { field: 'OperateTime', title: '日志时间',  width: 100 },
            { field: 'OperateContent', title: '日志内容',  width: 100 },
            { field: 'OperateUrl', title: '地址',  width: 100 },
            { field: 'OperateType', title: '日志类型',  width: 100 }
        ];
        easyui.LoadComboGrid('#content', '/Log/LoadDataGrids', false, columns, undefined);
        easyui.LoadPageDataGrid("#gridTool", url, gridColumns, title, undefined, undefined, undefined, exports.FixedInfo);
    };

    //设置页面
    exports.LoadBody = function () {
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;
        $('#searchTool').css('width', width - 4 + "px");
        easyui.ResizeDataGrid("#gridTool", height - 65, width - 4);
    };

    //查询
    exports.FixedSearch = function () {
        var userName = $('#userName').val();
        var content = $('#content').val();
        var datetime1 = $('#datetime1').datebox('getValue');
        var datetime2 = $('#datetime2').datebox('getValue');
        var parameters = { userName: userName, content: content, datetime1: datetime1, datetime2: datetime2 };
        if (datetime2 < datetime1) {
            parent.window.$.messager.alert('警告', '结束时间不能小于开始时间！', 'warning');
            return;
        }
        easyui.LoadPageDataGrid("#gridTool", parameters);
    };

    //导出Excel
    exports.FixedExcel = function () {
        var userName = $('#userName').val();
        var content = $('#content').val();
        var datetime1 = $('#datetime1').datebox('getValue');
        var datetime2 = $('#datetime2').datebox('getValue');
        //window.location.href = '/Log/ExcelLog?userName=' + userName + '&content=' + content + '&datetime1=' + datetime1 + '&datetime2=' + datetime2;
        parent.window.$.messager.progress({
            msg: '导出Excel中...'
        });
        $.ajax({
            url: '/Log/ExcelLog',
            type: 'post',
            data: { userName: userName, content: content, datetime1: datetime1, datetime2: datetime2 },
            success: function (data) {
                window.location = data;
                parent.window.$.messager.progress('close');
            }
        });
    };

    //详情页面
    exports.FixedInfo = function () {
        var row = $('#gridTool').datagrid('getSelected');
        if (row === null || row === undefined) {
            parent.window.$.messager.alert('提示', '请先选择需要查看详情的数据行！', 'info');
            return;
        }
        window.location.href = 'ViewInfo?id=' + row.Id;
    };

})