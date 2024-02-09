import { DATE_FORMATS } from "Constants/Constants";
import moment from "moment";

export const generatePassword = (length) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "01234567890123456789";
  const symbols = "!@#$%^&*()_+|}{[]:;?><,./-=";

  const allChars = upper + lower + numbers + symbols;
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomChar = allChars[getRandomIntInclusive(0, allChars.length)];
    password += randomChar;
  }

  return password; // set the password state to the generated password
};

export const SetDynamicEndpoint = (endPoint, args = []) => {
  for (let i = 0; i < args.length; i++) {
    endPoint = endPoint.replace("{" + i + "}", args[i]);
  }
  return endPoint;
};

// Method to set permissions
export const SetModulePermissions = (
  moduleName,
  permissions,
  permission_type
) => {
  let modulePermissions = [...permissions];
  let module = modulePermissions.find((x) => x.module_name === moduleName);
  let hasAccess;
  if (module) {
    hasAccess = module.access_levels.find(
      (y) => y.permission_name === permission_type
    );
  }
  if (hasAccess) {
    return hasAccess.status === 1 ? true : false;
  }
  return false;
};

export const getDateFormats = (currentDate, options) => {
  const dateString = currentDate
    .toLocaleDateString("en-US", options)
    .replace(",", "")
    .replace(",", "")
    .replace("at", "");
  return dateString;
};

export const formatDuration = (videoduration) => {
  const durationInSeconds = videoduration;
  const duration = moment.duration(durationInSeconds, "seconds");
  const formattedDuration = moment
    .utc(duration.asMilliseconds())
    .format("mm:ss");
  // Output: 00:14

  return formattedDuration;
};

export const dateFormat = (date, format = DATE_FORMATS.DMY) => {
  return moment(new Date(date)).format(format);
};

export const customFilterForSelect = (option, searchText) => {
  const label = option.label || "";
  return label.toString().toLowerCase().includes(searchText.toLowerCase());
};

export const truncateText = (text, maxLength) => {
  if (text?.length <= maxLength) {
    return text;
  }
  return text?.slice(0, maxLength) + "...";
};

export const addStateToUrl = (
  current_url,
  new_url,
  previous_data,
  current_data
) => {
  window.history.pushState(current_data, "", new_url);
};

const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const disableDates = (date, dateValue, noOfNights = 30) => {
  if (!dateValue) return false; // No date selected, all dates enabled
  if (dateValue) {
    const startDate = new Date(dateValue);
    const endDate = new Date(dateValue);
    endDate.setDate(endDate.getDate() + noOfNights);
    const openDate = new Date(dateValue);
    openDate.setDate(startDate.getDate() - noOfNights); // Previous 30 days from the selected date

    return (
      (date < startDate || (date < endDate && !isSameDay(date, dateValue))) &&
      date > openDate
    );
  }
};

export const removeHtmlTags = (input) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = input;
  return tempElement.textContent || "";
};

export const getFirstTwoSentences = (input) => {
  const sentences = input.split(/[\.\?\!]\s+/);
  return sentences.slice(0, 2).join(". ") + ".";
};

export const navigateToWhatsApp = (number) => {
  const whatsappLink = `https://api.whatsapp.com/send?phone=${number}`;

  const newTab = window.open(whatsappLink, "_blank");
  if (newTab?.location?.href) {
    newTab.location.replace(whatsappLink);
  }
};

export const emailInquiry = () => {
  //const recipientEmail = 'example@example.com'; // Replace with the recipient's email address
  const subject = "Finding the property"; // Replace with the subject of the email

  //uncomment this for email content
  // const body =
  //   "Hello, I would like to share apartment with you: " +
  //   window.location.href; // Replace with the body of the email

  // const emailContent = `mailto:info@hotelapartments.com?subject=${encodeURIComponent(
  //   subject
  // )}&body=${encodeURIComponent(body)}`;

  const emailContent = `mailto:info@hotelapartments.com?subject=${encodeURIComponent(
    subject
  )}`;

  window.location.href = emailContent;
};

//More secure way to generate random number
const getRandomIntInclusive = (min, max) => {
  const crypto = window.crypto || window.msCrypto;
  // Generate a random 32-bit unsigned integer
  const randomUint32 = new Uint32Array(1);
  crypto.getRandomValues(randomUint32);

  // Map the 32-bit integer to the desired range
  const range = max - min + 1;
  const randomValueInRange = randomUint32[0] % range;

  return min + randomValueInRange;
};
