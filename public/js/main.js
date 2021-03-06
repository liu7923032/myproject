$.extend({
    initMenu: function () {

        $('.sys-menu').find('li>a').click(function () {
            var url = $(this).attr('_href');


            var title = $(this).text();

            $.tabAdd(title, url);
        })

    },
    //新增菜单
    tabAdd: function (title, url) {
        var $tab = $('#tabs_main');
        var isExist = $tab.tabs('exists', title);
        if (isExist) {
            var existTab = $tab.tabs('getTab', title);
            $tab.tabs('update', {
                tab: existTab,
                options: {
                    title: title,
                    closable: true,
                    // href: url  // the new content URL
                    content: "<iframe style='width:100%;height:100%; border:0px solid #000;'  fit='true' scrolling='yes' src='" + url + " '></iframe>"
                }
            })

            $tab.tabs('select', title);
        } else {
            $tab.tabs('add', {
                title: title,
                selected: true,
                closable: true,
                // href:url,
                content: "<iframe style='width:100%;height:100%; border:0px solid #000;'  fit='true' scrolling='yes' src='" + url + " '></iframe>"
            });
        }
    },
    //
    dgInit: function (options) {
        var dataGirdOptions = {
            rownumbers: true,
            border: 0,
            nowrap: false,
            loadMsg: '正在加载数据...',
            striped: true,
            showFooter: true,
            //定义通过远程排序
            remoteSort: true,
            pagination: true,
            singleSelect: true,
            checkOnSelect: false,
            fit: true,
            fitColumns: true,
            pageSize: 15,
            pageNumber: 1,
            pageList: [15, 30, 45],
            onBeforeLoad: function (param) {
                console.log(param)
            },
            queryParams: {},
            // loader:function(param,success,error){
            //     console.log(param)
            // }
        }
        $.extend(dataGirdOptions, options);
        console.log(dataGirdOptions)
        $('#' + options.id).datagrid(dataGirdOptions);
    },
    dgAdd: function (opitons) {
        var $tb = $('#' + options.id);
        var rows = $tb.datagrid('getRows');
        var newRow = options.row || {};
        if (rows.length == 0) {
            $tb.datagrid('insertRow', {
                index: 0,
                row: newRow
            });
            $tb.datagrid('beginEdit', 0);
            $tb.datagrid('selectRow', 0)

        } else {
            //首先要先保存未更新的数据
            var editIndex = -1;
            $('.datagrid-row-editing').each(function (index, item) {
                editIndex = $(this).attr('datagrid-row-index');
            });
            //console.log("原有编辑行：" + editIndex);
            if (editIndex > -1) {
                //检查必填项是否都写完
                var isValidate = $tb.datagrid('validateRow', editIndex);
                if (!isValidate) {
                    $.messager.alert("错误提示", "请填写完成每行的<span>必填项</span>");
                    return;
                }
                //更新前
                if (options.before && typeof options.before == "function") {
                    options.before(editIndex);
                }
                $tb.datagrid('endEdit', editIndex);
                //更新后执行的方法
                if (options.endEdit && typeof (options.endEdit) == "function") {
                    options.endEdit(editIndex);
                }
            }
            $tb.datagrid('appendRow', newRow);
            //console.log("添加一行后总行数:" + rows.length);
            $tb.datagrid('beginEdit', rows.length - 1);
            $tb.datagrid('selectRow', rows.length - 1)
        }
    },
    dgEdit: function () {
        //此处支持持单选模式
        var $tb = $('#' + options.id);
        var selectRow = $tb.datagrid('getSelected');
        if (!selectRow) {
            $.messager.alert("错误提示", "请选择<span style='color:red;'> 编辑 </span>的行")
            return;
        }
        var editIndex = $tb.datagrid('getRowIndex', selectRow);
        $tb.datagrid('beginEdit', editIndex);
        //如果有请求的话
        if (options.beginEdit && typeof options.beginEdit == "function") {
            options.beginEdit(editIndex, selectRow);
            return;
        }
    },
    dgDel: function (options) {
        var $tb = $('#' + options.id);
        var selectRow = $tb.datagrid('getSelected');
        if (!selectRow) {
            $.messager.alert("错误提示", "请选择<span style='color:red;'> 删除 </span>的行")
            return;
        }
        var editIndex = $tb.datagrid('getRowIndex', selectRow);
        $.messager.confirm("确定？", "确定要删除第<span style='color:red;'>[ " + editIndex + " ]</span>行数据?", function (r) {
            if (!r) {
                return;
            }
            if (options.delRow && typeof options.delRow == "function") {
                options.delRow(editIndex, selectRow);
            }
        })
    },
    dgSave: function (options) {
        var $tb = $('#' + options.id);
        var editIndexArray = [];
        //找到所有编辑的行
        var editIndex = -1;

        $('.datagrid-view2 .datagrid-btable .datagrid-row-editing').each(function (index, item) {
            editIndex = $(this).attr('datagrid-row-index');
            var isValidate = $tb.datagrid('validateRow', editIndex);
            if (isValidate) {
                editIndexArray.push(editIndex);
                $tb.datagrid('endEdit', editIndex);
            }
        });
        if (options.save && typeof options.save == "function") {
            options.save(editIndex, editIndexArray);
        }
    },
    createS4: function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
    },
    newGuid: function () {
        return ($.createS4() + $.createS4() + "-" + $.createS4() + "-" + $.createS4() + "-" + $.createS4() + "-" + $.createS4() + $.createS4() + $.createS4());
    },
    dialogAndDg: function (options) {

        var newId = $.newGuid(),
            divTools = "tools_" + newId,
            inputId = "input_" + newId;

        var opts = {
            dlgOpts: {
                id: "dlg_" + newId,
                closed: true,
                onClose: function () {
                    //销毁对应的dom元素
                    $('#' + dlgId).dialog('destroy');
                    $('#' + tbId).remove();
                    $('#' + divTools).remove();
                }
            },
            tbOpts: {
                id: "tb_" + newId
            },
            //动态获取参数
            queryParams: function () { },
            reload: true
        };

        //对原始数据进行复写
        $.extend(true, opts, options);



        var dlgId = opts.dlgOpts.id;
        var tbId = opts.tbOpts.id;
        //将前端传递过来的click事件保存起来,然后包装一下
        var callBack = opts.tbOpts.onDblClickRow;
        if (typeof (opts.tbOpts.onDblClickRow) == "function") {
            opts.tbOpts.onDblClickRow = function (index, row) {
                callBack(index, row);
                $('#' + dlgId).dialog('close');
            }
        }

        if (opts.tbOpts.url.length == 0) {
            $.messager.alert("错误提示", "请输入请求地址");
            return;
        }
        //创建工具栏
        var strBtns = '<div id="' + divTools + '"><table style="border-spacing:0px;" ><tr>' +
            '<td >查询条件:</td><td><input id="' + inputId + '" /></td>' +
            '<td><div class="datagrid-btn-separator" ></div></td>';

        var btns = opts.tbOpts.toolbar;
        if (btns && btns.length > 0) {
            strBtns += btns.map(function (item) {
                return '<td><a id="btn_' + item.text + '" ></a></td>' +
                    '<td><div class="datagrid-btn-separator" style="margin:0px 5px;"></div></td>';
            }).join('');
        }
        strBtns += "<td><label style='margin-left:2px;color:red;'>[双击选择选项]</label></td></tr></table></div>";
        //初始化工具栏
        if (strBtns.length > 0) {
            $(document.body).append(strBtns);
            //初始化查询
            $('#' + inputId).searchbox({
                prompt: "关键字:table 表列",
                width: 250,
                searcher: function (value) {
                    //找到param
                    var queryOpts = {};
                    $.extend(queryOpts, opts.queryParams);
                    if (opts.tbOpts.queryParams) {
                        $.extend(queryOpts, opts.tbOpts.queryParams);
                    }
                    queryOpts["key"] = value;
                    $('#' + tbId).datagrid('reload', queryOpts);
                }
            });
            //初始化按钮
            if (btns && btns.length > 0) {
                btns.forEach(function (item) {
                    var btnId = 'btn_' + item.text;
                    $('#' + btnId).linkbutton({
                        iconCls: item.iconCls,
                        text: item.text,
                        plain: true,
                        onClick: function () {
                            item.handler(dlgId, tbId);
                        }
                    })
                });
            }
        }

        //创建dialog
        var strDialog = "<div id='" + dlgId + "'   class='easyui_tbByURL' style='display:none;' >" +
            "<table id='" + tbId + "'></table>" +
            "</div>";

        $(document.body).append(strDialog);
        //初始化
        var dlgOpts = opts.dlgOpts;
        //默认初始值隐藏状态
        $('#' + dlgId).dialog(dlgOpts);
        //3.0 初始化datagrid
        var datagridOpt = opts.tbOpts;
        datagridOpt["toolbar"] = "#" + divTools;
        datagridOpt["id"] = "" + tbId;
        $.dgInit(datagridOpt);
        //开启dialog
        $('#' + dlgId).dialog('open');
    },

    //行选择检查
    rowSelectCheck: function (id, message, func) {
        var row = $('#' + id).datagrid('getSelected');
        console.log(row)
        if (!row) {
            $.errorMsg(message);
            return;
        }
        if (func && typeof (func) == "function") {
            func(row);
        }
    },
    errorMsg: function (message, func) {
        $.messager.alert({
            title: '错误提示',
            icon: 'error',
            msg: "<span style='color:red;font-size:14px;'>[" + message + "]</span>",
            fn: function () {
                func();
            }
        })
    },

    //处理服务器端的数据
    procAjax: function (data, success, fail) {

    },
    //表单提交
    formSave: function (options) {
        $.messager.progress();
        $('#' + options.id).form({
            onSubmit: function () {
                var isValid = $(this).form('validate');
                if (!isValid) {
                    $.messager.progress('close');	// hide progress bar while the form is invalid
                }
                return isValid;	// return false will stop the form submission
            },
            onSuccess: function (data) {
                $.messager.progress('close');
                if (typeof (opitons.success) == "function") {
                    options.success(data);
                }
            }
        })
    },
    getYearArray: function () {
        var currentYear = parseInt(new Date().getFullYear());
        var yearArray = [];
        for (var i = currentYear + 3; i >= 2004; i--) {
            var obj = new Object();
            obj.id = i;
            obj.text = i.toString() + '年';
            yearArray.push(obj);
        }
        return yearArray;
    },

    getMonthArray: function () {
        var array = [];
        for (var i = 1; i <= 12; i++) {
            array.push({
                id: i,
                text: (i + "月")
            });
        }
        return array;
    },
    dayNumOfMonth: function (year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
    },

})