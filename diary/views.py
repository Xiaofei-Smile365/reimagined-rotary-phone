import datetime
import json

from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader

from .models import Diary


def index(request):
    latest_diary_list = Diary.objects.order_by('created_time')

    date_diary_list = []
    for diary in latest_diary_list:
        if diary.created_time.strftime("%Y%m%d")[0:6] == datetime.datetime.now().strftime("%Y%m%d")[0:6]:
            date_diary_list.append(diary.created_time.strftime("%Y%m%d"))
    date_list = list(set(date_diary_list))
    date_list.sort(key=date_diary_list.index)
    date_list.reverse()

    diary_list = {}
    for date in date_list:
        diary_body_list = {}
        for diary in latest_diary_list:
            if diary.created_time.strftime("%Y%m%d") == date:
                diary_body_list[diary.created_time.strftime("%H%M")] = diary.diary_body
            else:
                pass
        mon_dict = {"01": u"一月", "02": u"二月", "03": u"三月", "04": u"四月", "05": u"五月", "06": u"六月", "07": u"七月",
                    "08": u"八月", "09": u"九月", "10": u"十月", "11": u"十一月", "12": u"十二月"}
        diary_list[mon_dict[date[4:6]] + date[6:8]] = diary_body_list

    template = loader.get_template('diary/index.html')
    context = {'latest_diary_list': diary_list}
    return HttpResponse(template.render(context, request))


def home(request):
    template = loader.get_template('diary/home.html')

    date_today = datetime.datetime.now().strftime("%Y年%m月%d日")
    weeks = {"0": "一", "1": "二", "2": "三", "3": "四", "4": "五", "5": "六", "6": "日"}
    week_today = "星期" + str(weeks[str(datetime.datetime.now().weekday())])

    latest_diary_list = Diary.objects.order_by('created_time')

    date_diary_list = []
    for diary in latest_diary_list:
        date_diary_list.append(diary.created_time.strftime("%Y%m%d"))
    date_list = list(set(date_diary_list))
    date_list.sort(key=date_diary_list.index)
    date_list.reverse()

    diary_body_list = {}
    for date in date_list:
        if date == datetime.datetime.now().strftime("%Y%m%d"):
            diary_body_list = {}
            for diary in latest_diary_list:
                if (diary.created_time.strftime("%Y%m%d") == date) and (
                        date == datetime.datetime.now().strftime("%Y%m%d")):
                    diary_body_list[diary.created_time.strftime("%H%M")] = diary.diary_body
                else:
                    pass
        else:
            pass

    context = {"date_today": date_today, "week_today": week_today, "diary_sum": len(date_list),
               "diary_body_today": diary_body_list}
    return HttpResponse(template.render(context, request))


def add(request):
    if request.method == 'POST':
        diary_body = request.POST.get("content")
        if diary_body != "":
            add_diary = Diary(diary_body=diary_body)  # 这是插入的方法
            add_diary.save()
            return HttpResponseRedirect('/home')
        else:
            pass

    template = loader.get_template('diary/add.html')

    date_today = datetime.datetime.now().strftime("%Y年%m月%d日")
    weeks = {"0": "一", "1": "二", "2": "三", "3": "四", "4": "五", "5": "六", "6": "日"}
    week_today = "星期" + str(weeks[str(datetime.datetime.now().weekday())])

    context = {"date_today": date_today, "week_today": week_today}
    return HttpResponse(template.render(context, request))


def get_diary_date(request):
    year = request.GET.get('year')
    month = request.GET.get('month')
    if int(month) < 10:
        month = "0" + month

    latest_diary_list = Diary.objects.order_by('created_time')

    date_diary_list = []
    for diary in latest_diary_list:
        if diary.created_time.strftime("%Y%m%d")[0:6] == (year + month):
            date_diary_list.append(str(int(diary.created_time.strftime("%d"))))
    date_list = list(set(date_diary_list))
    date_list.sort(key=date_diary_list.index)
    date_list.reverse()

    context = json.dumps(date_list)

    return HttpResponse(context)


def show_diary_by_date(request):
    year = request.GET.get('year')
    month = request.GET.get('month')
    day = request.GET.get('day')

    latest_diary_list = Diary.objects.order_by('created_time')
    diary_body_list = {}
    for diary in latest_diary_list:
        if diary.created_time.strftime("%Y%m%d") == (
                datetime.datetime.strptime((year + month + day), '%Y%m%d').strftime("%Y%m%d")):
            diary_body_list[diary.created_time.strftime("%H%M")] = diary.diary_body
        else:
            pass

    context = json.dumps(diary_body_list)

    return HttpResponse(context)
