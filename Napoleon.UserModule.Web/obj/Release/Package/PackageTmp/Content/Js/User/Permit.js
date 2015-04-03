﻿
define(function (require, exports, module) {

    var easyui = require("../PublicFunc/Easyui.js");

    //加载权限列表
    exports.LoadGrid = function (userId) {
        var url, gridColumns, title;
        url = '/User/LoadPermitGrid?userId=' + userId + '&randId=' + Math.random();
        title = '权限列表';
        gridColumns = [
            { field: 'ProjectId', title: '系统代码', halign: 'center', align: 'center', width: 100 },
            { field: 'Company', title: '单位名称', halign: 'center', align: 'center', width: 100 },
            { field: 'RuleName', title: '角色名称', halign: 'center', align: 'center', width: 100 }
        ];
        easyui.LoadDataGrid("#gridTool", url, gridColumns, title, true, 10, [10, 20, 30, 40, 50]);
    };

    //新增用户权限
    exports.FixedAdd = function (userId) {
        var url = '/User/PermitAdd?userId=' + userId + '&randId=' + Math.random();
        easyui.ShowWindow('#myWindow', '新增权限', url, '340', '260');
    };

    //删除权限
    exports.FixedDelete = function () {
        var row = $('#gridTool').datagrid('getSelected');
        if (row === null || row === undefined) {
            parent.window.$.messager.alert('提示', '请先选择需要删除的行！', 'info');
            return;
        }
        parent.window.$.messager.confirm('提示', '确定删除该行？', function (result) {
            if (result) {
                $.ajax({
                    url: '/User/DeletePermit',
                    data: { id: row.Id },
                    type: 'post',
                    complete: function (msg) {
                        switch (msg.responseText.substring(0, 4)) {
                            case "删除成功":
                                parent.window.$.messager.alert('提示', msg.responseText, 'info');
                                $('#gridTool').datagrid('reload');
                                break;
                            default:
                                parent.window.$.messager.alert('提示', '删除失败！', 'info');
                        }
                    }
                });
            }
        });
    };

    //保存
    exports.FixedSave = function () {
        $('#SaveRuleForm').form('submit', {
            url: '/User/SavePermitAdd',
            success: function (data) {
                switch (data.substring(0, 4)) {
                    case "添加成功":
                        parent.window.$('#myWindow').window('close');
                        parent.window.$.messager.alert('提示', data, 'info');
                        parent.window.$('#gridTool').datagrid('reload');
                        break;
                    case "添加失败":
                        parent.window.$.messager.alert('提示', data, 'info');
                        break;
                    default:
                        parent.window.$.messager.alert('提示', "添加失败！", 'info');
                        break;
                }
            }
        });
    };

    //二级联动下拉框
    exports.Load2Combobox = function (data) {
        $('#Company').combobox({
            url: '/User/PermitCompany?projectId=' + data.id + '&id=0',
            valueField: 'id',
            textField: 'text',
            editable: false,
            panelHeight: 'auto',
            onSelect: function (value) {
                $("#Rule").combobox({
                    url: '/User/PermitCompany?id=' + value.id,
                    valueField: 'id',
                    textField: 'text',
                    editable: false,
                    panelHeight: 'auto'
                }).combobox('clear');
            }
        }).combobox('clear');
    };

})