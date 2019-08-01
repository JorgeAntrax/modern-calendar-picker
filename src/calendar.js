'use strict';
class Calendar {
    constructor({ el, language = 'es', name = "", prefix = 'mcp', date = null, rangeYears = 30, available = 'all', separator = '/', styleInput = '', props = '', call = null }) {
        this.el = document.querySelector(el);
        this.that = el.split('#').join('');
        this.language = language;
        this.name = name;
        this.prefix = prefix;
        this.range = rangeYears;
        this.inputClasses = styleInput;
        this.days = '';
        this.call = call;
        this.props = props;
        this.separator = separator;
        this.available = available;
        this.inputElement = null;
        this.date = new Date();
        this.initDate = date != null || date != undefined ? date.split('/') : null;
        this.calendarGrid = null;
        this.returnDate = '';
        this.keyCodes = [8, 46, 40, 38, 39, 37, 27, 32, 189, 13];

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

        this.build(this.iconToggle, this.inputId, this.el, this.call);
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

    build(id, input, parent, callback) {
        this.setLanguage(this.language);

        let $template = `
				<span class="${this.prefix}-icon-clear hide" id="${this.iconClear}">
					<span></span>
				</span>
                <input name="${this.name}" ${this.props} maxlength="10" type='text' class="${this.prefix}-input ${this.inputClasses}" id="${input}" placeholder='${this.getDay() < 10 ? '0'+this.getDay() : this.getDay()}${this.separator}${this.getMonth() < 10 ? '0'+this.getMonth() : this.getMonth()}${this.separator}${this.getYear()}'/>
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
        replace(/\{\{calendar-grid\}\}/g, this.getCalendar(this.getMonth() - 1)).
        replace('\t', '').
        replace('\n', '');

        this.el.innerHTML += $template;
        this.calendarGrid = this.el.querySelector(`.${this.prefix}-calendar-grid`);

        let $__viewYear = this.el.querySelector(`[data-year="${this.getYear()}"]`)
        let $__top = $__viewYear.offsetTop;
        $__viewYear.parentElement.scrollTop = $__top - 100;

        this.inputElement = this.el.querySelector(`#${input}`);

        this.watchSlide(parent);

        this.watchCalendar(parent, input, callback);
        this.watchMonth(parent, input);
        this.watchYear(parent, input);
        this.watchToggleView(this.toggleView, parent);
        this.watchClear(this.iconClear, parent, input);
        this.watchToggle(id, parent, input);
        this.watchInput(input, parent, this.iconClear);
        this.updateInput(id);
    }

    watchSlide($el) {
        $el = $el.querySelector(`.${this.prefix}-calendar-grid`);

        let
            x = 0,
            y = 0,
            direction = '',
            slideX = 0,
            cont = 0,
            tItems = 0;

        $el.addEventListener('touchstart', e => {
            console.log(e);
            let $t = e.targetTouches;
            if ($t.length == 1) {
                let touch = $t[0];
                x = touch.pageX;
                y = touch.pageY;
            }
            console.log(e, $t.length, x, y);
        });
        $el.addEventListener('touchmove', e => {
            let $t = e.targetTouches;
            if ($t.length == 1) {
                let touch = $t[0];

                if (touch.pageX < (x - 50) && (touch.pageY > y - 5) && (touch.pageY < y + 5)) {
                    direction = 'left';
                    slideX = touch.pageX;
                }
                if (touch.pageX > (x + 50) && (touch.pageY > y - 5) && (touch.pageY < y + 5)) {
                    direction = 'right';
                    slideX = touch.pageX;
                }
            }
        });
        $el.addEventListener('touchend', e => {

            if (slideX != 0 && slideX != undefined && slideX < (x - 50) && direction == 'left') {
                // console.log(cont, items);
                if (cont < 2) {
                    cont += 1;
                    // console.log(cont);
                    $el.style.marginLeft = `${-(cont * 100)}%`;
                } else {
                    // console.log("dsadasda");
                    $el.style.marginLeft = '0';
                    cont = 0;
                }

                slideX = 0;
            }

            if (slideX != 0 && slideX != undefined && slideX > (x + 50) && direction == 'right') {
                //console.log('slide right');
                if (cont > 0) {
                    cont -= 1;
                    $el.style.marginLeft = `${-(cont * 100)}%`;
                } else {
                    cont = 2;
                    $el.style.marginLeft = `${-(cont * 100)}%`;
                }

                slideX = 0;
            }
            this.slideView(['viewMonths', 'viewYear', 'viewMonth'], 'other', $el);

        });
    }

    watchMonth(parent, id) {
        let $__label = parent.querySelector('.toggleMonth');
        let $__replace = parent.querySelector(`.${this.prefix}-calendar-grid__view-month`);

        parent.addEventListener('click', e => {
            let $__months = parent.querySelectorAll('[data-month]:not([disabled])');
            e.stopPropagation();
            let $that = e.target;

            if (e.target.hasAttribute('data-month')) {
                this.removeClassSiblings($__months, $__months.length);
                $that.classList.add('active');
                this.setMonth($that.getAttribute('data-month'));
                $__label.innerHTML = this.months[this.getMonth() - 1];

                $__replace.innerHTML = this.getCalendar($that.getAttribute('data-month') - 1);
                this.updateInput(id);
                this.slideView(['viewMonths', 'viewYear'], 'viewMonth', $that.parentElement.parentNode);
            }
        }, false);
    }

    watchYear(parent, id) {
        let $__years = parent.querySelectorAll('[data-year]:not([disabled])');
        let $__label = parent.querySelector('.toggleYear');
        let $__replace = parent.querySelector(`.${this.prefix}-calendar-grid__view-month`);

        parent.addEventListener('click', e => {
            e.stopPropagation();
            let $that = e.target;
            if (e.target.hasAttribute('data-year')) {
                this.removeClassSiblings($__years, $__years.length);

                $that.classList.add('active');
                this.setYear($that.getAttribute('data-year'));
                $__label.innerHTML = this.getYear();
                this.updateInput(id);
                $__replace.innerHTML = this.getCalendar(this.getMonth() - 1);
                this.slideView(['viewMonths', 'viewYear'], 'viewMonth', $that.parentElement.parentNode);
            }
        }, false);
    }

    watchCalendar(parent, input, callback) {
        let $__label = parent.querySelector('.toggleDay');

        parent.addEventListener('click', e => {
            let $_days = parent.querySelectorAll(`.${this.prefix}-calendar-grid__btn:not([disabled])`);
            let $_in = $_days.length;
            e.stopPropagation();
            const $__btn = e.target;

            if (e.target.hasAttribute('day')) {
                const $__currentDay = $__btn.getAttribute('day');
                this.setDay($__currentDay);
                this.updateInput(input, callback);

                // console.log($_days, $_in);

                this.removeClassSiblings($_days, $_in);
                $__label.innerHTML = this.getDay() < 10 ? `0${this.getDay()}` : this.getDay();

                $__btn.classList.add('active');
                parent.querySelector(`.${this.prefix}-calendar`).classList.remove(`${this.prefix}-show`);

            }
        }, false);
    }

    watchToggleView(view, parent) {
        const $__view = parent.querySelector(`#${view}`);
        let $__viewContainer = parent.querySelector(`.${this.prefix}-calendar-grid`);

        $__view.addEventListener('click', e => {
            $__viewContainer.removeAttribute('style');
            e.stopPropagation();
            const $_that = e.target;

            if ($_that.classList.contains('toggleMonth')) {
                this.slideView(['viewMonth', 'viewYear'], 'viewMonths', $__viewContainer);
            } else if ($_that.classList.contains('toggleDay')) {
                this.slideView(['viewMonths', 'viewYear'], 'viewMonth', $__viewContainer);
            } else {
                this.slideView(['viewMonths', 'viewMonth'], 'viewYear', $__viewContainer);
            }

        }, false);
    }

    slideView($removes, $active, $container) {
        this.removeClass($removes, $container);
        $container.classList.add($active);
    }

    removeClassSiblings($siblings, $in) {
        for (let $i = 0; $i < $in; $i++) {
            let el = $siblings[$i];
            el.classList.remove('active');
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

    watchToggle(id, parent, input) {
        const $toggle = parent.querySelector(`#${id}`);

        // parent.addEventListener('focus', function(e) {
        //         const $this = e.target;

        //     console.log($this);
        //     if (e.target.classList.contains(`${this.prefix}-input`)) {
        //         $this.nextElementSibling.classList.toggle(`${this.prefix}-show`);
        //     }

        //     if ($this.classList.contains(`${this.prefix}-icon-get-date-now`)) {
        //         $this.nextElementSibling.classList.toggle(`${this.prefix}-show`);
        //     }

        // }, false);

        $toggle.addEventListener('click', e => {
            e.stopPropagation();
            $toggle.nextElementSibling.classList.toggle(`${this.prefix}-show`);

            // this.destroy($toggle);
        }, false);

        // console.log(input);

        // parent.querySelector(`#${input}`).addEventListener('focus', e => {
        //     // e.stopPropagation();
        //     e.target.nextElementSibling.nextElementSibling.classList.toggle(`${this.prefix}-show`);
        //     // this.destroy(input);
        // }, false);
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
        let $__cont = 0;
        $input.addEventListener('keyup', e => {
            $_keyUp++;
            let $__this = e.target;
            let $__val = $__this.value;

            if ($__cont == 1 || $__cont == 4) {
                $__this.value += this.separator;
                $_keyUp++;
            }

            if ($_keyUp == 1) {
                parent.querySelector(`#${clear}`).classList.remove('hide');
            }


            if ($_keyUp == 10) {
                let $__newDate = $__this.value.split(this.separator);
                this.setDay($__newDate[0]);
                this.setMonth($__newDate[1]);
                this.setYear($__newDate[2]);
                $_keyUp = 0;
            }
            $__cont++;

        }, false);
        // $toggle.addEventListener('blur', e => {
        //     $toggle.nextElementSibling.classList.remove(`${this.prefix}-show`);
        // }, false);
    }

    updateDate($val) {
        this.returnDate = $val;
    }

    getVal() {
        return this.returnDate;
    }

    updateInput(id) {
        const callback = arguments[1] || null;
        const $_input = document.querySelector(`#${id}`);

        if (this.getDay() == 1 && this.getMonth() == 1 && this.getYear() == 1) {
            $_input.value = '';
            this.updateDate($_input.value);
        } else {
            let $_Day = this.getDay();
            let $_Month = this.getMonth();
            let $_Year = this.getYear();
            $_input.value = `${$_Day < 10 ? '0' :''}${$_Day}${this.separator}${$_Month < 10 ? '0' :''}${$_Month}${this.separator}${$_Year}`;
            this.updateDate($_input.value);
        }
        // console.log(callback);
        if (callback !== null) {
            callback.call(this);
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

            $_template += `<span ${this.available == 'today' && i < $_current ? 'disabled' : ''} data-year="${i}" ${$_current == i ? 'class="active"': ''}>${i}</span>`;

        }
        return $_template;
    }

    getPrintYears() {
        return this.range;
    }

    getCalendar($mes) {
        let
            $anio = this.getYear(),
            forMes = 0,
            $t = '';
        this.date.setFullYear($anio, $mes, 1);
        let $day = this.date.getDay();

        console.log($mes, this.date.getMonth(), $day);

        forMes = this.getMonthDays($mes);

        for (let index = 1; index <= forMes; index++) {
            if (index == this.getDay()) {
                $t += `<span day="${index}" ${index == 1 ? 'style="grid-column-start:'+($day+1)+'"' : ''} class="${this.prefix}-calendar-grid__btn active">${this.print(index)}</span>`;
            } else {
                $t += `<span  day="${index}" ${index == 1 ? 'style="grid-column-start:'+($day+1)+'"' : ''} class="${this.prefix}-calendar-grid__btn">${this.print(index)}</span>`;
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
        this.date.setDate(parseInt(d) > 0 ? parseInt(d) : this.date.getDate());
        this.day = parseInt(d) > 0 ? parseInt(d) : this.date.getDate();
    }
    setMonth(d) {
        this.date.setMonth(parseInt(d) > 0 ? parseInt(d) : this.date.getMonth() + 1);
        this.month = parseInt(d) > 0 ? parseInt(d) : this.date.getMonth() + 1;
    }
    setYear(d) {
        this.date.setFullYear(parseInt(d) > 0 ? parseInt(d) : this.date.getFullYear());
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
        let $_current = this.getMonth() - 1;
        let $tLimit = this.months.length;

        for (let i = 0; i < $tLimit; i++) {

            $_template += `<span ${this.available == 'today' && i < $_current ? 'disabled' : ''} data-month="${i+1}" ${$_current == i ? 'class="active"': ''}>${this.months[i]}</span>`;

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