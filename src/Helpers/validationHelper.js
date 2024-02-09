import moment from "moment";

const isEmptyString = (text) => /^ *$/.test(text);

const isValidLength = (text, min, max) => {
  if (min && text.length < min) {
    return false;
  }
  if (max && text.length > max) {
    return false;
  }
  return true;
};

const isAllCharAreSame = (text) => {
  const stripText = text.replace(/[ -]/g, "");
  if (stripText.length > 0) {
    const firstChar = stripText[0];
    const charCounts = (stripText.match(new RegExp(firstChar, "g")) || [])
      .length;
    return charCounts === stripText.length;
  }

  return false;
};

const validateMailId = (mailId, field) => {
  if (isEmptyString(mailId)) {
    return "validation.required";
  }
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      mailId
    )
  ) {
    return "validation.email_suggestion";
  }
  return "";
};

const validateBankName = (bankName) => {
  if (isEmptyString(bankName)) {
    return "validation.required";
  }
  if (!isValidLength(bankName, 10, 30)) {
    return "validation.err_max100_char";
  }
  return "";
};

const validateMobileNo = (mobile, fieldName = "Phone Number") => {
  if (isEmptyString(mobile)) {
    return "validation.required";
  }

  if (!mobile) {
    return "";
  }

  const regex = /^\+?\d{1,3}[-.\s]?\(?(\d{3})\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

  if (!regex.test(mobile)) {
    return "validation.invalid_input";
  }

  if (mobile.length < 3 || mobile.length > 14) {
    return "validation.invalid_input";
  }
  return "";
};

const validateCountryCode = (contryCode) => {
  if (isEmptyString(contryCode)) {
    return "validation.required";
  }
  if (!/^(\+\d{2,3})$/.test(contryCode)) {
    return "validation.invalid_input";
  }
  return "";
};

const validateEmiratesId = (text) => {
  if (isEmptyString(text)) {
    return "validation.required";
  }
  if (!/^784-[0-9]{4}-[0-9]{7}-[0-9]{1}$/.test(text)) {
    return "Emirates Id must be in 784-xxxx-xxxxxxx-x.";
  }
  return "";
};

const validateDate = (text) => {
  if (isEmptyString(text) || !text) {
    return "validation.required";
  }
  return "";
};

const validateAccomodation = (text) => {
  if (text === 0) {
    return "validation.required";
  }
  return "";
};

const validateOnlyDate = (text, fieldName) => {
  if (isEmptyString(text)) {
    return "validation.required";
  }
  return "";
};

const validateCard = (text) => {
  if (!/^([0-9a-zA-Z]{4}[- ]?){3}[0-9a-zA-Z]{4}$/.test(text)) {
    return "validation.invalid_input";
  }
  return "";
};

const validateMemberId = (text) => {
  if (
    !/^[0-9a-zA-Z]{4}[- ]?[0-9a-zA-Z]{3}[- ]?[0-9a-zA-Z]{9}[- ]?[0-9a-zA-Z]{2}$/.test(
      text
    )
  ) {
    return "validation.invalid_input";
  }

  if (isAllCharAreSame(text)) {
    return "validation.invalid_input";
  }

  return "";
};

const validateTrafficFileNumber = (text) => {
  if (!/^[0-9a-zA-Z]*$/.test(text)) {
    return "validation.invalid_input";
  }
  if (text.length < 5 || text.length > 15) {
    return "Traffic file number must contain min 5 and max 15 characters.";
  }
  return "";
};

const validateTCFNumber = (text) => {
  if (!/^[0-9a-zA-Z]*$/.test(text)) {
    return "validation.invalid_input";
  }
  if (text.length < 5 || text.length > 15) {
    return "TCF number must contain min 5 and max 15 characters.";
  }
  return "";
};

const validateName = (text, fieldName) => {
  if (isEmptyString(text) || !text) {
    return "validation.required";
  }

  const regex = /^[a-zA-Z\s]*$/;
  if (!regex.test(text)) {
    return "validation.invalid_input";
  }
  if (text.length > 100) {
    return "validation.err_max100_char";
  }
  return "";
};

const passwordDictionary = [
  "password",
  "123456",
  "1234567890",
  "123",
  // Add more common passwords here
];

const validateResetPassword = (password, first_name, last_name) => {
  if (!password) {
    return "";
  }

  if (password.length < 8) {
    return "validation.min_password_length_8chars";
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

  if (!passwordRegex.test(password)) {
    return "validation.password_contains_err";
  }

  // Check if password is in dictionary
  if (passwordDictionary.includes(password.toLowerCase())) {
    return "validation.common_password";
  }

  if (
    password.toLowerCase().includes(first_name.toLowerCase()) ||
    password.toLowerCase().includes(last_name.toLowerCase())
  ) {
    return "validation.password_fname_lname";
  }

  return "";
};

const validateFee = (text, fieldName) => {
  if (isEmptyString(text)) {
    return "validation.required";
  }

  if (Number(text) <= 0) {
    return `Please enter value greater than 0`;
  }
  return "";
};

const validateDropdown = (text, fieldName) => {
  if (isEmptyString(text) || !text) {
    return "validation.required";
  }
  return "";
};

const validateLandline = (landline, isNonUAE) => {
  if (!/^[0-9]*$/.test(landline)) {
    return "Only numbers are allowed.";
  }
  if (landline.length > 0 && landline.length !== 9) {
    return "Landline number must be 9 digit.";
  }
  return "";
};

const validateAlternateNo = (mobile, isNonUAE) => {
  if (!/^[0-9]*$/.test(mobile)) {
    return "Only numbers are allowed.";
  }
  if (mobile.length > 0 && mobile.length !== 9) {
    return "Alternate number must be 9 digit.";
  }
  return "";
};

const validatePOBox = (pobox) => {
  if (isEmptyString(pobox)) {
    return "validation.required";
  }
  if (!/^[0-9]*$/.test(pobox)) {
    return "Only numbers are allowed.";
  }
  if (pobox.length !== 6) {
    return "PO BOX number must be 6 digit.";
  }
  return "";
};

const validateBankAccountNumber = (bankAccountNumber) => {
  if (isEmptyString(bankAccountNumber)) {
    return "validation.required";
  }
  if (!/^[0-9]*$/.test(bankAccountNumber)) {
    return "Only numbers are allowed.";
  }
  return "";
};

const validateWithdrawnBankName = (bankName) => {
  if (isEmptyString(bankName)) {
    return "validation.required";
  }
  if (!/^[a-zA-Z0-9]*$/.test(bankName)) {
    return "Only Alpha numerics are allowed.";
  }
  if (bankName.length > 50) {
    return "For bank name maximum of 50 characters will be allowed.";
  }
  return "";
};

const validateBankBranchNaame = (branchname) => {
  if (isEmptyString(branchname)) {
    return "validation.required";
  }
  if (!/^[a-zA-Z0-9]*$/.test(branchname)) {
    return "Only alpha numerics are allowed.";
  }
  if (branchname.length > 50) {
    return "For branch name maximum of 50 characters will be allowed.";
  }
  return "";
};

const validateWithdrawnAmount = (amoundWithdrawn) => {
  if (isEmptyString(amoundWithdrawn)) {
    return "validation.required";
  }
  if (!/^[0-9]*$/.test(amoundWithdrawn)) {
    return "Only numbers are allowed.";
  }
  return "";
};

const validateIBAN = (iban) => {
  if (isEmptyString(iban)) {
    return "validation.required";
  }

  if (!/^[0-9]*$/.test(iban)) {
    return "Only numbers are allowed.";
  }
  if (iban.length > 23) {
    return "For IBAN maximum of 23 digits will be allowed.";
  }
  return "";
};

const validateCPassword = (cpassword, password) => {
  if (isEmptyString(cpassword)) {
    return "validation.required";
  }

  if (password === cpassword) {
    return "";
  }
  return "validation.different_password";
};

const validateEmptyColumn = (title) => {
  if (isEmptyString(title)) {
    return "validation.required";
  }
  if (title.length > 100) {
    return "validation.err_max100_char";
  }
  return "";
};

const validateDescription = (title, fieldName) => {
  if (isEmptyString(title) || !title) {
    return "validation.required";
  }
  if (title.length > 500) {
    return "validation.err_max500_char";
  }
  return "";
};

const validateAddress = (text, fieldName) => {
  if (isEmptyString(text)) {
    return "validation.required";
  }

  if (text?.length > 250) {
    return "validation.err_max250_char";
  }
  return "";
};

const validateAmenities = (text, fieldName) => {
  if (isEmptyString(text)) {
    return "validation.required";
  }
  if (!/^[a-zA-Z\s]+$/.test(text)) {
    return "Only characters are allowed.";
  }
  if (text.length > 100) {
    return "validation.err_max100_char";
  }
  return "";
};

const validTermRule = (text, fieldName) => {
  if (isEmptyString(text) || !text) {
    return "validation.required";
  }
  if (text.length > 100) {
    return "validation.err_max100_char";
  }
  return "";
};

const validateTitle = (text, fieldName) => {
  if (isEmptyString(text)) {
    return `Enter ${fieldName}`;
  }
  if (!/^[a-zA-Z0-9. ]*$/.test(text)) {
    return "Only alphanumeric, periods, and spaces are allowed.";
  }
  if (text.length < 3 || text.length > 100) {
    return `${fieldName} must be >=3 and <=100 characters.`;
  }
  return "";
};

const validateNumber = (text) => {
  if (text === "" || !text) {
    return "validation.required";
  }

  if (isNaN(text) || Number(text) < 0) {
    return "validation.positive_num_only";
  }

  if (/^\d+(\.\d+)?$/.test(text)) {
    return "validation.numeriac_num";
  }

  return "";
};

const validateCommonBox = (text) => {
  if (text === "") {
    return "validation.required";
  }
  if (isNaN(text) || Number(text) < 0) {
    return "The Number Must be a Positive Number";
  }
  if (!/^\d+(\.\d+)?$/.test(text)) {
    return "Please enter only numeric value";
  }
  if (text === 0) {
    return "Please Enter Valid Number";
  }
  return "";
};

function validateImage(file, maxSize, allowedExtensions) {
  return new Promise((resolve, reject) => {
    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      reject({ error: "validation.invalid_file_upload" });
      return;
    }

    // Check the file extension
    const extension = file.name.split(".").pop();
    if (!allowedExtensions.includes(extension.toLowerCase())) {
      reject({
        error: "validation.invalid_extension",
        replaceArray: [extension],
      });
      return;
    }

    // Read the file
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      // Check the image size
      img.onload = () => {
        const fileSize = file.size;

        if (fileSize > maxSize) {
          reject({
            error: "validation.invalid_file_size",
            replaceArray: [`${maxSize / (1024 * 1024)}MB`],
          });
        } else {
          resolve("");
        }
      };
    };
  });
}

const validatePasswordPolicy = (password, first_name, last_name) => {
  if (isEmptyString(password)) {
    return "validation.required";
  }

  if (password.length < 8) {
    return "validation.min_password_length_8chars";
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

  if (!passwordRegex.test(password)) {
    return "validation.password_contains_err";
  }

  // Check if password is in dictionary
  if (passwordDictionary.includes(password.toLowerCase())) {
    return "validation.common_password";
  }

  if (
    (first_name && password.toLowerCase().includes(first_name.toLowerCase())) ||
    (last_name && password.toLowerCase().includes(last_name.toLowerCase()))
  ) {
    return "validation.password_fname_lname";
  }

  return "";
};

const dateDifference = (start_date, end_date) => {
  if (start_date !== "" && end_date !== "") {
    let startDate = moment(start_date);
    let endDate = moment(end_date);
    if (startDate.isSameOrBefore(endDate)) return { error: "" };
    return {
      error: "validation.invalid_date_range",
      replaceArray: ["Start date", "end date"],
    };
  }
  return { error: "" };
};

const dyanmicTranslation = (err_message, replace_array) => {
  if (err_message === "" || replace_array.length === 0) {
    return "";
  } else {
    let formattedErrorMessage = err_message;
    replace_array.forEach((element, index) => {
      formattedErrorMessage = formattedErrorMessage.replace(
        `{${index}}`,
        element
      );
    });
    return formattedErrorMessage;
  }
};

const validDropdownList = (dropdown_list, dropdown_name) => {
  if (dropdown_list && dropdown_list.length === 0)
    return {
      error: "validation.invalid_dropdown_items",
      replaceArray: [dropdown_name],
    };
  else
    return {
      error: "",
    };
};

const validateMultiselectDropdown = (selectedOptions) => {
  if (selectedOptions.length === 0) {
    return "validation.required";
  }
  return "";
};

const validateBankCode = (bankCode) => {
  if (isEmptyString(bankCode)) return "validation.required";

  // Remove any spaces, hyphens, and convert to uppercase
  bankCode = bankCode.replace(/[\s-]+/g, "").toUpperCase();

  // Check if the bank code is a valid SWIFT code
  let swiftPattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  if (swiftPattern.test(bankCode)) {
    return "";
  }

  // Check if the bank code is a valid sort code
  let sortPattern = /^\d{6}$/;
  if (sortPattern.test(bankCode)) {
    return "";
  }

  // If neither SWIFT code nor sort code pattern matched, return false
  return "validation.invalid_bank_code";
};

const validateBankRoute = (bankCode) => {
  if (isEmptyString(bankCode)) return "validation.required";

  // Remove any spaces, hyphens, and convert to uppercase
  bankCode = bankCode.replace(/[\s-]+/g, "").toUpperCase();

  // Define the regular expressions to detect the code type
  let routeRegex = /^\d{9}$/;
  let ifscRegex = /^[A-Z]{4}\d{7}$/;
  let bsbRegex = /^\d{6}$/;

  // Check the code type based on the input format
  if (routeRegex.test(bankCode)) {
    return ""; // Valid Route/ABA/FedWire code
  } else if (ifscRegex.test(bankCode)) {
    return ""; // Valid IFSC code
  } else if (bsbRegex.test(bankCode)) {
    return ""; // Valid BSB code
  }

  return "validation.invalid_bank_route"; // Invalid code
};

const validateSameNames = (name1, name2) => {
  if (isEmptyString(name1)) return "validation.required";

  // Remove leading and trailing whitespace and convert to lowercase
  name1 = name1.trim().toLowerCase();
  name2 = name2.trim().toLowerCase();

  // Compare the names
  if (name1 === name2) return "";
  else return "validation.not_same_name";
};

const validateOptionalDescriptionFor500Chars = (title) => {
  if (!isEmptyString(title) && title) {
    if (title.length > 500) {
      return "validation.err_max500_char";
    }
  }
  return "";
};

const validateSubject = (text, fieldName) => {
  if (isEmptyString(text) || !text) {
    return "validation.required";
  }

  const regex = /^[a-zA-Z\s]*$/;
  if (!regex.test(text)) {
    return "validation.invalid_input";
  }

  if (text.length > 200) {
    return "validation.err_max200_char";
  }
  return "";
};

//DO NOT DELETE THIS!
const validateMessageDescription = (title, fieldName) => {
  if (isEmptyString(title) || !title) {
    return "validation.required";
  }
  if (title.length > 400) {
    return "validation.err_max400_char";
  }
  return "";
};

const validateOptionalfields = (text, fieldName) => {
  const regex = /^[a-zA-Z\s]*$/;
  if (!regex.test(text)) {
    return "validation.invalid_input";
  }
  if (text.length > 100) {
    return "validation.err_max100_char";
  }
  return "";
};

const formatFloatValue = (value) => {
  let floatValue = parseFloat(value);
  if (isNaN(floatValue)) {
    return ""; // Return empty string for invalid input
  }

  if (Number.isInteger(floatValue)) {
    return floatValue.toLocaleString("en-US"); // Format without decimal places
  }

  let formattedValue = floatValue.toLocaleString("en-US", {
    minimumFractionDigits: 2, // Ensure two decimal places
    maximumFractionDigits: 2,
  });

  return formattedValue;
};

const validateNaturalNumber = (text) => {
  if (text === "" || !text) {
    return "validation.required";
  }
  if (isNaN(text) || Number(text) < 0) {
    return "validation.positive_num_only";
  }
  if (!/^[1-9][0-9]*$/.test(text)) {
    return "validation.numeriac_num";
  }
};

const validateNaturalNumberForZIPCODE = (text) => {
  if (text === "" || !text) {
    return "validation.required";
  }
  const zipCodePattern = /^[a-zA-Z0-9 -]{2,15}$/;
  if (!zipCodePattern.test(text)) {
    return "validation.invalid_zip";
  }
  // If the text matches the ZIP code pattern, it's valid.
  // You can add additional validation or processing here if needed.
};

const validateMessage = (text, fieldName) => {
  if (isEmptyString(text) || !text) {
    return "validation.required";
  }
  return "";
};

const helper = {
  formatFloatValue,
  isEmptyString,
  isValidLength,
  validateMailId,
  validateNumber,
  validateBankName,
  validateEmiratesId,
  validateMobileNo,
  validateCountryCode,
  validateDate,
  validateCard,
  validateMemberId,
  validateTrafficFileNumber,
  validateTCFNumber,
  validateName,
  validateLandline,
  validateAlternateNo,
  validatePOBox,
  validateBankAccountNumber,
  validateWithdrawnBankName,
  validateBankBranchNaame,
  validateWithdrawnAmount,
  validateIBAN,
  validateCPassword,
  validateDropdown,
  validateFee,
  validateResetPassword,
  validateEmptyColumn,
  validateDescription,
  validateAddress,
  validateAmenities,
  validTermRule,
  validateTitle,
  validateCommonBox,
  validateOnlyDate,
  validateImage,
  validatePasswordPolicy,
  dyanmicTranslation,
  dateDifference,
  validDropdownList,
  // validProspectEmail,
  validateAccomodation,
  validateMultiselectDropdown,
  validateBankCode,
  validateBankRoute,
  validateSameNames,
  validateOptionalDescriptionFor500Chars,
  validateSubject,
  validateMessageDescription,
  validateOptionalfields,
  validateNaturalNumber,
  validateNaturalNumberForZIPCODE,
  validateMessage,
};

export default helper;
