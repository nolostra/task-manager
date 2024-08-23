const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validate = (group, name, value, list = {}) => {
  if (group === "signup") {
    switch (name) {
      case "fname": {
        if (!value) return "This field is required";
        return null;
      }
      case "email": {
        if (!value) return "This field is required";
        if (!isValidEmail(value)) return "Please enter a valid email address";
        return null;
      }
      case "password": {
        if (!value) return "This field is required";
        return null;
      }
      case "confirmPassword": {
        if (!value) return "This field is required";
        if (value.length < 4) return "Password should be at least 4 characters long";
        if (value !== list.password) return "Passwords do not match"; // Check if passwords match using list.password
        return null;
      }
      default:
        return null;
    }
  } else if (group === "login") {
    switch (name) {
      case "email": {
        if (!value) return "This field is required";
        if (!isValidEmail(value)) return "Please enter a valid email address";
        return null;
      }
      case "password": {
        if (!value) return "This field is required";
        return null;
      }
      default:
        return null;
    }
  } else if (group === "task") {
    switch (name) {
      case "description": {
        if (!value) return "This field is required";
        if (value.length > 100) return "Max. limit is 100 characters.";
        return null;
      }
      case "title": {
        if (!value) return "This field is required";
        if (value.length > 50) return "Max. limit is 50 characters.";
        return null;
      }
      default:
        return null;
    }
  } else {
    return null;
  }
};

const validateManyFields = (group, list) => {
  const errors = [];
  for (const field in list) {
    const err = validate(group, field, list[field], list);
    if (err) errors.push({ field, err });
  }
  return errors;
};

export default validateManyFields;
