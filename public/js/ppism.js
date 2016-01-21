/*
 * Author: yinguilong
 * Date: 2015.12.14
 * Description:
 *     ppism.html page chart
 **/
function AjaxQueryPPisms(i) {
    var currentPageIndex = (+$("#hi_pageindex").val());
    var userId = $("#hi_userid").val();
    var pageIndex = currentPageIndex + i;
    if (pageIndex > 0) {

        var normalModel = "{ \"Name\":\"ppisms\",\"Count\": 1, \"Items\": [{ \"UserId\": \"" + userId + "\",\"PageIndex\":" + pageIndex + "}] }";
        $.ajax({
            url: "http://localhost:8088/ppismitem/mybox",
            type: "POST",
            data: normalModel,
            contentType: "application/json",
            accept: {
                json: 'application/json'
            },
            async: true,
            success: function (rt) {
                var items = rt.items;
                var data = [];
                if (items != undefined && items.length > 0) {
                    $("#hi_pageindex").val(pageIndex);
                    var strformat = "<li ><span class=\"handle ui-sortable-handle\">" +
                        "<i class=\"fa fa-ellipsis-v\"></i>" +
                        "<i class=\"fa fa-ellipsis-v\"></i>" +
                        "</span>" +
                        "<span class=\"text\">{0}</span>" +
                        "{1}<div class=\"tools\" data-pp-id='{2}'>" +
                        "<i class=\"fa fa-line-chart\" onclick=\"LookChart('{2}','{0}')\"></i>" +
                        "<span>&nbsp;&nbsp;</span>" +
                        "</div>" +
                        "</li>";

                    for (var i = 0, length = items.length; i < length; i++) {
                        var item = items[i];
                        var strTip = "";
                        if (item.trend == 1) {
                            strTip = "<small class=\"label label-success\"><i class=\"fa   fa-arrow-circle-o-down\"></i> 降</small>";
                        }
                        else if (item.trend == 2) {
                            strTip = "<small class=\"label label-warning\"><i class=\"fa   fa-arrow-circle-o-up\"></i> 涨</small>";
                        }
                        else {
                            strTip = "<small class=\"label label-info\"><i class=\"fa  fa-arrow-circle-o-right\"></i> 无</small>";
                        }
                        var str = strformat.format(
                            item.itemName,
                            strTip,
                            item.pPismItemId
                            );
                        data.push(str);
                    }
                }
                if (data.length > 0) {
                    $("#ul_todolist").html(data.join(""));
                }
                else {
                    $("#myErrorModal").modal();
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
    }
}
function LookChart(ppismItemId, ppismName) {
    
    var normalModel = "{ \"Name\":\"priceitems\",\"Count\": 1, \"Items\": [{ \"PPismItemId\": \"" + ppismItemId + "\"}] }";
    $.ajax({
        url: "http://localhost:8088/ppismitem/priceitems",
        type: "POST",
        data: normalModel,
        contentType: "application/json",
        accept: {
            json: 'application/json'
        },
        async: true,
        success: function (rt) {
            var items = rt.items;
            var data = [];
            var categories = [];
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                if(i%2==0||i==length-1)
                categories.push(item.updateDay);
                else 
                {
                    categories.push('');
                }
                data.push(item.price);
            }
            if (data.length > 0) {
                // PPismChart(data);
                PPismHighChart('line-chart', ppismName, '', ppismName, categories, data);
                window.location.hash = "#price_chart";

            }
            else {

                $("#myErrorModal").modal();
            }
        },
        error: function () {
            console.log(e);
        }
    });
}
function PPismHighChart(containerId, title, subtitle, sName, categories, data) {
    $('#' + containerId).highcharts({
        title: {
            text: title
        },
        subtitle: {
            text: subtitle
        },
        credits: {
            text: 'www.ppism.cn',
            href: 'http://www.ppism.cn',
            style: {
                cursor: 'pointer',
                color: ' #39cccc'
            }
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value+'').replace('2015','').replace('-','');
                }
            },
            title: {
                align: 'high',
                offset: 0,
                text: '价格',
                rotation: 0,
                y: -10
            },
            lineWidth: 2
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.y}元'
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        series: [{
            name: sName,
            data: data//[[0, 15], [10, -50], [20, -56.5], [30, -46.5], [40, -22.1],
            //[50, -2.5], [60, -27.7], [70, -55.7], [80, -76.5]]
        }]
    });
}
function PPismChart(data) {
    $("#line-chart").empty();
    var line = new Morris.Line({
        element: 'line-chart',
        resize: true,
        data: data,
        xkey: 'y',
        ykeys: ['item1'],
        labels: ['标价'],
        lineColors: ['#efefef'],
        lineWidth: 2,
        hideHover: 'auto',
        gridTextColor: "#fff",
        gridStrokeWidth: 0.5,
        pointSize: 4,
        pointFillColors: ['#efefef'],
        pointStrokeColors: ['#efefef'],
        gridLineColor: "#efefef",
        gridTextFamily: "Open Sans",
        gridTextSize: 10
    });
}
