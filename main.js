//1
class Tabs{
    constructor(tabholder){
        this.tabholder = tabholder;
        this._renderTips();
        this._toggleTips();
    }
    _renderTips(){
        let tiplist = document.querySelectorAll(`#${this.tabholder} [data-tip]`);
        let folds = [...tiplist].length;
        if (folds > 1){
            $(`#${this.tabholder}`).prepend(`<div class="tipholder"></div>`);
            for (let tip in [...tiplist]){
                let tipItem = tiplist[tip].dataset.tip;
                let tipName = tiplist[tip].dataset.name;
                if (tip == 0){
                    $(`#${this.tabholder} .tipholder`).append(`<div class="tip cur" data-fold="${tipItem}">${tipName}</div>`);
                } else {
                    $(`#${this.tabholder} .tipholder`).append(`<div class="tip" data-fold="${tipItem}">${tipName}</div>`);
                    $('[data-tip]').eq(tip).hide(0);
                }

            }
        }
    }
    _toggleTips(){
            $(`#${this.tabholder}`).on('click', '[data-fold]', (e) => {
                if(!$(e.target).hasClass('cur')){
                    $(e.target).siblings('[data-fold]').removeClass('cur');
                    $(e.target).addClass('cur');
                    let curIndex = e.target.dataset.fold;
                    $(`[data-tip="${curIndex}"]`).siblings('[data-tip]').slideUp();
                    $(`[data-tip="${curIndex}"]`).slideDown();
                }

            });
    }
}

//2 & 3
class Validator {
    constructor(form) {
        this.patterns = {
            name: /^[a-zа-яё]+$/i,
            phone: /^\+7\(\d{3}\)\d{3}-\d{4}$/,
            email: /^[\w._-]+@\w+\.[a-z]{2,4}$/i
        };
        this.errors = {
            name: 'Имя содержит только буквы',
            phone: 'Телефон подчиняется шаблону +7(000)000-0000',
            email: 'E-mail выглядит как mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru'
        };
        this.errorClass = 'error-msg';
        this.form = form;
        this.valid = false;
        this._validateForm();
    }
    _validateForm(){
        let errors = [...document.getElementById(this.form).querySelectorAll(`.${this.errorClass}`)];
        for (let error of errors){
            error.remove();
        }
        let formFields = [...document.getElementById(this.form).querySelectorAll('.field')];
        for (let field of formFields){
            this._validate(field);
        }
        if(![...document.querySelectorAll('.invalid')].length){
            this.valid = true;
        }
    }
    _validate(field){
        if (this.patterns[field.name]){
            if(!this.patterns[field.name].test(field.value)){
                field.classList.add('invalid');
                this._addErrorMsg(field);
                this._watchField(field);
            }
        }

    }
    _addErrorMsg(field){
        let errMsg = document.createElement('div');
        errMsg.classList.add(this.errorClass);
        errMsg.textContent = this.errors[field.name];
        field.parentNode.appendChild(errMsg);
    }
    _watchField(field){
        field.addEventListener('input', () => {

            if (this.patterns[field.name].test(field.value)){
                field.classList.remove('invalid');
                field.classList.add('valid');
                if (field.parentNode.lastChild !== field){
                    field.parentNode.lastChild.remove();
                }
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
                if (field.parentNode.lastChild.nodeName !== 'DIV'){
                    this._addErrorMsg(field);
                }
            }

        });
    }
}
class Autocomplete{
    constructor(field){
        this.field = field;
        this._getData(field);
        this._choseItem(field);
    }
    _getData(field){
        $(`#${field}`).on('input', () => {
            let curVal = $(`#${field}`).val();
            let dataCont = $(`#${field}`).parents('label').find('.cityblock');
            $.ajax({
                url: 'cities.json',
                type: 'GET',
                dataType: 'json',
                success: (data) => {
                    if(curVal.length >= 3) {
                        dataCont.html('');
                        dataCont.addClass('active');
                        for (let item in data){
                            let matchStr = `[а-яё -]*${curVal}[а-яё -]*`;
                            let matchReg = new RegExp(matchStr, "i");
                            let result = data[item].city.match(matchReg);
                            if(result != null){
                                dataCont.append(`<div class="resultitem">${data[item].city}, ${data[item].region}</div>`);
                            }
                        }
                    } else {
                        dataCont.html('');
                        dataCont.removeClass('active');
                    }
                },
                error: (error) => {
                    console.log(error);
                }
            });


        });
    }
    _choseItem(field){
        let dataCont = $(`#${field}`).parents('label').find('.cityblock');
        dataCont.on('click', e => {
            let chosenItem = $(e.target).text();
            $(`#${field}`).val(chosenItem);
            dataCont.html('');
            dataCont.removeClass('active');
        });
    }
}