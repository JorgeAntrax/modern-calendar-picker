export default class Calendar {
    constructor({ el, language = 'es', name }) {
        this.el = document.querySelector(el);
        this.language = language;
        this.name = name;

        this.build();
    }

    build() {
        let $template = `
					<input type='text' placeholder='01/05/2019'/>
				`;
    }

    dev() {
        console.log(this);
    }

}