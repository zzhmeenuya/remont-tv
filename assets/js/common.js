$(function(){

	// SCROLL TO CALLBACK
	$('.contact-phone-callback').on('click', function (e) {
		e.preventDefault();
		let sectionLink = $(this).attr('href');
		let sectionOffsetTop = $(sectionLink).offset().top;
		let offset = 0;
		$('html, body').animate({
			scrollTop: sectionOffsetTop - offset
		}, 1000);


		$('.section-cost__title').html('Заказать обратный звонок');
		$('.form-cost input[name="subject"]').val('');
	});
	// SCROLL TO CALLBACK -END
	
	// form header agree
	const labelFormHeaderAgree = $('label[for="form-header__agree"]');
	const btnFromHeader = $('.form-header__input-btn input[type="submit"]');

	labelFormHeaderAgree.on('click', function(){
		if( !$(this).prev('#form-header__agree').prop("checked") ){
			btnFromHeader.removeClass('off');
		}else{
			btnFromHeader.addClass('off');
		}
	});
	// -END

	// ВАЛИДАЦИЯ ФОРМЫ (вверхняя форма)
	$(".form-header").on('submit', function () {
		var th = $(this);
		let form = $(".form-header");
		let inputInfo = form.find('.form-header__input-info');
		let inputName = form.find('input[name="name"]');
		let inputPhone = form.find('input[name="phone"]');
		let inputProblem = form.find('textarea[name="problem"]');
		let formInfo = form.find('.form-header__info');
		let formBtnSubmit = form.find('input[type="submit"]');
		var fail = false;

		// (func) подбирает регулярное выражение по имени
		function relesFunc(name, el) {
			if (name == 'name') {
				var regn = /^[a-zA-Zа-яёА-ЯЁ]{2,30}$/i;
				return regn.test(el.val());
			}
			if (name == 'phone') {
				var regp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
				return regp.test(el.val());
			}
			if (name == 'text') {
				var regp = /^[a-zA-Zа-яёА-ЯЁ]{10,300}$/i;
				return regp.test(el.val());
			}
		}
		// (func) проверяет по регулярым выражения
		function validateRegExp(varName, relesName, errorText1, errorText2) {
			if (!varName.val()) {
				varName.addClass('error');
				fail = true;
				varName.closest('.input-group').find('.input-info').html(errorText1);
			} else if (!relesFunc(relesName, varName)) {
				varName.addClass('error');
				fail = true;
				varName.closest('.input-group').find('.input-info').html(errorText2);
			} else {
				varName.removeClass('error');
				varName.addClass('success');
				varName.closest('.input-group').find('.input-info').html('');
			}
		}

		//  очищает прошлое сообщение
		formInfo.html('');
		formBtnSubmit.val('Отправка').addClass('disabled-btn');
		inputInfo.html('');

		if( !$('#form-header__agree').prop("checked") ){
			fail = true;
			console.log('вы не согласны!');
		}

		// проверка полей
		validateRegExp(inputName, 'name', 'Обязательное поле! <span>*</span>', 'Некоректное Имя <span>*</span>');
		validateRegExp(inputPhone, 'phone', 'Обязательное поле! <span>*</span>', 'Некоректный телефон <span>*</span>');
		validateRegExp(inputProblem, 'text', 'Обязательное поле! <span>*</span>', 'Некоректный или короткий текст <span>*</span>');

		// вывод ошибки на экран
		if (fail) {
			formInfo.removeClass('info_acces');
			formInfo.addClass('info_error');
			formInfo.html('<p>Ошибка отправки формы, проверте поля на правильность. <span>*</span></p>');
			formBtnSubmit.val('Узнать стоимость ремонта').removeClass('disabled-btn');
			return false;
		} else {
			form.find('input').attr('readonly', '');
			formBtnSubmit.attr('readonly', '');
		}

		// отправка формы
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function(response) {
			console.log(response);
			if( response === 'access' ){

				// уберает показ ошибок
				form.find('input').removeClass('error success');
				formInfo.html('');
				// показывает сообщение успешной отправки
				formInfo.removeClass('info_error');
				formInfo.addClass('info_acces');
				setTimeout(function () {
					formInfo.html('<p>Форма успешно отправлена, спасибо. В ближайшее время мы с Вами свяжемся.</p>');
					formBtnSubmit.val('Узнать стоимость ремонта').removeClass('disabled-btn');
					form.find('input').removeAttr('readonly');
					formBtnSubmit.removeAttr('readonly');
					th.trigger("reset");
					// $('#form-cost__agree').prop('checked', true);
					$('.form-header__input-btn input[type=submit]').addClass('off');
				}, 5000);
			}else{

				// уберает показ ошибок
				form.find('input').removeClass('error success');
				formInfo.html('');
				// показывает сообщение успешной отправки
				formInfo.removeClass('info_acces');
				formInfo.addClass('info_error');
				setTimeout(function () {
					formInfo.html('<p>Ошибка отправки формы!<span>*</span></p>');
					formBtnSubmit.val('Узнать стоимость ремонта').removeClass('disabled-btn');
					form.find('input').removeAttr('readonly');
					formBtnSubmit.removeAttr('readonly');
					th.trigger("reset");
					$('#form-header__agree').prop('checked', true);
				}, 800);
			}
		}).fail(function(response) {
			console.log(response);
			// уберает показ ошибок
			form.find('input').removeClass('error success');
			formInfo.html('');
			// показывает сообщение ошибки отправки
			formInfo.removeClass('info_acces');
			formInfo.addClass('info_error');
			setTimeout(function () {
				formInfo.html('<p>Ошибка отправки формы на сервер! Отправьте заявку позже. Приносим свои извинения. <span>*</span></p>');
				formBtnSubmit.val('Узнать стоимость ремонта').removeClass('disabled-btn');
				form.find('input').removeAttr('readonly');
				formBtnSubmit.removeAttr('readonly');
				th.trigger("reset");
				$('#form-header__agree').prop('checked', true);
			}, 800);
		});
		return false;
	});
	//ВАЛИДАЦИЯ ФОРМЫ (вверхняя форма) -END















	// form const agree
	const labelFormCostAgree = $('label[for="form-cost__agree"]');
	const btnFromCost = $('.form-cost__input-btn input[type="submit"]');

	labelFormCostAgree.on('click', function(){
		if( !$(this).prev('#form-cost__agree').prop("checked") ){
			btnFromCost.removeClass('off');
		}else{
			btnFromCost.addClass('off');
		}
	});
	// -END


	// ВАЛИДАЦИЯ ФОРМЫ (нижняя форма)
	$(".form-cost").on('submit', function () {
		var th = $(this);
		let form = $(".form-cost");
		let inputInfo = form.find('.form-cost__input-info');
		let inputName = form.find('input[name="name"]');
		let inputPhone = form.find('input[name="phone"]');
		let formInfo = form.find('.form-cost__info');
		let formBtnSubmit = form.find('input[type="submit"]');
		var fail = false;

		// (func) подбирает регулярное выражение по имени
		function relesFunc(name, el) {
			if (name == 'name') {
				var regn = /^[a-zA-Zа-яёА-ЯЁ]{2,30}$/i;
				return regn.test(el.val());
			}
			if (name == 'phone') {
				var regp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
				return regp.test(el.val());
			}
			if (name == 'text') {
				var regp = /^[a-zA-Zа-яёА-ЯЁ]{10,300}$/i;
				return regp.test(el.val());
			}
		}
		// (func) проверяет по регулярым выражения
		function validateRegExp(varName, relesName, errorText1, errorText2) {
			if (!varName.val()) {
				varName.addClass('error');
				fail = true;
				varName.closest('.input-group').find('.input-info').html(errorText1);
			} else if (!relesFunc(relesName, varName)) {
				varName.addClass('error');
				fail = true;
				varName.closest('.input-group').find('.input-info').html(errorText2);
			} else {
				varName.removeClass('error');
				varName.addClass('success');
				varName.closest('.input-group').find('.input-info').html('');
			}
		}

		//  очищает прошлое сообщение
		formInfo.html('');
		formBtnSubmit.val('Отправка').addClass('disabled-btn');
		inputInfo.html('');

		if( !$('#form-cost__agree').prop("checked") ){
			fail = true;
			console.log('вы не согласны!');
		}

		// проверка полей
		validateRegExp(inputName, 'name', 'Обязательное поле! <span>*</span>', 'Некоректное Имя <span>*</span>');
		validateRegExp(inputPhone, 'phone', 'Обязательное поле! <span>*</span>', 'Некоректный телефон <span>*</span>');

		// вывод ошибки на экран
		if (fail) {
			formInfo.removeClass('info_acces');
			formInfo.addClass('info_error');
			formInfo.html('<p>Ошибка отправки формы, проверте поля на правильность. <span>*</span></p>');
			formBtnSubmit.val('Узнать стоимость ремонта').removeClass('disabled-btn');
			return false;
		} else {
			form.find('input').attr('readonly', '');
			formBtnSubmit.attr('readonly', '');
		}

		// отправка формы
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function(response) {
			console.log(response);
			if( response === 'access' ){

				// уберает показ ошибок
				form.find('input').removeClass('error success');
				formInfo.html('');
				// показывает сообщение успешной отправки
				formInfo.removeClass('info_error');
				formInfo.addClass('info_acces');
				setTimeout(function () {
					formInfo.html('<p>Форма успешно отправлена, спасибо. В ближайшее время мы с Вами свяжемся.</p>');
					formBtnSubmit.val('Узнать стоимость ремонта').removeClass('disabled-btn');
					form.find('input').removeAttr('readonly');
					formBtnSubmit.removeAttr('readonly');
					th.trigger("reset");
					// $('#form-cost__agree').prop('checked', true);
					$('.form-cost__input-btn input[type=submit]').addClass('off');
				}, 800);
			}else{

				// уберает показ ошибок
				form.find('input').removeClass('error success');
				formInfo.html('');
				// показывает сообщение успешной отправки
				formInfo.removeClass('info_acces');
				formInfo.addClass('info_error');
				setTimeout(function () {
					formInfo.html('<p>Ошибка отправки формы!<span>*</span></p>');
					formBtnSubmit.val('Узнать стоимость ремонта').removeClass('disabled-btn');
					form.find('input').removeAttr('readonly');
					formBtnSubmit.removeAttr('readonly');
					th.trigger("reset");
					$('#form-cost__agree').prop('checked', true);
				}, 800);
			}
		}).fail(function(response) {
			console.log(response);
			// уберает показ ошибок
			form.find('input').removeClass('error success');
			formInfo.html('');
			// показывает сообщение ошибки отправки
			formInfo.removeClass('info_acces');
			formInfo.addClass('info_error');
			setTimeout(function () {
				formInfo.html('<p>Ошибка отправки формы на сервер! Отправьте заявку позже. Приносим свои извинения. <span>*</span></p>');
				formBtnSubmit.val('Узнать стоимость ремонта').removeClass('disabled-btn');
				form.find('input').removeAttr('readonly');
				formBtnSubmit.removeAttr('readonly');
				th.trigger("reset");
				$('#form-cost__agree').prop('checked', true);
			}, 800);
		});
		return false;
	});
	//ВАЛИДАЦИЯ ФОРМЫ (нижняя форма) -END










});
