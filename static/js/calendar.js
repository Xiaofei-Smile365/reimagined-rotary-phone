let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

let all_day = 0;
let diarys_date = "";

function show_year_month(){
    if (month<10){
        document.getElementById("month").innerHTML = "0" + month.toString();
    }
    else {
        document.getElementById("month").innerHTML = month.toString();
    }

    document.getElementById("year").innerHTML = year.toString();
}

function count(){
    if (month !== 2){
        if (month === 4 || month === 6 || month === 9 || month === 11){
            all_day = 30;
        }
        else {
            all_day = 31;
        }
    }
    else {
        if ((year%4 === 0 && year%100 !== 0) || (year%400 === 0)){
            all_day = 29;
        }
        else {
            all_day = 28;
        }
    }
}

function get_diarys_date(){
    // 发送ajax请求，计算，返回结果
    $.ajax({
        url: '/get_diary_date/',  // ajax请求的地址
        method: 'get',  // 请求方式
        async: false,   // 同步
        data: {'year': year,'month': month}, //携带参数
        success: function (data) {   //服务端成功返回会回调，执行匿名函数
            diarys_date = JSON.parse(data);
        }
    })
}

function show_diary_by_date(year, month, day){
    let diary_by_date = "";
    // 发送ajax请求，计算，返回结果
    $.ajax({
        url: '/show_diary_by_date/',  // ajax请求的地址
        method: 'get',  // 请求方式
        async: false,   // 同步
        data: {'year': year,'month': month, 'day': day}, //携带参数
        success: function (data) {   //服务端成功返回会回调，执行匿名函数
            diary_by_date = JSON.parse(data);
        }
    })

    let mon_dict = {
        "1":"01", "2":"02", "3":"03", "4":"04", "5":"05", "6":"06", "7":"07", "8":"08", "9":"09", "10":"10",
        "11":"11", "12":"12"
    }
    let date_dict = {
        "1":"01", "2":"02", "3":"03", "4":"04", "5":"05", "6":"06", "7":"07", "8":"08", "9":"09", "10":"10",
        "11":"11", "12":"12", "13":"13", "14":"14", "15":"15", "16":"16", "17":"17", "18":"18", "19":"19", "20":"20",
        "21":"21", "22":"22", "23":"23", "24":"24", "25":"25", "26":"26", "27":"27", "28":"28", "29":"29", "30":"30",
        "31":"31"
    }
    document.getElementById("diarys_title").innerHTML = year + "年" + mon_dict[month] + "月" + date_dict[day] + "日" + "发表的日记";

    let diarys_body = document.getElementById("diarys_body");
    diarys_body.innerHTML = "";
    diarys_body.style.all = "position:absolute; width:570px; height:430px; overflow:auto";

    let div_index_list = document.createElement("div");
    div_index_list.className = "index_list";
    diarys_body.appendChild(div_index_list);

    let div_date = document.createElement("div");
    div_date.className = "date";
    let mon_chinese_dict = {
        "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六", "7": "七",
        "8": "八", "9": "九", "10": "十", "11": "十一", "12": "十二"
    }
    div_date.innerHTML = "<span>" + mon_chinese_dict[month] + "</span>" + date_dict[day];
    div_index_list.appendChild(div_date);

    let days = document.createElement("div");
    days.className = "days";
    div_index_list.appendChild(days);
    for (let key in diary_by_date){
        let div_note_time = document.createElement("div");
        div_note_time.className = "note_time";
        div_note_time.innerHTML = key.slice(0, 2) + ":" + key.slice(2, 4);
        days.appendChild(div_note_time);

        let div_note_content = document.createElement("div");
        div_note_content.className = "note_content";
        div_note_content.innerHTML = diary_by_date[key];
        days.appendChild(div_note_content);

    }
}

function show_calendar(){
    show_year_month();
    count();
    get_diarys_date();

    let first_date = new Date(year, month-1, 1);
    let week = first_date.getDay();
    week === 0 ? week = 7 : week;

    let calendar_body = document.getElementById("calendar_body");
    let tr_days = document.createElement("tr");
    calendar_body.appendChild(tr_days);

    let weeks = {"0":"一", "1":"二","2":"三","3":"四","4":"五","5":"六","6":"日"}
    for (let m=0; m<7; m++){
        let th_days = document.createElement("th");
        th_days.innerHTML = weeks[m].toString();
        tr_days.appendChild(th_days);
    }

    for (let i=0; i<6; i++){
        let tr_days = document.createElement("tr");
        calendar_body.appendChild(tr_days);

        for (let j=0; j<7; j++){
            let id_x = i*7 + j;
            let date_day = id_x - week + 2;

            if (date_day <= 0 || date_day > all_day){
                date_day = "&nbsp;"
            }

            let td_days = document.createElement("td");

            if (diarys_date.includes(date_day.toString())){

                let a_days = document.createElement("a");
                a_days.innerHTML = date_day.toString();
                a_days.href = "#";
                let value = "show_diary_by_date(" + year.toString() + "," + month.toString() + "," + date_day.toString() + ")";
                a_days.setAttribute("onclick", value);

                a_days.style.color = 'green';
                a_days.style.fontWeight  = 'bold';

                td_days.appendChild(a_days);
            }
            else{
                td_days.innerHTML = date_day.toString();
            }

            if (date_day === day && month === (today.getMonth() + 1) && year === today.getFullYear()){
                td_days.style.color = 'blue';
            }

            tr_days.appendChild(td_days);
        }
    }
}
show_calendar();

function prev_month(){
    let calendar_body = document.getElementById("calendar_body");
    calendar_body.innerHTML = "";
    if (month>1){
        month = month - 1;
    }
    else {
        month = 12;
        year = year - 1;
    }
    show_calendar();
}

function next_month(){
    let calendar_body = document.getElementById("calendar_body");
    calendar_body.innerHTML = "";
    if (month<12){
        month = month + 1;
    }
    else {
        month = 1;
        year = year + 1;
    }
    show_calendar();
}

function prev_year(){
    let calendar_body = document.getElementById("calendar_body");
    calendar_body.innerHTML = "";

    year = year - 1;

    show_calendar();
}

function next_year(){
    let calendar_body = document.getElementById("calendar_body");
    calendar_body.innerHTML = "";

    year = year + 1;

    show_calendar();
}