"use strict";
const IP = "localhost";
const PORT = 3100;
let gPagesize = 10;



$(document).ready(function () {
    $("#userDiv").hide();
    $("#categoryDiv").hide();
    $("#statusDiv").hide();
    $("#browserDiv").hide();
    $("#osDiv").hide();
    $("#priorityDiv").hide();
    $("#bugDiv").hide();
    $("#bugsearch").hide();

});






/*$("#btnadduser").on('click', function(){
    $("#categoryDiv").hide();
    $("#statusDiv").hide();
    $("#browserDiv").hide();
    $("#osDiv").hide();
    $("#priorityDiv").hide();
    $("#userDiv").hide();
});*/


function showUserRegion() {
    hideAllRegion();
    $("#userDiv").show();
    displaySaveuser();
    $("#menu").hide();
}

function showCategoryRegion() {
    hideAllRegion();
    $("#categoryDiv").show();
    displayCategory();
    $("#menu").hide();
}

function showBrowserRegion() {
    hideAllRegion();
    $("#browserDiv").show();
    displayBrowser();
    $("#menu").hide();
}

function showOsRegion() {
    hideAllRegion();
    $("#osDiv").show();
    displayOs();
    $("#menu").hide();
}

function showPriorityRegion() {
    hideAllRegion();
    $("#priorityDiv").show();
    displayPriority();
    $("#menu").hide();
}

function showStatusRegion() {
    hideAllRegion();
    $("#statusDiv").show();
    displayStatus();
    $("#menu").hide();
}

function cancel(pRegion) {
    $("#menu").show();
    $(pRegion).hide();
}







function showBugRegion() {
    hideAllRegion();
    $("#menu").hide();
    $("#bugDiv").show();
    clear(['bugId', 'desp', 'created', 'fixed', 'cat', 'status', 'pre', 'browser2',
        'assign', 'os2', 'hdnbugid'
    ]);

    //clear('#bugDiv');
    getcategory();
    getpriority();
    getbrowser();
    getos();
    getStatus();
    getuserid();
    getBugid();
    assignDate();
    assignFixeddate();
    $("#bugId").prop("disabled", true);
    getBugReport();
}

function showBugSearchRegion() {
    hideAllRegion();
    $("#menu").hide();
    $("#bugsearch").show();
    clear(['bugId', 'desp', 'cat', 'status', 'assign']);
    getcategory();
    getStatus();
    getuserid();


}



function assignDate() {
    let tday = getcurrentdate();
    $("#created").val(tday);
}

function assignFixeddate() {
    let fixedday = getcurrentdate();
    $("#fixedday").val(fixedday);
}




function hideAllRegion() {
    $("#userDiv").hide();
    $("#categoryDiv").hide();
    $("#statusDiv").hide();
    $("#browserDiv").hide();
    $("#osDiv").hide();
    $("#priorityDiv").hide();
    $("#bugDiv").hide();
    $("#bugsearch").hide();

}










/*----------------------------- Generic Functions ------------------------------*/

function isNotempty(udata) {
    if (udata !== "")
        return true;
    else
        return false;
}

function alertmsg(pmsg, pmsgtype, pshow) {
    var lmsg = 'success';
    if (pmsgtype == 'FAILURE')
        var lmsg = 'danger';

    else if (pmsgtype == 'INFO')
        var lmsg = 'info';
    else if (pmsgtype == 'WARNING')
        var lmsg = 'warning';

    let html = '<div class="alert alert-' + lmsg + '">';
    html += pmsg;
    html += '</div>';
    $('#' + pshow).html(html);
}

function clear(arrFlds) {
    for (let i = 0; i < arrFlds.length; i++)
        $("#" + arrFlds[i]).val('');
}

/*----------------------------- Generic Functions ------------------------------*/





function saveUser() {
    var hdnuserid = $("#hdnuserid").val();
    var first_name = $("#first_name").val();
    var last_name = $("#last_name").val();
    var user_id = $("#user_id").val();
    var JsonData = {
        "firstname": first_name,
        "lastname": last_name,
        "userid": user_id
    };
    if (isNotempty(first_name)) {
        if (isNotempty(user_id)) {
            isUseridUnique(user_id, hdnuserid, JsonData);
        } else
            alertmsg('Please fill the UserId', 'DANGER', 'alertmsg');
    } else
        alertmsg('Please fill the First Name', 'DANGER', 'alertmsg');
}

function isUseridUnique(puser_id, pid = '', pJsonData) {
    $.post("http://" + IP + ":" + PORT + "/bug/v1/usercount", {
        "userid": puser_id,
        "id": pid
    }, function (data, status) {

        if (data.count == 0) {
            if (pid == '') { // New Record Mode
                $.post("http://" + IP + ":" + PORT + "/bug/v1/saveuser", pJsonData,
                    function (data, status) {
                        alertmsg('Saved Successfully', 'SUCCESS', 'alertmsg');
                        clear(['hdnuserid', 'first_name', 'last_name', 'user_id']);
                        displaySaveuser();
                    }
                );
            } else { //Edit Mode 
                $.post("http://" + IP + ":" + PORT + "/bug/v1/edituser/" + pid, pJsonData,
                    function (data, status) {
                        alertmsg('Update Data Saved Successfully', 'SUCCESS', 'alertmsg');
                        clear(['hdnuserid', 'first_name', 'last_name', 'user_id']);
                        displaySaveuser();
                    }
                );
            }
        } else
            alertmsg('This ID already exists', 'DANGER', 'alertmsg');
    })
}



function displaySaveuser() {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getusers", function (data, status) {
        mapUserData(data);
    });
}

function mapUserData(pData) {
    let html = '<thead><tr>';
    html += '<th scope="col-sm-3">First Name</th>';
    html += '<th scope="col-sm-3">Last Name</th>';
    html += '<th scope="col-sm-3">User Id</th><th></th><th></th></tr></thead>';
    if (pData.length != 0) {
        for (let i = 0; i < pData.length; i++) {
            html += '<tr><td>' + pData[i].firstname + '</td><td>' + pData[i].lastname + '</td>';
            html += '<td>' + pData[i].userid + '</td><td><a href="javascript:editUser(\'' + pData[i]._id + '\');">Edit</a></td>';
            html += '<td><a href="javascript:deleteUser(\'' + pData[i]._id + '\');">Delete</td></tr>';
        }
    }
    $("#CatReport").html(html);
}


function editUser(puser_id) {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getid/" + puser_id, function (data, status) {
        console.log(data)
        edituserData(data);

    });
}

function edituserData(pdata) {
    for (var i = 0; i < pdata.length; i++) {
        $("#first_name").val(pdata[i].firstname);
        $("#last_name").val(pdata[i].lastname);
        $("#user_id").val(pdata[i].userid);
        $("#hdnuserid").val(pdata[i]._id);

    }
}

function deleteUser(Id) /* delete user */

{
    var r = confirm("Are you sure wanted to delete?!");

    if (r == true) {
        $.get("http://" + IP + ":" + PORT + "/bug/v1/deleteuser/" + Id, function (data, status) {
            alertmsg('Deleted successfully !', 'DANGER', 'alertmsg');
        });
    } else
        alertmsg('You Cancelled', 'DANGER', 'alertmsg');
}

function searchUser() {
    var keyword = $('#user_search').val();
    $.get("http://" + IP + ":" + PORT + "bug/v1/searchuser/" + keyword, function (data, status) {
        searchuserdata(data);
    });
}

function searchuserdata(pdata) {
    //console.log('ppppppppp', pdata);
    $("#searchResult").html('');
    let html = '<thead><tr>';
    html += '<th scope="col-sm-3">First Name</th>';
    html += '<th scope="col-sm-3">Last Name</th>';
    html += '<th scope="col-sm-3">User Id</th><th></th><th></th></tr></thead>';
    for (let i = 0; i < pdata.length; i++) {
        html += '<tr><td>' + pdata[i].firstname + '</td><td>' + pdata[i].lastname + '</td>';
        html += '<td>' + pdata[i].userid + '</td>';

    }
    $("#searchResult").html(html);


}

/*-------------- Category Module Start ------------*/


function saveCategory() /* Save Category */ {
    var hdncategoryid = $("#hdncategoryid").val();
    var category_name = $("#category_name").val();
    var JsonData = {
        "categoryname": category_name
    }
    if (isNotempty(category_name)) {
        iscategoryUnique(category_name, JsonData, hdncategoryid)
    } else
        alertmsg('Please fill the Category Name', 'DANGER', 'alertmsg2');
}

function iscategoryUnique(pcategoryname, pJsonData, pid = '') /* check unique Category */ {
    $.post("http://" + IP + ":" + PORT + "/bug/v1/categorycount", {
        "categoryname": pcategoryname,
        "id": pid
    }, function (data, status) {

        if (data.count == 0) {
            if (pid == '') {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/savecategory", pJsonData,
                    function (data, status) {
                        alertmsg('Saved Successfully', 'SUCCESS', 'alertmsg2');
                        clear(['hdncategoryid', 'category_name']);
                        displayCategory();
                    }
                );
            } else {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/editcategory/" + pid, pJsonData,
                    function (data, status) {
                        alertmsg('Update Data Saved Successfully', 'SUCCESS', 'alertmsg2');
                        clear(['hdncategoryid', 'category_name']);
                        displayCategory();
                    }
                );
            }
        } else
            alertmsg('This category already exists', 'DANGER', 'alertmsg2');
        displayCategory();
    })

}

function displayCategory() /* display Category */ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getcategory", function (data, status) {
        categorydata(data);
    });
}

function categorydata(pdata) {
    let html = '<thead><tr>';
    html += '<th scope="col-sm-3">Category Name</th><th></th><th></th></tr></thead>';
    if (pdata.length !== 0)
        for (let i = 0; i < pdata.length; i++) {
            html += '<tr><td>' + pdata[i].categoryname + '</td><td><a href="javascript:editCategory(\'' + pdata[i]._id + '\');">Edit</a></td>';
            html += '<td><a href="javascript:deleteCategory(\'' + pdata[i]._id + '\');">Delete</td></tr>';
        }
    $("#categoryReport").html(html);
}

function editCategory(pcategid) /* Edit Category */ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getcategid/" + pcategid, function (data, status) {
        //console.log(data);
        editCategorydetail(data);
    });
}

function editCategorydetail(pdata) {
    for (var i = 0; i < pdata.length; i++) {
        $("#category_name").val(pdata[i].categoryname);
        $("#hdncategoryid").val(pdata[i]._id);

    }
}

function deleteCategory(Id) /* delete Category */ {
    var r = confirm("Are you sure wanted to delete?!");

    if (r == true) {
        $.get("http://" + IP + ":" + PORT + "/bug/v1/deletecategory/" + Id, function (data, status) {
            alertmsg('Deleted successfully !', 'DANGER', 'alertmsg2');
            displayCategory();
        });
    } else
        alertmsg('You Cancelled', 'DANGER', 'alertmsg2');
    displayCategory();
}


/* -------------------------Status module start---------------------------------------*/

function saveStatus() /* Save Status */ {
    var hdnstatusid = $("#hdnstatusid").val();
    var status_name = $("#status_name").val();
    var JsonData = {
        "statusname": status_name
    };
    if (isNotempty(status_name)) {
        isStatusunique(JsonData, status_name, hdnstatusid)

    } else
        alertmsg('Please fill the Status Name', 'DANGER', 'alertmsg3');

}

function isStatusunique(pJsonData, pstatusname, pid = '') /* Check Status unique */ {
    $.post("http://" + IP + ":" + PORT + "/bug/v1/statuscount", {
        "statusname": pstatusname,
        "id": pid
    }, function (data, status) {

        if (data.count == 0) {
            if (pid == '') {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/savestatus", pJsonData,
                    function (data, status) {
                        alertmsg('Saved Successfully', 'SUCCESS', 'alertmsg3');
                        clear(['hdnstatusid', 'status_name']);
                        displayStatus();
                    }
                );
            } else {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/editstatus/" + pid, pJsonData,
                    function (data, status) {
                        alertmsg('Update Data Saved Successfully', 'SUCCESS', 'alertmsg3');
                        clear(['hdnstatusid', 'status_name']);
                        displayStatus();
                    }
                );
            }
        } else
            alertmsg('This status already exists', 'DANGER', 'alertmsg3');
    })

}

function displayStatus() /* Display Status */ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getStatus", function (data, status) {
        statusData(data);
    });
}

function statusData(pdata) {
    let html = '<thead><tr>';
    html += '<th scope="col-sm-3">Status Name</th><th></th><th></th></tr></thead>';
    if (pdata.length !== 0)
        for (let i = 0; i < pdata.length; i++) {
            html += '<tr><td>' + pdata[i].statusname + '</td><td><a href="javascript:editStatus(\'' + pdata[i]._id + '\');">Edit</a></td>';
            html += '<td><a href="javascript:deleteStatus(\'' + pdata[i]._id + '\');">Delete</td></tr>';
        }
    $("#statusReport").html(html);
}

function editStatus(pstatusid) /* Edit Status*/ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getstatusid/" + pstatusid, function (data, status) {
        editStatusdetail(data);
    });
}

function editStatusdetail(pdata) {
    for (var i = 0; i < pdata.length; i++) {
        $("#status_name").val(pdata[i].statusname);
        $("#hdnstatusid").val(pdata[i]._id);

    }
}

function deleteStatus(Id) /* Delete Status */ {
    var r = confirm("Are you sure wanted to delete?!");

    if (r == true) {
        $.get("http://" + IP + ":" + PORT + "/bug/v1/deletestatus/" + Id, function (data, status) {
            alertmsg('Deleted successfully !', 'DANGER', 'alertmsg3');
            displayStatus();
        });
    } else
        alertmsg('You Cancelled', 'DANGER', 'alertmsg3');
    displayStatus();
}

/*---------------------Status end ----------------*/


/*----------------Browser start --------------------------------------------*/

function saveBrowser() {
    var hdnbrowserid = $("#hdnbrowserid").val();
    var browser = $("#browser").val();
    var JsonData = {
        "browser": browser
    };
    if (isNotempty(browser)) {
        isBrowserunique(browser, hdnbrowserid, JsonData)

    } else
        alertmsg('Please fill the Browser Name', 'DANGER', 'alertmsg4');
}

function isBrowserunique(pbrowser, pid = '', pJsonData) {
    $.post("http://" + IP + ":" + PORT + "/bug/v1/browsercount", {
        "browser": pbrowser,
        "id": pid
    }, function (data, status) {

        if (data.count == 0) {
            if (pid == '') {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/savebrowser", pJsonData,
                    function (data, status) {
                        alertmsg('Saved Successfully', 'SUCCESS', 'alertmsg4');
                        clear(['hdnbrowserid', 'browser']);
                        displayBrowser();

                    }
                );
            } else {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/editbrowser/" + pid, pJsonData,
                    function (data, status) {
                        alertmsg('Update Data Saved Successfully', 'SUCCESS', 'alertmsg4');
                        clear(['hdnbrowserid', 'browser']);
                        displayBrowser();
                    }
                );
            }
        } else
            alertmsg('This status already exists', 'DANGER', 'alertmsg4')
    });
}

function displayBrowser() /* Display Browser */ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getbrowser", function (data, status) {
        browserData(data);
    });
}

function browserData(pdata) {
    let html = '<thead><tr>';
    html += '<th scope="col-sm-3">Browser</th><th></th><th></th></tr></thead>';
    if (pdata.length !== 0)
        for (let i = 0; i < pdata.length; i++) {
            html += '<tr><td>' + pdata[i].browser + '</td><td><a href="javascript:editBrowser(\'' + pdata[i]._id + '\');">Edit</a></td>';
            html += '<td><a href="javascript:deleteBrowser(\'' + pdata[i]._id + '\');">Delete</td></tr>';
        }
    $("#browserReport").html(html);
}

function editBrowser(pbrowserid) /* Edit Browser*/ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getbrowserid/" + pbrowserid, function (data, status) {
        console.log(data);
        editBrowserdetail(data);
    });
}

function editBrowserdetail(pdata) {
    for (var i = 0; i < pdata.length; i++) {
        $("#browser").val(pdata[i].browser);
        $("#hdnbrowserid").val(pdata[i]._id);

    }
}

function deleteBrowser(Id) /* Delete Browser*/ {
    var r = confirm("Are you sure wanted to delete?!");

    if (r == true) {
        $.get("http://" + IP + ":" + PORT + "/bug/v1/deletebrowser/" + Id, function (data, status) {
            alertmsg('Deleted successfully !', 'DANGER', 'alertmsg4');
            displayBrowser();
        });
    } else
        alertmsg('You Cancelled', 'DANGER', 'alertmsg4');
    displayBrowser();
}

/*------------------------------browser end----------------------------------*/

/*------------------------Os Start ----------------------------------------------*/

function saveOs() {
    var hdnosid = $("#hdnosid").val();
    var os = $("#os").val();
    var JsonData = {
        "os": os
    };
    if (isNotempty(os)) {
        isUniqueos(hdnosid, os, JsonData)

    } else
        alertmsg('Please fill the OS Name', 'DANGER', 'alertmsg5');

}

function isUniqueos(pid = '', pos, pJsonData) /*Check Unique OS */ {
    $.post("http://" + IP + ":" + PORT + "/bug/v1/oscount", {
        "os": pos,
        "id": pid
    }, function (data, status) {

        if (data.count == 0) {
            if (pid == '') {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/saveos", pJsonData,
                    function (data, status) {
                        alertmsg('Saved Successfully', 'SUCCESS', 'alertmsg5');
                        clear(['hdnosid', 'os']);
                        displayOs();
                    }
                );
            } else {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/editos/" + pid, pJsonData,
                    function (data, status) {
                        alertmsg('Update Data Saved Successfully', 'SUCCESS', 'alertmsg5');
                        clear(['hdnosid', 'os']);
                        displayOs();
                    }
                );
            }
        } else
            alertmsg('This OS already exists', 'DANGER', 'alertmsg5');
    });
}

function displayOs() /* Display OS*/ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getos", function (data, status) {
        osData(data);
    });
}

function osData(pdata) {
    let html = '<thead><tr>';
    html += '<th scope="col-sm-3">Opersting System</th><th></th><th></th></tr></thead>';
    if (pdata.length !== 0)
        for (let i = 0; i < pdata.length; i++) {
            html += '<tr><td>' + pdata[i].os + '</td><td><a href="javascript:editOs(\'' + pdata[i]._id + '\');">Edit</a></td>';
            html += '<td><a href="javascript:deleteOS(\'' + pdata[i]._id + '\');">Delete</td></tr>';
        }
    $("#osReport").html(html);
}

function editOs(pbosid) /* Edit OS*/ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getosid/" + pbosid, function (data, status) {
        //console.log(data);
        editos(data);
    });
}

function editos(pdata) {
    for (var i = 0; i < pdata.length; i++) {
        $("#os").val(pdata[i].os);
        $("#hdnosid").val(pdata[i]._id);

    }
}

function deleteOS(Id) /* Delete OS*/ {
    var r = confirm("Are you sure wanted to delete?!");

    if (r == true) {
        $.get("http://" + IP + ":" + PORT + "/bug/v1/deleteos/" + Id, function (data, status) {
            alertmsg('Deleted successfully !', 'DANGER', 'alertmsg5');
            displayOs();
        });
    } else
        alertmsg('You Cancelled', 'DANGER', 'alertmsg5');
    displayOs();
}
/*-----------------End os--------------------------------*/

/*-----------------------------Priority Start--------------------------*/

function savePriority() {
    var hdnpriorityid = $("#hdnpriorityid").val();
    var priority = $("#priority").val();
    var JsonData = {
        "priority": priority
    };
    if (isNotempty(priority)) {
        isUniquePriority(hdnpriorityid, priority, JsonData)
    } else
        alertmsg('Please fill the Priority', 'DANGER', 'alertmsg6');

}

function isUniquePriority(pid = '', lpriority, pJsonData) /*Check Unique Priority */ {
    $.post("http://" + IP + ":" + PORT + "/bug/v1/prioritycount", {
        "priority": lpriority,
        "id": pid
    }, function (data, status) {

        if (data.count == 0) {
            if (pid == '') {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/savepriority", pJsonData,
                    function (data, status) {
                        alertmsg('Saved Successfully', 'SUCCESS', 'alertmsg6');
                        clear(['hdnpriorityid', 'priority']);
                        displayPriority();
                    }
                );
            } else {
                $.post("http://" + IP + ":" + PORT + "/bug/v1/editpriority/" + pid, pJsonData,
                    function (data, status) {
                        alertmsg('Update Data Saved Successfully', 'SUCCESS', 'alertmsg6');
                        clear(['hdnpriorityid', 'priority']);
                        displayPriority();
                    }
                );
            }
        } else
            alertmsg('This Priority already exists', 'DANGER', 'alertmsg6');
    });
}

function displayPriority() /* Display Priority*/ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getpriority", function (data, status) {
        priorityData(data);
    });
}

function priorityData(pdata) {
    let html = '<thead><tr>';
    html += '<th scope="col-sm-3">Priority</th><th></th><th></th></tr></thead>';
    if (pdata.length !== 0)
        for (let i = 0; i < pdata.length; i++) {
            html += '<tr><td>' + pdata[i].priority + '</td><td><a href="javascript:editPriority(\'' + pdata[i]._id + '\');">Edit</a></td>';
            html += '<td><a href="javascript:deletePriority(\'' + pdata[i]._id + '\');">Delete</td></tr>';
        }
    $("#priorityReport").html(html);
}

function editPriority(prid) /* Edit Priority*/ {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getpriorityid/" + prid, function (data, status) {
        //console.log(data);
        editpriority(data);
    });
}

function editpriority(pdata) {
    for (var i = 0; i < pdata.length; i++) {
        $("#priority").val(pdata[i].priority);
        $("#hdnpriorityid").val(pdata[i]._id);

    }
}

function deletePriority(Id) /* Delete Priority */ {
    var r = confirm("Are you sure wanted to delete?!");

    if (r == true) {
        $.get("http://" + IP + ":" + PORT + "/bug/v1/deletepriority/" + Id, function (data, status) {
            alertmsg('Deleted successfully !', 'DANGER', 'alertmsg6');
            displayPriority();
        });
    } else
        alertmsg('You Cancelled', 'DANGER', 'alertmsg6');
    displayPriority();
}


function bug() {

    var hdnbugid = $("#hdnbugid").val();
    var prev_assign = $("#hdnassign").val();
    console.log(prev_assign);
    var new_assign = $("#assign").val();
    console.log(new_assign);
    var prev_status = $("#hdnstatus").val();
    var new_status = $("#status").val();
    //console.log(new_status);
    var bugid = $("#bugId").val();
    var desc = $("#desp").val();
    var fixedon = $("#fixedday").val();
    var created = $("#created").val();
    var category = $("#cat").val();
    var status = $("#status").val();
    var priority = $("#pre").val();
    var assign = $("#assign").val();
    var browser = $("#browser2").val();
    var os = $("#os2").val();
    var fixedBy = $("#fixedby").val();

    if (checkMandatory(['desp', 'cat', 'pre', 'browser2', 'os2'], ['Description', 'Category', 'Priority', 'Browser', 'os'])) {
        //console.log('Passed test');

        //$.post("http://"+IP+":"+PORT+"/bug/v1/bugcount", {"desc" : desc,"hdnbugid":hdnbugid}, function(data,status){
        //  console.log(data);
        //if(data.count == 0){

        if (hdnbugid == '') {
            var JsonData = {
                "bugid": bugid,
                "desc": desc,
                "created": created,
                "fixedon": fixedon,
                "category": category,
                "browser": browser,
                "status": status,
                "priority": priority,
                "assign": assign,
                "os": os,
                "fixedBy": fixedBy
            };

            $.post("http://" + IP + ":" + PORT + "/bug/v1/savebug", JsonData, function (data, status) {
                console.log(data);
                alertmsg('Bugs Saved successfully', 'SUCCESS', 'alertmsg7');

                clear(['bugId', 'desp', 'created', 'fixed', 'cat', 'status', 'pre', 'browser2',
                    'assign', 'os2', 'hdnbugid'
                ]);
                getBugReport();
                getBugid();
                assignDate();
                $("#bugId").prop("disabled", true);
            });
        } else {
            var Json = {
                "fixedon": fixedon,
                "bugid": bugid,
                "prev_status": prev_status,
                "new_status": new_status,
                "prev_assign": prev_assign,
                "new_assign": new_assign,
                "desc": desc,
                "created": created,
                "fixedon": fixedon,
                "category": category,
                "browser": browser,
                "status": status,
                "priority": priority,
                "assign": assign,
                "os": os,
                "fixedBy": fixedBy
            };

            $.post("http://" + IP + ":" + PORT + "/bug/v1/updatebug/" + hdnbugid, Json, function (data, status) {
                $.get("http://" + IP + ":" + PORT + "/bug/v1/getmsg/" + data.msgcode, function (data, status) {
                    //console.log(data);
                    //alert(
                    alertmsg(data.message, 'SUCCESS', 'alertmsg7');
                    clear(['bugId', 'desp', 'created', 'fixedby', 'cat', 'status', 'pre', 'browser2',
                        'assign', 'os2', 'hdnbugid'
                    ]);
                    getBugReport();
                    getBugid();
                    assignDate();
                });
            });
        }
    }

}


function getBugid() {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/bugid", function (data, status) {
        $("#bugId").val(data.nextval);
    });

}


function getcategory() {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getcategory", function (data, status) {
        DisplaybugCategory(data);
    });
}


function DisplaybugCategory(pdata) {
    let html = '<option value="">Select Category</option>';
    for (let i = 0; i < pdata.length; i++) {
        html += '<option value="' + pdata[i].categoryname + '">' + pdata[i].categoryname + '</option>';
    }
    $("#cat").html(html);
    $("#catsrc").html(html);
}

function getpriority() {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getpriority", function (data, status) {
        displaybugPriority(data);
    });
}

function displaybugPriority(pdata) {
    let html = '<option value ="">Select Priority</option>';
    for (let i = 0; i < pdata.length; i++) {
        html += '<option value="' + pdata[i].priority + '">' + pdata[i].priority + '</option>';
    }
    $("#pre").html(html);
}

function getbrowser() {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getbrowser", function (data, status) {
        displaygetBrowser(data);
    });
}

function displaygetBrowser(pdata) {
    let html = '<option value="">Select Browser</option>';
    for (let i = 0; i < pdata.length; i++) {
        html += '<option value="' + pdata[i].browser + '">' + pdata[i].browser + '</option>';
    }
    $("#browser2").html(html);
}

function getos() {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getos", function (data, status) {
        displaybugOS(data);
    });
}

function displaybugOS(pdata) {
    let html = '<option value="">Select Operating System</option>';
    for (let i = 0; i < pdata.length; i++) {
        html += '<option value ="' + pdata[i].os + '">' + pdata[i].os + '</option>';
    }
    $("#os2").html(html);
}

function getStatus() {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getstatus", function (data, status) {
        DisplaybugStatus(data);
    });

}

function DisplaybugStatus(pdata) {
    let html = '<option value ="">Select Status</option>';
    for (let i = 0; i < pdata.length; i++) {
        html += '<option value ="' + pdata[i].statusname + '">' + pdata[i].statusname + '</option>';
    }
    $("#status").html(html);
    $("#statussrc").html(html);
}

function getuserid() {
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getusers", function (data, status) {
        Displayuserid(data);
        //DisplayFixed(data);
    });
}

function Displayuserid(pdata) {
    let html = '<option value ="">Select UserID</option>';
    for (let i = 0; i < pdata.length; i++) {
        html += '<option value="' + pdata[i].userid + '">' + pdata[i].userid + '</option>';
    }
    $("#assign").html(html);
    $("#fixedby").html(html);
    $("#assignsrc").html(html);
    $("#fixedbysrc").html(html);
}


function checkMandatory(pfield, pDasc) {
    let status = true,
        obj;
    for (let i = 0; i < pfield.length; i++) {
        obj = '#' + pfield[i];
        if ($(obj).val() == '') {
            alertmsg(pDasc[i] + ' Cannot be Empty', 'FAILURE', 'alertmsg7');
            $(obj).focus();
            status = false;
            break;
        }

    }
    return status;
}

function getBugReport(pdocid = '', paction = '') {
    let json = {};
    if (pdocid !== '' && paction !== '') {
        json = {
            "docid": pdocid,
            "action": paction
        }
    }
    $.post("http://" + IP + ":" + PORT + "/bug/v1/getbug", json, function (data, status) {
        if(data.length > 0)
        {
            console.log(data);

            var docid = getLastdocument(data, paction);
            var prdocid = getFirstdocument(data, paction);
            if(paction =='')
            {
                totalPage('bug', json, '#hdntotalpages1');
            }
        }
        DisplayBugReport(data, docid, prdocid, paction);
    });

}


function DisplayBugReport(pdata, pDocId, prdocid, paction = '') {
    let html = '<thead><tr>';
    html += '<th scope="col-sm-3">BugID</th>';
    html += '<th scope="col-sm-3">Description</th>';
    html += '<th scope="col-sm-3">Category</th>';
    html += '<th scope="col-sm-3">Status</th>';
    html += '<th scope="col-sm-3">Created Date</th>';
    html += '<th scope="col-sm-3">Assigned To </th>'
    html += '<th scope="col-sm-3">Fixed by</th>';
    html += '<th scope="col-sm-3">Fixed On</th><th></th><th></th></tr></thead>';

    var totpage = $("#hdntotalpages1").val();
    var currPage = $("#hdnpageno1").val();
    let lnext = (currPage <= totpage || currPage == 1) ? '<a href="javascript:next(\'' + pDocId + '\');">Next &gt;&gt;</a>' : '';
    let lprev = (currPage > 1) ? '<a href="javascript:prev(\'' + prdocid + '\')">&lt;&lt; Prev</a>' : '';


    if (paction == "next" || paction == '') {
        for (let i = 0; i < pdata.length; i++) {
            html += '<tr><td>' + pdata[i].bugid + '</td><td>' + pdata[i].desc + '</td>';
            html += '<td>' + pdata[i].category + '</td><td>' + pdata[i].status + '</td>';
            html += '<td>' + pdata[i].created + '</td><td>' + pdata[i].assign + '</td>';
            html += '<td>' + pdata[i].fixedBy + '</td><td>' + pdata[i].fixedon + '</td>';


            html += '<td><a href="javascript:editBug(\'' + pdata[i]._id + '\');">Edit</a></td>';
            html += '<td><a href="javascript:deleteBug(\'' + pdata[i]._id + '\');">Delete</td></tr>';

        }
        html += '<tr><td colspan="10">' + lprev + '&nbsp;&nbsp;'+ lnext + '</td></tr>';
    } else if (paction === "prev") {
        for (let i = pdata.length - 1; i >= 0; i--) {

            html += '<tr><td>' + pdata[i].bugid + '</td><td>' + pdata[i].desc + '</td>';
            html += '<td>' + pdata[i].category + '</td><td>' + pdata[i].status + '</td>';
            html += '<td>' + pdata[i].created + '</td><td>' + pdata[i].assign + '</td>';
            html += '<td>' + pdata[i].fixedBy + '</td><td>' + pdata[i].fixedon + '</td>';


            html += '<td><a href="javascript:editBug(\'' + pdata[i]._id + '\');">Edit</a></td>';
            html += '<td><a href="javascript:deleteBug(\'' + pdata[i]._id + '\');">Delete</td></tr>';

        }
        html += '<tr><td colspan="10">' + lprev + '&nbsp;&nbsp;'+ lnext +'</td></tr>';

    }
    $("#bugReport").html(html);

}

function next(pdocid) {
    var currPage = $("#hdnpageno1").val();
    var totalPage = $("#hdntotalpages1").val();
    if(currPage <= totalPage)
    {
        currPage++;
    }
    $("#hdnpageno1").val(currPage);

    getBugReport(pdocid, "next");
}

function prev(pdocid) {

    var currPage = $("#hdnpageno1").val();
    if(currPage > 1)
    {
        currPage --;
    }
    $("#hdnpageno1").val(currPage);
    getBugReport(pdocid, "prev")
}

function getLastdocument(pjson, paction) {
    var docPos;
    if (paction == 'prev')
        docPos = 0;
    else
        docPos = pjson.length - 1;
    //console.log(docLength);


    return pjson[docPos]._id;
}


function getFirstdocument(pjson, paction) {
    var docPos;
    if (paction == 'prev')
        docPos = pjson.length - 1;
    else
        docPos = 0;
    console.log(pjson[docPos]._id)
    return pjson[docPos]._id
}





function editBug(id) {
    //console.log(id);
    $.get("http://" + IP + ":" + PORT + "/bug/v1/getbugdetails/" + id, function (data, status) {
        //console.log(data);
        editBugReport(data);

    });
}



function editBugReport(pdata) {
    for (let i = 0; i < pdata.length; i++) {
        $("#desp").val(pdata[i].desc);
        $("#cat").val(pdata[i].category);
        $("#status").val(pdata[i].status);
        //console.log("iiiiiii");
        $("#hdnstatus").val(pdata[i].status);
        //console.log(hdnstatus);
        //console.log("llllllll");
        $("#created").val(pdata[i].created);
        $("fixedday").val(pdata[i].fixedon);
        $("#assign").val(pdata[i].assign);
        $("#hdnassign").val(pdata[i].assign);
        $("#fixedby").val(pdata[i].fixedBy);
        $("#hdnfixedby").val(pdata[i].fixedby);
        console.log(hdnassign);
        $("#pre").val(pdata[i].priority);
        $("#browser2").val(pdata[i].browser);
        $("#os2").val(pdata[i].os);
        $("#hdnbugid").val(pdata[i]._id);
        $("#bugId").val(pdata[i].bugid);

    }
}


function deleteBug(Id) /* Delete bug*/ {
    var r = confirm("Are you sure wanted to delete?!");

    if (r == true) {
        $.get("http://" + IP + ":" + PORT + "/bug/v1/deletebug/" + Id, function (data, status) {
            alertmsg('Deleted successfully !', 'DANGER', 'alertmsg7');
            //getBugReport();
        });
    } else
        alertmsg('You Cancelled', 'DANGER', 'alertmsg7');
    getBugReport();

}


function getcurrentdate() {
    var today = new Date()

    var hh = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    //console.log(hh,min,sec);
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (mm.toString().length == 1) mm = '0' + mm;
    if (dd.toString().length == 1) dd = '0' + dd;

    today = dd + '/' + mm + '/' + yyyy + '/' + hh + ':' + min + ':' + sec;
    return today;
}

function isvalidateDate(pdate) {
    var dateformat = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;
    if (pdate != "") {
        if (pdate.match(dateformat))
            return true;
        else
            return false;
    } else
        return true;

}

function search(pdocid = '', paction = '') {
    var bugid = $("#Id").val();
    var desc = $("#desc").val();
    var category = $("#catsrc").val();
    var assign = $("#assignsrc").val();
    var status = $("#statussrc").val();



    if (!isValid(bugid, desc, category, assign, status)) {
        alert("cannot be empty");
    } else {
        var ljson = {
            "bugid": bugid,
            "desc": desc,
            "category": category,
            "assign": assign,
            "status": status
        };
        searchBug(ljson, pdocid, paction)
    }
}

function searchBug(pjson, pdocid = '', paction = '') {
    if (pdocid !== '' && paction !== '') {
        pjson["docid"] = pdocid;
        pjson["action"] = paction;
    }

    $.post("http://" + IP + ":" + PORT + "/bug/v1/search", pjson, function (data, status) {
        console.log(data);
        if (data.length > 0) {
            var docid = getLastdocument(data, paction);
            var prdocid = getFirstdocument(data, paction);
            if (paction === '') {
                totalPage('bug', pjson, '#hdntotalpages');
            }

        }
        displaySearch(data, docid, prdocid, paction);
    });
}


function displaySearch(pdata, pDocId = '', prdocid = '', paction = '') {
    let html = '<thead><tr>';
    html += '<th scope="col-sm-3">BugID</th>';
    html += '<th scope="col-sm-3">Description</th>';
    html += '<th scope="col-sm-3">Category</th>';
    html += '<th scope="col-sm-3">Status</th>';
    html += '<th scope="col-sm-3">Created Date</th>';
    html += '<th scope="col-sm-3">Assigned To </th>'
    html += '<th scope="col-sm-3">Fixed by</th>';
    html += '<th scope="col-sm-3">Fixed On</th></tr></thead>';

    var totpage = $("#hdntotalpages").val();
    var currPage = $("#hdnpageno").val();
    
    let lnextstr = (currPage <= totpage || currPage == 1) ? '<a href="javascript:snext(\'' + pDocId + '\');">Next &gt;&gt;</a>' : '';
    
    let lprevstr = (currPage > 1) ? '<a href="javascript:sprev(\'' + prdocid + '\')">&lt;&lt; Prev</a>' : '';

    if (paction === "next" || paction == '' || pDocId == '' || prdocid == '') {
        for (let i = 0; i < pdata.length; i++) {
            html += '<tr><td>' + pdata[i].bugid + '</td><td>' + pdata[i].desc + '</td>';
            html += '<td>' + pdata[i].category + '</td><td>' + pdata[i].status + '</td>';
            html += '<td>' + pdata[i].created + '</td><td>' + pdata[i].assign + '</td>';
            html += '<td>' + pdata[i].fixedBy + '</td><td>' + pdata[i].fixedon + '</td></tr>';
        }
        html += '<tr><td colspan="10">' + lprevstr + '&nbsp;&nbsp;' + lnextstr + '</td></tr>';
    } else if (paction === "prev") {
        for (let i = pdata.length - 1; i >= 0; i--) {

            html += '<tr><td>' + pdata[i].bugid + '</td><td>' + pdata[i].desc + '</td>';
            html += '<td>' + pdata[i].category + '</td><td>' + pdata[i].status + '</td>';
            html += '<td>' + pdata[i].created + '</td><td>' + pdata[i].assign + '</td>';
            html += '<td>' + pdata[i].fixedBy + '</td><td>' + pdata[i].fixedon + '</td>';


            html += '<td><a href="javascript:editBug(\'' + pdata[i]._id + '\');">Edit</a></td>';
            html += '<td><a href="javascript:deleteBug(\'' + pdata[i]._id + '\');">Delete</td></tr>';

        }
        html += '<tr><td colspan="10">' + lprevstr + '&nbsp;&nbsp;' + lnextstr + '</td></tr>';
    }
    $("#bugsearchreport").html(html);

}

function isValid(bugid, desc, category, assign, status) {
    if (bugid == "" && desc == "" && category == "" && assign == "" && status == "")
        return false;
    else
        return true;
}


function snext(pdocid) {
    var currPage = $("#hdnpageno").val();
    let totalpages = $("#hdntotalpages").val();
    
    if (currPage <= totalpages)
    {
        currPage++
    }
    $("#hdnpageno").val(currPage);

    search(pdocid, "next");
}

function sprev(pdocid) {
    var currPage = $("#hdnpageno").val();

    if (currPage > 1) {
        currPage--;
    }
    $("#hdnpageno").val(currPage);
    search(pdocid, "prev");
}



function totalPage(pcollection, pjson, phdnpageno) {
    if (pcollection === 'bug'){
        //pjson["mkey"] = ["bugid","category","status","assign"];
        console.log(pjson);
    }
    $.post("http://" + IP + ":" + PORT + "/bug/v1/getrowcount/" + pcollection, pjson, function (data, status) {

        var totalRow = data.row;
        console.log(totalRow);
        $(phdnpageno).val(Math.floor(totalRow / gPagesize));

    });
}

//let ljson = {"category":"test10", "dsadsd":"10", "mkey" : { "category": ""}};
//console.log(ljson.mkey);

//totalPage('bug',{"category" : "10", "mkey":{"category":""}},'#hdnpageno');