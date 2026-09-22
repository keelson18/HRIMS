const rawAppName = "HRIMS";
const rawAppTitle = "HRIMS · Human Resource Information System";

const APP_NAME_PLACEHOLDER = "{" + "{APP_NAME}}";
const APP_TITLE_PLACEHOLDER = "{" + "{APP_TITLE}}";

export const APP_NAME =
  rawAppName === APP_NAME_PLACEHOLDER ? "hrims" : rawAppName;

export const APP_TITLE =
  rawAppTitle === APP_TITLE_PLACEHOLDER
    ? "HRIMS · Human Resource Information System"
    : rawAppTitle;
