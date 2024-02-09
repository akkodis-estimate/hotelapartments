let params = {
  page_number: 1,
  page_size: 10,
  sort_column: "",
  sort_direction: "",
  // Filters: "",
  search_text: "",
};

let sortingColumn = {
  column: "id", // Id by default
  direction: "asc", // asc by default;
};

export const sortColumn = (event) => {
  let parameters = { ...params };
  const column = event.currentTarget.dataset.sortcolumn;
  const sorting = sortingColumn;
  const isActiveColumn = sortingColumn.column === column;
  if (!isActiveColumn) {
    sorting.column = column;
    sorting.direction = "asc";
  } else {
    sorting.direction = sorting.direction === "asc" ? "desc" : "asc";
  }
  parameters.sort_column = sorting.column;
  parameters.sort_direction = sorting.direction;
  parameters.page_number = 1;
  return parameters;
};

export const createParams = (filters) => {
  let parameters = { ...params };
  for (let key in filters) {
    if (key) {
      let obj = {};
      parameters.Filters = parameters.Filters ? parameters.Filters : [];
      if (key !== "All") {
        obj.key = key;
        obj.value = filters[key];
        obj.condition = "=";
        parameters.Filters.push(obj);
      }
    }
  }
  if (parameters.Filters && parameters.Filters.length > 0) {
    parameters.Filters = JSON.stringify(parameters.Filters);
  }

  return parameters;
};

//for custom dropdowns filter
export const dropdown_filters_handler = (key, value, filters, condition = "=") => {
  let obj = {};
  let existing_filter = filters?.find(x => x.key === key);
  if (existing_filter) {
    filters.map(item => {
      if (item.key === key) {
        item.value = value;
      }
      return item;
    });
  }
  else {
    obj.key = key;
    obj.value = value;
    obj.condition = condition;
    filters?.push(obj);
  }

  return filters;
}


export const range_filters_handler = (key, value, start_value, end_value, filters, condition = "between") => {
  let obj = {};
  let existing_filter = filters?.find(x => x.key === key);
  if (existing_filter) {
    filters.map(item => {
      if (item.key === key) {
        item.value = value;
        item.start_value = start_value;
        item.end_value = end_value;
      }
      return item;
    });
  }
  else {
    obj.key = key;
    obj.value = value;
    obj.start_value = start_value;
    obj.end_value = end_value;
    obj.condition = condition;
    filters?.push(obj);
  }

  return filters;
}