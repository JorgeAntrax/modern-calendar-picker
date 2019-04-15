'use strict';
class Calendar {
    constructor({ el, language = 'es', name, prefix = 'mcp', date = null }) {
        this.el = document.querySelector(el);
        this.that = el.split('#').join('');
        this.language = language;
        this.name = name;
        this.prefix = prefix;
        this.days = '';
        this.date = new Date();
        this.initDate = date != null || date != undefined ? date.split('/') : null;
        this.calendarGrid = null;

        this.iconToggle = `${this.prefix}-${this.that}-dateNow`;
        this.iconClear = `${this.prefix}-${this.that}-clear`;
        this.inputId = `${this.prefix}-${this.that}-input`;
        this.toggleView = `${this.prefix}-${this.that}-toggle-view`;

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

    setLanguage(language) {
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
                this.months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
                this.cancelBtn = 'cancelar';
                this.saveBtn = 'aceptar';
                this.todayBtn = 'Hoy';
                break;
        }
    }

    build(id, input, parent) {
        this.setLanguage(this.language);

        let $template = `
				<span class="${this.prefix}-icon-clear hide" id="${this.iconClear}">
					<span></span>
				</span>
				<input maxlength="10" type='text' class="${this.prefix}-input" id="${input}" placeholder='01/05/2019'/>
				<span id="${this.iconToggle}" class="${this.prefix}-icon-get-date-now">
					<span></span>
				</span>
				<div class="${this.prefix}-calendar">
					<div class="${this.prefix}-calendar-header">
							<span class="${this.prefix}-calendar-control previus"></span>
							<strong id="${this.toggleView}">
								<span class="toggleMonth">{{month}}</span>
								<span class="toggleYear">{{year}}</span>
							</strong>
							<span class="${this.prefix}-calendar-control next"></span>
					</div>
					<div class="${this.prefix}-calendar-days">{{days}}</div>
					<div class="${this.prefix}-calendar-grid viewMonth">
						<div class="viewCalendar ${this.prefix}-calendar-grid__view-months">{{months}}</div>
						<div class="viewCalendar ${this.prefix}-calendar-grid__view-month">{{calendar-grid}}</div>
						<div class="viewCalendar ${this.prefix}-calendar-grid__view-years">{{calendar-years}}</div>
					</div>
					<div class="${this.prefix}-calendar-actions">
							<button cancel>${this.cancelBtn}</button>
							<button today>${this.todayBtn}</button>
							<button save>${this.saveBtn}</button>
					</div>
			</div>
			`;

        $template = $template.
        replace(/\{\{days\}\}/g, this.getDays()).
        replace(/\{\{month\}\}/g, this.months[this.getMonth() - 1]).
        replace(/\{\{year\}\}/g, this.getYear()).
        replace(/\{\{calendar-years\}\}/g, this.getYears()).
        replace(/\{\{calendar-grid\}\}/g, this.getCalendar()).
        replace('\t', '').
        replace('\n', '');

        this.el.innerHTML += $template;
        this.calendarGrid = this.el.querySelector(`.${this.prefix}-calendar-grid`);

        this.watchCalendar(parent, input);
        this.watchToggleView(this.toggleView, parent);
        this.watchClear(this.iconClear, parent, input);
        this.watchToggle(id, parent);
        this.watchInput(input, parent, this.iconClear);
        this.updateInput(id);
    }

    watchCalendar(parent, input) {
        let $_days = parent.querySelectorAll(`.${this.prefix}-calendar-grid__btn`);
        let $_in = $_days.length;

        for (let i = 0; i < $_in; i++) {
            const el = $_days[i];

            el.addEventListener('click', e => {
                const $__btn = e.target;
                const $__currentDay = $__btn.getAttribute('day');
                this.setDay($__currentDay);
                this.updateInput(input);

                this.removeClassSiblings($_days, $_in);

                $__btn.classList.add('active');
            }, false);
        }
    }

    watchToggleView(view, parent) {
        const $__view = parent.querySelector(`#${view}`);
        let $__viewContainer = parent.querySelector(`.${this.prefix}-calendar-grid`);

        $__view.addEventListener('click', e => {
            const $_that = e.target;


            if ($_that.classList.contains('toggleMonth')) {
                this.removeClass(['viewMonths', 'viewYear'], $__viewContainer);
                $__viewContainer.classList.add('viewMonths');
            } else {
                this.removeClass(['viewMonths', 'viewMonth'], $__viewContainer);
                $__viewContainer.classList.add('viewYear');
            }

        }, false);
    }

    removeClassSiblings($siblings, $in) {
        for (let $i = 0; $i < $in; $i++) {
            let el = $siblings[$i];
            if (el.classList.contains('active')) {
                el.classList.remove('active');
            }
        }
    }

    watchClear(id, parent, input) {
        const $__clear = parent.querySelector(`#${id}`);
        const $input = parent.querySelector(`#${input}`);

        $__clear.addEventListener('click', e => {
            this.setDay(1);
            this.setMonth(1);
            this.setYear(1);

            this.updateInput(input);
            e.target.classList.add('hide');
        }, false);
    }

    watchToggle(id, parent) {
        const $toggle = parent.querySelector(`#${id}`);
        console.log($toggle);

        $toggle.addEventListener('click', e => {
            $toggle.nextElementSibling.classList.toggle(`${this.prefix}-show`);
        }, false);
        // $toggle.addEventListener('blur', e => {
        //     $toggle.nextElementSibling.classList.remove(`${this.prefix}-show`);
        // }, false);
    }

    watchInput(id, parent, clear) {
        const $input = parent.querySelector(`#${id}`);
        let $_keyUp = 0;
        $input.addEventListener('keyup', e => {
            let $__this = e.target;
            let $__val = $__this.value;
            let $__cont = $__val.length;

            $_keyUp++;

            if ($_keyUp == 1) {
                parent.querySelector(`#${clear}`).classList.remove('hide');
            }

            if ($__cont == 2 || $__cont == 5) {
                $__this.value += '/';
                $_keyUp++;
            }

            if ($_keyUp == 10) {
                let $__newDate = $__this.value.split('/');
                this.setDay($__newDate[0]);
                this.setMonth($__newDate[1]);
                this.setYear($__newDate[2]);
                $_keyUp = 0;
            }
        }, false);
        // $toggle.addEventListener('blur', e => {
        //     $toggle.nextElementSibling.classList.remove(`${this.prefix}-show`);
        // }, false);
    }

    updateInput(id) {
        const $_input = document.querySelector(`#${id}`);

        if (this.getDay() == 1 && this.getMonth() == 1 && this.getYear() == 1) {
            $_input.value = '';
        } else {
            let $_Day = this.getDay();
            let $_Month = this.getMonth();
            let $_Year = this.getYear();
            $_input.value = `${$_Day < 10 ? '0' :''}${$_Day}/${$_Month < 10 ? '0' :''}${$_Month}/${$_Year}`;
        }


    }

    getDays() {
        let $_template = '';
        let $tdays = this.days.length;

        for (let i = 0; i < $tdays; i++) {
            const e = this.days[i];

            $_template += `<span>${e}</span>`;

        }
        return $_template;
    }

    getYears() {
        let $_template = '';
        let $_current = this.getYear();
        let $t = $_current - 50;
        let $tLimit = $t + 100;

        for (let i = $t; i < $tLimit; i++) {

            $_template += `<span data-year="${i}" ${$_current == i ? 'class="active"': ''}>${i}</span>`;

        }
        return $_template;
    }

    getCalendar() {
        let
            $mes = this.getMonth() - 1,
            $anio = this.getYear(),
            forMes = 0,
            $t = '';

        this.date.setFullYear($anio, $mes, 1);
        let $day = this.date.getDay();

        forMes = this.getMonthDays($mes);

        for (let index = 1; index <= forMes; index++) {
            if (index == this.getDay()) {
                $t += `<span day="${index}" ${index == 1 ? 'style="grid-column-start:'+($day+1)+'"' : ''} class="${this.prefix}-calendar-grid__btn active">${this.print(index)}</span>`;
            } else {
                $t += `<span day="${index}" ${index == 1 ? 'style="grid-column-start:'+($day+1)+'"' : ''} class="${this.prefix}-calendar-grid__btn">${this.print(index)}</span>`;
            }

        }
        return $t;
    }

    print(n) {
        if (n < 10) {
            return `0${n}`;
        } else {
            return n;
        }
    }

    setDay(d) {
        this.day = parseInt(d) > 0 ? parseInt(d) : this.date.getDate();
    }
    setMonth(d) {
        this.month = parseInt(d) > 0 ? parseInt(d) : this.date.getMonth() + 1;
    }
    setYear(d) {
        this.year = parseInt(d) > 0 ? parseInt(d) : this.date.getFullYear();
    }
    getDay() {
        return this.day;
    }
    getMonth() {
        return this.month;
    }
    getYear() {
        return this.year;
    }

    getMonthDays(mes) {
        if (mes == 0 || mes == 2 || mes == 4 || mes == 6 || mes == 7 || mes == 9 || mes == 11) {
            return 31;
        } else if (mes == 1) {
            return 28;
        } else {
            return 30;
        }
    }

    removeClass(classes, el) {
        if (Array.isArray(classes)) {
            let $_TC = classes.length;

            for (let $i = 0; $i < $_TC; $i++) {
                const e = classes[$i];

                el.classList.remove(e);
            }
        } else {
            el.classList.remove(classes);
        }
    }

    dev() {
        console.log(this);
    }

}