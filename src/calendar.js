'use strict';
class Calendar {
    constructor({ el, language = 'es', name, prefix, date = null }) {
        this.el = document.querySelector(el);
        this.language = language;
        this.name = name;
        this.prefix = prefix;
        this.days = '';
        this.date = new Date();
        this.initDate = date != null || date != undefined ? date.split('/') : null;
        this.calendarGrid = null;

        this.inputID = `${el.split('#').join('')}-input`;

        if (this.initDate != null && Array.isArray(this.initDate)) {
            this.setDay(this.initDate[0]);
            this.setMonth(this.initDate[1]);
            this.setYear(this.initDate[2]);
        } else {
            this.setDay(this.date.getDate());
            this.setMonth(this.date.getMonth() + 1);
            this.setYear(this.date.getFullYear());
        }

        this.build(this.inputID);
    }

    setLanguage(language) {
        switch (language) {
            case 'en':
                this.days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
                this.months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
                this.cancelBtn = 'cancel';
                this.saveBtn = 'save';
                break;
            default:
                this.days = ['d', 'l', 'm', 'mi', 'j', 'v', 's'];
                this.months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
                this.cancelBtn = 'cancelar';
                this.saveBtn = 'aceptar';
                break;
        }
    }

    build(id) {
        this.setLanguage(this.language);

        let $template = `
				<input type='text' class="${this.prefix}-input" id="${id}" placeholder='01/05/2019'/>
				<div class="${this.prefix}-calendar">
					<div class="${this.prefix}-calendar-header">
							<span class="${this.prefix}-calendar-control previus"></span>
							<strong>{{month}} {{year}}</strong>
							<span class="${this.prefix}-calendar-control next"></span>
					</div>
					<div class="${this.prefix}-calendar-days">{{days}}</div>
					<div class="${this.prefix}-calendar-grid">{{calendar-grid}}</div>
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
        replace(/\{\{calendar-grid\}\}/g, this.getCalendar()).
        replace('\t', '').
        replace('\n', '');

        this.el.innerHTML += $template;
        this.calendarGrid = this.el.querySelector(`.${this.prefix}-calendar-grid`);

        this.watchInput(id);
    }

    watchInput(id) {
        const $input = document.querySelector(`#${id}`);
        console.log($input);

        $input.addEventListener('focus', e => {
            $input.nextElementSibling.classList.add(`${this.prefix}-show`);
        }, false);
        $input.addEventListener('blur', e => {
            $input.nextElementSibling.classList.remove(`${this.prefix}-show`);
        }, false);
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
                $t += `<span ${index == 1 ? 'style="grid-column-start:'+($day+1)+'"' : ''} class="${this.prefix}-calendar-grid--btn active">${this.print(index)}</span>`;
            } else {
                $t += `<span ${index == 1 ? 'style="grid-column-start:'+($day+1)+'"' : ''} class="${this.prefix}-calendar-grid--btn">${this.print(index)}</span>`;
            }

        }
        return $t;

        // buttons = grid.querySelectorAll('.calendar-grid-button');
        // Calendar.watchCalendar(label, buttons, input, calendar);
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

    dev() {
        console.log(this);
    }

}