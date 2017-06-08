window.APIBASEURL="http://192.168.1.123:8083/oceantech";
window.UPLOADFILE=APIBASEURL+"/app/base/uploadImg";
//模态框
//清空提示
$.clearGritter = function() {
	$("#gritter-notice-wrapper").html("");
};
var modalIdNo = 0;
$.modal = function(options) {
	options = options || {};
	//set default
	options.showButtonIcon = options.showButtonIcon == undefined ? true : options.showButtonIcon;
	options.showOKButton = options.showOKButton == undefined ? true : options.showOKButton;
	options.showCancelButton = options.showCancelButton == undefined ? true : options.showCancelButton;
	options.okButtonText = options.okButtonText || "确 定";
	options.cancelButtonText = options.cancelButtonText || "取 消";
	//		options.buttons = options.buttons || [{
	//			name: "确 定",
	//			class: "btn-primary",
	//			icon: "fa-check",
	//			onClick: null,
	//			isCancel: false
	//		}, {
	//			name: "取 消",
	//			icon: "fa-times",
	//			onClick: null,
	//			isCancel: true
	//		}];
	var showFooter = options.showFooter == undefined ? true : options.showFooter;
	modalIdNo++;
	var modalId = "cModal" + modalIdNo;
	var modalDoc = $("<div id=\"" + modalId + "\" class=\"modal fade\" role=\"dialog\"><div class=\"modal-dialog modal-sm\" style=\"margin-top:" + ($(window).height() / 4) + "px;\"></div></div>");
	var modalContentDoc = $("<div class=\"modal-content\"></div>");
	var modalHeaderDoc = $("<div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span class='modal-close-icon' aria-hidden=\"true\">关闭</span></button><h4 class=\"modal-title\">系统提示</h4></div>");
	var modalBodyDoc = $("<div class=\"modal-body\"></div>");
	$(modalContentDoc).append(modalHeaderDoc);
	$(modalContentDoc).append(modalBodyDoc);
	$(modalDoc).find(".modal-dialog").append(modalContentDoc);
	//按钮相关
	var okCallbackDelegate, cancelCallbackDelegate;
	var modalFooterDoc = $("<div class=\"modal-footer\"></div>");
	//自定义按钮
	var btnClickEvents = [];
	for(var i in options.buttons) {
		var currBtn = options.buttons[i];
		var currBtnDom = $("<button data-btn-index=\"" + i + "\" type=\"button\" class=\"btn\" style=\"background-color:#ca192b!important;border:0px!important\"></button>");
		currBtn.class = currBtn.class || "btn-default";
		currBtnDom.text(currBtn.name);
		if(currBtn.class) {
			currBtnDom.addClass(currBtn.class).addClass("def-" + currBtn.class);
		}
		if(currBtn.icon) {
			currBtnDom.append("&nbsp;<i class='fa " + currBtn.icon + "'></i>");
			currBtnDom.append(currBtn.name + "&nbsp;");
		}
		if(currBtn.isCancel) {
			currBtnDom.attr("data-dismiss", "modal");
		}
		btnClickEvents.push(currBtn.onClick);
		$(currBtnDom).click(function() {
			var currClickEvent = btnClickEvents[$(this).data("btn-index")];
			currClickEvent && currClickEvent(modalDoc);
		});
		$(modalFooterDoc).append(currBtnDom);
	}
	if(options.showOKButton && options.showOKButton != "false") {
		//var modelBtnOk = $("<button type=\"button\" class=\"btn btn-sm btn-primary\">&nbsp;<i class='fa fa-check'></i>" + options.okButtonText + "&nbsp;</button>");
		var modelBtnOk = $("<a class=\"btn btn-danger def-btn-danger modal-btnOk-container\">" + options.okButtonText + "</a>");
		$(modelBtnOk).click(function() {
			okCallbackDelegate && okCallbackDelegate(modalDoc);
		});
		$(modalFooterDoc).append(modelBtnOk);
	}
	if(options.showCancelButton) {
		//var modelBtnCancel = $("<button type=\"button\" class=\"btn btn-sm btn-default\" data-dismiss=\"modal\">&nbsp;<i class='fa fa-times'></i>" + options.cancelButtonText + "&nbsp;</button>");
		var modelBtnCancel = $("<a class=\"btn btn-primary def-btn-primary modal-btnCancel-container\" data-dismiss=\"modal\">" + options.cancelButtonText + "</a>");
		//var modelBtnCancel = $("<button class=\"btn btn-sm btn-default modal-btnCancel-container\">" + options.cancelButtonText + "</button>");
		$(modelBtnCancel).click(function() {
			cancelCallbackDelegate && cancelCallbackDelegate(modalDoc);
		});
		$(modalFooterDoc).append(modelBtnCancel);
	}
	if(!options.showButtonIcon) {
		$(modalFooterDoc).find("i.fa").remove();
	}
	if(showFooter)
		$(modalDoc).find(".modal-content").append(modalFooterDoc);
	//$("body").append(modalDoc);
	//destroy
	$(modalDoc).on('hidden.bs.modal', function(e) {
		$(this).remove();

		if(options.closeCallback) {
			options.closeCallback.call(this, null);
		}
	});
	$(modalDoc).on('show.bs.modal', function(e) {
		//清除提示框
		$.clearGritter();
	});
	//加载完成
	$(modalDoc).on('shown.bs.modal', function(e) {
		if(options.shownCallback) {
			options.shownCallback.call(this, modalId);
		}
	});
	//关闭完成
	$(modalDoc).on('hidden.bs.modal', function(e) {
		if($("div[id*='cModal']").length == 0) {
			$("body").css("padding-right", "");
			$("body").removeClass("modal-open");
		}
		//$.clearGritter();
	});

	modalDoc.alert = function(text) {
		$(this).find(".modal-body").text(text);
		$(this).modal('show');
		$("body").append(modalDoc);
	};
	modalDoc.confirm = function(text, okCallback, cancelCallback) {
		okCallbackDelegate = function() {
			okCallback(modalDoc);
			modalDoc.modal("hide");
		};
		cancelCallbackDelegate = cancelCallback;

		$(this).find(".modal-body").text(text);
		//remove header
		$(this).find(".modal-header").remove();

		$(this).modal({
			backdrop: "static",
			show: true
		});
		modalDoc.addClass("confirm-modal");
		$("body").append(modalDoc);
	};
	modalDoc.show = function(title, contentContainer, okCallback, cancelCallback) {
		okCallbackDelegate = okCallback;
		cancelCallbackDelegate = cancelCallback;
		$(modalDoc).find(".modal-dialog").removeClass("modal-sm").addClass("modal-normal").attr("style", "");
		if(options.width)
			$(modalDoc).find(".modal-dialog").css("width", options.width + "px");
		$(this).find(".modal-title").text(title);
		$(this).find(".modal-body").append($(contentContainer).html()).css("max-height", options.height ? options.height : ($(window).height() - 180).toString() + "px").css("overflow", "auto")
		if(options.height) $(this).find(".modal-body").css("height", options.height + "px");
		//remove header
		//$(this).find(".modal-header").remove();

		$(this).modal({
			backdrop: "static",
			show: true
		});
		$("body").append(modalDoc);

		inputLimit();

		return modalId;
	};
	modalDoc.showOfMini = function(title, contentContainer, okCallback, cancelCallback) {
		okCallbackDelegate = okCallback;
		cancelCallbackDelegate = cancelCallback;

		$(this).find(".modal-dialog").removeClass("modal-sm").addClass("modal-mini").attr("style", "").css("width", "420px");
		$(this).find(".modal-title").text(title);
		$(this).find(".modal-body").append($(contentContainer).html()).css("max-height", ($(window).height() - 180).toString() + "px").css("overflow", "auto");
		//remove header
		//$(this).find(".modal-header").remove();

		$(this).modal({
			backdrop: "static",
			show: true
		});
		$("body").append(modalDoc);

		inputLimit();

		return modalId;
	};
	modalDoc.showOfLarge = function(title, contentContainer, okCallback, cancelCallback) {
		okCallbackDelegate = okCallback;
		cancelCallbackDelegate = cancelCallback;

		$(this).find(".modal-dialog").removeClass("modal-sm").addClass("modal-large").attr("style", "").css("width", (options.width || 900) + "px");
		$(this).find(".modal-title").text(title);
		$(this).find(".modal-body").append($(contentContainer).html()).css("max-height", ($(window).height() - 180).toString() + "px").css("overflow", "auto");
		//remove header
		//$(this).find(".modal-header").remove();

		$(this).modal({
			backdrop: "static",
			show: true
		});
		$("body").append(modalDoc);

		inputLimit();

		return modalId;
	};
	modalDoc.showOfAuto = function(title, contentContainer, okCallback, cancelCallback) {
		okCallbackDelegate = okCallback;
		cancelCallbackDelegate = cancelCallback;
		$(this).find(".modal-dialog").removeClass("modal-sm").addClass("modal-mini").attr("style", "").css({
			width: "auto",
			margin: "10px"
		});
		$(this).find(".modal-title").text(title);
		$(this).find(".modal-body").append($(contentContainer).html()).css("max-height", ($(window).height() - 65).toString() + "px").css("overflow", "auto");
		//remove header
		//$(this).find(".modal-header").remove();

		$(this).modal({
			backdrop: "static",
			show: true
		});
		$("body").append(modalDoc);

		inputLimit();

		if($("#" + modalId + " ul[role='tablist']").length > 0) {
			$("#" + modalId + " ul[role='tablist'] a[role='tab']").click(function() {
				$("#" + modalId + " div[role='tabpanel']").removeClass("active");
				$("#" + modalId + " div[role='tabpanel']#" + $(this).attr("aria-controls")).addClass("active");
			});
		}

		return modalId;
	};
	modalDoc.open = function(title, path) {
		$(this).find(".modal-dialog").removeClass("modal-sm");
		$(this).find(".modal-title").text(title + " （正在打开...）");
		$(this).find(".modal-body").append("<iframe frameborder=\"0\" width=\"100%\" height=\"500\" scrolling=\"auto\" src=\"" + path + "\"></iframe>");
		$(this).modal('show');
		$("body").append(modalDoc);
		var cModal = $(this);
		$(cModal).find(".modal-body iframe").on("load", function() {
			$(cModal).find(".modal-title").text(title);
		});
	};
	modalDoc.openOfAuto = function(title, path) {
		$(this).find(".modal-dialog").removeClass("modal-sm").attr("style", "").css({
			width: "auto",
			margin: 0
		});
		$(this).find(".modal-title").text(title);
		$(this).find(".modal-body").append("<iframe frameborder=\"0\" width=\"100%\" height=\"100%\" scrolling=\"auto\" src=\"" + path + "\"></iframe>");
		$(this).find(".modal-body").css("max-height", ($(window).height() - 180).toString() + "px").css("overflow", "auto");

		$(this).modal({
			backdrop: "static",
			show: true
		});
		$("body").append(modalDoc);

		return modalId;
	};

	return modalDoc;
};

/*
 * 录入限制
 * */
function inputLimit() {
	$("input[data-type]").keyup(function() {
		//光标
		var pos = getTxtCursorPosition($(this)[0]);

		var cObj = this;
		//type
		var typeVal = $(cObj).attr("data-type");
		var typeValArr = typeVal.split("|");
		var type = typeValArr[0];
		var isInt = type == "int";
		var isFloat = type == "float";
		if(!isInt && !isFloat) {
			return false;
		}
		//		var maxVal = typeValArr[1],
		//			minVal = typeValArr[2],
		var pointLength = parseInt(typeValArr[1]);
		if(!pointLength || isNaN(pointLength)) {
			pointLength = 2;
		}
		//value
		var oval = $(cObj).attr("oval");
		var cval = $(cObj).val().replace(/e/g, "").replace(/\s/g, "");
		if(isInt)
			cval = cval.replace(".", "");
		if(!oval && isNaN(cval)) {
			$(cObj).val("");
			//光标
			setTxtCursorPosition($(this)[0], pos - 1);
			return false;
		}
		if(oval && !cval) {
			$(cObj).val("");
			$(cObj).attr("oval", "");
			//光标
			setTxtCursorPosition($(this)[0], pos - 1);
			return false;
		}
		if(oval && (!cval || isNaN(cval))) {
			$(cObj).val(oval);
			//光标
			setTxtCursorPosition($(this)[0], pos - 1);
			return false;
		}
		//fix
		if(isFloat) {
			cval = (cval).replace(/^(.*\..{2}).*$/, "$1");
		}
		$(cObj).val(cval);
		$(cObj).attr("oval", cval);
		//光标
		setTxtCursorPosition($(this)[0], pos);
		//for IE bug
		$(this).trigger("change");
	});
	$("input[data-type]").each(function() {
		$(this).attr("oval", $(this).val());
	});
}
/*
 *ajax 扩展  
 * */
$.ajaxPost = function(url, data, successcallback, errorcallback) {
	$.ajaxBase("POST", url, data, successcallback, errorcallback);
};
$.ajaxPatch = function(url, data, successcallback, errorcallback) {
	$.ajaxBase("PATCH", url, data, successcallback, errorcallback);
};
$.ajaxGet = function(url, successcallback, errorcallback) {
	$.ajaxBase("GET", url, null, successcallback, errorcallback);
};
$.ajaxPut = function(url, data, successcallback, errorcallback) {
	$.ajaxBase("PUT", url, data, successcallback, errorcallback);
};
$.ajaxByAction = function(action, url, data, successcallback, errorcallback) {
	$.ajaxBase(action == "add" ? "POST" : "PUT", url, data, successcallback, errorcallback);
};
$.ajaxDelete = function(url, data, successcallback, errorcallback) {
	$.ajaxBase("DELETE", url, data, successcallback, errorcallback);
};
$.ajaxBase = function(type, url, data, successcallback, errorcallback) {
	//IE
	if(!$.support.cors)
		$.support.cors = true;

	//AJAX超时s，0-不超时
	var tmp_timeout = 30000;
	data.userId = getCookie("userId");
	$aj = $.ajax({
		type: (type == "GET" ? "GET" : "POST"),
		url: url,
		//30s
		timeout: tmp_timeout,
		data: data,
		//contentType: (type == "GET" ? "text/plain" : "application/json"),
		dataType: "json",
		complete: function(XMLHttpRequest, status) {
			if(status == 'timeout') {
				alert("请求超时。");
				$aj.abort();
			}　　
		},
		success: function(response) {
			if(response.code > 0) {
				//$.processFailResponse(response);
			}
			if(successcallback)
				successcallback(response);

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if(errorcallback)
				errorcallback(textStatus, errorThrown);
			else {
				alert("服务器返回错误：" + textStatus);
			}
		}
	});
};

$.getQueryObject = function(url) {
	url = url || window.location.href;
	var search = url.substring(url.lastIndexOf("?") + 1);
	var obj = {};
	var reg = /([^?&=]+)=([^?&=]*)/g;
	search.replace(reg, function(rs, $1, $2) {
		var name = decodeURIComponent($1);
		var val = decodeURIComponent($2);
		val = String(val);
		obj[name] = val;
		return rs;
	});
	return obj;
};

function Controller(container, callback) {
	var models = {};
	var views = Array.prototype.slice.call(document.querySelectorAll((container || '') + ' [bind]'), 0);
	views.forEach(function(view) {
		var modelName = view.getAttribute('bind');
		//新增多级对象 data.user.name
		if(modelName.indexOf(".") > 0) {
			var modelNameArr = modelName.split(".");
			var modelObj = models[modelNameArr[0]];
			if(!modelObj) {
				models[modelNameArr[0]] = new Model();
				modelObj = models[modelNameArr[0]];
			}
			modelObj.bind(view);
		} else {
			(models[modelName] = models[modelName] || new Model()).bind(view);
		}
	});
	if(callback)
		callback.call(this, models);

	//return JSON object
	this.getJSON = function() {
		var resJson = {};
		for(var p in models) {
			if(p.indexOf("__") == 0) {
				continue;
			}
			if(typeof(models[p]) == "object") {
				resJson[p] = models[p]._value;
			}
		}
		return resJson;
	};

	//set value
	this.set = function(model, callback) {
		for(p in model) {
			if(!p || p == "") {
				continue;
			}
			if(!models[p]) {
				models[p] = models[p] || new Model();
			}
			models[p].set(model[p], callback);
		}
		if(callback) callback();
		return models;
	};
	//return models;
}

function Model(value) {
	this._value = typeof value === 'undefined' ? '' : value;
	this._listeners = [];
}
Model.prototype.set = function(value) {
	var self = this;
	self._value = value;
	//setTimeout(function() {
	self._listeners.forEach(function(listener) {
		listener.call(self, value);
	});
	//});
};
Model.prototype.watch = function(listener) {
	this._listeners.push(listener);
};
Model.prototype.bind = function(node) {
	this.watch(function(value) {
		var bindName = node.getAttribute("bind");
		//新增多级对象 data.user.name
		if(bindName.indexOf(".") > 0) {
			var bindNameArr = bindName.split(".");
			for(var i = 1; i < bindNameArr.length; i++) {
				if(!value) {
					break;
				}
				value = value[bindNameArr[i]];
			}
		}
		//设置值到页面     
		var tagName = node.tagName;
		if(tagName == "INPUT" || tagName == "SELECT") {
			var typeName = node.getAttribute("type");
			if(typeName == "checkbox") {
				node.checked = value;
			} else if(typeName == "radio") {
				var radioes = document.getElementsByName(node.name);
				for(var i = 0; i < radioes.length; i++) {
					radioes[i].checked = (radioes[i].value == value);
				}
			} else {
				node.value = value;
			}
		} else {
			node.innerHTML = value;
		}
	});

	//listen change event
	var mPrototype = this;
	if(node) {
		mPrototype._value = node.value;
		node.onchange = function() {
			var typeName = this.getAttribute("type");
			var currNodeIsCheckbox = typeName == "checkbox";
			var bindName = this.getAttribute("bind");
			var newValue = currNodeIsCheckbox ? this.checked : this.value;

			//新增多级对象 data.user.name
			if(bindName.indexOf(".") > 0) {
				mPrototype._value = mPrototype._value || {};
				var oldValue = mPrototype._value;
				var bindNameArr = bindName.split(".");
				if(bindNameArr.length == 2) {
					oldValue[bindNameArr[1]] = newValue;
				} else if(bindNameArr.length == 3) {
					oldValue[bindNameArr[1]][bindNameArr[2]] = newValue;
				}
			} else {
				mPrototype._value = newValue;
			}
		}
		//		node.addEventListener("change", function() {
		//			var typeName = this.getAttribute("type");
		//			if (typeName == "checkbox") {
		//				mPrototype._value = this.checked;
		//			} else
		//				mPrototype._value = this.value;
		//				
		//				alert(this.value);
		//		});
	}
};
//表单输入验证
function inputValidateForGritter(container, positionclass) {
	container = container || "body";
	var inputRes = true;
	$(container + " [nulltip]," + container + " [valitype]").each(function() {
		var cValue = $(this).val();
		//ie
		if($(this).attr("placeholder") == cValue)
			cValue = null;
		if(!cValue) {
			var nulltip = $(this).attr("nulltip");
			if(!nulltip)
				return true;

			$.clearGritter();
			alert("{N} 不能为空，请输入。".replace(/{N}/g, nulltip));
			$(this).focus();
			inputRes = false;
			return false;
		} else {
			var nulltip = $(this).attr("nulltip");
			var valitype = $(this).attr("valitype");
			var tipTxt = "";
			if(valitype == "mobile") {
				inputRes = mobileValidate(cValue);
				tipTxt = "手机号码格式有误，请检查，<br>（如：13883000000）";
			} else if(valitype == "email") {
				inputRes = emailValidate(cValue);
				tipTxt = "邮箱格式有误，请检查，<br>（如：name@baidu.com）";
			} else if(valitype == "password") {
				var rangeArr = $(this).attr("valirange").split('-');
				if(cValue.length > parseInt(rangeArr[1]) || cValue.length < parseInt(rangeArr[0])) {
					inputRes = false;
				}
				tipTxt = $(this).attr("valitip");
			} else if(valitype == "url") {
				inputRes = urlValidate(cValue);
				tipTxt = "网络地址有误，请检查，<br>（如：http://t.cn）";
			} else if(valitype == "tel") {
				inputRes = telValidate(cValue);
				tipTxt = nulltip + "号码有误，请检查，<br>（如：023-8666666、98988888）";
			}
			if(!inputRes) {
				$.clearGritter();
				alert(tipTxt);
				//				$.showErrorGritter(tipTxt, {
				//					time: 3000,
				//					position: positionclass
				//				});
				$(this).focus();
				return false;
			}
		}
	});
	return inputRes;
}

function setCookie(name, value) {
	var argv = setCookie.arguments;
	var argc = setCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	if(expires != null) {
		var LargeExpDate = new Date();
		LargeExpDate.setTime(LargeExpDate.getTime() + (expires * 1000 * 3600 * 24));
	}
	document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + LargeExpDate.toGMTString()));
}

function getCookie(Name) {
	var search = Name + "="
	if(document.cookie.length > 0) {
		offset = document.cookie.indexOf(search)
		if(offset != -1) {
			offset += search.length
			end = document.cookie.indexOf(";", offset)
			if(end == -1) end = document.cookie.length
			return unescape(document.cookie.substring(offset, end))
		} else return ""
	}
}

function deleteCookie(name) {
	var expdate = new Date();
	expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
	setCookie(name, "", expdate);
}
//清除全部cookie
function clearCookie() {
	var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
	if(keys) {
		for(var i = keys.length; i--;)
			document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
	}
}

function getUserIdentity(level) {
	//获取身份中文
	var identityAry = ['客户', '专家', '供应商', '商务', '生产', '采购', '财务', '审核', '审核', '审核', '审核', '审核'];
	if(level) {
		return identityAry[parseInt(level) - 1];
	} else {
		return '无';
	}
}
//退出
function loginOut() {
	clearCookie();
	window.location.href = "login.html";
}
//判断是否过期
function isLoginOut() {
	var userId = getCookie("userId");
	if(!userId) {
		loginOut();
		alert("您的登录已过期!");
	}
}

function getUserInfo() {
	if(window.location.href.indexOf("login") == -1)
		isLoginOut();
	var name = getCookie("username");
	var role = getCookie("urole");
	$(".user-name").text(name + "(" + getUserIdentity(role) + ")");
}
$(function() {
	getUserInfo();
});