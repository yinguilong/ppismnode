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
                        "<i class=\"fa fa-line-chart\" onclick=\"LookChart('{2}}')\"></i>" +
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
function LookChart(ppismItemId) {
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
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                var price = {
                    y: item.updateDay,
                    item1: item.price,
                    item2: item.activityPrice == 0 ? item.price : item.activityPrice
                };
                data.push(price);
            }
            if (data.length > 0) {
                PPismChart(data);
                window.location.hash = "#price_chart";

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
