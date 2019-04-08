'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Calendar =
/*#__PURE__*/
function () {
  function Calendar(_ref) {
    var el = _ref.el,
        _ref$language = _ref.language,
        language = _ref$language === void 0 ? 'es' : _ref$language,
        name = _ref.name,
        prefix = _ref.prefix,
        _ref$date = _ref.date,
        date = _ref$date === void 0 ? null : _ref$date;

    _classCallCheck(this, Calendar);

    this.el = document.querySelector(el);
    this.language = language;
    this.name = name;
    this.prefix = prefix;
    this.days = '';
    this.date = new Date();
    this.initDate = date != null || date != undefined ? date.split('/') : null;
    this.calendarGrid = null;

    if (this.initDate != null && Array.isArray(this.initDate)) {
      this.setDay(this.initDate[0]);
      this.setMonth(this.initDate[1]);
      this.setYear(this.initDate[2]);
    } else {
      this.setDay(this.date.getDate());
      this.setMonth(this.date.getMonth() + 1);
      this.setYear(this.date.getFullYear());
    }

    this.build();
  }

  _createClass(Calendar, [{
    key: "setLanguage",
    value: function setLanguage(language) {
      switch (language) {
        case 'en':
          this.days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
          this.months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
          this.cancelBtn = 'cancel';
          this.saveBtn = 'save';
          break;

        default:
          this.days = ['d', 'l', 'm', 'mi', 'j', 'v', 's'];
          this.months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          this.cancelBtn = 'cancelar';
          this.saveBtn = 'aceptar';
          break;
      }
    }
  }, {
    key: "build",
    value: function build() {
      this.setLanguage(this.language);
      var $template = "\n\t\t\t\t<input type='text' class=\"".concat(this.prefix, "-input\" placeholder='01/05/2019' />\n\t\t\t\t<div class=\"").concat(this.prefix, "-calendar\">\n\t\t\t\t\t<div class=\"").concat(this.prefix, "-calendar-header\">\n\t\t\t\t\t\t\t<span class=\"").concat(this.prefix, "-calendar-control previus\"></span>\n\t\t\t\t\t\t\t<strong>{{month}} {{year}}</strong>\n\t\t\t\t\t\t\t<span class=\"").concat(this.prefix, "-calendar-control next\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"").concat(this.prefix, "-calendar-days\">{{days}}</div>\n\t\t\t\t\t<div class=\"").concat(this.prefix, "-calendar-grid\">{{calendar-grid}}</div>\n\t\t\t\t\t<div class=\"").concat(this.prefix, "-calendar-actions\">\n\t\t\t\t\t\t\t<button cancel>").concat(this.cancelBtn, "</button>\n\t\t\t\t\t\t\t<button save>").concat(this.saveBtn, "</button>\n\t\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t");
      $template = $template.replace(/\{\{days\}\}/g, this.getDays()).replace(/\{\{month\}\}/g, this.months[this.getMonth() - 1]).replace(/\{\{year\}\}/g, this.getYear()).replace(/\{\{calendar-grid\}\}/g, this.getCalendar()).replace('\t', '').replace('\n', '');
      this.el.innerHTML += $template;
      this.calendarGrid = this.el.querySelector(".".concat(this.prefix, "-calendar-grid"));
    }
  }, {
    key: "getDays",
    value: function getDays() {
      var $_template = '';
      var $tdays = this.days.length;

      for (var i = 0; i < $tdays; i++) {
        var e = this.days[i];
        $_template += "<span>".concat(e, "</span>");
      }

      return $_template;
    }
  }, {
    key: "getCalendar",
    value: function getCalendar() {
      var $mes = this.getMonth() - 1,
          $anio = this.getYear(),
          forMes = 0,
          $t = '';
      this.date.setFullYear($anio, $mes, 1);
      var $day = this.date.getDay();
      forMes = this.getMonthDays($mes);

      for (var index = 1; index <= forMes; index++) {
        if (index == this.getDay()) {
          $t += "<span ".concat(index == 1 ? 'style="grid-column-start:' + ($day + 1) + '"' : '', " class=\"").concat(this.prefix, "-calendar-grid--btn active\">").concat(this.print(index), "</span>");
        } else {
          $t += "<span ".concat(index == 1 ? 'style="grid-column-start:' + ($day + 1) + '"' : '', " class=\"").concat(this.prefix, "-calendar-grid--btn\">").concat(this.print(index), "</span>");
        }
      }

      return $t; // buttons = grid.querySelectorAll('.calendar-grid-button');
      // Calendar.watchCalendar(label, buttons, input, calendar);
    }
  }, {
    key: "print",
    value: function print(n) {
      if (n < 10) {
        return "0".concat(n);
      } else {
        return n;
      }
    }
  }, {
    key: "setDay",
    value: function setDay(d) {
      this.day = parseInt(d) > 0 ? parseInt(d) : this.date.getDate();
    }
  }, {
    key: "setMonth",
    value: function setMonth(d) {
      this.month = parseInt(d) > 0 ? parseInt(d) : this.date.getMonth() + 1;
    }
  }, {
    key: "setYear",
    value: function setYear(d) {
      this.year = parseInt(d) > 0 ? parseInt(d) : this.date.getFullYear();
    }
  }, {
    key: "getDay",
    value: function getDay() {
      return this.day;
    }
  }, {
    key: "getMonth",
    value: function getMonth() {
      return this.month;
    }
  }, {
    key: "getYear",
    value: function getYear() {
      return this.year;
    }
  }, {
    key: "getMonthDays",
    value: function getMonthDays(mes) {
      if (mes == 0 || mes == 2 || mes == 4 || mes == 6 || mes == 7 || mes == 9 || mes == 11) {
        return 31;
      } else if (mes == 1) {
        return 28;
      } else {
        return 30;
      }
    }
  }, {
    key: "dev",
    value: function dev() {
      console.log(this);
    }
  }]);

  return Calendar;
}();