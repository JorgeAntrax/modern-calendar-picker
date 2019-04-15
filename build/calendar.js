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
        _ref$prefix = _ref.prefix,
        prefix = _ref$prefix === void 0 ? 'mcp' : _ref$prefix,
        _ref$date = _ref.date,
        date = _ref$date === void 0 ? null : _ref$date;

    _classCallCheck(this, Calendar);

    this.el = document.querySelector(el);
    this.that = el.split('#').join('');
    this.language = language;
    this.name = name;
    this.prefix = prefix;
    this.days = '';
    this.date = new Date();
    this.initDate = date != null || date != undefined ? date.split('/') : null;
    this.calendarGrid = null;
    this.iconToggle = "".concat(this.prefix, "-").concat(this.that, "-dateNow");
    this.iconClear = "".concat(this.prefix, "-").concat(this.that, "-clear");
    this.inputId = "".concat(this.prefix, "-").concat(this.that, "-input");
    this.toggleView = "".concat(this.prefix, "-").concat(this.that, "-toggle-view");

    if (this.initDate != null && Array.isArray(this.initDate)) {
      this.setDay(this.initDate[0]);
      this.setMonth(this.initDate[1]);
      this.setYear(this.initDate[2]);
    } else {
      this.setDay(this.date.getDate());
      this.setMonth(this.date.getMonth() + 1);
      this.setYear(this.date.getFullYear());
    }

    this.build(this.iconToggle, this.inputId, this.el);
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
          this.todayBtn = 'today';
          break;

        default:
          this.days = ['d', 'l', 'm', 'mi', 'j', 'v', 's'];
          this.months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          this.cancelBtn = 'cancelar';
          this.saveBtn = 'aceptar';
          this.todayBtn = 'Hoy';
          break;
      }
    }
  }, {
    key: "build",
    value: function build(id, input, parent) {
      this.setLanguage(this.language);
      var $template = "\n\t\t\t\t<span class=\"".concat(this.prefix, "-icon-clear hide\" id=\"").concat(this.iconClear, "\">\n\t\t\t\t\t<span></span>\n\t\t\t\t</span>\n\t\t\t\t<input maxlength=\"10\" type='text' class=\"").concat(this.prefix, "-input\" id=\"").concat(input, "\" placeholder='01/05/2019'/>\n\t\t\t\t<span id=\"").concat(this.iconToggle, "\" class=\"").concat(this.prefix, "-icon-get-date-now\">\n\t\t\t\t\t<span></span>\n\t\t\t\t</span>\n\t\t\t\t<div class=\"").concat(this.prefix, "-calendar\">\n\t\t\t\t\t<div class=\"").concat(this.prefix, "-calendar-header\">\n\t\t\t\t\t\t\t<span class=\"").concat(this.prefix, "-calendar-control previus\"></span>\n\t\t\t\t\t\t\t<strong id=\"").concat(this.toggleView, "\">\n\t\t\t\t\t\t\t\t<span class=\"toggleMonth\">{{month}}</span>\n\t\t\t\t\t\t\t\t<span class=\"toggleYear\">{{year}}</span>\n\t\t\t\t\t\t\t</strong>\n\t\t\t\t\t\t\t<span class=\"").concat(this.prefix, "-calendar-control next\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"").concat(this.prefix, "-calendar-days\">{{days}}</div>\n\t\t\t\t\t<div class=\"").concat(this.prefix, "-calendar-grid viewMonth\">\n\t\t\t\t\t\t<div class=\"viewCalendar ").concat(this.prefix, "-calendar-grid__view-months\">{{months}}</div>\n\t\t\t\t\t\t<div class=\"viewCalendar ").concat(this.prefix, "-calendar-grid__view-month\">{{calendar-grid}}</div>\n\t\t\t\t\t\t<div class=\"viewCalendar ").concat(this.prefix, "-calendar-grid__view-years\">{{calendar-years}}</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"").concat(this.prefix, "-calendar-actions\">\n\t\t\t\t\t\t\t<button cancel>").concat(this.cancelBtn, "</button>\n\t\t\t\t\t\t\t<button today>").concat(this.todayBtn, "</button>\n\t\t\t\t\t\t\t<button save>").concat(this.saveBtn, "</button>\n\t\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t");
      $template = $template.replace(/\{\{days\}\}/g, this.getDays()).replace(/\{\{month\}\}/g, this.months[this.getMonth() - 1]).replace(/\{\{year\}\}/g, this.getYear()).replace(/\{\{calendar-years\}\}/g, this.getYears()).replace(/\{\{calendar-grid\}\}/g, this.getCalendar()).replace('\t', '').replace('\n', '');
      this.el.innerHTML += $template;
      this.calendarGrid = this.el.querySelector(".".concat(this.prefix, "-calendar-grid"));
      this.watchCalendar(parent, input);
      this.watchToggleView(this.toggleView, parent);
      this.watchClear(this.iconClear, parent, input);
      this.watchToggle(id, parent);
      this.watchInput(input, parent, this.iconClear);
      this.updateInput(id);
    }
  }, {
    key: "watchCalendar",
    value: function watchCalendar(parent, input) {
      var _this = this;

      var $_days = parent.querySelectorAll(".".concat(this.prefix, "-calendar-grid__btn"));
      var $_in = $_days.length;

      for (var i = 0; i < $_in; i++) {
        var el = $_days[i];
        el.addEventListener('click', function (e) {
          var $__btn = e.target;
          var $__currentDay = $__btn.getAttribute('day');

          _this.setDay($__currentDay);

          _this.updateInput(input);

          _this.removeClassSiblings($_days, $_in);

          $__btn.classList.add('active');
        }, false);
      }
    }
  }, {
    key: "watchToggleView",
    value: function watchToggleView(view, parent) {
      var _this2 = this;

      var $__view = parent.querySelector("#".concat(view));
      var $__viewContainer = parent.querySelector(".".concat(this.prefix, "-calendar-grid"));
      $__view.addEventListener('click', function (e) {
        var $_that = e.target;

        if ($_that.classList.contains('toggleMonth')) {
          _this2.removeClass(['viewMonths', 'viewYear'], $__viewContainer);

          $__viewContainer.classList.add('viewMonths');
        } else {
          _this2.removeClass(['viewMonths', 'viewMonth'], $__viewContainer);

          $__viewContainer.classList.add('viewYear');
        }
      }, false);
    }
  }, {
    key: "removeClassSiblings",
    value: function removeClassSiblings($siblings, $in) {
      for (var $i = 0; $i < $in; $i++) {
        var el = $siblings[$i];

        if (el.classList.contains('active')) {
          el.classList.remove('active');
        }
      }
    }
  }, {
    key: "watchClear",
    value: function watchClear(id, parent, input) {
      var _this3 = this;

      var $__clear = parent.querySelector("#".concat(id));
      var $input = parent.querySelector("#".concat(input));
      $__clear.addEventListener('click', function (e) {
        _this3.setDay(1);

        _this3.setMonth(1);

        _this3.setYear(1);

        _this3.updateInput(input);

        e.target.classList.add('hide');
      }, false);
    }
  }, {
    key: "watchToggle",
    value: function watchToggle(id, parent) {
      var _this4 = this;

      var $toggle = parent.querySelector("#".concat(id));
      console.log($toggle);
      $toggle.addEventListener('click', function (e) {
        $toggle.nextElementSibling.classList.toggle("".concat(_this4.prefix, "-show"));
      }, false); // $toggle.addEventListener('blur', e => {
      //     $toggle.nextElementSibling.classList.remove(`${this.prefix}-show`);
      // }, false);
    }
  }, {
    key: "watchInput",
    value: function watchInput(id, parent, clear) {
      var _this5 = this;

      var $input = parent.querySelector("#".concat(id));
      var $_keyUp = 0;
      $input.addEventListener('keyup', function (e) {
        var $__this = e.target;
        var $__val = $__this.value;
        var $__cont = $__val.length;
        $_keyUp++;

        if ($_keyUp == 1) {
          parent.querySelector("#".concat(clear)).classList.remove('hide');
        }

        if ($__cont == 2 || $__cont == 5) {
          $__this.value += '/';
          $_keyUp++;
        }

        if ($_keyUp == 10) {
          var $__newDate = $__this.value.split('/');

          _this5.setDay($__newDate[0]);

          _this5.setMonth($__newDate[1]);

          _this5.setYear($__newDate[2]);

          $_keyUp = 0;
        }
      }, false); // $toggle.addEventListener('blur', e => {
      //     $toggle.nextElementSibling.classList.remove(`${this.prefix}-show`);
      // }, false);
    }
  }, {
    key: "updateInput",
    value: function updateInput(id) {
      var $_input = document.querySelector("#".concat(id));

      if (this.getDay() == 1 && this.getMonth() == 1 && this.getYear() == 1) {
        $_input.value = '';
      } else {
        var $_Day = this.getDay();
        var $_Month = this.getMonth();
        var $_Year = this.getYear();
        $_input.value = "".concat($_Day < 10 ? '0' : '').concat($_Day, "/").concat($_Month < 10 ? '0' : '').concat($_Month, "/").concat($_Year);
      }
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
    key: "getYears",
    value: function getYears() {
      var $_template = '';
      var $_current = this.getYear();
      var $t = $_current - 50;
      var $tLimit = $t + 100;

      for (var i = $t; i < $tLimit; i++) {
        $_template += "<span data-year=\"".concat(i, "\" ").concat($_current == i ? 'class="active"' : '', ">").concat(i, "</span>");
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
          $t += "<span day=\"".concat(index, "\" ").concat(index == 1 ? 'style="grid-column-start:' + ($day + 1) + '"' : '', " class=\"").concat(this.prefix, "-calendar-grid__btn active\">").concat(this.print(index), "</span>");
        } else {
          $t += "<span day=\"".concat(index, "\" ").concat(index == 1 ? 'style="grid-column-start:' + ($day + 1) + '"' : '', " class=\"").concat(this.prefix, "-calendar-grid__btn\">").concat(this.print(index), "</span>");
        }
      }

      return $t;
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
    key: "removeClass",
    value: function removeClass(classes, el) {
      if (Array.isArray(classes)) {
        var $_TC = classes.length;

        for (var $i = 0; $i < $_TC; $i++) {
          var e = classes[$i];
          el.classList.remove(e);
        }
      } else {
        el.classList.remove(classes);
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