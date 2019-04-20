'use strict';
class Calendar {
    constructor({ el, language = 'es', name, prefix = 'mcp', date = null, rangeYears = 30 }) {
        this.el = document.querySelector(el);
        this.that = el.split('#').join('');
        this.language = language;
        this.name = name;
        this.prefix = prefix;
        this.range = rangeYears;
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
                this.months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                this.cancelBtn = 'cancel';
                this.saveBtn = 'save';
                break;
            default:
                this.days = ['d', 'l', 'm', 'mi', 'j', 'v', 's'];
                this.months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
                this.cancelBtn = 'cancelar';
                this.saveBtn = 'aceptar';
                break;
        }
    }

    build(id, input, parent) {
        this.setLanguage(this.language);

        let $template = `
				<span class="${this.prefix}-icon-clear hide" id="${this.iconClear}">
					<span></span>
				</span>
				<input maxlength="10" type='text' class="${this.prefix}-input" id="${input}" placeholder='${this.getDay() < 10 ? '0'+this.getDay() : this.getDay()}/${this.getMonth() < 10 ? '0'+this.getMonth() : this.getMonth()}/${this.getYear()}'/>
				<span id="${this.iconToggle}" class="${this.prefix}-icon-get-date-now">
					<span></span>
				</span>
				<div class="${this.prefix}-calendar">
					<div class="${this.prefix}-calendar-header">
							<span class="${this.prefix}-calendar-control previus"></span>
							<strong id="${this.toggleView}">
								<span class="toggleMonth">{{month}}</span>
								<span class="toggleDay">{{day}}</span>
								<span class="toggleYear">{{year}}</span>
							</strong>
							<span class="${this.prefix}-calendar-control next"></span>
					</div>
					<div class="${this.prefix}-calendar-days">{{days}}</div>
					<div class="${this.prefix}-calendar-grid viewMonth">
						<div class="viewCalendar ${this.prefix}-calendar-grid__view-months">{{calendar-months}}</div>
						<div class="viewCalendar ${this.prefix}-calendar-grid__view-month">{{calendar-grid}}</div>
						<div class="viewCalendar ${this.prefix}-calendar-grid__view-years">{{calendar-years}}</div>
					</div>
					<div class="${this.prefix}-calendar-actions">
							<button cancel>${this.cancelBtn}</button>
							<button save>${this.saveBtn}</button>
					</div>
			</div>
			`;

        $template = $template.
        replace(/\{\{days\}\}/g, this.getDays()).
        replace(/\{\{month\}\}/g, this.months[this.getMonth() - 1]).
        replace(/\{\{year\}\}/g, this.getYear()).
        replace(/\{\{day\}\}/g, this.getDay() < 10 ? `0${this.getDay()}` : this.getDay()).
        replace(/\{\{calendar-years\}\}/g, this.getYears()).
        replace(/\{\{calendar-months\}\}/g, this.getMonths()).
        replace(/\{\{calendar-grid\}\}/g, this.getCalendar()).
        replace('\t', '').
        replace('\n', '');

        this.el.innerHTML += $template;
        this.calendarGrid = this.el.querySelector(`.${this.prefix}-calendar-grid`);

        let $__viewYear = this.el.querySelector(`[data-year="${this.getYear()}"]`)
        let $__top = $__viewYear.offsetTop;
        $__viewYear.parentElement.scrollTop = $__top - 100;

        this.watchCalendar(parent, input);
        this.watchMonth(parent, input);
        this.watchYear(parent, input);
        this.watchToggleView(this.toggleView, parent);
        this.watchClear(this.iconClear, parent, input);
        this.watchToggle(id, parent);
        this.watchInput(input, parent, this.iconClear);
        this.updateInput(id);
    }

    watchMonth(parent, id) {
        let $__months = parent.querySelectorAll('[data-month]');
        let $__label = parent.querySelector('.toggleMonth');

        $__months.forEach($m => {
            $m.addEventListener('click', e => {
                e.stopPropagation();
                let $that = e.target;
                this.removeClassSiblings($__months, $__months.length);
                $that.classList.add('active');
                this.removeClass(['viewMonths', 'viewYear'], $that.parentElement.parentNode);
                $that.parentElement.parentNode.classList.add('viewMonth');
                this.setMonth($that.getAttribute('data-month'));
                $__label.innerHTML = this.months[this.getMonth() - 1];

                this.updateInput(id);
            }, false);
        });
    }

    watchYear(parent, id) {
        let $__years = parent.querySelectorAll('[data-year]');
        let $__label = parent.querySelector('.toggleYear');

        $__years.forEach($m => {
            $m.addEventListener('click', e => {
                e.stopPropagation();
                let $that = e.target;
                this.removeClassSiblings($__years, $__years.length);

                $that.classList.add('active');
                this.removeClass(['viewMonths', 'viewYear'], $that.parentElement.parentNode);
                $that.parentElement.parentNode.classList.add('viewMonth');
                this.setYear($that.getAttribute('data-year'));
                $__label.innerHTML = this.getYear();
                this.updateInput(id);
            }, false);
        });
    }

    watchCalendar(parent, input) {
        let $_days = parent.querySelectorAll(`.${this.prefix}-calendar-grid__btn`);
        let $__label = parent.querySelector('.toggleDay');
        let $_in = $_days.length;

        for (let i = 0; i < $_in; i++) {
            const el = $_days[i];

            el.addEventListener('click', e => {
                e.stopPropagation();
                const $__btn = e.target;
                const $__currentDay = $__btn.getAttribute('day');
                this.setDay($__currentDay);
                this.updateInput(input);

                this.removeClassSiblings($_days, $_in);
                $__label.innerHTML = this.getDay() < 10 ? `0${this.getDay()}` : this.getDay();

                $__btn.classList.add('active');
            }, false);
        }
    }

    watchToggleView(view, parent) {
        const $__view = parent.querySelector(`#${view}`);
        let $__viewContainer = parent.querySelector(`.${this.prefix}-calendar-grid`);

        $__view.addEventListener('click', e => {
            e.stopPropagation();
            const $_that = e.target;


            if ($_that.classList.contains('toggleMonth')) {
                this.removeClass(['viewMonth', 'viewYear'], $__viewContainer);
                $__viewContainer.classList.add('viewMonths');
            } else if ($_that.classList.contains('toggleDay')) {
                this.removeClass(['viewMonths', 'viewYear'], $__viewContainer);
                $__viewContainer.classList.add('viewMonth');
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
            e.stopPropagation();
            $toggle.nextElementSibling.classList.toggle(`${this.prefix}-show`);

            this.destroy($toggle);
        }, false);
        // $toggle.addEventListener('blur', e => {
        //     $toggle.nextElementSibling.classList.remove(`${this.prefix}-show`);
        // }, false);
    }

    destroy(el) {
        document.body.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            el.nextElementSibling.classList.remove(`${this.prefix}-show`);
            // this.removeEventListener('click', this, false);
        }, false);
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
        let $t = $_current - this.getPrintYears();
        let $tLimit = $t + (this.getPrintYears() * 2);

        for (let i = $t; i < $tLimit; i++) {

            $_template += `<span data-year="${i}" ${$_current == i ? 'class="active"': ''}>${i}</span>`;

        }
        return $_template;
    }

    getPrintYears() {
        return this.range;
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

    getMonths() {
        let $_template = '';
        let $_current = this.getMonth();
        let $tLimit = this.months.length;

        for (let i = 0; i < $tLimit; i++) {

            $_template += `<span data-month="${i+1}" ${$_current == i ? 'class="active"': ''}>${this.months[i].toLowerCase()}</span>`;

        }
        return $_template;
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