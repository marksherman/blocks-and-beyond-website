// [lyn, 2017/08/28-29]

var maxSubmissionNumber = 31;

function submitCopyrightInfo() {
    // Record request in database
    var copyrightSubmissionForm = document.getElementById("copyright_submission_form");
    // alert('copyrightSubmissionForm=' + copyrightSubmissionForm);

    // Lyn sez: I don't use FormData (even hand-rolled) because it includes crud I don't want.
    // copyrightData = new FormData(copyrightSubmissionForm);
    var copyrightJSON = validateSubmissionForm();
    if (copyrightJSON) {// Do nothing if doesn't validate
	var copyrightData = 'jsonData=' + copyrightJSON;
	//alert('copyrightData=' + copyrightData);
	var url = "http://cs.wellesley.edu/~blocks-and-beyond/cgi-bin/2017-eCF-request.cgi";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);

	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() {//Call a function when the state changes.
	    if(xhr.readyState == 4 && xhr.status == 200) {
		//alert('Request server response:' + xhr.responseText);
		//alert('Go to IEEE pages')
		copyrightSubmissionForm.submit(); //form submission
	    }
	}
	xhr.send(copyrightData);
    }
}

function confirmCopyrightSubmission() {
    // Record request in database
    var copyrightConfirmationForm = document.getElementById("copyright_confirmation_form");
    // alert('copyrightSubmissionForm=' + copyrightSubmissionForm);

    // Lyn sez: I don't use FormData (even hand-rolled) because it includes crud I don't want.
    // copyrightData = new FormData(copyrightSubmissionForm);
    var artId = validateConfirmationForm();
    if (artId) {// Do nothing if doesn't validate
	var confirmationData = 'ArtId=' + artId;
	//alert(confirmationData);
	var url = "http://cs.wellesley.edu/~blocks-and-beyond/cgi-bin/2017-eCF-confirm.cgi";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);

	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() {//Call a function when the state changes.
	    if(xhr.readyState == 4 && xhr.status == 200) {
		//alert('Request server response:' + xhr.responseText);
		alert('Thank you for confirming your submission. You may now leave this page.');
		//alert('confirmationButton: ' + document.getElementById("confirmationButton"));
		document.getElementById("confirmationButton").disabled = true;
	    }
	}
	xhr.send(confirmationData);
    }
}

function validateSubmissionForm() {
    var authName = document.getElementById("input_AuthName").value.trim();
    var authEmail = document.getElementById("input_AuthEmail").value.trim();
    var artTitle = document.getElementById("input_ArtTitle").value.trim();
    var artId = document.getElementById("input_ArtId").value.trim();
    if (authName == '') {
	alert('The author name field is empty. Please fill it out.');
	return false;
    } else if (authEmail == '') {
	alert('The author email field is empty. Please fill it out.');
	return false;
    } else if (artTitle == '') {
	alert('The submission title field is empty. Please fill it out.');
	return false;
    } else if (artId == '') {
	alert('The submission number field is empty. Please fill it out.');
	return false;
    } else if (!isDigitString(artId)) {
	alert('The submission number field must be a positive integer. Please correct it.');
    } else {
	var artNum = parseInt(artId);
        if (artNum <= 0) {
	    alert('The submission number field must be a positive integer. Please correct it.');
	} else if (artNum > maxSubmissionNumber) {
	    alert('The submission number field must be less than or equal to ' + maxSubmissionNumber + '. Please correct it.');
	} else {
	    return JSON.stringify({"AuthName": authName,
			"AuthEmail": authEmail, 
			"ArtTitle": artTitle,
			"ArtId": artId});
	}
    }
}

function validateConfirmationForm() {
    var artId = document.getElementById("input_ArtId").value.trim();
    if (artId == '') {
	alert('The submission number field is empty. Please fill it out.');
	return false;
    } else if (!isDigitString(artId)) {
	alert('The submission number field must be a positive integer. Please correct it.');
    } else {
	var artNum = parseInt(artId);
        if (artNum <= 0) {
	    alert('The submission number field must be a positive integer. Please correct it.');
	} else if (artNum > maxSubmissionNumber) {
	    alert('The submission number field must be less than or equal to ' + maxSubmissionNumber + '. Please correct it.');
	} else {
	    return artId;
	}
    }
}


function isDigitString(s) { 
    return /^\d+$/.test(s); 
}